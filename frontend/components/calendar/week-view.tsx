"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { format, startOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns"
import { vi } from "date-fns/locale"

interface CalendarEvent {
  id: number
  title: string
  date: Date
  time?: string
  type: "task" | "meeting" | "deadline" | "personal"
  priority?: "high" | "medium" | "low"
}

interface WeekViewProps {
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

export function WeekView({ currentDate, events, onDateClick, onEventClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
  })

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isDayToday = isToday(day)

          return (
            <div key={day.toISOString()} className="space-y-2">
              <div className={cn("text-center p-2 rounded-lg", isDayToday && "bg-primary text-primary-foreground")}>
                <div className="text-xs font-medium">{format(day, "EEE", { locale: vi })}</div>
                <div className="text-lg font-bold">{format(day, "d")}</div>
              </div>

              <Card
                className="min-h-[400px] p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onDateClick(day)}
              >
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <Badge
                      key={event.id}
                      variant="outline"
                      className={cn("w-full justify-start cursor-pointer p-2 h-auto", eventTypeColors[event.type])}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                    >
                      <div className="text-left">
                        <div className="font-medium text-xs">{event.title}</div>
                        {event.time && <div className="text-xs opacity-75">{event.time}</div>}
                      </div>
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
