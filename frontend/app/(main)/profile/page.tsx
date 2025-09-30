"use client"

import { useState } from "react"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { RecentActivity } from "@/components/profile/recent-activity"
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog"

const mockUser = {
  name: "Nguyễn Văn A",
  email: "nguyen.van.a@company.com",
  phone: "0123456789",
  avatar: "/user-avatar-1.png",
  role: "Senior Frontend Developer",
  department: "Engineering",
  location: "Hà Nội",
  joinDate: "15/01/2023",
  status: "active" as const,
  bio: "Passionate frontend developer với 5+ năm kinh nghiệm trong React, Next.js và TypeScript. Yêu thích tạo ra những giao diện người dùng đẹp và hiệu quả.",
}

const mockStats = {
  tasksCompleted: 28,
  tasksInProgress: 5,
  totalTasks: 35,
  efficiency: 92,
  averageCompletionTime: 2.5,
  currentStreak: 7,
  totalWorkingDays: 18,
  achievements: 12,
}

const mockActivities = [
  {
    id: 1,
    type: "task_completed" as const,
    title: "Hoàn thành thiết kế giao diện trang chủ",
    description: "Đã hoàn thành task thiết kế UI cho trang chủ website mới",
    timestamp: new Date(2024, 0, 16, 14, 30),
    relatedUser: "Trần Thị B",
    relatedUserAvatar: "/diverse-user-avatar-set-2.png",
  },
  {
    id: 2,
    type: "comment_added" as const,
    title: "Thêm bình luận vào task API development",
    description: "Đã review và góp ý về implementation của API endpoints",
    timestamp: new Date(2024, 0, 16, 10, 15),
    relatedUser: "Lê Văn C",
    relatedUserAvatar: "/diverse-user-avatars-3.png",
  },
  {
    id: 3,
    type: "meeting_attended" as const,
    title: "Tham gia họp team hàng tuần",
    description: "Báo cáo tiến độ và thảo luận về kế hoạch tuần tới",
    timestamp: new Date(2024, 0, 15, 9, 0),
  },
  {
    id: 4,
    type: "task_created" as const,
    title: "Tạo task mới: Tối ưu hóa performance",
    description: "Tạo task để cải thiện tốc độ loading của ứng dụng",
    timestamp: new Date(2024, 0, 14, 16, 45),
  },
  {
    id: 5,
    type: "task_completed" as const,
    title: "Hoàn thành code review",
    description: "Đã review và approve pull request của team member",
    timestamp: new Date(2024, 0, 14, 11, 20),
    relatedUser: "Phạm Thị D",
    relatedUserAvatar: "/user-avatar-4.png",
  },
]

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  const handleEditProfile = () => {
    setEditProfileOpen(true)
  }

  const handleChangeAvatar = () => {
    // TODO: Implement avatar change functionality
    console.log("Change avatar")
  }

  const handleSaveProfile = (updatedUser: any) => {
    setUser({ ...user, ...updatedUser })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và theo dõi hiệu suất làm việc</p>
      </div>

      <ProfileHeader user={user} onEditProfile={handleEditProfile} onChangeAvatar={handleChangeAvatar} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileStats stats={mockStats} />
        </div>
        <div>
          <RecentActivity activities={mockActivities} />
        </div>
      </div>

      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  )
}
