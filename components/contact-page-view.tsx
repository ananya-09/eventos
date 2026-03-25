'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Contact from '@/components/contact'
import ContactFaq from '@/components/contact-faq'
import SaaSGridBackground from '@/components/saas-grid-background'

export default function ContactPageView() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return

    const setup = () => {
      const ctx = gsap.context(() => {
        const ease = 'power3.out'
        const tl = gsap.timeline({ defaults: { ease } })

        tl.from('.contact-page-bg', {
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
        })
          .from(
            '.contact-intro h2',
            {
              y: 44,
              opacity: 0,
              duration: 0.9,
              ease: 'power3.out',
            },
            0.08,
          )
          .from(
            '.contact-intro p',
            {
              y: 26,
              opacity: 0,
              duration: 0.7,
            },
            '-=0.58',
          )
          .from(
            '.contact-panel',
            {
              y: 48,
              opacity: 0,
              scale: 0.98,
              duration: 1,
              ease: 'power3.out',
            },
            '-=0.52',
          )
          .from(
            '.contact-faq-section h2',
            {
              y: 36,
              opacity: 0,
              duration: 0.78,
            },
            '-=0.42',
          )
          .from(
            '.contact-faq-panel',
            {
              y: 40,
              opacity: 0,
              duration: 0.88,
            },
            '-=0.5',
          )
          .from(
            '.contact-faq-loadmore',
            {
              y: 18,
              opacity: 0,
              duration: 0.5,
              ease: 'power2.out',
            },
            '-=0.55',
          )
          .from(
            '.contact-faq-cta',
            {
              y: 36,
              opacity: 0,
              duration: 0.82,
            },
            '-=0.48',
          )
      }, rootRef)

      return ctx
    }

    let ctx: ReturnType<typeof setup> | undefined

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
    <div ref={rootRef} className="min-h-screen">
      <div className="contact-page-bg">
        <SaaSGridBackground className="min-h-0">
          <Contact />
        </SaaSGridBackground>
      </div>
      <ContactFaq />
    </div>
  )
}
