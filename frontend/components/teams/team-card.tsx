"use client"

import React from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Users, User, Settings, MoreVertical, Trash2, UserPlus, Eye } from "lucide-react"
import { Team } from "@/lib/team-api"
import { useAuth } from "@/contexts/AuthContext"

interface TeamCardProps {
  team: Team
  onEdit: (team: Team) => void
  onDelete: (teamId: string) => void
  onInvite: (team: Team) => void
}

export function TeamCard({ team, onEdit, onDelete, onInvite }: TeamCardProps) {
  const { user } = useAuth()
  const isOwner = user?._id === team.owner._id
  const isAdmin = team.members.some(member =>
    member.user._id === user?._id &&
    (member.role === 'admin' || member.role === 'owner')
  )

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={team.avatarUrl || "/placeholder-team-avatar.png"} alt={`Avatar của ${team.name}`} />
            <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teams/${team._id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            </Link>
            {(isOwner || isAdmin) && (
              <>
                <DropdownMenuItem onClick={() => onInvite(team)} className="cursor-pointer">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Mời thành viên
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(team)} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Chỉnh sửa nhóm
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {isOwner && (
              <DropdownMenuItem
                onClick={() => onDelete(team._id)}
                className="text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa nhóm
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="text-sm text-muted-foreground mb-4">
          {team.description || "Chưa có mô tả cho nhóm này."}
        </CardDescription>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{team.members.length} thành viên</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <User className="mr-2 h-4 w-4" />
          <span>Chủ sở hữu: {team.owner.name || team.owner.email}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/teams/${team._id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Xem nhóm
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}