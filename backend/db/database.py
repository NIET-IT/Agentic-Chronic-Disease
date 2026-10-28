"""Thread-safe SQLite database connection manager and schema initialization."""

import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Generator
from backend.core.config import DATABASE_PATH, DATABASE_DIR
from backend.core.logging import logger

_local = threading.local()

def ensure_database_directory() -> None:
    """Ensure that the database directory exists."""
    DATABASE_DIR.mkdir(parents=True, exist_ok=True)

def get_connection(db_path: Path = DATABASE_PATH) -> sqlite3.Connection:
    """
    Retrieve or create a thread-local SQLite connection with optimal pragmas.
    Uses WAL mode for concurrent reads/writes and enables foreign keys.
    """
    ensure_database_directory()
    if not hasattr(_local, "connection") or _local.connection is None:
        conn = sqlite3.connect(
            str(db_path),
            timeout=30.0,
            check_same_thread=False,
        )
        conn.row_factory = sqlite3.Row
        # Configure performance & integrity pragmas
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.execute("PRAGMA synchronous = NORMAL;")
        _local.connection = conn
    return _local.connection

@contextmanager
def get_db(db_path: Path = DATABASE_PATH) -> Generator[sqlite3.Connection, None, None]:
    """Context manager for managing transactions and safe commits/rollbacks."""
    conn = get_connection(db_path)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise

def init_db(db_path: Path = DATABASE_PATH) -> None:
    """Initialize the database schema if tables do not exist."""
    ensure_database_directory()
    conn = get_connection(db_path)
    with conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS patients (
            patient_id TEXT PRIMARY KEY,
            name TEXT,
            age REAL,
            sex INTEGER,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assessment_id TEXT UNIQUE NOT NULL,
            patient_id TEXT NOT NULL,
            condition TEXT NOT NULL,
            prediction INTEGER NOT NULL,
            probability REAL NOT NULL,
            risk_tier TEXT NOT NULL,
            risk_color TEXT NOT NULL,
            threshold REAL NOT NULL,
            urgency TEXT,
            input_features TEXT NOT NULL,
            feature_contributions TEXT NOT NULL,
            top_risk_factors TEXT NOT NULL,
            top_protective_factors TEXT NOT NULL,
            clinical_alerts TEXT,
            diagnostic_workup TEXT,
            lifestyle_plan TEXT,
            discussion_points TEXT,
            reasoning_trace TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS comprehensive_assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            comprehensive_id TEXT UNIQUE NOT NULL,
            patient_id TEXT NOT NULL,
            overall_urgency TEXT NOT NULL,
            diabetes_assessment_id TEXT,
            heart_disease_assessment_id TEXT,
            cardiometabolic_synergy_alerts TEXT NOT NULL,
            integrated_management_plan TEXT NOT NULL,
            reasoning_trace TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
            FOREIGN KEY (diabetes_assessment_id) REFERENCES assessments(assessment_id) ON DELETE SET NULL,
            FOREIGN KEY (heart_disease_assessment_id) REFERENCES assessments(assessment_id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            details TEXT,
            created_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_assessments_patient_id ON assessments(patient_id);
        CREATE INDEX IF NOT EXISTS idx_assessments_condition ON assessments(condition);
        CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);
        CREATE INDEX IF NOT EXISTS idx_comp_patient_id ON comprehensive_assessments(patient_id);
        """)
    logger.info(f"Database schema verified and initialized at {db_path}")
