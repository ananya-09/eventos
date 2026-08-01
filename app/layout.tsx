import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import AuthSessionProvider from '@/components/session-provider'
import { Toaster } from '@/components/ui/sonner'
import AppShell from '@/components/app-shell'
import LoaderWrapper from '@/components/ui/loader-wrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eventos - Modern Event Dashboard',
  description: 'Join Eventos for an unforgettable event experience with workshops, speakers, and networking opportunities.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
  },
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eventos.com',
    title: 'Eventos',
    description: 'Modern event management platform',
    siteName: 'Eventos',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventos',
    description: 'Modern event management platform',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

const fontSans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${fontSans.className} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthSessionProvider>
            <LoaderWrapper>
              <AppShell>
                {children}
              </AppShell>
            </LoaderWrapper>
            <Toaster richColors />
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
