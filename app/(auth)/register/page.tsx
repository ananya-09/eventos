'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import SaaSGridBackground from '@/components/ui/saas-grid-background'
import { RegistrationWizard } from '@/components/ui/registration-wizard'
import RegisterVisualPanel from './components/register-visual-panel'

export default function RegisterPage() {
  return (
    <main className="relative grid h-screen w-full lg:grid-cols-[1.1fr_0.9fr] overflow-hidden">
      {/* Top Left Floating Home Link */}
      <div className="absolute left-4 top-4 z-30 sm:left-6 sm:top-6">
        <Link
          href="/"
          className="group relative px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 lg:text-white/90 hover:text-white lg:hover:text-white transition-colors duration-300 flex items-center gap-1.5 overflow-hidden rounded-full"
        >
          <span className="absolute inset-0 z-0 bg-black/80 dark:bg-black/90 lg:bg-black/60 rounded-full scale-0 transition-transform duration-300 ease-out group-hover:scale-100" />
          <span className="relative z-10 flex items-center gap-1.5">
            ← Go to Home
          </span>
        </Link>
      </div>

      {/* ─── Immersive Left Visual Onboarding Panel ─── */}
      <section className="relative hidden lg:block h-full overflow-hidden">
        <RegisterVisualPanel />
      </section>

      {/* Form Onboarding Section ─── */}
      <section className="relative flex h-full flex-col items-center justify-center overflow-y-auto bg-background px-4 py-8 sm:px-6 lg:px-12">
        {/* Decorative Grid Mesh Background */}
        <SaaSGridBackground
          className="pointer-events-none absolute inset-0 min-h-full!"
          seed="register-onboarding-section"
          squaresCount={6}
          gridSize={48}
        />

        {/* Central Glassmorphic Form Card Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 18,
            duration: 0.8,
          }}
          className="relative z-10 w-full max-w-md rounded-2xl border border-border/80 bg-background/25 shadow-2xl p-6 sm:p-8 backdrop-blur-xl"
        >
          {/* Brand header */}
          <div className="text-center mb-6">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
              Eventos
            </p>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-xs mx-auto">
              Join thousands of event organizers managing workshops, schedules, and attendance.
            </p>
          </div>

          <RegistrationWizard />

          <p className="text-center text-sm text-muted-foreground mt-6 border-t border-border/5 pt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  )
}
