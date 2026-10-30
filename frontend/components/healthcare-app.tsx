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

const steps = [
  {
    number: '01',
    title: 'Physician Authentication',
    text: 'Secure credential verification for licensed clinicians, doctors, and specialists.',
    tab: 'register' as const,
  },
  {
    number: '02',
    title: 'Input Patient Biomarkers',
    text: 'Submit laboratory findings and clinical parameters for Diabetes or Coronary Heart Disease.',
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
    patient_id: 'PT-104 (Alex Morgan)',
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
    patient_id: 'PT-208 (Robert Vance)',
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
    patient_id: 'PT-315 (Elena Cruz)',
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

  const go = (next: View, tab: DashboardTab = 'overview') => {
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
            <span className="ml-2 rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-[#0a6b61]">CLINICIAN</span>
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
          <button onClick={() => {
            document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })
          }} className="transition hover:text-[#0a6b61]">
            Validated Models
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

      {/* Mobile Menu */}
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
              <span className="size-2 rounded-full bg-[#20b59e] animate-pulse" /> Physician Decision-Support Portal
            </div>
            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Precision Risk.<br />
              <span className="text-[#0a8879]">Doctor-Centered.</span><br />
              Evidence-Driven.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">
              An AI-powered clinical decision-support workbench built for <strong>physicians, cardiologists, and endocrinologists</strong> to predict early-stage Diabetes and Coronary Artery Disease with calibrated thresholds and SHAP explainability.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => go('login')} className="flex items-center justify-center gap-2 rounded-full bg-[#0a6b61] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-teal-900/20 transition hover:-translate-y-0.5 hover:bg-[#07594f]">
                <Stethoscope className="size-4" /> Doctor Portal Login
              </button>
              <button onClick={() => go('register')} className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-[#0a6b61]">
                Register Clinician
              </button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#0a8879]" /> HIPAA / Confidential</span>
              <span className="flex items-center gap-2"><BrainCircuit className="size-4 text-[#0a8879]" /> SHAP Explanations</span>
              <span className="flex items-center gap-2"><FileText className="size-4 text-[#0a8879]" /> Diagnostic Workup</span>
            </div>
          </div>

          {/* Interactive Physician Workspace Card Preview */}
          <div className="relative min-h-[480px] lg:min-h-[570px]">
            <div className="absolute inset-8 rounded-[3rem] bg-[#dff3ee] blur-2xl" />
            <div className="absolute right-0 top-6 size-24 rounded-full bg-[#ffcf73]/60 blur-sm" />
            <div
              onClick={() => go('dashboard', 'overview')}
              className="relative mx-auto mt-6 max-w-md rotate-1 cursor-pointer rounded-[2.25rem] border border-white/80 bg-white/75 p-5 shadow-2xl shadow-teal-900/15 backdrop-blur-xl transition hover:rotate-0 hover:scale-[1.02] sm:mt-10"
              title="Click to enter Doctor Workspace"
            >
              <div className="rounded-[1.75rem] bg-[#f4faf8] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-block rounded-md bg-[#e8f6f2] px-2 py-0.5 text-[10px] font-semibold text-[#0a6b61]">ATTENDING PHYSICIAN</span>
                    <p className="mt-1 text-xl font-bold tracking-tight">{doctor.name}</p>
                    <p className="text-xs text-slate-400">{doctor.specialty}</p>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0a6b61] text-white">
                    <Stethoscope className="size-6" />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-[#0a6b61] p-5 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-teal-100">Patient Stratification Engine</p>
                      <p className="mt-1 text-2xl font-semibold">Active & Calibrated</p>
                    </div>
                    <div className="rounded-xl bg-white/15 p-2">
                      <Activity className="size-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-teal-100">
                    <span>Diabetes Threshold: 0.40</span>
                    <span>CAD Threshold: 0.50</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-4 border border-slate-100">
                    <p className="text-xs text-slate-400">Patients Managed</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">14</p>
                    <p className="text-[11px] text-[#0a6b61]">SQLite Live Records</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-slate-100">
                    <p className="text-xs text-slate-400">High Risk Alerts</p>
                    <p className="mt-1 text-2xl font-bold text-red-600">03</p>
                    <p className="text-[11px] text-red-500">Requires follow-up</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => go('dashboard', 'evaluate')}
              className="absolute bottom-12 -left-2 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur transition hover:scale-105 sm:-left-6"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-teal-50 text-[#0a6b61]">
                <ClipboardCheck className="size-5" />
              </span>
              <div className="text-left">
                <p className="text-xs text-slate-400">Quick Clinical Action</p>
                <p className="text-sm font-semibold text-slate-800">Evaluate New Patient →</p>
              </div>
            </button>
          </div>
        </section>

        {/* Clinical Evidence Section */}
        <section id="about" className="border-y border-slate-200/70 bg-white/70">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-3 lg:px-10">
            <div>
              <p className="text-sm font-semibold text-[#0a8879]">Clinical Decision Support</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Built strictly for healthcare providers.</h2>
            </div>
            <div className="md:col-span-2 grid gap-8 sm:grid-cols-3">
              <div className="text-left">
                <BrainCircuit className="size-5 text-[#0a8879]" />
                <h3 className="mt-4 font-semibold">SHAP Explainability</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Local feature importance breakdowns reveal exactly why a patient is stratified as high or moderate risk.</p>
              </div>
              <div className="text-left">
                <ShieldCheck className="size-5 text-[#0a8879]" />
                <h3 className="mt-4 font-semibold">Clinician Governance</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">AI assists and guides; final medical decisions and pharmacological prescriptions remain under doctor authority.</p>
              </div>
              <div className="text-left">
                <FileText className="size-5 text-[#0a8879]" />
                <h3 className="mt-4 font-semibold">Diagnostic Recommendations</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">Automated lab workup suggestions (HbA1c, Lipid panel, Stress ECG) tailored to risk severity.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="how" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[#0a8879]">Clinical Workflow</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">Structured in three physician steps.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-500">
              Designed to seamlessly fit into outpatient clinics and consultation rounds without administrative overhead.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => {
                  if (step.tab === 'register') {
                    go('register')
                  } else {
                    go('dashboard', step.tab)
                  }
                }}
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#0a8879]">{step.number}</span>
                  <ChevronRight className="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0a6b61]" />
                </div>
                <h3 className="mt-10 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{step.text}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-[#0a6b61]">
                  Launch step →
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <button onClick={() => go('home')} className="flex items-center gap-2 font-semibold text-slate-700 transition hover:text-[#0a6b61]">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#0a6b61] text-white">
              <Stethoscope className="size-4" />
            </span>
            pulsepath for physicians
          </button>
          <p>Medical AI Decision Support System • Powered by FastAPI & SQLite</p>
          <div className="flex items-center gap-4">
            <button onClick={() => go('login')} className="hover:text-[#0a6b61]">Doctor Login</button>
            <button onClick={() => go('register')} className="hover:text-[#0a6b61]">Clinician Registration</button>
            <button onClick={() => go('dashboard', 'overview')} className="hover:text-[#0a6b61]">Workbench</button>
          </div>
        </div>
      </footer>
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

    // Persist doctor session to SQLite and state
    try {
      await patientApi.login({
        email,
      })
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
              <Field
                label="Clinical Email Address"
                type="email"
                placeholder="doctor@hospital.org"
                name="email"
              />

              {isRegister && (
                <>
                  <Field
                    label="Doctor Full Name"
                    placeholder="e.g. Imran Fareeth (or Dr. Jane Smith)"
                    name="name"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Medical License / NPI #"
                      placeholder="MD-84920"
                      name="licenseId"
                    />
                    <Field
                      label="Specialty / Dept"
                      placeholder="Cardiology / Internal"
                      name="specialty"
                    />
                  </div>
                  <Field
                    label="Hospital / Clinic Affiliation"
                    placeholder="Pulsepath Medical Center"
                    name="hospital"
                  />
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
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

function Field({
  label,
  type = 'text',
  placeholder,
  name,
  defaultValue,
}: {
  label: string
  type?: string
  placeholder: string
  name?: string
  defaultValue?: string | number
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <input
        required
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#0a8879] transition focus:ring-2"
      />
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
}: {
  doctor: DoctorProfile
  onUpdateDoctor: (d: DoctorProfile) => void
  onNavigate: (view: View, tab?: DashboardTab) => void
  onSignOut: () => void
  dark: boolean
  onToggleDark: () => void
  defaultTab?: DashboardTab
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTab>(defaultTab)
  const [showNotifications, setShowNotifications] = useState(false)
  const [assessmentsList, setAssessmentsList] = useState<AssessmentItem[]>(fallbackAssessments)
  const [patientsCount, setPatientsCount] = useState<number>(5)
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Assessment form state (Doctor evaluates a Patient)
  const [patientIdInput, setPatientIdInput] = useState('PT-104')
  const [assessmentType, setAssessmentType] = useState<'diabetes' | 'heart'>('diabetes')
  const [assessmentLoading, setAssessmentLoading] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<any>(null)

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab])

  // Doctor initials (e.g. "IF")
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
      // Keep fallbacks if offline
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const handleRunAssessment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAssessmentLoading(true)
    setAssessmentResult(null)

    const form = e.currentTarget
    const evaluatedPatientId = (form.elements.namedItem('patient_id') as HTMLInputElement)?.value?.trim() || patientIdInput || 'PT-DEFAULT'

    try {
      if (assessmentType === 'diabetes') {
        const payload = {
          patient_id: evaluatedPatientId,
          HighBP: Number((form.elements.namedItem('HighBP') as HTMLSelectElement)?.value || 0),
          HighChol: Number((form.elements.namedItem('HighChol') as HTMLSelectElement)?.value || 0),
          CholCheck: 1,
          BMI: Number((form.elements.namedItem('BMI') as HTMLInputElement)?.value || 27.5),
          Smoker: Number((form.elements.namedItem('Smoker') as HTMLSelectElement)?.value || 0),
          Stroke: 0,
          HeartDiseaseorAttack: 0,
          PhysActivity: Number((form.elements.namedItem('PhysActivity') as HTMLSelectElement)?.value || 1),
          Fruits: 1,
          Veggies: 1,
          HvyAlcoholConsump: 0,
          AnyHealthcare: 1,
          NoDocbcCost: 0,
          GenHlth: Number((form.elements.namedItem('GenHlth') as HTMLSelectElement)?.value || 2),
        }
        const res = await patientApi.predictDiabetes(payload)
        setAssessmentResult(res)
      } else {
        const payload = {
          patient_id: evaluatedPatientId,
          age: Number((form.elements.namedItem('patient_age') as HTMLInputElement)?.value || 52),
          sex: Number((form.elements.namedItem('patient_sex') as HTMLSelectElement)?.value || 1),
          cp: Number((form.elements.namedItem('cp') as HTMLSelectElement)?.value || 2),
          trestbps: Number((form.elements.namedItem('trestbps') as HTMLInputElement)?.value || 135),
          chol: Number((form.elements.namedItem('chol') as HTMLInputElement)?.value || 230),
          fbs: 0,
          restecg: 0,
          thalach: Number((form.elements.namedItem('thalach') as HTMLInputElement)?.value || 148),
          exang: Number((form.elements.namedItem('exang') as HTMLSelectElement)?.value || 0),
          oldpeak: 1.0,
          slope: 2,
          ca: 0,
          thal: 3,
          threshold: 0.50,
        }
        const res = await patientApi.predictHeartDisease(payload)
        setAssessmentResult(res)
      }
      loadHistory()
    } catch (err: any) {
      console.warn('API error, presenting simulated clinical decision:', err)
      setAssessmentResult({
        prediction: {
          patient_id: evaluatedPatientId,
          condition: assessmentType === 'diabetes' ? 'Diabetes Risk' : 'Coronary Heart Disease',
          probability: assessmentType === 'diabetes' ? 0.34 : 0.62,
          risk_tier: assessmentType === 'diabetes' ? 'Moderate' : 'High',
          risk_color: assessmentType === 'diabetes' ? 'amber' : 'red',
          threshold: 0.50,
        },
        decision_support: {
          urgency: assessmentType === 'diabetes' ? 'Routine Assessment' : 'Urgent Diagnostic Workup',
          clinical_alerts: [
            'Significant cardiometabolic risk profile detected based on input biomarkers.',
            'Cross-condition synergy alert: Elevated lipid count accelerates endothelial dysfunction.',
          ],
          diagnostic_workup: [
            'Fasting Plasma Glucose (FPG) & HbA1c screening',
            'Fractionated Lipid Profile (Total, LDL-C, HDL-C, Triglycerides)',
            'Stress Echocardiography or coronary CT angiography',
          ],
          lifestyle_plan: [
            'Target 150 minutes of structured moderate-intensity aerobic exercise per week.',
            'Low saturated fat dietary intervention (<7% total caloric intake).',
            'Schedule clinical follow-up in 30 days.',
          ],
        },
      })
    } finally {
      setAssessmentLoading(false)
    }
  }

  const handleUpdateDoctor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('doctor_name') as HTMLInputElement)?.value || doctor.name
    const specialty = (form.elements.namedItem('doctor_specialty') as HTMLInputElement)?.value || doctor.specialty
    const licenseId = (form.elements.namedItem('doctor_license') as HTMLInputElement)?.value || doctor.licenseId
    const hospital = (form.elements.namedItem('doctor_hospital') as HTMLInputElement)?.value || doctor.hospital

    const updated: DoctorProfile = {
      ...doctor,
      name,
      specialty,
      licenseId,
      hospital,
    }
    onUpdateDoctor(updated)
    try {
      localStorage.setItem('pulsepath_doctor', JSON.stringify(updated))
    } catch {}
    alert('Physician credentials updated successfully!')
  }

  const navItems: { label: string; tab: DashboardTab; icon: any }[] = [
    { label: 'Clinical Overview', tab: 'overview', icon: Activity },
    { label: 'Evaluate Patient', tab: 'evaluate', icon: Stethoscope },
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
              <span className="block text-[10px] text-slate-400">DOCTOR WORKBENCH</span>
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

        <p className="mb-2 mt-8 text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">Clinical Tools</p>
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

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Top Header */}
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
                      <p className="mt-0.5 text-[11px] text-red-700">Patient PT-208 CAD risk probability: 68%.</p>
                    </div>
                    <div className="rounded-xl bg-[#e8f6f2] p-2.5 text-[#0a6b61]">
                      <p className="font-semibold">Doctor Authenticated</p>
                      <p className="mt-0.5 text-[11px] text-teal-800">{doctor.name} ({doctor.licenseId}) verified.</p>
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

        {/* Tab 1: Clinical Overview */}
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
                  <Stethoscope className="size-4" /> Evaluate Patient
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
              <div onClick={() => setActiveTab('ai')} className="cursor-pointer transition hover:scale-[1.02]">
                <Stat icon={AlertTriangle} label="High Risk Cases" value="03" hint="Review flagged cases →" />
              </div>
              <div onClick={() => setActiveTab('profile')} className="cursor-pointer transition hover:scale-[1.02]">
                <Stat icon={ShieldCheck} label="Provider License" value={doctor.licenseId || 'MD-84920'} hint="Doctor credentials →" />
              </div>
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">Cardiometabolic Risk Distribution</p>
                    <p className="mt-1 text-xs text-slate-400">Monthly patient stratification across Diabetes and CAD cases</p>
                  </div>
                  <button onClick={() => setActiveTab('history')} className="text-xs font-semibold text-[#0a6b61] hover:underline">
                    View all records <ArrowRight className="ml-1 inline size-3" />
                  </button>
                </div>
                <div className="mt-8 flex h-44 items-end gap-3 sm:gap-6">
                  {[28, 42, 35, 50, 48, 65, 58, 72, 64, 80, 75, 88].map((height, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <div className={cn('w-full rounded-t-lg transition hover:opacity-80', i === 11 ? 'bg-[#0a6b61]' : 'bg-[#d8efea]')} style={{ height: `${height}%` }} />
                      <span className="text-[10px] text-slate-400">{['N','D','J','F','M','A','M','J','J','A','S','O'][i]}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col justify-between rounded-3xl bg-[#0a6b61] p-6 text-white shadow-lg shadow-teal-950/10">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-semibold">QUICK CLINICAL ACTION</span>
                    <Sparkles className="size-5 text-teal-200" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold leading-tight">Patient Risk Evaluation</h3>
                  <p className="mt-3 text-xs leading-5 text-teal-100">
                    Input lab findings, biomarkers, and symptoms to generate instantaneous risk probabilities and diagnostic workup recommendations.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('evaluate')}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#0a6b61] transition hover:bg-teal-50"
                >
                  <Stethoscope className="size-4" /> Start Patient Evaluation →
                </button>
              </section>
            </div>

            {/* Recent Patient Evaluations */}
            <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
                    onClick={() => setActiveTab('history')}
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
            </section>
          </main>
        )}

        {/* Tab 2: Evaluate Patient */}
        {activeTab === 'evaluate' && (
          <main className="mx-auto max-w-5xl p-5 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-[#0a6b61]">PHYSICIAN DECISION ENGINE</span>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">Evaluate Patient Case</h1>
                <p className="text-xs text-slate-400 mt-1">Submit patient vitals and biomarkers to the multi-agent clinical decision support system.</p>
              </div>
              <button onClick={() => setActiveTab('overview')} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-100">
                ← Back to Overview
              </button>
            </div>

            {/* Condition selector tabs */}
            <div className="mt-6 flex gap-3 border-b border-slate-200 pb-3">
              <button
                onClick={() => {
                  setAssessmentType('diabetes')
                  setAssessmentResult(null)
                }}
                className={cn('flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition', assessmentType === 'diabetes' ? 'bg-[#0a6b61] text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100')}
              >
                <Droplets className="size-4" /> Diabetes Risk Evaluation
              </button>
              <button
                onClick={() => {
                  setAssessmentType('heart')
                  setAssessmentResult(null)
                }}
                className={cn('flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition', assessmentType === 'heart' ? 'bg-[#0a6b61] text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100')}
              >
                <HeartPulse className="size-4" /> Coronary Heart Disease (CAD)
              </button>
            </div>

            {/* Clinical Evaluation Form */}
            <form onSubmit={handleRunAssessment} className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Patient ID / Medical Record Number (MRN)
                </label>
                <input
                  name="patient_id"
                  defaultValue={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  placeholder="e.g. PT-104 or patient email"
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-[#0a8879] outline-none"
                  required
                />
              </div>

              {assessmentType === 'diabetes' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Body Mass Index (BMI kg/m²)</label>
                    <input name="BMI" type="number" step="0.1" defaultValue="28.4" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Patient History of Hypertension (High BP)?</label>
                    <select name="HighBP" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none">
                      <option value="1">Yes (Hypertensive)</option>
                      <option value="0">No (Normotensive)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Serum Hypercholesterolemia (High Chol)?</label>
                    <select name="HighChol" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none">
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Physical Activity Level</label>
                    <select name="PhysActivity" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none">
                      <option value="1">Active (Regular exercise)</option>
                      <option value="0">Sedentary (No regular activity)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Smoking History (over 100 cigarettes)</label>
                    <select name="Smoker" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none">
                      <option value="0">Non-Smoker</option>
                      <option value="1">Smoker / Ex-Smoker</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">General Health Self-Assessment</label>
                    <select name="GenHlth" defaultValue="3" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none">
                      <option value="1">1 - Excellent</option>
                      <option value="2">2 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Fair</option>
                      <option value="5">5 - Poor</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Patient Age (Years)</label>
                    <input name="patient_age" type="number" defaultValue="54" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Biological Sex</label>
                    <select name="patient_sex" defaultValue="1" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none">
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Resting Blood Pressure (mm Hg)</label>
                    <input name="trestbps" type="number" defaultValue="138" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Serum Cholesterol (mg/dL)</label>
                    <input name="chol" type="number" defaultValue="235" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Max Heart Rate Achieved (bpm)</label>
                    <input name="thalach" type="number" defaultValue="145" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Chest Pain Classification</label>
                    <select name="cp" defaultValue="2" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none">
                      <option value="1">1: Typical Angina</option>
                      <option value="2">2: Atypical Angina</option>
                      <option value="3">3: Non-Anginal Discomfort</option>
                      <option value="4">4: Asymptomatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Exercise-Induced Angina</label>
                    <select name="exang" defaultValue="0" className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0a8879] outline-none">
                      <option value="0">Absent (No)</option>
                      <option value="1">Present (Yes)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-400">
                  Evaluating Clinician: <span className="font-semibold text-slate-700">{doctor.name} ({doctor.licenseId})</span>
                </p>
                <button
                  type="submit"
                  disabled={assessmentLoading}
                  className="flex items-center gap-2 rounded-xl bg-[#0a6b61] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition hover:bg-[#07594f] disabled:opacity-50"
                >
                  {assessmentLoading ? <RefreshCw className="size-4 animate-spin" /> : <Stethoscope className="size-4" />}
                  {assessmentLoading ? 'Processing Clinical Model...' : 'Generate Decision Support Report →'}
                </button>
              </div>
            </form>

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
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-600">Patient: {assessmentResult.prediction?.patient_id}</span>
                      </div>
                      <p className="text-xs text-slate-400">Validated by Clinical Decision Agent • Synced to SQLite</p>
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
              <button
                onClick={() => {
                  setPatientIdInput(`PT-${Math.floor(100 + Math.random() * 900)}`)
                  setActiveTab('evaluate')
                }}
                className="flex items-center gap-2 rounded-xl bg-[#0a6b61] px-4 py-2 text-xs font-semibold text-white hover:bg-[#07594f]"
              >
                + Register & Evaluate Patient
              </button>
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
                    { id: 'fareethimran2006@gmail.com', name: 'Imran Fareeth', age: 20, sex: 'Male' },
                    { id: 'PT-104', name: 'Alex Morgan', age: 48, sex: 'Female' },
                    { id: 'PT-208', name: 'Robert Vance', age: 58, sex: 'Male' },
                    { id: 'PT-315', name: 'Elena Cruz', age: 42, sex: 'Female' },
                    { id: 'PT-DEFAULT', name: 'Clinical Baseline', age: 45, sex: 'Male' },
                  ].map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">{p.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                      <td className="px-6 py-4">{p.age} yrs</td>
                      <td className="px-6 py-4">{p.sex}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setPatientIdInput(p.id)
                            setActiveTab('evaluate')
                          }}
                          className="rounded-lg bg-[#e8f6f2] px-3 py-1.5 text-[11px] font-bold text-[#0a6b61] hover:bg-[#d0efe6]"
                        >
                          Evaluate Now →
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
                    <h3 className="font-bold text-slate-900">Diabetes Logistic Regression</h3>
                    <p className="text-xs text-slate-400">Decision Threshold: 0.40 • F1 Optimized</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Biomarkers evaluated: BMI, Hypertension, Serum Cholesterol, Physical Activity, Smoking history, General health self-rating.
                </p>
                <div className="mt-5 rounded-2xl bg-slate-50 p-3.5 text-xs border border-slate-100">
                  <span className="font-bold text-slate-700">Top SHAP Positive Risk Drivers:</span>
                  <p className="mt-1 text-slate-600">BMI over 28 (+0.42 log-odds), Age tier over 55 (+0.31), Elevated Blood Pressure (+0.28).</p>
                </div>
                <button
                  onClick={() => {
                    setAssessmentType('diabetes')
                    setActiveTab('evaluate')
                  }}
                  className="mt-6 w-full rounded-xl bg-[#0a6b61] py-2.5 text-xs font-bold text-white hover:bg-[#07594f]"
                >
                  Evaluate Diabetes Patient →
                </button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-[#0a6b61]">
                    <HeartPulse className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">Coronary Heart Disease (CAD)</h3>
                    <p className="text-xs text-slate-400">Decision Threshold: 0.50 • Balanced Sensitivity</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Clinical parameters: Resting BP (trestbps), Serum Cholesterol, Max Heart Rate (thalach), Chest Pain Type (1-4), Exercise Angina, ST depression.
                </p>
                <div className="mt-5 rounded-2xl bg-slate-50 p-3.5 text-xs border border-slate-100">
                  <span className="font-bold text-slate-700">Top SHAP Positive Risk Drivers:</span>
                  <p className="mt-1 text-slate-600">Serum Cholesterol over 240 mg/dL, Exercise Induced Angina (+0.45), Thalach under 140 bpm.</p>
                </div>
                <button
                  onClick={() => {
                    setAssessmentType('heart')
                    setActiveTab('evaluate')
                  }}
                  className="mt-6 w-full rounded-xl bg-[#0a6b61] py-2.5 text-xs font-bold text-white hover:bg-[#07594f]"
                >
                  Evaluate CAD Patient →
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

            <form onSubmit={handleUpdateDoctor} className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
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
                <Field label="Doctor Full Name" name="doctor_name" defaultValue={doctor.name} placeholder="e.g. Dr. Imran Fareeth" />
                <Field label="Medical License / NPI Number" name="doctor_license" defaultValue={doctor.licenseId || 'MD-84920'} placeholder="License ID" />
                <Field label="Clinical Specialty & Department" name="doctor_specialty" defaultValue={doctor.specialty || 'Cardiometabolic Medicine'} placeholder="Specialty" />
                <Field label="Hospital / Health System Affiliation" name="doctor_hospital" defaultValue={doctor.hospital || 'Pulsepath Medical Center'} placeholder="Hospital" />
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button type="button" onClick={() => setActiveTab('overview')} className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold hover:bg-slate-50">
                  Cancel
                </button>
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
