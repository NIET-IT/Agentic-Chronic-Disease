
import pandas as pd
from pathlib import Path

# Dataset path
file_path = Path("data/raw/processed.cleveland.data")

# Cleveland Heart Disease dataset columns
columns = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal",
    "num"
]


def main():
    # Check whether the dataset exists
    if not file_path.exists():
        print(f"ERROR: Dataset not found at {file_path.resolve()}")
        return

    # Load the dataset and interpret '?' as missing data
    df = pd.read_csv(
        file_path,
        header=None,
        names=columns,
        na_values=["?"],
        skipinitialspace=True
    )

    print("=" * 50)
    print("CLEVELAND HEART DISEASE DATASET INSPECTION")
    print("=" * 50)

    # Dataset dimensions
    print("\n1. Dataset shape:")
    print(f"Rows: {df.shape[0]}")
    print(f"Columns: {df.shape[1]}")

    # Preview records
    print("\n2. First 5 rows:")
    print(df.head().to_string(index=False))

    # Column information
    print("\n3. Column data types:")
    print(df.dtypes)

    # Missing values
    print("\n4. Missing values per column:")
    print(df.isnull().sum())

    print(f"\nTotal missing values: {df.isnull().sum().sum()}")

    # Duplicate rows
    print("\n5. Duplicate rows:")
    print(df.duplicated().sum())

    # Target distribution
    print("\n6. Target distribution (num):")
    print(df["num"].value_counts(dropna=False).sort_index())

    # Target interpretation
    print("\n7. Binary target distribution:")
    binary_target = df["num"].map(
        lambda value: "Missing"
        if pd.isna(value)
        else ("No disease (0)" if value == 0 else "Disease indicator (>0)")
    )
    print(binary_target.value_counts())

    # Basic validation
    print("\n8. Dataset validation:")

    if df.shape[1] != 14:
        print("WARNING: Expected 14 columns.")
    else:
        print("Column count: PASS")

    if df.empty:
        print("ERROR: Dataset is empty.")
    else:
        print("Dataset is not empty: PASS")

    if df["num"].dropna().isin([0, 1, 2, 3, 4]).all():
        print("Target values: PASS")
    else:
        print("WARNING: Unexpected target values detected.")

    print("\nInspection completed.")


if __name__ == "__main__":
    main()

