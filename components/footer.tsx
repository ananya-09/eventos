'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { logoLinkedin, logoInstagram } from 'ionicons/icons'

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square">
    <path d="M5 9h9v9H5z" />
    <path d="M9 5h9v9H9z" />
    <path d="M13 13h6v6h-6z" />
  </svg>
)

export default function Footer() {
  const [iconsReady, setIconsReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void Promise.all([
      import('ionicons/components/ion-icon.js'),
      import('ionicons'),
    ]).then(([{ defineCustomElement }, { addIcons }]) => {
      if (cancelled) return
      defineCustomElement()
      addIcons({
        logoLinkedin,
        logoInstagram,
      })
      setIconsReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <footer className="bg-[#0A0A0A] text-white py-8 px-5 md:px-8 w-full mt-auto border-t border-white/5">
      <div className="max-w-[1200px] mx-auto flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 flex-1">
          {/* Left Column - 5 spans */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="text-white">
              <Logo />
            </div>
            <div className="mt-10 lg:mt-24 mb-6">
              <h2 className="text-3xl md:text-[2.2rem] font-medium leading-[1.15] tracking-tight">
                Powerful and reliable.<br />
                Full lab automation<br />
                you can afford.
              </h2>
            </div>
          </div>

          {/* Middle Column - 3 spans */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {[
                'Robot', 'Customers',
                'Tools', 'Self-Driving Labs',
                'Software', 'Blog',
                'Ecosystem', 'Company'
              ].map((item) => (
                <Link 
                  href="#" 
                  key={item} 
                  className="bg-[#141414] px-4 py-3 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
            <button className="mt-4 w-full flex items-center justify-between bg-white text-black/60 font-semibold text-xs overflow-hidden pl-4 hover:bg-gray-100 transition-colors">
              BOOK A DEMO
              <div className="bg-[#4A47F6] px-4 py-3">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>

          {/* Right Column - 4 spans */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-[#141414] p-6 flex-1 flex flex-col mt-2">
              <div className="flex bg-[#1d1d1d] overflow-hidden">
                <input 
                  type="email" 
                  placeholder="Your work email" 
                  className="bg-transparent text-white px-4 py-3 flex-1 text-xs outline-none placeholder:text-gray-500"
                />
                <button className="bg-[#4A47F6] px-4 flex items-center justify-center hover:bg-[#3A37D6] transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="mt-4 text-[10px] text-gray-500 leading-relaxed pr-4">
                By providing this information, you agree to be kept informed about EDUQUE products and services.
              </p>
              <div className="mt-auto pt-10">
                <h3 className="text-lg md:text-[1.1rem] font-medium leading-snug">
                  Get the latest research<br/>insights, product updates, and<br/>application tips.
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-12 flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-1.5">
            <Link href="#" className="bg-[#141414] px-3.5 py-3 flex items-center justify-center hover:bg-[#1a1a1a] transition-colors">
              {iconsReady ? (
                <ion-icon name="logo-linkedin" className="text-gray-400" style={{ fontSize: '1rem' }} />
              ) : (
                <span className="w-4 h-4" />
              )}
            </Link>
            <Link href="#" className="bg-[#141414] px-3.5 py-3 flex items-center justify-center hover:bg-[#1a1a1a] transition-colors">
              {iconsReady ? (
                <ion-icon name="logo-instagram" className="text-gray-400" style={{ fontSize: '1rem' }} />
              ) : (
                <span className="w-4 h-4" />
              )}
            </Link>
            <Link href="#" className="bg-[#141414] px-4 py-3 text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="bg-[#141414] px-4 py-3 text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors">
              Terms of Service
            </Link>
          </div>

          <div className="bg-[#141414] px-5 py-3 text-[10px] text-gray-500">
            © 2026 EDUQUE. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
