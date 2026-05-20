'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SaaSGridBackground from '@/components/ui/saas-grid-background'
import { toast } from 'sonner'
import { Github, Chrome, AlertCircle, Loader2 } from 'lucide-react'
import LoginVisualPanel from './components/login-visual-panel'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        toast.error('Login failed', { description: result.error })
      } else if (result?.ok) {
        toast.success('Logged in successfully')
        router.push('/dashboard')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error('Error', { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderLogin = async (provider: 'github' | 'google') => {
    setError(null)
    try {
      await signIn(provider, { redirect: true, callbackUrl: '/dashboard' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      setError(message)
      toast.error('Sign in failed', { description: message })
    }
  }

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
        <LoginVisualPanel />
      </section>

      {/* Form Section - Right on Desktop, Bottom on Mobile */}
      <section className="relative flex h-full flex-col items-center justify-center overflow-y-auto bg-background px-4 py-8 sm:px-6 lg:px-12">
        <SaaSGridBackground
          className="pointer-events-none absolute inset-0 min-h-full!"
          seed="login-welcome-section"
          squaresCount={8}
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
              Welcome Back
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-xs mx-auto">
              Sign in to your Eventos account to manage workshops, schedules, and attendance.
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Social Provider Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleProviderLogin('google')}
              disabled={isLoading}
              className="group relative w-full overflow-hidden flex items-center justify-center gap-3 h-11 rounded-xl border-border/60 bg-background/20 backdrop-blur-md text-foreground transition-all duration-300 hover:border-[#4285F4]/40 hover:bg-transparent hover:text-white focus-visible:border-[#4285F4]/50 focus-visible:ring-[#4285F4]/20"
            >
              {/* Circular expanding background fill */}
              <span className="absolute inset-0 m-auto z-0 w-8 h-8 rounded-full bg-[#4285F4] scale-0 transition-transform duration-300 ease-out group-hover:scale-[25] group-hover:duration-[1500ms] group-hover:ease-in-out group-focus-visible:scale-[25] group-focus-visible:duration-[1500ms] group-focus-visible:ease-in-out" />
              
              {/* Content aligned above the fill */}
              <span className="relative z-10 flex items-center gap-3">
                <Chrome className="h-5 w-5 shrink-0" />
                <span>Continue with Google</span>
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleProviderLogin('github')}
              disabled={isLoading}
              className="group relative w-full overflow-hidden flex items-center justify-center gap-3 h-11 rounded-xl border-border/60 bg-background/20 backdrop-blur-md text-foreground transition-all duration-300 hover:border-[#181717]/40 hover:bg-transparent hover:text-white focus-visible:border-[#181717]/50 focus-visible:ring-[#181717]/20"
            >
              {/* Circular expanding background fill */}
              <span className="absolute inset-0 m-auto z-0 w-8 h-8 rounded-full bg-[#181717] scale-0 transition-transform duration-300 ease-out group-hover:scale-[25] group-hover:duration-[1500ms] group-hover:ease-in-out group-focus-visible:scale-[25] group-focus-visible:duration-[1500ms] group-focus-visible:ease-in-out" />
              
              {/* Content aligned above the fill */}
              <span className="relative z-10 flex items-center gap-3">
                <Github className="h-5 w-5 shrink-0" />
                <span>Continue with GitHub</span>
              </span>
            </Button>
          </div>

          <div className="relative py-3 mb-4">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border/80" />
            <div className="relative mx-auto w-fit bg-card/60 backdrop-blur-md px-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Or continue with email
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="h-11 rounded-xl border-border text-foreground backdrop-blur-md placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-muted-foreground">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="h-11 rounded-xl border-border bg-background/20 backdrop-blur-md text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button type="submit" className="h-11 w-full rounded-full text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 border-t border-border/5 pt-4">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  )
}
