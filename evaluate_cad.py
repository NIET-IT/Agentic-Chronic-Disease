
import pandas as pd
import joblib
import matplotlib.pyplot as plt

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    confusion_matrix,
    ConfusionMatrixDisplay,
    classification_report,
    accuracy_score,
    roc_auc_score
)

DATA_FILE = Path("data/processed/cleveland_heart_disease_cleaned.csv")
MODEL_FILE = Path("models/heart_disease_logistic_regression.joblib")
OUTPUT_FILE = Path("docs/heart_disease_confusion_matrix.png")


def main():
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_FILE}")

    if not MODEL_FILE.exists():
        raise FileNotFoundError(
            f"Model not found: {MODEL_FILE}. Run train_cad.py first."
        )

    df = pd.read_csv(DATA_FILE)

    X = df.drop(columns=["num", "heart_disease"])
    y = df["heart_disease"]

    # Recreate the same test split used in train_cad.py
    _, X_test, _, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    model = joblib.load(MODEL_FILE)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    print("Accuracy:", round(accuracy_score(y_test, y_pred), 4))
    print("ROC-AUC:", round(roc_auc_score(y_test, y_prob), 4))

    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            y_pred,
            target_names=["No disease indicated", "Disease indicated"],
            zero_division=0
        )
    )

    cm = confusion_matrix(y_test, y_pred, labels=[0, 1])

    display = ConfusionMatrixDisplay(
        confusion_matrix=cm,
        display_labels=["No disease", "Disease indicated"]
    )

    display.plot(values_format="d")
    plt.title("Heart Disease Model - Confusion Matrix")
    plt.tight_layout()

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    plt.savefig(OUTPUT_FILE, dpi=150)
    print("\nConfusion matrix saved to:", OUTPUT_FILE.resolve())

    plt.show()


if __name__ == "__main__":
    main()
