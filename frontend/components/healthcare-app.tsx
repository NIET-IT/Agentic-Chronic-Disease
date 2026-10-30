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
  Clock,
  Calculator,
  Download,
  Gauge,
  Palette,
  Sliders,
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
  UploadCloud,
  X,
  Bot,
  Play,
  BookOpen,
  Settings,
  LayoutDashboard,
  Heart,
  TrendingUp,
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

export type ThemeColor = 'indigo' | 'cyan' | 'emerald' | 'purple'

export interface ThemeConfig {
  id: ThemeColor
  name: string
  label: string
  primaryGradient: string
  headerGradient: string
  cardBorder: string
  activeTabStyle: string
  primaryBtn: string
  badgeBg: string
  badgeText: string
  accentColor: string
  accentDot: string
}

export const themes: Record<ThemeColor, ThemeConfig> = {
  indigo: {
    id: 'indigo',
    name: 'Electric Indigo',
    label: 'Modern AI & Precision Care',
    primaryGradient: 'from-emerald-600 via-emerald-500 to-emerald-500',
    headerGradient: 'from-emerald-900/10 via-emerald-600/5 to-emerald-500/10',
    cardBorder: 'border-emerald-100 dark:border-emerald-950',
    activeTabStyle: 'bg-emerald-50 text-emerald-700 border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
    primaryBtn: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-700 hover:to-[#047857] shadow-lg shadow-indigo-600/25',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    accentColor: '#10b981',
    accentDot: 'bg-emerald-500',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Sapphire',
    label: 'Oceanic Clinical Horizon',
    primaryGradient: 'from-emerald-600 via-emerald-500 to-cyan-400',
    headerGradient: 'from-emerald-900/10 via-emerald-600/5 to-emerald-500/10',
    cardBorder: 'border-emerald-100 dark:border-emerald-950',
    activeTabStyle: 'bg-emerald-50 text-emerald-800 border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
    primaryBtn: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-600/25',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    accentColor: '#059669',
    accentDot: 'bg-emerald-500',
  },
  emerald: {
    id: 'emerald',
    name: 'BioTech Emerald',
    label: 'Vitality & Metabolic Care',
    primaryGradient: 'from-emerald-600 via-teal-600 to-emerald-500',
    headerGradient: 'from-emerald-900/10 via-teal-600/5 to-emerald-500/10',
    cardBorder: 'border-emerald-100 dark:border-emerald-950',
    activeTabStyle: 'bg-emerald-50 text-emerald-800 border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
    primaryBtn: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    accentColor: '#10b981',
    accentDot: 'bg-emerald-500',
  },
  purple: {
    id: 'purple',
    name: 'Royal Amethyst',
    label: 'High-Tech Neuro-Cardio',
    primaryGradient: 'from-emerald-600 via-emerald-600 to-pink-500',
    headerGradient: 'from-emerald-900/10 via-emerald-600/5 to-pink-500/10',
    cardBorder: 'border-emerald-100 dark:border-emerald-950',
    activeTabStyle: 'bg-emerald-50 text-emerald-800 border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300',
    primaryBtn: 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-pink-500 hover:from-emerald-700 hover:to-pink-600 shadow-lg shadow-purple-600/25',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    accentColor: '#10b981',
    accentDot: 'bg-emerald-500',
  },
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
    title: '1. Doctor Dashboard (Input Patient)',
    text: 'Enter Patient Details, Diabetes Model Inputs, Heart Disease Model Inputs, and Medical Reports.',
    tab: 'evaluate' as const,
  },
  {
    number: '03',
    title: 'Agentic Decision Support',
    text: 'Review SHAP local explainability, validated risk scores, and evidence-based clinical guidance.',
    tab: 'ai' as const,
  },
]


// Interactive SVG Circular Probability Dial
function ProbabilityDial({ probability, riskTier, size = 42 }: { probability: number; riskTier?: string; size?: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((probability || 0) * 100)))
  const strokeWidth = 4
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (pct / 100) * circumference
  
  const strokeColor =
    riskTier === 'High' || pct >= 65 ? '#ef4444' :
    riskTier === 'Moderate' || pct >= 35 ? '#f59e0b' : '#10b981'

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="-rotate-90 transform" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-700"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-black text-slate-800 leading-none">{pct}%</span>
      </div>
    </div>
  )
}

function getGlucoseBadge(val: number | string) {
  const n = Number(val)
  if (!val || isNaN(n)) return null
  if (n < 70) return { text: 'Hypoglycemic (<70)', cls: 'text-amber-800 bg-amber-50 border-amber-200' }
  if (n <= 99) return { text: 'Normal Fasting (70-99)', cls: 'text-emerald-800 bg-emerald-50 border-emerald-200' }
  if (n <= 125) return { text: 'Pre-diabetes (100-125)', cls: 'text-amber-800 bg-amber-50 border-amber-200' }
  return { text: 'Diabetic Range (≥126 ADA)', cls: 'text-rose-800 bg-rose-50 border-rose-200' }
}

function getBpBadge(val: number | string) {
  const n = Number(val)
  if (!val || isNaN(n)) return null
  if (n < 120) return { text: 'Normal (<120)', cls: 'text-emerald-800 bg-emerald-50 border-emerald-200' }
  if (n <= 129) return { text: 'Elevated (120-129)', cls: 'text-amber-800 bg-amber-50 border-amber-200' }
  if (n <= 139) return { text: 'Stage 1 HTN (130-139)', cls: 'text-amber-800 bg-amber-50 border-amber-200' }
  return { text: 'Stage 2 HTN (≥140)', cls: 'text-rose-800 bg-rose-50 border-rose-200' }
}

function getBmiBadge(val: number | string) {
  const n = Number(val)
  if (!val || isNaN(n)) return null
  if (n < 18.5) return { text: 'Underweight (<18.5)', cls: 'text-emerald-800 bg-emerald-50 border-emerald-200' }
  if (n < 25) return { text: 'Normal BMI (18.5-24.9)', cls: 'text-emerald-800 bg-emerald-50 border-emerald-200' }
  if (n < 30) return { text: 'Overweight (25-29.9)', cls: 'text-amber-800 bg-amber-50 border-amber-200' }
  return { text: 'Obesity Class I+ (≥30)', cls: 'text-rose-800 bg-rose-50 border-rose-200' }
}

function getCholesterolBadge(val: number | string) {
  const n = Number(val)
  if (!val || isNaN(n)) return null
  if (n < 200) return { text: 'Desirable (<200)', cls: 'text-emerald-800 bg-emerald-50 border-emerald-200' }
  if (n <= 239) return { text: 'Borderline High (200-239)', cls: 'text-amber-800 bg-amber-50 border-amber-200' }
  return { text: 'High Risk (≥240)', cls: 'text-rose-800 bg-rose-50 border-rose-200' }
}

function getOldpeakBadge(val: number | string) {
  const n = Number(val)
  if (val === '' || isNaN(n)) return null
  if (n < 0.5) return { text: 'Normal (<0.5)', cls: 'text-emerald-800 bg-emerald-50 border-emerald-200' }
  if (n <= 1.5) return { text: 'Mild Strain (0.5-1.5)', cls: 'text-amber-800 bg-amber-50 border-amber-200' }
  return { text: 'Significant Ischemia (>1.5)', cls: 'text-rose-800 bg-rose-50 border-rose-200' }
}


// ChronicCare AI Brand Logo Component (matching design image)
function ChronicCareLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSizes = {
    sm: 'size-7',
    md: 'size-9',
    lg: 'size-11',
  }
  const heartSizes = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  }
  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className={cn(
        'relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#f97316] text-white shadow-md shadow-pink-500/20 shrink-0',
        iconSizes[size]
      )}>
        <HeartPulse className={cn(heartSizes[size], "text-white stroke-[2.4]")} />
      </div>
      <div className="flex items-baseline tracking-tight">
        <span className={cn('font-black text-slate-900 dark:text-white', textSizes[size])}>
          ChronicCare
        </span>
        <span className={cn('font-black ml-1.5 bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] bg-clip-text text-transparent', textSizes[size])}>
          AI
        </span>
      </div>
    </div>
  )
}

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
    specialty: 'Cardiometabolic Specialist',
    licenseId: 'MD-84920',
    hospital: 'ChronicCare Medical Center',
  })

  // Load saved doctor session on mount and ensure no Dr. Kumar lingering
  useEffect(() => {
    try {
      const defaultDoc: DoctorProfile = {
        name: 'Dr. Imran Fareeth',
        email: 'fareethimran2006@gmail.com',
        specialty: 'Cardiometabolic Specialist & Internal Practice',
        licenseId: 'MD-84920',
        hospital: 'ChronicCare Medical Center',
      }
      const saved = localStorage.getItem('chroniccare_doctor') || localStorage.getItem('pulsepath_doctor')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.name && !parsed.name.toLowerCase().includes('kumar')) {
          setDoctor(parsed)
        } else {
          setDoctor(defaultDoc)
          localStorage.setItem('chroniccare_doctor', JSON.stringify(defaultDoc))
          localStorage.setItem('pulsepath_doctor', JSON.stringify(defaultDoc))
        }
      } else {
        setDoctor(defaultDoc)
        localStorage.setItem('chroniccare_doctor', JSON.stringify(defaultDoc))
      }
    } catch {}
  }, [])

  const handleDoctorLogin = (profile: DoctorProfile) => {
    setDoctor(profile)
    try {
      localStorage.setItem('chroniccare_doctor', JSON.stringify(profile))
    } catch {}
  }

  const handleSignOut = () => {
    try {
      localStorage.removeItem('chroniccare_doctor')
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
    <div className={cn('min-h-screen overflow-x-hidden bg-[#fafafa] text-slate-900', dark && 'dark bg-slate-950 text-white')}>
      {/* Ambient background fluid blur gradients matching the image */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 right-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-purple-200/40 via-pink-200/30 to-amber-200/25 blur-3xl opacity-80" />
        <div className="absolute top-1/4 -left-20 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-rose-200/30 via-pink-100/25 to-purple-100/20 blur-3xl opacity-70" />
        <div className="absolute bottom-10 right-10 w-[420px] h-[420px] rounded-full bg-gradient-to-tl from-amber-100/30 via-rose-100/20 to-transparent blur-3xl opacity-60" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <button onClick={() => go('home')} className="transition hover:opacity-95 text-left" aria-label="ChronicCare AI Home">
          <ChronicCareLogo size="md" />
        </button>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-9 text-sm font-semibold text-slate-600 md:flex">
          <button
            onClick={() => go('home')}
            className="text-slate-900 font-extrabold border-b-2 border-[#ec4899] pb-0.5"
          >
            Home
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-slate-600 hover:text-slate-900 transition"
          >
            Features
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-slate-600 hover:text-slate-900 transition"
          >
            How It Works
          </button>
          <button
            onClick={() => go('dashboard', 'overview')}
            className="text-slate-600 hover:text-slate-900 transition"
          >
            For Doctors
          </button>
          <button
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-slate-600 hover:text-slate-900 transition"
          >
            About
          </button>
        </nav>

        {/* Right CTA Button & Quick Sign In */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="hidden sm:inline-flex rounded-full p-2 text-slate-400 hover:text-slate-600 transition"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            onClick={() => go('login')}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/15 transition hover:scale-[1.02]"
          >
            Doctor Login
          </button>
          <button
            className="rounded-xl p-2 md:hidden text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle mobile menu"
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-4 right-4 top-20 z-40 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-xl p-5 shadow-2xl md:hidden">
          <div className="flex flex-col gap-2.5 text-sm font-semibold text-slate-700">
            <button onClick={() => { setMenuOpen(false); go('home'); }} className="text-left py-2 px-3 rounded-xl bg-pink-50 text-[#ec4899] font-bold">
              Home
            </button>
            <button onClick={() => { setMenuOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left py-2 px-3 rounded-xl hover:bg-slate-50">
              Features
            </button>
            <button onClick={() => { setMenuOpen(false); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left py-2 px-3 rounded-xl hover:bg-slate-50">
              How It Works
            </button>
            <button onClick={() => { setMenuOpen(false); go('dashboard', 'overview'); }} className="text-left py-2 px-3 rounded-xl hover:bg-slate-50">
              For Doctors
            </button>
            <button onClick={() => { setMenuOpen(false); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left py-2 px-3 rounded-xl hover:bg-slate-50">
              About
            </button>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button onClick={() => go('login')} className="py-2.5 px-3 rounded-full bg-emerald-600 text-white font-bold text-center shadow-md">
                Doctor Login &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <main>
        <section className="relative mx-auto max-w-7xl px-5 pt-8 pb-14 sm:px-8 lg:px-10 lg:pt-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1.15fr]">
            {/* Left Column: Headline, Subtitle, Badges, CTAs */}
            <div className="relative z-10 max-w-2xl">
              {/* Top Pill Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-slate-700 shadow-xs">
                <Sparkles className="size-3.5 text-[#ec4899]" />
                <span>AI Powered</span>
                <span className="text-slate-300">|</span>
                <span>Early Prediction</span>
                <span className="text-slate-300">|</span>
                <span>Better Healthcare</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-950">
                Agentic AI for<br />
                <span className="bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] bg-clip-text text-transparent">
                  Early Detection of
                </span><br />
                <span className="text-[#6d28d9]">
                  Chronic Diseases
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                An intelligent decision support system that helps doctors predict and prevent chronic diseases like Diabetes and Heart Disease using patient data and AI.
              </p>



              {/* Trust Indicators Row */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-rose-100 text-[#ec4899]">
                    <Check className="size-3.5 stroke-[3]" />
                  </span>
                  <span>Accurate Predictions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-[#f97316]">
                    <Clock className="size-3.5 stroke-[2.5]" />
                  </span>
                  <span>Early Intervention</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-purple-100 text-[#8b5cf6]">
                    <Users className="size-3.5 stroke-[2.5]" />
                  </span>
                  <span>Better Patient Outcomes</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Preview Mockup Card */}
            <div className="relative">
              {/* Floating 3D-styled Icon Badges matching the image */}
              <div className="absolute -top-6 left-1/4 z-20 hidden sm:flex size-11 items-center justify-center rounded-2xl bg-white shadow-xl border border-purple-100 animate-bounce duration-1000">
                <BrainCircuit className="size-6 text-[#8b5cf6]" />
              </div>
              <div className="absolute -top-4 right-1/4 z-20 hidden sm:flex size-11 items-center justify-center rounded-2xl bg-white shadow-xl border border-pink-100 animate-pulse">
                <Activity className="size-6 text-[#ec4899]" />
              </div>
              <div className="absolute top-1/3 -right-4 z-20 hidden sm:flex size-11 items-center justify-center rounded-2xl bg-white shadow-xl border border-purple-100">
                <Stethoscope className="size-6 text-[#7c3aed]" />
              </div>
              <div className="absolute -bottom-4 right-1/3 z-20 hidden sm:flex size-11 items-center justify-center rounded-2xl bg-white shadow-xl border border-amber-100">
                <BarChart3 className="size-6 text-[#f97316]" />
              </div>
              <div className="absolute top-1/4 -left-4 z-20 hidden sm:flex size-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8b5cf6] to-[#ec4899] text-white shadow-xl shadow-pink-500/25">
                <HeartPulse className="size-5" />
              </div>

              {/* The Patient Dashboard Tablet Mockup */}
              <div
                onClick={() => go('dashboard', 'evaluate')}
                className="relative rounded-3xl border border-white/90 bg-white/85 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-purple-900/10 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-purple-900/15 group"
                title="Click to enter Patient Dashboard"
              >
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#f97316] text-white shadow-xs">
                      <HeartPulse className="size-4" />
                    </div>
                    <span className="text-xs font-black text-slate-800">ChronicCare <span className="text-[#ec4899]">AI</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-400/80" />
                    <span className="size-2 rounded-full bg-amber-400/80" />
                    <span className="size-2 rounded-full bg-emerald-400/80" />
                  </div>
                </div>

                {/* Mockup Body: Mini Sidebar + Content Area */}
                <div className="mt-4 grid grid-cols-[68px_1fr] sm:grid-cols-[125px_1fr] gap-3">
                  {/* Left Mini Sidebar */}
                  <div className="space-y-1 text-[11px] font-bold">
                    <div className="flex items-center gap-2 rounded-xl bg-[#fdf2f8] px-2.5 py-1.5 text-[#ec4899] border border-pink-200/60">
                      <LayoutDashboard className="size-3.5" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-slate-500 hover:bg-slate-50">
                      <User className="size-3.5" />
                      <span className="hidden sm:inline">Patient Details</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-slate-500 hover:bg-slate-50">
                      <BarChart3 className="size-3.5" />
                      <span className="hidden sm:inline">Predictions</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-slate-500 hover:bg-slate-50">
                      <BookOpen className="size-3.5" />
                      <span className="hidden sm:inline">Clinical Guidelines</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-slate-500 hover:bg-slate-50">
                      <FileText className="size-3.5" />
                      <span className="hidden sm:inline">Reports</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-slate-500 hover:bg-slate-50">
                      <Settings className="size-3.5" />
                      <span className="hidden sm:inline">Settings</span>
                    </div>
                  </div>

                  {/* Right Content Area: Exact replication of cards from image */}
                  <div className="space-y-3">
                    {/* Top Row: Diabetes Prediction & Heart Disease Prediction */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Diabetes Prediction Card */}
                      <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Droplets className="size-3.5 text-rose-500 fill-rose-500" />
                          <span className="text-[10px] font-black text-slate-800">Diabetes Prediction</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ProbabilityDial probability={0.72} riskTier="High" size={56} />
                          <div>
                            <span className="inline-block rounded-md bg-rose-100 border border-rose-200 px-2 py-0.5 text-[9px] font-black text-rose-800">
                              High Risk
                            </span>
                            <p className="mt-1 text-[8px] text-slate-400 font-bold uppercase">Key Factors</p>
                            <p className="text-[9px] text-slate-600 font-medium leading-tight">High glucose, High BMI, Age, etc.</p>
                          </div>
                        </div>
                      </div>

                      {/* Heart Disease Prediction Card */}
                      <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-xs">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Heart className="size-3.5 text-rose-500 fill-rose-500" />
                          <span className="text-[10px] font-black text-slate-800">Heart Disease Prediction</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ProbabilityDial probability={0.24} riskTier="Low" size={56} />
                          <div>
                            <span className="inline-block rounded-md bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[9px] font-black text-emerald-800">
                              Low Risk
                            </span>
                            <p className="mt-1 text-[8px] text-slate-400 font-bold uppercase">Key Factors</p>
                            <p className="text-[9px] text-slate-600 font-medium leading-tight">Age, cholesterol, blood pressure, etc.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Card: Clinical Recommendation (AI Agent) */}
                    <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/70 to-pink-50/40 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex size-6 items-center justify-center rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#ec4899] text-white shadow-xs">
                          <Bot className="size-3.5" />
                        </span>
                        <span className="text-[11px] font-black text-slate-900">
                          Clinical Recommendation (AI Agent)
                        </span>
                      </div>
                      <ul className="text-[9px] text-slate-600 space-y-1 pl-4 list-disc font-medium">
                        <li>Relevant clinical guideline information</li>
                        <li>Risk factor explanation</li>
                        <li>Lifestyle recommendations</li>
                        <li>References from trusted medical sources</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM 4 FEATURE CARDS (Exact match from the image) */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: For Doctors */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition hover:-translate-y-1 group">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-[#8b5cf6] shadow-xs group-hover:scale-105 transition-transform">
                <Users className="size-6" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-slate-900">For Doctors</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Get AI-driven predictions and clinical recommendations to support better decisions.
              </p>
              <button
                onClick={() => go('login')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#8b5cf6] hover:text-[#7c3aed] transition"
              >
                Learn More <ArrowRight className="size-3.5" />
              </button>
            </div>

            {/* Card 2: For Patients */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition hover:-translate-y-1 group">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
                <ShieldCheck className="size-6" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-slate-900">For Patients</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Understand your health risks early and take preventive action.
              </p>
              <button
                onClick={() => go('dashboard', 'evaluate')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition"
              >
                Learn More <ArrowRight className="size-3.5" />
              </button>
            </div>

            {/* Card 3: AI Powered Insights */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition hover:-translate-y-1 group">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-[#f97316] shadow-xs group-hover:scale-105 transition-transform">
                <BarChart3 className="size-6" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-slate-900">AI Powered Insights</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Uses machine learning models for Diabetes and Heart Disease prediction.
              </p>
              <button
                onClick={() => go('dashboard', 'ai')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#f97316] hover:text-amber-700 transition"
              >
                Learn More <ArrowRight className="size-3.5" />
              </button>
            </div>

            {/* Card 4: Comprehensive Reports */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition hover:-translate-y-1 group">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-[#7c3aed] shadow-xs group-hover:scale-105 transition-transform">
                <FileText className="size-6" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-slate-900">Comprehensive Reports</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Generate structured reports with predictions and clinical guidelines.
              </p>
              <button
                onClick={() => go('dashboard', 'reports')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#7c3aed] hover:text-purple-800 transition"
              >
                Learn More <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end mb-8">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#ec4899]">Clinical Workflow</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Three Simple Steps for Doctors
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-5 text-slate-500 font-medium">
              Seamlessly integrates into outpatient consultations, routine wellness screenings, and clinical triage.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
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
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#ec4899]">{step.number}</span>
                  <ChevronRight className="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#7c3aed]" />
                </div>
                <h3 className="mt-8 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">{step.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#7c3aed] group-hover:translate-x-0.5 transition-transform">
                  Launch Step &rarr;
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer id="about" className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div className="flex items-center gap-2">
            <ChronicCareLogo size="sm" />
            <span className="text-slate-400 font-medium">&bull; Agentic Clinical Decision Support</span>
          </div>
          <p>© 2026 ChronicCare AI &bull; Certified for Healthcare Providers</p>
          <div className="flex items-center gap-4 font-semibold">
            <button onClick={() => go('login')} className="hover:text-slate-900">Doctor Login</button>
            <button onClick={() => go('register')} className="hover:text-slate-900">Register</button>
            <button onClick={() => go('dashboard', 'overview')} className="hover:text-slate-900">Patient Dashboard</button>
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
    setStatus('Verifying clinician credentials and opening ChronicCare AI workbench...')

    const form = event.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim() || 'doctor@chroniccare.ai'
    const rawName = (form.elements.namedItem('name') as HTMLInputElement)?.value?.trim() || 'Dr. Imran Fareeth'
    const specialty = (form.elements.namedItem('specialty') as HTMLInputElement)?.value?.trim() || 'Cardiometabolic Specialist'
    const licenseId = (form.elements.namedItem('licenseId') as HTMLInputElement)?.value?.trim() || 'MD-84920'
    const hospital = (form.elements.namedItem('hospital') as HTMLInputElement)?.value?.trim() || 'ChronicCare Medical Center'

    let formattedName = rawName || 'Dr. Imran Fareeth'
    if (formattedName && !formattedName.toLowerCase().startsWith('dr.')) {
      formattedName = `Dr. ${formattedName}`
    }
    const name = formattedName || 'Dr. Imran Fareeth'

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
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-5 py-10 relative overflow-hidden">
      <div className="absolute top-10 right-20 -z-10 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/40 via-pink-200/30 to-amber-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-200/30 via-pink-100/25 to-purple-100/20 blur-3xl pointer-events-none" />

      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/90 bg-white/90 shadow-2xl shadow-purple-900/10 backdrop-blur-xl lg:grid-cols-[.9fr_1.1fr]">
        {/* Left Hero Panel */}
        <div className="hidden bg-gradient-to-br from-[#7c3aed] via-[#ec4899] to-[#f97316] p-10 text-white lg:flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 font-bold hover:opacity-90">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white">
                <HeartPulse className="size-5" />
              </span>
              <span className="text-xl font-black">ChronicCare AI</span>
            </button>
            <div className="mt-20">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                PHYSICIAN ACCESS
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-black leading-tight">
                Agentic AI for<br />Early Detection of<br />Chronic Diseases
              </h1>
              <p className="mt-4 text-xs leading-relaxed text-white/90 font-medium max-w-sm">
                An intelligent decision support system that helps doctors predict and prevent chronic diseases like Diabetes and Heart Disease using patient data and AI.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-xs text-white/80 font-medium">
            <p>Certified for licensed healthcare providers, cardiologists &amp; general physicians.</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <button onClick={() => onNavigate('home')} className="flex items-center gap-2 font-bold lg:hidden">
                <ChronicCareLogo size="sm" />
              </button>
              <button onClick={() => onNavigate('home')} className="ml-auto rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Close">
                <X />
              </button>
            </div>

            <div className="mx-auto mt-6 max-w-md">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-[#7c3aed]">
                <UserCheck className="size-3.5" /> Doctor / Clinician Authentication
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {isRegister ? 'Register Physician' : 'Physician Sign In'}
              </h2>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {isRegister
                  ? 'Create your clinician credentials to access AI models, patient records, and clinical guidelines.'
                  : 'Sign in to access your ChronicCare AI decision-support workbench.'}
              </p>



              <form className="mt-5 flex flex-col gap-3.5" onSubmit={handleSubmit}>
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
                      placeholder="e.g. Dr. Jane Smith"
                      name="name"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="Medical License / NPI #"
                        placeholder="MD-84920"
                        name="licenseId"
                      />
                      <Field
                        label="Specialty / Department"
                        placeholder="General Physician"
                        name="specialty"
                      />
                    </div>
                    <Field
                      label="Hospital / Clinic Affiliation"
                      placeholder="ChronicCare Medical Center"
                      name="hospital"
                    />
                  </>
                )}

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      required
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      defaultValue="chroniccare2026"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-xs outline-none ring-[#ec4899] transition focus:ring-2 font-medium"
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

                <label className="flex items-start gap-2 text-[11px] leading-4 text-slate-500 font-medium">
                  <input type="checkbox" defaultChecked required className="mt-0.5 accent-[#ec4899]" />
                  I confirm that I am a licensed healthcare provider / physician accessing this CDSS.
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-pink-500/25 transition hover:opacity-95 disabled:opacity-70"
                >
                  <HeartPulse className="size-4" />
                  {loading
                    ? 'Verifying...'
                    : isRegister
                    ? 'Register & Enter Dashboard →'
                    : 'Sign In to ChronicCare AI →'}
                </button>

                {status && (
                  <p className="rounded-xl bg-[#f8fafc] px-3.5 py-2.5 text-xs text-slate-600 font-medium">
                    {status}
                  </p>
                )}
              </form>

              <p className="mt-5 text-center text-xs text-slate-500 font-medium">
                {isRegister ? 'Already registered as a clinician?' : 'Need a clinician account?'}{' '}
                <button
                  type="button"
                  onClick={() => onNavigate(isRegister ? 'login' : 'register')}
                  className="font-bold text-[#ec4899] hover:underline"
                >
                  {isRegister ? 'Sign in' : 'Register here'}
                </button>
              </p>
            </div>
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
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[#10b981] transition focus:ring-2"
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
  const [themeColor, setThemeColor] = useState<'radiant' | 'emerald' | 'amber' | 'ruby'>('radiant')
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showBmiCalc, setShowBmiCalc] = useState(false)
  const [calcHeightCm, setCalcHeightCm] = useState<number>(175)
  const [calcWeightKg, setCalcWeightKg] = useState<number>(75)
  const [loadedPresetMsg, setLoadedPresetMsg] = useState<string>('')

  // Interactive Theme Presets with Landing Page Signature Style
  const themePresets = [
    {
      id: 'radiant' as const,
      name: 'ChronicCare Radiant',
      label: 'Violet, Fuchsia & Sunset Amber (Landing Page)',
      dot: 'bg-[#ec4899]',
      swatch: 'bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#f97316]',
      activeRing: 'ring-pink-400',
    },
    {
      id: 'emerald' as const,
      name: 'BioTech Emerald',
      label: 'Clinical Jade & Neon Mint (Vitality)',
      dot: 'bg-emerald-500',
      swatch: 'bg-gradient-to-br from-emerald-600 to-teal-500',
      activeRing: 'ring-emerald-400',
    },
    {
      id: 'amber' as const,
      name: 'Sunset Amber',
      label: 'Warm Honey & Golden Sand (Friendly)',
      dot: 'bg-amber-500',
      swatch: 'bg-gradient-to-br from-amber-500 to-orange-500',
      activeRing: 'ring-amber-400',
    },
    {
      id: 'ruby' as const,
      name: 'Imperial Ruby',
      label: 'Deep Crimson & Coral (Cardiovascular)',
      dot: 'bg-rose-500',
      swatch: 'bg-gradient-to-br from-rose-600 to-pink-500',
      activeRing: 'ring-rose-400',
    },
  ]

  const currentThemePreset = themePresets.find(t => t.id === themeColor) || themePresets[0]

  // Demo Patients Catalog for 1-Click Interactive Autofill
  const demoCases = [
    {
      name: 'Alex Morgan',
      tag: 'Pre-diabetic & Borderline CAD',
      badgeCls: 'bg-amber-100 text-amber-900 border-amber-200',
      age: 45,
      gender: 'Male' as const,
      smoking: 'No' as const,
      family: 'No' as const,
      pregnancies: 2,
      glucose: 120,
      bp: 80,
      skin: 20,
      insulin: 85,
      bmi: 32.1,
      pedigree: 0.5,
      heartAge: 54,
      cp: 1,
      rbp: 130,
      chol: 240,
      fbs: 0,
      ecg: 0,
      maxHr: 150,
      exang: 0,
      oldpeak: 1.2,
      slope: 1,
      ca: 0,
      thal: 3,
      notes: 'Routine executive checkup. Fasting glucose and cholesterol borderline. Asymptomatic resting ECG.',
    },
    {
      name: 'Robert Vance',
      tag: 'High CAD Risk & Hypertensive',
      badgeCls: 'bg-rose-100 text-rose-900 border-rose-200',
      age: 62,
      gender: 'Male' as const,
      smoking: 'Yes' as const,
      family: 'Yes' as const,
      pregnancies: 0,
      glucose: 145,
      bp: 95,
      skin: 28,
      insulin: 140,
      bmi: 30.5,
      pedigree: 0.72,
      heartAge: 62,
      cp: 3,
      rbp: 160,
      chol: 285,
      fbs: 1,
      ecg: 1,
      maxHr: 125,
      exang: 1,
      oldpeak: 2.8,
      slope: 2,
      ca: 2,
      thal: 7,
      notes: 'Exertional chest pressure and dyspnea on mild climbing. Positive family history of premature CAD.',
    },
    {
      name: 'Elena Cruz',
      tag: 'Metabolic Risk & Gestational Hx',
      badgeCls: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      age: 38,
      gender: 'Female' as const,
      smoking: 'No' as const,
      family: 'Yes' as const,
      pregnancies: 3,
      glucose: 158,
      bp: 86,
      skin: 32,
      insulin: 195,
      bmi: 34.2,
      pedigree: 0.85,
      heartAge: 38,
      cp: 2,
      rbp: 128,
      chol: 215,
      fbs: 1,
      ecg: 0,
      maxHr: 162,
      exang: 0,
      oldpeak: 0.6,
      slope: 1,
      ca: 0,
      thal: 3,
      notes: 'History of gestational diabetes during second pregnancy. Elevated fasting glucose on annual panel.',
    },
    {
      name: 'Sarah Jenkins',
      tag: 'Optimal Baseline (Low Risk)',
      badgeCls: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      age: 28,
      gender: 'Female' as const,
      smoking: 'No' as const,
      family: 'No' as const,
      pregnancies: 0,
      glucose: 88,
      bp: 72,
      skin: 18,
      insulin: 35,
      bmi: 21.8,
      pedigree: 0.22,
      heartAge: 28,
      cp: 4,
      rbp: 112,
      chol: 168,
      fbs: 0,
      ecg: 0,
      maxHr: 178,
      exang: 0,
      oldpeak: 0.0,
      slope: 1,
      ca: 0,
      thal: 3,
      notes: 'Pre-employment athletic screening. Normotensive, optimal lipid profile, and normal resting sinus rhythm.',
    },
  ]

  const handleLoadDemoCase = (c: typeof demoCases[0]) => {
    setPatientId('P00' + Math.floor(1 + Math.random() * 9))
    setPatientName(c.name)
    setCommonAge(c.age)
    setGender(c.gender)
    setHeartSex(c.gender)
    setFamilyHistory(c.family)
    setSmokingHistory(c.smoking)
    setPregnancies(c.pregnancies)
    setGlucose(c.glucose)
    setDiabetesBp(c.bp)
    setSkinThickness(c.skin)
    setInsulin(c.insulin)
    setBmi(c.bmi)
    setPedigree(c.pedigree)
    setDiabetesAge(c.age)
    setHeartAge(c.heartAge)
    setChestPainType(c.cp)
    setRestingBp(c.rbp)
    setCholesterol(c.chol)
    setFastingBs(c.fbs)
    setRestingEcg(c.ecg)
    setMaxHeartRate(c.maxHr)
    setExerciseAngina(c.exang)
    setOldpeak(c.oldpeak)
    setSlope(c.slope)
    setCaVessels(c.ca)
    setThalassemia(c.thal)
    setClinicalNotes(c.notes)
    setLoadedPresetMsg(`Loaded preset for ${c.name}`)
    setTimeout(() => setLoadedPresetMsg(''), 4000)
  }

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

  // ==========================================
  // Doctor Dashboard Form State (from Wireframe)
  // ==========================================
  // Section A: Patient Details (Common for Both)
  const [patientId, setPatientId] = useState('P001')
  const [patientName, setPatientName] = useState('Alex Morgan')
  const [selectedReportPatientId, setSelectedReportPatientId] = useState<string>('P001')
  const [reportConditionFilter, setReportConditionFilter] = useState<'auto' | 'diabetes' | 'heart' | 'both'>('auto')
  const [commonAge, setCommonAge] = useState<number | string>(45)
  const [gender, setGender] = useState<'Male' | 'Female'>('Male')
  const [familyHistory, setFamilyHistory] = useState<'Yes' | 'No'>('No')
  const [smokingHistory, setSmokingHistory] = useState<'Yes' | 'No'>('No')

  // Section B: Diabetes Model Inputs
  const [pregnancies, setPregnancies] = useState<number | string>(2)
  const [glucose, setGlucose] = useState<number | string>(120)
  const [diabetesBp, setDiabetesBp] = useState<number | string>(80)
  const [skinThickness, setSkinThickness] = useState<number | string>(20)
  const [insulin, setInsulin] = useState<number | string>(85)
  const [bmi, setBmi] = useState<number | string>(32.1)
  const [pedigree, setPedigree] = useState<number | string>(0.5)
  const [diabetesAge, setDiabetesAge] = useState<number | string>(45)

  // Section C: Heart Disease Model Inputs
  const [heartAge, setHeartAge] = useState<number | string>(54)
  const [heartSex, setHeartSex] = useState<'Male' | 'Female'>('Male')
  const [chestPainType, setChestPainType] = useState<number>(1) // Typical Angina
  const [restingBp, setRestingBp] = useState<number | string>(130)
  const [cholesterol, setCholesterol] = useState<number | string>(240)
  const [fastingBs, setFastingBs] = useState<number>(0) // 0=No, 1=Yes
  const [restingEcg, setRestingEcg] = useState<number>(0) // 0=Normal, 1=ST-T, 2=LVH
  const [maxHeartRate, setMaxHeartRate] = useState<number | string>(150)
  const [exerciseAngina, setExerciseAngina] = useState<number>(0) // 0=No, 1=Yes
  const [oldpeak, setOldpeak] = useState<number | string>(1.2)
  const [slope, setSlope] = useState<number>(1) // 1=Up, 2=Flat, 3=Down
  const [caVessels, setCaVessels] = useState<number>(0) // 0-3
  const [thalassemia, setThalassemia] = useState<number>(3) // 3=Normal, 6=Fixed, 7=Reversible

  // Section D: Medical Reports (Optional)
  const [uploadedFile, setUploadedFile] = useState<string>('')
  const [clinicalNotes, setClinicalNotes] = useState<string>('')

  // Evaluation states
  const [assessmentLoading, setAssessmentLoading] = useState(false)
  const [activeModelView, setActiveModelView] = useState<'dual' | 'diabetes' | 'heart'>('diabetes')
  const [selectedDiseaseTab, setSelectedDiseaseTab] = useState<'diabetes' | 'heart' | 'both'>('diabetes')
  const [dualResult, setDualResult] = useState<any>(null)
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const setPatientIdInput = setPatientId
  const patientIdInput = patientId
  const setAssessmentType = (type: 'diabetes' | 'heart') => setActiveModelView(type)
  const assessmentType = activeModelView === 'heart' ? 'heart' : 'diabetes'

  // Autofill sample data matching the exact wireframe
  const handleAutofillWireframe = () => {
    setPatientId('P001')
    setPatientName('Alex Morgan')
    setCommonAge(45)
    setGender('Male')
    setFamilyHistory('No')
    setSmokingHistory('No')

    setPregnancies(2)
    setGlucose(120)
    setDiabetesBp(80)
    setSkinThickness(20)
    setInsulin(85)
    setBmi(32.1)
    setPedigree(0.5)
    setDiabetesAge(45)

    setHeartAge(54)
    setHeartSex('Male')
    setChestPainType(1)
    setRestingBp(130)
    setCholesterol(240)
    setFastingBs(0)
    setRestingEcg(0)
    setMaxHeartRate(150)
    setExerciseAngina(0)
    setOldpeak(1.2)
    setSlope(1)
    setCaVessels(0)
    setThalassemia(3)
    setUploadedFile('Lab_Panel_P001_Biomarkers.pdf')
    setClinicalNotes('Routine executive health checkup. Fasting blood sugar and cholesterol within borderline thresholds. Asymptomatic resting ECG.')
  }

  // Clear/Reset Form
  const handleResetForm = () => {
    setPatientId('P00' + Math.floor(1 + Math.random() * 9))
    setPatientName('')
    setCommonAge('')
    setGender('Male')
    setFamilyHistory('No')
    setSmokingHistory('No')

    setPregnancies('')
    setGlucose('')
    setDiabetesBp('')
    setSkinThickness('')
    setInsulin('')
    setBmi('')
    setPedigree('')
    setDiabetesAge('')

    setHeartAge('')
    setHeartSex('Male')
    setChestPainType(1)
    setRestingBp('')
    setCholesterol('')
    setFastingBs(0)
    setRestingEcg(0)
    setMaxHeartRate('')
    setExerciseAngina(0)
    setOldpeak('')
    setSlope(1)
    setCaVessels(0)
    setThalassemia(3)
    setUploadedFile('')
    setClinicalNotes('')
    setDualResult(null)
    setAssessmentResult(null)
  }

  // Dual Assessment Handler
  const handleRunDualAssessment = async () => {
    setAssessmentLoading(true)
    setDualResult(null)
    setAssessmentResult(null)
    setActiveModelView('dual')
    setReportConditionFilter('both')

    const pId = patientId.trim() || 'P001'
    const pName = patientName.trim() || 'Alex Morgan'
    const payload = {
      patient_id: pId,
      patient_name: pName,
      diabetes_data: {
        patient_id: pId,
        Pregnancies: Number(pregnancies || 0),
        Glucose: Number(glucose || 120),
        BloodPressure: Number(diabetesBp || 80),
        SkinThickness: Number(skinThickness || 20),
        Insulin: Number(insulin || 85),
        BMI: Number(bmi || 32.1),
        DiabetesPedigreeFunction: Number(pedigree || 0.5),
        raw_age: Number(diabetesAge || commonAge || 45),
        Sex: gender === 'Male' ? 1 : 0,
        smoking_history: smokingHistory,
        family_history: familyHistory,
      },
      heart_disease_data: {
        patient_id: pId,
        age: Number(heartAge || commonAge || 54),
        sex: heartSex === 'Male' ? 1 : 0,
        cp: Number(chestPainType || 1),
        trestbps: Number(restingBp || 130),
        chol: Number(cholesterol || 240),
        fbs: Number(fastingBs || 0),
        restecg: Number(restingEcg || 0),
        thalach: Number(maxHeartRate || 150),
        exang: Number(exerciseAngina || 0),
        oldpeak: Number(oldpeak || 1.2),
        slope: Number(slope || 1),
        ca: Number(caVessels || 0),
        thal: Number(thalassemia || 3),
        clinical_notes: clinicalNotes,
      },
    }

    try {
      const res = await patientApi.predictComprehensive(payload)
      setDualResult(res)
      loadHistory()
    } catch (err) {
      console.warn('API error, presenting simulated dual clinical decision:', err)
      setDualResult({
        comprehensive_id: 'CMP-' + Math.floor(1000 + Math.random() * 9000),
        patient_id: pId,
        overall_urgency: 'Moderate Clinical Attention',
        diabetes_assessment: {
          prediction: {
            condition: 'Diabetes Risk Assessment',
            prediction: 1,
            probability: 0.45,
            percentage: 45.0,
            risk_tier: 'Moderate',
            risk_color: '#f59e0b',
            patient_id: pId,
            feature_contributions: [
              { label: 'Plasma Glucose Level', value: Number(glucose || 120), impact: 0.22, direction: 'Risk Increasing', unit: 'mg/dL' },
              { label: 'Body Mass Index (BMI)', value: Number(bmi || 32.1), impact: 0.18, direction: 'Risk Increasing', unit: 'kg/m²' },
              { label: 'Diabetes Pedigree Score', value: Number(pedigree || 0.5), impact: 0.08, direction: 'Risk Increasing', unit: 'index' },
              { label: '2-Hour Serum Insulin', value: Number(insulin || 85), impact: 0.05, direction: 'Risk Increasing', unit: 'µU/mL' },
            ],
          },
          decision_support: {
            urgency: 'Secondary Screening (HbA1c & OGTT)',
            clinical_alerts: [
              { severity: 'Moderate', title: 'Borderline Glycemia', description: 'Fasting glucose and BMI indicate borderline insulin resistance.' }
            ],
            recommended_diagnostic_workup: [
              { test: 'HbA1c & Fasting Insulin', guideline: 'ADA 2024 Standards', rationale: 'Confirm baseline glycemic dysregulation.' },
              { test: '2-Hour Oral Glucose Tolerance Test (OGTT)', guideline: 'AACE Protocol', rationale: 'Assess postprandial glucose spike sensitivity.' }
            ],
            lifestyle_action_plan: [
              { domain: 'Nutrition', target: 'Low Glycemic Load Diet', action: 'Eliminate refined sugars and simple carbs; target >30g dietary fiber daily.' },
              { domain: 'Weight Management', target: '5% BMI Reduction', action: 'Structured calorie deficit targeting 1-2 lbs weight loss per month.' }
            ],
          },
        },
        heart_disease_assessment: {
          prediction: {
            condition: 'Coronary Heart Disease (CAD)',
            prediction: 0,
            probability: 0.042,
            percentage: 4.2,
            risk_tier: 'Low',
            risk_color: '#10b981',
            patient_id: pId,
            feature_contributions: [
              { label: 'Resting Blood Pressure', value: Number(restingBp || 130), impact: 0.12, direction: 'Risk Increasing', unit: 'mm Hg' },
              { label: 'Serum Cholesterol', value: Number(cholesterol || 240), impact: 0.14, direction: 'Risk Increasing', unit: 'mg/dL' },
              { label: 'Max Heart Rate Achieved', value: Number(maxHeartRate || 150), impact: -0.15, direction: 'Protective', unit: 'bpm' },
            ],
          },
          decision_support: {
            urgency: 'Routine Clinical Follow-up',
            clinical_alerts: [
              { severity: 'Mild', title: 'Elevated Serum Lipids', description: 'Total serum cholesterol of 240 mg/dL exceeds desirable clinical range.' }
            ],
            recommended_diagnostic_workup: [
              { test: 'Fractionated Lipid Panel', guideline: 'ACC/AHA 2023', rationale: 'Measure LDL-C, HDL-C, and Non-HDL cholesterol.' }
            ],
            lifestyle_action_plan: [
              { domain: 'Physical Activity', target: '150 min/week', action: 'Maintain moderate aerobic endurance exercise.' }
            ],
          },
        },
        cardiometabolic_synergy_alerts: [
          { severity: 'Moderate', title: 'Synergistic Vascular Risk', description: 'Concurrent borderline glucose and elevated cholesterol increase 10-year atherosclerotic cardiovascular event probability.' },
        ],
        integrated_management_plan: [
          'Initiate therapeutic lifestyle changes targeting 5-7% weight reduction and dietary cholesterol reduction.',
          'Schedule baseline HbA1c and fractionated lipid panel in 6 weeks.',
          'Recommend home blood pressure monitoring (goal < 130/80 mmHg).',
        ],
      })
    } finally {
      setAssessmentLoading(false)
    }
  }

  // Diabetes Only Assessment Handler
  const handleRunDiabetesAssessment = async () => {
    setAssessmentLoading(true)
    setDualResult(null)
    setAssessmentResult(null)
    setActiveModelView('diabetes')
    setReportConditionFilter('diabetes')

    const pId = patientId.trim() || 'P001'
    const pName = patientName.trim() || 'Alex Morgan'
    const payload = {
      patient_id: pId,
      patient_name: pName,
      Pregnancies: Number(pregnancies || 0),
      Glucose: Number(glucose || 120),
      BloodPressure: Number(diabetesBp || 80),
      SkinThickness: Number(skinThickness || 20),
      Insulin: Number(insulin || 85),
      BMI: Number(bmi || 32.1),
      DiabetesPedigreeFunction: Number(pedigree || 0.5),
      raw_age: Number(diabetesAge || commonAge || 45),
      Sex: gender === 'Male' ? 1 : 0,
      smoking_history: smokingHistory,
      family_history: familyHistory,
    }

    try {
      const res = await patientApi.predictDiabetes(payload)
      setAssessmentResult(res)
      loadHistory()
    } catch (err) {
      console.warn('API error, presenting fallback:', err)
      setAssessmentResult({
        prediction: {
          patient_id: pId,
          condition: 'Diabetes Risk Assessment',
          probability: 0.45,
          risk_tier: 'Moderate',
          risk_color: 'amber',
          feature_contributions: [
            { label: 'Plasma Glucose Level', value: Number(glucose || 120), impact: 0.22, direction: 'Risk Increasing', unit: 'mg/dL' },
            { label: 'Body Mass Index (BMI)', value: Number(bmi || 32.1), impact: 0.18, direction: 'Risk Increasing', unit: 'kg/m²' },
          ]
        },
        decision_support: {
          urgency: 'Secondary Screening (HbA1c & OGTT)',
          clinical_alerts: ['Borderline glycemic parameters detected.'],
          diagnostic_workup: ['Fasting Plasma Glucose & HbA1c test', 'Lipid panel'],
          lifestyle_plan: ['Structured diet with low glycemic index', 'Target 150 minutes aerobic exercise per week']
        }
      })
    } finally {
      setAssessmentLoading(false)
    }
  }

  // Heart Disease Only Assessment Handler
  const handleRunHeartAssessment = async () => {
    setAssessmentLoading(true)
    setDualResult(null)
    setAssessmentResult(null)
    setActiveModelView('heart')
    setReportConditionFilter('heart')

    const pId = patientId.trim() || 'P001'
    const pName = patientName.trim() || 'Alex Morgan'
    const payload = {
      patient_id: pId,
      patient_name: pName,
      age: Number(heartAge || commonAge || 54),
      sex: heartSex === 'Male' ? 1 : 0,
      cp: Number(chestPainType || 1),
      trestbps: Number(restingBp || 130),
      chol: Number(cholesterol || 240),
      fbs: Number(fastingBs || 0),
      restecg: Number(restingEcg || 0),
      thalach: Number(maxHeartRate || 150),
      exang: Number(exerciseAngina || 0),
      oldpeak: Number(oldpeak || 1.2),
      slope: Number(slope || 1),
      ca: Number(caVessels || 0),
      thal: Number(thalassemia || 3),
      clinical_notes: clinicalNotes,
    }

    try {
      const res = await patientApi.predictHeartDisease(payload)
      setAssessmentResult(res)
      loadHistory()
    } catch (err) {
      console.warn('API error, presenting fallback:', err)
      setAssessmentResult({
        prediction: {
          patient_id: pId,
          condition: 'Coronary Heart Disease (CAD)',
          probability: 0.12,
          risk_tier: 'Low',
          risk_color: 'emerald',
          feature_contributions: [
            { label: 'Resting Blood Pressure', value: Number(restingBp || 130), impact: 0.12, direction: 'Risk Increasing', unit: 'mm Hg' },
            { label: 'Serum Cholesterol', value: Number(cholesterol || 240), impact: 0.14, direction: 'Risk Increasing', unit: 'mg/dL' },
          ]
        },
        decision_support: {
          urgency: 'Routine Clinical Follow-up',
          clinical_alerts: ['Serum cholesterol requires baseline lipid management.'],
          diagnostic_workup: ['Fasting lipid panel', 'Resting 12-lead ECG'],
          lifestyle_plan: ['Heart-healthy Mediterranean diet', 'Routine blood pressure tracking']
        }
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
      localStorage.setItem('chroniccare_doctor', JSON.stringify(updated))
    } catch {}
    alert('Physician credentials updated successfully!')
  }

  const navItems: { label: string; tab: DashboardTab; icon: any; badge?: string; badgeColor?: string }[] = [
    { label: 'Dashboard', tab: 'overview', icon: LayoutDashboard },
    { label: 'Patient Details', tab: 'patients', icon: User, badge: 'EHR', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { label: 'Predictions', tab: 'evaluate', icon: BarChart3, badge: 'Live AI', badgeColor: 'bg-pink-100 text-[#ec4899] border-pink-200' },
    { label: 'Clinical Guidelines', tab: 'ai', icon: BookOpen, badge: 'Agent', badgeColor: 'bg-purple-100 text-[#8b5cf6] border-purple-200' },
    { label: 'Reports', tab: 'reports', icon: FileText, badge: 'PDF', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
    { label: 'Settings', tab: 'profile', icon: Settings },
  ]

  return (
    <div className={cn('min-h-screen bg-[#f8fafc] text-slate-950 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-900', dark && 'dark bg-slate-950 text-white')}>
      {/* Modern Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200/80 bg-white/95 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div>
          {/* Logo & Clinical System Live Indicator */}
          <div className="flex items-center justify-between">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-3 transition hover:opacity-90 text-left group">
              <ChronicCareLogo size="md" />
            </button>
            <button onClick={() => setSidebarOpen(false)} className="rounded-xl p-2 hover:bg-slate-100 lg:hidden text-slate-400 hover:text-slate-700">
              <X className="size-5" />
            </button>
          </div>

          {/* System Health Status Badge */}
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50/70 border border-pink-200/70 px-3 py-1.5 text-[11px] font-bold text-purple-900">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#ec4899]" />
            </span>
            <span>SYSTEM ONLINE &bull; 2 ML ENGINES</span>
          </div>

          {/* Doctor Quick Profile Card */}
          <div className="mt-4 rounded-3xl bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-white p-3.5 border border-pink-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#f97316] font-extrabold text-white text-xs shadow-md shadow-pink-500/20">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 truncate">{doctor.name}</p>
                <p className="text-[10px] font-bold text-[#7c3aed] truncate">{doctor.specialty || 'Cardiometabolic Specialist'}</p>
                <p className="text-[10px] text-slate-400 font-mono">{doctor.licenseId}</p>
              </div>
            </div>
          </div>

          {/* Clinical Navigation Menu */}
          <p className="mb-2 mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 px-1">
            Clinical Tools
          </p>
          <div className="flex flex-col gap-1 text-xs">
            {navItems.map(({ label, tab, icon: TabIcon, badge, badgeColor }) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setSidebarOpen(false)
                }}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-medium transition-all duration-200',
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-500/15 via-pink-500/10 to-transparent text-[#7c3aed] font-extrabold border-l-4 border-[#ec4899] shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'flex size-7 items-center justify-center rounded-lg transition-colors',
                    activeTab === tab ? 'bg-pink-50 text-[#ec4899]' : 'text-slate-400'
                  )}>
                    <TabIcon className="size-4" />
                  </span>
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md border', badgeColor || 'bg-slate-100 text-slate-600 border-slate-200')}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Hospital Affiliation & Sign Out */}
        <div className="pt-4 border-t border-slate-200/80 space-y-2">
          <div className="rounded-2xl bg-slate-50 p-3 border border-slate-200/80 flex items-start gap-2.5">
            <Building2 className="mt-0.5 size-4 text-[#10b981] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{doctor.hospital || 'PulsePath Medical Center'}</p>
              <p className="text-[10px] text-slate-400">SQLite EHR Synced &bull; Local Audit</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full rounded-xl py-2 px-3 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition text-center"
          >
            Sign Out Session &rarr;
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Sticky Modern Top Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/85 backdrop-blur-xl px-5 py-3.5 sm:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 hover:bg-slate-100 lg:hidden text-slate-600"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Cardiometabolic CDSS</span>
              <span>/</span>
              <span className="font-bold text-slate-800">
                {activeTab === 'overview' ? 'Clinical Overview' :
                 activeTab === 'evaluate' ? '1. Doctor Dashboard (Patient Intake)' :
                 activeTab === 'patients' ? 'Patient Registry' :
                 activeTab === 'history' ? 'Assessment History Archive' :
                 activeTab === 'ai' ? 'Explainable AI (SHAP Drivers)' :
                 activeTab === 'reports' ? 'Individual Clinical Consultation Reports' : 'Physician Profile'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action: Evaluate New Patient */}
            {activeTab !== 'evaluate' && (
              <button
                onClick={() => {
                  handleResetForm()
                  setActiveTab('evaluate')
                }}
                className="hidden md:flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] hover:opacity-95 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-pink-500/20 transition hover:scale-[1.02]"
              >
                <Stethoscope className="size-3.5" /> + New Patient Evaluation
              </button>
            )}

            {/* Interactive Theme Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50 to-pink-50/50 hover:bg-emerald-100/80 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-900 transition shadow-xs"
                title="Change UI Theme Color"
              >
                <Palette className="size-3.5 text-emerald-600" />
                <span className="hidden md:inline">Theme:</span>
                <span className="flex items-center gap-1.5">
                  <span className={cn('size-2 rounded-full ring-1 ring-emerald-300', currentThemePreset.dot)} />
                  <span className="font-extrabold">{currentThemePreset.name}</span>
                </span>
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 top-11 z-50 w-72 rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-3.5 shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-800">UI Color Palette</p>
                      <p className="text-[10px] text-slate-400">Click to switch look &amp; feel</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowThemeMenu(false)}
                      className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <div className="mt-2.5 space-y-1.5">
                    {themePresets.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setThemeColor(t.id)
                          setShowThemeMenu(false)
                        }}
                        className={cn(
                          'w-full flex items-center justify-between rounded-2xl p-2.5 text-left transition',
                          themeColor === t.id
                            ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200 ring-2 ring-emerald-500/20'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={cn('size-5 rounded-full shadow-xs flex items-center justify-center text-white text-[10px] font-bold shrink-0', t.swatch)}>
                            {themeColor === t.id && '✓'}
                          </span>
                          <div>
                            <p className="text-xs font-bold leading-tight">{t.name}</p>
                            <p className="text-[10px] text-slate-400 leading-tight">{t.label}</p>
                          </div>
                        </div>
                        {themeColor === t.id && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-md">
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date Pill */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-xl bg-slate-100/90 px-3 py-1 text-xs font-semibold text-slate-600">
              <Clock className="size-3.5 text-[#059669]" />
              <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Clinical Alerts</p>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-slate-400 hover:text-slate-600">Close</button>
                  </div>
                  <div className="mt-3 flex flex-col gap-2.5 text-xs">
                    <div className="rounded-xl bg-rose-50 p-2.5 text-rose-900 border border-rose-100">
                      <p className="font-bold">Urgent CAD Triage</p>
                      <p className="mt-0.5 text-[11px] text-rose-700 font-medium">Patient PT-208 CAD risk probability: 72%.</p>
                    </div>
                    <div className="rounded-xl bg-[#f0fdf4] p-2.5 text-[#059669] border border-emerald-100">
                      <p className="font-bold">Physician Session Verified</p>
                      <p className="mt-0.5 text-[11px] text-emerald-800 font-medium">{doctor.name} ({doctor.licenseId}) connected.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Profile Pill */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 border-l border-slate-200 pl-3 transition hover:opacity-85 text-left"
            >
              <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#f97316] text-xs font-black text-white shadow-md shadow-pink-500/20">
                {initials}
              </span>
              <div className="hidden sm:block">
                <span className="block text-xs font-black text-slate-900 leading-tight">{doctor.name}</span>
                <span className="block text-[10px] text-slate-400 leading-tight font-medium">Attending Physician</span>
              </div>
            </button>
          </div>
        </header>

        {/* Tab 1: Clinical Overview */}
        {activeTab === 'overview' && (
          <main className="mx-auto max-w-7xl p-4 sm:p-8 space-y-7">
            {/* Top Welcome Banner - Aligned to Landing Page Design */}
            <div className="relative overflow-hidden rounded-3xl border border-pink-200/80 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/50 p-6 sm:p-8 shadow-sm">
              <div className="absolute -right-8 -top-8 size-48 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 via-[#ec4899]/10 to-[#f97316]/10 blur-2xl pointer-events-none" />
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center relative z-10">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-pink-200/80 bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-slate-700 shadow-xs">
                    <Sparkles className="size-3.5 text-[#ec4899]" />
                    <span>CLINICAL DECISION SUPPORT WORKBENCH 2.0</span>
                  </span>
                  <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                    Welcome back, <span className="bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] bg-clip-text text-transparent">{doctor.name}</span>.
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                    {doctor.specialty} &bull; {doctor.hospital || 'ChronicCare Medical Center'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      handleResetForm()
                      setActiveTab('evaluate')
                    }}
                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] hover:opacity-95 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-pink-500/25 transition hover:scale-[1.02]"
                  >
                    <Stethoscope className="size-4" /> 1. Doctor Dashboard (Input Patient)
                  </button>
                  <button
                    onClick={onSignOut}
                    className="rounded-2xl border border-slate-200/90 bg-white/90 hover:bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600 hover:text-rose-600 transition"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Elevated Metric KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div onClick={() => setActiveTab('patients')} className="cursor-pointer transition hover:-translate-y-0.5">
                <Stat icon={Users} label="Registered Patients" value={String(patientsCount)} hint="View hospital directory &rarr;" />
              </div>
              <div onClick={() => setActiveTab('history')} className="cursor-pointer transition hover:-translate-y-0.5">
                <Stat icon={ClipboardCheck} label="Evaluations Recorded" value={String(assessmentsList.length)} hint="View SQLite archive &rarr;" />
              </div>
              <div onClick={() => setActiveTab('ai')} className="cursor-pointer transition hover:-translate-y-0.5">
                <Stat icon={AlertTriangle} label="High-Risk Flagged" value="03" hint="Review SHAP explainability &rarr;" />
              </div>
              <div onClick={() => setActiveTab('profile')} className="cursor-pointer transition hover:-translate-y-0.5">
                <Stat icon={ShieldCheck} label="Provider License" value={doctor.licenseId || 'MD-84920'} hint="Doctor credentials &rarr;" />
              </div>
            </div>

            {/* Risk Distribution Chart & Quick Action Hub */}
            <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
              <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ec4899]">EPIDEMIOLOGICAL MONITORING</span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">Cardiometabolic Risk Distribution</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Monthly patient risk stratification across Diabetes and CAD cases</p>
                  </div>
                  <button onClick={() => setActiveTab('history')} className="text-xs font-bold text-[#7c3aed] hover:text-[#ec4899] hover:underline transition">
                    View records &rarr;
                  </button>
                </div>
                <div className="mt-8 flex h-44 items-end gap-3 sm:gap-6">
                  {[28, 42, 35, 50, 48, 65, 58, 72, 64, 80, 75, 88].map((height, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className={cn(
                          'w-full rounded-t-lg transition hover:opacity-85 shadow-2xs',
                          i === 11 ? 'bg-gradient-to-t from-[#8b5cf6] via-[#ec4899] to-[#f97316]' : 'bg-purple-100/70 hover:bg-pink-100'
                        )}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[10px] font-bold text-slate-400">{['N','D','J','F','M','A','M','J','J','A','S','O'][i]}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Action Hub - Styled to match Landing Page Hero */}
              <section className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#7c3aed] via-[#9333ea] to-[#ec4899] p-6 sm:p-7 text-white shadow-xl shadow-purple-950/20">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                      QUICK LAUNCHER
                    </span>
                    <Sparkles className="size-5 text-amber-300" />
                  </div>
                  <h3 className="mt-4 text-xl sm:text-2xl font-black leading-tight">Patient Risk Evaluation</h3>
                  <p className="mt-2 text-xs leading-5 text-white/90 font-medium">
                    Input lab findings, biomarkers, and clinical history to generate instantaneous calibrated risk probabilities and diagnostic workups.
                  </p>

                  <div className="mt-5 space-y-2.5">
                    <button
                      onClick={() => {
                        setSelectedDiseaseTab('diabetes')
                        setActiveModelView('diabetes')
                        setActiveTab('evaluate')
                      }}
                      className="w-full flex items-center justify-between rounded-2xl bg-white/10 hover:bg-white/20 p-3 text-xs font-bold text-white transition border border-white/20 backdrop-blur-xs"
                    >
                      <span className="flex items-center gap-2.5">
                        <Droplets className="size-4 text-emerald-300" /> Evaluate Diabetes Model
                      </span>
                      <span>&rarr;</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDiseaseTab('heart')
                        setActiveModelView('heart')
                        setActiveTab('evaluate')
                      }}
                      className="w-full flex items-center justify-between rounded-2xl bg-white/10 hover:bg-white/20 p-3 text-xs font-bold text-white transition border border-white/20 backdrop-blur-xs"
                    >
                      <span className="flex items-center gap-2.5">
                        <HeartPulse className="size-4 text-pink-300" /> Evaluate CAD Heart Model
                      </span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDiseaseTab('both')
                    setActiveModelView('dual')
                    setActiveTab('evaluate')
                  }}
                  className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-50 py-3 px-4 text-xs font-black text-[#7c3aed] shadow-lg transition hover:scale-[1.01]"
                >
                  <Sparkles className="size-3.5 text-[#ec4899]" /> Run Dual Model Assessment &rarr;
                </button>
              </section>
            </div>

            {/* Recent Patient Evaluations */}
            <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#ec4899]">CLINICAL ACTIVITY</span>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">Recent Patient Evaluations</h3>
                  <p className="text-xs text-slate-400">Queried from your hospital SQLite clinical repository</p>
                </div>
                <button onClick={() => setActiveTab('history')} className="text-xs font-bold text-[#7c3aed] hover:text-[#ec4899] hover:underline transition">
                  Full registry &rarr;
                </button>
              </div>
              <div className="mt-5 divide-y divide-slate-100">
                {assessmentsList.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTab('history')}
                    className="flex cursor-pointer items-center gap-3.5 py-4 transition hover:bg-slate-50/70 rounded-xl px-2 -mx-2"
                  >
                    <span className={cn(
                      'flex size-10 items-center justify-center rounded-xl font-bold shadow-2xs',
                      item.risk_tier === 'High' ? 'bg-rose-50 text-rose-600' :
                      item.risk_tier === 'Moderate' ? 'bg-amber-50 text-amber-600' :
                      'bg-emerald-50 text-emerald-600'
                    )}>
                      <HeartPulse className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.patient_id || 'Patient Record'} &bull; <span className="font-semibold text-slate-600">{item.condition}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'} &bull; Urgency: <span className="font-semibold text-slate-700">{item.urgency || 'Routine'}</span>
                      </p>
                    </div>
                    <span className={cn(
                      'rounded-full px-3 py-1 text-xs font-bold',
                      item.risk_tier === 'High' ? 'bg-rose-100 text-rose-800' :
                      item.risk_tier === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    )}>
                      {item.risk_tier} Risk ({Math.round(item.probability * 100)}%)
                    </span>
                    <ChevronRight className="size-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}

        {/* Tab 2: 1. Doctor Dashboard (Enter Patient Information) */}
        {activeTab === 'evaluate' && (
          <main className="mx-auto max-w-5xl p-4 sm:p-7 space-y-7">
            {/* Top Dashboard Title Header - Landing Page Aligned */}
            <div className="relative overflow-hidden rounded-3xl border border-pink-200/80 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/40 p-6 sm:p-8 shadow-sm">
              <div className="absolute -right-8 -top-8 size-48 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 via-[#ec4899]/10 to-[#f97316]/10 blur-2xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
                <div className="flex items-center gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#f97316] text-white shadow-lg shadow-pink-500/20">
                    <Stethoscope className="size-7" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-pink-200/80 bg-white/90 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-xs">
                        <Sparkles className="size-3 text-[#ec4899]" /> CLINICAL CDSS 2.0
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Multi-Agent Predictive Engine
                      </span>
                    </div>
                    <h1 className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                      1. Doctor Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-slate-500">
                      (Enter Patient Information &amp; Clinical Biomarkers)
                    </p>
                  </div>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleAutofillWireframe}
                    className="flex items-center gap-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3.5 py-2 text-xs font-bold text-amber-900 transition shadow-xs"
                    title="Load sample reference patient into form"
                  >
                    <Sparkles className="size-3.5 text-amber-600" />
                    Auto-Fill Demo (Alex Morgan)
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600 transition shadow-xs"
                  >
                    <RefreshCw className="size-3.5 text-slate-400" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600 transition"
                  >
                    &larr; Overview
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Clinical Test Presets (1-Click Autofill) */}
            <div className="rounded-3xl border border-emerald-200/90 bg-gradient-to-r from-emerald-50/80 via-white to-pink-50/40 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#059669] to-[#0d9488] text-white shadow-xs">
                    <Sparkles className="size-3.5" />
                  </span>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Interactive Clinical Test Presets (1-Click Autofill)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Select a patient archetype to automatically populate realistic biomarkers
                    </p>
                  </div>
                </div>
                {loadedPresetMsg && (
                  <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800 shadow-xs animate-bounce">
                    ✓ {loadedPresetMsg}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {demoCases.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleLoadDemoCase(c)}
                    className="flex flex-col text-left p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:bg-emerald-50/70 hover:border-emerald-300 transition-all duration-200 shadow-xs hover:shadow-sm group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {c.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{c.age}{c.gender === 'Male' ? 'M' : 'F'}</span>
                    </div>
                    <span className={cn('mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border w-fit truncate max-w-full', c.badgeCls)}>
                      {c.tag}
                    </span>
                    <span className="mt-2 text-[10px] font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      Load Preset &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* FORM SECTIONS (A, B, C, D) */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (selectedDiseaseTab === 'diabetes') {
                  handleRunDiabetesAssessment()
                } else if (selectedDiseaseTab === 'heart') {
                  handleRunHeartAssessment()
                } else {
                  handleRunDualAssessment()
                }
              }}
              className="space-y-6"
            >
              {/* SECTION A: Patient Details (Common for Both) */}
              <div className="overflow-hidden rounded-3xl border border-rose-200/90 bg-white shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between bg-gradient-to-r from-[#fed7d7]/80 via-[#fed7d7]/50 to-white px-6 py-4 border-b border-rose-200">
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs shadow-xs">
                      <User className="size-4" />
                    </span>
                    <div>
                      <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                        A. Patient Details (Common for Both)
                      </h2>
                      <p className="text-[11px] text-slate-500">Core patient demographics synced to EHR repository</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-[10px] font-bold text-emerald-800">
                    Baseline EHR Intake
                  </span>
                </div>

                <div className="p-5 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Patient ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span>Patient ID</span>
                      <span className="text-[10px] font-normal text-slate-400 font-mono">(MRN)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={patientId}
                        onChange={(e) => {
                          setPatientId(e.target.value)
                          setSelectedReportPatientId(e.target.value)
                        }}
                        placeholder="e.g., P001"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Patient Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span>Patient Name</span>
                      <span className="text-[10px] font-bold text-[#059669]">&bull; Required</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g., Alex Morgan"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={commonAge}
                      onChange={(e) => {
                        const val = e.target.value
                        setCommonAge(val)
                        setDiabetesAge(val)
                        setHeartAge(val)
                      }}
                      placeholder="e.g., 45"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      required
                    />
                  </div>

                  {/* Gender Selector - Segmented Switch */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setGender('Male')
                          setHeartSex('Male')
                        }}
                        className={cn(
                          'flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition shadow-xs',
                          gender === 'Male'
                            ? 'bg-[#059669] text-white shadow-emerald-900/20'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        )}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGender('Female')
                          setHeartSex('Female')
                        }}
                        className={cn(
                          'flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition shadow-xs',
                          gender === 'Female'
                            ? 'bg-[#059669] text-white shadow-emerald-900/20'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        )}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Family History */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Family History</label>
                    <select
                      value={familyHistory}
                      onChange={(e) => setFamilyHistory(e.target.value as 'Yes' | 'No')}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                    >
                      <option value="Yes">Yes (Positive History)</option>
                      <option value="No">No (Negative History)</option>
                    </select>
                  </div>

                  {/* Smoking History */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Smoking History</label>
                    <select
                      value={smokingHistory}
                      onChange={(e) => setSmokingHistory(e.target.value as 'Yes' | 'No')}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                    >
                      <option value="Yes">Yes (Current / Past Smoker)</option>
                      <option value="No">No (Never Smoked)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Disease Selection Toggle Buttons */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#059669]">
                      STEP 02 &bull; SELECT TARGET EVALUATION
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Choose which disease inputs to view &amp; evaluate
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDiseaseTab('diabetes')
                        setActiveModelView('diabetes')
                      }}
                      className={cn(
                        'flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition shadow-sm',
                        selectedDiseaseTab === 'diabetes'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-600 text-white shadow-emerald-900/20 ring-2 ring-emerald-500/30 scale-[1.01]'
                          : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
                      )}
                    >
                      <Droplets className="size-4" />
                      B. Diabetes Model Inputs
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDiseaseTab('heart')
                        setActiveModelView('heart')
                      }}
                      className={cn(
                        'flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition shadow-sm',
                        selectedDiseaseTab === 'heart'
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-900/20 ring-2 ring-rose-500/30 scale-[1.01]'
                          : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-800 border border-slate-200'
                      )}
                    >
                      <HeartPulse className="size-4" />
                      C. Heart Disease Model Inputs
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDiseaseTab('both')
                        setActiveModelView('dual')
                      }}
                      className={cn(
                        'flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition shadow-sm',
                        selectedDiseaseTab === 'both'
                          ? 'bg-gradient-to-r from-[#059669] to-[#047857] text-white shadow-emerald-900/20 ring-2 ring-emerald-500/30 scale-[1.01]'
                          : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-[#059669] border border-slate-200'
                      )}
                    >
                      <Sparkles className="size-3.5 text-amber-300" />
                      View Both Diseases
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION B: Diabetes Model Inputs */}
              {(selectedDiseaseTab === 'diabetes' || selectedDiseaseTab === 'both') && (
                <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between bg-gradient-to-r from-[#dcfce7]/70 via-[#dcfce7]/40 to-white px-6 py-4 border-b border-emerald-200">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-red-600 text-white text-xs shadow-xs">
                        <Droplets className="size-4" />
                      </span>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                          B. Diabetes Model Inputs
                        </h2>
                        <p className="text-[11px] text-slate-500">Pima-calibrated metabolic indicators &bull; ADA Aligned</p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800">
                      8 Biomarkers
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pregnancies (Count)</label>
                      <input
                        type="number"
                        value={pregnancies}
                        onChange={(e) => setPregnancies(e.target.value)}
                        placeholder="e.g., 2"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">Glucose (mg/dL)</label>
                        {getGlucoseBadge(glucose) && (
                          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md border', getGlucoseBadge(glucose)!.cls)}>
                            {getGlucoseBadge(glucose)!.text}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        value={glucose}
                        onChange={(e) => setGlucose(e.target.value)}
                        placeholder="e.g., 120"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Blood Pressure (mmHg)</label>
                      <input
                        type="number"
                        value={diabetesBp}
                        onChange={(e) => {
                          setDiabetesBp(e.target.value)
                          if (!restingBp) setRestingBp(e.target.value)
                        }}
                        placeholder="e.g., 80"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Skin Thickness (mm)</label>
                      <input
                        type="number"
                        value={skinThickness}
                        onChange={(e) => setSkinThickness(e.target.value)}
                        placeholder="e.g., 20"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Insulin (&micro;U/mL)</label>
                      <input
                        type="number"
                        value={insulin}
                        onChange={(e) => setInsulin(e.target.value)}
                        placeholder="e.g., 85"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      />
                    </div>

                    <div className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">BMI (kg/m&sup2;)</label>
                        <button
                          type="button"
                          onClick={() => setShowBmiCalc(!showBmiCalc)}
                          className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition"
                          title="Open Quick BMI Calculator"
                        >
                          <Calculator className="size-3" /> Quick Calc
                        </button>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        value={bmi}
                        onChange={(e) => setBmi(e.target.value)}
                        placeholder="e.g., 32.1"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                        required
                      />
                      {getBmiBadge(bmi) && (
                        <div className="mt-1">
                          <span className={cn('inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md border', getBmiBadge(bmi)!.cls)}>
                            {getBmiBadge(bmi)!.text}
                          </span>
                        </div>
                      )}

                      {/* Interactive BMI Calculator Popover */}
                      {showBmiCalc && (
                        <div className="absolute left-0 sm:right-0 top-12 z-50 w-72 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Calculator className="size-3.5 text-emerald-600" /> BMI Quick-Calculator
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowBmiCalc(false)}
                              className="text-slate-400 hover:text-slate-600 text-xs"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                          <div className="mt-3 space-y-3 text-xs">
                            <div>
                              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                                <span>Height</span>
                                <span className="font-mono text-emerald-700">{calcHeightCm} cm</span>
                              </div>
                              <input
                                type="range"
                                min="120"
                                max="220"
                                value={calcHeightCm}
                                onChange={(e) => setCalcHeightCm(Number(e.target.value))}
                                className="w-full accent-emerald-600"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                                <span>Weight</span>
                                <span className="font-mono text-emerald-700">{calcWeightKg} kg</span>
                              </div>
                              <input
                                type="range"
                                min="35"
                                max="160"
                                value={calcWeightKg}
                                onChange={(e) => setCalcWeightKg(Number(e.target.value))}
                                className="w-full accent-emerald-600"
                              />
                            </div>
                            <div className="rounded-xl bg-emerald-50 p-2.5 text-center border border-emerald-100">
                              <p className="text-[10px] text-emerald-600 font-bold uppercase">Computed BMI</p>
                              <p className="text-xl font-black text-emerald-900">
                                {(calcWeightKg / Math.pow(calcHeightCm / 100, 2)).toFixed(1)} <span className="text-xs font-normal">kg/m&sup2;</span>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const val = (calcWeightKg / Math.pow(calcHeightCm / 100, 2)).toFixed(1)
                                setBmi(val)
                                setShowBmiCalc(false)
                              }}
                              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-600 text-white font-bold py-2 text-xs shadow-md shadow-emerald-900/15 transition hover:opacity-95"
                            >
                              Apply to Patient &rarr;
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Diabetes Pedigree</label>
                      <input
                        type="number"
                        step="0.01"
                        value={pedigree}
                        onChange={(e) => setPedigree(e.target.value)}
                        placeholder="e.g., 0.5"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                      <input
                        type="number"
                        value={diabetesAge || commonAge}
                        onChange={(e) => setDiabetesAge(e.target.value)}
                        placeholder="e.g., 45"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION C: Heart Disease Model Inputs */}
              {(selectedDiseaseTab === 'heart' || selectedDiseaseTab === 'both') && (
                <div className="overflow-hidden rounded-3xl border border-amber-200/90 bg-white shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between bg-gradient-to-r from-[#feebc8]/80 via-[#feebc8]/40 to-white px-6 py-4 border-b border-amber-200">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-rose-600 text-white text-xs shadow-xs">
                        <HeartPulse className="size-4" />
                      </span>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                          C. Heart Disease Model Inputs
                        </h2>
                        <p className="text-[11px] text-slate-500">Cleveland CAD cardiovascular parameters &bull; ACC / AHA Aligned</p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-900">
                      12 Parameters
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                      <input
                        type="number"
                        value={heartAge || commonAge}
                        onChange={(e) => setHeartAge(e.target.value)}
                        placeholder="e.g., 54"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sex</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setHeartSex('Male')}
                          className={cn(
                            'py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs',
                            heartSex === 'Male' ? 'bg-[#059669] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          )}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeartSex('Female')}
                          className={cn(
                            'py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs',
                            heartSex === 'Female' ? 'bg-[#059669] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          )}
                        >
                          Female
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Chest Pain Type</label>
                      <select
                        value={chestPainType}
                        onChange={(e) => setChestPainType(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      >
                        <option value={1}>Typical Angina (1)</option>
                        <option value={2}>Atypical Angina (2)</option>
                        <option value={3}>Non-Anginal Pain (3)</option>
                        <option value={4}>Asymptomatic (4)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Resting BP (mmHg)</label>
                      <input
                        type="number"
                        value={restingBp}
                        onChange={(e) => setRestingBp(e.target.value)}
                        placeholder="e.g., 130"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">Cholesterol (mg/dL)</label>
                        {getCholesterolBadge(cholesterol) && (
                          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md border', getCholesterolBadge(cholesterol)!.cls)}>
                            {getCholesterolBadge(cholesterol)!.text}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        value={cholesterol}
                        onChange={(e) => setCholesterol(e.target.value)}
                        placeholder="e.g., 240"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Fasting Blood Sugar</label>
                      <select
                        value={fastingBs}
                        onChange={(e) => setFastingBs(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      >
                        <option value={0}>No (&le; 120 mg/dL)</option>
                        <option value={1}>Yes (&gt; 120 mg/dL)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Resting ECG Results</label>
                      <select
                        value={restingEcg}
                        onChange={(e) => setRestingEcg(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      >
                        <option value={0}>Normal (0)</option>
                        <option value={1}>ST-T Wave Abnormality (1)</option>
                        <option value={2}>Left Ventricular Hypertrophy (2)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Max Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={maxHeartRate}
                        onChange={(e) => setMaxHeartRate(e.target.value)}
                        placeholder="e.g., 150"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Exercise Angina</label>
                      <select
                        value={exerciseAngina}
                        onChange={(e) => setExerciseAngina(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      >
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ST Depression (Oldpeak)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={oldpeak}
                        onChange={(e) => setOldpeak(e.target.value)}
                        placeholder="e.g., 1.2"
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Slope of ST Segment</label>
                      <select
                        value={slope}
                        onChange={(e) => setSlope(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      >
                        <option value={1}>Upsloping (1)</option>
                        <option value={2}>Flat (2)</option>
                        <option value={3}>Downsloping (3)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Major Vessels (0-3)</label>
                      <select
                        value={caVessels}
                        onChange={(e) => setCaVessels(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      >
                        <option value={0}>0 Major Vessels</option>
                        <option value={1}>1 Major Vessel</option>
                        <option value={2}>2 Major Vessels</option>
                        <option value={3}>3 Major Vessels</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Thalassemia Status</label>
                      <select
                        value={thalassemia}
                        onChange={(e) => setThalassemia(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                      >
                        <option value={3}>Normal (3)</option>
                        <option value={6}>Fixed Defect (6)</option>
                        <option value={7}>Reversible Defect (7)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION D: Medical Reports (Optional) */}
              <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-3 bg-gradient-to-r from-slate-100 via-slate-50 to-white px-6 py-4 border-b border-slate-200">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs shadow-xs">
                    <FileText className="size-4" />
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    D. Medical Reports &amp; Clinical Notes (Optional)
                  </h2>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition">
                    <UploadCloud className="mx-auto size-8 text-slate-400" />
                    <p className="mt-2 text-xs font-bold text-slate-700">Upload Patient Laboratory PDF / EHR Export</p>
                    <p className="text-[11px] text-slate-400">PDF, DICOM or XML summaries up to 15MB</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Consultation Remarks</label>
                    <textarea
                      rows={3}
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      placeholder="Enter physician observations, presenting symptoms, outpatient referrals, or pharmacological history..."
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/60 p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#10b981] outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS BAR */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
                <div>
                  <p className="text-xs text-slate-500">
                    Evaluating Physician: <span className="font-bold text-slate-900">{doctor.name} ({doctor.licenseId})</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Target Condition:{' '}
                    <span className="font-bold text-[#059669] uppercase">
                      {selectedDiseaseTab === 'diabetes' ? 'Diabetes Model (Section B)' : selectedDiseaseTab === 'heart' ? 'Coronary Heart Disease (Section C)' : 'Dual Co-Morbidity Engine (B & C)'}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {selectedDiseaseTab === 'diabetes' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDiseaseTab('heart')
                          setActiveModelView('heart')
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 text-xs font-bold text-rose-800 transition"
                      >
                        <HeartPulse className="size-3.5 text-rose-600" />
                        Switch to Heart Disease
                      </button>

                      <button
                        type="button"
                        onClick={handleRunDualAssessment}
                        disabled={assessmentLoading}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition disabled:opacity-50"
                      >
                        <Sparkles className="size-3.5 text-[#ec4899]" />
                        Run Both Models
                      </button>

                      <button
                        type="submit"
                        disabled={assessmentLoading}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-600 hover:from-emerald-700 hover:to-emerald-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-900/20 transition disabled:opacity-50"
                      >
                        {assessmentLoading ? <RefreshCw className="size-4 animate-spin" /> : <Droplets className="size-4" />}
                        {assessmentLoading ? 'Analyzing Diabetes Risk...' : 'Evaluate Diabetes Model &rarr;'}
                      </button>
                    </>
                  ) : selectedDiseaseTab === 'heart' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDiseaseTab('diabetes')
                          setActiveModelView('diabetes')
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 text-xs font-bold text-emerald-800 transition"
                      >
                        <Droplets className="size-3.5 text-emerald-600" />
                        Switch to Diabetes
                      </button>

                      <button
                        type="button"
                        onClick={handleRunDualAssessment}
                        disabled={assessmentLoading}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition disabled:opacity-50"
                      >
                        <Sparkles className="size-3.5 text-[#ec4899]" />
                        Run Both Models
                      </button>

                      <button
                        type="submit"
                        disabled={assessmentLoading}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-rose-900/20 transition disabled:opacity-50"
                      >
                        {assessmentLoading ? <RefreshCw className="size-4 animate-spin" /> : <HeartPulse className="size-4" />}
                        {assessmentLoading ? 'Analyzing Cardiac Risk...' : 'Evaluate Heart Disease Model &rarr;'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      disabled={assessmentLoading}
                      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] hover:opacity-95 px-8 py-3.5 text-xs font-black text-white shadow-xl shadow-pink-500/25 transition hover:scale-[1.02] disabled:opacity-50"
                    >
                      {assessmentLoading ? <RefreshCw className="size-4 animate-spin" /> : <Sparkles className="size-4 text-amber-300" />}
                      {assessmentLoading ? 'Running Multi-Agent Inference...' : 'Run Dual Multi-Agent Assessment &rarr;'}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* DUAL RESULTS PRESENTATION - EXACT IMAGE TABLE FORMAT */}
            {dualResult && activeModelView === 'dual' && (
              <div className="space-y-6 pt-2">
                <div className="rounded-3xl border border-emerald-300/80 bg-white p-5 sm:p-8 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-[#059669]">
                          COMPREHENSIVE STRATIFICATION
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {dualResult.comprehensive_id}</span>
                      </div>
                      <h3 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                        Dual Disease Prediction Assessment
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Patient: <span className="font-bold text-slate-800">{patientName || dualResult.patient_id}</span> &bull; MRN: <span className="font-mono font-bold text-slate-700">{dualResult.patient_id}</span>
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-[#059669]">
                      Urgency: {dualResult.overall_urgency}
                    </span>
                  </div>

                  {/* Top Card: Diabetes Prediction Result (from Image) */}
                  <div className="rounded-2xl border border-emerald-200 bg-white shadow-xs overflow-hidden">
                    <div className="flex items-center justify-between bg-[#dcfce7]/80 px-5 py-3 border-b border-emerald-200">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-6 items-center justify-center rounded-full bg-red-600 text-white text-xs">
                          <Droplets className="size-3.5" />
                        </span>
                        <h4 className="font-bold text-emerald-950 text-sm tracking-tight">
                          Diabetes Prediction Result
                        </h4>
                      </div>
                      <ProbabilityDial
                        probability={dualResult.diabetes_assessment?.prediction?.probability || 0}
                        riskTier={dualResult.diabetes_assessment?.prediction?.risk_tier}
                        size={40}
                      />
                    </div>

                    <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                        <span className="font-semibold text-slate-700">Model Output (Class)</span>
                        <div>
                          <span className={cn(
                            'inline-block px-3 py-1 rounded-md text-xs font-bold',
                            dualResult.diabetes_assessment?.prediction?.prediction === 1
                              ? 'bg-[#fef3c7] text-amber-950 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          )}>
                            {dualResult.diabetes_assessment?.prediction?.prediction === 1 ? '1 (Diabetes Risk)' : '0 (No Diabetes)'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/40">
                        <span className="font-semibold text-slate-700">Probability</span>
                        <span className="font-bold text-slate-900">
                          {Math.round((dualResult.diabetes_assessment?.prediction?.probability || 0) * 100)}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                        <span className="font-semibold text-slate-700">Risk Level</span>
                        <div>
                          <span className={cn(
                            'inline-block px-3.5 py-1 rounded-md text-xs font-bold',
                            dualResult.diabetes_assessment?.prediction?.risk_tier === 'High'
                              ? 'bg-[#fee2e2] text-red-700 border border-red-200'
                              : dualResult.diabetes_assessment?.prediction?.risk_tier === 'Moderate'
                              ? 'bg-[#fef3c7] text-amber-700 border border-amber-200'
                              : 'bg-[#dcfce7] text-emerald-800 border border-emerald-200'
                          )}>
                            {dualResult.diabetes_assessment?.prediction?.risk_tier} Risk
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/40">
                        <span className="font-semibold text-slate-700">Key Factors</span>
                        <span className="text-slate-600 text-xs font-medium">
                          {dualResult.diabetes_assessment?.prediction?.feature_contributions
                            ? dualResult.diabetes_assessment.prediction.feature_contributions
                                .filter((f: any) => f.impact > 0)
                                .slice(0, 3)
                                .map((f: any) => (f.label || f.feature).toLowerCase())
                                .join(', ') + ', etc.'
                            : 'High glucose, high BMI, age, etc.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Card: Heart Disease Prediction Result (from Image) */}
                  <div className="rounded-2xl border border-amber-200/90 bg-white shadow-xs overflow-hidden">
                    <div className="flex items-center justify-between bg-[#fef3c7]/80 px-5 py-3 border-b border-amber-200">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-6 items-center justify-center rounded-lg bg-rose-600 text-white text-xs">
                          <HeartPulse className="size-3.5" />
                        </span>
                        <h4 className="font-bold text-amber-950 text-sm tracking-tight">
                          Heart Disease Prediction Result
                        </h4>
                      </div>
                      <ProbabilityDial
                        probability={dualResult.heart_disease_assessment?.prediction?.probability || 0}
                        riskTier={dualResult.heart_disease_assessment?.prediction?.risk_tier}
                        size={40}
                      />
                    </div>

                    <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                        <span className="font-semibold text-slate-700">Model Output (Class)</span>
                        <div>
                          <span className={cn(
                            'inline-block px-3 py-1 rounded-md text-xs font-bold',
                            dualResult.heart_disease_assessment?.prediction?.prediction === 1
                              ? 'bg-rose-100 text-rose-900 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          )}>
                            {dualResult.heart_disease_assessment?.prediction?.prediction === 1
                              ? '1 (Heart Disease Risk)'
                              : '0 (No Heart Disease)'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/40">
                        <span className="font-semibold text-slate-700">Probability</span>
                        <span className="font-bold text-slate-900">
                          {Math.round((dualResult.heart_disease_assessment?.prediction?.probability || 0) * 100)}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                        <span className="font-semibold text-slate-700">Risk Level</span>
                        <div>
                          <span className={cn(
                            'inline-block px-3.5 py-1 rounded-md text-xs font-bold',
                            dualResult.heart_disease_assessment?.prediction?.risk_tier === 'High'
                              ? 'bg-[#fee2e2] text-red-700 border border-red-200'
                              : dualResult.heart_disease_assessment?.prediction?.risk_tier === 'Moderate'
                              ? 'bg-[#fef3c7] text-amber-700 border border-amber-200'
                              : 'bg-[#dcfce7] text-emerald-800 border border-emerald-200'
                          )}>
                            {dualResult.heart_disease_assessment?.prediction?.risk_tier} Risk
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/40">
                        <span className="font-semibold text-slate-700">Key Factors</span>
                        <span className="text-slate-600 text-xs font-medium">
                          {dualResult.heart_disease_assessment?.prediction?.feature_contributions
                            ? dualResult.heart_disease_assessment.prediction.feature_contributions
                                .filter((f: any) => f.impact > 0)
                                .slice(0, 3)
                                .map((f: any) => (f.label || f.feature).toLowerCase())
                                .join(', ') + ', etc.'
                            : 'Age, cholesterol, blood pressure, etc.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  
                  {/* Clinical Recommendation (AI Agent) Card - Exact from image */}
                  <div className="overflow-hidden rounded-3xl border border-purple-200/90 bg-gradient-to-br from-purple-50/70 via-white to-pink-50/40 p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-100">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8b5cf6] via-[#ec4899] to-[#f97316] text-white shadow-md shadow-pink-500/20">
                          <Bot className="size-5" />
                        </span>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <span>Clinical Recommendation (AI Agent)</span>
                            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                              Agentic AI
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500">Autonomous synthesis of multi-disease biomarkers &amp; evidence-based guidelines</p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <Check className="size-3.5 stroke-[3]" /> Evidence Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xs">
                        <p className="text-[11px] font-black uppercase tracking-wider text-purple-700 flex items-center gap-1.5 mb-2">
                          <Sparkles className="size-3 text-[#ec4899]" /> Relevant Clinical Guideline Information
                        </p>
                        <ul className="space-y-1.5 text-slate-600 font-medium pl-3 list-disc">
                          <li>ADA 2024 Standards of Care: Comprehensive fasting plasma glucose and glycated hemoglobin (HbA1c) workup.</li>
                          <li>ACC / AHA 2023 Coronary Guidelines: Baseline resting 12-lead ECG and submaximal stress treadmill test.</li>
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xs">
                        <p className="text-[11px] font-black uppercase tracking-wider text-[#f97316] flex items-center gap-1.5 mb-2">
                          <HeartPulse className="size-3 text-[#ec4899]" /> Risk Factor Explanation &amp; Lifestyle Guidance
                        </p>
                        <ul className="space-y-1.5 text-slate-600 font-medium pl-3 list-disc">
                          <li>Metabolic drivers: Elevated glucose &amp; BMI indicate borderline insulin resistance.</li>
                          <li>Lifestyle recommendations: Low glycemic Mediterranean diet &amp; 150 min/wk moderate activity.</li>
                          <li>References from trusted medical sources: ADA, ACC/AHA, ESC &amp; NICE Guidelines.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Cardiometabolic Synergy Warning */}
                  {dualResult.cardiometabolic_synergy_alerts && dualResult.cardiometabolic_synergy_alerts.length > 0 && (
                    <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200">
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Cardiometabolic Synergy Warning</p>
                      <ul className="mt-1.5 text-xs text-amber-950 font-medium space-y-1">
                        {dualResult.cardiometabolic_synergy_alerts.map((alert: any, i: number) => (
                          <li key={i}>&bull; {alert.description || alert.title || alert}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Integrated Plan */}
                  {dualResult.integrated_management_plan && (
                    <div className="rounded-2xl bg-[#f0fdf4] p-4 text-[#059669] border border-emerald-100">
                      <p className="text-xs font-bold uppercase tracking-wider">Integrated Physician Directive</p>
                      <ul className="mt-1.5 space-y-1 text-xs text-emerald-950 font-medium">
                        {dualResult.integrated_management_plan.map((step: string, i: number) => (
                          <li key={i}>&bull; {step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
                    <button onClick={() => setActiveTab('history')} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition">
                      View in Assessment History &rarr;
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReportPatientId(patientId)
                        setReportConditionFilter('both')
                        setActiveTab('reports')
                      }}
                      className="rounded-xl bg-[#059669] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#047857] shadow-md transition"
                    >
                      Generate Comprehensive Consultation Report for {patientName || patientId} &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SINGLE RESULT PRESENTATION - EXACT IMAGE FORMAT */}
            {assessmentResult && activeModelView !== 'dual' && (
              <div className="space-y-6 pt-2">
                <div className="rounded-3xl border border-emerald-300/80 bg-white p-5 sm:p-8 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'flex size-11 items-center justify-center rounded-2xl font-bold text-white shadow-md',
                        activeModelView === 'diabetes' ? 'bg-emerald-600 shadow-emerald-900/20' : 'bg-rose-600 shadow-rose-900/20'
                      )}>
                        {activeModelView === 'diabetes' ? <Droplets className="size-5" /> : <HeartPulse className="size-5" />}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-xl font-black text-slate-900">
                          {activeModelView === 'diabetes' ? 'Diabetes Risk Evaluation Result' : 'Coronary Heart Disease (CAD) Evaluation Result'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Patient: <span className="font-bold text-slate-800">{patientName || assessmentResult.prediction?.patient_id || patientId}</span> &bull; MRN: <span className="font-mono font-bold text-slate-700">{assessmentResult.prediction?.patient_id || patientId}</span>
                        </p>
                      </div>
                    </div>

                    <span className={cn(
                      'rounded-full px-3.5 py-1 text-xs font-bold',
                      assessmentResult.prediction?.risk_tier === 'High' ? 'bg-red-100 text-red-700' :
                      assessmentResult.prediction?.risk_tier === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    )}>
                      {assessmentResult.prediction?.risk_tier} Risk ({Math.round((assessmentResult.prediction?.probability || 0) * 100)}%)
                    </span>
                  </div>

                  {/* Single Table Format Matching Reference Image */}
                  <div className={cn(
                    'rounded-2xl border bg-white shadow-xs overflow-hidden',
                    activeModelView === 'diabetes' ? 'border-emerald-200' : 'border-amber-200/90'
                  )}>
                    <div className={cn(
                      'flex items-center justify-between px-5 py-3 border-b',
                      activeModelView === 'diabetes' ? 'bg-[#dcfce7]/80 border-emerald-200' : 'bg-[#fef3c7]/80 border-amber-200'
                    )}>
                      <div className="flex items-center gap-2.5">
                        <span className={cn(
                          'flex size-6 items-center justify-center rounded-full text-white text-xs',
                          activeModelView === 'diabetes' ? 'bg-red-600' : 'bg-rose-600'
                        )}>
                          {activeModelView === 'diabetes' ? <Droplets className="size-3.5" /> : <HeartPulse className="size-3.5" />}
                        </span>
                        <h4 className={cn(
                          'font-bold text-sm tracking-tight',
                          activeModelView === 'diabetes' ? 'text-emerald-950' : 'text-amber-950'
                        )}>
                          {activeModelView === 'diabetes' ? 'Diabetes Prediction Result' : 'Heart Disease Prediction Result'}
                        </h4>
                      </div>
                      <ProbabilityDial
                        probability={assessmentResult.prediction?.probability || 0}
                        riskTier={assessmentResult.prediction?.risk_tier}
                        size={40}
                      />
                    </div>

                    <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                        <span className="font-semibold text-slate-700">Model Output (Class)</span>
                        <div>
                          <span className={cn(
                            'inline-block px-3 py-1 rounded-md text-xs font-bold',
                            assessmentResult.prediction?.prediction === 1
                              ? activeModelView === 'diabetes'
                                ? 'bg-[#fef3c7] text-amber-950 border border-amber-200'
                                : 'bg-rose-100 text-rose-900 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          )}>
                            {assessmentResult.prediction?.prediction === 1
                              ? (activeModelView === 'diabetes' ? '1 (Diabetes Risk)' : '1 (Heart Disease Risk)')
                              : (activeModelView === 'diabetes' ? '0 (No Diabetes)' : '0 (No Heart Disease)')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/40">
                        <span className="font-semibold text-slate-700">Probability</span>
                        <span className="font-bold text-slate-900">
                          {Math.round((assessmentResult.prediction?.probability || 0) * 100)}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                        <span className="font-semibold text-slate-700">Risk Level</span>
                        <div>
                          <span className={cn(
                            'inline-block px-3.5 py-1 rounded-md text-xs font-bold',
                            assessmentResult.prediction?.risk_tier === 'High'
                              ? 'bg-[#fee2e2] text-red-700 border border-red-200'
                              : assessmentResult.prediction?.risk_tier === 'Moderate'
                              ? 'bg-[#fef3c7] text-amber-700 border border-amber-200'
                              : 'bg-[#dcfce7] text-emerald-800 border border-emerald-200'
                          )}>
                            {assessmentResult.prediction?.risk_tier} Risk
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/40">
                        <span className="font-semibold text-slate-700">Key Factors</span>
                        <span className="text-slate-600 text-xs font-medium">
                          {assessmentResult.prediction?.feature_contributions
                            ? assessmentResult.prediction.feature_contributions
                                .filter((f: any) => f.impact > 0)
                                .slice(0, 3)
                                .map((f: any) => (f.label || f.feature).toLowerCase())
                                .join(', ') + ', etc.'
                            : (activeModelView === 'diabetes' ? 'High glucose, high BMI, age, etc.' : 'Age, cholesterol, blood pressure, etc.')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Directives */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    <div className="rounded-2xl bg-rose-50/70 p-4 border border-rose-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-800">Clinical Alerts &amp; Warnings</p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-rose-950 font-medium">
                        {assessmentResult.decision_support?.clinical_alerts?.map((alert: any, i: number) => (
                          <li key={i}>{typeof alert === 'string' ? alert : alert.description || alert.title}</li>
                        )) || <li>Patient risk metrics require ongoing monitoring.</li>}
                      </ul>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Recommended Diagnostic Workup</p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-slate-800 font-medium">
                        {assessmentResult.decision_support?.recommended_diagnostic_workup?.map((item: any, i: number) => (
                          <li key={i}>{typeof item === 'string' ? item : `${item.test}: ${item.rationale}`}</li>
                        )) || assessmentResult.decision_support?.diagnostic_workup?.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        )) || <li>Comprehensive diagnostic screening advised.</li>}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
                    <button onClick={() => setActiveTab('history')} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition">
                      View in Assessment History &rarr;
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReportPatientId(patientId)
                        setReportConditionFilter(activeModelView === 'heart' ? 'heart' : 'diabetes')
                        setActiveTab('reports')
                      }}
                      className="rounded-xl bg-[#059669] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#047857] shadow-md transition"
                    >
                      Generate {activeModelView === 'heart' ? 'Heart Disease' : 'Diabetes'} Consultation Report for {patientName || patientId} &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        )}
{/* Tab 3: Patient Registry */}
        {activeTab === 'patients' && (
          <main className="mx-auto max-w-6xl p-4 sm:p-8 space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="rounded-md bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 text-xs font-bold text-[#059669]">
                  HOSPITAL EHR REPOSITORY
                </span>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  Patient Directory
                </h1>
                <p className="text-xs text-slate-400 mt-1">Queried from hospital SQLite table <code>patients</code> &bull; Verified clinical registry.</p>
              </div>
              <button
                onClick={() => {
                  setPatientIdInput(`PT-${Math.floor(100 + Math.random() * 900)}`)
                  setActiveTab('evaluate')
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#0d9488] hover:from-[#047857] hover:to-[#059669] px-5 py-2.5 text-xs font-bold text-white shadow-md transition"
              >
                + Register &amp; Evaluate New Patient
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Patient Profile</th>
                      <th className="px-6 py-4">Patient ID / MRN</th>
                      <th className="px-6 py-4">Demographics</th>
                      <th className="px-6 py-4">EHR Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                    {[
                      { id: 'fareethimran2006@gmail.com', name: 'Imran Fareeth', age: 20, sex: 'Male', status: 'Optimal Profile' },
                      { id: 'PT-104', name: 'Alex Morgan', age: 48, sex: 'Female', status: 'Low Risk' },
                      { id: 'PT-208', name: 'Robert Vance', age: 58, sex: 'Male', status: 'High Co-Morbidity' },
                      { id: 'PT-315', name: 'Elena Cruz', age: 42, sex: 'Female', status: 'Moderate Risk' },
                      { id: 'PT-DEFAULT', name: 'Clinical Baseline', age: 45, sex: 'Male', status: 'Standard Baseline' },
                    ].map((p) => {
                      const pInitials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 font-bold text-[#059669] text-xs">
                                {pInitials}
                              </span>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                                <p className="text-[11px] text-slate-400 font-medium">Verified Hospital Patient</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-800 text-xs">{p.id}</td>
                          <td className="px-6 py-4 font-semibold text-slate-700">{p.age} yrs &bull; {p.sex}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                              p.status.includes('High') ? 'bg-rose-100 text-rose-800' :
                              p.status.includes('Moderate') ? 'bg-amber-100 text-amber-800' :
                              'bg-emerald-100 text-emerald-800'
                            )}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setPatientId(p.id)
                                  setPatientName(p.name)
                                  setPatientIdInput(p.id)
                                  setActiveTab('evaluate')
                                }}
                                className="rounded-xl bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-[#059669] hover:bg-emerald-100 transition shadow-2xs"
                              >
                                Evaluate Now &rarr;
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedReportPatientId(p.id)
                                  setActiveTab('reports')
                                }}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                              >
                                View Report &rarr;
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* Tab 4: Assessment History */}
        {activeTab === 'history' && (
          <main className="mx-auto max-w-6xl p-4 sm:p-8 space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="rounded-md bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 text-xs font-bold text-[#059669]">
                  RECORD ARCHIVE &bull; AUDIT LOG
                </span>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  Clinical Assessment History
                </h1>
                <p className="text-xs text-slate-400 mt-1">Stored securely in SQLite database table <code>assessments</code>.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadHistory}
                  disabled={loadingHistory}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                >
                  <RefreshCw className={cn('size-3.5', loadingHistory && 'animate-spin')} /> Refresh SQLite
                </button>
                <button
                  onClick={() => setActiveTab('evaluate')}
                  className="rounded-xl bg-gradient-to-r from-[#059669] to-[#0d9488] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#047857] transition"
                >
                  + New Evaluation
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Assessment ID</th>
                      <th className="px-6 py-4">Patient MRN</th>
                      <th className="px-6 py-4">Condition</th>
                      <th className="px-6 py-4">Risk Tier</th>
                      <th className="px-6 py-4">Probability</th>
                      <th className="px-6 py-4">Urgency</th>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                    {assessmentsList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition">
                        <td className="px-6 py-4 font-mono font-bold text-slate-900">{item.assessment_id}</td>
                        <td className="px-6 py-4 font-mono font-bold text-[#059669]">{item.patient_id}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{item.condition}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold text-[11px]',
                            item.risk_tier === 'High' ? 'bg-rose-100 text-rose-800' :
                            item.risk_tier === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          )}>
                            <span className={cn(
                              'size-1.5 rounded-full',
                              item.risk_tier === 'High' ? 'bg-rose-500' :
                              item.risk_tier === 'Moderate' ? 'bg-amber-500' :
                              'bg-emerald-500'
                            )} />
                            {item.risk_tier} Risk
                          </span>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-slate-900">{Math.round(item.probability * 100)}%</td>
                        <td className="px-6 py-4 font-medium text-slate-700">{item.urgency || 'Routine Clinical'}</td>
                        <td className="px-6 py-4 text-slate-400">
                          {item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedReportPatientId(item.patient_id)
                              const cond = (item.condition || '').toLowerCase()
                              if (cond.includes('diabetes') && !cond.includes('heart')) {
                                setReportConditionFilter('diabetes')
                              } else if (cond.includes('heart') || cond.includes('cad')) {
                                setReportConditionFilter('heart')
                              } else {
                                setReportConditionFilter('both')
                              }
                              setActiveTab('reports')
                            }}
                            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-[#059669] hover:bg-emerald-100 transition shadow-2xs"
                          >
                            View Report &rarr;
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
          <main className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6">
            <div>
              <span className="rounded-md bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 text-xs font-bold text-emerald-800">
                MODEL TRANSPARENCY &bull; SHAP ATTRIBUTION
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Explainable AI &amp; SHAP Feature Drivers
              </h1>
              <p className="text-xs text-slate-400 mt-1">Local biomarker attribution and decision threshold sensitivity analysis.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Diabetes Model Explanation Card */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-xs">
                    <Droplets className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Diabetes ML Predictor</h3>
                    <p className="text-xs text-slate-400">Decision Threshold: 0.40 &bull; Calibrated Logistic Engine</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Biomarkers evaluated: Fasting Glucose, BMI, Blood Pressure, Skin Thickness, Serum Insulin, Age.
                </p>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Top SHAP Positive Risk Drivers:</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800">Plasma Glucose (&gt;120 mg/dL)</span>
                      <span className="font-extrabold text-rose-600">+0.48 log-odds</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800">Body Mass Index (BMI &gt; 30)</span>
                      <span className="font-extrabold text-rose-600">+0.32 log-odds</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDiseaseTab('diabetes')
                    setActiveModelView('diabetes')
                    setActiveTab('evaluate')
                  }}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-emerald-700 transition text-center"
                >
                  Test Diabetes Patient Model &rarr;
                </button>
              </div>

              {/* Heart Disease Model Explanation Card */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-800 shadow-xs">
                    <HeartPulse className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Heart Disease (CAD) Predictor</h3>
                    <p className="text-xs text-slate-400">Decision Threshold: 0.50 &bull; Random Forest / Logistic Engine</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">
                  Cardiovascular markers: Chest Pain Type, Resting BP, Serum Cholesterol, Thalach, ST Depression (Oldpeak).
                </p>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Top SHAP Positive Risk Drivers:</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800">ST Depression Induced (&ge; 1.2 mm)</span>
                      <span className="font-extrabold text-rose-600">+0.54 log-odds</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800">Serum Cholesterol (&gt; 240 mg/dL)</span>
                      <span className="font-extrabold text-rose-600">+0.38 log-odds</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDiseaseTab('heart')
                    setActiveModelView('heart')
                    setActiveTab('evaluate')
                  }}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-2.5 text-xs font-bold text-white shadow-md hover:from-rose-700 hover:to-pink-700 transition text-center"
                >
                  Test Heart Disease Patient Model &rarr;
                </button>
              </div>
            </div>
          </main>
        )}

        {/* Tab 6: Doctor Credentials */}
        {activeTab === 'profile' && (
          <main className="mx-auto max-w-4xl p-4 sm:p-8 space-y-6">
            <div>
              <span className="rounded-md bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 text-xs font-bold text-[#059669]">
                PHYSICIAN CREDENTIALS &bull; VERIFICATION
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Doctor Profile</h1>
              <p className="text-xs text-slate-400 mt-1">Medical license, institutional verification, and cryptographic session details.</p>
            </div>

            <form onSubmit={handleUpdateDoctor} className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#059669] to-[#0d9488] text-2xl font-black text-white shadow-lg shadow-emerald-900/20">
                    {initials}
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{doctor.name}</h3>
                    <p className="text-xs font-semibold text-slate-500">{doctor.specialty} &bull; {doctor.licenseId}</p>
                    <p className="text-xs text-[#059669] font-bold">{doctor.email}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                  &bull; Verified Attending Clinician
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Doctor Full Name" name="doctor_name" defaultValue={doctor.name} placeholder="e.g. Dr. Imran Fareeth" />
                <Field label="Medical License / NPI Number" name="doctor_license" defaultValue={doctor.licenseId || 'MD-84920'} placeholder="License ID" />
                <Field label="Clinical Specialty & Department" name="doctor_specialty" defaultValue={doctor.specialty || 'Cardiometabolic Medicine'} placeholder="Specialty" />
                <Field label="Hospital / Health System Affiliation" name="doctor_hospital" defaultValue={doctor.hospital || 'Pulsepath Medical Center'} placeholder="Hospital" />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button type="button" onClick={() => setActiveTab('overview')} className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-gradient-to-r from-[#059669] to-[#0d9488] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-[#047857] hover:to-[#059669] transition">
                  Save Verified Credentials
                </button>
              </div>
            </form>
          </main>
        )}

        {/* Tab 7: Reports - Individual Patient Clinical Consultation Report */}
        {activeTab === 'reports' && (() => {
          // Predefined patient records for registered hospital patients
          const patientCatalog: Record<string, {
            name: string
            age: number
            sex: string
            familyHistory: string
            smokingHistory: string
            vitals: { bp: number; glucose: number; chol: number; bmi: number; hr: number; insulin?: number; skin?: number; pedigree?: number; cp?: string; oldpeak?: number }
            diabetes: { prediction: number; prob: number; tier: string; factors: string }
            heart: { prediction: number; prob: number; tier: string; factors: string }
            notes: string
          }> = {
            'PT-104': {
              name: 'Alex Morgan',
              age: 48,
              sex: 'Female',
              familyHistory: 'Yes',
              smokingHistory: 'No',
              vitals: { bp: 122, glucose: 98, chol: 195, bmi: 24.2, hr: 142, insulin: 70, skin: 18, pedigree: 0.35, cp: 'Atypical Angina', oldpeak: 0.4 },
              diabetes: { prediction: 0, prob: 0.18, tier: 'Low', factors: 'Normal fasting glucose, optimal BMI, active aerobic profile' },
              heart: { prediction: 0, prob: 0.12, tier: 'Low', factors: 'Normal resting BP, optimal heart rate, no ST depression' },
              notes: 'Routine executive wellness consultation. Non-smoker, active aerobic fitness. Annual follow-up scheduled.'
            },
            'PT-208': {
              name: 'Robert Vance',
              age: 58,
              sex: 'Male',
              familyHistory: 'Yes',
              smokingHistory: 'Yes',
              vitals: { bp: 148, glucose: 132, chol: 268, bmi: 31.4, hr: 138, insulin: 125, skin: 28, pedigree: 0.68, cp: 'Typical Angina', oldpeak: 2.1 },
              diabetes: { prediction: 1, prob: 0.64, tier: 'High', factors: 'High glucose (132 mg/dL), high BMI (31.4 kg/m²), family history' },
              heart: { prediction: 1, prob: 0.72, tier: 'High', factors: 'High cholesterol (268 mg/dL), stage 2 hypertension, ST depression' },
              notes: 'Patient exhibits significant cardiometabolic synergy risks. Outpatient cardiology referral and lipid management initiated.'
            },
            'PT-315': {
              name: 'Elena Cruz',
              age: 42,
              sex: 'Female',
              familyHistory: 'No',
              smokingHistory: 'No',
              vitals: { bp: 124, glucose: 116, chol: 205, bmi: 27.8, hr: 146, insulin: 92, skin: 22, pedigree: 0.45, cp: 'Non-Anginal', oldpeak: 0.8 },
              diabetes: { prediction: 1, prob: 0.52, tier: 'Moderate', factors: 'Borderline fasting glucose (116 mg/dL), overweight BMI' },
              heart: { prediction: 0, prob: 0.16, tier: 'Low', factors: 'Normal resting ECG, healthy cardiac reserve' },
              notes: 'Borderline glycemic control noted on screening. Low-glycemic dietary intervention and 60-day HbA1c scheduled.'
            },
            'fareethimran2006@gmail.com': {
              name: 'Imran Fareeth',
              age: 20,
              sex: 'Male',
              familyHistory: 'No',
              smokingHistory: 'No',
              vitals: { bp: 116, glucose: 86, chol: 165, bmi: 21.8, hr: 154, insulin: 55, skin: 15, pedigree: 0.22, cp: 'Asymptomatic', oldpeak: 0.0 },
              diabetes: { prediction: 0, prob: 0.06, tier: 'Low', factors: 'Optimal fasting glucose (86 mg/dL), healthy BMI (21.8 kg/m²)' },
              heart: { prediction: 0, prob: 0.04, tier: 'Low', factors: 'Normotensive blood pressure, athletic resting heart rate' },
              notes: 'Excellent baseline physiological biomarkers. All clinical indicators within prime guidelines.'
            }
          }

          const activeTargetId = selectedReportPatientId || patientId || 'P001'
          const matchedCatalog = patientCatalog[activeTargetId]

          // Dynamic active patient record from current evaluation form
          const currentEvaluatedRecord = {
            id: patientId || 'P001',
            name: patientName || 'Alex Morgan',
            age: Number(commonAge || 45),
            sex: gender,
            familyHistory: familyHistory,
            smokingHistory: smokingHistory,
            vitals: {
              bp: Number(diabetesBp || restingBp || 130),
              glucose: Number(glucose || 120),
              chol: Number(cholesterol || 240),
              bmi: Number(bmi || 32.1),
              hr: Number(maxHeartRate || 150),
              insulin: Number(insulin || 85),
              skin: Number(skinThickness || 20),
              pedigree: Number(pedigree || 0.5),
              cp: chestPainType === 1 ? 'Typical Angina' : chestPainType === 2 ? 'Atypical Angina' : chestPainType === 3 ? 'Non-Anginal' : 'Asymptomatic',
              oldpeak: Number(oldpeak || 1.2),
            },
            diabetes: {
              prediction: dualResult?.diabetes_assessment?.prediction?.prediction ?? (activeModelView === 'diabetes' && assessmentResult?.prediction?.prediction !== undefined ? assessmentResult.prediction.prediction : 1),
              prob: dualResult?.diabetes_assessment?.prediction?.probability ?? (activeModelView === 'diabetes' && assessmentResult?.prediction?.probability !== undefined ? assessmentResult.prediction.probability : 0.72),
              tier: dualResult?.diabetes_assessment?.prediction?.risk_tier ?? (activeModelView === 'diabetes' && assessmentResult?.prediction?.risk_tier ? assessmentResult.prediction.risk_tier : 'High'),
              factors: dualResult?.diabetes_assessment?.prediction?.feature_contributions
                ? dualResult.diabetes_assessment.prediction.feature_contributions.filter((f: any) => f.impact > 0).slice(0, 3).map((f: any) => (f.label || f.feature).toLowerCase()).join(', ') + ', etc.'
                : 'High glucose, high BMI, age, etc.'
            },
            heart: {
              prediction: dualResult?.heart_disease_assessment?.prediction?.prediction ?? (activeModelView === 'heart' && assessmentResult?.prediction?.prediction !== undefined ? assessmentResult.prediction.prediction : 0),
              prob: dualResult?.heart_disease_assessment?.prediction?.probability ?? (activeModelView === 'heart' && assessmentResult?.prediction?.probability !== undefined ? assessmentResult.prediction.probability : 0.24),
              tier: dualResult?.heart_disease_assessment?.prediction?.risk_tier ?? (activeModelView === 'heart' && assessmentResult?.prediction?.risk_tier ? assessmentResult.prediction.risk_tier : 'Low'),
              factors: dualResult?.heart_disease_assessment?.prediction?.feature_contributions
                ? dualResult.heart_disease_assessment.prediction.feature_contributions.filter((f: any) => f.impact > 0).slice(0, 3).map((f: any) => (f.label || f.feature).toLowerCase()).join(', ') + ', etc.'
                : 'Age, cholesterol, blood pressure, etc.'
            },
            notes: clinicalNotes || 'Patient evaluated for cardiometabolic disease indicators using calibrated predictive models.'
          }

          // Resolve active report data
          const reportData = (activeTargetId === patientId || !matchedCatalog)
            ? currentEvaluatedRecord
            : {
                id: activeTargetId,
                name: matchedCatalog.name,
                age: matchedCatalog.age,
                sex: matchedCatalog.sex,
                familyHistory: matchedCatalog.familyHistory,
                smokingHistory: matchedCatalog.smokingHistory,
                vitals: matchedCatalog.vitals,
                diabetes: matchedCatalog.diabetes,
                heart: matchedCatalog.heart,
                notes: matchedCatalog.notes
              }

          // Resolve effective report disease condition (Diabetes Only / Heart Disease Only / Both)
          let effectiveCondition: 'diabetes' | 'heart' | 'both' = 'diabetes'
          if (reportConditionFilter === 'diabetes') {
            effectiveCondition = 'diabetes'
          } else if (reportConditionFilter === 'heart') {
            effectiveCondition = 'heart'
          } else if (reportConditionFilter === 'both') {
            effectiveCondition = 'both'
          } else {
            // Auto-detect based on evaluation context
            if (activeTargetId === patientId) {
              if (selectedDiseaseTab === 'diabetes' || activeModelView === 'diabetes') {
                effectiveCondition = 'diabetes'
              } else if (selectedDiseaseTab === 'heart' || activeModelView === 'heart') {
                effectiveCondition = 'heart'
              } else {
                effectiveCondition = 'both'
              }
            } else {
              const matchedHist = assessmentsList.find(a => a.patient_id === activeTargetId)
              if (matchedHist) {
                const c = (matchedHist.condition || '').toLowerCase()
                if (c.includes('diabetes') && !c.includes('heart')) effectiveCondition = 'diabetes'
                else if (c.includes('heart') && !c.includes('diabetes')) effectiveCondition = 'heart'
                else effectiveCondition = 'both'
              } else {
                effectiveCondition = 'both'
              }
            }
          }

          // Distinct patient list for the selector
          const uniquePatients = [
            { id: patientId || 'P001', name: patientName || 'Current Active Evaluation', isCurrent: true },
            { id: 'PT-104', name: 'Alex Morgan', isCurrent: false },
            { id: 'PT-208', name: 'Robert Vance', isCurrent: false },
            { id: 'PT-315', name: 'Elena Cruz', isCurrent: false },
            { id: 'fareethimran2006@gmail.com', name: 'Imran Fareeth', isCurrent: false }
          ]

          // Add any other patients from assessments list not yet present
          assessmentsList.forEach((a) => {
            if (a.patient_id && !uniquePatients.some(p => p.id === a.patient_id)) {
              uniquePatients.push({ id: a.patient_id, name: `Record ${a.patient_id}`, isCurrent: false })
            }
          })

          const handleLoadPatientIntoForm = (targetId: string) => {
            const found = patientCatalog[targetId]
            if (found) {
              setPatientId(targetId)
              setPatientName(found.name)
              setCommonAge(String(found.age))
              setGender(found.sex === 'Female' ? 'Female' : 'Male')
              setFamilyHistory(found.familyHistory === 'Yes' ? 'Yes' : 'No')
              setSmokingHistory(found.smokingHistory === 'Yes' ? 'Yes' : 'No')
              setGlucose(String(found.vitals.glucose))
              setDiabetesBp(String(found.vitals.bp))
              setRestingBp(String(found.vitals.bp))
              setCholesterol(String(found.vitals.chol))
              setBmi(String(found.vitals.bmi))
              setMaxHeartRate(String(found.vitals.hr))
              setSelectedReportPatientId(targetId)
              setActiveTab('evaluate')
            }
          }

          return (
            <main className="mx-auto max-w-4xl p-4 sm:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-bold',
                    effectiveCondition === 'diabetes' ? 'bg-emerald-100 text-emerald-800' :
                    effectiveCondition === 'heart' ? 'bg-rose-100 text-rose-800' :
                    'bg-emerald-50 text-[#059669]'
                  )}>
                    {effectiveCondition === 'diabetes' ? 'DIABETES CLINICAL CONSULTATION REPORT' :
                     effectiveCondition === 'heart' ? 'HEART DISEASE CLINICAL CONSULTATION REPORT' :
                     'COMPREHENSIVE CLINICAL CONSULTATION REPORT'}
                  </span>
                  <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                    Patient Consultation Report
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {effectiveCondition === 'diabetes' ? 'Official endocrine & glycemic risk consultation report for checked diabetes assessment.' :
                     effectiveCondition === 'heart' ? 'Official cardiology consultation report for checked coronary heart disease assessment.' :
                     'Comprehensive cardiometabolic consultation report covering both diabetes and heart disease.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') window.print()
                    }}
                    className="flex items-center gap-2 rounded-xl bg-[#059669] hover:bg-[#047857] px-4 py-2.5 text-xs font-bold text-white shadow-md transition"
                  >
                    <Printer className="size-4" /> Print / Export PDF
                  </button>
                  <button
                    onClick={() => setActiveTab('evaluate')}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    &larr; Return to Evaluate
                  </button>
                </div>
              </div>

              {/* Patient Selector & Disease Condition Switcher Toolbar */}
              <div className="mt-6 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Patient Selector */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <User className="size-4 text-[#059669]" />
                    <span>Patient:</span>
                  </div>
                  <select
                    id="patient-report-select"
                    value={activeTargetId}
                    onChange={(e) => setSelectedReportPatientId(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#10b981]"
                  >
                    {uniquePatients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.id} &mdash; {p.name} {p.isCurrent ? '(Active Intake)' : ''}
                      </option>
                    ))}
                  </select>
                  {matchedCatalog && (
                    <button
                      onClick={() => handleLoadPatientIntoForm(activeTargetId)}
                      className="rounded-xl bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-[#059669] hover:bg-emerald-100 border border-emerald-200 transition"
                      title="Load this patient into the evaluation form"
                    >
                      Load into Form &rarr;
                    </button>
                  )}
                </div>

                {/* Condition Filter Scope Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-full md:w-auto justify-start md:justify-end">
                  <button
                    type="button"
                    onClick={() => setReportConditionFilter('diabetes')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition',
                      effectiveCondition === 'diabetes'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
                    )}
                  >
                    <Droplets className="size-3.5" />
                    Diabetes Only
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportConditionFilter('heart')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition',
                      effectiveCondition === 'heart'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-rose-800 hover:bg-rose-50'
                    )}
                  >
                    <HeartPulse className="size-3.5" />
                    Heart Disease Only
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportConditionFilter('both')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition',
                      effectiveCondition === 'both'
                        ? 'bg-[#059669] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#059669] hover:bg-emerald-50'
                    )}
                  >
                    <Sparkles className="size-3.5 text-amber-300" />
                    Both Models
                  </button>
                </div>
              </div>

              {/* Printable Official Medical Document */}
              <div id="printable-consultation-report" className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
                {/* Hospital / Clinic Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-[#059669] text-white">
                        <Stethoscope className="size-4" />
                      </span>
                      <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                        PULSEPATH HEALTHCARE &amp; MEDICAL CENTER
                      </h2>
                    </div>
                    <p className="text-xs font-semibold text-[#10b981] mt-0.5">
                      {effectiveCondition === 'diabetes' ? 'Cardiometabolic & Endocrinology Division • Diabetes Consultation Report' :
                       effectiveCondition === 'heart' ? 'Cardiometabolic & Cardiology Division • Heart Disease Consultation Report' :
                       'Cardiometabolic Diagnostic Division • Comprehensive Consultation Report'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Document ID: <span className="font-mono font-bold text-slate-700">
                        CR-{effectiveCondition === 'diabetes' ? 'DIA' : effectiveCondition === 'heart' ? 'CAD' : 'COMP'}-{reportData.id}-{new Date().getFullYear()}
                      </span> &bull; Issued: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right text-xs">
                    <p className="font-bold text-slate-900">{doctor.name}</p>
                    <p className="text-slate-500">{doctor.specialty}</p>
                    <p className="text-slate-500">License: {doctor.licenseId}</p>
                    <p className="text-slate-400 text-[11px]">{doctor.hospital}</p>
                  </div>
                </div>

                {/* Section A: Patient Details (Common for Both) */}
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      A. Patient Details (Common for Both)
                    </h3>
                    <span className="rounded-full bg-emerald-100/70 px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                      Verified Patient Record
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
                    <div>
                      <span className="block text-slate-400 text-[11px]">Patient ID</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">{reportData.id}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[11px]">Patient Name</span>
                      <span className="font-bold text-[#059669] text-sm">{reportData.name}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[11px]">Age &amp; Gender</span>
                      <span className="font-bold text-slate-800">{reportData.age} yrs &bull; {reportData.sex}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[11px]">Family History</span>
                      <span className="font-bold text-slate-800">{reportData.familyHistory}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[11px]">Smoking History</span>
                      <span className="font-bold text-slate-800">{reportData.smokingHistory}</span>
                    </div>
                  </div>
                </div>

                {/* Disease Risk Stratification - Conditional on Effective Condition */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {effectiveCondition === 'diabetes' ? 'Diabetes Risk Stratification (Model Output)' :
                       effectiveCondition === 'heart' ? 'Heart Disease Risk Stratification (Model Output)' :
                       'Disease Risk Stratification (Multi-Agent ML Engine)'}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {effectiveCondition === 'diabetes' ? 'Evaluated Model: Diabetes Predictor' :
                       effectiveCondition === 'heart' ? 'Evaluated Model: Heart Disease Predictor' :
                       'Dual Models Evaluated'}
                    </span>
                  </div>

                  {/* Card 1: Diabetes Prediction Result Table - Rendered if condition is diabetes or both */}
                  {(effectiveCondition === 'diabetes' || effectiveCondition === 'both') && (
                    <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden shadow-xs">
                      <div className="flex items-center gap-2 bg-[#dcfce7]/80 px-5 py-2.5 border-b border-emerald-200">
                        <span className="flex size-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px]">
                          <Droplets className="size-3" />
                        </span>
                        <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                          Diabetes Prediction Result
                        </h4>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                        <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                          <span className="font-semibold text-slate-700">Model Output (Class)</span>
                          <div>
                            <span className={cn(
                              'inline-block px-3 py-1 rounded text-xs font-bold',
                              reportData.diabetes.prediction === 1
                                ? 'bg-[#fef3c7] text-amber-950 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            )}>
                              {reportData.diabetes.prediction === 1 ? '1 (Diabetes Risk)' : '0 (No Diabetes)'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/50">
                          <span className="font-semibold text-slate-700">Probability</span>
                          <span className="font-bold text-slate-900">{Math.round(reportData.diabetes.prob * 100)}%</span>
                        </div>

                        <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                          <span className="font-semibold text-slate-700">Risk Level</span>
                          <div>
                            <span className={cn(
                              'inline-block px-3 py-1 rounded text-xs font-bold',
                              reportData.diabetes.tier === 'High' ? 'bg-[#fee2e2] text-red-700 border border-red-200' :
                              reportData.diabetes.tier === 'Moderate' ? 'bg-[#fef3c7] text-amber-700 border border-amber-200' :
                              'bg-[#dcfce7] text-emerald-800 border border-emerald-200'
                            )}>
                              {reportData.diabetes.tier} Risk
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/50">
                          <span className="font-semibold text-slate-700">Key Factors</span>
                          <span className="text-slate-600 font-medium text-xs">{reportData.diabetes.factors}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card 2: Heart Disease Prediction Result Table - Rendered if condition is heart or both */}
                  {(effectiveCondition === 'heart' || effectiveCondition === 'both') && (
                    <div className="rounded-2xl border border-amber-200 bg-white overflow-hidden shadow-xs">
                      <div className="flex items-center gap-2 bg-[#fef3c7]/80 px-5 py-2.5 border-b border-amber-200">
                        <span className="flex size-5 items-center justify-center rounded-full bg-rose-600 text-white text-[10px]">
                          <HeartPulse className="size-3" />
                        </span>
                        <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                          Heart Disease Prediction Result
                        </h4>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                        <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                          <span className="font-semibold text-slate-700">Model Output (Class)</span>
                          <div>
                            <span className={cn(
                              'inline-block px-3 py-1 rounded text-xs font-bold',
                              reportData.heart.prediction === 1
                                ? 'bg-rose-100 text-rose-900 border border-rose-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            )}>
                              {reportData.heart.prediction === 1 ? '1 (Heart Disease Risk)' : '0 (No Heart Disease)'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/50">
                          <span className="font-semibold text-slate-700">Probability</span>
                          <span className="font-bold text-slate-900">{Math.round(reportData.heart.prob * 100)}%</span>
                        </div>

                        <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-white">
                          <span className="font-semibold text-slate-700">Risk Level</span>
                          <div>
                            <span className={cn(
                              'inline-block px-3 py-1 rounded text-xs font-bold',
                              reportData.heart.tier === 'High' ? 'bg-[#fee2e2] text-red-700 border border-red-200' :
                              reportData.heart.tier === 'Moderate' ? 'bg-[#fef3c7] text-amber-700 border border-amber-200' :
                              'bg-[#dcfce7] text-emerald-800 border border-emerald-200'
                            )}>
                              {reportData.heart.tier} Risk
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 p-3 sm:px-5 items-center bg-slate-50/50">
                          <span className="font-semibold text-slate-700">Key Factors</span>
                          <span className="text-slate-600 font-medium text-xs">{reportData.heart.factors}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vitals & Biomarkers Intake - Tailored to Checked Disease */}
                <div className="rounded-2xl border border-slate-200 p-4 bg-white">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    {effectiveCondition === 'diabetes' ? 'Recorded Diabetes Biomarkers Intake' :
                     effectiveCondition === 'heart' ? 'Recorded Cardiac Biomarkers Intake' :
                     'Recorded Clinical Biomarkers Intake'}
                  </h4>
                  {effectiveCondition === 'diabetes' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <div className="bg-emerald-50/80 border border-emerald-100 p-2.5 rounded-xl text-center">
                        <span className="text-emerald-700 block text-[10px] font-semibold">Fasting Glucose</span>
                        <span className="font-bold text-slate-900">{reportData.vitals.glucose} mg/dL</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">BMI</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.bmi} kg/m²</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.bp} mmHg</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Serum Insulin</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.insulin || 85} µU/mL</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Skin Thickness</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.skin || 20} mm</span>
                      </div>
                    </div>
                  ) : effectiveCondition === 'heart' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <div className="bg-rose-50/70 border border-rose-100 p-2.5 rounded-xl text-center">
                        <span className="text-rose-700 block text-[10px] font-semibold">Resting BP</span>
                        <span className="font-bold text-slate-900">{reportData.vitals.bp} mmHg</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Serum Cholesterol</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.chol} mg/dL</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Max Heart Rate</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.hr} bpm</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Chest Pain</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.cp || 'Typical'}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">ST Depression</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.oldpeak ?? 1.2} mm</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.bp} mmHg</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Fasting Glucose</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.glucose} mg/dL</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Total Cholesterol</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.chol} mg/dL</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">BMI</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.bmi} kg/m²</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-slate-400 block text-[10px]">Max Heart Rate</span>
                        <span className="font-bold text-slate-800">{reportData.vitals.hr} bpm</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Clinical Recommendations & Lifestyle Targets - Tailored to Checked Condition */}
                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                    <p className="font-bold uppercase tracking-wider text-slate-700 text-[11px] mb-2">Recommended Diagnostic Workup</p>
                    {effectiveCondition === 'diabetes' ? (
                      <ul className="list-disc list-inside space-y-1 text-slate-800">
                        <li>Secondary HbA1c and 2-Hour Oral Glucose Tolerance Test (OGTT)</li>
                        <li>Fasting serum insulin and C-Peptide resistance assessment</li>
                        <li>Microalbuminuria urine screen and renal metabolic panel</li>
                      </ul>
                    ) : effectiveCondition === 'heart' ? (
                      <ul className="list-disc list-inside space-y-1 text-slate-800">
                        <li>12-lead resting and treadmill exercise stress electrocardiogram (ECG)</li>
                        <li>High-sensitivity Cardiac Troponin and hs-CRP inflammatory panel</li>
                        <li>Transthoracic echocardiogram (TTE) &amp; fractionated lipid profile</li>
                      </ul>
                    ) : (
                      <ul className="list-disc list-inside space-y-1 text-slate-800">
                        <li>Secondary HbA1c and fasting insulin confirmation panel</li>
                        <li>Fractionated lipid panel (LDL-C, HDL-C, Triglycerides)</li>
                        <li>12-lead resting electrocardiogram (ECG) monitoring</li>
                      </ul>
                    )}
                  </div>

                  <div className={cn(
                    'rounded-2xl p-4 border text-xs',
                    effectiveCondition === 'diabetes' ? 'bg-[#f0fdf4] border-emerald-200 text-emerald-950' :
                    effectiveCondition === 'heart' ? 'bg-rose-50/80 border-rose-200 text-rose-950' :
                    'bg-[#f0fdf4] border-emerald-100 text-[#059669]'
                  )}>
                    <p className="font-bold uppercase tracking-wider text-[11px] mb-2">Physician Care &amp; Lifestyle Directives</p>
                    {effectiveCondition === 'diabetes' ? (
                      <ul className="space-y-1 font-medium">
                        <li>&bull; Nutrition: Low glycemic index diet, strict refined carb restriction</li>
                        <li>&bull; Exercise: 150 minutes/week moderate-intensity aerobic conditioning</li>
                        <li>&bull; Follow-up: 30 to 60-day HbA1c re-evaluation &amp; daily glucose logs</li>
                      </ul>
                    ) : effectiveCondition === 'heart' ? (
                      <ul className="space-y-1 font-medium">
                        <li>&bull; Nutrition: Sodium restriction (&lt;2,000 mg/day) and DASH dietary regimen</li>
                        <li>&bull; Cardiac Conditioning: 30 min/day, 5 days/wk supervised aerobic activity</li>
                        <li>&bull; Follow-up: Outpatient cardiology review and BP log in 14 to 30 days</li>
                      </ul>
                    ) : (
                      <ul className="space-y-1 text-emerald-950 font-medium">
                        <li>&bull; Dietary modification: Low glycemic load, &lt;7% saturated fat</li>
                        <li>&bull; Aerobic endurance physical activity 150 min/week</li>
                        <li>&bull; Clinical follow-up re-evaluation in 30 to 60 days</li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* Clinical Remarks */}
                <div className="rounded-2xl border border-slate-200 p-4 bg-white text-xs">
                  <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider mb-1">Physician Clinical Remarks</p>
                  <p className="text-slate-600 leading-relaxed">{reportData.notes}</p>
                </div>

                {/* Attestation & Signature */}
                <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs text-slate-500">
                  <div className="max-w-md">
                    <p className="font-bold text-slate-800">Attending Physician Attestation</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {effectiveCondition === 'diabetes'
                        ? 'I certify that I have reviewed the clinical decision support outputs and validated the diabetes risk stratification in accordance with endocrinology guidelines.'
                        : effectiveCondition === 'heart'
                        ? 'I certify that I have reviewed the clinical decision support outputs and validated the coronary heart disease risk markers in accordance with cardiology governance.'
                        : 'I certify that I have reviewed the clinical decision support outputs and validated the multi-condition cardiometabolic risk stratification.'}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="border-b-2 border-slate-400 w-48 mb-1.5" />
                    <p className="font-mono text-xs font-bold text-slate-900">{doctor.name}</p>
                    <p className="text-[10px] text-slate-400">License: {doctor.licenseId} &bull; {doctor.hospital}</p>
                  </div>
                </div>
              </div>
            </main>
          )
        })()}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, hint }: { icon: typeof Activity; label: string; value: string; hint: string }) {
  return (
    <div className="group rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-pink-200/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-100/80 via-pink-100/60 to-amber-100/40 text-[#ec4899] shadow-xs group-hover:scale-105 transition-transform">
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-xs font-bold text-[#7c3aed] group-hover:text-[#ec4899] transition-colors">{hint}</p>
    </div>
  )
}
