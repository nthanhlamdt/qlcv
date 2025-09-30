"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StickyNote, Plus, Edit2, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

interface Note {
  id: number
  content: string
  createdAt: Date
  updatedAt: Date
}

interface PersonalTaskNotesProps {
  taskId: number
}

const initialNotes: Note[] = [
  {
    id: 1,
    content: "Cần tham khảo thêm tài liệu về UX/UI design patterns trước khi bắt đầu thiết kế.",
    createdAt: new Date(2024, 0, 15, 10, 30),
    updatedAt: new Date(2024, 0, 15, 10, 30),
  },
  {
    id: 2,
    content: "Đã tìm hiểu về Figma và các công cụ design. Sẽ bắt đầu tạo wireframe vào ngày mai.",
    createdAt: new Date(2024, 0, 16, 14, 45),
    updatedAt: new Date(2024, 0, 16, 14, 45),
  },
]

export function PersonalTaskNotes({ taskId }: PersonalTaskNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [newNote, setNewNote] = useState("")
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: Date.now(),
      content: newNote,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setNotes([...notes, note])
    setNewNote("")
  }

  const handleEditNote = (noteId: number) => {
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      setEditingNote(noteId)
      setEditContent(note.content)
    }
  }

  const handleSaveEdit = () => {
    if (!editContent.trim() || !editingNote) return

    setNotes(
      notes.map((note) => (note.id === editingNote ? { ...note, content: editContent, updatedAt: new Date() } : note)),
    )
    setEditingNote(null)
    setEditContent("")
  }

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter((note) => note.id !== noteId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="h-5 w-5" />
          Ghi chú cá nhân ({notes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-muted/50 rounded-lg">
              {editingNote === note.id ? (
                <div className="space-y-2">
                  <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      Lưu
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm leading-relaxed mb-2">{note.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {note.updatedAt > note.createdAt ? "Cập nhật" : "Tạo"}{" "}
                      {formatDistanceToNow(note.updatedAt, { addSuffix: true, locale: vi })}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEditNote(note.id)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteNote(note.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Thêm ghi chú cá nhân..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddNote} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Thêm ghi chú
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
