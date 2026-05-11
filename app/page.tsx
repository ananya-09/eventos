import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'


export default function Home() {
  return (
    <section className="min-h-screen">
      <div className="flex flex-1 items-center justify-center px-0 py-16 md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/20 px-4 py-2 text-sm font-semibold text-muted-foreground backdrop-blur-md" style={{ boxShadow: 'var(--shadow-soft)' }}>
            <span className="h-2 w-2 rounded-full bg-primary" />
            Communities · Events · Assessments — one platform
          </div>

          <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Where communities <span className="text-primary-glow">meet</span>, <span className="text-primary">create</span>, and compete.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            A premium home for organizations to share updates, run events with QR ticketing,
            host timed quizzes with live leaderboards, and meet face-to-face, all in one immersive feed.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-base font-semibold" style={{ boxShadow: 'var(--shadow-elegant)' }}>
              <Link href="/register">Start your community</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-border bg-background/20 px-7 text-base font-semibold text-foreground backdrop-blur-md hover:bg-background/35">
              <Link href="/register">Sign in</Link>
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
