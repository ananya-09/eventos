'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { FolderKanban, Star, GitFork, CircleDot } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!sectionRef.current) return

    const setup = () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline()

        tl.from('.hero-left', {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        }).from(
          '.hero-right',
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.45',
        )
      }, sectionRef)

      return ctx
    }

    let ctx = undefined as ReturnType<typeof setup> | undefined

    if (typeof window !== 'undefined' && window.sessionStorage.getItem('loaderComplete')) {
      ctx = setup()
    } else {
      const handler = () => {
        ctx = setup()
        window.removeEventListener('loaderComplete', handler)
      }
      window.addEventListener('loaderComplete', handler)

      return () => {
        if (ctx) ctx.revert()
        window.removeEventListener('loaderComplete', handler)
      }
    }

    return () => {
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <section id="stats" className="pt-5 pb-16 md:pt-7 md:pb-24">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Text and Image */}
          <div className="space-y-8 hero-left">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
                Welcome to Eventos
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of attendees in celebrating innovation, learning, and community. Experience the future of events.
              </p>
            </div>

            {/* Illustrative Image */}
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/hero-image.jpg"
                alt="Event illustration"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Side: Stat Cards */}
          <div className="space-y-6 hero-right">
            {/* Large Card on Top */}
            <div className="bg-white dark:bg-[#151616] rounded-xl p-8 shadow-sm relative border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <FolderKanban className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">Total Registrations</p>
              <p className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">1,245</p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full" onClick={() => router.push('/register')}>
                Register Now
              </Button>
            </div>

            {/* Three Cards Below */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Teams Card */}
              <div className="bg-white dark:bg-[#151616] rounded-xl p-6 shadow-sm relative border-l-4 border-orange-500">
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Teams</p>
                <p className="text-3xl font-bold text-black dark:text-white">320</p>
              </div>

              {/* Workshops Card */}
              <div className="bg-white dark:bg-[#151616] rounded-xl p-6 shadow-sm relative border-l-4 border-cyan-500">
                <div className="flex items-center gap-3 mb-3">
                  <GitFork className="w-6 h-6 text-cyan-500" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Workshops</p>
                <p className="text-3xl font-bold text-black dark:text-white">18</p>
              </div>

              {/* Speakers Card */}
              <div className="bg-white dark:bg-[#151616] rounded-xl p-6 shadow-sm relative border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-3">
                  <CircleDot className="w-6 h-6 text-green-500" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Speakers</p>
                <p className="text-3xl font-bold text-black dark:text-white">42</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
