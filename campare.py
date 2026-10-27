import pandas as pd
from pathlib import Path

# Load original dataset
file_path = Path("data/raw/cdc_diabetes.csv")
df = pd.read_csv(file_path)

# Create a comparison copy
df_unique = df.drop_duplicates()

print("=" * 55)
print("ORIGINAL VS DEDUPLICATED DATASET")
print("=" * 55)

# Compare row counts
print("\n1. Original records:", len(df))
print("2. Unique records:", len(df_unique))
print("3. Removed records:", len(df) - len(df_unique))

# Compare target distributions
print("\n4. Original target distribution:")
print(df["Diabetes_binary"].value_counts().sort_index())

print("\n5. Unique dataset target distribution:")
print(df_unique["Diabetes_binary"].value_counts().sort_index())

# Compare target percentages
print("\n6. Original target percentages:")
print(
    (df["Diabetes_binary"].value_counts(normalize=True) * 100)
    .sort_index()
    .round(2)
)

print("\n7. Unique dataset target percentages:")
print(
    (df_unique["Diabetes_binary"].value_counts(normalize=True) * 100)
    .sort_index()
    .round(2)
)

# Save comparison dataset separately
output_path = Path("data/processed/cdc_diabetes_unique.csv")
output_path.parent.mkdir(parents=True, exist_ok=True)

df_unique.to_csv(output_path, index=False)

print("\nComparison dataset saved to:")
print(output_path.resolve())

print("\nComparison completed.")