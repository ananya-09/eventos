import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Pricing – Eventos',
  description: 'Simple, transparent pricing for events of all sizes.',
}

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small meetups and workshops',
    price: 'Free',
    features: [
      'Up to 100 attendees',
      'Basic event creation',
      'Email reminders',
      'Attendee list export',
      'Community support',
    ],
  },
  {
    name: 'Professional',
    description: 'For growing organizations',
    price: '$49',
    period: '/month',
    highlighted: true,
    features: [
      'Up to 5,000 attendees',
      'QR code check-in',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      'Event templates',
      'Email & SMS reminders',
      'Attendee management',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large-scale operations',
    price: 'Custom',
    features: [
      'Unlimited attendees',
      'Dedicated account manager',
      'Custom integrations',
      'API access',
      'SSO & advanced security',
      '24/7 support',
      'Compliance features',
      'White-label options',
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Choose the perfect plan for your events. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-8 transition-all ${
                plan.highlighted
                  ? 'border-primary bg-gradient-to-b from-primary/10 to-accent/10 scale-105 md:scale-105'
                  : 'border-border bg-card/30'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </div>

              <Button asChild className="w-full rounded-full mb-8" variant={plan.highlighted ? 'default' : 'outline'}>
                <Link href="/register">
                  Get started
                </Link>
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3 text-sm">
                    <CheckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-8 lg:px-10 lg:py-24">
        <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Frequently asked questions</h2>
        <div className="space-y-6">
          <FAQ
            question="Can I upgrade or downgrade my plan anytime?"
            answer="Yes! You can change your plan at any time. Changes take effect at the start of your next billing cycle."
          />
          <FAQ
            question="Do you offer discounts for annual billing?"
            answer="Yes, we offer 20% off on annual plans. Contact our sales team for more details."
          />
          <FAQ
            question="What's included with the free plan?"
            answer="The Starter plan includes basic event creation, up to 100 attendees, email reminders, and community support."
          />
          <FAQ
            question="Do you offer custom pricing?"
            answer="Yes, for Enterprise plans and large-volume customers, we offer custom pricing. Contact our sales team."
          />
        </div>
      </section>
    </div>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/30 p-6">
      <h3 className="font-semibold text-foreground mb-3">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  )
}
