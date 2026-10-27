"""Agentic Decision-Support Engine for Chronic Disease Management.

Synthesizes machine learning risk scores, local feature attributions,
and codified clinical guidelines into structured, explainable clinical recommendations.
"""

from typing import Dict, Any, List, Optional
from backend.agents.clinical_guidelines import (
    DIABETES_GUIDELINES,
    CARDIOVASCULAR_GUIDELINES,
    CARDIOMETABOLIC_SYNERGY,
)


class ClinicalDecisionSupportAgent:
    """Multi-condition agentic decision-support system."""

    def evaluate_diabetes_case(
        self,
        prediction_result: Dict[str, Any],
        features: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Formulate clinical decision support for diabetes risk profile.
        """
        probability = prediction_result["probability"]
        risk_tier = prediction_result["risk_tier"]
        top_risk_factors = prediction_result.get("top_risk_factors", [])

        alerts: List[Dict[str, str]] = []
        diagnostics: List[Dict[str, str]] = []
        lifestyle: List[Dict[str, str]] = []
        discussion_points: List[str] = []
        reasoning_trace: List[str] = []

        reasoning_trace.append(
            f"Evaluated ML model probability: {probability:.1%} -> Stratified into {risk_tier} Risk Tier."
        )

        # High priority clinical alerts
        bmi = float(features.get("BMI", 0))
        high_bp = int(features.get("HighBP", 0))
        high_chol = int(features.get("HighChol", 0))
        heart_hist = int(features.get("HeartDiseaseorAttack", 0))
        stroke_hist = int(features.get("Stroke", 0))
        gen_hlth = int(features.get("GenHlth", 1))

        if bmi >= 35:
            alerts.append({
                "severity": "High",
                "title": "Severe Obesity (Class II/III BMI >= 35)",
                "description": f"Current BMI of {bmi:.1f} exponentially increases insulin resistance and cardiometabolic strain.",
            })
            reasoning_trace.append(
                f"Triggered Alert: BMI {bmi:.1f} exceeds threshold of 35.0 kg/m2."
            )
        elif bmi >= 30:
            alerts.append({
                "severity": "Moderate",
                "title": "Obesity (Class I BMI 30-34.9)",
                "description": f"BMI of {bmi:.1f} is a major modifiable risk driver for metabolic dysfunction.",
            })
            reasoning_trace.append(f"Noted: Obese BMI range ({bmi:.1f}).")

        if high_bp == 1 and high_chol == 1:
            alerts.append({
                "severity": "High",
                "title": "Concomitant Metabolic Syndrome Components",
                "description": "Patient presents with dual hypertension and hyperlipidemia, magnifying macrovascular risk.",
            })
            reasoning_trace.append(
                "Triggered Rule: Combined HighBP=1 and HighChol=1 indicates metabolic syndrome cluster."
            )

        if heart_hist == 1 or stroke_hist == 1:
            alerts.append({
                "severity": "High",
                "title": "Established Vascular / Coronary Disease History",
                "description": "History of cardiovascular or cerebrovascular event establishes high-risk category requiring aggressive secondary prevention.",
            })
            reasoning_trace.append("Triggered Rule: Pre-existing vascular disease history identified.")

        # Diagnostic Recommendations
        if risk_tier in ["Moderate", "High"]:
            diagnostics.append({
                "test": "Fasting Plasma Glucose (FPG) & HbA1c",
                "guideline": "ADA Standard of Care",
                "rationale": "Confirm current glycemic status and distinguish between normoglycemia, prediabetes (HbA1c 5.7-6.4%), and overt diabetes (HbA1c >= 6.5%).",
            })
            diagnostics.append({
                "test": "Comprehensive Lipid Panel (Total, LDL-C, HDL-C, Triglycerides)",
                "guideline": "ACC/AHA ASCVD Prevention",
                "rationale": "Assess atherogenic dyslipidemia frequently associated with insulin resistance (high triglycerides, low HDL).",
            })
            diagnostics.append({
                "test": "Comprehensive Metabolic Panel (CMP) + Urine Albumin-to-Creatinine Ratio (uACR)",
                "guideline": "KDIGO / ADA Guidelines",
                "rationale": "Baseline renal function evaluation and early microvascular screening.",
            })
            reasoning_trace.append(
                "Diagnostic Action: Recommended FPG, HbA1c, comprehensive lipid panel, and renal microalbuminuria check."
            )
        else:
            diagnostics.append({
                "test": "Routine Biennial Fasting Glucose / HbA1c Screen",
                "guideline": "ADA Preventive Screening",
                "rationale": "Low immediate risk profile; periodic routine surveillance recommended every 2-3 years if age >= 35.",
            })

        # Lifestyle & Behavioral Interventions
        phys_act = int(features.get("PhysActivity", 0))
        fruits = int(features.get("Fruits", 0))
        veggies = int(features.get("Veggies", 0))
        smoker = int(features.get("Smoker", 0))

        if phys_act == 0:
            lifestyle.append({
                "domain": "Physical Activity",
                "target": "150 mins/week moderate-intensity aerobic exercise",
                "action": "Initiate structured walking program (e.g., 30 mins 5 days/week) combined with resistance training 2 days/week.",
            })
            reasoning_trace.append("Lifestyle Action: Sedentary status identified -> Prescribed aerobic physical activity protocol.")

        if fruits == 0 or veggies == 0:
            lifestyle.append({
                "domain": "Nutrition & Dietary Pattern",
                "target": "Mediterranean or DASH dietary pattern",
                "action": "Increase daily leafy vegetables, whole fruits, soluble fiber (>14g/1000 kcal), and eliminate sugar-sweetened beverages.",
            })
            reasoning_trace.append("Lifestyle Action: Suboptimal fruit/vegetable intake detected -> Prescribed DASH/Mediterranean guidelines.")

        if smoker == 1:
            lifestyle.append({
                "domain": "Tobacco Cessation",
                "target": "Complete tobacco cessation",
                "action": "Refer to smoking cessation counseling and evaluate pharmacotherapy (NRT, bupropion, varenicline) if actively smoking.",
            })
            reasoning_trace.append("Lifestyle Action: Smoking history flagged -> Tobacco cessation protocol recommended.")

        if bmi >= 25:
            lifestyle.append({
                "domain": "Weight Management",
                "target": "5% - 7% weight reduction",
                "action": "A 7% sustained reduction in body weight reduces progression from prediabetes to Type 2 diabetes by up to 58% (Diabetes Prevention Program).",
            })

        # Discussion points for clinician
        if risk_tier == "High":
            discussion_points.append(
                "Discuss immediate referral to a Diabetes Self-Management Education and Support (DSMES) accredited program."
            )
            discussion_points.append(
                "Evaluate initiation of Metformin if HbA1c in prediabetes range and BMI >= 35 or age < 60."
            )
            discussion_points.append(
                "Optimize blood pressure to target < 130/80 mm Hg using ACE inhibitor or ARB if albuminuria present."
            )
        elif risk_tier == "Moderate":
            discussion_points.append(
                "Review lifestyle modification strategies and schedule follow-up HbA1c review in 3-6 months."
            )
            discussion_points.append(
                "Verify whether home blood pressure monitoring is indicated."
            )
        else:
            discussion_points.append(
                "Encourage continuation of current healthy lifestyle habits and re-screen during annual physical exam."
            )

        # Urgency determination
        if alerts and any(a["severity"] == "High" for a in alerts) and risk_tier == "High":
            urgency = "Prompt Clinical Review (Within 1-2 Weeks)"
        elif risk_tier in ["Moderate", "High"]:
            urgency = "Recommended Follow-Up (Within 4 Weeks)"
        else:
            urgency = "Routine Preventive Health Care"

        return {
            "condition": "Diabetes",
            "urgency": urgency,
            "risk_tier": risk_tier,
            "probability": probability,
            "clinical_alerts": alerts,
            "recommended_diagnostic_workup": diagnostics,
            "lifestyle_action_plan": lifestyle,
            "clinical_discussion_points": discussion_points,
            "reasoning_trace": reasoning_trace,
        }

    def evaluate_heart_disease_case(
        self,
        prediction_result: Dict[str, Any],
        features: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Formulate clinical decision support for coronary artery disease / heart disease.
        """
        probability = prediction_result["probability"]
        risk_tier = prediction_result["risk_tier"]

        alerts: List[Dict[str, str]] = []
        diagnostics: List[Dict[str, str]] = []
        lifestyle: List[Dict[str, str]] = []
        discussion_points: List[str] = []
        reasoning_trace: List[str] = []

        reasoning_trace.append(
            f"Evaluated Heart Disease ML model probability: {probability:.1%} -> Stratified into {risk_tier} Risk Tier."
        )

        age = float(features.get("age", 50))
        cp = int(features.get("cp", 4))
        trestbps = float(features.get("trestbps", 120))
        chol = float(features.get("chol", 200))
        oldpeak = float(features.get("oldpeak", 0.0))
        ca = int(features.get("ca", 0))
        exang = int(features.get("exang", 0))
        thal = int(features.get("thal", 3))

        # Critical coronary alerts
        if cp in [1, 2] and exang == 1:
            alerts.append({
                "severity": "High",
                "title": "Angina Symptoms with Exercise Provocation",
                "description": "Patient experiences angina symptoms that are elicited by exertion, indicative of inducible myocardial ischemia.",
            })
            reasoning_trace.append("Triggered Alert: Chest pain with exercise-induced angina (exang=1).")

        if oldpeak >= 2.0:
            alerts.append({
                "severity": "High",
                "title": f"Significant ST Segment Depression ({oldpeak:.1f} mm)",
                "description": "ST depression >= 2.0 mm on stress testing is strongly associated with severe multi-vessel CAD or left main disease.",
            })
            reasoning_trace.append(f"Triggered Alert: ST segment depression oldpeak={oldpeak:.1f} mm >= 2.0 mm.")

        if trestbps >= 160:
            alerts.append({
                "severity": "High",
                "title": f"Stage 2 Severe Hypertension ({trestbps:.0f} mm Hg)",
                "description": "Systolic blood pressure >= 160 mm Hg imposes acute afterload strain and increases stroke/infarction risk.",
            })
            reasoning_trace.append(f"Triggered Alert: Resting blood pressure trestbps={trestbps:.0f} mm Hg >= 160.")
        elif trestbps >= 140:
            alerts.append({
                "severity": "Moderate",
                "title": f"Stage 2 Hypertension ({trestbps:.0f} mm Hg)",
                "description": "Systolic blood pressure >= 140 mm Hg exceeds ACC/AHA target guidelines (< 130 mm Hg).",
            })

        if chol >= 240:
            alerts.append({
                "severity": "Moderate",
                "title": f"Hypercholesterolemia ({chol:.0f} mg/dL)",
                "description": "Total serum cholesterol >= 240 mg/dL accelerates atherogenesis.",
            })

        if ca >= 2:
            alerts.append({
                "severity": "High",
                "title": f"Multi-Vessel Calcification / Obstruction ({ca} vessels)",
                "description": "Fluoroscopy detects calcification in multiple major coronary arteries, indicating advanced disease burden.",
            })
            reasoning_trace.append(f"Triggered Alert: ca={ca} vessels calcified/diseased.")

        # Diagnostics
        if risk_tier == "High" or oldpeak >= 1.5 or ca >= 1:
            diagnostics.append({
                "test": "Cardiology Consultation & Coronary CTA / Stress Echocardiogram",
                "guideline": "ACC/AHA Chest Pain Guidelines",
                "rationale": "High-risk features or abnormal ST depression warrant anatomical and functional coronary evaluation.",
            })
            diagnostics.append({
                "test": "High-Sensitivity Troponin & Serial 12-Lead ECG",
                "guideline": "Acute Coronary Evaluation",
                "rationale": "Exclude active or recent ischemic myocardial injury.",
            })
            diagnostics.append({
                "test": "Lipid Subfraction & Apolipoprotein B (ApoB)",
                "guideline": "Advanced Lipid Panel",
                "rationale": "Accurately quantify atherogenic particle count to guide intensive lipid-lowering therapy.",
            })
            reasoning_trace.append("Diagnostic Action: Recommended Cardiology consultation, imaging/stress testing, and ApoB.")
        elif risk_tier == "Moderate":
            diagnostics.append({
                "test": "Non-Invasive Exercise Treadmill Stress Test (ETT)",
                "guideline": "ACC/AHA Diagnostic Guidance",
                "rationale": "Evaluate functional exercise tolerance, ischemic ST changes, and chronotropic response.",
            })
            diagnostics.append({
                "test": "Coronary Artery Calcium (CAC) Scoring",
                "guideline": "Primary Prevention ASCVD Guideline",
                "rationale": "Refines 10-year risk stratification to determine necessity of statin initiation.",
            })
            reasoning_trace.append("Diagnostic Action: Recommended ETT and Coronary Artery Calcium (CAC) scoring.")
        else:
            diagnostics.append({
                "test": "Annual Blood Pressure & Lipid Monitoring",
                "guideline": "Preventive Cardiology Surveillance",
                "rationale": "Maintain routine baseline tracking of vascular parameters.",
            })

        # Lifestyle
        lifestyle.append({
            "domain": "Cardiovascular Diet",
            "target": "DASH / Mediterranean Protocol (Sodium < 2,300 mg/day)",
            "action": "Emphasize omega-3 fatty acids, nuts, legumes, and drastically minimize dietary saturated fats (<7% energy) and sodium.",
        })
        lifestyle.append({
            "domain": "Structured Aerobic Exercise",
            "target": "150 mins/week moderate activity",
            "action": "Ensure physician clearance before high-intensity exertion if symptomatic or older than 50 with multiple risk factors.",
        })

        # Discussion Points
        if risk_tier == "High":
            discussion_points.append(
                "Evaluate initiation of high-intensity statin therapy (e.g. Atorvastatin 40-80 mg or Rosuvastatin 20-40 mg) to achieve >= 50% LDL-C reduction."
            )
            discussion_points.append(
                "Consider anti-platelet therapy (low-dose aspirin 81 mg daily) after balancing ischemic versus bleeding risk."
            )
            discussion_points.append(
                "Tight blood pressure control aiming for < 130/80 mm Hg with cardioprotective antihypertensives."
            )
        elif risk_tier == "Moderate":
            discussion_points.append(
                "Calculate formal 10-year pooled cohort ASCVD score to guide shared decision-making regarding moderate-intensity statin therapy."
            )
            discussion_points.append(
                "Discuss home blood pressure log and stress reduction strategies."
            )
        else:
            discussion_points.append(
                "Reinforce cardioprotective dietary and physical activity habits."
            )

        if any(a["severity"] == "High" for a in alerts):
            urgency = "Urgent Clinical Review (Within 24-48 Hours if Symptomatic)"
        elif risk_tier == "High":
            urgency = "Prompt Cardiology / PCP Review (Within 1-2 Weeks)"
        elif risk_tier == "Moderate":
            urgency = "Recommended Follow-Up (Within 4 Weeks)"
        else:
            urgency = "Routine Preventive Health Care"

        return {
            "condition": "Coronary Heart Disease",
            "urgency": urgency,
            "risk_tier": risk_tier,
            "probability": probability,
            "clinical_alerts": alerts,
            "recommended_diagnostic_workup": diagnostics,
            "lifestyle_action_plan": lifestyle,
            "clinical_discussion_points": discussion_points,
            "reasoning_trace": reasoning_trace,
        }

    def evaluate_comprehensive_case(
        self,
        diabetes_result: Dict[str, Any],
        heart_disease_result: Dict[str, Any],
        patient_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Cross-evaluate diabetes and cardiovascular disease synergistically.
        """
        dia_prob = diabetes_result["probability"]
        cad_prob = heart_disease_result["probability"]
        dia_tier = diabetes_result["risk_tier"]
        cad_tier = heart_disease_result["risk_tier"]

        reasoning_trace: List[str] = [
            f"Multi-condition analysis: Diabetes Risk = {dia_prob:.1%} ({dia_tier}), CAD Risk = {cad_prob:.1%} ({cad_tier})."
        ]

        synergy_alerts: List[Dict[str, str]] = []
        holistic_plan: List[str] = []

        # Cross-disease interactions
        is_high_metabolic = dia_tier in ["Moderate", "High"]
        is_high_cardiac = cad_tier in ["Moderate", "High"]

        if is_high_metabolic and is_high_cardiac:
            synergy_alerts.append({
                "severity": "Critical",
                "title": "Combined Cardiometabolic Risk Multiplier",
                "description": "Patients with both elevated diabetes and coronary disease risk experience compounded atherosclerotic progression and elevated event rates.",
            })
            reasoning_trace.append(
                "Cross-Condition Synergy Alert: Elevated risk across both metabolic and cardiovascular axes."
            )

            holistic_plan.append(
                "Prioritize guideline-directed medical therapy that concurrently targets glycemic and cardiovascular outcomes (e.g., SGLT2 inhibitors or GLP-1 receptor agonists with proven CV benefit)."
            )
            holistic_plan.append(
                "Aggressive blood pressure target of < 130/80 mm Hg using RAAS blockade (ACEi or ARB) to provide dual nephroprotection and cardioprotection."
            )
            holistic_plan.append(
                "High-intensity statin therapy to lower LDL cholesterol below 70 mg/dL (or >= 50% reduction from baseline)."
            )
            overall_urgency = "Urgent Multi-Disciplinary Review (Primary Care & Cardiology)"
        elif is_high_cardiac:
            overall_urgency = "Prompt Cardiovascular Consultation"
            holistic_plan.append("Address coronary ischemia and structural heart disease risks as top priority.")
        elif is_high_metabolic:
            overall_urgency = "Prompt Endocrine / Metabolic Consultation"
            holistic_plan.append("Focus on intensive lifestyle and glycemic management to prevent vascular complications.")
        else:
            overall_urgency = "Routine Preventive Health Care"
            holistic_plan.append("Maintain healthy lifestyle behaviors and continue standard preventive health screening.")

        return {
            "overall_urgency": overall_urgency,
            "diabetes_summary": {
                "probability": dia_prob,
                "percentage": round(dia_prob * 100, 2),
                "risk_tier": dia_tier,
                "top_risk_factors": diabetes_result.get("top_risk_factors", [])[:3],
            },
            "heart_disease_summary": {
                "probability": cad_prob,
                "percentage": round(cad_prob * 100, 2),
                "risk_tier": cad_tier,
                "top_risk_factors": heart_disease_result.get("top_risk_factors", [])[:3],
            },
            "cardiometabolic_synergy_alerts": synergy_alerts,
            "integrated_management_plan": holistic_plan,
            "reasoning_trace": reasoning_trace,
        }


# Global singleton instance
decision_agent = ClinicalDecisionSupportAgent()
