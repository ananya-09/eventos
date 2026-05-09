'use client'

import { type FormEvent } from 'react'
import { Github, Instagram, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function Contact() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success('Message sent', {
      description: "Thanks for reaching out — we'll get back to you soon.",
    })
  }

  return (
    <section id="contact" className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="contact-intro mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-6xl">
            Get in Touch
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            We&apos;d love to hear from you. Reach out with questions, feedback, or support requests.
          </p>
        </div>

        <div className="contact-panel glass-surface mx-auto mt-12 max-w-5xl rounded-[20px] p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Form */}
            <div>
              <h3 className="text-xl font-bold text-foreground">Send us a message</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill out the form below and we&apos;ll get back to you soon.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="contact-name" className="text-xs font-medium text-muted-foreground">
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    name="name"
                    required
                    placeholder="Your full name"
                    className="h-11 rounded-xl border-border bg-background px-4 text-foreground dark:bg-input/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-xs font-medium text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    className="h-11 rounded-xl border-border bg-background px-4 text-foreground dark:bg-input/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-xs font-medium text-muted-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="min-h-35 resize-y rounded-xl border-border bg-background px-4 py-3 text-foreground dark:bg-input/40"
                  />
                </div>
                <button
                  type="submit"
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                >
                  <Send className="text-lg text-primary-foreground" aria-hidden />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div>
              <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get in touch through any of these channels.
              </p>

              <ul className="mt-8 space-y-8">
                <li className="flex gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground dark:bg-secondary"
                    aria-hidden
                  >
                    <Mail className="text-foreground" style={{ fontSize: '1.375rem' }} />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-foreground">Email</p>
                    <a
                      href="mailto:shauryasrivastav07@gmail.com"
                      className="block text-sm text-foreground underline-offset-2 hover:underline"
                    >
                      shauryasrivastav07@gmail.com
                    </a>
                    <p className="text-xs text-muted-foreground">We&apos;ll respond within 24 hours</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground dark:bg-secondary"
                    aria-hidden
                  >
                    <Phone className="text-foreground" style={{ fontSize: '1.375rem' }} />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-foreground">Phone</p>
                    <a
                      href="tel:+917897426629"
                      className="block text-sm text-foreground underline-offset-2 hover:underline"
                    >
                      +91 78974 26629
                    </a>
                    <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground dark:bg-secondary"
                    aria-hidden
                  >
                    <MapPin className="text-foreground" style={{ fontSize: '1.375rem' }} />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-foreground">Office</p>
                    <p className="text-sm leading-relaxed text-foreground">
                      Madan Mohan Malviya University of Technology
                      <br />
                      Gorakhpur, Uttar Pradesh, India
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-10 border-t border-border pt-8">
                <p className="text-sm font-semibold text-foreground">Follow Us</p>
                <div className="mt-4 flex gap-3">
                  {[
                    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
                    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
                    { icon: Github, label: 'GitHub', href: 'https://github.com' },
                  ].map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground dark:bg-secondary dark:hover:text-foreground"
                    >
                      <Icon className="text-current" style={{ fontSize: '1.25rem' }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
