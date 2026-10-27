import pandas as pd
from pathlib import Path

# Load the original dataset
input_path = Path("data/raw/cdc_diabetes.csv")
df = pd.read_csv(input_path)

print("=" * 50)
print("DIABETES DATA PREPARATION")
print("=" * 50)

# Separate input features and target
X = df.drop(columns=["Diabetes_binary"])
y = df["Diabetes_binary"]

# Display dataset information
print("\n1. Input features shape:")
print(X.shape)

print("\n2. Target shape:")
print(y.shape)

print("\n3. Input feature names:")
print(X.columns.tolist())

print("\n4. Target classes:")
print(sorted(y.unique()))

print("\n5. Missing values in input features:")
print(X.isnull().sum().sum())

print("\n6. Missing values in target:")
print(y.isnull().sum())

print("\n7. Target distribution:")
print(y.value_counts().sort_index())

print("\nFeature and target separation completed.")