"use client"

import { useState } from "react"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { MonthView } from "@/components/calendar/month-view"
import { WeekView } from "@/components/calendar/week-view"
import { DayView } from "@/components/calendar/day-view"
import { CreateEventDialog } from "@/components/calendar/create-event-dialog"

interface CalendarEvent {
  id: number
  title: string
  date: Date
  time?: string
  description?: string
  type: "task" | "meeting" | "deadline" | "personal"
  priority?: "high" | "medium" | "low"
}

const initialEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Họp team hàng tuần",
    date: new Date(2024, 0, 15),
    time: "09:00",
    description: "Review tiến độ dự án và lên kế hoạch tuần mới",
    type: "meeting",
    priority: "high",
  },
  {
    id: 2,
    title: "Deadline thiết kế UI",
    date: new Date(2024, 0, 18),
    type: "deadline",
    priority: "high",
  },
  {
    id: 3,
    title: "Code review",
    date: new Date(2024, 0, 16),
    time: "14:00",
    description: "Review code cho feature mới",
    type: "task",
    priority: "medium",
  },
  {
    id: 4,
    title: "Khám sức khỏe định kỳ",
    date: new Date(2024, 0, 20),
    time: "08:30",
    type: "personal",
    priority: "medium",
  },
  {
    id: 5,
    title: "Demo sản phẩm cho khách hàng",
    date: new Date(2024, 0, 22),
    time: "15:00",
    description: "Trình bày tính năng mới cho khách hàng ABC",
    type: "meeting",
    priority: "high",
  },
  {
    id: 6,
    title: "Viết tài liệu API",
    date: new Date(2024, 0, 17),
    type: "task",
    priority: "low",
  },
  {
    id: 7,
    title: "Standup meeting",
    date: new Date(2024, 0, 19),
    time: "09:30",
    type: "meeting",
    priority: "medium",
  },
  {
    id: 8,
    title: "Sprint planning",
    date: new Date(2024, 0, 23),
    time: "10:00",
    type: "meeting",
    priority: "high",
  },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [createEventOpen, setCreateEventOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()

  const handleCreateEvent = () => {
    setSelectedDate(undefined)
    setCreateEventOpen(true)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setCreateEventOpen(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    // TODO: Implement event detail view
    console.log("Event clicked:", event)
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
