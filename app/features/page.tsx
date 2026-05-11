import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  ChartNoAxesColumn,
  MessageSquareMore,
  QrCode,
  Sparkles,
  Ticket,
  Users,
  Workflow,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const featureGroups = [
  {
    eyebrow: 'Capture events at the speed of thought',
    title: 'Create and publish events before the idea slips away.',
    description:
      'Plan workshops, meetups, launches, and community sessions in one flow with templates, agendas, and instant publishing.',
    items: [
      {
        icon: CalendarDays,
        title: 'Smart event builder',
        text: 'Draft titles, dates, locations, capacity, and visibility in a single clean workspace.',
      },
      {
        icon: Ticket,
        title: 'Ticketing and RSVP',
        text: 'Offer free or paid entry, collect responses, and send confirmations automatically.',
      },
      {
        icon: QrCode,
        title: 'QR check-in',
        text: 'Scan attendees at the door and keep the entry queue moving without manual lists.',
      },
    ],
  },
  {
    eyebrow: 'Organize, prioritize, and get things done',
    title: 'Keep every moving part of the event in one place.',
    description:
      'Manage agendas, speakers, venues, run sheets, and follow-up tasks without switching tools.',
    items: [
      {
        icon: Workflow,
        title: 'Event workflow boards',
        text: 'Track planning stages from draft to published to completed.',
      },
      {
        icon: Users,
        title: 'Roles and approvals',
        text: 'Assign tasks to organizers, volunteers, and speakers with clear ownership.',
      },
      {
        icon: MessageSquareMore,
        title: 'Speaker and attendee notes',
        text: 'Capture session details, questions, and reminders right where the event lives.',
      },
    ],
  },
  {
    eyebrow: 'Focus on the right things at the right time',
    title: 'See what needs attention now, not what can wait.',
    description:
      'Get live visibility into registrations, check-ins, last-minute updates, and event health as the day unfolds.',
    items: [
      {
        icon: ChartNoAxesColumn,
        title: 'Live event analytics',
        text: 'Monitor registration trends, attendance, and engagement as they happen.',
      },
      {
        icon: Sparkles,
        title: 'Automated reminders',
        text: 'Send event nudges before kickoff, before deadlines, and after sessions end.',
      },
      {
        icon: CheckCircle2,
        title: 'Completion tracking',
        text: 'Close the loop with post-event tasks, surveys, and performance summaries.',
      },
    ],
  },
]

const highlights = [
  'Live event dashboards',
  'QR check-in and ticketing',
  'Speaker and volunteer management',
  'Automated reminders',
]

const metrics = [
  { value: '1 place', label: 'for planning, publishing, and tracking' },
  { value: 'Fast', label: 'registration, reminders, and check-ins' },
  { value: 'Clear', label: 'ownership for every event task' },
  { value: '24/7', label: 'visibility across light and dark mode' },
]

function SectionCard({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string
  title: string
  description: string
  items: Array<{ icon: React.ComponentType<{ className?: string }>; title: string; text: string }>
}) {
  return (
    <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <article
              key={item.title}
              className="rounded-2xl border border-border/60 bg-background/60 p-5 transition-transform duration-200 hover:-translate-y-1 hover:bg-background/80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground" style={{ boxShadow: 'var(--shadow-glow)' }}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default function FeaturesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-border/70 bg-card/80 px-6 py-10 shadow-[0_30px_120px_-70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-8 lg:px-10 lg:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(74,116,167,0.20),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(74,116,167,0.18),transparent_28%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-semibold text-muted-foreground backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Event management, designed to stay organized
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Everything you need to plan, run, and review events.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              A polished event operations page inspired by modern productivity dashboards, built for ticketing, RSVPs, check-ins, team coordination, and post-event insights.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-7 text-base font-semibold" style={{ boxShadow: 'var(--shadow-elegant)' }}>
                <Link href="/register">Start planning</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-border bg-background/30 px-7 text-base font-semibold text-foreground backdrop-blur-md hover:bg-background/50">
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span key={item} className="rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-md">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-border bg-background/60 p-5 backdrop-blur-md">
              <p className="text-sm font-medium text-muted-foreground">Today&apos;s events</p>
              <div className="mt-4 space-y-3">
                {[
                  { time: '08:30', title: 'Volunteer check-in opens', tag: 'Live' },
                  { time: '11:00', title: 'Main stage keynote', tag: 'Featured' },
                  { time: '15:30', title: 'Workshop session', tag: 'RSVP full' },
                ].map((event) => (
                  <div key={event.title} className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/70 px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{event.time}</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{event.title}</p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{event.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/70 p-5 backdrop-blur-md">
              <p className="text-sm font-medium text-muted-foreground">Event health</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                    <p className="text-2xl font-semibold tracking-tight text-foreground">{metric.value}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {featureGroups.map((group) => (
        <SectionCard key={group.title} {...group} />
      ))}

      <section className="grid gap-6 rounded-[2rem] border border-border/70 bg-card/80 p-6 backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Progress and follow-up</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Know what happened, what worked, and what to improve next.</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            Review attendance, engagement, and completion data after every event so your next one starts stronger than the last.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Attendance reports',
            'Check-in analytics',
            'Post-event surveys',
            'Task completion history',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-border/70 bg-background/60 p-5">
              <p className="text-sm font-semibold text-foreground">{item}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Track outcomes in a simple, trustworthy view across light and dark themes.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/70 bg-primary px-6 py-8 text-primary-foreground shadow-[0_30px_100px_-70px_rgba(0,0,0,0.45)] sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] opacity-80">Ready to build your next event</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Bring your event workflow into one polished place.</h2>
          </div>
          <Button asChild size="lg" variant="secondary" className="h-12 rounded-full px-7 text-base font-semibold text-secondary-foreground">
            <Link href="/register" className="inline-flex items-center gap-2">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}