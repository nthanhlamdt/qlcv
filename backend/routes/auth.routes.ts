import { Router } from 'express'
import { login, register, logout, refreshToken, getUserInfo } from '../controllers/auth.controllers'
import { isAuthenticated } from '../middleware/auth'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get('/me', isAuthenticated, getUserInfo)

export default router
