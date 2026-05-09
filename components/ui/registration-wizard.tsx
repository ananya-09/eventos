'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  X,
  Plus,
  Github,
  Linkedin,
  Globe,
  Link as LinkIcon,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  Twitch,
  Gitlab,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// ─── Platform Icon Map ────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  gitlab: Gitlab,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitch: Twitch,
  website: Globe,
  web: Globe,
}

function getPlatformIcon(name: string): LucideIcon {
  return PLATFORM_ICONS[name.toLowerCase().trim()] ?? LinkIcon
}

// ─── Semester options by course level ────────────────────────────────────────

const SEMESTER_OPTIONS: Record<string, string[]> = {
  UG: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
  PG: ['1st', '2nd', '3rd', '4th'],
  PhD: ['1st', '2nd', '3rd', '4th', '5th', '6th'],
}

const UG_COURSES = [
  'B.Tech',
  'B.E.',
  'B.Sc.',
  'B.Com.',
  'B.A.',
  'BBA',
  'BCA',
  'B.Arch',
  'B.Pharm',
  'MBBS',
  'B.Sc. (Nursing)',
  'LLB',
  'B.Des',
  'B.Sc. (Agriculture)',
  'B.Ed.',
  'Other UG',
]

const PG_COURSES = [
  'M.Tech',
  'M.E.',
  'M.Sc.',
  'M.Com.',
  'M.A.',
  'MBA',
  'MCA',
  'M.Arch',
  'M.Pharm',
  'M.S. (Medical)',
  'M.Sc. (Nursing)',
  'LLM',
  'M.Des',
  'M.Sc. (Agriculture)',
  'M.Ed.',
  'Other PG',
]

const PHD_COURSES = [
  'PhD (Engineering)',
  'PhD (Science)',
  'PhD (Commerce)',
  'PhD (Arts)',
  'PhD (Management)',
  'PhD (Law)',
  'PhD (Architecture)',
  'PhD (Pharmacy)',
  'PhD (Medicine)',
  'PhD (Nursing)',
  'PhD (Agriculture)',
  'Other PhD',
]

const COURSE_OPTIONS: Record<string, string[]> = {
  UG: UG_COURSES,
  PG: PG_COURSES,
  PhD: PHD_COURSES,
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const identitySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
})

const studentSchema = z.object({
  modeOfAttendance: z.enum(['in-person', 'virtual'], {
    required_error: 'Please select a mode of attendance',
  }),
  mobileNumber: z.string().min(7, 'Please enter a valid mobile number'),
  universityName: z.string().min(1, 'University name is required'),
  universityRollNumber: z.string().min(1, 'Roll number is required'),
  courseLevel: z.enum(['UG', 'PG', 'PhD'], {
    required_error: 'Please select a course level',
  }),
  courseName: z.string().min(1, 'Please select a course'),
  branch: z.string().min(1, 'Branch / major is required'),
  yearOfStudy: z.enum(['1st', '2nd', '3rd', '4th'], {
    required_error: 'Please select year of study',
  }),
  semester: z.string().min(1, 'Please select a semester'),
})

const educatorSchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  highestQualification: z.string().min(1, 'Highest qualification is required'),
  modeOfAttendance: z.enum(['in-person', 'virtual'], {
    required_error: 'Please select a mode of attendance',
  }),
  linkedinProfile: z
    .union([z.string().url('Please enter a valid URL'), z.literal('')])
    .optional(),
  googleScholarLink: z
    .union([z.string().url('Please enter a valid URL'), z.literal('')])
    .optional(),
})

const professionalSchema = z.object({
  institutionCompanyName: z
    .string()
    .min(1, 'Company / institution name is required'),
  position: z.string().min(1, 'Position is required'),
  yearsOfExperience: z.coerce
    .number()
    .min(0, 'Must be 0 or greater')
    .max(60, 'Please enter a valid number'),
  modeOfAttendance: z.enum(['in-person', 'virtual'], {
    required_error: 'Please select a mode of attendance',
  }),
})

const socialMediaSchema = z.object({
  linkedin: z
    .union([z.string().url('Please enter a valid URL'), z.literal('')])
    .optional(),
  github: z
    .union([z.string().url('Please enter a valid URL'), z.literal('')])
    .optional(),
  customPlatforms: z
    .array(
      z.object({
        platformName: z.string().min(1, 'Platform name is required'),
        publicLink: z.string().url('Please enter a valid URL'),
      }),
    )
    .optional(),
})

type IdentityFormData = z.infer<typeof identitySchema>
type StudentFormData = z.infer<typeof studentSchema>
type EducatorFormData = z.infer<typeof educatorSchema>
type ProfessionalFormData = z.infer<typeof professionalSchema>
type SocialMediaFormData = z.infer<typeof socialMediaSchema>
type Role = 'student' | 'educator' | 'professional'

// ─── Step enum ───────────────────────────────────────────────────────────────

const STEP = {
  AUTH: 0,
  IDENTITY: 1,
  ROLE: 2,
  FIELDS: 3,
  SOCIAL: 4,
  DONE: 5,
} as const

type StepValue = (typeof STEP)[keyof typeof STEP]

// ─── Step progress bar ───────────────────────────────────────────────────────

function StepProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div className="flex items-center gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 rounded-full flex-1 transition-all duration-300',
            i < current
              ? 'bg-primary'
              : i === current
                ? 'bg-primary-glow'
                : 'bg-muted',
          )}
        />
      ))}
    </div>
  )
}

// ─── Auth Step ───────────────────────────────────────────────────────────────

function AuthStep({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session) {
      onAuthenticated()
    }
  }, [status, session, onAuthenticated])

  const callbackUrl =
    typeof window !== 'undefined' ? window.location.href : '/register'

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl mb-2">👋</div>
        <h2 className="text-xl font-semibold text-foreground">
          Welcome! Let&apos;s get you registered
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in to register for the workshop
        </p>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-3 h-11 rounded-xl border-border/60 hover:bg-primary/10 dark:hover:bg-primary/10 hover:border-primary/30 transition-colors"
          onClick={() => signIn('google', { callbackUrl })}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-3 h-11 rounded-xl border-border/60 hover:bg-primary/10 dark:hover:bg-primary/10 hover:border-primary/30 transition-colors"
          onClick={() => signIn('github', { callbackUrl })}
        >
          <Github className="w-5 h-5 shrink-0" />
          Continue with GitHub
        </Button>

        <div className="relative py-1">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-background px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <EmailSignInForm />
      </div>

      {status === 'loading' && (
        <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Checking authentication…
        </p>
      )}
    </div>
  )
}

function EmailSignInForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    const result = await signIn('email', {
      email,
      callbackUrl:
        typeof window !== 'undefined' ? window.location.href : '/register',
      redirect: false,
    })
    if (result?.ok) {
      setSent(true)
    } else if (result?.error) {
      toast.error('Email sign-in is not available', {
        description: 'Please use Google or GitHub to sign in.',
      })
    }
  }

  if (sent) {
    return (
      <p className="text-center text-sm text-muted-foreground py-2">
        ✉️ Check your inbox for a magic link!
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-xl h-11 flex-1"
        required
      />
      <Button
        type="submit"
          className="h-11 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white shrink-0"
      >
        Continue
      </Button>
    </form>
  )
}

// ─── Identity Step ────────────────────────────────────────────────────────────

function IdentityStep({
  session,
  onNext,
}: {
  session: { user?: { name?: string | null; email?: string | null } } | null
  onNext: (data: IdentityFormData) => void
}) {
  const guessName = (fullName?: string | null) => {
    if (!fullName) return { firstName: '', lastName: '' }
    const parts = fullName.trim().split(/\s+/)
    return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') }
  }
  const { firstName, lastName } = guessName(session?.user?.name)

  const form = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: { firstName, lastName: lastName || '' },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Your Name</h2>
          <p className="text-sm text-muted-foreground">
            {session?.user?.email
              ? `Signed in as ${session.user.email}`
              : 'Confirm or edit your name to continue'}
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name{' '}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="First name"
                    className="rounded-xl h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name{' '}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last name"
                    className="rounded-xl h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
        >
          Continue <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </form>
    </Form>
  )
}

// ─── Role Step ────────────────────────────────────────────────────────────────

function RoleStep({ onNext }: { onNext: (role: Role) => void }) {
  const [selected, setSelected] = useState<Role | null>(null)

  const roles: {
    value: Role
    label: string
    icon: LucideIcon
    description: string
  }[] = [
    {
      value: 'student',
      label: 'Student',
      icon: GraduationCap,
      description: 'Undergraduate, postgraduate, or doctoral student',
    },
    {
      value: 'educator',
      label: 'Educator',
      icon: BookOpen,
      description: 'Faculty member, teacher, or academic researcher',
    },
    {
      value: 'professional',
      label: 'Professional',
      icon: Briefcase,
      description: 'Industry professional or domain expert',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold text-foreground">Your Role</h2>
        <p className="text-sm text-muted-foreground">Tell us who you are</p>
      </div>

      <div className="space-y-3">
        {roles.map(({ value, label, icon: Icon, description }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelected(value)}
            className={cn(
              'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200',
              selected === value
                 ? 'border-primary bg-primary/10 dark:bg-primary/10 shadow-sm'
                 : 'border-border hover:border-primary/70 hover:bg-muted/50',
            )}
          >
            <div
              className={cn(
                'p-2 rounded-lg shrink-0',
                selected === value
                   ? 'bg-primary/15 dark:bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            {selected === value && (
               <CheckCircle2 className="w-4 h-4 text-primary ml-auto shrink-0" />
            )}
          </button>
        ))}
      </div>

      <Button
        type="button"
        disabled={!selected}
        onClick={() => selected && onNext(selected)}
        className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium disabled:opacity-50"
      >
        Continue <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}

// ─── Student Step ─────────────────────────────────────────────────────────────

function StudentStep({ onNext }: { onNext: (data: StudentFormData) => void }) {
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      modeOfAttendance: undefined,
      mobileNumber: '',
      universityName: '',
      universityRollNumber: '',
      courseLevel: undefined,
      courseName: '',
      branch: '',
      yearOfStudy: undefined,
      semester: '',
    },
  })

  const courseLevel = form.watch('courseLevel')
  const courseOptions = courseLevel ? COURSE_OPTIONS[courseLevel] : []
  const semesterOptions = courseLevel ? SEMESTER_OPTIONS[courseLevel] : []

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="space-y-4"
      >
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Student Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill in your academic information
          </p>
        </div>

        {/* Mode of Attendance */}
        <FormField
          control={form.control}
          name="modeOfAttendance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mode of Attendance{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  {(['in-person', 'virtual'] as const).map((mode) => (
                    <div key={mode} className="flex items-center gap-2">
                      <RadioGroupItem value={mode} id={`student-mode-${mode}`} />
                      <Label
                        htmlFor={`student-mode-${mode}`}
                        className="cursor-pointer"
                      >
                        {mode === 'in-person' ? 'In-person' : 'Virtual'}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mobile */}
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mobile Number{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>{' '}
                <span className="text-xs text-muted-foreground">
                  (WhatsApp preferred)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="+91 98765 43210"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* University */}
        <FormField
          control={form.control}
          name="universityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                University Name{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Delhi University"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Roll Number */}
        <FormField
          control={form.control}
          name="universityRollNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                University Roll Number{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 2021CS001"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Level */}
        <FormField
          control={form.control}
          name="courseLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Course Level{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val)
                  form.setValue('courseName', '')
                  form.setValue('semester', '')
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select course level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(['UG', 'PG', 'PhD'] as const).map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course */}
        <FormField
          control={form.control}
          name="courseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Course{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!courseLevel}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue
                      placeholder={
                        courseLevel
                          ? 'Select course'
                          : 'Select course level first'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseOptions.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Branch */}
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Branch / Major{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Computer Science"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Year of Study */}
        <FormField
          control={form.control}
          name="yearOfStudy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Year of Study{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(['1st', '2nd', '3rd', '4th'] as const).map((y) => (
                    <SelectItem key={y} value={y}>
                      {y} Year
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Semester */}
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Semester{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!courseLevel}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue
                      placeholder={
                        courseLevel
                          ? 'Select semester'
                          : 'Select course level first'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {semesterOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s} Semester
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
        >
          Continue <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </form>
    </Form>
  )
}

// ─── Educator Step ────────────────────────────────────────────────────────────

function EducatorStep({
  onNext,
}: {
  onNext: (data: EducatorFormData) => void
}) {
  const form = useForm<EducatorFormData>({
    resolver: zodResolver(educatorSchema),
    defaultValues: {
      institutionName: '',
      department: '',
      designation: '',
      highestQualification: '',
      modeOfAttendance: undefined,
      linkedinProfile: '',
      googleScholarLink: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Educator Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill in your professional information
          </p>
        </div>

        <FormField
          control={form.control}
          name="institutionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Institution Name{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. IIT Delhi"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Department{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Computer Science"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Designation{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Associate Professor"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highestQualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Highest Qualification{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Ph.D. in Computer Science"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mode of Attendance */}
        <FormField
          control={form.control}
          name="modeOfAttendance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mode of Attendance{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  {(['in-person', 'virtual'] as const).map((mode) => (
                    <div key={mode} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={mode}
                        id={`educator-mode-${mode}`}
                      />
                      <Label
                        htmlFor={`educator-mode-${mode}`}
                        className="cursor-pointer"
                      >
                        {mode === 'in-person' ? 'In-person' : 'Virtual'}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedinProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                LinkedIn Profile{' '}
                <span className="text-xs text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://linkedin.com/in/…"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="googleScholarLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Google Scholar Link{' '}
                <span className="text-xs text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://scholar.google.com/…"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
        >
          Submit Registration <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </form>
    </Form>
  )
}

// ─── Professional Step ────────────────────────────────────────────────────────

function ProfessionalStep({
  onNext,
}: {
  onNext: (data: ProfessionalFormData) => void
}) {
  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      institutionCompanyName: '',
      position: '',
      yearsOfExperience: 0,
      modeOfAttendance: undefined,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Professional Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill in your work information
          </p>
        </div>

        <FormField
          control={form.control}
          name="institutionCompanyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Institution / Company Name{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Google, Inc."
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Position{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Software Engineer"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="yearsOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Years of Experience{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 5"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mode of Attendance */}
        <FormField
          control={form.control}
          name="modeOfAttendance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mode of Attendance{' '}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  {(['in-person', 'virtual'] as const).map((mode) => (
                    <div key={mode} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={mode}
                        id={`pro-mode-${mode}`}
                      />
                      <Label
                        htmlFor={`pro-mode-${mode}`}
                        className="cursor-pointer"
                      >
                        {mode === 'in-person' ? 'In-person' : 'Virtual'}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
        >
          Submit Registration <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </form>
    </Form>
  )
}

// ─── Social Media Step ────────────────────────────────────────────────────────

function SocialMediaStep({
  onSubmit,
  onSkip,
}: {
  onSubmit: (data: SocialMediaFormData) => void
  onSkip: () => void
}) {
  const [addNow, setAddNow] = useState<boolean | null>(null)

  const form = useForm<SocialMediaFormData>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: { linkedin: '', github: '', customPlatforms: [] },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customPlatforms',
  })

  const watchedPlatforms = form.watch('customPlatforms') ?? []

  if (addNow === null) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl mb-1">🔗</div>
          <h2 className="text-xl font-semibold text-foreground">
            Social Media Profiles
          </h2>
          <p className="text-sm text-muted-foreground">
            Would you like to add your social media profiles now?
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl border-border/60 hover:border-primary/30 hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors"
            onClick={onSkip}
          >
            No, skip for now
          </Button>
          <Button
            type="button"
            className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-white"
            onClick={() => setAddNow(true)}
          >
            Yes, add now
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Social Media
          </h2>
          <p className="text-sm text-muted-foreground">
            Add your public profile links
          </p>
        </div>

        {/* LinkedIn */}
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                LinkedIn
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://linkedin.com/in/…"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GitHub */}
        <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://github.com/…"
                  className="rounded-xl h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Custom platforms */}
        {fields.map((fieldItem, index) => {
          const platformName = watchedPlatforms[index]?.platformName ?? ''
          const PlatformIcon = getPlatformIcon(platformName)
          return (
            <div
              key={fieldItem.id}
              className="p-3 rounded-xl border border-dashed border-border/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <PlatformIcon className="w-4 h-4 transition-all duration-200" />
                  {platformName || 'Custom Platform'}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove platform"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <FormField
                control={form.control}
                name={`customPlatforms.${index}.platformName`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Platform name (e.g. Twitter, Discord)"
                        className="rounded-xl h-10 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`customPlatforms.${index}.publicLink`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Public profile URL"
                        className="rounded-xl h-10 text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )
        })}

        <button
          type="button"
          onClick={() => append({ platformName: '', publicLink: '' })}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary-glow transition-colors w-full justify-center py-2.5 rounded-xl border border-dashed border-primary/30 hover:border-primary/40 hover:bg-primary/10 dark:hover:bg-primary/10"
        >
          <Plus className="w-4 h-4" /> Add another platform
        </button>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium"
        >
          Submit Registration
        </Button>
      </form>
    </Form>
  )
}

// ─── Thank You Step ───────────────────────────────────────────────────────────

function ThankYouStep({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6 text-center py-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          You&apos;re registered! 🎉
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Thank you for registering for the workshop. We&apos;ll be in touch
          soon with more details.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close and return to home"
      >
        <X className="w-4 h-4" />
        Close
      </button>
    </div>
  )
}

// ─── Registration Wizard (main export) ───────────────────────────────────────

type RegistrationData = {
  firstName?: string
  lastName?: string
  role?: Role
  roleData?: StudentFormData | EducatorFormData | ProfessionalFormData
  socialMedia?: SocialMediaFormData
}

export function RegistrationWizard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState<StepValue | null>(null)
  const [regData, setRegData] = useState<RegistrationData>({})

  // Determine start step after auth status resolves
  useEffect(() => {
    if (status === 'loading') return
    setStep(status === 'authenticated' ? STEP.IDENTITY : STEP.AUTH)
  }, [status])

  // Progress bar: identity=1, role=2, fields=3, social=4 (student only)
  const totalProgressSteps = regData.role === 'student' ? 4 : 3
  const progressCurrent =
    step != null && step >= STEP.IDENTITY && step < STEP.DONE
      ? step - 1
      : 0

  function goToHome() {
    router.push('/')
  }

  function handleStudentFields(roleData: StudentFormData) {
    setRegData((d) => ({ ...d, roleData }))
    setStep(STEP.SOCIAL)
  }

  function handleEducatorOrProfessionalFields(
    roleData: EducatorFormData | ProfessionalFormData,
  ) {
    setRegData((d) => ({ ...d, roleData }))
    setStep(STEP.DONE)
  }

  function handleSocialSubmit(socialMedia: SocialMediaFormData) {
    setRegData((d) => ({ ...d, socialMedia }))
    setStep(STEP.DONE)
  }

  function handleSocialSkip() {
    toast('You can always add these later!', {
      description: 'Visit your profile to update your social links anytime.',
    })
    setStep(STEP.DONE)
  }

  // Loading state while auth status resolves
  if (step === null) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary-glow" />
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Progress bar (skip on auth & done steps) */}
      {step >= STEP.IDENTITY && step < STEP.DONE && (
        <StepProgressBar current={progressCurrent} total={totalProgressSteps} />
      )}

      {step === STEP.AUTH && (
        <AuthStep onAuthenticated={() => setStep(STEP.IDENTITY)} />
      )}

      {step === STEP.IDENTITY && (
        <IdentityStep
          session={session}
          onNext={(d) => {
            setRegData((prev) => ({ ...prev, ...d }))
            setStep(STEP.ROLE)
          }}
        />
      )}

      {step === STEP.ROLE && (
        <RoleStep
          onNext={(role) => {
            setRegData((prev) => ({ ...prev, role }))
            setStep(STEP.FIELDS)
          }}
        />
      )}

      {step === STEP.FIELDS && regData.role === 'student' && (
        <StudentStep onNext={handleStudentFields} />
      )}

      {step === STEP.FIELDS && regData.role === 'educator' && (
        <EducatorStep onNext={handleEducatorOrProfessionalFields} />
      )}

      {step === STEP.FIELDS && regData.role === 'professional' && (
        <ProfessionalStep onNext={handleEducatorOrProfessionalFields} />
      )}

      {step === STEP.SOCIAL && (
        <SocialMediaStep
          onSubmit={handleSocialSubmit}
          onSkip={handleSocialSkip}
        />
      )}

      {step === STEP.DONE && <ThankYouStep onClose={goToHome} />}
    </div>
  )
}
