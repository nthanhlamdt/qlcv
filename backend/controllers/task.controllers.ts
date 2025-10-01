import { Request, Response } from 'express'
import { CatchAsyncError } from '../utils/CatchAsyncError'
import { createTask, deleteTask, listTeamTasks, updateTask, getTaskById, listPersonalTasks, createPersonalTask, addTaskNote } from '../services/task.service'
import mongoose from 'mongoose'

export const getTeamTasks = CatchAsyncError(async (req: Request, res: Response) => {
  const teamId = req.params.teamId
  const { status, priority, assignee, search, page, limit } = req.query
  const result = await listTeamTasks({
    teamId,
    status: status as string,
    priority: priority as string,
    assignee: assignee as string,
    search: search as string,
    page: page ? parseInt(page as string, 10) : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
  })
  res.status(200).json({ success: true, data: result })
})

export const createTeamTask = CatchAsyncError(async (req: Request, res: Response) => {
  const teamId = req.params.teamId
  const userId = (req as any).user?.id
  const body = req.body || {}
  const task = await createTask({ ...body, team: teamId, createdBy: userId })
  res.status(201).json({ success: true, data: task })
})

export const updateTeamTask = CatchAsyncError(async (req: Request, res: Response) => {
  const taskId = req.params.taskId
  const task = await updateTask(taskId, req.body)
  res.status(200).json({ success: true, data: task })
})

export const deleteTeamTask = CatchAsyncError(async (req: Request, res: Response) => {
  const taskId = req.params.taskId
  const result = await deleteTask(taskId)
  res.status(200).json({ success: true, ...result })
})

export const getTask = CatchAsyncError(async (req: Request, res: Response) => {
  const taskId = req.params.taskId
  const task = await getTaskById(taskId)
  res.status(200).json({ success: true, data: task })
})

export const getPersonalTasks = CatchAsyncError(async (req: Request, res: Response) => {
  const authUser: any = (req as any).user
  const userId = authUser?._id || authUser?.id
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
  const { status, priority, search, page, limit } = req.query
  const result = await listPersonalTasks({
    userId,
    status: status as string,
    priority: priority as string,
    search: search as string,
    page: page ? parseInt(page as string, 10) : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
  })
  res.status(200).json({ success: true, data: result })
})

export const createPersonal = CatchAsyncError(async (req: Request, res: Response) => {
  const authUser: any = (req as any).user
  const userId = authUser?._id || authUser?.id
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
  const task = await createPersonalTask({ ...req.body, createdBy: userId })
  res.status(201).json({ success: true, data: task })
})

export const createTaskNote = CatchAsyncError(async (req: Request, res: Response) => {
  const authUser: any = (req as any).user
  const userId = authUser?._id || authUser?.id
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' })
  const taskId = req.params.taskId
  const { content } = req.body
  if (!content) return res.status(400).json({ success: false, message: 'Nội dung ghi chú bắt buộc' })
  const note = await addTaskNote(taskId, content, userId)
  res.status(201).json({ success: true, data: note })
})


