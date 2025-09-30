"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, User } from "lucide-react"

const topPerformers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "/user-avatar-1.png",
    role: "Frontend Developer",
    tasksCompleted: 28,
    efficiency: 95,
    rank: 1,
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "/diverse-user-avatar-set-2.png",
    role: "Backend Developer",
    tasksCompleted: 25,
    efficiency: 92,
    rank: 2,
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: "/diverse-user-avatars-3.png",
    role: "QA Engineer",
    tasksCompleted: 22,
    efficiency: 89,
    rank: 3,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    avatar: "/user-avatar-4.png",
    role: "UI/UX Designer",
    tasksCompleted: 20,
    efficiency: 87,
    rank: 4,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    avatar: "/diverse-user-avatars.png",
    role: "DevOps Engineer",
    tasksCompleted: 18,
    efficiency: 85,
    rank: 5,
  },
]

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "text-yellow-500"
    case 2:
      return "text-gray-400"
    case 3:
      return "text-orange-600"
    default:
      return "text-muted-foreground"
  }
}

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case 2:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    case 3:
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function TopPerformers() {
  return (
    <Card className="chart-animate">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.map((performer) => (
            <div key={performer.id} className="flex items-center space-x-4 p-3 rounded-lg border border-border">
              <Badge variant="outline" className={getRankBadge(performer.rank)}>
                #{performer.rank}
              </Badge>

              <Avatar className="h-10 w-10">
                <AvatarImage src={performer.avatar || "/placeholder.svg"} alt={performer.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{performer.name}</p>
                    <p className="text-xs text-muted-foreground">{performer.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{performer.tasksCompleted} công việc</p>
                    <p className="text-xs text-muted-foreground">{performer.efficiency}% hiệu suất</p>
                  </div>
                </div>
                <Progress value={performer.efficiency} className="h-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
