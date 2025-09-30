"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"

interface CalendarEvent {
  id: number
  title: string
  date: Date
  type: "task" | "meeting" | "deadline" | "personal"
  priority?: "high" | "medium" | "low"
}

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (event: CalendarEvent) => void
}

const eventTypeColors = {
  task: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  meeting: "bg-green-500/10 text-green-500 border-green-500/20",
  deadline: "bg-red-500/10 text-red-500 border-red-500/20",
  personal: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

export function MonthView({ currentDate, events, onDateClick, onEventClick }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  const hasWorkSchedule = (date: Date) => {
    const dayOfWeek = date.getDay()
    // Monday to Friday (1-5) are work days
    return dayOfWeek >= 1 && dayOfWeek <= 5
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
          <span>Ngày làm việc</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
          <span>Có sự kiện</span>
        </div>
      </div>

      {/* Week headers */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)
          const isWorkDay = hasWorkSchedule(day)
          const hasEvents = dayEvents.length > 0

          return (
            <Card
              key={day.toISOString()}
              className={cn(
                "min-h-[120px] p-2 cursor-pointer hover:bg-muted/50 transition-colors",
                !isCurrentMonth && "opacity-50",
                isDayToday && "ring-2 ring-primary",
                isWorkDay && isCurrentMonth && "bg-blue-50 border-blue-200",
                hasEvents && isCurrentMonth && "bg-green-50 border-green-200",
                hasEvents &&
                  isWorkDay &&
                  isCurrentMonth &&
                  "bg-gradient-to-br from-blue-50 to-green-50 border-green-300",
              )}
              onClick={() => onDateClick(day)}
            >
              <div className="space-y-1">
                <div className={cn("text-sm font-medium", isDayToday && "text-primary")}>
                  {format(day, "d")}
                  {isWorkDay && isCurrentMonth && <span className="ml-1 text-xs text-blue-600">●</span>}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <Badge
                      key={event.id}
                      variant="outline"
                      className={cn(
                        "text-xs truncate w-full justify-start cursor-pointer",
                        eventTypeColors[event.type],
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      {event.title}
                    </Badge>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} khác</div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
