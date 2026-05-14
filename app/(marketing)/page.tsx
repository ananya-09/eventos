import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Eventos - Modern Event Dashboard',
  description: 'Join Eventos for an unforgettable event experience with workshops, speakers, and networking opportunities.',
}

export default function Home() {
  return (
    <section className="min-h-screen">
      <div className="flex flex-1 items-center justify-center px-0 py-16 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/20 px-4 py-2 text-sm font-semibold text-muted-foreground backdrop-blur-md" style={{ boxShadow: 'var(--shadow-soft)' }}>
            <span className="h-2 w-2 rounded-full bg-primary" />
            Organizations · Events · Audiance — all at one platform
          </div>

          <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Where communities <span className="text-primary-glow">discover</span>, <span className="text-primary">interact</span>, and engage.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            A premium hub for organizations to share updates, create & host events with
            timed quizzes, live leaderboards, and face-to-face meets, all in one immersive feed.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-base font-semibold" style={{ boxShadow: 'var(--shadow-elegant)' }}>
              <Link href="/login">Host an Event</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-border bg-background/20 px-7 text-base font-semibold text-foreground backdrop-blur-md hover:bg-background/35">
              <Link href="/schedule">Discover Events</Link>
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            {['Events', 'Leaderboards', 'Ticketing', 'Community feeds'].map((item) => (
              <span
                key={item}
                className={cn(
                  'rounded-full border border-border bg-background/20 px-4 py-2 backdrop-blur-md',
                )}
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
