'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { PanelLeft } from 'lucide-react'
import Footer from '@/components/footer'
import GetStartedSection from '@/components/get-started-section'
import SaaSGridBackground from '@/components/saas-grid-background'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [sidebarOpacity, setSidebarOpacity] = useState(1)
  const footerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isHome = pathname === '/'

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
      {!isHome && (
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
      )}

      {!isHome && sidebarExpanded && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarExpanded(false)}
          className="fixed inset-0 z-30 bg-linear-to-br from-background/75 via-primary/12 to-background/75 backdrop-blur-sm md:hidden"
        />
      )}

      {!isHome && (
        <Sidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((v) => !v)}
          style={{
            opacity: sidebarOpacity,
            pointerEvents: sidebarOpacity < 0.1 ? 'none' : 'auto',
            transition:
              'opacity 0.1s ease-out, transform 300ms ease-in-out, width 300ms ease-in-out',
          }}
        />
      )}
      
      <SaaSGridBackground
        className={cn(
          'flex-1 min-w-0 transition-[padding-left] duration-300 ease-in-out',
          !isHome && (sidebarExpanded ? 'md:pl-70' : 'md:pl-26'),
        )}
      >
        {isHome ? (
          children
        ) : (
          <div className="flex flex-col h-full px-4 pt-16 md:pr-6 md:pt-4 pb-12">
            <main className="flex-1">{children}</main>
            <GetStartedSection />
          </div>
        )}
      </SaaSGridBackground>

      <div ref={footerRef} className="w-full">
        <Footer />
      </div>
    </div>
  )
}
