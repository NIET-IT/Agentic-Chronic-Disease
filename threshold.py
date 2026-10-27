import pandas as pd

from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    roc_auc_score,
)

# Load dataset
df = pd.read_csv("data/raw/cdc_diabetes.csv")

X = df.drop(columns=["Diabetes_binary"])
y = df["Diabetes_binary"]

# Keep identical feature patterns in the same split
groups = pd.util.hash_pandas_object(X, index=False)

splitter = GroupShuffleSplit(
    n_splits=1,
    test_size=0.20,
    random_state=42,
)

train_idx, test_idx = next(
    splitter.split(X, y, groups=groups)
)

X_train = X.iloc[train_idx]
X_test = X.iloc[test_idx]

y_train = y.iloc[train_idx]
y_test = y.iloc[test_idx]

# Train the model
model = make_pipeline(
    StandardScaler(),
    LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=42,
    ),
)

model.fit(X_train, y_train)

# Obtain class 1 probabilities
probabilities = model.predict_proba(X_test)[:, 1]

print("=" * 55)
print("CLASSIFICATION THRESHOLD ANALYSIS")
print("=" * 55)

print("\nROC-AUC:", round(
    roc_auc_score(y_test, probabilities), 4
))

# Compare several thresholds
for threshold in [0.30, 0.40, 0.50, 0.60, 0.70]:
    predictions = (
        probabilities >= threshold
    ).astype(int)

    print(f"\nThreshold: {threshold:.2f}")
    print(
        "Precision:",
        round(
            precision_score(
                y_test, predictions, zero_division=0
            ), 3
        ),
    )
    print(
        "Recall:",
        round(
            recall_score(
                y_test, predictions, zero_division=0
            ), 3
        ),
    )
    print(
        "F1-score:",
        round(
            f1_score(
                y_test, predictions, zero_division=0
            ), 3
        ),
    )
    print("Confusion matrix:")
    print(confusion_matrix(y_test, predictions))

print("\nThreshold analysis completed.")