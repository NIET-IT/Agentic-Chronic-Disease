import pandas as pd
from pathlib import Path

# Load the actual experimental results
results_path = Path(
    "data/processed/diabetes_model_comparison.csv"
)

results = pd.read_csv(results_path)

# Record why Logistic Regression was selected
report = """
DIABETES-RELATED MODEL SELECTION REPORT
=======================================

Project:
Agentic AI-Based Chronic Disease Early Prediction
and Decision-Support System

Selected baseline model:
Logistic Regression

Reason for selection:
1. Highest recall among the three tested models.
2. Highest F1-score among the three tested models.
3. Fastest training time in this experiment.
4. Model coefficients support interpretation.
5. Suitable baseline for further evaluation.

Important limitation:
Logistic Regression did not achieve the highest accuracy
or ROC-AUC in this experiment.

Dataset limitation:
The CDC Diabetes Health Indicators dataset uses a target
that combines prediabetes and diabetes. Therefore, this
model must not be presented as a validated Type 2 diabetes
early-prediction model.

Clinical limitation:
This is a research prototype, not a diagnostic tool.
Further validation is required before clinical use.
"""

output_dir = Path("docs")
output_dir.mkdir(parents=True, exist_ok=True)

# Save model comparison as a readable report
with open(
    output_dir / "diabetes_model_selection_report.txt",
    "w",
    encoding="utf-8",
) as file:
    file.write(report)

# Save a formatted comparison table
results.to_csv(
    output_dir / "diabetes_model_comparison.csv",
    index=False,
)

print("Model selection report saved successfully.")
print("File: docs/diabetes_model_selection_report.txt")
print("File: docs/diabetes_model_comparison.csv")

print("\nActual model comparison:")
print(results.to_string(index=False))