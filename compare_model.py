import time
import pandas as pd

from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
)

# ==========================================
# 1. LOAD DATASET
# ==========================================

df = pd.read_csv("data/raw/cdc_diabetes.csv")

X = df.drop(columns=["Diabetes_binary"])
y = df["Diabetes_binary"]

print("Dataset loaded successfully")
print("Dataset shape:", df.shape)

# ==========================================
# 2. GROUP IDENTICAL FEATURE PATTERNS
# ==========================================

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

print("Training records:", len(X_train))
print("Testing records:", len(X_test))

# ==========================================
# 3. DEFINE MODELS
# ==========================================

models = {
    "Logistic Regression": make_pipeline(
        StandardScaler(),
        LogisticRegression(
            max_iter=1000,
            class_weight="balanced",
            random_state=42,
        ),
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=100,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    ),

    "Gradient Boosting": GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=3,
        random_state=42,
    ),
}

# ==========================================
# 4. TRAIN AND EVALUATE
# ==========================================

results = []

for name, model in models.items():

    print("\n" + "=" * 50)
    print("Training:", name)

    start_time = time.time()

    model.fit(X_train, y_train)

    training_time = time.time() - start_time

    probabilities = model.predict_proba(X_test)[:, 1]

    # Use the same threshold for a fair comparison
    predictions = (probabilities >= 0.50).astype(int)

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

    results.append({
        "Model": name,
        "Accuracy": round(accuracy, 4),
        "Precision": round(precision, 4),
        "Recall": round(recall, 4),
        "F1_Score": round(f1, 4),
        "ROC_AUC": round(auc, 4),
        "Training_Time_Seconds": round(training_time, 2),
    })

    print("Accuracy:", round(accuracy, 4))
    print("Precision:", round(precision, 4))
    print("Recall:", round(recall, 4))
    print("F1-score:", round(f1, 4))
    print("ROC-AUC:", round(auc, 4))
    print("Training time:", round(training_time, 2), "seconds")

# ==========================================
# 5. COMPARE AND SAVE RESULTS
# ==========================================

results_df = pd.DataFrame(results)

results_df = results_df.sort_values(
    by="ROC_AUC",
    ascending=False,
)

print("\n" + "=" * 70)
print("FINAL MODEL COMPARISON")
print("=" * 70)

print(results_df.to_string(index=False))

results_df.to_csv(
    "data/processed/diabetes_model_comparison.csv",
    index=False,
)

print("\nResults saved to:")
print("data/processed/diabetes_model_comparison.csv")