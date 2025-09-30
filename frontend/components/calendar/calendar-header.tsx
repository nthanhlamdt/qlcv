"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface CalendarHeaderProps {
  currentDate: Date
  viewMode: "month" | "week" | "day"
  onDateChange: (date: Date) => void
  onViewModeChange: (mode: "month" | "week" | "day") => void
  onCreateEvent: () => void
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onDateChange,
  onViewModeChange,
  onCreateEvent,
}: CalendarHeaderProps) {
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)

    if (viewMode === "month") {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    }

    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  const getDateTitle = () => {
    if (viewMode === "month") {
      return format(currentDate, "MMMM yyyy", { locale: vi })
    } else if (viewMode === "week") {
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      return `${format(startOfWeek, "dd/MM", { locale: vi })} - ${format(endOfWeek, "dd/MM/yyyy", { locale: vi })}`
    } else {
      return format(currentDate, "dd MMMM yyyy", { locale: vi })
    }
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hôm nay
          </Button>
        </div>
        <h1 className="text-2xl font-bold capitalize">{getDateTitle()}</h1>
      </div>

      <div className="flex items-center space-x-2">
        <Select value={viewMode} onValueChange={(value: "month" | "week" | "day") => onViewModeChange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Tháng</SelectItem>
            <SelectItem value="week">Tuần</SelectItem>
            <SelectItem value="day">Ngày</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onCreateEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo sự kiện
        </Button>
      </div>
    </div>
  )
}
