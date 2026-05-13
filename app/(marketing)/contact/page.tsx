'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Contact from '@/components/contact'
import ContactFaq from '@/components/contact-faq'

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
            '-=0.45',
          )
      }, rootRef)

      return () => ctx.revert()
    }

    return setup()
  }, [])

  return (
    <div ref={rootRef}>
      <Contact />
      <ContactFaq />
    </div>
  )
}
