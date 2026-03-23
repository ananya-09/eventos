'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  /** Rail styling: dark sidebar in light app / light sidebar in dark app */
  variant?: 'default' | 'sidebar'
  className?: string
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  function ThemeToggle({ variant = 'default', className }, ref) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    const sidebarButton =
      'rounded-lg p-2 transition-colors text-zinc-400 hover:bg-white/10 hover:text-white dark:text-gray-500 dark:hover:bg-gray-100 dark:hover:text-gray-900'

    if (!mounted) {
      return (
        <button
          ref={ref}
          type="button"
          className={cn(
            variant === 'sidebar'
              ? sidebarButton
              : 'rounded-md p-2 text-foreground transition-colors hover:bg-accent',
            className,
          )}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5" />
        </button>
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={cn(
          variant === 'sidebar'
            ? sidebarButton
            : 'rounded-md p-2 text-foreground transition-colors hover:bg-accent/50 dark:hover:bg-accent/20',
          className,
        )}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun
            className={cn(
              'h-5 w-5',
              variant === 'sidebar' ? 'text-amber-500' : 'text-yellow-400',
            )}
          />
        ) : (
          <Moon
            className={cn(
              'h-5 w-5',
              variant === 'sidebar' ? 'text-zinc-200' : 'text-slate-700',
            )}
          />
        )}
      </button>
    )
  },
)
