import { getJson, postJson, putJson, deleteJson } from '@/lib/api'

export interface TaskInput {
  title: string
  description?: string
  status?: 'pending' | 'in-progress' | 'completed'
  priority?: 'high' | 'medium' | 'low'
  assignee?: string
  dueDate?: string | Date
  tags?: string[]
}

export const taskApi = {
  async listTeamTasks(teamId: string, params: any = {}) {
    const qs = new URLSearchParams(params).toString()
    const res = await getJson(`/tasks/teams/${teamId}/tasks${qs ? `?${qs}` : ''}`)
    return res.data || res
  },

  async createTeamTask(teamId: string, data: TaskInput) {
    const res = await postJson(`/tasks/teams/${teamId}/tasks`, data)
    return res.data || res
  },

  async updateTask(taskId: string, data: Partial<TaskInput>) {
    const res = await putJson(`/tasks/tasks/${taskId}`, data)
    return res.data || res
  },

  async deleteTask(taskId: string) {
    const res = await deleteJson(`/tasks/tasks/${taskId}`)
    return res
  },
}


