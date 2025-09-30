import { Request, Response } from 'express'
import { CatchAsyncError } from '../utils/CatchAsyncError'
import { createTask, deleteTask, listTeamTasks, updateTask } from '../services/task.service'

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
  const task = await createTask({ ...req.body, team: teamId, createdBy: userId })
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


