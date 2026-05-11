import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import AppShell from '@/components/app-shell'
import LoaderWrapper from '@/components/ui/loader-wrapper'
import { ThemeProvider } from '@/components/theme-provider'
import AuthSessionProvider from '@/components/session-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eventos - Modern Event Dashboard',
  description: 'Join Eventos for an unforgettable event experience with workshops, speakers, and networking opportunities.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

const fontSans = Manrope({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${fontSans.className} font-sans antialiased`}>
        <ThemeProvider>
          <AuthSessionProvider>
            <LoaderWrapper>
              <AppShell>{children}</AppShell>
              <Toaster richColors />
            </LoaderWrapper>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
