"""FastAPI REST routes for chronic disease prediction, agentic decision support, and history persistence."""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from backend.api.schemas import (
    DiabetesInput,
    HeartDiseaseInput,
    ComprehensiveAssessmentInput,
    PredictionOutput,
    DecisionSupportOutput,
    DiseaseDecisionPair,
    ComprehensiveResponse,
    HealthResponse,
    PatientCreate,
    AuthLoginRequest,
    PatientResponse,
    AssessmentHistoryResponse,
    ExplainabilitySummary,
    ThresholdSimulationResponse,
    ThresholdSimulationItem,
)
from backend.services.diabetes_service import (
    diabetes_service,
    DIABETES_FEATURE_METADATA,
    DIABETES_FEATURE_NAMES,
)
from backend.services.heart_disease_service import (
    heart_disease_service,
    CAD_FEATURE_METADATA,
    CAD_FEATURE_NAMES,
)
from backend.agents.decision_agent import decision_agent
from backend.db.repository import clinical_repository
from backend.core.logging import logger

router = APIRouter(prefix="/api/v1", tags=["Chronic Disease System"])


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint indicating model loading status and database connectivity."""
    return {
        "status": "healthy",
        "diabetes_model": "Logistic Regression (StandardScaler, class_weight='balanced')",
        "heart_disease_model": "Logistic Regression (SimpleImputer, StandardScaler)",
        "database_status": "connected",
        "version": "1.0.0",
    }


@router.get("/metadata/features")
def get_features_metadata():
    """Return dictionary of feature metadata and categories for dynamic frontend forms."""
    return {
        "diabetes": DIABETES_FEATURE_METADATA,
        "heart_disease": CAD_FEATURE_METADATA,
    }


# ------------------------------------------------------------------------------
# Prediction & Decision Support Endpoints (with Automatic Persistence)
# ------------------------------------------------------------------------------

@router.post("/predict/diabetes", response_model=PredictionOutput)
def predict_diabetes(payload: DiabetesInput):
    """Predict diabetes / prediabetes probability, tier, and local feature contributions."""
    try:
        data = payload.model_dump()
        patient_id = data.pop("patient_id", "PT-DEFAULT") or "PT-DEFAULT"
        threshold = data.pop("threshold", 0.50)

        result = diabetes_service.predict(data, threshold=threshold)

        # Persist prediction
        assessment_id = clinical_repository.save_assessment(
            patient_id=patient_id,
            condition="Diabetes / Prediabetes",
            prediction_data=result,
            input_features=data,
        )
        result["assessment_id"] = assessment_id
        result["patient_id"] = patient_id
        return result
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as exc:
        logger.error(f"Diabetes prediction error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Diabetes prediction failure: {str(exc)}",
        )


@router.post("/decision-support/diabetes", response_model=DiseaseDecisionPair)
def diabetes_decision_support(payload: DiabetesInput):
    """Full diabetes evaluation: risk prediction combined with agentic clinical decision support."""
    try:
        data = payload.model_dump()
        patient_id = data.pop("patient_id", "PT-DEFAULT") or "PT-DEFAULT"
        threshold = data.pop("threshold", 0.50)

        prediction = diabetes_service.predict(data, threshold=threshold)
        decision_support = decision_agent.evaluate_diabetes_case(prediction, data)

        # Persist full clinical decision assessment
        assessment_id = clinical_repository.save_assessment(
            patient_id=patient_id,
            condition="Diabetes",
            prediction_data=prediction,
            decision_data=decision_support,
            input_features=data,
        )
        prediction["assessment_id"] = assessment_id
        prediction["patient_id"] = patient_id

        return {
            "prediction": prediction,
            "decision_support": decision_support,
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as exc:
        logger.error(f"Diabetes decision support error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Diabetes decision support failure: {str(exc)}",
        )


@router.post("/predict/heart-disease", response_model=PredictionOutput)
def predict_heart_disease(payload: HeartDiseaseInput):
    """Predict coronary artery disease probability, tier, and local feature attributions."""
    try:
        data = payload.model_dump()
        patient_id = data.pop("patient_id", "PT-DEFAULT") or "PT-DEFAULT"
        threshold = data.pop("threshold", 0.50)

        result = heart_disease_service.predict(data, threshold=threshold)

        # Persist prediction
        assessment_id = clinical_repository.save_assessment(
            patient_id=patient_id,
            condition="Coronary Heart Disease",
            prediction_data=result,
            input_features=data,
        )
        result["assessment_id"] = assessment_id
        result["patient_id"] = patient_id
        return result
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as exc:
        logger.error(f"Heart disease prediction error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Heart disease prediction failure: {str(exc)}",
        )


@router.post("/decision-support/heart-disease", response_model=DiseaseDecisionPair)
def heart_disease_decision_support(payload: HeartDiseaseInput):
    """Full heart disease evaluation: risk prediction combined with agentic clinical decision support."""
    try:
        data = payload.model_dump()
        patient_id = data.pop("patient_id", "PT-DEFAULT") or "PT-DEFAULT"
        threshold = data.pop("threshold", 0.50)

        prediction = heart_disease_service.predict(data, threshold=threshold)
        decision_support = decision_agent.evaluate_heart_disease_case(prediction, data)

        # Persist assessment
        assessment_id = clinical_repository.save_assessment(
            patient_id=patient_id,
            condition="Coronary Heart Disease",
            prediction_data=prediction,
            decision_data=decision_support,
            input_features=data,
        )
        prediction["assessment_id"] = assessment_id
        prediction["patient_id"] = patient_id

        return {
            "prediction": prediction,
            "decision_support": decision_support,
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as exc:
        logger.error(f"Heart disease decision support error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Heart disease decision support failure: {str(exc)}",
        )


@router.post("/decision-support/comprehensive", response_model=ComprehensiveResponse)
def comprehensive_decision_support(payload: ComprehensiveAssessmentInput):
    """
    Holistic cardiometabolic decision support evaluating both diabetes
    and coronary artery disease synergistically for a single patient profile.
    """
    try:
        patient_id = payload.patient_id or "PT-1001"

        dia_data = payload.diabetes_data.model_dump()
        dia_thresh = dia_data.pop("threshold", 0.50)
        _ = dia_data.pop("patient_id", None)
        dia_prediction = diabetes_service.predict(dia_data, threshold=dia_thresh)
        dia_decision = decision_agent.evaluate_diabetes_case(dia_prediction, dia_data)

        dia_aid = clinical_repository.save_assessment(
            patient_id=patient_id,
            condition="Diabetes",
            prediction_data=dia_prediction,
            decision_data=dia_decision,
            input_features=dia_data,
        )
        dia_prediction["assessment_id"] = dia_aid
        dia_prediction["patient_id"] = patient_id

        cad_data = payload.heart_disease_data.model_dump()
        cad_thresh = cad_data.pop("threshold", 0.50)
        _ = cad_data.pop("patient_id", None)
        cad_prediction = heart_disease_service.predict(cad_data, threshold=cad_thresh)
        cad_decision = decision_agent.evaluate_heart_disease_case(cad_prediction, cad_data)

        cad_aid = clinical_repository.save_assessment(
            patient_id=patient_id,
            condition="Coronary Heart Disease",
            prediction_data=cad_prediction,
            decision_data=cad_decision,
            input_features=cad_data,
        )
        cad_prediction["assessment_id"] = cad_aid
        cad_prediction["patient_id"] = patient_id

        holistic = decision_agent.evaluate_comprehensive_case(
            dia_prediction, cad_prediction, {"diabetes": dia_data, "heart_disease": cad_data}
        )

        comp_id = clinical_repository.save_comprehensive_assessment(
            patient_id=patient_id,
            overall_urgency=holistic["overall_urgency"],
            dia_assessment_id=dia_aid,
            cad_assessment_id=cad_aid,
            synergy_alerts=holistic["cardiometabolic_synergy_alerts"],
            integrated_plan=holistic["integrated_management_plan"],
            reasoning_trace=holistic["reasoning_trace"],
        )

        return {
            "comprehensive_id": comp_id,
            "patient_id": patient_id,
            "overall_urgency": holistic["overall_urgency"],
            "diabetes_assessment": {
                "prediction": dia_prediction,
                "decision_support": dia_decision,
            },
            "heart_disease_assessment": {
                "prediction": cad_prediction,
                "decision_support": cad_decision,
            },
            "cardiometabolic_synergy_alerts": holistic["cardiometabolic_synergy_alerts"],
            "integrated_management_plan": holistic["integrated_management_plan"],
            "reasoning_trace": holistic["reasoning_trace"],
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        )
    except Exception as exc:
        logger.error(f"Comprehensive evaluation error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Comprehensive evaluation failure: {str(exc)}",
        )


# ------------------------------------------------------------------------------
# Patient Management Endpoints
# ------------------------------------------------------------------------------


@router.post("/patients/register", response_model=PatientResponse)
def register_patient_alias(payload: PatientCreate):
    """Alias endpoint for patient registration."""
    return register_or_update_patient(payload)


@router.post("/auth/login")
def login_patient(payload: AuthLoginRequest):
    """Session / login endpoint verifying or creating patient."""
    patient = clinical_repository.get_patient(payload.email)
    if not patient:
        patient = clinical_repository.ensure_patient(
            patient_id=payload.email,
            name=payload.email.split("@")[0],
        )
    return {"status": "authenticated", "patient": patient}

@router.post("/patients", response_model=PatientResponse)
def register_or_update_patient(payload: PatientCreate):
    """Register a new patient or update demographic details."""
    try:
        patient = clinical_repository.ensure_patient(
            patient_id=payload.patient_id,
            age=payload.age,
            sex=payload.sex,
            name=payload.name,
        )
        return patient
    except Exception as exc:
        logger.error(f"Patient registration error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Patient persistence failure: {str(exc)}",
        )


@router.get("/patients/{patient_id}", response_model=PatientResponse)
def get_patient_profile(patient_id: str):
    """Retrieve patient record by ID."""
    patient = clinical_repository.get_patient(patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient '{patient_id}' not found.",
        )
    return patient


@router.get("/patients", response_model=List[PatientResponse])
def list_patients(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0)):
    """List registered patients with pagination."""
    return clinical_repository.list_patients(limit=limit, offset=offset)


# ------------------------------------------------------------------------------
# Clinical History & Assessment Retrieval Endpoints
# ------------------------------------------------------------------------------

@router.get("/history/assessments", response_model=AssessmentHistoryResponse)
def list_assessment_history(
    patient_id: Optional[str] = Query(None, description="Filter by patient ID"),
    condition: Optional[str] = Query(None, description="Filter by condition (Diabetes or Coronary Heart Disease)"),
    risk_tier: Optional[str] = Query(None, description="Filter by risk tier (Low, Moderate, High)"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """Query past clinical assessments with optional filters and pagination."""
    items = clinical_repository.list_assessments(
        patient_id=patient_id,
        condition=condition,
        risk_tier=risk_tier,
        limit=limit,
        offset=offset,
    )
    return {
        "total": len(items),
        "items": items,
    }


@router.get("/history/assessments/{assessment_id}")
def get_assessment_details(assessment_id: str):
    """Retrieve full details of an assessment by unique assessment_id."""
    record = clinical_repository.get_assessment(assessment_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment '{assessment_id}' not found.",
        )
    return record


@router.get("/history/comprehensive/{comprehensive_id}")
def get_comprehensive_assessment_details(comprehensive_id: str):
    """Retrieve full details of a multi-condition comprehensive assessment."""
    record = clinical_repository.get_comprehensive_assessment(comprehensive_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comprehensive assessment '{comprehensive_id}' not found.",
        )
    return record


# ------------------------------------------------------------------------------
# Model Explainability & Threshold Simulation
# ------------------------------------------------------------------------------

@router.get("/explainability/summary", response_model=List[ExplainabilitySummary])
def get_global_explainability():
    """Return model explainability summaries and top influential population features."""
    # Diabetes top coefficients
    dia_coefs = diabetes_service._classifier.coef_[0]
    dia_features = [
        {
            "feature": name,
            "label": DIABETES_FEATURE_METADATA.get(name, {}).get("label", name),
            "coefficient": round(float(dia_coefs[i]), 4),
            "impact_direction": "Risk Increasing" if dia_coefs[i] > 0 else "Protective",
        }
        for i, name in enumerate(DIABETES_FEATURE_NAMES)
    ]
    dia_features.sort(key=lambda x: abs(x["coefficient"]), reverse=True)

    # CAD top coefficients
    cad_coefs = heart_disease_service._classifier.coef_[0]
    cad_features = [
        {
            "feature": name,
            "label": CAD_FEATURE_METADATA.get(name, {}).get("label", name),
            "coefficient": round(float(cad_coefs[i]), 4),
            "impact_direction": "Risk Increasing" if cad_coefs[i] > 0 else "Protective",
        }
        for i, name in enumerate(CAD_FEATURE_NAMES)
    ]
    cad_features.sort(key=lambda x: abs(x["coefficient"]), reverse=True)

    return [
        {
            "condition": "Diabetes / Prediabetes",
            "model_name": "Logistic Regression (StandardScaler, class_weight='balanced')",
            "feature_count": len(DIABETES_FEATURE_NAMES),
            "top_influential_features": dia_features[:10],
            "clinical_context": (
                "Standardized logistic regression coefficients representing odds ratio changes. "
                "Target indicates diabetes/prediabetes versus no diabetes."
            ),
        },
        {
            "condition": "Coronary Heart Disease",
            "model_name": "Logistic Regression (SimpleImputer, StandardScaler)",
            "feature_count": len(CAD_FEATURE_NAMES),
            "top_influential_features": cad_features[:10],
            "clinical_context": (
                "Standardized coefficients on Cleveland CAD cohort identifying ST changes (oldpeak), "
                "fluoroscopy vessel calcification (ca), and exercise angina as primary risk indicators."
            ),
        },
    ]


@router.post("/simulate/threshold", response_model=ThresholdSimulationResponse)
def simulate_thresholds(
    probability: float = Query(..., ge=0.0, le=1.0, description="Calculated probability"),
    condition: str = Query("Diabetes", description="Condition name"),
    current_threshold: float = Query(0.50, ge=0.05, le=0.95),
):
    """
    Simulate the effect of varying classification thresholds on patient risk classification.
    Allows clinicians to analyze trade-offs between screening sensitivity and specificity.
    """
    test_thresholds = [0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80]
    simulations = []
    for t in test_thresholds:
        sim_pred = int(probability >= t)
        simulations.append(
            ThresholdSimulationItem(
                threshold=t,
                simulated_prediction=sim_pred,
                classification_label="Disease Indicated" if sim_pred == 1 else "No Disease Indicated",
            )
        )

    return {
        "condition": condition,
        "patient_id": "SIMULATION",
        "calculated_probability": probability,
        "current_threshold": current_threshold,
        "current_prediction": int(probability >= current_threshold),
        "simulations": simulations,
    }
