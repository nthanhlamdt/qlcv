"use client"

import { useEffect, useState } from "react"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { MonthView } from "@/components/calendar/month-view"
import { WeekView } from "@/components/calendar/week-view"
import { DayView } from "@/components/calendar/day-view"
import { CreateEventDialog } from "@/components/calendar/create-event-dialog"
import { taskApi } from "@/lib/task-api"
import { teamApi } from "@/lib/team-api"
import { useRouter } from "next/navigation"

interface CalendarEvent {
  id: number
  title: string
  date: Date
  time?: string
  description?: string
  type: "task" | "meeting" | "deadline" | "personal"
  priority?: "high" | "medium" | "low"
}

const initialEvents: CalendarEvent[] = []

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const router = useRouter()

  const loadScheduledTasks = async () => {
    const result = await taskApi.listPersonal()
    const personal = (result.tasks || []).filter((t: any) => t.dueDate)
    const personalEvents: CalendarEvent[] = personal.map((t: any) => ({
      id: t._id,
      title: t.title,
      date: new Date(t.dueDate),
      type: "task",
      priority: t.priority,
    }))

    // Optional: include team tasks with due date
    let teamEvents: CalendarEvent[] = []
    try {
      const myTeams = await teamApi.getMyTeams()
      const teams = myTeams.teams || myTeams.data?.teams || []
      const all = await Promise.all(
        teams.map(async (tm: any) => {
          try {
            const res = await taskApi.listTeamTasks(tm._id)
            const list = res.tasks || []
            return list
              .filter((t: any) => t.dueDate)
              .map((t: any) => ({ id: t._id, title: t.title, date: new Date(t.dueDate), type: "task" as const, priority: t.priority }))
          } catch {
            return []
          }
        })
      )
      teamEvents = all.flat()
    } catch { }

    setEvents([...personalEvents, ...teamEvents])
  }

  useEffect(() => {
    loadScheduledTasks()
  }, [])

  const handleCreateEvent = () => {
    setSelectedDate(undefined)
    setCreateEventOpen(true)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setCreateEventOpen(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    // Navigate to task detail if it's a task
    router.push(`/tasks/${event.id}`)
  }

  const handleCreateEventSubmit = (newEvent: CalendarEvent) => {
    setEvents([...events, newEvent])
  }

  const renderCalendarView = () => {
    switch (viewMode) {
      case "month":
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )
      case "day":
        return <DayView currentDate={currentDate} events={events} onEventClick={handleEventClick} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Lịch làm việc</h1>
        <p className="text-muted-foreground">
          Quản lý lịch trình và sự kiện của bạn.
          <span className="block mt-1 text-sm">
            Ngày làm việc được tô màu xanh dương, ngày có sự kiện được tô màu xanh lá.
          </span>
        </p>
      </div>

      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onDateChange={setCurrentDate}
        onViewModeChange={setViewMode}
        onCreateEvent={handleCreateEvent}
      />

      {renderCalendarView()}

      <CreateEventDialog
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onCreateEvent={handleCreateEventSubmit}
        selectedDate={selectedDate}
      />
    </div>
  )
}
