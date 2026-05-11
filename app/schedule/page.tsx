import { WeeklyCalendar } from '@/components/schedule/weekly-calendar'

export const metadata = {
  title: 'Schedule | Eventos',
  description: 'Manage your schedule and events.',
}

export default function SchedulePage() {
  return (
    <div className="flex h-[calc(100vh-2rem)] w-full flex-col bg-[#F3F4F6] dark:bg-slate-950">
      <div className="flex-1 overflow-hidden rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 m-2 md:m-4 flex flex-col">
        <WeeklyCalendar />
      </div>
    </div>
  )
}
