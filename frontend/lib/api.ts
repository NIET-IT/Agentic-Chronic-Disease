const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1'

export async function apiRequest<T = any>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed with ${response.status}`)
  }
  return response.json() as Promise<T>
}

export interface PatientPayload {
  patient_id: string
  name?: string
  age?: number
  sex?: number
}

export interface AuthLoginPayload {
  email: string
  password?: string
}

export interface AssessmentItem {
  id: number
  assessment_id: string
  patient_id: string
  condition: string
  prediction: number
  probability: number
  risk_tier: string
  risk_color: string
  threshold: number
  urgency?: string
  created_at: string
}

export interface AssessmentHistoryResponse {
  items: AssessmentItem[]
  total_count: number
  condition_counts: Record<string, number>
}

export const patientApi = {
  register: (payload: PatientPayload) =>
    apiRequest<any>('/patients/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: AuthLoginPayload) =>
    apiRequest<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getPatient: (patientId: string) =>
    apiRequest<any>(`/patients/${encodeURIComponent(patientId)}`),
  listPatients: () => apiRequest<any[]>('/patients'),
  history: (patientId?: string): Promise<AssessmentHistoryResponse> =>
    apiRequest<AssessmentHistoryResponse>(
      patientId
        ? `/history/assessments?patient_id=${encodeURIComponent(patientId)}`
        : '/history/assessments'
    ),
  predictDiabetes: (payload: any) =>
    apiRequest<any>('/decision-support/diabetes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  predictHeartDisease: (payload: any) =>
    apiRequest<any>('/decision-support/heart-disease', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  predictComprehensive: (payload: any) =>
    apiRequest<any>('/decision-support/comprehensive', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getExplainability: () => apiRequest<any[]>('/explainability/summary'),
}
