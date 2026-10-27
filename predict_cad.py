
import pandas as pd
import joblib

from pathlib import Path

MODEL_FILE = Path("models/heart_disease_logistic_regression.joblib")

FEATURES = [
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


def main():
    if not MODEL_FILE.exists():
        print("Model file not found:", MODEL_FILE.resolve())
        print("Run python train_cad.py first.")
        return

    model = joblib.load(MODEL_FILE)

    # Illustrative sample values, not a real patient's data.
    sample = {
        "age": 55,
        "sex": 1,
        "cp": 2,
        "trestbps": 130,
        "chol": 240,
        "fbs": 0,
        "restecg": 1,
        "thalach": 150,
        "exang": 0,
        "oldpeak": 1.0,
        "slope": 2,
        "ca": 0,
        "thal": 3,
    }

    input_df = pd.DataFrame([sample], columns=FEATURES)

    prediction = int(model.predict(input_df)[0])
    probability = float(model.predict_proba(input_df)[0][1])

    print("\nHEART DISEASE MODEL TEST")
    print("-" * 35)
    print("Prediction:", prediction)
    print(f"Model-estimated positive-class probability: {probability:.2%}")

    if prediction == 1:
        print("Output: Disease indicator predicted by the model.")
    else:
        print("Output: No disease indicator predicted by the model.")

    print("\nThis is an educational model output, not a medical diagnosis.")


if __name__ == "__main__":
    main()