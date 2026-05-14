'use client'

import React, { useState, useMemo } from 'react'
import { CalendarGrid } from './calendar-grid'
import { EventItem } from './event-block'
import { Bell, MessageSquare, Search, Filter, Plus, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format, startOfWeek } from 'date-fns'
import { AddEventDialog } from './add-event-dialog'
import { ViewEventDialog } from './view-event-dialog'
import { EditEventOverlay } from './edit-event-overlay'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { startOfMonth, addMonths, addWeeks } from 'date-fns'

const getInitialEvents = (): EventItem[] => {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday start
  
  const d = (dayIndex: number) => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + dayIndex - 1)
    return format(date, 'yyyy-MM-dd')
  }

  return [
    { id: '1', title: 'Math Exam', date: d(2), startTime: '07:00', endTime: '07:40', theme: 'purple', status: 'Pending' },
    { id: '2', title: 'Art Exam', date: d(2), startTime: '07:30', endTime: '09:00', theme: 'blue', status: 'Pending' },
    { id: '3', title: 'Physics Exam', date: d(2), startTime: '10:00', endTime: '10:40', theme: 'blue', status: 'Completed' },
    { id: '4', title: 'Sport Exam', date: d(2), startTime: '10:50', endTime: '12:10', theme: 'yellow', status: 'Completed' },
    { id: '4b', title: 'Lunch Break', date: d(2), startTime: '12:30', endTime: '13:30', theme: 'green', status: 'Completed' },
    { id: '4c', title: 'Study Group', date: d(2), startTime: '16:00', endTime: '18:00', theme: 'purple', status: 'Pending' },
    { id: '4d', title: 'Gaming Session', date: d(2), startTime: '20:00', endTime: '22:30', theme: 'red', status: 'Pending' },
    
    { id: '5', title: 'Math Exam', date: d(4), startTime: '09:30', endTime: '10:30', theme: 'purple', status: 'Pending' },
    { id: '6', title: 'Computer Exam', date: d(4), startTime: '10:30', endTime: '12:00', theme: 'green', status: 'Completed' },
    { id: '6b', title: 'Project Meeting', date: d(4), startTime: '14:00', endTime: '15:30', theme: 'blue', status: 'Pending' },
    { id: '6c', title: 'Dinner with Team', date: d(4), startTime: '19:30', endTime: '21:00', theme: 'yellow', status: 'Pending' },

    { id: '7', title: 'Physics Exam', date: d(6), startTime: '10:00', endTime: '10:40', theme: 'blue', status: 'Pending' },
    { id: '8', title: 'Sport Exam', date: d(6), startTime: '10:50', endTime: '12:10', theme: 'red', status: 'Completed' },
    { id: '9', title: 'Coding Workshop', date: d(6), startTime: '13:00', endTime: '17:00', theme: 'purple', status: 'Pending' },
    { id: '10', title: 'Movie Night', date: d(6), startTime: '21:00', endTime: '23:30', theme: 'green', status: 'Pending' },

    // New 5 sample events
    { id: '11', title: 'Morning Jog', date: d(0), startTime: '06:00', endTime: '07:00', theme: 'blue', status: 'Completed' },
    { id: '12', title: 'Dentist Appointment', date: d(1), startTime: '11:15', endTime: '12:00', theme: 'red', status: 'Pending' },
    { id: '13', title: 'Team Sync', date: d(3), startTime: '10:00', endTime: '11:00', theme: 'yellow', status: 'Pending' },
    { id: '14', title: 'Gym Session', date: d(5), startTime: '18:00', endTime: '19:30', theme: 'purple', status: 'Pending' },
    { id: '15', title: 'Weekly Planning', date: d(6), startTime: '08:00', endTime: '09:00', theme: 'green', status: 'Pending' },
  ]
}

export function WeeklyCalendar() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [events, setEvents] = useState<EventItem[]>(getInitialEvents)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  
  const [filterStatus, setFilterStatus] = useState<'all' | 'Completed' | 'Pending'>('all')
  const [editingEvent, setEditingEvent] = useState<{ event: EventItem, rect: DOMRect } | null>(null)

  const handleAddEvent = (newEvent: EventItem) => setEvents(prev => [...prev, newEvent])
  const handleDeleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id))
  const handleUpdateEvent = (updated: EventItem) => setEvents(prev => prev.map(e => e.id === updated.id ? updated : e))

  const filteredEvents = useMemo(() => {
    if (filterStatus === 'all') return events
    return events.filter(e => e.status === filterStatus)
  }, [events, filterStatus])

  const weekEnd = useMemo(() => {
    const end = new Date(currentWeekStart)
    end.setDate(end.getDate() + 6)
    return end
  }, [currentWeekStart])
  
  const headerDateString = `${format(currentWeekStart, 'dd')}-${format(weekEnd, 'dd MMMM yyyy')}`
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addWeeks(currentWeekStart, 0)
      date.setDate(date.getDate() + i)
      return {
        dateString: format(date, 'yyyy-MM-dd'),
        display: format(date, 'd - eee'),
        isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      }
    })
  }, [currentWeekStart])

  const groupedDays = useMemo(() => {
    return days.map((day) => ({
      ...day,
      events: filteredEvents.filter((event) => event.date === day.dateString),
    }))
  }, [days, filteredEvents])

  const weeks = useMemo(() => {
    const now = new Date()
    const startM = startOfMonth(now)
    const endM = new Date(now.getFullYear(), now.getMonth() + 2, 0) // last day of next month
    const startW = startOfWeek(startM, { weekStartsOn: 1 })
    
    const generatedWeeks = []
    let currentW = startW
    while (currentW <= endM) {
      const e = new Date(currentW)
      e.setDate(e.getDate() + 6)
      generatedWeeks.push({ 
        value: currentW.toISOString(), 
        label: `${format(currentW, 'MMM d')} - ${format(e, 'MMM d, yyyy')}` 
      })
      currentW = addWeeks(currentW, 1)
    }
    return generatedWeeks
  }, [])

  const handleWeekChange = (val: string) => {
    setCurrentWeekStart(startOfWeek(new Date(val), { weekStartsOn: 1 }))
  }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Top Navigation / Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Maham</span>
          <span>&gt;</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            <div className="p-1 rounded-full bg-secondary">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            Schedule
          </span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Bell className="h-5 w-5 cursor-pointer hover:text-foreground" />
          <MessageSquare className="h-5 w-5 cursor-pointer hover:text-foreground" />
          <Search className="h-5 w-5 cursor-pointer hover:text-foreground" />
        </div>
      </div>

      {/* Main Header Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border-border bg-card/80 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
            <h1 className="min-w-0 text-2xl font-bold text-foreground sm:text-3xl">
            {headerDateString}
            </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <Select 
            value={currentWeekStart.toISOString()} 
            onValueChange={handleWeekChange}
          >
            <SelectTrigger className="h-9 w-full rounded-full border-none bg-secondary font-medium text-foreground sm:w-[220px]">
              <SelectValue placeholder="Select Week" />
            </SelectTrigger>
            <SelectContent>
              {weeks.map(w => (
                <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full gap-2 border-border h-9">
                <Filter className="h-4 w-4" /> Filter 
                {filterStatus !== 'all' && (
                  <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">1</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuCheckboxItem 
                checked={filterStatus === 'all'} 
                onCheckedChange={() => setFilterStatus('all')}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={filterStatus === 'Completed'} 
                onCheckedChange={() => setFilterStatus('Completed')}
              >
                Completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={filterStatus === 'Pending'} 
                onCheckedChange={() => setFilterStatus('Pending')}
              >
                Pending
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="rounded-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9" onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 relative space-y-4">
        <div className="md:hidden space-y-4">
          {groupedDays.map((day) => (
            <section key={day.dateString} className="rounded-2xl border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{day.isToday ? 'Today' : 'Day'}</p>
                  <h2 className="text-base font-semibold text-foreground">{day.display}</h2>
                </div>
                {day.isToday && <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">Current</span>}
              </div>

              <div className="mt-4 space-y-3">
                {day.events.length > 0 ? day.events.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelectedEvent(event)}
                    className="flex w-full items-start justify-between gap-4 rounded-2xl border-border bg-secondary px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{event.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{event.startTime} - {event.endTime}</p>
                    </div>
                    <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">{event.status ?? 'Scheduled'}</span>
                  </button>
                )) : (
                  <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">No events scheduled.</p>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="hidden md:block">
          <CalendarGrid 
            events={filteredEvents} 
            currentWeekStart={currentWeekStart} 
            onEventClick={setSelectedEvent}
            onEventEditClick={(ev, rect) => setEditingEvent({ event: ev, rect })}
            editingEventId={editingEvent?.event.id}
          />
        </div>
        
        {editingEvent && (
          <EditEventOverlay 
            event={editingEvent.event} 
            initialRect={editingEvent.rect} 
            onClose={() => setEditingEvent(null)}
            onSave={handleUpdateEvent}
          />
        )}
      </div>


      <AddEventDialog 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
        onAddEvent={handleAddEvent}
        currentDate={new Date()} 
      />

      <ViewEventDialog 
        event={selectedEvent} 
        open={!!selectedEvent} 
        onOpenChange={(open) => { if (!open) setSelectedEvent(null); }}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  )
}
