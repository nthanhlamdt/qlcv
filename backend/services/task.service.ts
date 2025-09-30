import { FilterQuery } from 'mongoose'
import ErrorHandler from '../utils/ErrorHandler'
import { TaskModel, ITask } from '../models/task.model'

export interface ListTeamTasksParams {
  teamId: string
  status?: string
  priority?: string
  assignee?: string
  search?: string
  page?: number
  limit?: number
}

export async function listTeamTasks(params: ListTeamTasksParams) {
  const { teamId, status, priority, assignee, search, page = 1, limit = 20 } = params

  const query: FilterQuery<ITask> = { team: teamId }
  if (status && status !== 'all') query.status = status as any
  if (priority && priority !== 'all') query.priority = priority as any
  if (assignee && assignee !== 'all') (query as any).assignee = assignee
  if (search) (query as any).title = { $regex: search, $options: 'i' }

  const skip = (page - 1) * limit
  const [tasks, total] = await Promise.all([
    TaskModel.find(query)
      .populate('assignee', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    TaskModel.countDocuments(query),
  ])

  return {
    tasks,
    pagination: { current: page, pages: Math.ceil(total / limit), total },
  }
}

export async function createTask(input: Partial<ITask> & { team: string; title: string; createdBy: string }) {
  const task = await TaskModel.create(input as any)
  return task
}

export async function updateTask(taskId: string, updates: Partial<ITask>) {
  const task = await TaskModel.findByIdAndUpdate(taskId, updates, { new: true })
  if (!task) throw new ErrorHandler('Task không tồn tại', 404)
  return task
}

export async function deleteTask(taskId: string) {
  const task = await TaskModel.findByIdAndDelete(taskId)
  if (!task) throw new ErrorHandler('Task không tồn tại', 404)
  return { success: true }
}


