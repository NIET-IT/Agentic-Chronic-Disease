import pandas as pd

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
)

# -----------------------------------
# 1. Load the original dataset
# -----------------------------------

DATA_PATH = Path("data/raw/cdc_diabetes.csv")

df = pd.read_csv(DATA_PATH)

print("=" * 55)
print("LOGISTIC REGRESSION VALIDATION")
print("=" * 55)

print("\nOriginal dataset shape:", df.shape)

# -----------------------------------
# 2. Remove exact duplicate rows
# -----------------------------------

df_unique = df.drop_duplicates().copy()

print("Dataset after exact deduplication:", df_unique.shape)
print("Rows removed:", len(df) - len(df_unique))

# -----------------------------------
# 3. Separate features and target
# -----------------------------------

X = df_unique.drop(columns=["Diabetes_binary"])
y = df_unique["Diabetes_binary"]

# -----------------------------------
# 4. Split the deduplicated dataset
# -----------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))

# -----------------------------------
# 5. Check exact feature overlap
# -----------------------------------

train_features = set(
    map(tuple, X_train.to_numpy())
)

test_features = set(
    map(tuple, X_test.to_numpy())
)

overlap = train_features.intersection(test_features)

print("\nIdentical feature patterns in both sets:", len(overlap))

# -----------------------------------
# 6. Train Logistic Regression
# -----------------------------------

model = make_pipeline(
    StandardScaler(),
    LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=42,
    ),
)

print("\nTraining Logistic Regression...")

model.fit(X_train, y_train)

# -----------------------------------
# 7. Evaluate the model
# -----------------------------------

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("\nAccuracy:")
print(round(accuracy_score(y_test, y_pred), 4))

print("\nConfusion matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=["Class 0", "Class 1"],
        zero_division=0,
    )
)

print("\nROC-AUC:")
print(round(roc_auc_score(y_test, y_prob), 4))

print("\nValidation run completed.")