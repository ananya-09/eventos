"use client"

import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export type TopNavLink = { label: string; href: string }

// Logo & branding section
export function Header() {
  return (
    <Link href="/" className="flex items-center gap-3 text-foreground">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground" style={{ boxShadow: 'var(--shadow-glow)' }}>
        <Sparkles className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="text-[1.05rem] font-bold tracking-tight">Eventos</span>
    </Link>
  )
}

// Navigation menu only
export function NavigationMenu({ links = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact Us', href: '/contact' },
] }: { links?: TopNavLink[] } = {}) {
  return (
    <nav className="hidden items-center gap-10 text-[0.95rem] font-medium text-muted-foreground md:flex">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

// Action buttons
export function NavigationActions() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Button asChild variant="ghost" className="hidden rounded-full px-4 text-sm font-semibold text-foreground hover:bg-background/20 md:inline-flex">
        <Link href="/pricing">Pricing</Link>
      </Button>
      <Button asChild className="rounded-full px-5 text-sm font-semibold" style={{ boxShadow: 'var(--shadow-elegant)' }}>
        <Link href="/login" className="inline-flex items-center gap-2">
          Get started
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

// Combined navigation bar (default export for backward compatibility)
export default function Navigation({ links = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact Us', href: '/contact' },
] }: { links?: TopNavLink[] } = {}) {
  return (
    <header
      className="w-full px-4 py-3 sm:px-8 lg:px-10 animate-in slide-in-from-top fade-in duration-500"
      style={{ boxShadow: 'inset 0 -1px 0 rgba(59, 130, 246, 0.28), 0 10px 22px -18px rgba(59, 130, 246, 0.65)' }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between">
        <nav className="flex items-center justify-between gap-6">
          <Header />
          <NavigationMenu links={links} />
          <NavigationActions />
        </nav>
      </div>
    </header>
  )
}

