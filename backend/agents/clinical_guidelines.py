"""Clinical Guidelines Knowledge Base for Chronic Disease Decision Support.

References:
- American Diabetes Association (ADA) Standards of Medical Care in Diabetes.
- 2019/2023 ACC/AHA Guideline on Primary Prevention of Cardiovascular Disease.
- Eighth Joint National Committee (JNC 8) / 2017 ACC/AHA Hypertension Guidelines.
"""

from typing import Dict, Any, List

DIABETES_GUIDELINES = {
    "screening": {
        "fasting_glucose": {
            "name": "Fasting Plasma Glucose (FPG)",
            "normal": "< 100 mg/dL",
            "prediabetes": "100 - 125 mg/dL",
            "diabetes": ">= 126 mg/dL",
            "frequency": "Annually for high-risk patients, every 3 years for low-risk over age 35",
        },
        "hba1c": {
            "name": "Hemoglobin A1c (HbA1c)",
            "normal": "< 5.7%",
            "prediabetes": "5.7% - 6.4%",
            "diabetes": ">= 6.5%",
            "frequency": "Initial diagnostic workup, followed by bi-annual monitoring",
        },
        "oral_glucose": {
            "name": "75g Oral Glucose Tolerance Test (OGTT)",
            "normal": "< 140 mg/dL (2-hour)",
            "prediabetes": "140 - 199 mg/dL",
            "diabetes": ">= 200 mg/dL",
        },
    },
    "lifestyle_targets": {
        "physical_activity": "At least 150 minutes/week of moderate-to-vigorous aerobic activity spread over at least 3 days/week, with no more than 2 consecutive days without exercise.",
        "weight_loss": "Aim for 7% body weight reduction if BMI >= 25 kg/m2, which reduces progression to diabetes by up to 58%.",
        "diet": "Mediterranean or DASH dietary pattern rich in whole grains, fiber (>=14g/1000 kcal), lean proteins, and minimal ultra-processed refined carbohydrates.",
    },
    "pharmacotherapy_discussion": {
        "metformin": "Consider initiating Metformin for prediabetes prevention in adults aged 25-59 with BMI >= 35 kg/m2, higher fasting plasma glucose, or prior gestational diabetes.",
        "cardiovascular_protection": "For patients with both diabetes and established atherosclerotic cardiovascular disease or high CV risk, prioritize SGLT2 inhibitors or GLP-1 receptor agonists with proven cardiovascular event reduction.",
    },
}

CARDIOVASCULAR_GUIDELINES = {
    "blood_pressure": {
        "normal": "< 120/80 mm Hg",
        "elevated": "120-129 / < 80 mm Hg",
        "stage_1_hypertension": "130-139 / 80-89 mm Hg",
        "stage_2_hypertension": ">= 140 / >= 90 mm Hg",
        "target_goal": "< 130/80 mm Hg for patients with elevated ASCVD risk",
    },
    "lipid_management": {
        "ldl_target": "< 70 mg/dL for high risk, < 55 mg/dL for very high risk",
        "statin_benefit_groups": [
            "Patients with clinical atherosclerotic cardiovascular disease (ASCVD)",
            "Patients with severe primary hypercholesterolemia (LDL-C >= 190 mg/dL)",
            "Patients aged 40-75 with diabetes mellitus and LDL-C >= 70 mg/dL",
            "Patients aged 40-75 with 10-year ASCVD risk >= 7.5% and LDL-C 70-189 mg/dL",
        ],
    },
    "diagnostic_indications": {
        "chest_pain_evaluation": "Symptomatic presentation with chest pain warrants 12-lead resting ECG, high-sensitivity cardiac troponins (if acute), and non-invasive functional imaging or Coronary Computed Tomography Angiography (CCTA).",
        "exercise_stress_test": "Indicated when intermediate pre-test probability exists with interpretable baseline ECG.",
        "invasive_coronary_angiography": "Recommended for high-risk presentations with multi-vessel involvement (ca >= 2) or marked ST depression (oldpeak >= 2.0 mm).",
    },
    "lifestyle_targets": {
        "diet": "Low saturated fat (<7% total calories), Mediterranean or plant-predominant dietary pattern, sodium restricted to < 2,300 mg/day (ideally < 1,500 mg/day).",
        "exercise": "At least 150 minutes/week of moderate-intensity or 75 minutes/week of vigorous-intensity physical activity.",
        "smoking_cessation": "Complete abstinence from tobacco; active intervention with behavioral support and pharmacotherapy if indicated.",
    },
}

CARDIOMETABOLIC_SYNERGY = {
    "overview": "Type 2 diabetes independently doubles to quadruples cardiovascular morbidity and mortality. Microvascular and macrovascular risks multiply when hypertension, dyslipidemia, and dysglycemia co-occur.",
    "treatment_goals": [
        "Simultaneous blood pressure control (<130/80 mm Hg)",
        "Statin therapy for LDL-C reduction",
        "Glycemic control with organ-protective anti-hyperglycemic agents (SGLT2i / GLP-1 RA)",
        "Daily moderate-intensity physical activity",
    ],
}
