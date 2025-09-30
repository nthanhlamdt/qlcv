import { Router } from 'express'
import { isAuthenticated } from '../middleware/auth'
import { createTeamTask, deleteTeamTask, getTeamTasks, updateTeamTask } from '../controllers/task.controllers'

const router = Router()

// Team-scoped tasks
router.get('/teams/:teamId/tasks', isAuthenticated, getTeamTasks)
router.post('/teams/:teamId/tasks', isAuthenticated, createTeamTask)
router.put('/tasks/:taskId', isAuthenticated, updateTeamTask)
router.delete('/tasks/:taskId', isAuthenticated, deleteTeamTask)

export default router


