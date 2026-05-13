import AppShell from '@/components/app-shell'
import LoaderWrapper from '@/components/ui/loader-wrapper'

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LoaderWrapper>
      <AppShell>{children}</AppShell>
    </LoaderWrapper>
  )
}
