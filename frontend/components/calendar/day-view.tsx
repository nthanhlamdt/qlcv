"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { format, isSameDay } from "date-fns"
import { vi } from "date-fns/locale"
import { Clock } from "lucide-react"

interface CalendarEvent {
  id: number
  title: string
  date: Date
  time?: string
  description?: string
  type: "task" | "meeting" | "deadline" | "personal"
  priority?: "high" | "medium" | "low"
}

interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick: (event: CalendarEvent) => void
}

const eventTypeColors = {
  task: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  meeting: "bg-green-500/10 text-green-500 border-green-500/20",
  deadline: "bg-red-500/10 text-red-500 border-red-500/20",
  personal: "bg-purple-500/10 text-purple-500 border-purple-500/20",
}

const eventTypeLabels = {
  task: "Công việc",
  meeting: "Cuộc họp",
  deadline: "Hạn chót",
  personal: "Cá nhân",
}

export function DayView({ currentDate, events, onEventClick }: DayViewProps) {
  const dayEvents = events.filter((event) => isSameDay(event.date, currentDate))

  // Sort events by time
  const sortedEvents = dayEvents.sort((a, b) => {
    if (!a.time && !b.time) return 0
    if (!a.time) return 1
    if (!b.time) return -1
    return a.time.localeCompare(b.time)
  })

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return `${hour}:00`
  })

  const getEventsForTimeSlot = (timeSlot: string) => {
    return sortedEvents.filter((event) => event.time?.startsWith(timeSlot.split(":")[0]))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {format(currentDate, "EEEE, dd MMMM yyyy", { locale: vi })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">{dayEvents.length} sự kiện trong ngày</div>
        </CardContent>
      </Card>

      {dayEvents.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Không có sự kiện nào trong ngày này</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {/* Events without specific time */}
          {sortedEvents.filter((event) => !event.time).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cả ngày</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sortedEvents
                  .filter((event) => !event.time)
                  .map((event) => (
                    <Badge
                      key={event.id}
                      variant="outline"
                      className={cn("w-full justify-start cursor-pointer p-3 h-auto", eventTypeColors[event.type])}
                      onClick={() => onEventClick(event)}
                    >
                      <div className="text-left w-full">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs opacity-75">{eventTypeLabels[event.type]}</div>
                        </div>
                        {event.description && <div className="text-xs opacity-75 mt-1">{event.description}</div>}
                      </div>
                    </Badge>
                  ))}
              </CardContent>
            </Card>
          )}

          {/* Time-based events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Theo giờ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {timeSlots.map((timeSlot) => {
                  const slotEvents = getEventsForTimeSlot(timeSlot)

                  return (
                    <div key={timeSlot} className="flex border-b border-border/50 last:border-0">
                      <div className="w-16 py-2 text-xs text-muted-foreground font-mono">{timeSlot}</div>
                      <div className="flex-1 py-2 pl-4">
                        {slotEvents.length > 0 ? (
                          <div className="space-y-1">
                            {slotEvents.map((event) => (
                              <Badge
                                key={event.id}
                                variant="outline"
                                className={cn("cursor-pointer p-2 h-auto block", eventTypeColors[event.type])}
                                onClick={() => onEventClick(event)}
                              >
                                <div className="text-left">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-xs">{event.title}</div>
                                    <div className="text-xs opacity-75">{eventTypeLabels[event.type]}</div>
                                  </div>
                                  {event.description && (
                                    <div className="text-xs opacity-75 mt-1">{event.description}</div>
                                  )}
                                </div>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="h-8" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
