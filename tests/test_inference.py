"""Unit tests for chronic disease model inference and feature attribution services."""

import unittest
from backend.services.diabetes_service import diabetes_service, DIABETES_FEATURE_NAMES
from backend.services.heart_disease_service import heart_disease_service, CAD_FEATURE_NAMES


class TestInferenceServices(unittest.TestCase):
    def setUp(self):
        self.sample_diabetes = {
            "HighBP": 1,
            "HighChol": 1,
            "CholCheck": 1,
            "BMI": 31.0,
            "Smoker": 0,
            "Stroke": 0,
            "HeartDiseaseorAttack": 0,
            "PhysActivity": 1,
            "Fruits": 1,
            "Veggies": 1,
            "HvyAlcoholConsump": 0,
            "AnyHealthcare": 1,
            "NoDocbcCost": 0,
            "GenHlth": 3,
            "MentHlth": 2.0,
            "PhysHlth": 1.0,
            "DiffWalk": 0,
            "Sex": 1,
            "Age": 9,
            "Education": 5,
            "Income": 6,
        }

        self.sample_cad = {
            "age": 58.0,
            "sex": 1,
            "cp": 2,
            "trestbps": 135.0,
            "chol": 245.0,
            "fbs": 0,
            "restecg": 0,
            "thalach": 145.0,
            "exang": 1,
            "oldpeak": 1.4,
            "slope": 2,
            "ca": 1,
            "thal": 3,
        }

    def test_diabetes_prediction_structure(self):
        res = diabetes_service.predict(self.sample_diabetes)
        self.assertIn("probability", res)
        self.assertIn("prediction", res)
        self.assertIn("risk_tier", res)
        self.assertIn("feature_contributions", res)
        self.assertTrue(0.0 <= res["probability"] <= 1.0)
        self.assertIn(res["prediction"], [0, 1])
        self.assertIn(res["risk_tier"], ["Low", "Moderate", "High"])
        self.assertEqual(len(res["feature_contributions"]), len(DIABETES_FEATURE_NAMES))

    def test_diabetes_threshold_customization(self):
        low_thresh = diabetes_service.predict(self.sample_diabetes, threshold=0.10)
        high_thresh = diabetes_service.predict(self.sample_diabetes, threshold=0.95)
        self.assertEqual(low_thresh["prediction"], 1)
        self.assertEqual(high_thresh["prediction"], 0)

    def test_heart_disease_prediction_structure(self):
        res = heart_disease_service.predict(self.sample_cad)
        self.assertIn("probability", res)
        self.assertIn("prediction", res)
        self.assertIn("risk_tier", res)
        self.assertIn("feature_contributions", res)
        self.assertTrue(0.0 <= res["probability"] <= 1.0)
        self.assertIn(res["prediction"], [0, 1])
        self.assertIn(res["risk_tier"], ["Low", "Moderate", "High"])
        self.assertEqual(len(res["feature_contributions"]), len(CAD_FEATURE_NAMES))

    def test_feature_contributions_sorting(self):
        res = diabetes_service.predict(self.sample_diabetes)
        impacts = [abs(f["impact"]) for f in res["feature_contributions"]]
        # Verify sorted descending by absolute impact
        self.assertEqual(impacts, sorted(impacts, reverse=True))


if __name__ == "__main__":
    unittest.main()
