"use client"

import { useState } from "react"
import { TeamCard } from "@/components/teams/team-card"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"

const initialProjects = [
  {
    id: 1,
    name: "Website Thương mại điện tử",
    description:
      "Dự án phát triển website bán hàng online với đầy đủ tính năng thanh toán, quản lý đơn hàng và tích hợp với các hệ thống vận chuyển.",
    collaborators: [
      { id: 1, name: "Nguyễn Văn A", avatar: "/user-avatar-1.png", role: "Project Lead" },
      { id: 2, name: "Trần Thị B", avatar: "/diverse-user-avatar-set-2.png", role: "Frontend Developer" },
      { id: 3, name: "Lê Văn C", avatar: "/diverse-user-avatars-3.png", role: "Backend Developer" },
      { id: 4, name: "Phạm Thị D", avatar: "/user-avatar-4.png", role: "UI/UX Designer" },
    ],
    activeTasks: 15,
    completedTasks: 42,
    progress: 75,
    deadline: "30/03/2024",
    priority: "high" as const,
    status: "active" as const,
  },
  {
    id: 2,
    name: "Ứng dụng Mobile Banking",
    description:
      "Phát triển ứng dụng ngân hàng di động với các tính năng chuyển tiền, thanh toán hóa đơn và quản lý tài khoản.",
    collaborators: [
      { id: 5, name: "Hoàng Văn E", avatar: "/diverse-user-avatars.png", role: "Mobile Developer" },
      { id: 6, name: "Nguyễn Thị F", avatar: "/diverse-user-avatars.png", role: "Security Engineer" },
      { id: 7, name: "Trần Văn G", avatar: "/user-avatar-1.png", role: "QA Engineer" },
    ],
    activeTasks: 12,
    completedTasks: 28,
    progress: 60,
    deadline: "15/04/2024",
    priority: "high" as const,
    status: "active" as const,
  },
  {
    id: 3,
    name: "Hệ thống CRM",
    description:
      "Xây dựng hệ thống quản lý khách hàng với tính năng theo dõi leads, quản lý pipeline và báo cáo doanh số.",
    collaborators: [
      { id: 8, name: "Lê Thị H", avatar: "/diverse-user-avatar-set-2.png", role: "Full-stack Developer" },
      { id: 9, name: "Phạm Văn I", avatar: "/user-avatar-1.png", role: "Business Analyst" },
    ],
    activeTasks: 8,
    completedTasks: 35,
    progress: 85,
    deadline: "20/02/2024",
    priority: "medium" as const,
    status: "active" as const,
  },
  {
    id: 4,
    name: "Website Portfolio",
    description: "Thiết kế và phát triển website portfolio cho công ty, showcase các dự án và dịch vụ.",
    collaborators: [
      { id: 10, name: "Nguyễn Thị J", avatar: "/diverse-user-avatars-3.png", role: "Designer" },
      { id: 11, name: "Trần Văn K", avatar: "/user-avatar-4.png", role: "Frontend Developer" },
    ],
    activeTasks: 3,
    completedTasks: 18,
    progress: 95,
    deadline: "10/02/2024",
    priority: "low" as const,
    status: "completed" as const,
  },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [createProjectOpen, setCreateProjectOpen] = useState(false)

  const handleCreateProject = (newProject: any) => {
    setProjects([newProject, ...projects])
  }

  const handleEditProject = (project: any) => {
    console.log("Edit project:", project)
  }

  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter((project) => project.id !== projectId))
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Dự án nhóm</h1>
          <p className="text-muted-foreground">Quản lý các dự án cộng tác và theo dõi tiến độ</p>
        </div>
        <Button onClick={() => setCreateProjectOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo dự án mới
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm dự án..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Đang thực hiện</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="paused">Tạm dừng</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Độ ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="medium">Trung bình</SelectItem>
            <SelectItem value="low">Thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <TeamCard key={project.id} team={project} onEdit={handleEditProject} onDelete={handleDeleteProject} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? "Không tìm thấy dự án nào phù hợp"
              : "Chưa có dự án nào"}
          </div>
        </div>
      )}

      <CreateTeamDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        onCreateTeam={handleCreateProject}
      />
    </div>
  )
}
