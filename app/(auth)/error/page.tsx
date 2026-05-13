import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessages: Record<string, string> = {
    OAuthSignin: 'Error connecting to the authentication provider. Please try again.',
    OAuthCallback: 'Error processing authentication. Please try again.',
    OAuthCreateAccount: 'Unable to create account with this provider.',
    EmailCreateAccount: 'Unable to create account with this email.',
    Callback: 'An error occurred during authentication. Please try again.',
    OAuthAccountNotLinked: 'Email is already associated with a different authentication method.',
    EmailSignInError: 'Email sign in failed. Please try again.',
    CredentialsSignin: 'Invalid email or password.',
    SessionCallback: 'Unable to retrieve session information.',
    Verification: 'Verification link has expired or is invalid.',
  }

  const error = searchParams.error || 'Unknown error'
  const message = errorMessages[error] || 'An unexpected error occurred during authentication.'

  return (
    <div className="register-card glass-surface-strong rounded-2xl p-8 space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-destructive/20 blur-lg rounded-full" />
          <AlertCircle className="h-12 w-12 text-destructive relative" />
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
        <p className="text-xs font-mono text-destructive/80">Error: {error}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Button asChild className="w-full rounded-full">
          <Link href="/login">Try again</Link>
        </Button>
        <Button asChild variant="outline" className="w-full rounded-full">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  )
}
