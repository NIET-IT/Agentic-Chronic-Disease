import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split

# Load the original dataset
file_path = Path("data/raw/cdc_diabetes.csv")
df = pd.read_csv(file_path)

print("=" * 50)
print("DIABETES DATASET SPLITTING")
print("=" * 50)

# Separate features and target
X = df.drop(columns=["Diabetes_binary"])
y = df["Diabetes_binary"]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# Display dataset sizes
print("\n1. Original dataset:", X.shape)
print("2. Training features:", X_train.shape)
print("3. Testing features:", X_test.shape)

# Check target distribution
print("\n4. Training target distribution:")
print(y_train.value_counts(normalize=True).sort_index().mul(100).round(2))

print("\n5. Testing target distribution:")
print(y_test.value_counts(normalize=True).sort_index().mul(100).round(2))

# Verify there are no overlapping row indexes
print("\n6. Training and testing overlap:")
print(len(set(X_train.index) & set(X_test.index)))

# Save the split datasets
output_dir = Path("data/processed")
output_dir.mkdir(parents=True, exist_ok=True)

train_df = X_train.copy()
train_df["Diabetes_binary"] = y_train

test_df = X_test.copy()
test_df["Diabetes_binary"] = y_test

train_df.to_csv(output_dir / "diabetes_train.csv", index=False)
test_df.to_csv(output_dir / "diabetes_test.csv", index=False)

print("\nTraining data saved to data/processed/diabetes_train.csv")
print("Testing data saved to data/processed/diabetes_test.csv")

print("\nDataset splitting completed successfully.")