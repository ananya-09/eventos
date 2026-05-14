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
    <div className="min-h-screen bg-white dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.88))]">
      {children}
    </div>
  )
}
