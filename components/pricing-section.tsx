'use client'

import { useState, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { Button } from '@/components/ui/button'

const planDefinitions = [
  {
    name: 'Basic',
    description: 'Perfect for individuals and small projects',
    highlight: false,
    listTitle: "What's included:",
    features: ['Up to 5 team members', '10GB storage space', 'Basic analytics'],
    monthlyPrice: '$29',
    yearlyPrice: '$290',
  },
  {
    name: 'Standard',
    description: 'Ideal for growing teams and businesses',
    highlight: false,
    listTitle: 'Everything in Basic, plus:',
    features: ['Up to 20 team members', '50GB storage space', 'Advanced analytics', 'Priority support'],
    monthlyPrice: '$49',
    yearlyPrice: '$490',
  },
  {
    name: 'Enterprise',
    description: 'For large enterprises and advanced needs',
    highlight: true,
    listTitle: 'Everything in Standard, plus:',
    features: [
      'Unlimited team members',
      '250GB storage space',
      'Custom analytics',
      '24/7 premium support',
      'White-labelling',
    ],
    monthlyPrice: '$99',
    yearlyPrice: '$990',
  },
]

export default function PricingSection() {
  const [selectedIndex, setSelectedIndex] = useState(2)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const plans = planDefinitions.map((plan) => ({
    ...plan,
    price: billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice,
    priceSuffix: billingPeriod === 'monthly' ? '/month' : '/year',
  }))

  const cardsRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!cardsRef.current) return

    const ctx = gsap.context(() => {
      const items = Array.from(cardsRef.current!.children)

      gsap.fromTo(
        items,
        { y: 24, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.06,
        },
      )
    }, cardsRef)

    return () => ctx.revert()
  }, [billingPeriod])

  return (
    <section className="w-full bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center pricing-header">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Pricing Section
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
            Choose your plan
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
            Add a concise value statement that addresses price sensitivity and showcases plan flexibility while
            keeping it under two lines.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-8 flex w-full flex-col items-stretch gap-2 rounded-3xl border border-border/70 bg-muted p-1 text-[11px] font-medium text-muted-foreground shadow-sm sm:inline-flex sm:w-auto sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:px-1 sm:py-1">
          <button
            type="button"
            onClick={() => setBillingPeriod('monthly')}
            className={[
              'flex-1 rounded-full px-5 py-2 uppercase tracking-[0.18em] transition-all whitespace-nowrap',
              billingPeriod === 'monthly'
                ? 'bg-card text-foreground shadow-sm'
                : 'bg-transparent text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() => setBillingPeriod('yearly')}
            className={[
              'flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 uppercase tracking-[0.18em] transition-all whitespace-nowrap',
              billingPeriod === 'yearly'
                ? 'bg-card text-foreground shadow-sm'
                : 'bg-transparent text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            <span>Annually</span>
            <span
              className={[
                'rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors whitespace-nowrap',
                billingPeriod === 'yearly'
                  ? 'bg-secondary text-foreground'
                  : 'border border-emerald-500 text-emerald-600 dark:text-emerald-400',
              ].join(' ')}
            >
              Save 20%
            </span>
          </button>
        </div>

        {/* Cards */}
        <div key={billingPeriod} ref={cardsRef} className="mt-12 grid w-full gap-6 lg:grid-cols-3 md:grid-cols-2">
          {plans.map((plan, index) => {
            const isSelected = index === selectedIndex

            const baseCard =
              'flex flex-col rounded-[26px] border p-6 shadow-sm transition-transform duration-200 md:p-7 cursor-pointer'

            const colorClasses = isSelected
              ? 'border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-[1.01]'
              : 'border-border bg-card text-foreground shadow-sm'

            return (
              <div
                key={plan.name}
                onClick={() => setSelectedIndex(index)}
                className={[baseCard, colorClasses].join(' ')}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedIndex(index)
                  }
                }}
              >
                <h3 className="text-sm font-semibold tracking-tight">{plan.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight sm:text-5xl">{plan.price}</span>
                  <span className="text-xs text-muted-foreground">{plan.priceSuffix}</span>
                </div>
                <Button
                  variant="outline"
                  className={[
                    'mt-6 w-full justify-center rounded-full text-sm font-medium',
                    isSelected
                      ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-transparent'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 border-transparent',
                  ].join(' ')}
                >
                  Purchase plan
                </Button>
                <div className="mt-6 border-t border-border/60 pt-4 text-xs">
                  <p className="mb-3 font-medium text-foreground">{plan.listTitle}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center justify-between gap-2 text-[13px] text-muted-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground text-[10px]">
                            ✓
                          </span>
                          <span>{feature}</span>
                        </span>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground text-[10px]">
                          i
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

