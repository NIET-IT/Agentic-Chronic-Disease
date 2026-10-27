import pandas as pd

from sklearn.model_selection import GroupShuffleSplit
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix

# Load dataset
df = pd.read_csv("data/raw/cdc_diabetes.csv")

# Separate features and target
X = df.drop(columns=["Diabetes_binary"])
y = df["Diabetes_binary"]

# Group identical feature patterns to avoid splitting
# identical patterns across training and test sets
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

# Train baseline model
model = make_pipeline(
    StandardScaler(),
    LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=42,
    ),
)

model.fit(X_train, y_train)

# Predict using threshold 0.50
probabilities = model.predict_proba(X_test)[:, 1]
predictions = (probabilities >= 0.50).astype(int)

# Create a table of predictions and errors
results = X_test.copy()

results["Actual"] = y_test.to_numpy()
results["Predicted"] = predictions
results["Predicted_Probability"] = probabilities

results["Error_Type"] = "Correct"

results.loc[
    (results["Actual"] == 0) &
    (results["Predicted"] == 1),
    "Error_Type"
] = "False Positive"

results.loc[
    (results["Actual"] == 1) &
    (results["Predicted"] == 0),
    "Error_Type"
] = "False Negative"

# Display error summary
print("=" * 50)
print("ERROR ANALYSIS")
print("=" * 50)

print("\nError counts:")
print(results["Error_Type"].value_counts())

print("\nConfusion matrix:")
print(confusion_matrix(y_test, predictions))

print("\nFirst 10 false positives:")
print(
    results[results["Error_Type"] == "False Positive"]
    .head(10)
)

print("\nFirst 10 false negatives:")
print(
    results[results["Error_Type"] == "False Negative"]
    .head(10)
)

# Save the analysis
results.to_csv(
    "data/processed/diabetes_error_analysis.csv",
    index=False,
)

print("\nSaved: data/processed/diabetes_error_analysis.csv")