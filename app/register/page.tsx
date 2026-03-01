'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'
import { toast } from 'sonner'
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  X,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  MessageCircle,
  Send,
  Plus,
  CheckCircle2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// ── Types ──────────────────────────────────────────────────────────────────

type Role = 'student' | 'educator' | 'professional'
type AttendMode = 'in-person' | 'virtual'

interface SocialEntry {
  id: string
  platform: string
  url: string
}

// ── Helper: social icon map ────────────────────────────────────────────────

function getSocialIcon(platformName: string): LucideIcon {
  const name = platformName.toLowerCase().trim()
  if (name.includes('linkedin')) return Linkedin
  if (name.includes('github')) return Github
  if (name.includes('twitter') || name.includes('x')) return Twitter
  if (name.includes('instagram')) return Instagram
  if (name.includes('youtube')) return Youtube
  if (name.includes('facebook')) return Facebook
  if (name.includes('discord')) return MessageCircle
  if (name.includes('telegram')) return Send
  if (name.includes('medium')) return BookOpen
  return Globe
}

// ── Progress bar ───────────────────────────────────────────────────────────

const TOTAL_STEPS = 6

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100)
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Step {step} of {TOTAL_STEPS}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ── Step 1 – Sign In ───────────────────────────────────────────────────────

function StepSignIn({
  onEmailNext,
}: {
  onEmailNext: (email: string) => void
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function handleEmail() {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    onEmailNext(email)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Welcome</h2>
        <p className="text-muted-foreground mt-1">Sign in to register for the event</p>
      </div>

      {/* Google */}
      <Button
        onClick={() => signIn('google')}
        variant="outline"
        className="w-full flex items-center gap-3 h-11 cursor-pointer"
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEmail()}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <Button onClick={handleEmail} className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
        Continue with Email
      </Button>
    </div>
  )
}

// ── Step 2 – Your Name ─────────────────────────────────────────────────────

function StepName({
  initialFirst,
  initialLast,
  onNext,
}: {
  initialFirst: string
  initialLast: string
  onNext: (first: string, last: string) => void
}) {
  const [first, setFirst] = useState(initialFirst)
  const [last, setLast] = useState(initialLast)
  const [error, setError] = useState('')

  function handleNext() {
    if (!first.trim()) {
      setError('First name is required.')
      return
    }
    setError('')
    onNext(first.trim(), last.trim())
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Your Name</h2>
        <p className="text-muted-foreground mt-1">How should we address you?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="Jane"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={last}
            onChange={(e) => setLast(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleNext} className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
        Proceed
      </Button>
    </div>
  )
}

// ── Step 3 – Role ──────────────────────────────────────────────────────────

interface RoleCard {
  id: Role
  icon: LucideIcon
  title: string
  description: string
  color: string
}

const ROLE_CARDS: RoleCard[] = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student',
    description: 'Currently enrolled in an undergraduate, postgraduate, or doctoral programme.',
    color: 'border-blue-500',
  },
  {
    id: 'educator',
    icon: BookOpen,
    title: 'Educator',
    description: 'Faculty, professor, or academic professional at an educational institution.',
    color: 'border-green-500',
  },
  {
    id: 'professional',
    icon: Briefcase,
    title: 'Professional',
    description: 'Industry professional, researcher, or practitioner working outside academia.',
    color: 'border-purple-500',
  },
]

function StepRole({ onNext }: { onNext: (role: Role) => void }) {
  const [selected, setSelected] = useState<Role | null>(null)
  const [error, setError] = useState('')

  function handleNext() {
    if (!selected) {
      setError('Please select a role to continue.')
      return
    }
    setError('')
    onNext(selected)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Your Role</h2>
        <p className="text-muted-foreground mt-1">Select the option that best describes you.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {ROLE_CARDS.map(({ id, icon: Icon, title, description, color }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelected(id)}
            className={`text-left rounded-xl border-2 p-5 transition-all cursor-pointer
              ${selected === id
                ? `${color} bg-accent`
                : 'border-border hover:border-muted-foreground'
              }`}
          >
            <div className="flex items-start gap-4">
              <Icon className={`w-7 h-7 mt-0.5 flex-shrink-0 ${selected === id ? 'text-foreground' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleNext} className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
        Continue
      </Button>
    </div>
  )
}

// ── Step 4A – Student Details ──────────────────────────────────────────────

interface StudentData {
  attendMode: AttendMode
  mobile: string
  university: string
  rollNumber: string
  course: string
  branch: string
  year: string
  semester: string
}

const UG_COURSES = [
  'B.Tech', 'B.E.', 'B.Sc.', 'B.Com.', 'B.A.', 'BBA', 'BCA',
  'B.Arch', 'B.Pharm', 'MBBS', 'B.Sc. (Nursing)', 'LLB', 'B.Des',
  'B.Sc. (Agriculture)', 'B.Ed.', 'Other UG',
]
const PG_COURSES = [
  'M.Tech', 'M.E.', 'M.Sc.', 'M.Com.', 'M.A.', 'MBA', 'MCA',
  'M.Arch', 'M.Pharm', 'M.S. (Medical)', 'M.Sc. (Nursing)', 'LLM', 'M.Des',
  'M.Sc. (Agriculture)', 'M.Ed.', 'Other PG',
]
const PHD_COURSES = [
  'PhD (Engineering)', 'PhD (Science)', 'PhD (Commerce)', 'PhD (Arts)',
  'PhD (Management)', 'PhD (Law)', 'PhD (Architecture)', 'PhD (Pharmacy)',
  'PhD (Medicine)', 'PhD (Nursing)', 'PhD (Agriculture)', 'Other PhD',
]

function StepStudentDetails({ onSubmit }: { onSubmit: (data: StudentData) => void }) {
  const [data, setData] = useState<StudentData>({
    attendMode: 'in-person',
    mobile: '',
    university: '',
    rollNumber: '',
    course: '',
    branch: '',
    year: '',
    semester: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof StudentData, string>>>({})

  function set<K extends keyof StudentData>(key: K, value: StudentData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof StudentData, string>> = {}
    if (!data.mobile.trim()) e.mobile = 'Required'
    if (!data.university.trim()) e.university = 'Required'
    if (!data.rollNumber.trim()) e.rollNumber = 'Required'
    if (!data.course) e.course = 'Required'
    if (!data.branch.trim()) e.branch = 'Required'
    if (!data.year) e.year = 'Required'
    if (!data.semester) e.semester = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (validate()) onSubmit(data)
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Student Details</h2>
        <p className="text-muted-foreground mt-1">Tell us about your academic background.</p>
      </div>

      {/* Mode */}
      <div className="space-y-2">
        <Label>Mode of Attending *</Label>
        <RadioGroup
          value={data.attendMode}
          onValueChange={(v) => set('attendMode', v as AttendMode)}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="in-person" id="s-ip" />
            <Label htmlFor="s-ip" className="cursor-pointer">In-person</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="virtual" id="s-vt" />
            <Label htmlFor="s-vt" className="cursor-pointer">Virtual</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Mobile */}
      <div className="space-y-2">
        <Label htmlFor="s-mobile">Mobile Number (WhatsApp preferred) *</Label>
        <Input
          id="s-mobile"
          placeholder="+91 98765 43210"
          value={data.mobile}
          onChange={(e) => set('mobile', e.target.value)}
        />
        {errors.mobile && <p className="text-xs text-destructive">{errors.mobile}</p>}
      </div>

      {/* University */}
      <div className="space-y-2">
        <Label htmlFor="s-uni">University Name *</Label>
        <Input
          id="s-uni"
          placeholder="e.g. Anna University"
          value={data.university}
          onChange={(e) => set('university', e.target.value)}
        />
        {errors.university && <p className="text-xs text-destructive">{errors.university}</p>}
      </div>

      {/* Roll */}
      <div className="space-y-2">
        <Label htmlFor="s-roll">University Roll Number *</Label>
        <Input
          id="s-roll"
          placeholder="e.g. 21CS001"
          value={data.rollNumber}
          onChange={(e) => set('rollNumber', e.target.value)}
        />
        {errors.rollNumber && <p className="text-xs text-destructive">{errors.rollNumber}</p>}
      </div>

      {/* Course */}
      <div className="space-y-2">
        <Label>Course *</Label>
        <Select value={data.course} onValueChange={(v) => set('course', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>UG Level</SelectLabel>
              {UG_COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>PG Level</SelectLabel>
              {PG_COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>PhD Level</SelectLabel>
              {PHD_COURSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.course && <p className="text-xs text-destructive">{errors.course}</p>}
      </div>

      {/* Branch */}
      <div className="space-y-2">
        <Label htmlFor="s-branch">Branch / Specialization *</Label>
        <Input
          id="s-branch"
          placeholder="e.g. Computer Science"
          value={data.branch}
          onChange={(e) => set('branch', e.target.value)}
        />
        {errors.branch && <p className="text-xs text-destructive">{errors.branch}</p>}
      </div>

      {/* Year & Semester */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Year *</Label>
          <Select value={data.year} onValueChange={(v) => set('year', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year+'].map((y) => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-xs text-destructive">{errors.year}</p>}
        </div>
        <div className="space-y-2">
          <Label>Semester *</Label>
          <Select value={data.semester} onValueChange={(v) => set('semester', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map((s) => (
                <SelectItem key={s} value={s}>{s} Sem</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.semester && <p className="text-xs text-destructive">{errors.semester}</p>}
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
        Submit
      </Button>
    </div>
  )
}

// ── Step 4B – Educator Details ─────────────────────────────────────────────

interface EducatorData {
  institution: string
  department: string
  designation: string
  qualification: string
  attendMode: AttendMode
  linkedin: string
  scholar: string
  researchgate: string
}

function StepEducatorDetails({ onSubmit }: { onSubmit: (data: EducatorData) => void }) {
  const [data, setData] = useState<EducatorData>({
    institution: '',
    department: '',
    designation: '',
    qualification: '',
    attendMode: 'in-person',
    linkedin: '',
    scholar: '',
    researchgate: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof EducatorData, string>>>({})

  function set<K extends keyof EducatorData>(key: K, value: EducatorData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof EducatorData, string>> = {}
    if (!data.institution.trim()) e.institution = 'Required'
    if (!data.department.trim()) e.department = 'Required'
    if (!data.designation.trim()) e.designation = 'Required'
    if (!data.qualification) e.qualification = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Educator Details</h2>
        <p className="text-muted-foreground mt-1">Tell us about your academic position.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="e-inst">Institution Name *</Label>
        <Input id="e-inst" placeholder="e.g. IIT Madras" value={data.institution} onChange={(e) => set('institution', e.target.value)} />
        {errors.institution && <p className="text-xs text-destructive">{errors.institution}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="e-dept">Department *</Label>
        <Input id="e-dept" placeholder="e.g. Computer Science" value={data.department} onChange={(e) => set('department', e.target.value)} />
        {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="e-desig">Designation *</Label>
        <Input id="e-desig" placeholder="e.g. Assistant Professor" value={data.designation} onChange={(e) => set('designation', e.target.value)} />
        {errors.designation && <p className="text-xs text-destructive">{errors.designation}</p>}
      </div>

      <div className="space-y-2">
        <Label>Highest Qualification *</Label>
        <Select value={data.qualification} onValueChange={(v) => set('qualification', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select qualification" />
          </SelectTrigger>
          <SelectContent>
            {['B.Tech/BE', 'M.Tech/ME/MS', 'MBA', 'PhD', 'Post-Doc', 'Other'].map((q) => (
              <SelectItem key={q} value={q}>{q}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.qualification && <p className="text-xs text-destructive">{errors.qualification}</p>}
      </div>

      <div className="space-y-2">
        <Label>Mode of Attending *</Label>
        <RadioGroup value={data.attendMode} onValueChange={(v) => set('attendMode', v as AttendMode)} className="flex gap-6">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="in-person" id="e-ip" />
            <Label htmlFor="e-ip" className="cursor-pointer">In-person</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="virtual" id="e-vt" />
            <Label htmlFor="e-vt" className="cursor-pointer">Virtual</Label>
          </div>
        </RadioGroup>
      </div>

      <p className="text-sm text-muted-foreground font-medium pt-1">Optional Profiles</p>

      <div className="space-y-2">
        <Label htmlFor="e-li">LinkedIn Profile URL</Label>
        <Input id="e-li" placeholder="https://linkedin.com/in/..." value={data.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="e-gs">Google Scholar URL</Label>
        <Input id="e-gs" placeholder="https://scholar.google.com/..." value={data.scholar} onChange={(e) => set('scholar', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="e-rg">ResearchGate Profile URL</Label>
        <Input id="e-rg" placeholder="https://researchgate.net/profile/..." value={data.researchgate} onChange={(e) => set('researchgate', e.target.value)} />
      </div>

      <Button
        onClick={() => { if (validate()) onSubmit(data) }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
      >
        Submit
      </Button>
    </div>
  )
}

// ── Step 4C – Professional Details ────────────────────────────────────────

interface ProfessionalData {
  company: string
  position: string
  experience: string
  attendMode: AttendMode
}

function StepProfessionalDetails({ onSubmit }: { onSubmit: (data: ProfessionalData) => void }) {
  const [data, setData] = useState<ProfessionalData>({
    company: '',
    position: '',
    experience: '',
    attendMode: 'in-person',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ProfessionalData, string>>>({})

  function set<K extends keyof ProfessionalData>(key: K, value: ProfessionalData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof ProfessionalData, string>> = {}
    if (!data.company.trim()) e.company = 'Required'
    if (!data.position.trim()) e.position = 'Required'
    if (!data.experience) e.experience = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Professional Details</h2>
        <p className="text-muted-foreground mt-1">Tell us about your professional background.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="p-co">Institution / Company Name *</Label>
        <Input id="p-co" placeholder="e.g. Infosys" value={data.company} onChange={(e) => set('company', e.target.value)} />
        {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="p-pos">Position / Designation *</Label>
        <Input id="p-pos" placeholder="e.g. Software Engineer" value={data.position} onChange={(e) => set('position', e.target.value)} />
        {errors.position && <p className="text-xs text-destructive">{errors.position}</p>}
      </div>

      <div className="space-y-2">
        <Label>Years of Experience *</Label>
        <Select value={data.experience} onValueChange={(v) => set('experience', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
            {['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'].map((x) => (
              <SelectItem key={x} value={x}>{x}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.experience && <p className="text-xs text-destructive">{errors.experience}</p>}
      </div>

      <div className="space-y-2">
        <Label>Mode of Attending *</Label>
        <RadioGroup value={data.attendMode} onValueChange={(v) => set('attendMode', v as AttendMode)} className="flex gap-6">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="in-person" id="p-ip" />
            <Label htmlFor="p-ip" className="cursor-pointer">In-person</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="virtual" id="p-vt" />
            <Label htmlFor="p-vt" className="cursor-pointer">Virtual</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        onClick={() => { if (validate()) onSubmit(data) }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
      >
        Submit
      </Button>
    </div>
  )
}

// ── Step 5 – Social Media (Student only) ──────────────────────────────────

function StepSocialMedia({ onNext }: { onNext: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [linkedin, setLinkedin] = useState('')
  const [github, setGithub] = useState('')
  const [extras, setExtras] = useState<SocialEntry[]>([])

  function handleSkip() {
    toast('You can add your social media profiles later from your profile settings.')
    onNext()
  }

  function addExtra() {
    setExtras((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, platform: '', url: '' }])
  }

  function updateExtra(id: string, field: 'platform' | 'url', value: string) {
    setExtras((prev) => prev.map((e) => e.id === id ? { ...e, [field]: value } : e))
  }

  function removeExtra(id: string) {
    setExtras((prev) => prev.filter((e) => e.id !== id))
  }

  if (!showForm) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Social Media</h2>
          <p className="text-muted-foreground mt-1">Would you like to add your social media profiles?</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setShowForm(true)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          >
            Yes, Add Now
          </Button>
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1 cursor-pointer"
          >
            Skip for now
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Social Media Profiles</h2>
        <p className="text-muted-foreground mt-1">Add links to your online presence.</p>
      </div>

      {/* LinkedIn */}
      <div className="space-y-2">
        <Label htmlFor="sm-li">
          <span className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" /> LinkedIn URL
          </span>
        </Label>
        <Input id="sm-li" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
      </div>

      {/* GitHub */}
      <div className="space-y-2">
        <Label htmlFor="sm-gh">
          <span className="flex items-center gap-2">
            <Github className="w-4 h-4" /> GitHub URL
          </span>
        </Label>
        <Input id="sm-gh" placeholder="https://github.com/..." value={github} onChange={(e) => setGithub(e.target.value)} />
      </div>

      {/* Dynamic extras */}
      {extras.map((entry) => {
        const Icon = getSocialIcon(entry.platform)
        return (
          <div key={entry.id} className="flex items-start gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Platform</Label>
                <Input
                  placeholder="e.g. Twitter"
                  value={entry.platform}
                  onChange={(e) => updateExtra(entry.id, 'platform', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1">
                  <Icon className="w-3 h-3" /> URL
                </Label>
                <Input
                  placeholder="https://..."
                  value={entry.url}
                  onChange={(e) => updateExtra(entry.id, 'url', e.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeExtra(entry.id)}
              className="mt-6 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}

      <Button
        type="button"
        variant="outline"
        onClick={addExtra}
        className="w-full cursor-pointer flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Platform
      </Button>

      <Button onClick={onNext} className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
        Save & Continue
      </Button>
    </div>
  )
}

// ── Step 6 – Thank You ─────────────────────────────────────────────────────

function StepThankYou({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <CheckCircle2 className="w-20 h-20 text-green-500" strokeWidth={1.5} />
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Registration Complete! 🎉</h2>
        <p className="text-muted-foreground">Thank you for registering! We&apos;ll send a confirmation email shortly.</p>
        {name && (
          <p className="text-foreground font-medium mt-2">
            Welcome, <span className="text-blue-500">{name}</span>!
          </p>
        )}
      </div>
      <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer px-8">
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { data: session, status } = useSession()

  // Derive the display step number for the progress bar (1-indexed, maps to logical steps)
  const [step, setStep] = useState(1)          // 1=signin,2=name,3=role,4=details,5=social,6=thanks
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState<Role | null>(null)

  // Auto-advance past sign-in if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && step === 1) {
      // Pre-fill name from session
      const name = session?.user?.name ?? ''
      const parts = name.split(' ')
      setFirstName(parts[0] ?? '')
      setLastName(parts.slice(1).join(' '))
      setStep(2)
    }
  }, [status, session, step])

  // Map logical step to progress bar step (step 4A/4B/4C all count as step 4)
  const progressStep = Math.min(step, TOTAL_STEPS)

  function handleSignInEmail(em: string) {
    setEmail(em)
    // Pre-fill name from email (part before @)
    const localPart = em.split('@')[0] ?? ''
    if (!firstName) setFirstName(localPart)
    setStep(2)
  }

  function handleName(first: string, last: string) {
    setFirstName(first)
    setLastName(last)
    setStep(3)
  }

  function handleRole(r: Role) {
    setRole(r)
    setStep(4)
  }

  function handleDetailsSubmit() {
    if (role === 'student') {
      setStep(5)
    } else {
      setStep(6)
    }
  }

  function handleSocialNext() {
    setStep(6)
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <Link href="/" className="font-bold text-xl text-foreground">
          Eventos
        </Link>
        <Link
          href="/"
          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </Link>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {step < 6 && <ProgressBar step={progressStep} />}

          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8">
            {step === 1 && (
              <StepSignIn onEmailNext={handleSignInEmail} />
            )}
            {step === 2 && (
              <StepName
                initialFirst={firstName}
                initialLast={lastName}
                onNext={handleName}
              />
            )}
            {step === 3 && (
              <StepRole onNext={handleRole} />
            )}
            {step === 4 && role === 'student' && (
              <StepStudentDetails onSubmit={handleDetailsSubmit} />
            )}
            {step === 4 && role === 'educator' && (
              <StepEducatorDetails onSubmit={handleDetailsSubmit} />
            )}
            {step === 4 && role === 'professional' && (
              <StepProfessionalDetails onSubmit={handleDetailsSubmit} />
            )}
            {step === 5 && (
              <StepSocialMedia onNext={handleSocialNext} />
            )}
            {step === 6 && (
              <StepThankYou name={fullName} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
