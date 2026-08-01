'use client'

import { motion } from 'framer-motion'
import { Sparkles, Users, Calendar, MapPin, MessageSquare, Ticket, Award } from 'lucide-react'
import Image from 'next/image'

export default function RegisterVisualPanel() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#070b13] px-12 pb-12 pt-24 text-white">
      {/* ─── Ambient Glow System ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glow Orb 1 - Cyan */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -left-10 top-1/4 h-96 w-96 rounded-full bg-[#14b8a6]/15 blur-[100px]"
        />

        {/* Glow Orb 2 - Blue */}
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 60, -40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -right-10 top-1/3 h-96 w-96 rounded-full bg-[#3b82f6]/15 blur-[100px]"
        />

        {/* Glow Orb 3 - Violet */}
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, 40, 50, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-1/3 bottom-10 h-80 w-80 rounded-full bg-[#6366f1]/15 blur-[90px]"
        />

        {/* Dark Diagonal Grid Mesh overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* ─── Brand Tagline ─── */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-3.5 py-1 text-xs font-medium text-[#818cf8] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Experience Unleashed</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Start your event journey.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-slate-400">
          Unlock immersive registrations, collaborate with industry leaders, and build interactive event spaces tailored for your community.
        </p>
      </div>

      {/* ─── Floating UI Interactive Mockups ─── */}
      <div className="relative z-10 my-auto flex h-[340px] w-full items-center justify-center">
        
        {/* Mockup 1: Primary Event Glassmorphic Card (Center Front) */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: [0, -10, 0],
            scale: 1
          }}
          transition={{
            y: {
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            default: { duration: 0.8, delay: 0.2 }
          }}
          className="absolute z-30 w-[340px] rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-2xl backdrop-blur-xl"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-2xs font-semibold text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                Active Event
              </span>
              <span className="text-2xs text-slate-400 font-medium">Eventos Tech</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-white">Next-Gen Developers Keynote</h3>
              <p className="text-2xs text-slate-400 leading-normal">
                An immersive workshop focusing on framer-motion, state machines, and SaaS aesthetics.
              </p>
            </div>

            <div className="space-y-2 border-t border-white/5 pt-3">
              <div className="flex items-center gap-2 text-2xs text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>May 25, 2026 • 6:00 PM IST</span>
              </div>
              <div className="flex items-center gap-2 text-2xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Virtual & In-person (Delhi)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex -space-x-2 overflow-hidden">
                {['/placeholder-user.jpg', '/placeholder-user.jpg', '/placeholder-user.jpg'].map((_, i) => (
                  <div 
                    key={i} 
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-3xs font-bold text-white border border-white/15"
                  >
                    {i === 0 ? 'S' : i === 1 ? 'A' : 'M'}
                  </div>
                ))}
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 ring-2 ring-slate-900 text-3xs font-semibold text-white border border-indigo-400/20">
                  +12k
                </div>
              </div>
              <span className="text-3xs font-medium text-emerald-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                12,482 Registered
              </span>
            </div>
          </div>
        </motion.div>

        {/* Mockup 2: Community Channel Snippet (Top-Left Offset) */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: -20 }}
          animate={{ 
            opacity: 1, 
            x: -120, 
            y: [-40, -50, -40] 
          }}
          transition={{
            y: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            },
            default: { duration: 0.8, delay: 0.4 }
          }}
          className="absolute z-20 w-[240px] rounded-xl border border-white/5 bg-slate-950/70 p-3.5 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <div className="h-7 w-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-2xs font-bold text-indigo-400 shrink-0">
              DP
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-3xs font-bold text-white">Design Pioneers</p>
                <MessageSquare className="w-3 h-3 text-slate-500" />
              </div>
              <p className="text-4xs text-slate-300 leading-relaxed font-normal italic">
                &ldquo;Just registered for Eventos Workshop. Stoked!&rdquo;
              </p>
              <p className="text-5xs text-slate-500 text-right">Sarah J. • 2m ago</p>
            </div>
          </div>
        </motion.div>

        {/* Mockup 3: Premium Ticket Pass (Bottom-Right Offset) */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: 40 }}
          animate={{ 
            opacity: 1, 
            x: 130, 
            y: [55, 45, 55] 
          }}
          transition={{
            y: {
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            },
            default: { duration: 0.8, delay: 0.6 }
          }}
          className="absolute z-20 w-[220px] rounded-xl border border-[#3b82f6]/20 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Ticket className="w-4 h-4 text-blue-400" />
              <Award className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-0.5">
              <p className="text-4xs text-slate-400 font-semibold tracking-wider uppercase">Participant Access</p>
              <h4 className="text-3xs font-bold text-white tracking-tight">Developer VIP Pass</h4>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2">
              <div>
                <p className="text-5xs text-slate-500">ID CODE</p>
                <p className="text-4xs font-mono text-slate-300">#EVT-2026-928</p>
              </div>
              {/* Mini mock QR code */}
              <div className="h-6 w-6 bg-white p-0.5 rounded flex flex-wrap gap-0.5 shrink-0 opacity-80">
                <div className="w-2.5 h-2.5 bg-black" />
                <div className="w-2.5 h-2.5 bg-black" />
                <div className="w-2.5 h-2.5 bg-black" />
                <div className="w-2.5 h-2.5 bg-black" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Footer Stats / Microcopy ─── */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-6 text-slate-500 text-xs">
        <div className="flex items-center gap-1.5 text-2xs">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active dashboard session syncing</span>
        </div>
        <span className="text-3xs font-medium uppercase tracking-widest">Eventos Platform</span>
      </div>
    </div>
  )
}
