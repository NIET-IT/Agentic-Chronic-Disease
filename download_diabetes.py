from pathlib import Path
from ucimlrepo import fetch_ucirepo
import pandas as pd

# Create the raw data directory
DATA_DIR = Path("data/raw")
DATA_DIR.mkdir(parents=True, exist_ok=True)

print("Downloading CDC Diabetes Health Indicators dataset...")

try:
    # Download dataset from UCI
    dataset = fetch_ucirepo(id=891)

    # Extract features and target
    X = dataset.data.features
    y = dataset.data.targets

    # Combine features and target
    df = pd.concat([X, y], axis=1)

    # Save the dataset
    output_path = DATA_DIR / "cdc_diabetes.csv"
    df.to_csv(output_path, index=False)

    print("\nDataset downloaded successfully!")
    print("Dataset shape:", df.shape)
    print("\nColumn names:")
    print(df.columns.tolist())

    print("\nFirst five rows:")
    print(df.head())

    print("\nTarget distribution:")
    print(y.value_counts())

    print("\nSaved to:", output_path.resolve())

except Exception as error:
    print("\nDataset download failed.")
    print("Error:", error)
    print("Check your internet connection and try again.")