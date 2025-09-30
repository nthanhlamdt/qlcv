"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"
import { EditTeamDialog } from "@/components/teams/edit-team-dialog"
import { TeamCard } from "@/components/teams/team-card"
import { teamApi, Team } from "@/lib/team-api"
import { toast } from "sonner"
import { Search, Filter, Plus } from "lucide-react"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterVisibility, setFilterVisibility] = useState<string>("all")
  const [editTeam, setEditTeam] = useState<Team | null>(null)

  const loadTeams = async () => {
    try {
      setLoading(true)
      console.log("Loading teams...")
      const response = await teamApi.getMyTeams()

      console.log("Teams response:", response)
      console.log("Teams data:", response.teams)
      setTeams(response.teams || [])
    } catch (error: any) {
      console.error("Error loading teams:", error)
      toast.error(error.message || "Không thể tải danh sách nhóm")
      setTeams([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
  }, [])

  const handleCreateTeam = (newTeam: Team) => {
    setTeams(prevTeams => [newTeam, ...prevTeams])
  }

  const handleEditTeam = (team: Team) => {
    setEditTeam(team)
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhóm này?")) {
      return
    }
    try {
      await teamApi.deleteTeam(teamId)
      setTeams(prevTeams => prevTeams.filter(team => team._id !== teamId))
      toast.success("Nhóm đã được xóa thành công")
    } catch (error: any) {
      console.error("Error deleting team:", error)
      toast.error(error.response?.data?.message || "Không thể xóa nhóm")
    }
  }

  const handleInviteMember = (team: Team) => {
    // TODO: Implement invite member functionality
    toast.info(`Mời thành viên vào nhóm: ${team.name}`)
  }

  const filteredTeams = teams.filter(team => {
    if (!team || !team.name) return false

    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesVisibility = filterVisibility === "all" ||
      team.settings?.visibility === filterVisibility

    return matchesSearch && matchesVisibility
  })

  console.log("Teams state:", teams)
  console.log("Filtered teams:", filteredTeams)
  console.log("Loading state:", loading)

  console.log(filteredTeams)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Quản lý nhóm</h1>
          <p className="text-muted-foreground">Tạo và quản lý các nhóm làm việc của bạn</p>
        </div>
        <CreateTeamDialog onCreateTeam={handleCreateTeam} />
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm nhóm..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterVisibility} onValueChange={setFilterVisibility}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Lọc theo hiển thị" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="public">Công khai</SelectItem>
            <SelectItem value="private">Riêng tư</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <TeamCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          <p>Không tìm thấy nhóm nào.</p>
          <p>Hãy tạo nhóm đầu tiên của bạn!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {editTeam && (
        <EditTeamDialog
          team={editTeam}
          open={Boolean(editTeam)}
          onOpenChange={(o) => { if (!o) setEditTeam(null) }}
          onUpdated={(updated) => {
            setTeams(prev => prev.map(t => t._id === updated._id ? updated : t))
            setEditTeam(null)
          }}
        />
      )}
    </div>
  )
}

function TeamCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-9 w-9 rounded-full bg-muted" />
        <div className="h-5 w-32 bg-muted rounded" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-2/3 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
    </div>
  )
}