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
  if (assignee && assignee !== 'all') (query as any).assignees = assignee
  if (search) (query as any).title = { $regex: search, $options: 'i' }

  const skip = (page - 1) * limit
  const [tasks, total] = await Promise.all([
    TaskModel.find(query)
      .populate('assignees', 'name email avatar')
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

export interface ListPersonalTasksParams {
  userId: string
  status?: string
  priority?: string
  search?: string
  page?: number
  limit?: number
}

export async function listPersonalTasks(params: ListPersonalTasksParams) {
  const { userId, status, priority, search, page = 1, limit = 20 } = params
  const query: FilterQuery<ITask> = { type: 'personal', createdBy: userId }
  if (status && status !== 'all') query.status = status as any
  if (priority && priority !== 'all') query.priority = priority as any
  if (search) (query as any).title = { $regex: search, $options: 'i' }

  const skip = (page - 1) * limit
  const [tasks, total] = await Promise.all([
    TaskModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    TaskModel.countDocuments(query),
  ])
  return { tasks, pagination: { current: page, pages: Math.ceil(total / limit), total } }
}

export async function createPersonalTask(input: Partial<ITask> & { title: string; createdBy: string }) {
  return await TaskModel.create({ ...input, type: 'personal' } as any)
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

export async function getTaskById(taskId: string) {
  const task = await TaskModel.findById(taskId)
    .populate('assignees', 'name email avatar')
    .populate('createdBy', 'name email')
  if (!task) throw new ErrorHandler('Task không tồn tại', 404)
  return task
}

export async function addTaskNote(taskId: string, content: string, userId: string) {
  const task = await TaskModel.findById(taskId)
  if (!task) throw new ErrorHandler('Task không tồn tại', 404)
  const note = { content, createdBy: userId as any, createdAt: new Date() }
    ; (task.notes as any).unshift(note)
  await task.save()
  return note
}


