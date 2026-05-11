'use client'

import { useState, useEffect, useRef } from 'react'
import { PanelLeft } from 'lucide-react'
import Footer from '@/components/footer'
import SaaSGridBackground from '@/components/ui/saas-grid-background'
import Navigation from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [sidebarOpacity, setSidebarOpacity] = useState(1)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        let ratio = entry.intersectionRatio
        if (ratio > 0.4) ratio = 0.4
        const opacity = 1 - ratio / 0.4
        setSidebarOpacity(opacity)
      },
      {
        root: null,
        threshold: Array.from({ length: 101 }, (_, i) => i * 0.01),
      }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      <Navigation />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setSidebarExpanded((v) => !v)}
        className="glass-surface fixed left-3 top-3 z-30 h-9 w-9 md:hidden"
        aria-label="Toggle menu"
      >
        <PanelLeft className="h-5 w-5" strokeWidth={1.8} />
      </Button>

      <SaaSGridBackground
        className={cn(
          'flex-1 min-w-0 transition-[padding-left] duration-300 ease-in-out'
        )}
      >
        <main className="relative z-10 flex min-h-screen flex-col">
          {children}

          <div ref={footerRef} className="w-full">
            <Footer />
          </div>
        </main>
      </SaaSGridBackground>

    </div>
  )
}
