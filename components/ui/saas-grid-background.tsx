'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Dimensions = { width: number; height: number }

function hashToSeed(input: string) {
  // Simple string hash -> 32-bit int for deterministic randomness.
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export type SaaSGridBackgroundProps = {
  children?: ReactNode
  className?: string
  /**
   * Grid cell size in px.
   * (Recommended: around 50px)
   */
  gridSize?: number
  /**
   * How many colored squares to place.
   * Keep low for a minimal/aesthetic effect.
   */
  squaresCount?: number
  /**
   * Used for deterministic “random” placement.
   */
  seed?: string
  /**
   * Square opacity range (low values look more SaaS-like).
   */
  minSquareOpacity?: number
  maxSquareOpacity?: number
}

export default function SaaSGridBackground({
  children,
  className,
  gridSize = 50,
  squaresCount = 10,
  seed = 'saas-grid',
  minSquareOpacity = 0.1,
  maxSquareOpacity = 0.2,
}: SaaSGridBackgroundProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [dims, setDims] = useState<Dimensions>({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      setDims({ width: rect.width, height: rect.height })
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const squares = useMemo(() => {
    const { width, height } = dims
    const cols = width > 0 ? Math.max(1, Math.floor(width / gridSize)) : 0
    const rows = height > 0 ? Math.max(1, Math.floor(height / gridSize)) : 0
    if (!cols || !rows) return []

    const rng = mulberry32(hashToSeed(seed))

    // Theme palette aligned with Eventos design tokens.
    const palette = [
      { r: 74, g: 116, b: 167 }, // primary blue
      { r: 20, g: 42, b: 68 }, // dark blue
      { r: 220, g: 234, b: 247 }, // light ice blue
      { r: 255, g: 255, b: 255 }, // white glow
    ]

    const placed = new Set<string>()
    const out: Array<{ left: number; top: number; bg: string }> = []

    const target = Math.max(0, Math.min(squaresCount, cols * rows))

    const pushSquare = (col: number, row: number) => {
      const key = `${col}-${row}`
      if (placed.has(key)) return false
      placed.add(key)
      const chosen = palette[Math.floor(rng() * palette.length)]
      const a = minSquareOpacity + rng() * (maxSquareOpacity - minSquareOpacity)
      out.push({
        left: col * gridSize,
        top: row * gridSize,
        bg: rgba(chosen.r, chosen.g, chosen.b, a),
      })
      return true
    }

    // Horizontal thirds so squares appear on the left, center, and right (not only one side).
    const colZones: Array<{ lo: number; hi: number }> =
      cols >= 3
        ? (() => {
            const a = Math.floor(cols / 3)
            const b = Math.floor((2 * cols) / 3)
            return [
              { lo: 0, hi: a },
              { lo: a, hi: b },
              { lo: b, hi: cols },
            ]
          })()
        : [{ lo: 0, hi: cols }]

    const zoneCount = colZones.length
    const base = Math.floor(target / zoneCount)
    const rem = target % zoneCount
    const quotas = colZones.map((_, i) => base + (i < rem ? 1 : 0))

    let attempts = 0
    const maxAttempts = target * 40 + 80

    for (let zi = 0; zi < colZones.length; zi++) {
      const { lo, hi } = colZones[zi]
      const span = Math.max(1, hi - lo)
      let need = quotas[zi] ?? 0
      while (need > 0 && out.length < target && attempts < maxAttempts) {
        attempts++
        const col = lo + Math.floor(rng() * span)
        const row = Math.floor(rng() * rows)
        if (pushSquare(col, row)) need--
      }
    }

    // Fill any remainder (collisions) with uniform random placement.
    while (out.length < target && attempts < maxAttempts) {
      attempts++
      const col = Math.floor(rng() * cols)
      const row = Math.floor(rng() * rows)
      pushSquare(col, row)
    }

    return out
  }, [dims, gridSize, squaresCount, seed, minSquareOpacity, maxSquareOpacity])

  const gridLines = useMemo(() => {
    const lineColor = 'rgba(74, 116, 167, 0.16)'
    return {
      backgroundImage: `
        linear-gradient(to right, ${lineColor} 1px, transparent 1px),
        linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)
      `,
      backgroundSize: `${gridSize}px ${gridSize}px`,
      backgroundPosition: '0 0',
      backgroundRepeat: 'repeat',
    } as const
  }, [gridSize])

  const lightOverlay = useMemo(() => {
    return {
      background: `
        radial-gradient(
          ellipse 85% 70% at 50% 18%,
          rgba(255, 255, 255, 0) 0%,
          rgba(220, 234, 247, 0.42) 45%,
          rgba(236, 244, 252, 0.95) 100%
        )
      `,
    } as const
  }, [])

  const darkOverlay = useMemo(() => {
    return {
      background: `
        radial-gradient(
          ellipse 85% 70% at 50% 18%,
          rgba(8, 20, 38, 0) 0%,
          rgba(8, 20, 38, 0.46) 45%,
          rgba(8, 20, 38, 0.92) 100%
        )
      `,
    } as const
  }, [])

  return (
    <section
      ref={ref}
      className={cn(
        'relative min-h-screen w-full overflow-hidden bg-background',
        // Ensure the grid/squares do not affect child stacking.
        'transform-gpu',
        className,
      )}
    >
      {/* Grid layer */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          ...gridLines,
        }}
      />

      {/* Soft colored squares aligned to the grid */}
      <div aria-hidden className="absolute inset-0">
        {squares.map((sq, idx) => (
          <div
            key={`${sq.left}-${sq.top}-${idx}`}
            className="absolute"
            style={{
              left: sq.left,
              top: sq.top,
              width: gridSize,
              height: gridSize,
              backgroundColor: sq.bg,
            }}
          />
        ))}
      </div>

      {/* Radial fade overlays for light/dark themes */}
      <div aria-hidden className="absolute inset-0 dark:hidden" style={lightOverlay} />
      <div aria-hidden className="absolute inset-0 hidden dark:block" style={darkOverlay} />

      {/* Content sits above the background */}
      <div className="relative z-10">{children}</div>
    </section>
  )
}

