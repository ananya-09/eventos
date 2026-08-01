'use client'

import { motion } from 'framer-motion'
import { Activity, TrendingUp, Users, CheckCircle2, DollarSign, Bell, ShieldCheck, Ticket } from 'lucide-react'

export default function LoginVisualPanel() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#070b13] px-12 pb-12 pt-24 text-white">
      {/* ─── Ambient Glow System ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Glow Orb 1 - Amber */}
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 50, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -left-10 top-1/4 h-96 w-96 rounded-full bg-[#f59e0b]/15 blur-[100px]"
        />

        {/* Glow Orb 2 - Rose */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -right-10 top-1/3 h-96 w-96 rounded-full bg-[#f43f5e]/15 blur-[100px]"
        />

        {/* Glow Orb 3 - Indigo */}
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 30, 60, 0],
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
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3.5 py-1 text-xs font-medium text-[#fbbf24] backdrop-blur-md">
          <Activity className="w-3.5 h-3.5 text-[#fbbf24] animate-pulse" />
          <span>Control Center Active</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Your events, streamlined.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-slate-400">
          Access your real-time analytics dashboard, monitor registration sales, and coordinate check-ins with your operations team.
        </p>
      </div>

      {/* ─── Floating UI Interactive Mockups ─── */}
      <div className="relative z-10 my-auto flex h-[340px] w-full items-center justify-center">
        
        {/* Mockup 1: Analytics & Revenue Glassmorphic Card (Center Front) */}
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
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-2xs font-semibold text-amber-400 border border-amber-500/20 uppercase tracking-wider flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Live Revenue
              </span>
              <span className="text-2xs text-slate-400 font-medium">May Dashboard</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-4xs text-slate-400 uppercase tracking-wider font-semibold">Total Ticket Sales</span>
              <div className="flex items-baseline gap-2">
                <h3 className="font-bold text-2xl text-white tracking-tight">$48,250.00</h3>
                <span className="text-2xs font-medium text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  +12.3%
                </span>
              </div>
            </div>

            {/* Sparkline Custom Animated Graph */}
            <div className="relative h-16 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-glow-login" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0,22 C10,22 15,12 25,18 C35,24 45,5 55,10 C65,15 75,2 85,15 L100,5"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.path
                  d="M0,22 C10,22 15,12 25,18 C35,24 45,5 55,10 C65,15 75,2 85,15 L100,5 L100,30 L0,30 Z"
                  fill="url(#chart-glow-login)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </svg>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-slate-400 text-3xs">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-amber-400" />
                412 active buyers
              </span>
              <span>Updated 1m ago</span>
            </div>
          </div>
        </motion.div>

        {/* Mockup 2: Live Activity Feed (Top-Left Offset) */}
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
          className="absolute z-20 w-[230px] rounded-xl border border-white/5 bg-slate-950/70 p-3.5 shadow-xl backdrop-blur-md"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-4xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                <Bell className="w-2.5 h-2.5 text-[#f43f5e]" />
                Recent Logs
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded bg-emerald-500/20 flex items-center justify-center text-4xs font-bold text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-4xs font-semibold text-white truncate">Staff check-in #210</p>
                  <p className="text-5xs text-slate-400">Jane K. • 12s ago</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded bg-indigo-500/20 flex items-center justify-center text-4xs font-bold text-indigo-400 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-4xs font-semibold text-white truncate">Payout complete</p>
                  <p className="text-5xs text-slate-400">Stripe Sync • 2m ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mockup 3: Check-in Radial Progress Card (Bottom-Right Offset) */}
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
          className="absolute z-20 w-[210px] rounded-xl border border-white/5 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            {/* Custom SVG Radial Progress */}
            <div className="relative w-12 h-12 shrink-0">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#f43f5e"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 20}
                  initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - 0.84) }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xs font-bold text-white">84%</span>
              </div>
            </div>

            <div className="space-y-0.5 min-w-0">
              <span className="text-5xs text-slate-400 font-semibold tracking-wider uppercase block">Scanner Link</span>
              <h4 className="text-3xs font-bold text-white tracking-tight truncate flex items-center gap-1">
                <Ticket className="w-3 h-3 text-red-400" />
                Live Check-in
              </h4>
              <p className="text-4xs text-slate-400">312 / 370 scanned</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Footer Stats / Microcopy ─── */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-6 text-slate-500 text-xs">
        <div className="flex items-center gap-1.5 text-2xs">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All operational gateways active</span>
        </div>
        <span className="text-3xs font-medium uppercase tracking-widest">Eventos Core</span>
      </div>
    </div>
  )
}
