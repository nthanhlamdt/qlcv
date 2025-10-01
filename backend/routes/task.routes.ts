import { Router } from 'express'
import { isAuthenticated } from '../middleware/auth'
import { createTeamTask, deleteTeamTask, getTeamTasks, updateTeamTask, getTask, getPersonalTasks, createPersonal, createTaskNote } from '../controllers/task.controllers'

const router = Router()

// Team-scoped tasks
// Team-scoped tasks
router.get('/teams/:teamId/tasks', isAuthenticated, getTeamTasks)
router.post('/teams/:teamId/tasks', isAuthenticated, createTeamTask)

// Personal tasks (declare BEFORE :taskId to avoid route conflicts)
router.get('/personal', isAuthenticated, getPersonalTasks)
router.post('/personal', isAuthenticated, createPersonal)

// Single task by id
router.put('/:taskId', isAuthenticated, updateTeamTask)
router.delete('/:taskId', isAuthenticated, deleteTeamTask)
router.get('/:taskId', isAuthenticated, getTask)
router.post('/:taskId/notes', isAuthenticated, createTaskNote)

export default router


