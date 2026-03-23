'use client'

import { useState } from 'react'
import Footer from '@/components/footer'
import { Sidebar } from '@/components/sidebar'
import { cn } from '@/lib/utils'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="min-h-screen">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((v) => !v)}
      />
      <div
        className={cn(
          'flex min-h-screen flex-col transition-[margin-left] duration-300 ease-in-out',
          sidebarExpanded ? 'ml-60' : 'ml-16',
        )}
      >
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
