"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, Calendar, User, Crown, Shield, UserX } from "lucide-react"

interface TeamMember {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
  teamRole: "leader" | "member" | "admin"
  joinDate: string
  tasksCompleted: number
  efficiency: number
  status: "active" | "inactive"
}

interface TeamMemberListProps {
  members: TeamMember[]
  onEditMember: (member: TeamMember) => void
  onRemoveMember: (memberId: number) => void
}

const teamRoleColors = {
  leader: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  member: "bg-blue-500/10 text-blue-500 border-blue-500/20",
}

const teamRoleLabels = {
  leader: "Trưởng nhóm",
  admin: "Quản trị viên",
  member: "Thành viên",
}

const teamRoleIcons = {
  leader: Crown,
  admin: Shield,
  member: User,
}

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

const statusLabels = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
}

export function TeamMemberList({ members, onEditMember, onRemoveMember }: TeamMemberListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Thành viên nhóm ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => {
            const RoleIcon = teamRoleIcons[member.teamRole]
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{member.name}</h3>
                      <Badge variant="outline" className={teamRoleColors[member.teamRole]}>
                        <RoleIcon className="mr-1 h-3 w-3" />
                        {teamRoleLabels[member.teamRole]}
                      </Badge>
                      <Badge variant="outline" className={statusColors[member.status]}>
                        {statusLabels[member.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Tham gia: {member.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right text-sm">
                    <div className="font-medium">{member.tasksCompleted} công việc</div>
                    <div className="text-muted-foreground">{member.efficiency}% hiệu suất</div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditMember(member)}>
                        <User className="mr-2 h-4 w-4" />
                        Xem hồ sơ
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditMember(member)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Thay đổi vai trò
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRemoveMember(member.id)} className="text-destructive">
                        <UserX className="mr-2 h-4 w-4" />
                        Xóa khỏi nhóm
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
