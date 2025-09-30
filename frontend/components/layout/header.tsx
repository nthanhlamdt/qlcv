"use client"

import { Bell, Search, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { postJson } from "@/lib/api"
import * as DM from "@radix-ui/react-dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { NotificationCenter } from "@/components/notifications/notification-center"

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Tìm kiếm công việc, nhóm..." className="pl-10 bg-muted border-0" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <NotificationCenter />

        <DM.Root>
          <DM.Trigger asChild>
            <Button type="button" variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-user-avatars.png" alt="Avatar" />
                <AvatarFallback>NV</AvatarFallback>
              </Avatar>
            </Button>
          </DM.Trigger>
          <DM.Portal>
            <DM.Content align="end" sideOffset={8} className="w-56 z-[1000] bg-popover text-popover-foreground rounded-md border p-1 shadow-md">
              <DM.Label className="font-normal px-2 py-1.5 text-sm">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
              </DM.Label>
              <DM.Separator className="-mx-1 my-1 h-px bg-muted" />
              <DM.Item className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent">
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
              </DM.Item>
              <DM.Item
                className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                onClick={() => router.push('/invites')}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Lời mời tham gia</span>
              </DM.Item>
              <DM.Item className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent">
                <span>Cài đặt</span>
              </DM.Item>
              <DM.Separator className="-mx-1 my-1 h-px bg-muted" />
              <DM.Item
                className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                onClick={async () => {
                  try {
                    await postJson('/auth/logout', {})
                    logout()
                    toast.success('Đã đăng xuất')
                    router.replace('/auth/login')
                    router.refresh()
                  } catch (error) {
                    toast.error('Lỗi khi đăng xuất')
                  }
                }}
              >
                <span>Đăng xuất</span>
              </DM.Item>
            </DM.Content>
          </DM.Portal>
        </DM.Root>
      </div>
    </header>
  )
}
