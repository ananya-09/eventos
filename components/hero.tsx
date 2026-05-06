import { CalendarClock, MapPin, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <article
      id="home"
      className="relative overflow-hidden rounded-3xl border border-white/45 bg-linear-to-br from-[#4A47F6]/88 via-[#3b56d9]/82 to-[#1A1A40]/92 p-6 text-white shadow-[0_24px_58px_-28px_rgba(58,54,176,0.65)] md:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-6 h-52 w-52 rounded-full bg-[#9ca8ff]/30 blur-3xl" />

      <Badge className="mb-3 border-white/35 bg-white/18 text-white">Featured Event</Badge>
      <h1 className="max-w-xl text-2xl font-bold tracking-tight md:text-3xl">
        Annual Product & Community Summit 2026
      </h1>
      <p className="mt-2 max-w-xl text-sm text-indigo-100/95 md:text-base">
        Join creators, founders, and operators for an immersive night of talks,
        showcases, and networking designed for ambitious builders.
      </p>

      <div className="mt-6 flex flex-wrap gap-2.5 text-xs text-indigo-100/95 md:text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
          <CalendarClock className="h-4 w-4" />
          18 Apr, 2026 • 6:00 PM
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
          <MapPin className="h-4 w-4" />
          Waterfront Convention Hall
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
          <Users className="h-4 w-4" />
          850 expected attendees
        </span>
      </div>

      <div className="mt-6">
        <Button className="h-10 rounded-full bg-white px-5 text-sm font-semibold text-[#1A1A40] hover:bg-white/90">
          Create Event
        </Button>
      </div>
    </article>
  )
}
