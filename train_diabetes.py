import pandas as pd
import joblib

from pathlib import Path

from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
)


# ==========================================
# 1. CONFIGURATION
# ==========================================

TRAIN_PATH = Path("data/processed/diabetes_train.csv")
TEST_PATH = Path("data/processed/diabetes_test.csv")
MODEL_DIR = Path("models")

MODEL_DIR.mkdir(parents=True, exist_ok=True)

print("=" * 55)
print("DIABETES CLASSIFICATION MODEL TRAINING")
print("=" * 55)


# ==========================================
# 2. LOAD DATASETS
# ==========================================

train_df = pd.read_csv(TRAIN_PATH)
test_df = pd.read_csv(TEST_PATH)

print("\nTraining dataset shape:", train_df.shape)
print("Testing dataset shape:", test_df.shape)


# ==========================================
# 3. SEPARATE FEATURES AND TARGET
# ==========================================

TARGET_COLUMN = "Diabetes_binary"

X_train = train_df.drop(columns=[TARGET_COLUMN])
y_train = train_df[TARGET_COLUMN]

X_test = test_df.drop(columns=[TARGET_COLUMN])
y_test = test_df[TARGET_COLUMN]

# Ensure that training and testing features match
if list(X_train.columns) != list(X_test.columns):
    raise ValueError("Training and testing features do not match.")

print("\nNumber of training records:", len(X_train))
print("Number of testing records:", len(X_test))
print("Number of input features:", X_train.shape[1])


# ==========================================
# 4. CREATE THE ML MODEL
# ==========================================

model = make_pipeline(
    StandardScaler(),
    LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=42,
    ),
)

print("\nAlgorithm: Logistic Regression")
print("Training the model...")


# ==========================================
# 5. TRAIN THE MODEL
# ==========================================

model.fit(X_train, y_train)

print("Model training completed successfully!")


# ==========================================
# 6. MAKE PREDICTIONS
# ==========================================

y_pred = model.predict(X_test)

# Estimated probability of class 1
y_prob = model.predict_proba(X_test)[:, 1]


# ==========================================
# 7. EVALUATE THE MODEL
# ==========================================

accuracy = accuracy_score(y_test, y_pred)

print("\n" + "=" * 55)
print("MODEL EVALUATION")
print("=" * 55)

print("\nAccuracy:")
print(f"{accuracy:.4f} ({accuracy * 100:.2f}%)")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=["Class 0", "Class 1"],
        zero_division=0,
    )
)

roc_auc = roc_auc_score(y_test, y_prob)

print("\nROC-AUC:")
print(f"{roc_auc:.4f}")


# ==========================================
# 8. SAVE THE TRAINED MODEL
# ==========================================

model_path = MODEL_DIR / "diabetes_logistic_regression.joblib"

joblib.dump(model, model_path)

print("\nModel saved successfully!")
print("Location:", model_path.resolve())

print("\nTraining and evaluation completed.")