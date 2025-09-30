"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, CheckCircle, Clock, MessageSquare, User, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

interface ActivityItem {
  id: number
  type: "task_completed" | "task_created" | "comment_added" | "meeting_attended"
  title: string
  description: string
  timestamp: Date
  relatedUser?: string
  relatedUserAvatar?: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

const activityIcons = {
  task_completed: CheckCircle,
  task_created: Clock,
  comment_added: MessageSquare,
  meeting_attended: Calendar,
}

const activityColors = {
  task_completed: "text-green-500",
  task_created: "text-blue-500",
  comment_added: "text-purple-500",
  meeting_attended: "text-orange-500",
}

const activityBadges = {
  task_completed: "bg-green-500/10 text-green-500 border-green-500/20",
  task_created: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  comment_added: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  meeting_attended: "bg-orange-500/10 text-orange-500 border-orange-500/20",
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Hoạt động gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type]
            return (
              <div key={activity.id} className="flex space-x-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Icon className={`h-4 w-4 ${activityColors[activity.type]}`} />
                  </div>
                  {index < activities.length - 1 && <div className="mt-2 h-6 w-px bg-border" />}
                </div>
                <div className="flex-1 space-y-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <Badge variant="outline" className={activityBadges[activity.type]}>
                      {activity.type === "task_completed" && "Hoàn thành"}
                      {activity.type === "task_created" && "Tạo mới"}
                      {activity.type === "comment_added" && "Bình luận"}
                      {activity.type === "meeting_attended" && "Cuộc họp"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center justify-between">
                    {activity.relatedUser && (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage
                            src={activity.relatedUserAvatar || "/placeholder.svg"}
                            alt={activity.relatedUser}
                          />
                          <AvatarFallback>
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{activity.relatedUser}</span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: vi })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
