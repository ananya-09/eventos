'use client'

import { useEffect, useState } from 'react'

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="space-y-6 flex flex-col items-center">
        {/* Animated Logo/Pulse */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
          <div
            className="absolute inset-0 rounded-full border-2 border-primary animate-spin"
            style={{
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-primary font-bold text-xl">E</div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <p className="text-foreground font-medium">Loading EventHub</p>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      </div>
    </div>
  )
}
