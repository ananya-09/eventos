'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import SaaSGridBackground from '@/components/ui/saas-grid-background'
import { toast } from 'sonner'
import { Github, Bird, Instagram, Linkedin, X, Chrome, AlertCircle, Loader2 } from 'lucide-react'

const loginSlides = [
  {
    src: '/login-image-1.jpg',
    alt: 'Eventos login preview 1',
    title: 'Plan events with confidence',
    text: 'Organize workshops, registrations, and attendance from one polished workspace.',
  },
  {
    src: '/login-image-2.jpg',
    alt: 'Eventos login preview 2',
    title: 'Keep every detail aligned',
    text: 'Manage speakers, schedules, and participant flows without losing the narrative.',
  },
  {
    src: '/login-image-3.jpg',
    alt: 'Eventos login preview 3',
    title: 'A refined event experience',
    text: 'Give your community a clean, modern entry point that feels premium and trusted.',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % loginSlides.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

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
    <main className="grid min-h-screen w-full lg:grid-cols-[1.1fr_0.9fr]">
      {/* Hero Section - Left on Desktop, Top on Mobile */}
      <section className="relative min-h-85 overflow-hidden lg:min-h-screen">
        <div className="absolute inset-0">
          {loginSlides.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={index === 0}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,38,0.08),rgba(8,20,38,0.72))]" />
            </div>
          ))}
        </div>

        <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/25 px-3 py-2 text-xs font-medium text-white backdrop-blur-md sm:left-5 sm:top-5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Eventos
        </div>

        <Link
          href="/"
          className="absolute right-4 top-4 z-20 rounded-full bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-black/40 sm:right-5 sm:top-5 sm:px-4 sm:py-2"
        >
          Back to website →
        </Link>

        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 lg:p-8">
          <div className="max-w-md space-y-2 text-white sm:space-y-3">
            <h2 className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
              {loginSlides[activeSlide].title}
            </h2>
            <p className="text-xs leading-5 text-white/85 sm:text-sm sm:leading-6">
              {loginSlides[activeSlide].text}
            </p>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-1.5 sm:bottom-5 sm:gap-2">
          {loginSlides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-1 rounded-full transition-all sm:h-1.5 ${
                index === activeSlide ? 'w-8 bg-white sm:w-10' : 'w-4 bg-white/45 sm:w-5'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Form Section - Right on Desktop, Bottom on Mobile */}
      <section className="relative flex flex-col min-h-85 items-center justify-center overflow-hidden bg-background px-4 py-8 sm:px-6 sm:py-10 lg:min-h-screen lg:px-10 lg:py-0">
        <SaaSGridBackground
          className="pointer-events-none absolute inset-0 min-h-full!"
          seed="login-welcome-section"
          squaresCount={8}
          gridSize={48}
        />
        <div className="relative z-10 w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your Eventos account
            </p>
          </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleProviderLogin('github')}
                disabled={isLoading}
                className="h-11 justify-center gap-2 border-border bg-background/20 backdrop-blur-md text-foreground hover:bg-background/35"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleProviderLogin('google')}
                disabled={isLoading}
                className="h-11 justify-center gap-2 border-border bg-background/20 backdrop-blur-md text-foreground hover:bg-background/35"
              >
                <Chrome className="h-4 w-4" />
                <span>Google</span>
              </Button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border/80" />
              <div className="relative mx-auto w-fit bg-card backdrop-blur-md px-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
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
                  className="h-11 rounded-xl border-border bg-background/20 backdrop-blur-md  text-foreground placeholder:text-muted-foreground"
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

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
        </div>
        <div className="relative z-10 mt-6 flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex flex-wrap gap-1.5">
            <Link href="#" className="bg-background/40 px-3.5 py-3 flex items-center justify-center transition-colors hover:bg-background/60">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link href="#" className="bg-background/40 px-3.5 py-3 flex items-center justify-center transition-colors hover:bg-background/60">
              <Bird className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link href="#" className="bg-background/40 px-3.5 py-3 flex items-center justify-center transition-colors hover:bg-background/60">
              <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <Link href="#" className="bg-background/40 px-3.5 py-3 flex items-center justify-center transition-colors hover:bg-background/60">
              <Instagram className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
