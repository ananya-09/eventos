import Hero from '@/components/hero'
import About from '@/components/about'
import Contact from '@/components/contact'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Contact />
    </div>
  )
}
