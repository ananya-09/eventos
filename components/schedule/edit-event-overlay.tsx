'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { EventItem, EventTheme } from './event-block'
import { Button } from '@/components/ui/button'

type EditEventOverlayProps = {
  event: EventItem
  initialRect: DOMRect
  onClose: () => void
  onSave: (event: EventItem) => void
}

const themeStyles: Record<EventTheme, string> = {
  purple: 'bg-[#E5DDF9] text-[#6B46C1]',
  blue: 'bg-[#D6E4FF] text-[#2563EB]',
  yellow: 'bg-[#FEF0C7] text-[#D97706]',
  green: 'bg-[#D1FADF] text-[#059669]',
  red: 'bg-[#FEE2E2] text-[#DC2626]',
}

export function EditEventOverlay({ event, initialRect, onClose, onSave }: EditEventOverlayProps) {
  const [isCentered, setIsCentered] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // Form states
  const [title, setTitle] = useState(event.title)
  const [date, setDate] = useState(event.date)
  const [startTime, setStartTime] = useState(event.startTime)
  const [endTime, setEndTime] = useState(event.endTime)
  const [status, setStatus] = useState(event.status || 'Pending')

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Trigger animation to center shortly after mount to ensure CSS transition runs
    const timer = setTimeout(() => {
      setIsCentered(true)
    }, 10)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    setIsClosing(true)
    setIsCentered(false) // Trigger animation back 

    const updatedEvent = {
      ...event,
      title,
      date,
      startTime,
      endTime,
      status,
    }

    setTimeout(() => {
      onSave(updatedEvent)
      onClose()
    }, 400) // matches transition duration
  }

  const handleCancel = () => {
    setIsClosing(true)
    setIsCentered(false)
    setTimeout(() => {
      onClose()
    }, 400)
  }

  if (!mounted) return null

  // Calculate inline styles based on state
  const style: React.CSSProperties = {
    position: 'fixed',
    top: isCentered ? '50%' : `${initialRect.top}px`,
    left: isCentered ? '50%' : `${initialRect.left}px`,
    width: isCentered ? 'min(92vw, 400px)' : `${initialRect.width}px`,
    height: isCentered ? 'auto' : `${initialRect.height}px`,
    maxHeight: isCentered ? 'min(90vh, 460px)' : undefined,
    transform: isCentered ? 'translate(-50%, -50%)' : 'translate(0, 0)',
    transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
    zIndex: 100,
    overflow: 'hidden',
    boxShadow: isCentered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-400 ${isCentered ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleCancel}
      />
      
      {/* Animated Element */}
      <div style={style} className={`rounded-lg flex flex-col p-4 ${themeStyles[event.theme]}`}>
        {!isCentered && !isClosing && (
          // Placeholder content while expanding
          <div className="flex flex-col h-full w-full justify-between opacity-100">
             <span className="font-semibold text-xs leading-tight truncate">{event.title}</span>
          </div>
        )}
        
        <div className={`flex flex-col gap-4 w-full h-full transition-opacity duration-300 delay-100 ${isCentered ? 'opacity-100' : 'opacity-0 hidden'}`}>
           <h2 className="text-xl font-bold">Edit Event</h2>
           
           <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-10 w-full rounded-md border-border/30 bg-card/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex h-10 w-full rounded-md border-border/30 bg-card/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Start</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="flex h-10 w-full rounded-md border-border/30 bg-card/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">End</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="flex h-10 w-full rounded-md border-border/30 bg-card/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-10 w-full rounded-md border-border/30 bg-card/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={handleCancel} className="hover:bg-card/30">Cancel</Button>
            <Button type="button" onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/80">Done</Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
