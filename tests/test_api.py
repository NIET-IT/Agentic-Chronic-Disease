"""Integration tests for FastAPI REST endpoints."""

import unittest
from starlette.testclient import TestClient
from backend.main import app


class TestAPIEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/api/v1/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("diabetes_model", data)
        self.assertIn("heart_disease_model", data)

    def test_metadata_features(self):
        response = self.client.get("/api/v1/metadata/features")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("diabetes", data)
        self.assertIn("heart_disease", data)

    def test_predict_diabetes_endpoint(self):
        payload = {
            "HighBP": 1,
            "HighChol": 0,
            "CholCheck": 1,
            "BMI": 26.5,
            "Smoker": 0,
            "Stroke": 0,
            "HeartDiseaseorAttack": 0,
            "PhysActivity": 1,
            "Fruits": 1,
            "Veggies": 1,
            "HvyAlcoholConsump": 0,
            "AnyHealthcare": 1,
            "NoDocbcCost": 0,
            "GenHlth": 2,
            "MentHlth": 0.0,
            "PhysHlth": 0.0,
            "DiffWalk": 0,
            "Sex": 0,
            "Age": 8,
            "Education": 5,
            "Income": 6,
        }
        response = self.client.post("/api/v1/predict/diabetes", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["condition"], "Diabetes / Prediabetes")
        self.assertIn("probability", data)
        self.assertIn("risk_tier", data)
        self.assertIn("feature_contributions", data)

    def test_decision_support_diabetes_endpoint(self):
        payload = {
            "HighBP": 1,
            "HighChol": 1,
            "CholCheck": 1,
            "BMI": 33.0,
            "Smoker": 1,
            "Stroke": 0,
            "HeartDiseaseorAttack": 0,
            "PhysActivity": 0,
            "Fruits": 0,
            "Veggies": 0,
            "HvyAlcoholConsump": 0,
            "AnyHealthcare": 1,
            "NoDocbcCost": 0,
            "GenHlth": 4,
            "MentHlth": 3.0,
            "PhysHlth": 5.0,
            "DiffWalk": 0,
            "Sex": 1,
            "Age": 10,
            "Education": 4,
            "Income": 4,
        }
        response = self.client.post("/api/v1/decision-support/diabetes", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("prediction", data)
        self.assertIn("decision_support", data)
        self.assertIn("clinical_alerts", data["decision_support"])

    def test_predict_cad_endpoint(self):
        payload = {
            "age": 55.0,
            "sex": 1,
            "cp": 2,
            "trestbps": 130.0,
            "chol": 240.0,
            "fbs": 0,
            "restecg": 1,
            "thalach": 150.0,
            "exang": 0,
            "oldpeak": 1.0,
            "slope": 2,
            "ca": 0,
            "thal": 3,
        }
        response = self.client.post("/api/v1/predict/heart-disease", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["condition"], "Coronary Heart Disease")
        self.assertIn("probability", data)
        self.assertIn("feature_contributions", data)

    def test_comprehensive_endpoint(self):
        payload = {
            "patient_id": "PT-DEMO-01",
            "diabetes_data": {
                "HighBP": 1,
                "HighChol": 1,
                "CholCheck": 1,
                "BMI": 32.0,
                "Smoker": 1,
                "Stroke": 0,
                "HeartDiseaseorAttack": 0,
                "PhysActivity": 0,
                "Fruits": 0,
                "Veggies": 0,
                "HvyAlcoholConsump": 0,
                "AnyHealthcare": 1,
                "NoDocbcCost": 0,
                "GenHlth": 4,
                "MentHlth": 2.0,
                "PhysHlth": 4.0,
                "DiffWalk": 0,
                "Sex": 1,
                "Age": 10,
                "Education": 4,
                "Income": 5,
            },
            "heart_disease_data": {
                "age": 62.0,
                "sex": 1,
                "cp": 2,
                "trestbps": 145.0,
                "chol": 260.0,
                "fbs": 1,
                "restecg": 1,
                "thalach": 130.0,
                "exang": 1,
                "oldpeak": 2.1,
                "slope": 2,
                "ca": 1,
                "thal": 7,
            },
        }
        response = self.client.post("/api/v1/decision-support/comprehensive", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["patient_id"], "PT-DEMO-01")
        self.assertIn("overall_urgency", data)
        self.assertIn("diabetes_assessment", data)
        self.assertIn("heart_disease_assessment", data)
        self.assertIn("cardiometabolic_synergy_alerts", data)
        self.assertIn("integrated_management_plan", data)


if __name__ == "__main__":
    unittest.main()
