"""Unit tests for Agentic Clinical Decision Support rules and multi-condition synergy."""

import unittest
from backend.services.diabetes_service import diabetes_service
from backend.services.heart_disease_service import heart_disease_service
from backend.agents.decision_agent import decision_agent


class TestDecisionSupportAgent(unittest.TestCase):
    def setUp(self):
        self.high_risk_diabetes_features = {
            "HighBP": 1,
            "HighChol": 1,
            "CholCheck": 1,
            "BMI": 36.5,  # Trigger severe obesity alert
            "Smoker": 1,
            "Stroke": 0,
            "HeartDiseaseorAttack": 1,  # Trigger vascular history alert
            "PhysActivity": 0,  # Sedentary
            "Fruits": 0,
            "Veggies": 0,
            "HvyAlcoholConsump": 0,
            "AnyHealthcare": 1,
            "NoDocbcCost": 0,
            "GenHlth": 4,
            "MentHlth": 5.0,
            "PhysHlth": 15.0,
            "DiffWalk": 1,
            "Sex": 1,
            "Age": 11,
            "Education": 4,
            "Income": 4,
        }

        self.high_risk_cad_features = {
            "age": 67.0,
            "sex": 1,
            "cp": 1,  # Typical angina
            "trestbps": 165.0,  # Severe stage 2 hypertension
            "chol": 280.0,
            "fbs": 1,
            "restecg": 1,
            "thalach": 120.0,
            "exang": 1,  # Exercise induced angina
            "oldpeak": 2.5,  # Marked ST depression
            "slope": 2,
            "ca": 2,  # Multi-vessel
            "thal": 7,
        }

    def test_diabetes_decision_agent(self):
        pred = diabetes_service.predict(self.high_risk_diabetes_features)
        decision = decision_agent.evaluate_diabetes_case(pred, self.high_risk_diabetes_features)

        self.assertEqual(decision["condition"], "Diabetes")
        self.assertIn("urgency", decision)
        self.assertGreater(len(decision["clinical_alerts"]), 0)
        self.assertGreater(len(decision["recommended_diagnostic_workup"]), 0)
        self.assertGreater(len(decision["lifestyle_action_plan"]), 0)
        self.assertGreater(len(decision["clinical_discussion_points"]), 0)
        self.assertGreater(len(decision["reasoning_trace"]), 0)

        # Confirm obesity and vascular history alerts triggered
        alert_titles = [a["title"] for a in decision["clinical_alerts"]]
        self.assertTrue(any("Obesity" in t for t in alert_titles))
        self.assertTrue(any("Vascular" in t or "Metabolic" in t for t in alert_titles))

    def test_cad_decision_agent(self):
        pred = heart_disease_service.predict(self.high_risk_cad_features)
        decision = decision_agent.evaluate_heart_disease_case(pred, self.high_risk_cad_features)

        self.assertEqual(decision["condition"], "Coronary Heart Disease")
        self.assertIn("urgency", decision)
        self.assertGreater(len(decision["clinical_alerts"]), 0)

        # Confirm hypertension and ST depression alerts triggered
        alert_titles = [a["title"] for a in decision["clinical_alerts"]]
        self.assertTrue(any("Hypertension" in t for t in alert_titles))
        self.assertTrue(any("ST Segment Depression" in t for t in alert_titles))

    def test_comprehensive_synergy_agent(self):
        pred_dia = diabetes_service.predict(self.high_risk_diabetes_features)
        pred_cad = heart_disease_service.predict(self.high_risk_cad_features)

        res = decision_agent.evaluate_comprehensive_case(
            pred_dia,
            pred_cad,
            {
                "diabetes": self.high_risk_diabetes_features,
                "heart_disease": self.high_risk_cad_features,
            },
        )

        self.assertIn("overall_urgency", res)
        self.assertIn("cardiometabolic_synergy_alerts", res)
        self.assertGreater(len(res["cardiometabolic_synergy_alerts"]), 0)
        self.assertGreater(len(res["integrated_management_plan"]), 0)


if __name__ == "__main__":
    unittest.main()
