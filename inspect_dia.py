import pandas as pd
from pathlib import Path

# Load the original dataset
file_path = Path("data/raw/cdc_diabetes.csv")
df = pd.read_csv(file_path)

print("=" * 50)
print("DIABETES DATASET VALIDATION")
print("=" * 50)

# 1. Dataset size
print("\n1. Dataset shape:")
print(df.shape)

# 2. Missing values
print("\n2. Missing values:")
print(df.isnull().sum().sum())

# 3. Duplicate rows
print("\n3. Duplicate rows:")
print(df.duplicated().sum())

# 4. Target distribution
print("\n4. Diabetes target distribution:")
print(df["Diabetes_binary"].value_counts().sort_index())

# 5. Target percentages
print("\n5. Target percentages:")
print(
    (df["Diabetes_binary"].value_counts(normalize=True) * 100)
    .sort_index()
    .round(2)
)

# 6. Sex distribution
print("\n6. Sex distribution:")
print(df["Sex"].value_counts(dropna=False).sort_index())

# 7. Unique values in each column
print("\n7. Unique values per column:")
print(df.nunique().sort_values().to_string())

# 8. Check invalid target values
print("\n8. Target values:")
print(sorted(df["Diabetes_binary"].dropna().unique()))

print("\nDataset validation completed.")