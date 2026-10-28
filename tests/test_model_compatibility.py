"""Unit tests for ML model compatibility, validation, and defensive defaults."""

import unittest
from pathlib import Path
from backend.services.diabetes_service import diabetes_service
from backend.services.heart_disease_service import (
    heart_disease_service,
    HeartDiseasePredictionService,
)


class TestModelCompatibility(unittest.TestCase):
    def test_cad_service_supports_new_model_artifact(self):
        new_artifact_path = Path("models/heart_disease_new.joblib")
        if new_artifact_path.exists():
            new_service = HeartDiseasePredictionService(model_path=new_artifact_path)
            sample_input = {
                "age": 62.0,
                "sex": 1,
                "cp": 2,
                "trestbps": 140.0,
                "chol": 240.0,
                "thalach": 145.0,
            }
            res = new_service.predict(sample_input)
            self.assertIn("probability", res)
            self.assertIn("prediction", res)
            self.assertIn("risk_tier", res)
            self.assertTrue(0.0 <= res["probability"] <= 1.0)

    def test_cad_service_supports_default_pipeline_artifact(self):
        sample_input = {
            "age": 55.0,
            "sex": 0,
            "cp": 3,
            "trestbps": 125.0,
            "chol": 210.0,
            "thalach": 160.0,
        }
        res = heart_disease_service.predict(sample_input)
        self.assertIn("probability", res)
        self.assertIn("prediction", res)
        self.assertTrue(0.0 <= res["probability"] <= 1.0)

    def test_diabetes_service_validation_missing_required_feature(self):
        # Omit required feature 'BMI'
        incomplete_input = {
            "HighBP": 1,
            "HighChol": 0,
            "Smoker": 0,
            "PhysActivity": 1,
            "Sex": 1,
            "Age": 8,
        }
        with self.assertRaises(ValueError) as ctx:
            diabetes_service.predict(incomplete_input)
        self.assertIn("BMI", str(ctx.exception))

    def test_cad_service_validation_missing_required_feature(self):
        # Omit required feature 'age'
        incomplete_input = {
            "sex": 1,
            "cp": 2,
            "trestbps": 130.0,
            "chol": 220.0,
            "thalach": 150.0,
        }
        with self.assertRaises(ValueError) as ctx:
            heart_disease_service.predict(incomplete_input)
        self.assertIn("age", str(ctx.exception))

    def test_diabetes_service_clinical_target_note_present(self):
        sample_input = {
            "HighBP": 0,
            "HighChol": 0,
            "BMI": 23.5,
            "Smoker": 0,
            "PhysActivity": 1,
            "Sex": 0,
            "Age": 5,
        }
        res = diabetes_service.predict(sample_input)
        self.assertIn("clinical_target_note", res)
        self.assertIn("prediabetes", res["clinical_target_note"])


if __name__ == "__main__":
    unittest.main()
