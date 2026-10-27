/* ============================================================
   CardioMetabolic Agentic AI — Frontend Application Logic
   ============================================================ */

const API_BASE = window.location.origin.includes("http") 
  ? window.location.origin 
  : "http://127.0.0.1:8000";

let currentMode = "comprehensive"; // 'comprehensive' | 'diabetes' | 'cad'

// Patient Presets
const PRESETS = {
  healthy: {
    diabetes: {
      HighBP: 0,
      HighChol: 0,
      CholCheck: 1,
      BMI: 22.8,
      Smoker: 0,
      Stroke: 0,
      HeartDiseaseorAttack: 0,
      PhysActivity: 1,
      Fruits: 1,
      Veggies: 1,
      HvyAlcoholConsump: 0,
      AnyHealthcare: 1,
      NoDocbcCost: 0,
      GenHlth: 1,
      MentHlth: 0,
      PhysHlth: 0,
      DiffWalk: 0,
      Sex: 0,
      Age: 5,
      Education: 6,
      Income: 7,
    },
    cad: {
      age: 42,
      sex: 0,
      cp: 3,
      trestbps: 116,
      chol: 178,
      fbs: 0,
      restecg: 0,
      thalach: 168,
      exang: 0,
      oldpeak: 0.2,
      slope: 1,
      ca: 0,
      thal: 3,
    },
  },
  moderate: {
    diabetes: {
      HighBP: 1,
      HighChol: 1,
      CholCheck: 1,
      BMI: 29.4,
      Smoker: 0,
      Stroke: 0,
      HeartDiseaseorAttack: 0,
      PhysActivity: 1,
      Fruits: 1,
      Veggies: 1,
      HvyAlcoholConsump: 0,
      AnyHealthcare: 1,
      NoDocbcCost: 0,
      GenHlth: 3,
      MentHlth: 2,
      PhysHlth: 2,
      DiffWalk: 0,
      Sex: 1,
      Age: 9,
      Education: 5,
      Income: 6,
    },
    cad: {
      age: 58,
      sex: 1,
      cp: 2,
      trestbps: 136,
      chol: 236,
      fbs: 0,
      restecg: 1,
      thalach: 144,
      exang: 0,
      oldpeak: 1.2,
      slope: 2,
      ca: 1,
      thal: 3,
    },
  },
  high: {
    diabetes: {
      HighBP: 1,
      HighChol: 1,
      CholCheck: 1,
      BMI: 36.2,
      Smoker: 1,
      Stroke: 0,
      HeartDiseaseorAttack: 1,
      PhysActivity: 0,
      Fruits: 0,
      Veggies: 0,
      HvyAlcoholConsump: 0,
      AnyHealthcare: 1,
      NoDocbcCost: 0,
      GenHlth: 4,
      MentHlth: 6,
      PhysHlth: 14,
      DiffWalk: 1,
      Sex: 1,
      Age: 11,
      Education: 4,
      Income: 4,
    },
    cad: {
      age: 66,
      sex: 1,
      cp: 1,
      trestbps: 162,
      chol: 278,
      fbs: 1,
      restecg: 2,
      thalach: 118,
      exang: 1,
      oldpeak: 2.6,
      slope: 2,
      ca: 2,
      thal: 7,
    },
  },
};

// Lifecycle initialization
document.addEventListener("DOMContentLoaded", () => {
  checkSystemStatus();
  loadPatientPreset("moderate");
});

// Check API health
async function checkSystemStatus() {
  const indicator = document.getElementById("system-status-indicator");
  const text = document.getElementById("system-status-text");

  try {
    const res = await fetch(`${API_BASE}/api/v1/health`);
    if (res.ok) {
      const data = await res.json();
      indicator.className = "status-indicator online";
      text.innerText = "System Active & Models Online";
    } else {
      throw new Error("Bad response");
    }
  } catch (err) {
    indicator.className = "status-indicator offline";
    indicator.style.background = "rgba(239, 68, 68, 0.15)";
    indicator.style.borderColor = "rgba(239, 68, 68, 0.4)";
    indicator.style.color = "#f87171";
    text.innerText = "Backend API Connecting...";
  }
}

// Mode switching
function switchTab(mode) {
  currentMode = mode;

  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("active"));
  document.getElementById(`tab-${mode}`).classList.add("active");

  const diaFields = document.getElementById("diabetes-form-fields");
  const cadFields = document.getElementById("cad-form-fields");
  const formTitle = document.getElementById("form-title");
  const formSubtitle = document.getElementById("form-subtitle");

  if (mode === "diabetes") {
    diaFields.classList.remove("hidden");
    cadFields.classList.add("hidden");
    formTitle.innerText = "Diabetes & Prediabetes Risk Parameters";
    formSubtitle.innerText = "CDC Behavioral Risk Factor Surveillance System (BRFSS) clinical indicators";
  } else if (mode === "cad") {
    diaFields.classList.add("hidden");
    cadFields.classList.remove("hidden");
    formTitle.innerText = "Coronary Heart Disease Parameters";
    formSubtitle.innerText = "Cleveland Clinic cardiovascular stress test and clinical vitals";
  } else {
    diaFields.classList.remove("hidden");
    cadFields.classList.remove("hidden");
    formTitle.innerText = "Comprehensive Cardiometabolic Parameters";
    formSubtitle.innerText = "Simultaneous evaluation of metabolic, lifestyle, and cardiovascular parameters";
  }
}

// Load patient preset
function loadPatientPreset(presetKey) {
  document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"));
  const btn = document.getElementById(`btn-preset-${presetKey}`);
  if (btn) btn.classList.add("active");

  const preset = PRESETS[presetKey];
  if (!preset) return;

  // Diabetes fields
  const d = preset.diabetes;
  document.getElementById("dia-bmi").value = d.BMI;
  document.getElementById("dia-age").value = d.Age;
  document.getElementById("dia-genhlth").value = d.GenHlth;
  document.getElementById("dia-physhlth").value = d.PhysHlth;
  document.getElementById("dia-menthlth").value = d.MentHlth;
  document.getElementById("dia-education").value = d.Education;
  document.getElementById("dia-income").value = d.Income;

  document.getElementById("dia-highbp").checked = Boolean(d.HighBP);
  document.getElementById("dia-highchol").checked = Boolean(d.HighChol);
  document.getElementById("dia-cholcheck").checked = Boolean(d.CholCheck);
  document.getElementById("dia-physactivity").checked = Boolean(d.PhysActivity);
  document.getElementById("dia-smoker").checked = Boolean(d.Smoker);
  document.getElementById("dia-heartdisease").checked = Boolean(d.HeartDiseaseorAttack);
  document.getElementById("dia-stroke").checked = Boolean(d.Stroke);
  document.getElementById("dia-diffwalk").checked = Boolean(d.DiffWalk);
  document.getElementById("dia-fruits").checked = Boolean(d.Fruits);
  document.getElementById("dia-veggies").checked = Boolean(d.Veggies);
  document.getElementById("dia-heavyalcohol").checked = Boolean(d.HvyAlcoholConsump);
  document.getElementById("dia-anyhealthcare").checked = Boolean(d.AnyHealthcare);
  document.getElementById("dia-nodocbccost").checked = Boolean(d.NoDocbcCost);

  // CAD fields
  const c = preset.cad;
  document.getElementById("cad-age").value = c.age;
  document.getElementById("cad-sex").value = c.sex;
  document.getElementById("cad-cp").value = c.cp;
  document.getElementById("cad-trestbps").value = c.trestbps;
  document.getElementById("cad-chol").value = c.chol;
  document.getElementById("cad-thalach").value = c.thalach;
  document.getElementById("cad-oldpeak").value = c.oldpeak;
  document.getElementById("cad-slope").value = c.slope;
  document.getElementById("cad-ca").value = c.ca;
  document.getElementById("cad-thal").value = c.thal;
  document.getElementById("cad-restecg").value = c.restecg;
  document.getElementById("cad-fbs").value = c.fbs;
  document.getElementById("cad-exang").checked = Boolean(c.exang);
}

// Extract current form values
function collectFormData() {
  const threshold = parseFloat(document.getElementById("input-threshold").value) || 0.50;

  const diabetes = {
    HighBP: document.getElementById("dia-highbp").checked ? 1 : 0,
    HighChol: document.getElementById("dia-highchol").checked ? 1 : 0,
    CholCheck: document.getElementById("dia-cholcheck").checked ? 1 : 0,
    BMI: parseFloat(document.getElementById("dia-bmi").value),
    Smoker: document.getElementById("dia-smoker").checked ? 1 : 0,
    Stroke: document.getElementById("dia-stroke").checked ? 1 : 0,
    HeartDiseaseorAttack: document.getElementById("dia-heartdisease").checked ? 1 : 0,
    PhysActivity: document.getElementById("dia-physactivity").checked ? 1 : 0,
    Fruits: document.getElementById("dia-fruits").checked ? 1 : 0,
    Veggies: document.getElementById("dia-veggies").checked ? 1 : 0,
    HvyAlcoholConsump: document.getElementById("dia-heavyalcohol").checked ? 1 : 0,
    AnyHealthcare: document.getElementById("dia-anyhealthcare").checked ? 1 : 0,
    NoDocbcCost: document.getElementById("dia-nodocbccost").checked ? 1 : 0,
    GenHlth: parseInt(document.getElementById("dia-genhlth").value, 10),
    MentHlth: parseFloat(document.getElementById("dia-menthlth").value) || 0,
    PhysHlth: parseFloat(document.getElementById("dia-physhlth").value) || 0,
    DiffWalk: document.getElementById("dia-diffwalk").checked ? 1 : 0,
    Sex: parseInt(document.getElementById("cad-sex").value, 10),
    Age: parseInt(document.getElementById("dia-age").value, 10),
    Education: parseInt(document.getElementById("dia-education").value, 10),
    Income: parseInt(document.getElementById("dia-income").value, 10),
    threshold: threshold,
  };

  const cad = {
    age: parseFloat(document.getElementById("cad-age").value),
    sex: parseInt(document.getElementById("cad-sex").value, 10),
    cp: parseInt(document.getElementById("cad-cp").value, 10),
    trestbps: parseFloat(document.getElementById("cad-trestbps").value),
    chol: parseFloat(document.getElementById("cad-chol").value),
    fbs: parseInt(document.getElementById("cad-fbs").value, 10),
    restecg: parseInt(document.getElementById("cad-restecg").value, 10),
    thalach: parseFloat(document.getElementById("cad-thalach").value),
    exang: document.getElementById("cad-exang").checked ? 1 : 0,
    oldpeak: parseFloat(document.getElementById("cad-oldpeak").value),
    slope: parseInt(document.getElementById("cad-slope").value, 10),
    ca: parseInt(document.getElementById("cad-ca").value, 10),
    thal: parseInt(document.getElementById("cad-thal").value, 10),
    threshold: threshold,
  };

  return { diabetes, cad };
}

// Run assessment against API
async function runAssessment() {
  const loadingEl = document.getElementById("results-loading");
  const emptyEl = document.getElementById("results-empty");
  const contentEl = document.getElementById("results-content");

  emptyEl.classList.add("hidden");
  contentEl.classList.add("hidden");
  loadingEl.classList.remove("hidden");

  const { diabetes, cad } = collectFormData();

  try {
    let endpoint = "";
    let payload = {};

    if (currentMode === "diabetes") {
      endpoint = `${API_BASE}/api/v1/decision-support/diabetes`;
      payload = diabetes;
    } else if (currentMode === "cad") {
      endpoint = `${API_BASE}/api/v1/decision-support/heart-disease`;
      payload = cad;
    } else {
      endpoint = `${API_BASE}/api/v1/decision-support/comprehensive`;
      payload = {
        patient_id: "PT-" + Math.floor(1000 + Math.random() * 9000),
        diabetes_data: diabetes,
        heart_disease_data: cad,
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP Error ${response.status}`);
    }

    const data = await response.json();
    renderResults(data);

    loadingEl.classList.add("hidden");
    contentEl.classList.remove("hidden");
  } catch (error) {
    loadingEl.classList.add("hidden");
    emptyEl.classList.remove("hidden");
    alert(`Assessment Error: ${error.message}`);
  }
}

// Render Results
function renderResults(data) {
  if (currentMode === "comprehensive") {
    renderComprehensiveResults(data);
  } else {
    renderSingleConditionResults(data);
  }
}

function renderComprehensiveResults(data) {
  // Urgency Banner
  const banner = document.getElementById("urgency-banner");
  const urgencyText = document.getElementById("urgency-text");
  urgencyText.innerText = data.overall_urgency;

  banner.className = "urgency-banner";
  if (data.overall_urgency.toLowerCase().includes("urgent")) {
    banner.classList.add("urgent");
  } else if (data.overall_urgency.toLowerCase().includes("routine")) {
    banner.classList.add("routine");
  }

  // Scores Grid
  const scoresGrid = document.getElementById("scores-grid");
  scoresGrid.innerHTML = `
    <div class="score-card">
      <div class="score-card-header">
        <span class="score-card-title">Diabetes / Prediabetes</span>
        <span class="tier-badge tier-${data.diabetes_assessment.prediction.risk_tier.toLowerCase()}">${data.diabetes_assessment.prediction.risk_tier} Risk</span>
      </div>
      <div class="score-value-row">
        <span class="score-percentage" style="color: ${data.diabetes_assessment.prediction.risk_color};">${data.diabetes_assessment.prediction.percentage}%</span>
        <span class="score-caption">positive-class probability</span>
      </div>
      <div class="score-progress-bar">
        <div class="score-progress-fill" style="width: ${data.diabetes_assessment.prediction.percentage}%; background-color: ${data.diabetes_assessment.prediction.risk_color};"></div>
      </div>
    </div>

    <div class="score-card">
      <div class="score-card-header">
        <span class="score-card-title">Coronary Heart Disease</span>
        <span class="tier-badge tier-${data.heart_disease_assessment.prediction.risk_tier.toLowerCase()}">${data.heart_disease_assessment.prediction.risk_tier} Risk</span>
      </div>
      <div class="score-value-row">
        <span class="score-percentage" style="color: ${data.heart_disease_assessment.prediction.risk_color};">${data.heart_disease_assessment.prediction.percentage}%</span>
        <span class="score-caption">positive-class probability</span>
      </div>
      <div class="score-progress-bar">
        <div class="score-progress-fill" style="width: ${data.heart_disease_assessment.prediction.percentage}%; background-color: ${data.heart_disease_assessment.prediction.risk_color};"></div>
      </div>
    </div>
  `;

  // Synergy Alerts
  const synergyContainer = document.getElementById("synergy-container");
  if (data.cardiometabolic_synergy_alerts && data.cardiometabolic_synergy_alerts.length > 0) {
    synergyContainer.classList.remove("hidden");
    synergyContainer.innerHTML = data.cardiometabolic_synergy_alerts.map(a => `
      <div class="synergy-title">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        ${a.title}
      </div>
      <div class="alert-desc" style="color: #fed7d7; margin-top: 0.35rem;">${a.description}</div>
    `).join("");
  } else {
    synergyContainer.classList.add("hidden");
  }

  // Clinical Alerts
  const combinedAlerts = [
    ...(data.diabetes_assessment.decision_support.clinical_alerts || []),
    ...(data.heart_disease_assessment.decision_support.clinical_alerts || []),
  ];
  renderAlerts(combinedAlerts);

  // Feature Contributions (combined top drivers)
  const combinedFeatures = [
    ...(data.diabetes_assessment.prediction.feature_contributions || []),
    ...(data.heart_disease_assessment.prediction.feature_contributions || []),
  ];
  combinedFeatures.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  renderFeatureBars(combinedFeatures.slice(0, 8));

  // Workup
  const combinedWorkup = [
    ...(data.diabetes_assessment.decision_support.recommended_diagnostic_workup || []),
    ...(data.heart_disease_assessment.decision_support.recommended_diagnostic_workup || []),
  ];
  renderWorkup(combinedWorkup);

  // Lifestyle
  const combinedLifestyle = [
    ...(data.diabetes_assessment.decision_support.lifestyle_action_plan || []),
    ...(data.heart_disease_assessment.decision_support.lifestyle_action_plan || []),
  ];
  renderLifestyle(combinedLifestyle);

  // Discussion Points
  const combinedDiscussion = [
    ...(data.integrated_management_plan || []),
    ...(data.diabetes_assessment.decision_support.clinical_discussion_points || []),
    ...(data.heart_disease_assessment.decision_support.clinical_discussion_points || []),
  ];
  renderDiscussion(combinedDiscussion);

  // Reasoning Trace
  renderReasoning(data.reasoning_trace || []);
}

function renderSingleConditionResults(data) {
  const pred = data.prediction;
  const decision = data.decision_support;

  // Urgency Banner
  const banner = document.getElementById("urgency-banner");
  const urgencyText = document.getElementById("urgency-text");
  urgencyText.innerText = decision.urgency;

  banner.className = "urgency-banner";
  if (decision.urgency.toLowerCase().includes("urgent")) {
    banner.classList.add("urgent");
  } else if (decision.urgency.toLowerCase().includes("routine")) {
    banner.classList.add("routine");
  }

  // Scores Grid
  const scoresGrid = document.getElementById("scores-grid");
  scoresGrid.innerHTML = `
    <div class="score-card">
      <div class="score-card-header">
        <span class="score-card-title">${pred.condition}</span>
        <span class="tier-badge tier-${pred.risk_tier.toLowerCase()}">${pred.risk_tier} Risk</span>
      </div>
      <div class="score-value-row">
        <span class="score-percentage" style="color: ${pred.risk_color};">${pred.percentage}%</span>
        <span class="score-caption">positive-class probability</span>
      </div>
      <div class="score-progress-bar">
        <div class="score-progress-fill" style="width: ${pred.percentage}%; background-color: ${pred.risk_color};"></div>
      </div>
    </div>
  `;

  document.getElementById("synergy-container").classList.add("hidden");

  renderAlerts(decision.clinical_alerts || []);
  renderFeatureBars(pred.feature_contributions.slice(0, 8));
  renderWorkup(decision.recommended_diagnostic_workup || []);
  renderLifestyle(decision.lifestyle_action_plan || []);
  renderDiscussion(decision.clinical_discussion_points || []);
  renderReasoning(decision.reasoning_trace || []);
}

function renderAlerts(alerts) {
  const container = document.getElementById("alerts-container");
  if (!alerts || alerts.length === 0) {
    container.innerHTML = `
      <div class="alert-item" style="border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.08);">
        <div>
          <div class="alert-title" style="color: #34d399;">No Acute Clinical Red Flags Detected</div>
          <div class="alert-desc">Vital signs and clinical indices do not meet critical alert thresholds.</div>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = alerts.map(a => `
    <div class="alert-item severity-${a.severity}">
      <div>
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.description}</div>
      </div>
    </div>
  `).join("");
}

function renderFeatureBars(features) {
  const container = document.getElementById("feature-bars-container");
  if (!features || features.length === 0) {
    container.innerHTML = "<p class='state-subtitle'>No attribution computed.</p>";
    return;
  }

  const maxAbs = Math.max(...features.map(f => Math.abs(f.impact)), 0.1);

  container.innerHTML = features.map(f => {
    const isRisk = f.impact > 0;
    const barWidth = Math.min(100, Math.round((Math.abs(f.impact) / maxAbs) * 100));
    const barClass = isRisk ? "bar-risk" : "bar-protective";
    const dirLabel = isRisk ? "▲ Risk Driver" : "▼ Protective";
    const dirColor = isRisk ? "#f87171" : "#34d399";

    return `
      <div class="feature-bar-row">
        <div class="feature-bar-meta">
          <span class="feature-bar-label">${f.label} (${f.value}${f.unit ? ' ' + f.unit : ''})</span>
          <span class="feature-bar-val" style="color: ${dirColor}; font-weight: 700;">
            ${dirLabel} (${f.impact > 0 ? '+' : ''}${f.impact.toFixed(3)})
          </span>
        </div>
        <div class="feature-bar-track">
          <div class="feature-bar-fill ${barClass}" style="width: ${barWidth}%;"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderWorkup(workup) {
  const container = document.getElementById("workup-container");
  if (!workup || workup.length === 0) {
    container.innerHTML = "<p class='state-subtitle'>Standard routine monitoring advised.</p>";
    return;
  }

  container.innerHTML = workup.map(w => `
    <div class="workup-item">
      <div class="workup-test-title">
        <span>${w.test}</span>
        <span class="workup-guideline">${w.guideline}</span>
      </div>
      <div class="workup-rationale">${w.rationale}</div>
    </div>
  `).join("");
}

function renderLifestyle(lifestyle) {
  const container = document.getElementById("lifestyle-container");
  if (!lifestyle || lifestyle.length === 0) {
    container.innerHTML = "<p class='state-subtitle'>Maintain current balanced nutrition and activity.</p>";
    return;
  }

  container.innerHTML = lifestyle.map(l => `
    <div class="lifestyle-card-item">
      <div class="lifestyle-domain">${l.domain}</div>
      <div class="lifestyle-target">${l.target}</div>
      <div class="lifestyle-action">${l.action}</div>
    </div>
  `).join("");
}

function renderDiscussion(points) {
  const container = document.getElementById("discussion-container");
  if (!points || points.length === 0) {
    container.innerHTML = "<li>No specific clinician consultation prompts.</li>";
    return;
  }

  container.innerHTML = points.map(p => `<li>${p}</li>`).join("");
}

function renderReasoning(trace) {
  const container = document.getElementById("reasoning-log");
  if (!trace || trace.length === 0) {
    container.innerHTML = "<div>No reasoning trace recorded.</div>";
    return;
  }

  container.innerHTML = trace.map(t => `<div>• ${t}</div>`).join("");
}
