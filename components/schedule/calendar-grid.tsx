import React, { useRef, useEffect } from 'react'
import { EventItem, EventBlock } from './event-block'
import { cn } from '@/lib/utils'
import { format, addDays } from 'date-fns'

const HOURS = Array.from({ length: 24 }).map((_, i) => i)
const HOUR_HEIGHT = 70 // pixels per hour (reduced from 90)
const BASE_HOUR = 0

type CalendarGridProps = {
  events: EventItem[]
  currentWeekStart: Date
  onEventClick?: (event: EventItem) => void
  onEventEditClick?: (event: EventItem, rect: DOMRect) => void
  editingEventId?: string
}

export function CalendarGrid({ events, currentWeekStart, onEventClick, onEventEditClick, editingEventId }: CalendarGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(currentWeekStart, i)
    return {
      dateString: format(date, 'yyyy-MM-dd'),
      display: format(date, 'd - eee'), // e.g., "1 - Mon"
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
    }
  })

  const now = new Date()
  const todayString = format(now, 'yyyy-MM-dd')
  const isCurrentWeekContainsToday = days.some(d => d.dateString === todayString)
  const currentTimeHour = now.getHours() + now.getMinutes() / 60
  const currentTimeTop = (currentTimeHour - BASE_HOUR) * HOUR_HEIGHT
  const isCurrentTimeVisible = isCurrentWeekContainsToday && currentTimeHour >= BASE_HOUR && currentTimeHour <= 23

  const formatNowTime = () => {
    let h = now.getHours()
    const m = now.getMinutes()
    const ampm = h >= 12 ? 'pm' : 'am'
    h = h % 12 || 12
    return `${h}:${m < 10 ? '0' + m : m}`
  }

  useEffect(() => {
    if (scrollRef.current && isCurrentTimeVisible) {
      const timer = setTimeout(() => {
        if (!scrollRef.current) return
        const containerHeight = scrollRef.current.clientHeight
        const offset = currentTimeTop - containerHeight / 2
        scrollRef.current.scrollTo({
          top: Math.max(0, offset),
          behavior: 'smooth'
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="flex flex-col h-full w-full border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden relative">
      <div className="flex flex-col h-full min-w-[800px] overflow-x-auto">
        {/* Header Row */}
        <div className="flex shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-30 shadow-sm">
          <div className="w-16 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
        {days.map((day, i) => (
          <div
            key={day.dateString}
            className={cn(
              "flex-1 py-3 text-center text-xs font-medium border-r border-slate-200 dark:border-slate-800 last:border-r-0",
              day.isToday 
                ? "bg-black text-white dark:bg-white dark:text-black rounded-t-md mx-0.5 mt-0.5" 
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            {day.display}
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="relative flex flex-1 overflow-y-auto" ref={scrollRef}>
        {/* Time Labels */}
        <div className="w-16 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="relative text-right pr-2 text-xs text-slate-400 font-medium"
              style={{ height: `${HOUR_HEIGHT}px` }}
            >
              <span className="absolute -top-2 right-2">
                {hour < 10 ? `0${hour}:00` : `${hour}:00`}
              </span>
            </div>
          ))}
        </div>

        {/* Days Columns */}
        <div className="flex flex-1 relative">
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
            {HOURS.map((hour) => (
              <div
                key={`line-${hour}`}
                className="w-full border-b border-slate-100 dark:border-slate-800/50"
                style={{ height: `${HOUR_HEIGHT}px` }}
              />
            ))}
          </div>

          {/* Current Time Indicator */}
          {isCurrentTimeVisible && (
            <div
              className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
              style={{ top: `${currentTimeTop}px`, transform: 'translateY(-50%)' }}
            >
              <div className="bg-black text-white dark:bg-white dark:text-black text-[10px] px-1.5 py-0.5 rounded ml-1 font-semibold z-30 shadow-sm">
                {formatNowTime()}
              </div>
              <div className="flex-1 h-[2px] bg-black dark:bg-white ml-2 shadow-sm" />
            </div>
          )}

          {/* Day Columns for Events */}
          {days.map((day) => {
            const dayEvents = events.filter((e) => e.date === day.dateString)
            return (
              <div
                key={`col-${day.dateString}`}
                className="flex-1 relative border-r border-slate-100 dark:border-slate-800/50 last:border-r-0 z-10"
                style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
              >
                {dayEvents.map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    hourHeight={HOUR_HEIGHT}
                    baseHour={BASE_HOUR}
                    onClick={onEventClick}
                    onEditClick={onEventEditClick}
                    isEditing={event.id === editingEventId}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
      </div>
    </div>
  )
}
