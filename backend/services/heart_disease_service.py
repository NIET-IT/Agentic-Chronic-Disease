from pathlib import Path
from typing import Dict, Any, List, Optional
import joblib
import numpy as np
import pandas as pd

CAD_MODEL_PATH = Path("models/heart_disease_logistic_regression.joblib")

CAD_FEATURE_NAMES = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal",
]

CAD_FEATURE_METADATA: Dict[str, Dict[str, Any]] = {
    "age": {
        "label": "Age",
        "unit": "years",
        "description": "Patient age in years",
        "category": "demographic",
    },
    "sex": {
        "label": "Sex",
        "unit": "",
        "description": "1 = Male, 0 = Female",
        "category": "demographic",
    },
    "cp": {
        "label": "Chest Pain Type",
        "unit": "",
        "description": "1: Typical Angina, 2: Atypical Angina, 3: Non-Anginal, 4: Asymptomatic",
        "category": "symptom",
    },
    "trestbps": {
        "label": "Resting Blood Pressure",
        "unit": "mm Hg",
        "description": "Resting blood pressure upon clinical assessment",
        "category": "vital",
    },
    "chol": {
        "label": "Serum Cholesterol",
        "unit": "mg/dl",
        "description": "Serum cholesterol level",
        "category": "laboratory",
    },
    "fbs": {
        "label": "Fasting Blood Sugar > 120",
        "unit": "",
        "description": "1 = True (>120 mg/dl), 0 = False",
        "category": "laboratory",
    },
    "restecg": {
        "label": "Resting ECG Results",
        "unit": "",
        "description": "0: Normal, 1: ST-T wave abnormality, 2: Left ventricular hypertrophy",
        "category": "diagnostic",
    },
    "thalach": {
        "label": "Maximum Heart Rate Achieved",
        "unit": "bpm",
        "description": "Maximum heart rate achieved during exercise stress",
        "category": "functional",
    },
    "exang": {
        "label": "Exercise-Induced Angina",
        "unit": "",
        "description": "1 = Yes, 0 = No",
        "category": "symptom",
    },
    "oldpeak": {
        "label": "ST Depression (Oldpeak)",
        "unit": "mm",
        "description": "ST depression induced by exercise relative to rest",
        "category": "diagnostic",
    },
    "slope": {
        "label": "Peak Exercise ST Slope",
        "unit": "",
        "description": "1: Upsloping, 2: Flat, 3: Downsloping",
        "category": "diagnostic",
    },
    "ca": {
        "label": "Fluoroscopy Major Vessels",
        "unit": "count",
        "description": "Number of major vessels (0-3) colored by fluoroscopy",
        "category": "diagnostic",
    },
    "thal": {
        "label": "Thallium Stress Scintigraphy",
        "unit": "",
        "description": "3: Normal, 6: Fixed defect, 7: Reversible defect",
        "category": "diagnostic",
    },
}


class HeartDiseasePredictionService:
    def __init__(self, model_path: Path = CAD_MODEL_PATH):
        self.model_path = model_path
        self._model = None
        self._imputer = None
        self._scaler = None
        self._classifier = None
        self._load_model()

    def _load_model(self) -> None:
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Heart disease model not found at {self.model_path.resolve()}"
            )
        self._model = joblib.load(self.model_path)
        self._imputer = self._model.named_steps["imputer"]
        self._scaler = self._model.named_steps["scaler"]
        self._classifier = self._model.named_steps["classifier"]

    def predict(
        self,
        features: Dict[str, Any],
        threshold: float = 0.50,
    ) -> Dict[str, Any]:
        """
        Evaluate patient data against the trained Heart Disease Logistic Regression pipeline.
        Returns prediction, probability, risk tier, and feature contribution impacts.
        """
        row = [features[col] for col in CAD_FEATURE_NAMES]
        input_df = pd.DataFrame([row], columns=CAD_FEATURE_NAMES)

        probabilities = self._model.predict_proba(input_df)[0]
        prob_positive = float(probabilities[1])

        predicted_class = int(prob_positive >= threshold)

        if prob_positive < 0.25:
            risk_tier = "Low"
            risk_color = "#10b981"
        elif prob_positive < 0.55:
            risk_tier = "Moderate"
            risk_color = "#f59e0b"
        else:
            risk_tier = "High"
            risk_color = "#ef4444"

        # Transform inputs through imputer and scaler
        imputed = self._imputer.transform(input_df)
        scaled_values = self._scaler.transform(imputed)[0]
        coefficients = self._classifier.coef_[0]

        feature_contributions: List[Dict[str, Any]] = []
        for i, col in enumerate(CAD_FEATURE_NAMES):
            raw_val = float(features[col])
            scaled_val = float(scaled_values[i])
            coef = float(coefficients[i])
            impact = coef * scaled_val

            meta = CAD_FEATURE_METADATA.get(col, {})
            feature_contributions.append({
                "feature": col,
                "label": meta.get("label", col),
                "unit": meta.get("unit", ""),
                "category": meta.get("category", "general"),
                "value": raw_val,
                "coefficient": coef,
                "scaled_value": round(scaled_val, 3),
                "impact": round(impact, 4),
                "direction": "Risk Increasing" if impact > 0 else "Protective",
            })

        feature_contributions.sort(key=lambda x: abs(x["impact"]), reverse=True)

        return {
            "condition": "Coronary Heart Disease",
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
        }


# Global singleton instance
heart_disease_service = HeartDiseasePredictionService()
