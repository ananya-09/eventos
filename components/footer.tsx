'use client'

import Link from 'next/link'
import { ArrowRight, Bird, Github, Instagram, Linkedin, X } from 'lucide-react'

const Logo = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square">
    <path d="M5 9h9v9H5z" />
    <path d="M9 5h9v9H9z" />
    <path d="M13 13h6v6h-6z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-[color-mix(in_oklab,lab(84_-5.82_-15.92)_65%,transparent)] px-5 py-6 text-card-foreground backdrop-blur-xl md:px-8">
      <div className="max-w-300 mx-auto flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 flex-1">
          {/* Left Column - 5 spans */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="text-foreground">
              <Logo />
            </div>
            <div className="mt-8 lg:mt-12 mb-4">
              <h2 className="text-3xl md:text-[2.2rem] font-medium leading-[1.15] tracking-tight">
                Create events. <br />
                Build communities. <br />
                Scale connections.
              </h2>
            </div>
          </div>

          {/* Middle Column - 3 spans */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Team', href: '/team' },
                { name: 'About Us', href: '/about' },
                { name: 'Blog', href: '/blogs' },
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' }
              ].map((item) => (
                <Link 
                  href={item.href} 
                  key={item.name} 
                  className="bg-background/40 px-4 py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <button className="mt-2 flex w-full items-center justify-between overflow-hidden bg-accent text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/90 pl-4">
              BOOK A DEMO
              <div className="bg-primary px-4 py-3">
                <ArrowRight className="w-4 h-4 text-primary-foreground" />
              </div>
            </button>
          </div>

          {/* Right Column - 4 spans */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex justify-between w-full mb-4">
              <Link href="#" className="bg-background/40 px-3.5 py-3 flex items-center justify-center transition-colors hover:bg-background/60">
                <X className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link href="#" className="bg-background/40 px-3.5 py-3 flex items-center justify-center transition-colors hover:bg-background/60">
                <Bird className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link href="#" className="bg-background/40 px-3.5 py-3 flex items-center justify-center transition-colors hover:bg-background/60">
                <Linkedin className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link href="#" className="bg-background/40 px-3.5 py-3 flex items-center justify-center transition-colors hover:bg-background/60">
                <Instagram className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
            <div className="bg-background/40 p-5 flex-1 flex flex-col rounded-none border border-border/60">
              <div className="flex overflow-hidden rounded-none border border-border bg-background/50">
                <input 
                  type="email" 
                  placeholder="Your work email" 
                  className="flex-1 bg-transparent px-4 py-3 text-xs text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button className="bg-primary px-4 flex items-center justify-center transition-colors hover:bg-primary/90">
                  <ArrowRight className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
              <p className="mt-4 pr-4 text-[10px] leading-relaxed text-muted-foreground">
                By providing this information, you agree to be kept informed about EVENTOS products and services.
              </p>
              <div className="mt-auto pt-6">
                <h3 className="text-lg md:text-[1.1rem] font-medium leading-snug">
                  Get the latest research<br/>insights, product updates, and<br/>application tips.
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-8 flex flex-col lg:flex-row justify-start items-center gap-6">
          <div className="px-0 py-2 text-[10px] text-muted-foreground flex flex-row items-center gap-2">
            <div className="bg-background/40 px-5 py-3 transition-colors hover:text-foreground" >© 2026 EVENTOS. All Rights Reserved.</div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-1.5">
              <Link href="#" className="bg-background/40 px-5 py-3 transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
            </div>
            <div>
              <Link href="#" className="bg-background/40 px-5 py-3 transition-colors hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
