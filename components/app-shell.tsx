'use client'

import { useState } from 'react'
import { PanelLeft } from 'lucide-react'
import Footer from '@/components/footer'
import GetStartedSection from '@/components/get-started-section'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="min-h-screen">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setSidebarExpanded((v) => !v)}
        className="fixed left-3 top-3 z-30 h-9 w-9 md:hidden"
        aria-label="Toggle menu"
      >
        <PanelLeft className="h-5 w-5" strokeWidth={1.8} />
      </Button>

      {sidebarExpanded && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarExpanded(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((v) => !v)}
      />
      <div
        className={cn(
          'flex min-h-screen flex-col transition-[margin-left] duration-300 ease-in-out',
          sidebarExpanded ? 'ml-0 md:ml-60' : 'ml-0 md:ml-16',
        )}
      >
        <main className="flex-1">{children}</main>
        <GetStartedSection />
        <Footer />
      </div>
    </div>
  )
}
