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

export const metadata = {
  title: 'Features – Eventos',
  description: 'Explore powerful features for managing events, from creation to analytics.',
}

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
        title: 'Post-event summaries',
        text: 'Automatically generate attendance reports, feedback snapshots, and next-steps.',
      },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Built for event organizers
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Everything you need to plan, execute, and follow up on events. From concept to attendee feedback.
          </p>
        </div>
      </section>

      {/* Features Section */}
      {featureGroups.map((group, index) => (
        <section key={index} className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-10 lg:py-20">
          <div className="space-y-8">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs font-semibold tracking-widest text-primary uppercase">
                {group.eyebrow}
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {group.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {group.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {group.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="relative rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-card/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="rounded-2xl border border-border/50 bg-gradient-to-b from-primary/10 to-accent/10 p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to streamline your events?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of organizers already using Eventos to create better experiences.
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/register" className="inline-flex items-center gap-2">
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
