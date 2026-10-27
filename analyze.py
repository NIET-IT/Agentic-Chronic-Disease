import pandas as pd
from pathlib import Path

# Load the original dataset
file_path = Path("data/raw/cdc_diabetes.csv")
df = pd.read_csv(file_path)

print("=" * 50)
print("DUPLICATE RECORD ANALYSIS")
print("=" * 50)

# Count duplicate rows
duplicate_mask = df.duplicated()

print("\n1. Total rows:", len(df))
print("2. Duplicate rows:", duplicate_mask.sum())
print("3. Rows remaining if duplicates are removed:",
      len(df.drop_duplicates()))

# Examine target labels among duplicated rows
duplicate_rows = df.loc[duplicate_mask]

print("\n4. Target distribution among duplicate rows:")
print(duplicate_rows["Diabetes_binary"].value_counts())

# Check whether identical feature rows have conflicting targets
feature_columns = [
    column for column in df.columns
    if column != "Diabetes_binary"
]

target_counts = (
    df.groupby(feature_columns, dropna=False)["Diabetes_binary"]
    .nunique()
)

conflicting_groups = target_counts[target_counts > 1]

print("\n5. Feature combinations associated with conflicting targets:")
print(len(conflicting_groups))

print("\nDuplicate analysis completed.")