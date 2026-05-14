'use client'

import { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { LucideIcon } from 'lucide-react'
import {
  Home,
  Calendar,
  Users,
  MessagesSquare,
  Settings,
  PanelLeft,
  Headset,
  LogIn,
  LogOut,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

export type MenuItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const menuItems: MenuItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Schedule', href: '/schedule', icon: Clock },
  { label: 'Attendees', href:'#', icon: Users },
  { label: 'Pricing', href: '/pricing', icon: MessagesSquare },
  { label: 'Settings', href: '/register', icon: Settings },
]

function routeActive(pathname: string, hash: string, href: string): boolean {
  if (href === '/') return pathname === '/' && (!hash || hash === '#')
  if (href.startsWith('/#')) return pathname === '/' && hash === href.slice(1)
  return pathname === href
}

export type SidebarProps = {
  expanded: boolean
  onToggle: () => void
  style?: React.CSSProperties
}

const rail = {
  aside:
    'rounded-3xl border-border bg-card/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-[width,transform] duration-300 ease-in-out dark:shadow-[0_24px_58px_-34px_rgba(6,8,24,0.85)]',
  headerBorder: 'border-border',
  footerBorder: 'border-border',
  logoText: 'text-foreground',
  muted: 'text-muted-foreground',
  navInactive:
    'text-foreground/60 hover:bg-card/70 hover:text-foreground',
  navActive:
    'bg-primary text-primary-foreground shadow-[0_14px_32px_-20px_rgba(74,71,246,0.8)]',
  navActiveCollapsed: 'bg-primary text-primary-foreground',
  toggleIdle:
    'text-foreground/60 hover:bg-card/70 hover:text-foreground',
  tooltip: 'glass-surface text-foreground',
  tooltipArrow: 'fill-card',
}

function NavRow({
  expanded,
  active,
  href,
  scroll,
  onClick,
  icon: Icon,
  label,
}: {
  expanded: boolean
  active: boolean
  href: string
  scroll?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  icon: LucideIcon
  label: string
}) {
  return (
    <Link
      href={href}
      scroll={scroll}
      onClick={onClick}
      className={cn(
        'group relative flex min-h-11 w-full items-center rounded-md text-sm font-medium transition-colors duration-200',
        expanded ? 'justify-start gap-3 rounded-xl px-3 py-3' : 'justify-center rounded-xl px-0 py-3',
        active ? rail.navActive : rail.navInactive,
        active && !expanded && rail.navActiveCollapsed,
        active &&
          !expanded &&
          'before:pointer-events-none before:absolute before:left-0 before:top-1/2 before:h-8 before:w-0.75 before:-translate-y-1/2 before:rounded-r-sm before:bg-foreground',
      )}
    >
      <Icon
        className={cn(
          'h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-hover:scale-105',
          active ? 'text-current' : '',
        )}
        strokeWidth={1.5}
        aria-hidden
      />
      <span
        className={cn(
          'select-none truncate transition-[opacity,margin,width] duration-300 ease-in-out',
          expanded ? 'ml-0 max-w-44 opacity-100' : 'ml-0 w-0 max-w-0 overflow-hidden opacity-0',
        )}
      >
        {label}
      </span>
    </Link>
  )
}

export function Sidebar({ expanded, onToggle, style }: SidebarProps) {
  const pathname = usePathname()
  const [hash, setHash] = useState('')
  const { data: session } = useSession()

  useEffect(() => {
    setHash(window.location.hash)
  }, [pathname])

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function wrapCollapsedTooltip(key: string, label: string, node: React.ReactElement) {
    if (expanded) {
      return <Fragment key={key}>{node}</Fragment>
    }
    return (
      <TooltipPrimitive.Root key={key}>
        <TooltipPrimitive.Trigger asChild>{node}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="right"
            sideOffset={10}
            className={cn(
              'z-50 rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md',
              rail.tooltip,
              'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
            )}
          >
            {label}
            <TooltipPrimitive.Arrow className={rail.tooltipArrow} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    )
  }

  const supportActive = pathname === '/contact'

  const supportLink = (
    <NavRow
      expanded={expanded}
      active={supportActive}
      href="/contact"
      icon={Headset}
      label="Support"
    />
  )

  const toggleButton = (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls="sidebar-nav"
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
        rail.toggleIdle,
      )}
    >
      <PanelLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden />
      <span className="sr-only">Toggle sidebar</span>
    </button>
  )

  return (
    <TooltipPrimitive.Provider delayDuration={200} skipDelayDuration={0}>
      <aside
        style={style}
        className={cn(
          'fixed left-3 top-3 z-40 flex h-[calc(100vh-1.5rem)] w-60 flex-col transition-transform duration-300 ease-in-out md:left-4 md:top-4 md:z-20 md:h-[calc(100vh-2rem)] md:w-auto md:shrink-0 md:transition-[width]',
          rail.aside,
          expanded ? 'translate-x-0 md:w-60' : '-translate-x-full md:translate-x-0 md:w-16',
        )}
        aria-label="Main navigation"
      >
        {!expanded && (
          <div
            className={cn(
              'flex h-12 shrink-0 items-center justify-center border-b',
              rail.headerBorder,
            )}
          >
            {wrapCollapsedTooltip(
              'collapsed-toggle',
              'Expand menu',
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                aria-controls="sidebar-nav"
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
                  rail.toggleIdle,
                )}
              >
                <PanelLeft
                  className="h-5 w-5 text-foreground"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span className="sr-only">Expand menu</span>
              </button>,
            )}
          </div>
        )}

        {expanded && (
          <div
            className={cn(
              'flex h-14 shrink-0 items-center border-b',
              rail.headerBorder,
              'justify-between gap-2 px-3',
            )}
          >
            <span
              className={cn(
                'min-w-0 truncate text-sm font-medium tracking-tight',
                rail.logoText,
              )}
            >
              Eventos
            </span>
            {wrapCollapsedTooltip('toggle', 'Collapse menu', toggleButton)}
          </div>
        )}

        <nav
          id="sidebar-nav"
          className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-2 py-2"
        >
          {menuItems.map((item) => {
            const active = routeActive(pathname, hash, item.href)
            const row = (
              <NavRow
                expanded={expanded}
                active={active}
                href={item.href}
                scroll={item.href.startsWith('/#') ? false : undefined}
                icon={item.icon}
                label={item.label}
              />
            )
            return wrapCollapsedTooltip(item.href, item.label, row)
          })}
        </nav>

        <div
          className={cn(
            'mt-auto flex flex-col gap-2 border-t px-2 py-3',
            rail.footerBorder,
          )}
        >
          {wrapCollapsedTooltip('support', 'Support', supportLink)}

          {wrapCollapsedTooltip(
            'theme',
            'Theme',
            <ThemeToggle
              variant="sidebar"
              showLabel={expanded}
              className={cn(!expanded && 'mx-auto')}
            />,
          )}

          {session ? (
            <>
              {expanded && (
                <div className="flex w-full items-center gap-2 rounded-md px-1 py-1">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user?.name ?? 'User'}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  )}
                  <span
                    className={cn(
                      'min-w-0 flex-1 truncate text-xs font-medium',
                      rail.muted,
                    )}
                  >
                    {session.user?.name}
                  </span>
                </div>
              )}
              {wrapCollapsedTooltip(
                'logout',
                'Log out',
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className={cn(
                    'h-10 w-full justify-center gap-2 rounded-md border-border bg-card font-medium text-foreground hover:bg-card/80',
                    !expanded && 'w-10 px-0',
                  )}
                >
                  <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                  {expanded && <span>Log out</span>}
                </Button>,
              )}
            </>
          ) : (
            wrapCollapsedTooltip(
              'login',
              'Login with GitHub',
              <Button
                type="button"
                size="sm"
                onClick={() => signIn('github')}
                className={cn(
                  'h-10 w-full gap-2 rounded-md border-border bg-card/60 font-medium text-foreground hover:bg-card/80',
                  !expanded && 'w-10 px-0',
                )}
              >
                <LogIn className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                {expanded && <span className="truncate">Login</span>}
              </Button>,
            )
          )}
        </div>
      </aside>
    </TooltipPrimitive.Provider>
  )
}
