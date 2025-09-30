import express from 'express'
import authRoutes from './auth.routes'
import notificationRoutes from './notification.routes'
import realtimeRoutes from './realtime.routes'
import teamRoutes from './team.routes'

const router = express.Router()

// Mount API groups
router.use('/auth', authRoutes)
router.use('/notifications', notificationRoutes)
router.use('/realtime', realtimeRoutes)
router.use('/teams', teamRoutes)

// Root endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chào mừng đến với QLCV API! 🎯',
    documentation: req.protocol + '://' + req.get('host') + '/api',
    health: req.protocol + '://' + req.get('host') + '/test'
  })
})

export const mainRouter = router
