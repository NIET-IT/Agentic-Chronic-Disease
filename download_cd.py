from pathlib import Path

import pandas as pd

URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"

COLUMNS = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalach", "exang",
    "oldpeak", "slope", "ca", "thal", "num"
]

# Create the output folder
output_dir = Path("data/raw")
output_dir.mkdir(parents=True, exist_ok=True)

output_path = output_dir / "cleveland_heart_disease.csv"

print("Starting CAD dataset download...")

try:
    df = pd.read_csv(
        URL,
        header=None,
        names=COLUMNS,
        na_values="?",
    )

    df.to_csv(output_path, index=False)

    print("Download successful!")
    print("Dataset shape:", df.shape)
    print("Saved to:", output_path)

    print("\nMissing values:")
    print(df.isnull().sum())

    print("\nOriginal target distribution:")
    print(df["num"].value_counts().sort_index())

except Exception as error:
    print("Download failed:", error)