'use client'

import { Button } from '@/components/ui/button'

export default function GetStartedSection() {
  return (
    <section className="get-started-section mt-10 w-full border-y border-white/10 bg-transparent backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-5 px-4 py-6 text-center sm:px-6 md:py-7 lg:flex-row lg:gap-8 lg:px-8 lg:text-left">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Ready to level up your business?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Start your 30-day free trial. Cancel anytime.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:mt-0 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full border-white/25 bg-white/5 px-5 text-sm font-semibold text-foreground backdrop-blur-md hover:bg-white/10"
          >
            View demo
          </Button>
          <Button
            type="button"
            className="h-10 rounded-full bg-primary/85 px-5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary"
          >
            Get started
          </Button>
        </div>
      </div>
    </section>
  )
}