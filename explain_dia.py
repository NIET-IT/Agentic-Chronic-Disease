import joblib
import pandas as pd
import shap
import matplotlib.pyplot as plt

from pathlib import Path
from sklearn.model_selection import GroupShuffleSplit

# 1. Load the dataset
df = pd.read_csv("data/raw/cdc_diabetes.csv")

X = df.drop(columns=["Diabetes_binary"])
y = df["Diabetes_binary"]

print("Dataset loaded:", X.shape)

# 2. Recreate the grouped training split
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

# 3. Load the saved Logistic Regression model
model_path = Path("models/diabetes_logistic_regression.joblib")
model = joblib.load(model_path)

print("Logistic Regression model loaded successfully.")

# 4. Get the pipeline components
scaler = model.named_steps["standardscaler"]
classifier = model.named_steps["logisticregression"]

# 5. Select small samples for SHAP analysis
background = X_train.sample(
    n=min(100, len(X_train)),
    random_state=42,
)

explain_data = X_test.sample(
    n=min(100, len(X_test)),
    random_state=42,
)

background_scaled = scaler.transform(background)
explain_scaled = scaler.transform(explain_data)

# 6. Calculate SHAP values
explainer = shap.LinearExplainer(
    classifier,
    background_scaled,
)

shap_values = explainer.shap_values(explain_scaled)

print("SHAP values calculated successfully.")

# 7. Create output directory
output_dir = Path("docs/shap")
output_dir.mkdir(parents=True, exist_ok=True)

# 8. Generate a feature-importance chart
plt.figure()

shap.summary_plot(
    shap_values,
    explain_data,
    feature_names=X.columns.tolist(),
    show=False,
)

plt.tight_layout()

plt.savefig(
    output_dir / "diabetes_shap_summary.png",
    dpi=300,
    bbox_inches="tight",
)

plt.close()

print("SHAP chart saved.")

# 9. Save numeric feature-importance results
importance = pd.DataFrame({
    "Feature": X.columns,
    "Mean_Absolute_SHAP": abs(shap_values).mean(axis=0),
})

importance = importance.sort_values(
    by="Mean_Absolute_SHAP",
    ascending=False,
)

importance.to_csv(
    output_dir / "diabetes_shap_feature_importance.csv",
    index=False,
)

print("\nTop 10 influential features:")
print(importance.head(10).to_string(index=False))

print("\nSHAP analysis completed successfully.")