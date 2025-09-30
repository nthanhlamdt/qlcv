"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"
import { TeamCard } from "@/components/teams/team-card"
import { InviteMemberDialog } from "@/components/teams/invite-member-dialog"
import { teamApi, Team } from "@/lib/team-api"
import { toast } from "sonner"
import { Search, Filter, Plus } from "lucide-react"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterVisibility, setFilterVisibility] = useState<string>("all")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await teamApi.getMyTeams()
      setTeams(response.teams)
    } catch (error: any) {
      console.error("Error loading teams:", error)
      toast.error("Không thể tải danh sách nhóm")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const handleTeamCreated = (newTeam: Team) => {
    setTeams(prev => [newTeam, ...prev])
  }

  const handleEditTeam = (team: Team) => {
    // TODO: Implement edit team functionality
    toast.info("Chức năng chỉnh sửa nhóm sẽ được phát triển")
  }

  const handleDeleteTeam = async (team: Team) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhóm "${team.name}"?`)) {
      return
    }

    try {
      await teamApi.deleteTeam(team._id)
      setTeams(prev => prev.filter(t => t._id !== team._id))
      toast.success("Đã xóa nhóm thành công")
    } catch (error: any) {
      console.error("Error deleting team:", error)
      toast.error(error.response?.data?.message || "Không thể xóa nhóm")
    }
  }

  const handleInviteMember = (team: Team) => {
    setSelectedTeam(team)
  }

  const handleMemberInvited = () => {
    // Reload teams to get updated member count
    loadTeams()
  }

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesVisibility = filterVisibility === "all" ||
      team.settings?.visibility === filterVisibility

    return matchesSearch && matchesVisibility
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý nhóm</h1>
            <p className="text-muted-foreground">Quản lý các nhóm làm việc của bạn</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý nhóm</h1>
          <p className="text-muted-foreground">Quản lý các nhóm làm việc của bạn</p>
        </div>
        <CreateTeamDialog onTeamCreated={handleTeamCreated} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm nhóm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterVisibility} onValueChange={setFilterVisibility}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Lọc theo quyền riêng tư" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="public">Công khai</SelectItem>
            <SelectItem value="private">Riêng tư</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm || filterVisibility !== "all"
              ? "Không tìm thấy nhóm nào"
              : "Chưa có nhóm nào"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterVisibility !== "all"
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              : "Tạo nhóm đầu tiên để bắt đầu cộng tác"}
          </p>
          {(!searchTerm && filterVisibility === "all") && (
            <CreateTeamDialog onTeamCreated={handleTeamCreated} />
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team._id}
              team={team}
              onEdit={handleEditTeam}
              onDelete={handleDeleteTeam}
              onInvite={handleInviteMember}
            />
          ))}
        </div>
      )}

      {/* Invite Member Dialog */}
      {selectedTeam && (
        <InviteMemberDialog
          team={selectedTeam}
          onMemberInvited={handleMemberInvited}
        />
      )}
    </div>
  )
}
