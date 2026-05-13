import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-muted">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/50">
            404
          </h1>
          <p className="text-2xl font-semibold text-foreground">
            Page Not Found
          </p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="relative">
          <Search className="h-24 w-24 mx-auto text-muted-foreground/30" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <Button asChild className="px-8" size="lg">
            <Link href="/">
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="px-8" size="lg">
            <Link href="/blogs">
              Browse Blogs
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          Need help? <Link href="/contact" className="text-primary hover:underline">Contact support</Link>
        </p>
      </div>
    </div>
  )
}
