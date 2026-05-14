'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-b from-background to-muted">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full" />
              <AlertCircle className="h-16 w-16 text-destructive relative" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              An unexpected error occurred. Our team has been notified.
            </p>
          </div>

          <Alert variant="destructive" className="text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2 text-sm">
              {error.message || 'An unknown error occurred'}
              {error.digest && (
                <div className="mt-2 font-mono text-xs bg-destructive/10 p-2 rounded">
                  Error ID: {error.digest}
                </div>
              )}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => reset()}
              className="flex-1"
              size="lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Go home
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            If this problem persists, please contact support at{' '}
            <a href="mailto:support@eventos.com" className="text-primary hover:underline">
              support@eventos.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
