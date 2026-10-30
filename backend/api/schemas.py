"""Pydantic request and response schemas for chronic disease prediction and decision support."""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


# ----------------------------------------
# Input Schemas
# ----------------------------------------

class DiabetesInput(BaseModel):
    patient_id: Optional[str] = Field("PT-DEFAULT", description="Patient identifier")
    HighBP: int = Field(..., ge=0, le=1, description="High blood pressure (0=No, 1=Yes)")
    HighChol: int = Field(..., ge=0, le=1, description="High cholesterol (0=No, 1=Yes)")
    CholCheck: int = Field(1, ge=0, le=1, description="Cholesterol checked in past 5 years (0=No, 1=Yes)")
    BMI: float = Field(..., ge=10.0, le=80.0, description="Body Mass Index (kg/m2)")
    Smoker: int = Field(..., ge=0, le=1, description="Smoked >= 100 cigarettes (0=No, 1=Yes)")
    Stroke: int = Field(0, ge=0, le=1, description="History of stroke (0=No, 1=Yes)")
    HeartDiseaseorAttack: int = Field(0, ge=0, le=1, description="Coronary heart disease or MI (0=No, 1=Yes)")
    PhysActivity: int = Field(..., ge=0, le=1, description="Physical activity in past 30 days (0=No, 1=Yes)")
    Fruits: int = Field(1, ge=0, le=1, description="Consumes fruit >= 1/day (0=No, 1=Yes)")
    Veggies: int = Field(1, ge=0, le=1, description="Consumes vegetables >= 1/day (0=No, 1=Yes)")
    HvyAlcoholConsump: int = Field(0, ge=0, le=1, description="Heavy alcohol consumption (0=No, 1=Yes)")
    AnyHealthcare: int = Field(1, ge=0, le=1, description="Has healthcare coverage (0=No, 1=Yes)")
    NoDocbcCost: int = Field(0, ge=0, le=1, description="Deferred doctor visit due to cost (0=No, 1=Yes)")
    GenHlth: int = Field(3, ge=1, le=5, description="General health rating (1=Excellent to 5=Poor)")
    MentHlth: float = Field(0.0, ge=0.0, le=30.0, description="Days of poor mental health in past 30 days")
    PhysHlth: float = Field(0.0, ge=0.0, le=30.0, description="Days of physical illness/injury in past 30 days")
    DiffWalk: int = Field(0, ge=0, le=1, description="Difficulty walking or climbing stairs (0=No, 1=Yes)")
    Sex: int = Field(..., ge=0, le=1, description="Biological sex (0=Female, 1=Male)")
    Age: int = Field(..., ge=1, le=13, description="Age bracket (1: 18-24 ... 9: 60-64 ... 13: 80+)")
    Education: int = Field(4, ge=1, le=6, description="Education level (1 to 6)")
    Income: int = Field(5, ge=1, le=8, description="Income scale (1 to 8)")
    threshold: Optional[float] = Field(0.50, ge=0.05, le=0.95, description="Classification decision threshold")


class HeartDiseaseInput(BaseModel):
    patient_id: Optional[str] = Field("PT-DEFAULT", description="Patient identifier")
    age: float = Field(..., ge=18.0, le=120.0, description="Age in years")
    sex: int = Field(..., ge=0, le=1, description="Sex (1=Male, 0=Female)")
    cp: int = Field(..., ge=1, le=4, description="Chest Pain Type (1: Typical Angina, 2: Atypical, 3: Non-Anginal, 4: Asymptomatic)")
    trestbps: float = Field(..., ge=60.0, le=260.0, description="Resting blood pressure (mm Hg)")
    chol: float = Field(..., ge=80.0, le=650.0, description="Serum cholesterol (mg/dL)")
    fbs: int = Field(0, ge=0, le=1, description="Fasting blood sugar > 120 mg/dL (1=True, 0=False)")
    restecg: int = Field(0, ge=0, le=2, description="Resting ECG (0: Normal, 1: ST-T wave abnormality, 2: LVH)")
    thalach: float = Field(..., ge=50.0, le=240.0, description="Maximum heart rate achieved (bpm)")
    exang: int = Field(0, ge=0, le=1, description="Exercise-induced angina (1=Yes, 0=No)")
    oldpeak: float = Field(0.0, ge=0.0, le=10.0, description="ST depression induced by exercise relative to rest (mm)")
    slope: int = Field(1, ge=1, le=3, description="Slope of peak exercise ST segment (1: Upsloping, 2: Flat, 3: Downsloping)")
    ca: int = Field(0, ge=0, le=3, description="Number of major vessels (0-3) colored by fluoroscopy")
    thal: int = Field(3, description="Thallium scintigraphy (3: Normal, 6: Fixed defect, 7: Reversible defect)")
    threshold: Optional[float] = Field(0.50, ge=0.05, le=0.95, description="Classification decision threshold")


class ComprehensiveAssessmentInput(BaseModel):
    patient_id: Optional[str] = Field("PT-1001", description="Patient identifier")
    diabetes_data: DiabetesInput
    heart_disease_data: HeartDiseaseInput


# ----------------------------------------
# Output Schemas
# ----------------------------------------

class FeatureContribution(BaseModel):
    feature: str
    label: str
    value: float
    coefficient: float
    scaled_value: float
    impact: float
    direction: str
    category: Optional[str] = "general"
    unit: Optional[str] = ""


class PredictionOutput(BaseModel):
    condition: str
    prediction: int
    probability: float
    percentage: float
    threshold: float
    risk_tier: str
    risk_color: str
    feature_contributions: List[FeatureContribution]
    top_risk_factors: List[FeatureContribution]
    top_protective_factors: List[FeatureContribution]
    assessment_id: Optional[str] = None
    patient_id: Optional[str] = None
    clinical_target_note: Optional[str] = None


class ClinicalAlert(BaseModel):
    severity: str
    title: str
    description: str


class DiagnosticRecommendation(BaseModel):
    test: str
    guideline: str
    rationale: str


class LifestyleTarget(BaseModel):
    domain: str
    target: str
    action: str


class DecisionSupportOutput(BaseModel):
    condition: str
    urgency: str
    risk_tier: str
    probability: float
    clinical_alerts: List[ClinicalAlert]
    recommended_diagnostic_workup: List[DiagnosticRecommendation]
    lifestyle_action_plan: List[LifestyleTarget]
    clinical_discussion_points: List[str]
    reasoning_trace: List[str]


class DiseaseDecisionPair(BaseModel):
    prediction: PredictionOutput
    decision_support: DecisionSupportOutput


class ComprehensiveResponse(BaseModel):
    comprehensive_id: Optional[str] = None
    patient_id: Optional[str]
    overall_urgency: str
    diabetes_assessment: DiseaseDecisionPair
    heart_disease_assessment: DiseaseDecisionPair
    cardiometabolic_synergy_alerts: List[ClinicalAlert]
    integrated_management_plan: List[str]
    reasoning_trace: List[str]


class HealthResponse(BaseModel):
    status: str
    diabetes_model: str
    heart_disease_model: str
    database_status: Optional[str] = "connected"
    version: str


# ----------------------------------------
# Patient & History Persistence Schemas
# ----------------------------------------

class AuthLoginRequest(BaseModel):
    email: str = Field(..., description="User email or patient ID")
    password: Optional[str] = Field(None, description="User password")


class PatientCreate(BaseModel):
    patient_id: str = Field(..., description="Unique patient identifier")
    name: Optional[str] = Field(None, description="Patient name or alias")
    age: Optional[float] = Field(None, ge=0.0, le=130.0, description="Age in years")
    sex: Optional[int] = Field(None, ge=0, le=1, description="Biological sex (0=Female, 1=Male)")


class PatientResponse(BaseModel):
    patient_id: str
    name: Optional[str]
    age: Optional[float]
    sex: Optional[int]
    created_at: str
    updated_at: str


class AssessmentHistoryItem(BaseModel):
    id: int
    assessment_id: str
    patient_id: str
    condition: str
    prediction: int
    probability: float
    risk_tier: str
    risk_color: str
    threshold: float
    urgency: Optional[str]
    created_at: str


class AssessmentHistoryResponse(BaseModel):
    total: int
    items: List[AssessmentHistoryItem]


class ExplainabilitySummary(BaseModel):
    condition: str
    model_name: str
    feature_count: int
    top_influential_features: List[Dict[str, Any]]
    clinical_context: str


class ThresholdSimulationItem(BaseModel):
    threshold: float
    simulated_prediction: int
    classification_label: str


class ThresholdSimulationResponse(BaseModel):
    condition: str
    patient_id: Optional[str]
    calculated_probability: float
    current_threshold: float
    current_prediction: int
    simulations: List[ThresholdSimulationItem]

