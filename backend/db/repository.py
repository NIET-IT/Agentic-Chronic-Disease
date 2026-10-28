"""Repository pattern implementation for chronic disease clinical persistence."""

import json
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from backend.db.database import get_db
from backend.core.logging import logger

def _current_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()

class ClinicalRepository:
    """Provides abstracted persistence operations for patient assessments and history."""

    @staticmethod
    def ensure_patient(
        patient_id: str,
        age: Optional[float] = None,
        sex: Optional[int] = None,
        name: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Ensure a patient record exists; updates demographic information if provided."""
        now = _current_timestamp()
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM patients WHERE patient_id = ?", (patient_id,))
            existing = cursor.fetchone()
            if existing is None:
                cursor.execute(
                    """
                    INSERT INTO patients (patient_id, name, age, sex, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (patient_id, name, age, sex, now, now),
                )
            else:
                updated_age = age if age is not None else existing["age"]
                updated_sex = sex if sex is not None else existing["sex"]
                updated_name = name if name is not None else existing["name"]
                cursor.execute(
                    """
                    UPDATE patients
                    SET name = ?, age = ?, sex = ?, updated_at = ?
                    WHERE patient_id = ?
                    """,
                    (updated_name, updated_age, updated_sex, now, patient_id),
                )

        return ClinicalRepository.get_patient(patient_id) or {"patient_id": patient_id}

    @staticmethod
    def get_patient(patient_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve patient details by ID."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM patients WHERE patient_id = ?", (patient_id,))
            row = cursor.fetchone()
            if row:
                return dict(row)
        return None

    @staticmethod
    def list_patients(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Retrieve a list of registered patients ordered by latest update."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM patients ORDER BY updated_at DESC LIMIT ? OFFSET ?",
                (limit, offset),
            )
            return [dict(r) for r in cursor.fetchall()]

    @staticmethod
    def save_assessment(
        patient_id: str,
        condition: str,
        prediction_data: Dict[str, Any],
        decision_data: Optional[Dict[str, Any]] = None,
        input_features: Optional[Dict[str, Any]] = None,
    ) -> str:
        """
        Persist a prediction result and optional decision support report.
        Returns the generated unique assessment_id.
        """
        # Ensure patient exists
        ClinicalRepository.ensure_patient(patient_id)

        assessment_id = f"ASM-{uuid.uuid4().hex[:8].upper()}"
        now = _current_timestamp()

        prob = float(prediction_data.get("probability", 0.0))
        pred = int(prediction_data.get("prediction", 0))
        risk_tier = str(prediction_data.get("risk_tier", "Unknown"))
        risk_color = str(prediction_data.get("risk_color", "#cccccc"))
        threshold = float(prediction_data.get("threshold", 0.50))

        feat_contrib = json.dumps(prediction_data.get("feature_contributions", []))
        top_risk = json.dumps(prediction_data.get("top_risk_factors", []))
        top_prot = json.dumps(prediction_data.get("top_protective_factors", []))
        features_json = json.dumps(input_features or {})

        urgency = None
        alerts_json = None
        workup_json = None
        lifestyle_json = None
        disc_json = None
        trace_json = None

        if decision_data:
            urgency = decision_data.get("urgency")
            alerts_json = json.dumps(decision_data.get("clinical_alerts", []))
            workup_json = json.dumps(decision_data.get("recommended_diagnostic_workup", []))
            lifestyle_json = json.dumps(decision_data.get("lifestyle_action_plan", []))
            disc_json = json.dumps(decision_data.get("clinical_discussion_points", []))
            trace_json = json.dumps(decision_data.get("reasoning_trace", []))

        with get_db() as conn:
            conn.execute(
                """
                INSERT INTO assessments (
                    assessment_id, patient_id, condition, prediction, probability,
                    risk_tier, risk_color, threshold, urgency, input_features,
                    feature_contributions, top_risk_factors, top_protective_factors,
                    clinical_alerts, diagnostic_workup, lifestyle_plan,
                    discussion_points, reasoning_trace, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    assessment_id,
                    patient_id,
                    condition,
                    pred,
                    prob,
                    risk_tier,
                    risk_color,
                    threshold,
                    urgency,
                    features_json,
                    feat_contrib,
                    top_risk,
                    top_prot,
                    alerts_json,
                    workup_json,
                    lifestyle_json,
                    disc_json,
                    trace_json,
                    now,
                ),
            )

        logger.info(f"Persisted assessment {assessment_id} for patient {patient_id} ({condition})")
        return assessment_id

    @staticmethod
    def get_assessment(assessment_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a specific assessment by unique assessment_id with unpacked JSON fields."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM assessments WHERE assessment_id = ?", (assessment_id,))
            row = cursor.fetchone()
            if not row:
                return None
            data = dict(row)
            # Unpack JSON columns
            for col in [
                "input_features",
                "feature_contributions",
                "top_risk_factors",
                "top_protective_factors",
                "clinical_alerts",
                "diagnostic_workup",
                "lifestyle_plan",
                "discussion_points",
                "reasoning_trace",
            ]:
                if data.get(col):
                    try:
                        data[col] = json.loads(data[col])
                    except Exception:
                        pass
            return data

    @staticmethod
    def list_assessments(
        patient_id: Optional[str] = None,
        condition: Optional[str] = None,
        risk_tier: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Dict[str, Any]]:
        """Query and paginate past clinical assessments with optional filters."""
        query = "SELECT * FROM assessments WHERE 1=1"
        params: List[Any] = []

        if patient_id:
            query += " AND patient_id = ?"
            params.append(patient_id)
        if condition:
            query += " AND condition = ?"
            params.append(condition)
        if risk_tier:
            query += " AND risk_tier = ?"
            params.append(risk_tier)

        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            records = []
            for row in cursor.fetchall():
                data = dict(row)
                for col in ["input_features", "clinical_alerts", "reasoning_trace"]:
                    if data.get(col):
                        try:
                            data[col] = json.loads(data[col])
                        except Exception:
                            pass
                records.append(data)
            return records

    @staticmethod
    def save_comprehensive_assessment(
        patient_id: str,
        overall_urgency: str,
        dia_assessment_id: Optional[str],
        cad_assessment_id: Optional[str],
        synergy_alerts: List[Dict[str, Any]],
        integrated_plan: List[str],
        reasoning_trace: List[str],
    ) -> str:
        """Persist a multi-condition holistic cardiometabolic assessment."""
        ClinicalRepository.ensure_patient(patient_id)
        comp_id = f"COMP-{uuid.uuid4().hex[:8].upper()}"
        now = _current_timestamp()

        with get_db() as conn:
            conn.execute(
                """
                INSERT INTO comprehensive_assessments (
                    comprehensive_id, patient_id, overall_urgency,
                    diabetes_assessment_id, heart_disease_assessment_id,
                    cardiometabolic_synergy_alerts, integrated_management_plan,
                    reasoning_trace, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    comp_id,
                    patient_id,
                    overall_urgency,
                    dia_assessment_id,
                    cad_assessment_id,
                    json.dumps(synergy_alerts),
                    json.dumps(integrated_plan),
                    json.dumps(reasoning_trace),
                    now,
                ),
            )
        logger.info(f"Persisted comprehensive assessment {comp_id} for patient {patient_id}")
        return comp_id

    @staticmethod
    def get_comprehensive_assessment(comp_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a comprehensive assessment with unpacked relations."""
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM comprehensive_assessments WHERE comprehensive_id = ?",
                (comp_id,),
            )
            row = cursor.fetchone()
            if not row:
                return None
            data = dict(row)
            for col in [
                "cardiometabolic_synergy_alerts",
                "integrated_management_plan",
                "reasoning_trace",
            ]:
                if data.get(col):
                    try:
                        data[col] = json.loads(data[col])
                    except Exception:
                        pass
            return data

    @staticmethod
    def list_comprehensive_assessments(
        patient_id: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Dict[str, Any]]:
        """Query past comprehensive multi-condition evaluations."""
        query = "SELECT * FROM comprehensive_assessments WHERE 1=1"
        params: List[Any] = []
        if patient_id:
            query += " AND patient_id = ?"
            params.append(patient_id)
        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            records = []
            for row in cursor.fetchall():
                data = dict(row)
                for col in ["cardiometabolic_synergy_alerts", "integrated_management_plan"]:
                    if data.get(col):
                        try:
                            data[col] = json.loads(data[col])
                        except Exception:
                            pass
                records.append(data)
            return records

clinical_repository = ClinicalRepository()
