
import pandas as pd
from pathlib import Path

# File paths
INPUT_FILE = Path("data/raw/processed.cleveland.data")
OUTPUT_FILE = Path("data/processed/cleveland_heart_disease_cleaned.csv")

# Cleveland dataset column names
columns = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope",
    "ca", "thal", "num"
]


def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found: {INPUT_FILE.resolve()}"
        )

    # Load data; '?' represents missing values
    df = pd.read_csv(
        INPUT_FILE,
        header=None,
        names=columns,
        na_values=["?"],
        skipinitialspace=True
    )

    print("Original dataset shape:", df.shape)

    # Convert columns to numeric values
    for column in columns:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    # Report missing values before cleaning
    print("\nMissing values before cleaning:")
    print(df.isnull().sum())

    # Remove exact duplicate rows
    duplicates = df.duplicated().sum()
    df = df.drop_duplicates().copy()
    print(f"\nDuplicate rows removed: {duplicates}")

    # Remove rows with missing values
    rows_before = len(df)
    df = df.dropna().copy()
    print(f"Rows removed due to missing values: {rows_before - len(df)}")

    # Create binary target:
    # 0 = no disease indicated
    # 1 = disease indicated (original target 1–4)
    df["heart_disease"] = (df["num"] > 0).astype(int)

    # Save cleaned dataset
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)

    print("\nCleaned dataset shape:", df.shape)
    print("\nBinary target distribution:")
    print(df["heart_disease"].value_counts().sort_index())

    print("\nSaved cleaned dataset to:")
    print(OUTPUT_FILE.resolve())

    print("\nDataset preparation completed successfully!")


if __name__ == "__main__":
    main()
