import pandas as pd
import numpy as np

from pathlib import Path

from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
)

# =====================================
# 1. LOAD DATASET
# =====================================

df = pd.read_csv("data/raw/cdc_diabetes.csv")

X = df.drop(columns=["Diabetes_binary"])
y = df["Diabetes_binary"]

print("=" * 55)
print("GROUPED DIABETES MODEL VALIDATION")
print("=" * 55)

# =====================================
# 2. CREATE FEATURE GROUPS
# =====================================

# Identical feature combinations receive the same group ID.
groups = pd.util.hash_pandas_object(
    X,
    index=False
)

print("\nTotal records:", len(df))
print("Unique feature groups:", groups.nunique())

# =====================================
# 3. GROUPED TRAIN/TEST SPLIT
# =====================================

splitter = GroupShuffleSplit(
    n_splits=1,
    test_size=0.20,
    random_state=42
)

train_idx, test_idx = next(
    splitter.split(X, y, groups=groups)
)

X_train = X.iloc[train_idx]
X_test = X.iloc[test_idx]

y_train = y.iloc[train_idx]
y_test = y.iloc[test_idx]

print("\nTraining records:", len(X_train))
print("Testing records:", len(X_test))

print("\nTraining target distribution:")
print(y_train.value_counts(normalize=True).mul(100).round(2))

print("\nTesting target distribution:")
print(y_test.value_counts(normalize=True).mul(100).round(2))

# =====================================
# 4. CHECK FEATURE OVERLAP
# =====================================

train_groups = set(groups.iloc[train_idx])
test_groups = set(groups.iloc[test_idx])

overlap = train_groups.intersection(test_groups)

print("\nIdentical feature groups across train/test:", len(overlap))

# =====================================
# 5. TRAIN LOGISTIC REGRESSION
# =====================================

model = make_pipeline(
    StandardScaler(),
    LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=42
    )
)

print("\nTraining Logistic Regression...")

model.fit(X_train, y_train)

# =====================================
# 6. MODEL EVALUATION
# =====================================

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("\nAccuracy:")
print(round(accuracy_score(y_test, y_pred), 4))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        zero_division=0
    )
)

print("\nROC-AUC:")
print(round(roc_auc_score(y_test, y_prob), 4))

print("\nGrouped validation completed.")