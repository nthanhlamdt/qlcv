import { Router } from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
  sendRealtimeNotification,
  sendBroadcastNotification,
  sendRoomNotification,
  getOnlineUsers,
  checkUserOnline,
  sendTaskAssignedNotification,
  sendTaskCompletedNotification,
} from '../controllers/realtime.controllers'

const router = Router()

// Tất cả routes đều cần xác thực
router.use(isAuthenticated)

// POST /api/realtime/notification - Gửi thông báo realtime đến user cụ thể
router.post('/notification', sendRealtimeNotification)

// POST /api/realtime/broadcast - Gửi thông báo broadcast
router.post('/broadcast', sendBroadcastNotification)

// POST /api/realtime/room - Gửi thông báo đến room
router.post('/room', sendRoomNotification)

// GET /api/realtime/online-users - Lấy danh sách users đang online
router.get('/online-users', getOnlineUsers)

// GET /api/realtime/online/:userId - Kiểm tra user có online không
router.get('/online/:userId', checkUserOnline)

// POST /api/realtime/task-assigned - Gửi thông báo giao việc
router.post('/task-assigned', sendTaskAssignedNotification)

// POST /api/realtime/task-completed - Gửi thông báo hoàn thành công việc
router.post('/task-completed', sendTaskCompletedNotification)

export default router
