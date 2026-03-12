'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

const navItems = [
  { href: '/', label: 'Home', type: 'route' as const },
  { href: '#about', label: 'About', type: 'anchor' as const },
  { href: '#contact', label: 'Contact', type: 'anchor' as const },
  { href: '/pricing', label: 'Pricing', type: 'route' as const },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (item: (typeof navItems)[number]) => {
    if (item.type === 'anchor') {
      return false
    }
    return pathname === item.href
  }

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav group */}
          <div className="flex items-center gap-8">
            <div className="shrink-0 text-2xl font-semibold tracking-tight text-foreground">
              Eventos
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {navItems.map((item) => {
                const active = isActive(item)
                const baseClasses =
                  'relative text-sm font-medium transition-colors duration-200 px-2 py-1'
                const colorClasses = active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${baseClasses} ${colorClasses} group`}
                  >
                    <span>{item.label}</span>
                    <span
                      className="pointer-events-none absolute inset-x-1 -bottom-1 h-0.5 origin-left scale-x-0 bg-foreground/80 transition-transform duration-200 group-hover:scale-x-100 group-active:scale-x-100"
                    />
                    {active && (
                      <span className="pointer-events-none absolute inset-x-1 -bottom-1 h-0.5 bg-foreground/80" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Theme Toggle and Login Button */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User avatar'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="hidden sm:block text-sm text-foreground">
                  {session.user?.name}
                </span>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signIn('github')}
                className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Login with GitHub
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
