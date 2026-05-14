'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EventItem } from './event-block'
import { Calendar, Clock, Tag, Trash } from 'lucide-react'
import { format } from 'date-fns'

type ViewEventDialogProps = {
  event: EventItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteEvent: (id: string) => void
}

export function ViewEventDialog({ event, open, onOpenChange, onDeleteEvent }: ViewEventDialogProps) {
  if (!event) return null

  const displayDate = event.date ? format(new Date(event.date), 'EEEE, MMMM d, yyyy') : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
             <div className={`w-3 h-3 rounded-full bg-${event.theme === 'yellow' ? 'yellow-500' : event.theme === 'purple' ? 'purple-500' : event.theme === 'green' ? 'green-500' : event.theme === 'red' ? 'red-500' : 'blue-500'}`} />
            {event.title}
          </DialogTitle>
          <DialogDescription>
            View event details
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4 text-sm text-foreground">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          {event.status && (
            <div className="flex items-center gap-3">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="bg-secondary px-2 py-0.5 rounded-full text-xs font-medium">
                {event.status}
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center sm:justify-between">
           <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => { onDeleteEvent(event.id); onOpenChange(false); }}>
              <Trash className="h-4 w-4" />
           </Button>
           <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onOpenChange(false)}>
              Close
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
