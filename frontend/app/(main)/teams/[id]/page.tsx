"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InviteMemberDialog } from "@/components/teams/invite-member-dialog"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskCard } from "@/components/tasks/task-card"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { taskApi } from "@/lib/task-api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, List } from "lucide-react"
import { teamApi, Team } from "@/lib/team-api"
import { toast } from "sonner"
import { ArrowLeft, Settings, UserPlus, Users, Calendar, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params.id as string

  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [tasks, setTasks] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")
  const [columns, setColumns] = useState<string[]>(['backlog', 'pending', 'in-progress', 'review', 'completed'])
  const [columnTitles, setColumnTitles] = useState<Record<string, string>>({
    backlog: 'Backlog',
    pending: 'Chờ xử lý',
    'in-progress': 'Đang thực hiện',
    review: 'Chờ duyệt',
    completed: 'Hoàn thành',
  })

  const loadTeam = async () => {
    try {
      setLoading(true)
      const teamData = await teamApi.getTeamById(teamId)
      setTeam(teamData)
    } catch (error: any) {
      console.error("Error loading team:", error)
      toast.error("Không thể tải thông tin nhóm")
      router.push("/teams")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (teamId) {
      loadTeam()
    }
  }, [teamId])

  const handleMemberInvited = () => {
    loadTeam()
  }

  const loadTasks = async () => {
    if (!teamId) return
    try {
      const result = await taskApi.listTeamTasks(teamId)
      const list = result.tasks || []
      setTasks(
        list.map((t: any) => ({
          id: t._id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          assignee: Array.isArray(t.assignees) && t.assignees.length > 0
            ? t.assignees.map((u: any) => u?.name).filter(Boolean).join(', ')
            : 'Chưa phân công',
          dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'Chưa có hạn',
          avatar: undefined,
          tags: t.tags || [],
          type: 'team' as const,
          team: team ? { id: team._id, name: team.name, avatar: team.avatarUrl } : undefined,
        }))
      )
    } catch (e) {
      console.error('Load team tasks failed:', e)
    }
  }

  useEffect(() => {
    loadTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId])

  // Load/sync column order per team
  useEffect(() => {
    if (!teamId) return
    try {
      const saved = localStorage.getItem(`kanbanOrder:${teamId}`)
      if (saved) {
        const arr = JSON.parse(saved)
        if (Array.isArray(arr) && arr.every((k) => typeof k === 'string')) {
          setColumns(arr)
        }
      }
    } catch { }
  }, [teamId])

  useEffect(() => {
    if (!teamId) return
    try {
      localStorage.setItem(`kanbanOrder:${teamId}`, JSON.stringify(columns))
    } catch { }
  }, [columns, teamId])

  const handleCreateTask = async (newTask: any) => {
    try {
      const payload = {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        tags: newTask.tags,
        dueDate: newTask.dueDate,
        assignees: newTask.assignees || [],
      }
      await taskApi.createTeamTask(teamId, payload)
      await loadTasks()
    } catch (e) {
      console.error('Create task failed:', e)
    }
  }

  const handleEditTask = async (updated: any) => {
    try {
      await taskApi.updateTask(updated.id, updated)
      await loadTasks()
    } catch (e) {
      console.error('Update task failed:', e)
    }
  }

  const handleDeleteTask = async (taskId: string | number) => {
    try {
      await taskApi.deleteTask(String(taskId))
      await loadTasks()
    } catch (e) {
      console.error('Delete task failed:', e)
    }
  }

  const handleFilterChange = (filters: any) => {
    // placeholder for future backend filters
    console.log('Team task filters:', filters)
  }

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status)

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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Chủ sở hữu'
      case 'admin':
        return 'Quản trị viên'
      case 'member':
        return 'Thành viên'
      default:
        return 'Thành viên'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-muted animate-pulse rounded" />
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Nhóm không tồn tại</h3>
        <p className="text-muted-foreground mb-4">Nhóm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={() => router.push("/teams")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách nhóm
        </Button>
      </div>
    )
  }

  const activeMembers = team.members?.filter(member => member.status === 'active') || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/teams")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{team.name || 'Tên nhóm'}</h1>
            <p className="text-muted-foreground">{team.description || "Không có mô tả"}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {team && (
            <InviteMemberDialog
              team={team}
              onMemberInvited={handleMemberInvited}
            />
          )}
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Cài đặt
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Team Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Thông tin nhóm</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={team.avatarUrl} alt={team.name || 'Team'} />
                <AvatarFallback>
                  {team.name?.charAt(0)?.toUpperCase() || 'T'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{team.name || 'Tên nhóm'}</h3>
                <p className="text-sm text-muted-foreground">
                  Tạo bởi {team.owner?.name || 'Người dùng'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quyền riêng tư</span>
                <Badge variant="outline" className={getRoleBadgeColor('owner')}>
                  {team.settings?.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tự tham gia</span>
                <Badge variant="outline">
                  {team.settings?.allowSelfJoin ? 'Cho phép' : 'Không cho phép'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ngày tạo</span>
                <span className="text-sm">
                  {team.createdAt ? formatDistanceToNow(new Date(team.createdAt), {
                    addSuffix: true,
                    locale: vi
                  }) : 'Không xác định'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Thành viên ({activeMembers.length})</span>
            </CardTitle>
            <CardDescription>
              Danh sách các thành viên trong nhóm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeMembers.map((member) => (
                <div key={member.user._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user.avatarUrl} alt={member.user.name} />
                      <AvatarFallback>
                        {member.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.user.name}</p>
                      <p className="text-xs text-muted-foreground">{member.user.email}</p>
                    </div>
                  </div>
                  <Badge className={getRoleBadgeColor(member.role)}>
                    {getRoleLabel(member.role)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Công việc của nhóm</h2>
            <p className="text-muted-foreground">Quản lý và theo dõi công việc trong nhóm</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <CreateTaskDialog
              onCreateTask={handleCreateTask}
              members={(activeMembers || []).map((m: any) => ({ id: m.user._id, name: m.user.name }))}
            />
          </div>
        </div>

        <TaskFilters onFilterChange={handleFilterChange} />

        <Tabs defaultValue="board" className="space-y-4">
          <TabsList>
            <TabsTrigger value="board">Bảng Kanban</TabsTrigger>
            <TabsTrigger value="all">Tất cả ({tasks.length})</TabsTrigger>
            <TabsTrigger value="pending">Chờ xử lý ({getTasksByStatus("pending").length})</TabsTrigger>
            <TabsTrigger value="in-progress">Đang thực hiện ({getTasksByStatus("in-progress").length})</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành ({getTasksByStatus("completed").length})</TabsTrigger>
          </TabsList>

          {/* Kanban Board */}
          <TabsContent value="board" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {columns.map((key) => ({ key, title: columnTitles[key] })).map((col) => (
                <div
                  key={col.key}
                  className="rounded-md border p-3 min-h-[240px] bg-muted/20"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    const taskIdData = e.dataTransfer.getData('application/qlcv-task')
                    const colKeyData = e.dataTransfer.getData('application/qlcv-column')
                    if (taskIdData) {
                      try {
                        await taskApi.updateTask(String(taskIdData), { status: col.key as any })
                        await loadTasks()
                      } catch (err) {
                        console.error('Move task failed', err)
                      }
                      return
                    }
                    if (colKeyData) {
                      const fromKey = colKeyData
                      const toKey = col.key
                      if (fromKey !== toKey) {
                        const next = [...columns]
                        const fromIndex = next.indexOf(fromKey)
                        const toIndex = next.indexOf(toKey)
                        if (fromIndex !== -1 && toIndex !== -1) {
                          next.splice(toIndex, 0, next.splice(fromIndex, 1)[0])
                          setColumns(next)
                          // Persist to backend
                          try {
                            await teamApi.updateBoard(teamId, next.map((k, i) => ({ key: k, title: columnTitles[k], order: i })))
                          } catch (err) {
                            console.error('Save column order failed', err)
                          }
                        }
                      }
                    }
                  }}
                >
                  <div
                    className="text-sm font-semibold mb-2 flex items-center justify-between gap-2"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/qlcv-column', col.key)
                    }}
                  >
                    <span className="cursor-grab active:cursor-grabbing">{col.title}</span>
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        const next = prompt('Đổi tên cột', columnTitles[col.key])
                        if (next && next.trim()) {
                          setColumnTitles((prev) => ({ ...prev, [col.key]: next.trim() }))
                          // Persist rename
                          const payload = columns.map((k, i) => ({ key: k, title: k === col.key ? next.trim() : columnTitles[k], order: i }))
                          teamApi.updateBoard(teamId, payload).catch((e) => console.error('Save title failed', e))
                        }
                      }}
                    >
                      Đổi tên
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => t.status === col.key)
                      .map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('application/qlcv-task', String(task.id))}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <TaskCard task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {getTasksByStatus("pending").map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {getTasksByStatus("in-progress").map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
              {getTasksByStatus("completed").map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}