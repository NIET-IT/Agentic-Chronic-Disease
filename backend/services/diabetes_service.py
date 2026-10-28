from pathlib import Path
from typing import Dict, Any, List, Optional
import joblib
import numpy as np
import pandas as pd

DIABETES_MODEL_PATH = Path("models/diabetes_logistic_regression.joblib")

DIABETES_FEATURE_NAMES = [
    "HighBP",
    "HighChol",
    "CholCheck",
    "BMI",
    "Smoker",
    "Stroke",
    "HeartDiseaseorAttack",
    "PhysActivity",
    "Fruits",
    "Veggies",
    "HvyAlcoholConsump",
    "AnyHealthcare",
    "NoDocbcCost",
    "GenHlth",
    "MentHlth",
    "PhysHlth",
    "DiffWalk",
    "Sex",
    "Age",
    "Education",
    "Income",
]

DIABETES_FEATURE_METADATA: Dict[str, Dict[str, Any]] = {
    "HighBP": {
        "label": "High Blood Pressure",
        "description": "Patient has been diagnosed with hypertension",
        "category": "cardiovascular",
    },
    "HighChol": {
        "label": "High Cholesterol",
        "description": "Patient has elevated serum cholesterol",
        "category": "metabolic",
    },
    "CholCheck": {
        "label": "Cholesterol Check",
        "description": "Cholesterol checked in past 5 years",
        "category": "screening",
    },
    "BMI": {
        "label": "Body Mass Index",
        "description": "Calculated BMI (weight/height^2)",
        "category": "lifestyle",
    },
    "Smoker": {
        "label": "Smoking History",
        "description": "Smoked at least 100 cigarettes in lifetime",
        "category": "lifestyle",
    },
    "Stroke": {
        "label": "History of Stroke",
        "description": "History of cerebrovascular accident",
        "category": "vascular",
    },
    "HeartDiseaseorAttack": {
        "label": "Coronary Heart Disease",
        "description": "Coronary heart disease or history of MI",
        "category": "cardiovascular",
    },
    "PhysActivity": {
        "label": "Physical Activity",
        "description": "Engaged in physical activity in past 30 days",
        "category": "lifestyle",
    },
    "Fruits": {
        "label": "Daily Fruit Intake",
        "description": "Consumes fruit >= 1 time/day",
        "category": "dietary",
    },
    "Veggies": {
        "label": "Daily Vegetable Intake",
        "description": "Consumes vegetables >= 1 time/day",
        "category": "dietary",
    },
    "HvyAlcoholConsump": {
        "label": "Heavy Alcohol Consumption",
        "description": ">14 drinks/week for men, >7 for women",
        "category": "lifestyle",
    },
    "AnyHealthcare": {
        "label": "Healthcare Coverage",
        "description": "Has medical insurance / healthcare access",
        "category": "access",
    },
    "NoDocbcCost": {
        "label": "Care Avoidance Due to Cost",
        "description": "Deferred seeing doctor in past 12 months due to cost",
        "category": "access",
    },
    "GenHlth": {
        "label": "General Health Rating",
        "description": "Self-rated general health (1=Excellent, 5=Poor)",
        "category": "general",
    },
    "MentHlth": {
        "label": "Mental Health Days Affected",
        "description": "Days of poor mental health in past 30 days",
        "category": "general",
    },
    "PhysHlth": {
        "label": "Physical Health Days Affected",
        "description": "Days of physical illness/injury in past 30 days",
        "category": "general",
    },
    "DiffWalk": {
        "label": "Mobility Limitation",
        "description": "Difficulty walking or climbing stairs",
        "category": "functional",
    },
    "Sex": {
        "label": "Biological Sex",
        "description": "0 = Female, 1 = Male",
        "category": "demographic",
    },
    "Age": {
        "label": "Age Bracket",
        "description": "Age bracket (1: 18-24 up to 13: 80+)",
        "category": "demographic",
    },
    "Education": {
        "label": "Education Level",
        "description": "Highest level completed (scale 1-6)",
        "category": "demographic",
    },
    "Income": {
        "label": "Income Level",
        "description": "Income bracket (scale 1-8)",
        "category": "demographic",
    },
}


from backend.core.config import DIABETES_MODEL_PATH

DIABETES_DEFAULT_VALUES: Dict[str, float] = {
    "CholCheck": 1.0,
    "Stroke": 0.0,
    "HeartDiseaseorAttack": 0.0,
    "Fruits": 1.0,
    "Veggies": 1.0,
    "HvyAlcoholConsump": 0.0,
    "AnyHealthcare": 1.0,
    "NoDocbcCost": 0.0,
    "GenHlth": 3.0,
    "MentHlth": 0.0,
    "PhysHlth": 0.0,
    "DiffWalk": 0.0,
    "Education": 4.0,
    "Income": 5.0,
}


class DiabetesPredictionService:
    def __init__(self, model_path: Path = DIABETES_MODEL_PATH):
        self.model_path = model_path
        self._model = None
        self._scaler = None
        self._classifier = None
        self._load_model()

    def _load_model(self) -> None:
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Diabetes model file not found at {self.model_path.resolve()}"
            )
        self._model = joblib.load(self.model_path)
        self._scaler = self._model.named_steps["standardscaler"]
        self._classifier = self._model.named_steps["logisticregression"]

    def validate_features(self, features: Dict[str, Any]) -> Dict[str, float]:
        """
        Validate input dictionary, ensuring all required features exist and are numeric.
        Fills optional lifestyle/socioeconomic features with clinical defaults if absent.
        """
        cleaned: Dict[str, float] = {}
        missing = []
        for col in DIABETES_FEATURE_NAMES:
            if col in features and features[col] is not None:
                try:
                    cleaned[col] = float(features[col])
                except (ValueError, TypeError):
                    raise ValueError(f"Feature '{col}' must be a numeric value, got: {features[col]!r}")
            elif col in DIABETES_DEFAULT_VALUES:
                cleaned[col] = DIABETES_DEFAULT_VALUES[col]
            else:
                missing.append(col)

        if missing:
            raise ValueError(f"Missing required diabetes input features: {', '.join(missing)}")

        return cleaned

    def predict(
        self,
        features: Dict[str, Any],
        threshold: float = 0.50,
    ) -> Dict[str, Any]:
        """
        Evaluate patient data against the trained Logistic Regression pipeline.
        Returns prediction, calibrated probability, risk tier, and feature contributions.
        
        Clinical Note:
        The underlying CDC BRFSS dataset target represents diabetes or prediabetes
        versus no diabetes. This model must not be described as a validated prospective
        predictor of future disease onset.
        """
        cleaned_features = self.validate_features(features)

        # Ensure ordered input vector
        row = [cleaned_features[col] for col in DIABETES_FEATURE_NAMES]
        input_df = pd.DataFrame([row], columns=DIABETES_FEATURE_NAMES)

        probabilities = self._model.predict_proba(input_df)[0]
        prob_positive = float(probabilities[1])

        predicted_class = int(prob_positive >= threshold)

        # Risk tiering
        if prob_positive < 0.30:
            risk_tier = "Low"
            risk_color = "#10b981"
        elif prob_positive < 0.60:
            risk_tier = "Moderate"
            risk_color = "#f59e0b"
        else:
            risk_tier = "High"
            risk_color = "#ef4444"

        # Calculate local feature attributions
        # For standard scaler + logistic regression: contribution_i = coef_i * scaled_x_i
        scaled_values = self._scaler.transform(input_df)[0]
        coefficients = self._classifier.coef_[0]

        feature_contributions: List[Dict[str, Any]] = []
        for i, col in enumerate(DIABETES_FEATURE_NAMES):
            raw_val = float(cleaned_features[col])
            scaled_val = float(scaled_values[i])
            coef = float(coefficients[i])
            impact = coef * scaled_val

            meta = DIABETES_FEATURE_METADATA.get(col, {})
            feature_contributions.append({
                "feature": col,
                "label": meta.get("label", col),
                "category": meta.get("category", "general"),
                "value": raw_val,
                "coefficient": coef,
                "scaled_value": round(scaled_val, 3),
                "impact": round(impact, 4),
                "direction": "Risk Increasing" if impact > 0 else "Protective",
            })

        # Sort contributions by absolute impact
        feature_contributions.sort(key=lambda x: abs(x["impact"]), reverse=True)

        return {
            "condition": "Diabetes / Prediabetes",
            "prediction": predicted_class,
            "probability": round(prob_positive, 4),
            "percentage": round(prob_positive * 100, 2),
            "threshold": threshold,
            "risk_tier": risk_tier,
            "risk_color": risk_color,
            "feature_contributions": feature_contributions,
            "top_risk_factors": [
                f for f in feature_contributions if f["impact"] > 0
            ][:5],
            "top_protective_factors": [
                f for f in feature_contributions if f["impact"] < 0
            ][:5],
            "clinical_target_note": (
                "Dataset target represents cross-sectional diabetes or prediabetes "
                "versus no diabetes; this prototype stratifies current risk indicators "
                "and is not a validated prospective predictor of future disease onset."
            ),
        }


# Global singleton instance
diabetes_service = DiabetesPredictionService()

