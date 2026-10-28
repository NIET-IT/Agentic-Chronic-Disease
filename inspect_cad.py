"""import pandas as pd

path = "data/raw/heart.csv"

df = pd.read_csv(path)

print("\n========== HEART DATASET INSPECTION ==========")

print("\n1. Dataset shape:")
print(df.shape)

print("\n2. Column names:")
print(df.columns.tolist())

print("\n3. First 5 rows:")
print(df.head().to_string())

print("\n4. Data types:")
print(df.dtypes)

print("\n5. Missing values:")
print(df.isnull().sum())

print("\n6. Duplicate rows:")
print(df.duplicated().sum())

print("\n7. Unique values in each column:")
for col in df.columns:
    print(f"\n{col}:")
    print(df[col].value_counts(dropna=False).head(20))

print("\n========== INSPECTION COMPLETED ==========")"""




"""import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix
)

# --------------------------------------------------
# 1. Load the new dataset
# --------------------------------------------------

DATA_PATH = "data/raw/heart.csv"
MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)
print("Columns:", df.columns.tolist())

# --------------------------------------------------
# 2. Validate the target
# --------------------------------------------------

TARGET_COLUMN = "target"

if TARGET_COLUMN not in df.columns:
    raise ValueError(
        f"Target column '{TARGET_COLUMN}' not found."
    )

print("\nTarget distribution:")
print(df[TARGET_COLUMN].value_counts())

if df[TARGET_COLUMN].isnull().any():
    raise ValueError("Target column contains missing values.")

if not set(df[TARGET_COLUMN].unique()).issubset({0, 1}):
    raise ValueError("Target must contain only 0 and 1.")

# Remove rows with missing target values (already checked)
# and exact duplicate rows.
df = df.drop_duplicates().reset_index(drop=True)

# --------------------------------------------------
# 3. Prepare features and target
# --------------------------------------------------

X = df.drop(columns=[TARGET_COLUMN])
y = df[TARGET_COLUMN].astype(int)

# Convert categorical/text columns into numeric indicators.
X = pd.get_dummies(X, drop_first=False, dtype=int)

# Replace infinite values with missing values for imputation.
import numpy as np

X = X.replace([np.inf, -np.inf], np.nan)

print("\nFinal feature count:", X.shape[1])
print("Records after duplicate removal:", len(X))

# --------------------------------------------------
# 4. Split the dataset
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))

# --------------------------------------------------
# 5. Train two models
# --------------------------------------------------

models = {
    "Logistic Regression": Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("classifier", LogisticRegression(
            max_iter=2000,
            random_state=42
        ))
    ]),
    "Random Forest": Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("classifier", RandomForestClassifier(
            n_estimators=300,
            min_samples_leaf=2,
            class_weight="balanced",
            random_state=42,
            n_jobs=1
        ))
    ])
}

results = []

for name, model in models.items():
    print(f"\n{'=' * 50}")
    print("Training:", name)

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    probabilities = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, predictions)
    precision = precision_score(
        y_test, predictions, zero_division=0
    )
    recall = recall_score(
        y_test, predictions, zero_division=0
    )
    f1 = f1_score(
        y_test, predictions, zero_division=0
    )
    auc = roc_auc_score(y_test, probabilities)

    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-score:  {f1:.4f}")
    print(f"ROC-AUC:   {auc:.4f}")

    print("\nConfusion matrix:")
    print(confusion_matrix(y_test, predictions))

    print("\nClassification report:")
    print(classification_report(
        y_test,
        predictions,
        zero_division=0
    ))

    results.append({
        "name": name,
        "model": model,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "auc": auc
    })

# --------------------------------------------------
# 6. Select the best model using F1-score
# --------------------------------------------------

best_result = max(results, key=lambda result: result["f1"])
best_model = best_result["model"]

# --------------------------------------------------
# 7. Save the model and its feature schema
# --------------------------------------------------

MODEL_PATH = "models/heart_disease_new.joblib"

artifact = {
    "model": best_model,
    "feature_columns": X.columns.tolist(),
    "target_column": TARGET_COLUMN,
    "model_name": best_result["name"],
    "metrics": {
        "accuracy": best_result["accuracy"],
        "precision": best_result["precision"],
        "recall": best_result["recall"],
        "f1": best_result["f1"],
        "roc_auc": best_result["auc"]
    }
}

joblib.dump(artifact, MODEL_PATH)

print("\n" + "=" * 50)
print("TRAINING COMPLETED")
print("Best model:", best_result["name"])
print("Selection metric: F1-score")
print("Saved model:", MODEL_PATH)
print("=" * 50)"""



import joblib

MODEL_PATH = "models/heart_disease_new.joblib"

artifact = joblib.load(MODEL_PATH)

print("=" * 50)
print("NEW HEART DISEASE MODEL EVALUATION")
print("=" * 50)

print("\nSelected model:", artifact["model_name"])
print("Target column:", artifact["target_column"])

print("\nEvaluation metrics:")

for metric, value in artifact["metrics"].items():
    print(f"{metric.upper():<12}: {value:.4f}")

print("\nNumber of input features:", len(artifact["feature_columns"]))

print("\nModel loaded successfully!")


