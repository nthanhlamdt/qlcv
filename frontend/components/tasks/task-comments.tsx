"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

interface Comment {
  id: number
  author: string
  avatar?: string
  content: string
  createdAt: Date
}

interface TaskCommentsProps {
  taskId: number
}

const initialComments: Comment[] = [
  {
    id: 1,
    author: "Nguyễn Văn A",
    avatar: "/user-avatar-1.png",
    content: "Tôi đã hoàn thành phần thiết kế mockup. Các bạn có thể xem và góp ý thêm.",
    createdAt: new Date(2024, 0, 15, 10, 30),
  },
  {
    id: 2,
    author: "Trần Thị B",
    avatar: "/diverse-user-avatar-set-2.png",
    content: "Mockup trông rất tốt! Tôi nghĩ chúng ta nên thêm một số animation để trang web sinh động hơn.",
    createdAt: new Date(2024, 0, 15, 14, 45),
  },
  {
    id: 3,
    author: "Lê Văn C",
    avatar: "/diverse-user-avatars-3.png",
    content: "Đồng ý với ý kiến của Trần Thị B. Ngoài ra, chúng ta cũng cần chú ý đến responsive design cho mobile.",
    createdAt: new Date(2024, 0, 16, 9, 15),
  },
]

export function TaskComments({ taskId }: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      author: "Bạn",
      avatar: "/diverse-user-avatars.png",
      content: newComment,
      createdAt: new Date(),
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Bình luận ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: vi })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Thêm bình luận..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment} size="sm">
                <Send className="mr-2 h-4 w-4" />
                Gửi bình luận
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
