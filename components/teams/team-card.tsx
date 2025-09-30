"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Users, Settings, Trash2, UserPlus } from "lucide-react"
import { Team } from "@/lib/team-api"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"

interface TeamCardProps {
  team: Team
  onEdit?: (team: Team) => void
  onDelete?: (team: Team) => void
  onInvite?: (team: Team) => void
}

export function TeamCard({ team, onEdit, onDelete, onInvite }: TeamCardProps) {
  const activeMembers = team.members.filter(member => member.status === 'active')
  const memberCount = activeMembers.length

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'member':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={team.avatarUrl} alt={team.name} />
              <AvatarFallback>
                {team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <CardDescription className="text-sm">
                {team.description || "Không có mô tả"}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/teams/${team._id}`}>
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(team)}>
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onInvite?.(team)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Mời thành viên
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(team)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa nhóm
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{memberCount} thành viên</span>
              </div>
              <Badge variant="outline" className={getRoleBadgeColor('owner')}>
                {team.settings?.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
              </Badge>
            </div>
            <span>
              {formatDistanceToNow(new Date(team.createdAt), {
                addSuffix: true,
                locale: vi
              })}
            </span>
          </div>

          {activeMembers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Thành viên:</p>
              <div className="flex -space-x-2">
                {activeMembers.slice(0, 5).map((member, index) => (
                  <Avatar key={index} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={member.user.avatarUrl} alt={member.user.name} />
                    <AvatarFallback className="text-xs">
                      {member.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {activeMembers.length > 5 && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                    +{activeMembers.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button asChild className="w-full">
              <Link href={`/teams/${team._id}`}>
                Xem nhóm
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
