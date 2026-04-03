'use client'

import { useState } from 'react'
import { PanelLeft } from 'lucide-react'
import Footer from '@/components/footer'
import GetStartedSection from '@/components/get-started-section'
import SaaSGridBackground from '@/components/saas-grid-background'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden">
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

      {sidebarExpanded && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarExpanded(false)}
          className="fixed inset-0 z-30 bg-linear-to-br from-background/75 via-primary/12 to-background/75 backdrop-blur-sm md:hidden"
        />
      )}

      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((v) => !v)}
      />
      <SaaSGridBackground
        className={cn(
          'min-h-screen min-w-0 transition-[padding-left] duration-300 ease-in-out',
          sidebarExpanded ? 'md:pl-60' : 'md:pl-16',
        )}
      >
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <GetStartedSection />
          <Footer />
        </div>
      </SaaSGridBackground>
    </div>
  )
}
