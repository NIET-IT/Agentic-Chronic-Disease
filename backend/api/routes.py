"""FastAPI REST routes for chronic disease prediction and agentic decision support."""

from fastapi import APIRouter, HTTPException, status
from backend.api.schemas import (
    DiabetesInput,
    HeartDiseaseInput,
    ComprehensiveAssessmentInput,
    PredictionOutput,
    DecisionSupportOutput,
    DiseaseDecisionPair,
    ComprehensiveResponse,
    HealthResponse,
)
from backend.services.diabetes_service import (
    diabetes_service,
    DIABETES_FEATURE_METADATA,
)
from backend.services.heart_disease_service import (
    heart_disease_service,
    CAD_FEATURE_METADATA,
)
from backend.agents.decision_agent import decision_agent

router = APIRouter(prefix="/api/v1", tags=["Chronic Disease System"])


@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint indicating model loading status."""
    return {
        "status": "healthy",
        "diabetes_model": "Logistic Regression (StandardScaler, class_weight='balanced')",
        "heart_disease_model": "Logistic Regression (SimpleImputer, StandardScaler)",
        "version": "1.0.0",
    }


@router.get("/metadata/features")
def get_features_metadata():
    """Return dictionary of feature metadata and categories for dynamic frontend forms."""
    return {
        "diabetes": DIABETES_FEATURE_METADATA,
        "heart_disease": CAD_FEATURE_METADATA,
    }


@router.post("/predict/diabetes", response_model=PredictionOutput)
def predict_diabetes(payload: DiabetesInput):
    """Predict diabetes / prediabetes probability, tier, and local feature contributions."""
    try:
        data = payload.model_dump()
        threshold = data.pop("threshold", 0.50)
        return diabetes_service.predict(data, threshold=threshold)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Diabetes prediction failure: {str(exc)}",
        )


@router.post("/decision-support/diabetes", response_model=DiseaseDecisionPair)
def diabetes_decision_support(payload: DiabetesInput):
    """Full diabetes evaluation: risk prediction combined with agentic clinical decision support."""
    try:
        data = payload.model_dump()
        threshold = data.pop("threshold", 0.50)
        prediction = diabetes_service.predict(data, threshold=threshold)
        decision_support = decision_agent.evaluate_diabetes_case(prediction, data)
        return {
            "prediction": prediction,
            "decision_support": decision_support,
        }
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Diabetes decision support failure: {str(exc)}",
        )


@router.post("/predict/heart-disease", response_model=PredictionOutput)
def predict_heart_disease(payload: HeartDiseaseInput):
    """Predict coronary artery disease probability, tier, and local feature attributions."""
    try:
        data = payload.model_dump()
        threshold = data.pop("threshold", 0.50)
        return heart_disease_service.predict(data, threshold=threshold)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Heart disease prediction failure: {str(exc)}",
        )


@router.post("/decision-support/heart-disease", response_model=DiseaseDecisionPair)
def heart_disease_decision_support(payload: HeartDiseaseInput):
    """Full heart disease evaluation: risk prediction combined with agentic clinical decision support."""
    try:
        data = payload.model_dump()
        threshold = data.pop("threshold", 0.50)
        prediction = heart_disease_service.predict(data, threshold=threshold)
        decision_support = decision_agent.evaluate_heart_disease_case(prediction, data)
        return {
            "prediction": prediction,
            "decision_support": decision_support,
        }
    except Exception as exc:
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
        dia_data = payload.diabetes_data.model_dump()
        dia_thresh = dia_data.pop("threshold", 0.50)
        dia_prediction = diabetes_service.predict(dia_data, threshold=dia_thresh)
        dia_decision = decision_agent.evaluate_diabetes_case(dia_prediction, dia_data)

        cad_data = payload.heart_disease_data.model_dump()
        cad_thresh = cad_data.pop("threshold", 0.50)
        cad_prediction = heart_disease_service.predict(cad_data, threshold=cad_thresh)
        cad_decision = decision_agent.evaluate_heart_disease_case(cad_prediction, cad_data)

        holistic = decision_agent.evaluate_comprehensive_case(
            dia_prediction, cad_prediction, {"diabetes": dia_data, "heart_disease": cad_data}
        )

        return {
            "patient_id": payload.patient_id,
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
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Comprehensive evaluation failure: {str(exc)}",
        )
