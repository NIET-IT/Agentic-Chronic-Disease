
import pandas as pd
import joblib
import matplotlib.pyplot as plt

from pathlib import Path

MODEL_FILE = Path("models/heart_disease_logistic_regression.joblib")
OUTPUT_FILE = Path("docs/heart_disease_feature_importance.png")

FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope",
    "ca", "thal"
]


def main():
    if not MODEL_FILE.exists():
        raise FileNotFoundError(
            f"Model not found: {MODEL_FILE}. Run python train_cad.py first."
        )

    model = joblib.load(MODEL_FILE)

    # Retrieve coefficients from the fitted Logistic Regression pipeline
    classifier = model.named_steps["classifier"]
    coefficients = classifier.coef_[0]

    importance = pd.DataFrame({
        "Feature": FEATURES,
        "Coefficient": coefficients,
        "Absolute_Coefficient": abs(coefficients)
    })

    importance = importance.sort_values(
        "Absolute_Coefficient",
        ascending=True
    )

    print("\nLOGISTIC REGRESSION COEFFICIENTS")
    print(importance.to_string(index=False))

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    plt.figure(figsize=(10, 7))
    plt.barh(
        importance["Feature"],
        importance["Coefficient"]
    )
    plt.axvline(0, linestyle="--")
    plt.xlabel("Coefficient (standardized input features)")
    plt.ylabel("Feature")
    plt.title("Heart Disease Model — Logistic Regression Coefficients")
    plt.tight_layout()
    plt.savefig(OUTPUT_FILE, dpi=150)

    print("\nChart saved to:", OUTPUT_FILE.resolve())
    plt.show()


if __name__ == "__main__":
    main()
