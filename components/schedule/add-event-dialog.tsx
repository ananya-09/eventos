'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EventItem, EventTheme } from './event-block'

type AddEventDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddEvent: (event: EventItem) => void
  currentDate: Date // to pre-fill the date
}

export function AddEventDialog({ open, onOpenChange, onAddEvent, currentDate }: AddEventDialogProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(currentDate.toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [theme, setTheme] = useState<EventTheme>('blue')
  const [status, setStatus] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !date || !startTime || !endTime) return

    const newEvent: EventItem = {
      id: Math.random().toString(36).substring(7),
      title,
      date,
      startTime,
      endTime,
      theme,
      status: status || undefined,
    }

    onAddEvent(newEvent)
    onOpenChange(false)
    setTitle('')
    setStatus('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
              placeholder="e.g. Math Exam"
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="endTime" className="text-sm font-medium">End Time</label>
              <input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="theme" className="text-sm font-medium">Theme Color</label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as EventTheme)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">Status (Optional)</label>
            <input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
              placeholder="e.g. Confirmed"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black">Save Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
