import { WeeklyCalendar } from '@/components/schedule/weekly-calendar'

export const metadata = {
  title: 'Schedule | Eventos',
  description: 'Manage your schedule and events.',
}

export default function SchedulePage() {
  return (
    <div className="flex h-[calc(100vh-2rem)] w-full flex-col bg-background">
      <div className="flex-1 overflow-hidden rounded-3xl bg-card p-6 shadow-sm m-2 md:m-4 flex flex-col">
        <WeeklyCalendar />
      </div>
    </div>
  )
}
