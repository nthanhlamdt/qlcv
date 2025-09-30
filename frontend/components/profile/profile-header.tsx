"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Edit, Mail, Phone, MapPin, Calendar, User } from "lucide-react"

interface ProfileHeaderProps {
  user: {
    name: string
    email: string
    phone?: string
    avatar?: string
    role: string
    department: string
    location: string
    joinDate: string
    status: "active" | "inactive"
  }
  onEditProfile: () => void
  onChangeAvatar: () => void
}

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

const statusLabels = {
  active: "Đang hoạt động",
  inactive: "Không hoạt động",
}

export function ProfileHeader({ user, onEditProfile, onChangeAvatar }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
              onClick={onChangeAvatar}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.role}</p>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Badge variant="outline" className={statusColors[user.status]}>
                  {statusLabels[user.status]}
                </Badge>
                <Button onClick={onEditProfile}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa hồ sơ
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Tham gia: {user.joinDate}</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Phòng ban:</span> {user.department}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
