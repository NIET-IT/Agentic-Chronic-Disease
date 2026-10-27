
import pandas as pd
import joblib

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix
)

# File paths
DATA_FILE = Path("data/processed/cleveland_heart_disease_cleaned.csv")
MODEL_FILE = Path("models/heart_disease_logistic_regression.joblib")

# Load cleaned dataset
df = pd.read_csv(DATA_FILE)

# Separate input features and target
X = df.drop(columns=["num", "heart_disease"])
y = df["heart_disease"]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# Build machine learning pipeline
model = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression(
        max_iter=2000,
        random_state=42
    ))
])

# Train model
print("Training Logistic Regression...")
model.fit(X_train, y_train)

# Predict test results
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

# Evaluate model
print("\n" + "=" * 50)
print("HEART DISEASE MODEL EVALUATION")
print("=" * 50)

print(f"\nTraining records: {len(X_train)}")
print(f"Testing records: {len(X_test)}")

print(f"\nAccuracy : {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred, zero_division=0):.4f}")
print(f"Recall   : {recall_score(y_test, y_pred, zero_division=0):.4f}")
print(f"F1-score : {f1_score(y_test, y_pred, zero_division=0):.4f}")
print(f"ROC-AUC  : {roc_auc_score(y_test, y_prob):.4f}")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=["No disease indicated", "Disease indicated"],
    zero_division=0
))

# Save trained model
MODEL_FILE.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(model, MODEL_FILE)

print("\nModel saved to:")
print(MODEL_FILE.resolve())

print("\nTraining and evaluation completed!")

