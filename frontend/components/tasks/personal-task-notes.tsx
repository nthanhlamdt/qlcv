"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StickyNote, Plus, Edit2, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { taskApi } from "@/lib/task-api"

interface Note {
  id: string | number
  content: string
  createdAt: Date
  updatedAt?: Date
}

interface PersonalTaskNotesProps {
  taskId: number | string
}

const initialNotes: Note[] = []

export function PersonalTaskNotes({ taskId }: PersonalTaskNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [newNote, setNewNote] = useState("")
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    // Load notes from task details if needed later
  }, [taskId])

  const handleAddNote = async () => {
    if (!newNote.trim()) return
    const res = await taskApi.addNote(String(taskId), newNote.trim())
    const note: Note = { id: (res as any)._id || Date.now(), content: newNote.trim(), createdAt: new Date() }
    setNotes([note, ...notes])
    setNewNote("")
  }

  const handleEditNote = (noteId: any) => {
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

  const handleDeleteNote = (noteId: any) => {
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
                      {(() => {
                        const created = new Date(note.createdAt)
                        const updated = note.updatedAt ? new Date(note.updatedAt) : created
                        const label = note.updatedAt && updated.getTime() > created.getTime() ? "Cập nhật" : "Tạo"
                        return `${label} ${formatDistanceToNow(updated, { addSuffix: true, locale: vi })}`
                      })()}
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
