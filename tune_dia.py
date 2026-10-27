
import pandas as pd

from sklearn.model_selection import (
    train_test_split,
    RandomizedSearchCV,
    StratifiedKFold
)
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
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from joblib import dump

# 1. Load dataset
df = pd.read_csv("data/raw/cdc_diabetes.csv")

# 2. Check target
target = "Diabetes_binary"

if target not in df.columns:
    raise ValueError(
        f"Target '{target}' not found. "
        f"Available columns: {df.columns.tolist()}"
    )

# 3. Remove exact duplicate rows
df = df.drop_duplicates().copy()

# 4. Separate features and target
X = df.drop(columns=[target])
y = df[target].astype(int)

# 5. Split data before fitting any preprocessing steps
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# 6. Create preprocessing and model pipeline
pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("model", RandomForestClassifier(
        random_state=42,
        n_jobs=-1,
        class_weight=None
    ))
])

# 7. Search for better hyperparameters
param_distributions = {
    "model__n_estimators": [200, 300, 500],
    "model__max_depth": [8, 12, 16, 20, None],
    "model__min_samples_split": [2, 5, 10, 20],
    "model__min_samples_leaf": [1, 2, 5, 10],
    "model__max_features": ["sqrt", 0.5, 0.8],
    "model__class_weight": [None, "balanced"]
}

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

search = RandomizedSearchCV(
    estimator=pipeline,
    param_distributions=param_distributions,
    n_iter=15,
    scoring="roc_auc",
    cv=cv,
    random_state=42,
    n_jobs=-1,
    verbose=1
)

# 8. Train and tune
print("Training and tuning Random Forest...")
search.fit(X_train, y_train)

best_model = search.best_estimator_

# 9. Evaluate on the held-out test set
predictions = best_model.predict(X_test)
probabilities = best_model.predict_proba(X_test)[:, 1]

print("\nBest parameters:")
print(search.best_params_)

print("\nCross-validation ROC-AUC:")
print(round(search.best_score_, 4))

print("\nTest results:")
print("Accuracy:", round(accuracy_score(y_test, predictions), 4))
print("Precision:", round(
    precision_score(y_test, predictions, zero_division=0), 4
))
print("Recall:", round(
    recall_score(y_test, predictions, zero_division=0), 4
))
print("F1-score:", round(
    f1_score(y_test, predictions, zero_division=0), 4
))
print("ROC-AUC:", round(
    roc_auc_score(y_test, probabilities), 4
))

print("\nConfusion matrix:")
print(confusion_matrix(y_test, predictions))

print("\nClassification report:")
print(classification_report(y_test, predictions, zero_division=0))

# 10. Save the tuned model
dump(best_model, "models/diabetes_random_forest_tuned.joblib")

print("\nModel saved successfully.")
