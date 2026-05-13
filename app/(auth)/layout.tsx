import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication – Eventos',
  description: 'Sign up or sign in to your Eventos account.',
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/8 via-background to-accent/8 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
