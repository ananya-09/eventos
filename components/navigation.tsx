"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, User, LogOut, CreditCard } from 'lucide-react'
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
  { label: 'Communities', href: '/communities' },
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

import { useSession, signOut } from 'next-auth/react'
import NotificationDropdown from '@/components/notification-dropdown'

function UserDropdown() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!session || !session.user) return null

  const user = session.user
  const avatarUrl = user.image
  const initial = user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "?")

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-0.5 rounded-full transition-all focus:outline-none cursor-pointer ring-2 ${
          isOpen
            ? 'ring-[#34629f] dark:ring-sky-400'
            : 'ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600'
        }`}
        aria-label="User menu"
      >
        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={user.name || "Avatar"}
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#34629f] to-blue-600 flex items-center justify-center text-white font-bold text-xs select-none">
              {initial}
            </div>
          )}
        </div>
      </button>

      {/* Dropdown Menu — animates out from avatar origin */}
      <div
        style={{
          transformOrigin: 'top right',
          transition: 'opacity 180ms ease, transform 180ms ease',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(-6px)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 text-xs text-slate-700 dark:text-slate-200"
      >
        {/* User Details */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
          <div className="relative h-9 w-9 rounded-full overflow-hidden shrink-0 bg-slate-100">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={user.name || 'Avatar'} fill className="object-cover" sizes="36px" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#34629f] to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                {initial}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <span className="block font-bold text-slate-900 dark:text-white truncate text-[13px]">{user.name || 'User'}</span>
            <span className="block text-[10px] text-slate-400 dark:text-slate-400 truncate">{user.email}</span>
          </div>
        </div>

        {/* Profile link */}
        <Link
          href="/profile"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <User className="w-4 h-4 text-slate-400" />
          Profile
        </Link>

        {/* Pricing link */}
        <Link
          href="/pricing"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 font-semibold transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-slate-400" />
          Pricing
        </Link>

        {/* Divider */}
        <div className="my-1 border-t border-slate-100 dark:border-slate-800/60" />

        {/* Sign Out */}
        <button
          onClick={() => { setIsOpen(false); signOut() }}
          className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold text-rose-500 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  )
}

// Action buttons
export function NavigationActions() {
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />

      {session && <NotificationDropdown />}

      {!session && (
        <Button asChild variant="ghost" className="hidden rounded-full px-4 text-sm font-semibold text-foreground hover:bg-background/20 md:inline-flex">
          <Link href="/pricing">Pricing</Link>
        </Button>
      )}

      {session ? (
        <UserDropdown />
      ) : (
        <Button asChild className="rounded-full px-5 text-sm font-semibold" style={{ boxShadow: 'var(--shadow-elegant)' }}>
          <Link href="/login" className="inline-flex items-center gap-2">
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  )
}

// Combined navigation bar (default export for backward compatibility)
export default function Navigation({ links = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Communities', href: '/communities' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact Us', href: '/contact' },
] }: { links?: TopNavLink[] } = {}) {
  return (
    <header
      className="relative z-50 w-full px-4 py-3 sm:px-8 lg:px-10 animate-in slide-in-from-top fade-in duration-500"
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

