"""Unit and integration tests for database persistence, patient management, and assessment history."""

import unittest
from starlette.testclient import TestClient
from backend.main import app
from backend.db.repository import clinical_repository


class TestPersistenceAndHistory(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_patient_registration_and_retrieval(self):
        patient_payload = {
            "patient_id": "PT-TEST-HIST-01",
            "name": "Jane Doe",
            "age": 52.0,
            "sex": 0,
        }
        resp = self.client.post("/api/v1/patients", json=patient_payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["patient_id"], "PT-TEST-HIST-01")
        self.assertEqual(data["name"], "Jane Doe")

        # Retrieve profile
        get_resp = self.client.get("/api/v1/patients/PT-TEST-HIST-01")
        self.assertEqual(get_resp.status_code, 200)
        get_data = get_resp.json()
        self.assertEqual(get_data["patient_id"], "PT-TEST-HIST-01")
        self.assertEqual(get_data["age"], 52.0)

    def test_patient_not_found(self):
        resp = self.client.get("/api/v1/patients/NON-EXISTENT-ID")
        self.assertEqual(resp.status_code, 404)

    def test_prediction_creates_persisted_assessment(self):
        payload = {
            "patient_id": "PT-PERSIST-01",
            "HighBP": 1,
            "HighChol": 1,
            "CholCheck": 1,
            "BMI": 29.0,
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
            "MentHlth": 0.0,
            "PhysHlth": 0.0,
            "DiffWalk": 0,
            "Sex": 0,
            "Age": 8,
            "Education": 5,
            "Income": 6,
        }
        resp = self.client.post("/api/v1/predict/diabetes", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("assessment_id", data)
        self.assertTrue(data["assessment_id"].startswith("ASM-"))

        # Verify retrieval via history endpoint
        aid = data["assessment_id"]
        hist_resp = self.client.get(f"/api/v1/history/assessments/{aid}")
        self.assertEqual(hist_resp.status_code, 200)
        hist_data = hist_resp.json()
        self.assertEqual(hist_data["assessment_id"], aid)
        self.assertEqual(hist_data["patient_id"], "PT-PERSIST-01")
        self.assertEqual(hist_data["condition"], "Diabetes / Prediabetes")

    def test_list_assessments_with_filters(self):
        resp = self.client.get("/api/v1/history/assessments?limit=10")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("total", data)
        self.assertIn("items", data)
        self.assertGreater(data["total"], 0)

    def test_global_explainability_endpoint(self):
        resp = self.client.get("/api/v1/explainability/summary")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 2)
        conditions = [item["condition"] for item in data]
        self.assertIn("Diabetes / Prediabetes", conditions)
        self.assertIn("Coronary Heart Disease", conditions)

    def test_threshold_simulation_endpoint(self):
        resp = self.client.post("/api/v1/simulate/threshold?probability=0.45&condition=Diabetes")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["calculated_probability"], 0.45)
        self.assertEqual(len(data["simulations"]), 7)


if __name__ == "__main__":
    unittest.main()
