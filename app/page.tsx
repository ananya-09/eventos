import Hero from '@/components/hero'
import About from '@/components/about'
import SaaSGridBackground from '@/components/saas-grid-background'

export default function Home() {
  return (
    <div className="min-h-screen">
      <SaaSGridBackground className="min-h-0">
        <Hero />
      </SaaSGridBackground>
      <About />
    </div>
  )
}
