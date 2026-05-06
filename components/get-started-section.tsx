'use client'

import { Button } from '@/components/ui/button'

export default function GetStartedSection() {
  return (
    <section className="get-started-section mt-20 px-4 py-14 text-center sm:px-6 md:py-16 lg:px-8">
      <h3 className="text-3xl font-bold tracking-tight text-foreground">Ready to level up your business?</h3>
      <p className="mt-3 text-base text-muted-foreground">Start your 30-day free trial. Cancel anytime.</p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-full border-border bg-white px-5 text-sm font-semibold hover:bg-muted dark:bg-card"
        >
          View demo
        </Button>
        <Button
          type="button"
          className="h-10 rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Get started
        </Button>
      </div>
    </section>
  )
}