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
    const { theme, resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    const sidebarButtonIconOnly =
      'rounded-lg p-2 transition-colors text-muted-foreground hover:bg-card/70 hover:text-foreground'

    const sidebarButtonWithLabel =
      'rounded-lg px-3 py-2 flex items-center gap-2 transition-colors text-muted-foreground hover:bg-card/70 hover:text-foreground'

    if (!mounted) {
      const label = 'Dark'
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
          {showLabel && <span className={cn("text-sm font-medium tracking-tight", "text-foreground")}>{label}</span>}
        </button>
      )
    }

    const activeTheme = resolvedTheme ?? theme
    const isDark = activeTheme === 'dark'
    const label = isDark ? 'Light' : 'Dark'

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={cn(
          variant === 'sidebar'
            ? showLabel
              ? sidebarButtonWithLabel
              : sidebarButtonIconOnly
            : 'rounded-md p-2 text-foreground bg-primary transition-colors hover:bg-accent/50 dark:hover:bg-accent/20',
          className,
        )}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun
            className={cn(
              'h-5 w-5',
              variant === 'sidebar' ? 'text-muted-foreground' : 'text-white', 
            )}
          />
        ) : (
          <Moon
            className={cn(
              'h-5 w-5',
              variant === 'sidebar' ? 'text-muted-foreground' : 'text-white',
            )}
          />
        )}
        {showLabel && (
          <span className={cn(
            "text-sm font-medium tracking-tight",
            variant === 'sidebar' ? "text-stone-700 dark:text-slate-300" : "text-zinc-200 dark:text-zinc-100"
          )}>
            {label}
          </span>
        )}
      </button>
    )
  },
)
