'use client'

import { HelpCircle, Receipt, Wallet, Mail, ShieldCheck, GraduationCap } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    id: 'item-1',
    icon: HelpCircle,
    question: 'Is there a free trial available?',
    answer:
      "Yes, you can try us for free for 30 days. If you want, we'll provide you with a free 30-minute onboarding call to get you up and running. Book a call here.",
  },
  {
    id: 'item-2',
    icon: Receipt,
    question: 'Can I change my plan later?',
    answer:
      'Absolutely. You can upgrade, downgrade, or switch plans at any time from your billing settings.',
  },
  {
    id: 'item-3',
    icon: ShieldCheck,
    question: 'What is your cancellation policy?',
    answer:
      'You can cancel at any time. Your subscription remains active until the end of the current billing cycle.',
  },
  {
    id: 'item-4',
    icon: Wallet,
    question: 'Can other info be added to an invoice?',
    answer:
      'Yes, add company details like tax ID, billing address, and PO number in your invoice preferences.',
  },
  {
    id: 'item-5',
    icon: Receipt,
    question: 'How does billing work?',
    answer:
      'Billing is automatic based on your selected plan and cycle. Invoices are generated instantly after each payment.',
  },
  {
    id: 'item-6',
    icon: Mail,
    question: 'How do I change my account email?',
    answer:
      'Open account settings, update your email, and confirm through the verification message sent to your inbox.',
  },
  {
    id: 'item-7',
    icon: HelpCircle,
    question: 'How does support work?',
    answer:
      'Support is available via email and in-app chat. Priority response times depend on your active plan.',
  },
  {
    id: 'item-8',
    icon: GraduationCap,
    question: 'Do you provide tutorials?',
    answer:
      'Yes. We provide step-by-step docs, onboarding guides, and practical tutorials to help your team quickly adopt the platform.',
  },
]

export default function ContactFaq() {
  return (
    <section className="contact-faq-section bg-[#f3f4f6] py-16 md:py-24 dark:bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
          Frequently asked questions
        </h2>

        <div className="contact-faq-panel mt-8 rounded-2xl border border-border bg-white p-3 shadow-sm dark:bg-card">
          <Accordion type="single" collapsible>
            {faqs.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-border">
                <AccordionTrigger className="px-2 py-4 text-[15px] font-semibold no-underline hover:no-underline">
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-muted/50">
                      <item.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                    </span>
                    <span>{item.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-12 pb-4 pt-0 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="contact-faq-loadmore mt-6 flex justify-center">
          <Button
            type="button"
            variant="secondary"
            className="h-9 rounded-full bg-zinc-900 px-5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Load more
          </Button>
        </div>

      </div>
    </section>
  )
}
