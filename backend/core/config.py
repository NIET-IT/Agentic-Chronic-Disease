"""Centralized configuration and application settings for the Chronic Disease System."""

import os
from pathlib import Path

# Resolve base directories safely relative to this file
CORE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CORE_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent

# Application Metadata
PROJECT_NAME: str = os.getenv(
    "PROJECT_NAME",
    "Agentic AI Chronic Disease Early Prediction & Decision-Support System",
)
PROJECT_VERSION: str = os.getenv("PROJECT_VERSION", "1.0.0")
API_V1_STR: str = "/api/v1"

# Directory Paths
DATA_DIR: Path = Path(os.getenv("DATA_DIR", str(PROJECT_ROOT / "data")))
MODELS_DIR: Path = Path(os.getenv("MODELS_DIR", str(PROJECT_ROOT / "models")))
FRONTEND_DIR: Path = Path(os.getenv("FRONTEND_DIR", str(PROJECT_ROOT / "frontend")))
DATABASE_DIR: Path = Path(os.getenv("DATABASE_DIR", str(PROJECT_ROOT / "data" / "db")))

# Model Artifact Locations
DIABETES_MODEL_PATH: Path = Path(
    os.getenv(
        "DIABETES_MODEL_PATH",
        str(MODELS_DIR / "diabetes_logistic_regression.joblib"),
    )
)
HEART_DISEASE_MODEL_PATH: Path = Path(
    os.getenv(
        "HEART_DISEASE_MODEL_PATH",
        str(MODELS_DIR / "heart_disease_logistic_regression.joblib"),
    )
)

# Database Settings
DATABASE_PATH: Path = Path(
    os.getenv(
        "DATABASE_PATH",
        str(DATABASE_DIR / "chronic_disease_records.db"),
    )
)

# Logging
LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
