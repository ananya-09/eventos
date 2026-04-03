'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  /** Rail styling: dark sidebar in light app / light sidebar in dark app */
  variant?: 'default' | 'sidebar'
  className?: string
  /**
   * When true, render "Light mode" / "Dark mode" text next to the icon.
   * Use this only inside the expanded sidebar.
   */
  showLabel?: boolean
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  function ThemeToggle({ variant = 'default', className, showLabel = false }, ref) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    const sidebarButtonIconOnly =
      'rounded-lg p-2 transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'

    const sidebarButtonWithLabel =
      'rounded-lg px-3 py-2 flex items-center gap-2 transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'

    if (!mounted) {
      const label = theme === 'dark' ? 'Light' : 'Dark'
      return (
        <button
          ref={ref}
          type="button"
          className={cn(
            variant === 'sidebar'
              ? showLabel
                ? sidebarButtonWithLabel
                : sidebarButtonIconOnly
              : 'rounded-md p-2 text-foreground transition-colors hover:bg-accent',
            className,
          )}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5" />
          {showLabel && <span className="text-sm font-medium tracking-tight text-sidebar-foreground">{label}</span>}
        </button>
      )
    }

    const label = theme === 'dark' ? 'Light' : 'Dark'

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={cn(
          variant === 'sidebar'
            ? showLabel
              ? sidebarButtonWithLabel
              : sidebarButtonIconOnly
            : 'rounded-md p-2 text-foreground transition-colors hover:bg-accent/50 dark:hover:bg-accent/20',
          className,
        )}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun
            className={cn(
              'h-5 w-5',
              variant === 'sidebar' ? 'text-primary' : 'text-primary',
            )}
          />
        ) : (
          <Moon
            className={cn(
              'h-5 w-5',
              variant === 'sidebar' ? 'text-sidebar-foreground' : 'text-accent',
            )}
          />
        )}
        {showLabel && (
          <span className="text-sm font-medium tracking-tight text-sidebar-foreground">
            {label}
          </span>
        )}
      </button>
    )
  },
)
