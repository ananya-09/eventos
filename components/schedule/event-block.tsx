import React, { useRef } from 'react'
import { cn } from '@/lib/utils'
import { MoreHorizontal } from 'lucide-react'

export type EventTheme = 'purple' | 'blue' | 'yellow' | 'green' | 'red'

export type EventItem = {
  id: string
  title: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm (24-hour)
  endTime: string // HH:mm (24-hour)
  theme: EventTheme
  status?: 'Pending' | 'Completed' | string
}

type EventBlockProps = {
  event: EventItem
  hourHeight: number
  baseHour: number // e.g., 6 for 06:00
  onClick?: (event: EventItem) => void
  onEditClick?: (event: EventItem, rect: DOMRect) => void
  isEditing?: boolean
}

const themeStyles: Record<EventTheme, string> = {
  purple: 'bg-[#E5DDF9] text-[#6B46C1]',
  blue: 'bg-[#D6E4FF] text-[#2563EB]',
  yellow: 'bg-[#FEF0C7] text-[#D97706]',
  green: 'bg-[#D1FADF] text-[#059669]',
  red: 'bg-[#FEE2E2] text-[#DC2626]',
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours + minutes / 60
}

function formatTimeDisplay(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':')
  const h = parseInt(hStr, 10)
  const isPM = h >= 12
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${mStr}${isPM ? 'pm' : 'am'}`
}

export function EventBlock({ event, hourHeight, baseHour, onClick, onEditClick, isEditing }: EventBlockProps) {
  const startHour = parseTime(event.startTime)
  const endHour = parseTime(event.endTime)
  const blockRef = useRef<HTMLDivElement>(null)

  const top = (startHour - baseHour) * hourHeight
  const height = (endHour - startHour) * hourHeight
  const timeString = `${formatTimeDisplay(event.startTime)} - ${formatTimeDisplay(event.endTime)}`

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (blockRef.current && onEditClick) {
      const rect = blockRef.current.getBoundingClientRect()
      onEditClick(event, rect)
    }
  }

  return (
    <div
      ref={blockRef}
      onClick={() => onClick?.(event)}
      className={cn(
        'absolute left-1 right-1 rounded-lg p-2 text-xs transition-transform cursor-pointer flex flex-col z-10',
        themeStyles[event.theme] || themeStyles.blue,
        isEditing ? 'opacity-0 pointer-events-none' : 'hover:scale-[1.02] hover:shadow-md'
      )}
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
    >
      <div className="flex justify-between items-start">
        <span className="font-semibold leading-tight">{event.title}</span>
        <button 
          onClick={handleEditClick}
          className="opacity-50 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/20 rounded p-0.5 transition-colors -mr-1 -mt-1"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-0.5 opacity-70 text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">{timeString}</div>
      {event.status && (
        <div className="mt-auto flex items-center gap-1 pt-1">
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
          <span className="text-[10px] opacity-80 truncate">{event.status}</span>
        </div>
      )}
    </div>
  )
}
