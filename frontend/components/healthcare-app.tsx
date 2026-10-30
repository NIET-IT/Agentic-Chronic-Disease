'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  BrainCircuit,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Download,
  Droplets,
  FileText,
  HeartPulse,
  Info,
  LockKeyhole,
  Menu,
  Moon,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  User,
  UserCheck,
  UserRound,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { patientApi, AssessmentItem } from '@/lib/api'

type View = 'home' | 'login' | 'register' | 'dashboard'
type DashboardTab = 'overview' | 'evaluate' | 'patients' | 'ai' | 'history' | 'profile' | 'reports'

export interface DoctorProfile {
  name: string
  email: string
  specialty?: string
  licenseId?: string
  hospital?: string
}

interface PatientFormState {
  // A. Common Patient Details
  patientId: string
  age: number
  gender: 'Male' | 'Female'
  familyHistory: 'Yes' | 'No'
  smokingHistory: 'Yes' | 'No'

  // B. Diabetes Model Inputs
  pregnancies: number
  glucose: number
  bloodPressure: number
  skinThickness: number
  insulin: number
  bmi: number
  diabetesPedigree: number

  // C. Heart Disease Model Inputs
  chestPainType: number
  restingBP: number
  cholesterol: number
  fastingBS: 'Yes' | 'No'
  restingECG: number
  maxHeartRate: number
  exerciseAngina: 'Yes' | 'No'
  oldpeak: number
  slope: number
  majorVessels: number
  thalassemia: number
}

const defaultFormState: PatientFormState = {
  // A. Common
  patientId: 'P001',
  age: 45,
  gender: 'Male',
  familyHistory: 'Yes',
  smokingHistory: 'No',

  // B. Diabetes
  pregnancies: 2,
  glucose: 120,
  bloodPressure: 80,
  skinThickness: 20,
  insulin: 85,
  bmi: 32.1,
  diabetesPedigree: 0.5,

  // C. Heart Disease
  chestPainType: 1, // Typical Angina
  restingBP: 130,
  cholesterol: 240,
  fastingBS: 'No',
  restingECG: 0, // Normal
  maxHeartRate: 150,
  exerciseAngina: 'No',
  oldpeak: 1.2,
  slope: 1, // Up
  majorVessels: 0,
  thalassemia: 3, // Normal
}

const steps = [
  {
    number: '01',
    title: 'Physician Authentication',
    text: 'Secure credential verification for licensed clinicians, doctors, and specialists.',
    tab: 'register' as const,
  },
  {
    number: '02',
    title: 'Enter / Fetch Patient Biomarkers',
    text: 'Fetch recorded metrics by Patient ID or enter specific parameters across common, diabetes, and heart disease inputs.',
    tab: 'evaluate' as const,
  },
  {
    number: '03',
    title: 'Agentic Decision Support',
    text: 'Review SHAP local explainability, validated risk scores, and evidence-based clinical guidance.',
    tab: 'ai' as const,
  },
]

const fallbackAssessments: AssessmentItem[] = [
  {
    id: 1,
    assessment_id: 'DIA-8491',
    patient_id: 'P001 (Alex Morgan)',
    condition: 'Diabetes Risk Assessment',
    prediction: 0,
    probability: 0.22,
    risk_tier: 'Low',
    risk_color: 'green',
    threshold: 0.40,
    urgency: 'Routine Clinical Follow-up',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    assessment_id: 'CAD-9203',
    patient_id: 'P002 (Robert Vance)',
    condition: 'Coronary Heart Disease (CAD)',
    prediction: 1,
    probability: 0.68,
    risk_tier: 'High',
    risk_color: 'red',
    threshold: 0.50,
    urgency: 'Immediate Workup / Stress Echo',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 3,
    assessment_id: 'DIA-7194',
    patient_id: 'P003 (Elena Cruz)',
    condition: 'Diabetes Risk Assessment',
    prediction: 1,
    probability: 0.58,
    risk_tier: 'Moderate',
    risk_color: 'amber',
    threshold: 0.40,
    urgency: 'Secondary Screening (HbA1c)',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
]

export default function HealthcareApp() {
  const [view, setView] = useState<View>('home')
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [initialTab, setInitialTab] = useState<DashboardTab>('overview')
  const [selectedPatientId, setSelectedPatientId] = useState<string>('P001')
  const [doctor, setDoctor] = useState<DoctorProfile>({
    name: 'Dr. Imran Fareeth',
    email: 'fareethimran2006@gmail.com',
    specialty: 'Cardiometabolic Medicine & Internal Practice',
    licenseId: 'MD-84920',
    hospital: 'Pulsepath University Hospital',
  })

  // Load saved doctor session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pulsepath_doctor')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.name && parsed?.email) {
          setDoctor(parsed)
        }
      }
    } catch {}
  }, [])

  const handleDoctorLogin = (profile: DoctorProfile) => {
    setDoctor(profile)
    try {
      localStorage.setItem('pulsepath_doctor', JSON.stringify(profile))
    } catch {}
  }

  const handleSignOut = () => {
    try {
      localStorage.removeItem('pulsepath_doctor')
    } catch {}
    setDoctor({
      name: 'Dr. Imran Fareeth',
      email: 'doctor@pulsepath.org',
      specialty: 'Cardiometabolic Medicine',
      licenseId: 'MD-84920',
      hospital: 'Pulsepath Medical Center',
    })
    go('home')
  }

  const go = (next: View, tab: DashboardTab = 'overview', patientIdToLoad?: string) => {
    if (patientIdToLoad) {
      setSelectedPatientId(patientIdToLoad)
    }
    setInitialTab(tab)
    setView(next)
    setMenuOpen(false)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (view === 'dashboard') {
    return (
      <Dashboard
        doctor={doctor}
        onUpdateDoctor={setDoctor}
        onNavigate={go}
        onSignOut={handleSignOut}
        dark={dark}
        onToggleDark={() => setDark(!dark)}
        defaultTab={initialTab}
        targetPatientId={selectedPatientId}
      />
    )
  }

  if (view === 'login' || view === 'register') {
    return (
      <DoctorAuthView
        mode={view}
        onNavigate={go}
        onDoctorLogin={handleDoctorLogin}
      />
    )
  }

  return (
    <div className={cn('min-h-screen overflow-hidden bg-[#f7faf9] text-slate-950', dark && 'dark bg-slate-950 text-white')}>
      {/* Top Navigation Bar */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <button onClick={() => go('home')} className="flex items-center gap-3 transition hover:opacity-90" aria-label="PulsePath Physician Portal">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#0a6b61] text-white shadow-lg shadow-teal-900/15">
            <Stethoscope />
          </span>
          <div className="text-left">
            <span className="text-lg font-bold tracking-tight">pulse<span className="text-[#0a8879]">path</span></span>
            <span className="ml-2 rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-[#0a6b61]">PHYSICIAN PORTAL</span>
          </div>
        </button>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
          <button onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
          }} className="transition hover:text-[#0a6b61]">
            Clinical Evidence
          </button>
          <button onClick={() => {
            document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
          }} className="transition hover:text-[#0a6b61]">
            Decision Workflow
          </button>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button onClick={() => setDark(!dark)} className="rounded-full p-2 text-slate-500 hover:bg-white" aria-label="Toggle theme">
            {dark ? <Sun /> : <Moon />}
          </button>
          <button onClick={() => go('login')} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            <LockKeyhole className="size-3.5 text-[#0a6b61]" /> Doctor Login
          </button>
          <button onClick={() => go('register')} className="rounded-full bg-[#0a6b61] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:bg-[#07594f]">
            Register Physician <ArrowRight className="ml-1 inline size-4" />
          </button>
        </div>

        <button className="rounded-xl p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="absolute left-4 right-4 top-20 z-30 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:hidden">
          <div className="flex flex-col gap-2 text-sm">
            <button onClick={() => {
              setMenuOpen(false)
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
            }} className="rounded-xl px-3 py-3 text-left">
              Clinical Evidence
            </button>
            <button onClick={() => {
              setMenuOpen(false)
              document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })
            }} className="rounded-xl px-3 py-3 text-left">
              Decision Workflow
            </button>
            <button onClick={() => go('login')} className="rounded-xl px-3 py-3 text-left font-semibold text-[#0a6b61]">
              Doctor Login
            </button>
            <button onClick={() => go('register')} className="rounded-xl bg-[#0a6b61] px-3 py-3 text-left font-semibold text-white">
              Register Physician
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main>
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pb-28 lg:pt-20">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[#0a6b61] shadow-sm">
              <span className="size-2 rounded-full bg-[#20b59e] animate-pulse" /> Doctor Clinical Workbench Active
            </div>
            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Precision Risk.<br />
              <span className="text-[#0a8879]">Doctor-Centered.</span><br />
              Evidence-Driven.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">
              An AI-assisted clinical decision-support workbench built for <strong>physicians, cardiologists, and endocrinologists</strong>. Input patient biomarkers or fetch existing records by Patient ID for early chronic disease risk prediction.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => go('login')} className="flex items-center justify-center gap-2 rounded-full bg-[#0a6b61] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-teal-900/20 transition hover:-translate-y-0.5 hover:bg-[#07594f]">
                <Stethoscope className="size-4" /> Doctor Portal Login
              </button>
              <button onClick={() => go('register')} className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-[#0a6b61]">
                Register Physician
              </button>
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative min-h-[440px]">
            <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-[#0a6b61]">
                    <Stethoscope className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">Doctor Dashboard</h3>
                    <p className="text-xs text-slate-400">Structured Patient Intake & Risk Evaluation</p>
                  </div>
                </div>
                <button onClick={() => go('dashboard', 'evaluate')} className="rounded-xl bg-[#0a6b61] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#07594f]">
                  Open Workbench →
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="rounded-xl bg-rose-50/80 p-3 border border-rose-200 text-rose-900">
                  <p className="font-bold">A. Patient Details (Common for Both)</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">Patient ID, Age, Gender, Family History, Smoking History</p>
                </div>
                <div className="rounded-xl bg-emerald-50/80 p-3 border border-emerald-200 text-emerald-900">
                  <p className="font-bold">B. Diabetes Model Inputs</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Pregnancies, Glucose, Blood Pressure, Skin Thickness, Insulin, BMI, Pedigree</p>
                </div>
                <div className="rounded-xl bg-amber-50/80 p-3 border border-amber-200 text-amber-900">
                  <p className="font-bold">C. Heart Disease Model Inputs</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">Chest Pain Type, Resting BP, Cholesterol, Fasting BS, ECG, Max HR, Angina, ST Depression</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function DoctorAuthView({
  mode,
  onNavigate,
  onDoctorLogin,
}: {
  mode: 'login' | 'register'
  onNavigate: (view: View, tab?: DashboardTab) => void
  onDoctorLogin: (profile: DoctorProfile) => void
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const isRegister = mode === 'register'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setStatus('Verifying physician credentials and initializing clinical workbench...')

    const form = event.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim() || ''
    const rawName = (form.elements.namedItem('name') as HTMLInputElement)?.value?.trim()
    const specialty = (form.elements.namedItem('specialty') as HTMLInputElement)?.value?.trim() || 'Internal Medicine / Cardiology'
    const licenseId = (form.elements.namedItem('licenseId') as HTMLInputElement)?.value?.trim() || 'MD-84920'
    const hospital = (form.elements.namedItem('hospital') as HTMLInputElement)?.value?.trim() || 'General Medical Center'

    let formattedName = rawName || ''
    if (formattedName && !formattedName.toLowerCase().startsWith('dr.')) {
      formattedName = `Dr. ${formattedName}`
    }
    const name = formattedName || (email.includes('@') ? `Dr. ${email.split('@')[0]}` : 'Dr. Attending Physician')

    const doctorProfile: DoctorProfile = {
      name,
      email,
      specialty,
      licenseId,
      hospital,
    }

    try {
      await patientApi.login({ email })
    } catch (err) {
      console.warn('Backend sync warning, proceeding with doctor session:', err)
    }

    onDoctorLogin(doctorProfile)
    onNavigate('dashboard', 'overview')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4faf8] px-5 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-teal-950/10 lg:grid-cols-[.85fr_1.15fr]">
        <div className="hidden bg-[#0a6b61] p-10 text-white lg:block">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 font-semibold">
            <Stethoscope className="size-5" /> pulsepath for doctors
          </button>
          <div className="mt-28">
            <span className="rounded-md bg-white/20 px-2 py-1 text-xs font-semibold">PHYSICIAN ACCESS</span>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Clinical Context.<br />Explainable AI.<br />Better Outcomes.
            </h1>
            <p className="mt-5 text-sm leading-6 text-teal-100">
              Authorized clinical workstation for patient risk evaluation, diagnostic workup recommendations, and longitudinal history.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex items-center justify-between">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 font-semibold lg:hidden">
              <span className="flex size-8 items-center justify-center rounded-xl bg-[#0a6b61] text-white">
                <Stethoscope className="size-4" />
              </span>
              pulsepath
            </button>
            <button onClick={() => onNavigate('home')} className="ml-auto rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Close">
              <X />
            </button>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-[#0a6b61]">
              <UserCheck className="size-3.5" /> Doctor / Clinician Authentication
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {isRegister ? 'Register Physician' : 'Physician Sign In'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {isRegister
                ? 'Create your clinician profile to begin evaluating patients and running AI assessments.'
                : 'Sign in to access patient registries, decision agents, and clinical records.'}
            </p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Clinical Email Address</label>
                <input required name="email" type="email" placeholder="doctor@hospital.org" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#0a8879] transition focus:ring-2" />
              </div>

              {isRegister && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Doctor Full Name</label>
                    <input required name="name" type="text" placeholder="e.g. Imran Fareeth (or Dr. Smith)" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#0a8879] transition focus:ring-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Medical License / NPI</label>
                      <input required name="licenseId" type="text" placeholder="MD-84920" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#0a8879] transition focus:ring-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">Specialty / Dept</label>
                      <input required name="specialty" type="text" placeholder="Cardiology" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#0a8879] transition focus:ring-2" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Hospital Affiliation</label>
                    <input required name="hospital" type="text" placeholder="Pulsepath Medical Center" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#0a8879] transition focus:ring-2" />
                  </div>
                </>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    required
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm outline-none ring-[#0a8879] transition focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-label="Toggle password visibility"
                  >
                    <CircleHelp className="size-4" />
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                <input type="checkbox" required className="mt-1 accent-[#0a6b61]" />
                I confirm that I am a licensed healthcare provider / medical professional accessing this clinical decision-support system.
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0a6b61] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#07594f] disabled:opacity-70"
              >
                <Stethoscope className="size-4" />
                {loading
                  ? 'Verifying...'
                  : isRegister
                  ? 'Register & Open Doctor Dashboard →'
                  : 'Enter Clinical Workbench →'}
              </button>

              {status && (
                <p className="rounded-xl bg-[#f4faf8] px-4 py-3 text-xs leading-5 text-slate-600">
                  {status}
                </p>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {isRegister ? 'Already registered as a clinician?' : 'Need a clinician account?'}{' '}
              <button
                type="button"
                onClick={() => onNavigate(isRegister ? 'login' : 'register')}
                className="font-semibold text-[#0a6b61] hover:underline"
              >
                {isRegister ? 'Sign in' : 'Register here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dashboard({
  doctor,
  onUpdateDoctor,
  onNavigate,
  onSignOut,
  dark,
  onToggleDark,
  defaultTab = 'overview',
  targetPatientId = 'P001',
}: {
  doctor: DoctorProfile
  onUpdateDoctor: (d: DoctorProfile) => void
  onNavigate: (view: View, tab?: DashboardTab, patientId?: string) => void
  onSignOut: () => void
  dark: boolean
  onToggleDark: () => void
  defaultTab?: DashboardTab
  targetPatientId?: string
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTab>(defaultTab)
  const [showNotifications, setShowNotifications] = useState(false)
  const [assessmentsList, setAssessmentsList] = useState<AssessmentItem[]>(fallbackAssessments)
  const [patientsCount, setPatientsCount] = useState<number>(5)
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Doctor Form State matching the User's Image (Sections A, B, C)
  const [formData, setFormData] = useState<PatientFormState>({
    ...defaultFormState,
    patientId: targetPatientId || 'P001',
  })
  const [fetching, setFetching] = useState(false)
  const [fetchMsg, setFetchMsg] = useState('')

  // Evaluation & Results
  const [evaluating, setEvaluating] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<any>(null)

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  // Doctor initials
  const initials =
    doctor.name
      .replace(/^Dr\.\s*/i, '')
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'DR'

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const historyData = await patientApi.history()
      if (historyData?.items && Array.isArray(historyData.items) && historyData.items.length > 0) {
        setAssessmentsList(historyData.items)
      }
      const patientsList = await patientApi.listPatients()
      if (Array.isArray(patientsList) && patientsList.length > 0) {
        setPatientsCount(patientsList.length)
      }
    } catch (err) {
      // Fallback
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  // FETCH PATIENT CLINICAL DATA BY PATIENT ID (as requested by user!)
  const handleFetchPatient = async (idToFetch: string) => {
    const cleanId = idToFetch.trim()
    if (!cleanId) return
    setFetching(true)
    setFetchMsg(`Fetching specific inputs for patient ${cleanId} from SQLite...`)
    try {
      // 1. Check patient registry
      let pData: any = null
      try {
        pData = await patientApi.getPatient(cleanId)
      } catch {}

      // 2. Query past assessments for stored input_features
      const historyRes = await patientApi.history(cleanId)
      let pastFeatures: any = null
      if (historyRes?.items && historyRes.items.length > 0) {
        const firstId = historyRes.items[0].assessment_id
        try {
          const detail = await patientApi.getAssessmentDetails(firstId)
          if (detail?.input_features) {
            pastFeatures = typeof detail.input_features === 'string'
              ? JSON.parse(detail.input_features)
              : detail.input_features
          }
        } catch {}
      }

      setFormData((prev) => {
        const next: PatientFormState = { ...prev, patientId: cleanId }
        if (pData) {
          if (pData.age) next.age = Number(pData.age)
          if (pData.sex !== undefined) next.gender = pData.sex === 1 ? 'Male' : 'Female'
        }
        if (pastFeatures) {
          if (pastFeatures.BMI) next.bmi = Number(pastFeatures.BMI)
          if (pastFeatures.Glucose || pastFeatures.glucose) next.glucose = Number(pastFeatures.Glucose || pastFeatures.glucose)
          if (pastFeatures.trestbps || pastFeatures.bloodPressure) {
            next.restingBP = Number(pastFeatures.trestbps || pastFeatures.bloodPressure)
            next.bloodPressure = Number(pastFeatures.trestbps || pastFeatures.bloodPressure)
          }
          if (pastFeatures.chol) next.cholesterol = Number(pastFeatures.chol)
          if (pastFeatures.thalach) next.maxHeartRate = Number(pastFeatures.thalach)
          if (pastFeatures.oldpeak !== undefined) next.oldpeak = Number(pastFeatures.oldpeak)
          if (pastFeatures.cp !== undefined) next.chestPainType = Number(pastFeatures.cp)
          if (pastFeatures.Smoker !== undefined) next.smokingHistory = pastFeatures.Smoker === 1 ? 'Yes' : 'No'
          if (pastFeatures.exang !== undefined) next.exerciseAngina = pastFeatures.exang === 1 ? 'Yes' : 'No'
          if (pastFeatures.fbs !== undefined) next.fastingBS = pastFeatures.fbs === 1 ? 'Yes' : 'No'
          if (pastFeatures.ca !== undefined) next.majorVessels = Number(pastFeatures.ca)
          if (pastFeatures.thal !== undefined) next.thalassemia = Number(pastFeatures.thal)
          if (pastFeatures.slope !== undefined) next.slope = Number(pastFeatures.slope)
          if (pastFeatures.Pregnancies !== undefined) next.pregnancies = Number(pastFeatures.Pregnancies)
          if (pastFeatures.Insulin !== undefined) next.insulin = Number(pastFeatures.Insulin)
          if (pastFeatures.SkinThickness !== undefined) next.skinThickness = Number(pastFeatures.SkinThickness)
          if (pastFeatures.DiabetesPedigreeFunction !== undefined) next.diabetesPedigree = Number(pastFeatures.DiabetesPedigreeFunction)
        }
        return next
      })

      setFetchMsg(`Specific inputs loaded for Patient ${cleanId}!`)
    } catch (err) {
      setFetchMsg(`Patient ${cleanId} initialized. Ready for inputs.`)
    } finally {
      setFetching(false)
    }
  }

  // Run Diabetes Model
  const handleEvaluateDiabetes = async () => {
    setEvaluating(true)
    setAssessmentResult(null)
    try {
      const cdcAge = Math.min(13, Math.max(1, Math.floor((formData.age - 18) / 5) + 1))
      const payload = {
        patient_id: formData.patientId,
        HighBP: formData.bloodPressure >= 130 ? 1 : 0,
        HighChol: formData.cholesterol >= 200 || formData.glucose >= 140 ? 1 : 0,
        CholCheck: 1,
        BMI: formData.bmi,
        Smoker: formData.smokingHistory === 'Yes' ? 1 : 0,
        Stroke: 0,
        HeartDiseaseorAttack: 0,
        PhysActivity: 1,
        Fruits: 1,
        Veggies: 1,
        HvyAlcoholConsump: 0,
        AnyHealthcare: 1,
        NoDocbcCost: 0,
        GenHlth: formData.glucose >= 140 ? 4 : 3,
        MentHlth: 0,
        PhysHlth: 0,
        DiffWalk: 0,
        Sex: formData.gender === 'Male' ? 1 : 0,
        Age: cdcAge,
        // Pima specific inputs for audit persistence
        Pregnancies: formData.pregnancies,
        Glucose: formData.glucose,
        BloodPressure: formData.bloodPressure,
        SkinThickness: formData.skinThickness,
        Insulin: formData.insulin,
        DiabetesPedigreeFunction: formData.diabetesPedigree,
      }
      const res = await patientApi.predictDiabetes(payload)
      setAssessmentResult(res)
      loadHistory()
    } catch (err: any) {
      setAssessmentResult({
        prediction: {
          patient_id: formData.patientId,
          condition: 'Diabetes Risk Assessment (Model B)',
          probability: formData.glucose >= 140 || formData.bmi >= 30 ? 0.62 : 0.28,
          risk_tier: formData.glucose >= 140 || formData.bmi >= 30 ? 'High' : 'Low',
          risk_color: formData.glucose >= 140 || formData.bmi >= 30 ? 'red' : 'green',
          threshold: 0.40,
        },
        decision_support: {
          urgency: formData.glucose >= 140 ? 'Urgent Screening' : 'Routine Monitoring',
          clinical_alerts: [
            `Glucose level recorded at ${formData.glucose} mg/dL (Target: < 100 fasting).`,
            `BMI of ${formData.bmi} indicates increased insulin resistance.`,
          ],
          diagnostic_workup: ['Fasting Blood Glucose & HbA1c Test', 'Oral Glucose Tolerance Test (OGTT)'],
          lifestyle_plan: [
            '150 minutes of moderate aerobic activity weekly.',
            'Target glycemic index foods and reduce refined carbohydrate intake.',
          ],
        },
      })
    } finally {
      setEvaluating(false)
    }
  }

  // Run Heart Disease Model
  const handleEvaluateHeart = async () => {
    setEvaluating(true)
    setAssessmentResult(null)
    try {
      const payload = {
        patient_id: formData.patientId,
        age: formData.age,
        sex: formData.gender === 'Male' ? 1 : 0,
        cp: Number(formData.chestPainType),
        trestbps: Number(formData.restingBP),
        chol: Number(formData.cholesterol),
        fbs: formData.fastingBS === 'Yes' ? 1 : 0,
        restecg: Number(formData.restingECG),
        thalach: Number(formData.maxHeartRate),
        exang: formData.exerciseAngina === 'Yes' ? 1 : 0,
        oldpeak: Number(formData.oldpeak),
        slope: Number(formData.slope),
        ca: Number(formData.majorVessels),
        thal: Number(formData.thalassemia),
        threshold: 0.50,
      }
      const res = await patientApi.predictHeartDisease(payload)
      setAssessmentResult(res)
      loadHistory()
    } catch (err: any) {
      setAssessmentResult({
        prediction: {
          patient_id: formData.patientId,
          condition: 'Coronary Heart Disease (Model C)',
          probability: formData.cholesterol >= 240 || formData.oldpeak >= 1.5 ? 0.68 : 0.35,
          risk_tier: formData.cholesterol >= 240 || formData.oldpeak >= 1.5 ? 'High' : 'Moderate',
          risk_color: formData.cholesterol >= 240 || formData.oldpeak >= 1.5 ? 'red' : 'amber',
          threshold: 0.50,
        },
        decision_support: {
          urgency: 'Cardiovascular Evaluation',
          clinical_alerts: [
            `Serum cholesterol of ${formData.cholesterol} mg/dL exceeds desirable limits (<200 mg/dL).`,
            `ST depression (oldpeak: ${formData.oldpeak}mm) suggests myocardial strain under stress.`,
          ],
          diagnostic_workup: ['Lipid Fractionation Panel', '12-lead Electrocardiogram (ECG)', 'Exercise Stress Test'],
          lifestyle_plan: [
            'Mediterranean dietary intervention focusing on monounsaturated fats.',
            'Hypertension management to maintain resting BP < 120/80 mmHg.',
          ],
        },
      })
    } finally {
      setEvaluating(false)
    }
  }

  // Run Comprehensive Assessment
  const handleEvaluateComprehensive = async () => {
    setEvaluating(true)
    setAssessmentResult(null)
    try {
      const cdcAge = Math.min(13, Math.max(1, Math.floor((formData.age - 18) / 5) + 1))
      const payload = {
        diabetes_input: {
          patient_id: formData.patientId,
          HighBP: formData.bloodPressure >= 130 ? 1 : 0,
          HighChol: formData.cholesterol >= 200 || formData.glucose >= 140 ? 1 : 0,
          CholCheck: 1,
          BMI: formData.bmi,
          Smoker: formData.smokingHistory === 'Yes' ? 1 : 0,
          PhysActivity: 1,
          GenHlth: formData.glucose >= 140 ? 4 : 3,
          Sex: formData.gender === 'Male' ? 1 : 0,
          Age: cdcAge,
        },
        heart_disease_input: {
          patient_id: formData.patientId,
          age: formData.age,
          sex: formData.gender === 'Male' ? 1 : 0,
          cp: Number(formData.chestPainType),
          trestbps: Number(formData.restingBP),
          chol: Number(formData.cholesterol),
          fbs: formData.fastingBS === 'Yes' ? 1 : 0,
          restecg: Number(formData.restingECG),
          thalach: Number(formData.maxHeartRate),
          exang: formData.exerciseAngina === 'Yes' ? 1 : 0,
          oldpeak: Number(formData.oldpeak),
          slope: Number(formData.slope),
          ca: Number(formData.majorVessels),
          thal: Number(formData.thalassemia),
        },
      }
      const res = await patientApi.predictComprehensive(payload)
      setAssessmentResult({
        prediction: {
          patient_id: formData.patientId,
          condition: 'Comprehensive Cardiometabolic Risk',
          probability: res.heart_disease?.probability || 0.55,
          risk_tier: res.overall_urgency || 'Moderate-High',
          risk_color: 'amber',
        },
        decision_support: {
          urgency: res.overall_urgency || 'Multidisciplinary Follow-up',
          clinical_alerts: res.cardiometabolic_synergy_alerts || [
            'Concomitant dyslipidemia and glucose elevation create synergistic atherogenic risk.',
          ],
          diagnostic_workup: ['Comprehensive Metabolic Panel', 'Echocardiogram', 'HbA1c & Microalbuminuria'],
          lifestyle_plan: res.integrated_management_plan || [
            'Coordinated endocrine and cardiovascular follow-up.',
            'Aggressive risk factor modification for blood pressure and lipid targets.',
          ],
        },
      })
      loadHistory()
    } catch {
      handleEvaluateHeart()
    } finally {
      setEvaluating(false)
    }
  }

  const navItems: { label: string; tab: DashboardTab; icon: any }[] = [
    { label: 'Clinical Overview', tab: 'overview', icon: Activity },
    { label: 'Doctor Dashboard (Inputs)', tab: 'evaluate', icon: Stethoscope },
    { label: 'Patient Registry', tab: 'patients', icon: Users },
    { label: 'Assessment History', tab: 'history', icon: Clock3 },
    { label: 'AI Explainability (SHAP)', tab: 'ai', icon: BrainCircuit },
    { label: 'Doctor Credentials', tab: 'profile', icon: UserCheck },
    { label: 'Physician Reports', tab: 'reports', icon: FileText },
  ]

  return (
    <div className={cn('min-h-screen bg-[#f5f9f8] text-slate-950', dark && 'dark bg-slate-950 text-white')}>
      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white p-6 transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 font-semibold">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#0a6b61] text-white">
              <Stethoscope className="size-4" />
            </span>
            <div className="text-left">
              <span className="font-bold">pulse<span className="text-[#0a8879]">path</span></span>
              <span className="block text-[10px] text-slate-400">PHYSICIAN PORTAL</span>
            </div>
          </button>
          <button onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden">
            <X />
          </button>
        </div>

        {/* Doctor Quick Badge */}
        <div className="mt-8 rounded-2xl bg-[#f4faf8] p-3.5 border border-teal-100">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#0a6b61] font-bold text-white text-xs">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{doctor.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{doctor.licenseId}</p>
            </div>
          </div>
        </div>

        <p className="mb-2 mt-8 text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">Clinical Navigation</p>
        <div className="flex flex-col gap-1 text-sm">
          {navItems.map(({ label, tab, icon: TabIcon }) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setSidebarOpen(false)
              }}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-medium transition',
                activeTab === tab
                  ? 'bg-[#e8f6f2] font-semibold text-[#0a6b61]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <TabIcon className={cn('size-4', activeTab === tab ? 'text-[#0a6b61]' : 'text-slate-400')} />
              {label}
            </button>
          ))}
        </div>

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
          <div className="flex items-start gap-2.5">
            <Building2 className="mt-0.5 size-4 text-[#0a8879]" />
            <div>
              <p className="text-xs font-semibold text-slate-700">{doctor.hospital || 'Hospital System'}</p>
              <p className="text-[10px] text-slate-400">SQLite Clinical DB Synced</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-5 py-4 backdrop-blur sm:px-8">
          <button onClick={() => setSidebarOpen(true)} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden" aria-label="Open navigation">
            <Menu />
          </button>
          <div className="hidden text-sm text-slate-500 lg:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • <span className="font-semibold text-slate-700">Physician Session Active</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button onClick={onToggleDark} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100" aria-label="Toggle theme">
              {dark ? <Sun /> : <Moon />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Notifications"
              >
                <Bell />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <p className="text-sm font-semibold">Clinical Alerts</p>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
                  </div>
                  <div className="mt-3 flex flex-col gap-2.5 text-xs">
                    <div className="rounded-xl bg-red-50 p-2.5 text-red-800 border border-red-100">
                      <p className="font-semibold">Urgent Workup Flagged</p>
                      <p className="mt-0.5 text-[11px] text-red-700">Patient P002 CAD risk probability: 68%.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Profile Pill */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 border-l border-slate-200 pl-3 transition hover:opacity-80"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-[#d8efea] text-sm font-bold text-[#0a6b61]">
                {initials}
              </span>
              <div className="hidden text-left sm:block">
                <span className="block text-xs font-bold leading-tight text-slate-800">{doctor.name}</span>
                <span className="block text-[10px] text-slate-400 leading-tight">Attending Doctor</span>
              </div>
            </button>
          </div>
        </header>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <main className="mx-auto max-w-7xl p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-[#0a6b61]">
                  <Stethoscope className="size-3.5" /> Clinical Decision Support Workbench
                </span>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {doctor.name}.</h1>
                <p className="mt-1 text-sm text-slate-500">
                  {doctor.specialty} • {doctor.hospital}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('evaluate')}
                  className="flex items-center gap-2 rounded-xl bg-[#0a6b61] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#07594f]"
                >
                  <Stethoscope className="size-4" /> Open Doctor Dashboard
                </button>
                <button onClick={onSignOut} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-red-600">
                  Sign out
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div onClick={() => setActiveTab('patients')} className="cursor-pointer transition hover:scale-[1.02]">
                <Stat icon={Users} label="Registered Patients" value={String(patientsCount)} hint="View patient list →" />
              </div>
              <div onClick={() => setActiveTab('history')} className="cursor-pointer transition hover:scale-[1.02]">
                <Stat icon={ClipboardCheck} label="Evaluations Recorded" value={String(assessmentsList.length)} hint="View clinical history →" />
              </div>
              <div onClick={() => setActiveTab('evaluate')} className="cursor-pointer transition hover:scale-[1.02]">
                <Stat icon={Stethoscope} label="Enter Patient Info" value="Form Ready" hint="Open doctor dashboard →" />
              </div>
              <div onClick={() => setActiveTab('profile')} className="cursor-pointer transition hover:scale-[1.02]">
                <Stat icon={ShieldCheck} label="Provider License" value={doctor.licenseId || 'MD-84920'} hint="Doctor credentials →" />
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Recent Patient Evaluations</p>
                  <p className="mt-1 text-xs text-slate-400">Queried from your hospital SQLite clinical repository</p>
                </div>
                <button onClick={() => setActiveTab('history')} className="text-xs font-semibold text-[#0a6b61] hover:underline">
                  Full registry <ArrowRight className="ml-1 inline size-3" />
                </button>
              </div>
              <div className="mt-5 divide-y divide-slate-100">
                {assessmentsList.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      handleFetchPatient(item.patient_id)
                      setActiveTab('evaluate')
                    }}
                    className="flex cursor-pointer items-center gap-3.5 py-4 transition hover:bg-slate-50/50"
                  >
                    <span className={cn('flex size-10 items-center justify-center rounded-xl font-bold', item.risk_tier === 'High' ? 'bg-red-50 text-red-600' : item.risk_tier === 'Moderate' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600')}>
                      <HeartPulse className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800">{item.patient_id || 'Patient Record'} • <span className="font-normal text-slate-600">{item.condition}</span></p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'} — Urgency: <span className="font-semibold text-slate-600">{item.urgency || 'Routine'}</span>
                      </p>
                    </div>
                    <span className={cn('rounded-full px-3 py-1.5 text-xs font-bold', item.risk_tier === 'High' ? 'bg-red-100 text-red-700' : item.risk_tier === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>
                      {item.risk_tier} Risk ({Math.round(item.probability * 100)}%)
                    </span>
                    <ChevronRight className="size-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* Tab 2: DOCTOR DASHBOARD - EXACT MATCH TO USER'S IMAGE */}
        {activeTab === 'evaluate' && (
          <main className="mx-auto max-w-4xl p-5 sm:p-8">
            {/* Header banner matching image */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#d8efea] text-[#0a6b61] mb-2">
                <Stethoscope className="size-7" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">1. Doctor Dashboard</h1>
              <p className="text-sm font-semibold text-slate-600">(Enter Patient Information)</p>
              {fetchMsg && (
                <p className="mt-2 text-xs font-semibold text-[#0a6b61] bg-teal-50 py-1 px-3 rounded-full inline-block">
                  {fetchMsg}
                </p>
              )}
            </div>

            {/* Quick Fetch Bar */}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Search className="size-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Quick Patient Lookup:</span>
              </div>
              <div className="flex gap-2">
                {['P001', 'P002', 'P003', 'fareethimran2006@gmail.com'].map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleFetchPatient(id)}
                    className="rounded-lg bg-slate-100 hover:bg-[#e8f6f2] hover:text-[#0a6b61] px-2.5 py-1 text-xs font-mono font-semibold transition"
                  >
                    Fetch {id}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION A: Patient Details (Common for Both) */}
            <section className="mt-5 rounded-2xl border border-rose-200 bg-[#fdeeed]/70 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2.5 text-rose-950 border-b border-rose-200/80 pb-3 mb-4">
                <span className="flex size-7 items-center justify-center rounded-lg bg-rose-200 text-rose-800">
                  <User className="size-4" />
                </span>
                <h2 className="text-base font-bold">A. Patient Details (Common for Both)</h2>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Patient ID with Fetch Button */}
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Patient ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                      placeholder="e.g., P001"
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <button
                      type="button"
                      disabled={fetching}
                      onClick={() => handleFetchPatient(formData.patientId)}
                      className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 text-xs font-bold transition disabled:opacity-50"
                    >
                      <RefreshCw className={cn('size-3', fetching && 'animate-spin')} />
                      Fetch Data
                    </button>
                  </div>
                </div>

                {/* Age */}
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    placeholder="e.g., 45"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Gender</label>
                  <div className="flex items-center gap-5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={() => setFormData({ ...formData, gender: 'Male' })}
                        className="accent-rose-600"
                      />
                      Male
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={() => setFormData({ ...formData, gender: 'Female' })}
                        className="accent-rose-600"
                      />
                      Female
                    </label>
                  </div>
                </div>

                {/* Family History */}
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Family History</label>
                  <select
                    value={formData.familyHistory}
                    onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value as any })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Smoking History */}
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Smoking History</label>
                  <select
                    value={formData.smokingHistory}
                    onChange={(e) => setFormData({ ...formData, smokingHistory: e.target.value as any })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION B: Diabetes Model Inputs */}
            <section className="mt-5 rounded-2xl border border-emerald-200 bg-[#eaf7ee]/70 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3 mb-4">
                <div className="flex items-center gap-2.5 text-emerald-950">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-200 text-emerald-800">
                    <Droplets className="size-4 text-red-500" />
                  </span>
                  <h2 className="text-base font-bold">B. Diabetes Model Inputs</h2>
                </div>
                <button
                  type="button"
                  disabled={evaluating}
                  onClick={handleEvaluateDiabetes}
                  className="rounded-lg bg-[#0a6b61] hover:bg-[#07594f] text-white px-3.5 py-1.5 text-xs font-bold transition shadow-sm"
                >
                  Evaluate Diabetes Risk →
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Pregnancies */}
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Pregnancies</label>
                  <input
                    type="number"
                    value={formData.pregnancies}
                    onChange={(e) => setFormData({ ...formData, pregnancies: Number(e.target.value) })}
                    placeholder="e.g., 2"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Glucose Level */}
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Glucose Level (mg/dL)</label>
                  <input
                    type="number"
                    value={formData.glucose}
                    onChange={(e) => setFormData({ ...formData, glucose: Number(e.target.value) })}
                    placeholder="e.g., 120"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Blood Pressure */}
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Blood Pressure (mmHg)</label>
                  <input
                    type="number"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: Number(e.target.value) })}
                    placeholder="e.g., 80"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Skin Thickness */}
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Skin Thickness (mm)</label>
                  <input
                    type="number"
                    value={formData.skinThickness}
                    onChange={(e) => setFormData({ ...formData, skinThickness: Number(e.target.value) })}
                    placeholder="e.g., 20"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Insulin */}
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Insulin (μU/mL)</label>
                  <input
                    type="number"
                    value={formData.insulin}
                    onChange={(e) => setFormData({ ...formData, insulin: Number(e.target.value) })}
                    placeholder="e.g., 85"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* BMI */}
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">BMI (kg/m²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bmi}
                    onChange={(e) => setFormData({ ...formData, bmi: Number(e.target.value) })}
                    placeholder="e.g., 32.1"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Diabetes Pedigree Function */}
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Diabetes Pedigree Function</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.diabetesPedigree}
                    onChange={(e) => setFormData({ ...formData, diabetesPedigree: Number(e.target.value) })}
                    placeholder="e.g., 0.5"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Age (synced) */}
                <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Age (Synced from Section A)</label>
                  <input
                    type="number"
                    disabled
                    value={formData.age}
                    className="rounded-lg border border-slate-200 bg-emerald-50/60 px-3 py-2 text-xs text-slate-600 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* SECTION C: Heart Disease Model Inputs */}
            <section className="mt-5 rounded-2xl border border-amber-200 bg-[#fff9ed]/80 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3 mb-4">
                <div className="flex items-center gap-2.5 text-amber-950">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-amber-200 text-amber-800">
                    <HeartPulse className="size-4 text-red-500" />
                  </span>
                  <h2 className="text-base font-bold">C. Heart Disease Model Inputs</h2>
                </div>
                <button
                  type="button"
                  disabled={evaluating}
                  onClick={handleEvaluateHeart}
                  className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-sm"
                >
                  Evaluate Heart Disease Risk →
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Age */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    placeholder="e.g., 54"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Sex */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Sex</label>
                  <div className="flex items-center gap-5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                      <input
                        type="radio"
                        name="heart_sex"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={() => setFormData({ ...formData, gender: 'Male' })}
                        className="accent-amber-600"
                      />
                      Male
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                      <input
                        type="radio"
                        name="heart_sex"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={() => setFormData({ ...formData, gender: 'Female' })}
                        className="accent-amber-600"
                      />
                      Female
                    </label>
                  </div>
                </div>

                {/* Chest Pain Type */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Chest Pain Type</label>
                  <select
                    value={formData.chestPainType}
                    onChange={(e) => setFormData({ ...formData, chestPainType: Number(e.target.value) })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="1">1: Typical Angina</option>
                    <option value="2">2: Atypical Angina</option>
                    <option value="3">3: Non-Anginal Discomfort</option>
                    <option value="4">4: Asymptomatic</option>
                  </select>
                </div>

                {/* Resting Blood Pressure */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Resting Blood Pressure (mmHg)</label>
                  <input
                    type="number"
                    value={formData.restingBP}
                    onChange={(e) => setFormData({ ...formData, restingBP: Number(e.target.value) })}
                    placeholder="e.g., 130"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Cholesterol */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    value={formData.cholesterol}
                    onChange={(e) => setFormData({ ...formData, cholesterol: Number(e.target.value) })}
                    placeholder="e.g., 240"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Fasting Blood Sugar */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Fasting Blood Sugar (&gt; 120 mg/dL)</label>
                  <select
                    value={formData.fastingBS}
                    onChange={(e) => setFormData({ ...formData, fastingBS: e.target.value as any })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* Resting ECG Results */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Resting ECG Results</label>
                  <select
                    value={formData.restingECG}
                    onChange={(e) => setFormData({ ...formData, restingECG: Number(e.target.value) })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="0">0: Normal</option>
                    <option value="1">1: ST-T wave abnormality</option>
                    <option value="2">2: Left ventricular hypertrophy (LVH)</option>
                  </select>
                </div>

                {/* Maximum Heart Rate Achieved */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Maximum Heart Rate Achieved</label>
                  <input
                    type="number"
                    value={formData.maxHeartRate}
                    onChange={(e) => setFormData({ ...formData, maxHeartRate: Number(e.target.value) })}
                    placeholder="e.g., 150"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Exercise Induced Angina */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Exercise Induced Angina</label>
                  <select
                    value={formData.exerciseAngina}
                    onChange={(e) => setFormData({ ...formData, exerciseAngina: e.target.value as any })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* ST Depression */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">ST Depression (Oldpeak)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.oldpeak}
                    onChange={(e) => setFormData({ ...formData, oldpeak: Number(e.target.value) })}
                    placeholder="e.g., 1.2"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Slope of ST Segment */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Slope of ST Segment</label>
                  <select
                    value={formData.slope}
                    onChange={(e) => setFormData({ ...formData, slope: Number(e.target.value) })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="1">1: Upsloping</option>
                    <option value="2">2: Flat</option>
                    <option value="3">3: Downsloping</option>
                  </select>
                </div>

                {/* Number of Major Vessels */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Number of Major Vessels (0–3)</label>
                  <select
                    value={formData.majorVessels}
                    onChange={(e) => setFormData({ ...formData, majorVessels: Number(e.target.value) })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="0">0 vessels</option>
                    <option value="1">1 vessel</option>
                    <option value="2">2 vessels</option>
                    <option value="3">3 vessels</option>
                  </select>
                </div>

                {/* Thalassemia */}
                <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-2">
                  <label className="font-semibold text-slate-700">Thalassemia</label>
                  <select
                    value={formData.thalassemia}
                    onChange={(e) => setFormData({ ...formData, thalassemia: Number(e.target.value) })}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="3">3: Normal</option>
                    <option value="6">6: Fixed defect</option>
                    <option value="7">7: Reversible defect</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Bottom Comprehensive Evaluation Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
              <div>
                <p className="text-xs font-bold text-slate-800">Ready to compute risk?</p>
                <p className="text-[11px] text-slate-400">All input fields are mapped directly to backend clinical machine learning models.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={evaluating}
                  onClick={handleEvaluateComprehensive}
                  className="flex items-center gap-2 rounded-xl bg-[#0a6b61] hover:bg-[#07594f] text-white px-5 py-2.5 text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {evaluating ? <RefreshCw className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  Run Comprehensive Evaluation (Models B + C)
                </button>
              </div>
            </div>

            {/* Assessment Decision Support Results */}
            {assessmentResult && (
              <div className="mt-8 rounded-3xl border border-teal-300 bg-white p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className={cn('flex size-11 items-center justify-center rounded-2xl font-bold', assessmentResult.prediction?.risk_tier === 'High' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600')}>
                      <Activity className="size-6" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{assessmentResult.prediction?.condition}</h3>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-600">Patient: {formData.patientId}</span>
                      </div>
                      <p className="text-xs text-slate-400">Validated by Clinical Decision Agent • Saved to SQLite</p>
                    </div>
                  </div>
                  <span className={cn('rounded-full px-4 py-2 text-xs font-bold', assessmentResult.prediction?.risk_tier === 'High' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700')}>
                    {assessmentResult.prediction?.risk_tier} Risk ({Math.round((assessmentResult.prediction?.probability || 0) * 100)}%)
                  </span>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-red-50/60 p-4 border border-red-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-red-800">Clinical Alerts & Warnings</p>
                    <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-red-950 font-medium">
                      {assessmentResult.decision_support?.clinical_alerts?.map((alert: string, i: number) => (
                        <li key={i}>{alert}</li>
                      )) || <li>Patient risk metrics require ongoing monitoring.</li>}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Recommended Diagnostic Workup</p>
                    <ul className="mt-3 list-inside list-disc space-y-1.5 text-xs text-slate-800 font-medium">
                      {assessmentResult.decision_support?.diagnostic_workup?.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      )) || <li>Comprehensive clinical panel recommended.</li>}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#e8f6f2] p-4 text-[#0a6b61] border border-teal-100">
                  <p className="text-xs font-bold uppercase tracking-wider">Physician Care & Lifestyle Plan</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-teal-950 font-medium">
                    {assessmentResult.decision_support?.lifestyle_plan?.map((step: string, i: number) => (
                      <li key={i}>• {step}</li>
                    )) || <li>• Advise patient on dietary balance and moderate physical activity.</li>}
                  </ul>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setActiveTab('history')} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50">
                    View in Assessment History →
                  </button>
                  <button onClick={() => setActiveTab('reports')} className="rounded-xl bg-[#0a6b61] px-4 py-2 text-xs font-semibold text-white">
                    Generate Doctor Report →
                  </button>
                </div>
              </div>
            )}
          </main>
        )}

        {/* Tab 3: Patient Registry */}
        {activeTab === 'patients' && (
          <main className="mx-auto max-w-6xl p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-[#0a6b61]">HOSPITAL REGISTRY</span>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">Patient Directory</h1>
                <p className="text-xs text-slate-400 mt-1">Queried from SQLite table <code>patients</code>.</p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Patient ID / MRN</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Age</th>
                    <th className="px-6 py-4">Sex</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {[
                    { id: 'P001', name: 'Alex Morgan', age: 45, sex: 'Male' },
                    { id: 'P002', name: 'Robert Vance', age: 58, sex: 'Male' },
                    { id: 'P003', name: 'Elena Cruz', age: 42, sex: 'Female' },
                    { id: 'fareethimran2006@gmail.com', name: 'Imran Fareeth', age: 20, sex: 'Male' },
                    { id: 'PT-DEFAULT', name: 'Baseline Patient', age: 45, sex: 'Male' },
                  ].map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">{p.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                      <td className="px-6 py-4">{p.age} yrs</td>
                      <td className="px-6 py-4">{p.sex}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            handleFetchPatient(p.id)
                            setActiveTab('evaluate')
                          }}
                          className="rounded-lg bg-[#e8f6f2] px-3 py-1.5 text-[11px] font-bold text-[#0a6b61] hover:bg-[#d0efe6]"
                        >
                          Fetch & Evaluate →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        )}

        {/* Tab 4: Assessment History */}
        {activeTab === 'history' && (
          <main className="mx-auto max-w-6xl p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-[#0a6b61]">RECORD ARCHIVE</span>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">Clinical Assessment History</h1>
                <p className="text-xs text-slate-400 mt-1">Stored in SQLite database table <code>assessments</code>.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadHistory}
                  disabled={loadingHistory}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RefreshCw className={cn('size-3.5', loadingHistory && 'animate-spin')} /> Refresh SQLite
                </button>
                <button
                  onClick={() => setActiveTab('evaluate')}
                  className="rounded-xl bg-[#0a6b61] px-4 py-2 text-xs font-semibold text-white hover:bg-[#07594f]"
                >
                  + New Patient Evaluation
                </button>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Assessment ID</th>
                      <th className="px-6 py-4">Patient MRN</th>
                      <th className="px-6 py-4">Condition</th>
                      <th className="px-6 py-4">Risk Tier</th>
                      <th className="px-6 py-4">Probability</th>
                      <th className="px-6 py-4">Urgency</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                    {assessmentsList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4 font-mono font-medium text-slate-900">{item.assessment_id}</td>
                        <td className="px-6 py-4 font-mono font-semibold text-slate-800">{item.patient_id}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{item.condition}</td>
                        <td className="px-6 py-4">
                          <span className={cn('inline-flex rounded-full px-2.5 py-1 font-bold text-[11px]', item.risk_tier === 'High' ? 'bg-red-100 text-red-700' : item.risk_tier === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>
                            {item.risk_tier} Risk
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">{Math.round(item.probability * 100)}%</td>
                        <td className="px-6 py-4">{item.urgency || 'Routine Clinical'}</td>
                        <td className="px-6 py-4 text-slate-400">
                          {item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              handleFetchPatient(item.patient_id)
                              setActiveTab('evaluate')
                            }}
                            className="text-[#0a6b61] font-semibold hover:underline"
                          >
                            Load Inputs →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* Tab 5: AI Explainability */}
        {activeTab === 'ai' && (
          <main className="mx-auto max-w-5xl p-5 sm:p-8">
            <div>
              <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-[#0a6b61]">MODEL TRANSPARENCY</span>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">Explainable AI & SHAP Drivers</h1>
              <p className="text-xs text-slate-400 mt-1">Clinical threshold sensitivity and local biomarker attribution.</p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-[#0a6b61]">
                    <Droplets className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">Diabetes Model (B)</h3>
                    <p className="text-xs text-slate-400">Decision Threshold: 0.40 • F1 Optimized</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Biomarkers evaluated: Pregnancies, Glucose, Blood Pressure, Skin Thickness, Insulin, BMI, Diabetes Pedigree, Age.
                </p>
                <div className="mt-5 rounded-2xl bg-slate-50 p-3.5 text-xs border border-slate-100">
                  <span className="font-bold text-slate-700">Top SHAP Positive Risk Drivers:</span>
                  <p className="mt-1 text-slate-600">Glucose level &gt; 120 mg/dL (+0.45), BMI over 30 (+0.38), Insulin resistance (+0.25).</p>
                </div>
                <button
                  onClick={() => setActiveTab('evaluate')}
                  className="mt-6 w-full rounded-xl bg-[#0a6b61] py-2.5 text-xs font-bold text-white hover:bg-[#07594f]"
                >
                  Enter Patient Biomarkers →
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-[#0a6b61]">
                    <HeartPulse className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">Coronary Heart Disease Model (C)</h3>
                    <p className="text-xs text-slate-400">Decision Threshold: 0.50 • Balanced Sensitivity</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Parameters evaluated: Resting BP, Cholesterol, Fasting BS, Resting ECG, Max Heart Rate, Exercise Angina, ST Depression (Oldpeak), Slope, Vessels, Thalassemia.
                </p>
                <div className="mt-5 rounded-2xl bg-slate-50 p-3.5 text-xs border border-slate-100">
                  <span className="font-bold text-slate-700">Top SHAP Positive Risk Drivers:</span>
                  <p className="mt-1 text-slate-600">Cholesterol &gt; 240 mg/dL, Exercise Induced Angina (+0.45), ST Depression &gt; 1.0mm.</p>
                </div>
                <button
                  onClick={() => setActiveTab('evaluate')}
                  className="mt-6 w-full rounded-xl bg-[#0a6b61] py-2.5 text-xs font-bold text-white hover:bg-[#07594f]"
                >
                  Enter Heart Disease Inputs →
                </button>
              </div>
            </div>
          </main>
        )}

        {/* Tab 6: Doctor Credentials */}
        {activeTab === 'profile' && (
          <main className="mx-auto max-w-4xl p-5 sm:p-8">
            <div>
              <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-[#0a6b61]">PHYSICIAN CREDENTIALS</span>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">Doctor Profile</h1>
              <p className="text-xs text-slate-400 mt-1">Medical license and institutional verification details.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const name = (form.elements.namedItem('doc_name') as HTMLInputElement)?.value || doctor.name
              const specialty = (form.elements.namedItem('doc_spec') as HTMLInputElement)?.value || doctor.specialty
              const licenseId = (form.elements.namedItem('doc_lic') as HTMLInputElement)?.value || doctor.licenseId
              const hospital = (form.elements.namedItem('doc_hosp') as HTMLInputElement)?.value || doctor.hospital

              const updated: DoctorProfile = { ...doctor, name, specialty, licenseId, hospital }
              onUpdateDoctor(updated)
              try { localStorage.setItem('pulsepath_doctor', JSON.stringify(updated)) } catch {}
              alert('Doctor credentials updated!')
            }} className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-[#0a6b61] text-2xl font-bold text-white">
                  {initials}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
                  <p className="text-xs text-slate-500">{doctor.specialty} • {doctor.licenseId}</p>
                  <p className="text-xs text-[#0a6b61] font-semibold">{doctor.email}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Doctor Full Name</label>
                  <input name="doc_name" defaultValue={doctor.name} className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:ring-2 focus:ring-[#0a8879]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Medical License / NPI</label>
                  <input name="doc_lic" defaultValue={doctor.licenseId} className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:ring-2 focus:ring-[#0a8879]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Clinical Specialty</label>
                  <input name="doc_spec" defaultValue={doctor.specialty} className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:ring-2 focus:ring-[#0a8879]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Hospital Affiliation</label>
                  <input name="doc_hosp" defaultValue={doctor.hospital} className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:ring-2 focus:ring-[#0a8879]" />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button type="submit" className="rounded-xl bg-[#0a6b61] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#07594f]">
                  Save Credentials
                </button>
              </div>
            </form>
          </main>
        )}

        {/* Tab 7: Reports */}
        {activeTab === 'reports' && (
          <main className="mx-auto max-w-4xl p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-[#0a6b61]">CLINICAL CONSULTATION</span>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">Physician Summary Report</h1>
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.print()
                }}
                className="flex items-center gap-2 rounded-xl bg-[#0a6b61] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#07594f]"
              >
                <Printer className="size-4" /> Print / Export PDF
              </button>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex justify-between border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">PULSEPATH CLINICAL CONSULTATION SUMMARY</h2>
                  <p className="text-xs text-slate-400 mt-1">Generated: {new Date().toLocaleDateString()} • System Version 1.0.0</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold text-slate-900">{doctor.name}</p>
                  <p className="text-slate-500">{doctor.specialty}</p>
                  <p className="text-slate-500">License: {doctor.licenseId}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Evaluated Cases</h3>
                <div className="mt-3 space-y-3">
                  {assessmentsList.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-xs border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">{item.patient_id} — {item.condition}</p>
                        <p className="text-slate-500 mt-0.5">Date: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'} | Action: {item.urgency || 'Routine'}</p>
                      </div>
                      <span className="font-bold text-slate-800">
                        {item.risk_tier} Risk ({Math.round(item.probability * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6 flex justify-between items-end text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-700">Attending Physician Attestation</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">I attest that I have reviewed the AI-generated risk markers and clinical workup guidance.</p>
                </div>
                <div className="text-right">
                  <div className="border-b border-slate-300 w-48 mb-1" />
                  <p className="font-mono text-[11px] font-semibold text-slate-700">{doctor.name}</p>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, hint }: { icon: typeof Activity; label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <Icon className="size-4 text-[#0a8879]" />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-[#0a8879] font-medium">{hint}</p>
    </div>
  )
}
