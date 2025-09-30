import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.model'
import { createNotification } from './notification.service'

interface AuthenticatedSocket extends Socket {
  user?: any
}

interface Socket {
  id: string
  user?: any
  join: (room: string) => void
  leave: (room: string) => void
  emit: (event: string, data: any) => void
  to: (room: string) => any
  broadcast: any
  disconnect: () => void
}

class SocketService {
  private io: SocketIOServer
  private connectedUsers: Map<string, string> = new Map() // userId -> socketId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    })

    this.setupMiddleware()
    this.setupEventHandlers()
  }

  private setupMiddleware() {
    // Middleware xác thực Socket.IO
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]

        if (!token) {
          return next(new Error('Token không tồn tại'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }
        const user = await UserModel.findById(decoded.id)

        if (!user) {
          return next(new Error('User không tồn tại'))
        }

        socket.user = user
        next()
      } catch (error) {
        next(new Error('Token không hợp lệ'))
      }
    })
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User ${socket.user?.name} connected with socket ${socket.id}`)

      // Lưu mapping user -> socket
      if (socket.user) {
        this.connectedUsers.set(socket.user.id, socket.id)
      }

      // Join room theo user ID
      if (socket.user) {
        socket.join(`user_${socket.user.id}`)
      }

      // Xử lý disconnect
      socket.on('disconnect', () => {
        console.log(`User ${socket.user?.name} disconnected`)
        if (socket.user) {
          this.connectedUsers.delete(socket.user.id)
        }
      })

      // Xử lý join room (team, project, etc.)
      socket.on('join_room', (roomId: string) => {
        socket.join(roomId)
        console.log(`User ${socket.user?.name} joined room ${roomId}`)
      })

      // Xử lý leave room
      socket.on('leave_room', (roomId: string) => {
        socket.leave(roomId)
        console.log(`User ${socket.user?.name} left room ${roomId}`)
      })

      // Xử lý typing events
      socket.on('typing_start', (data: { roomId: string }) => {
        socket.to(data.roomId).emit('user_typing', {
          userId: socket.user?.id,
          userName: socket.user?.name,
        })
      })

      socket.on('typing_stop', (data: { roomId: string }) => {
        socket.to(data.roomId).emit('user_stopped_typing', {
          userId: socket.user?.id,
          userName: socket.user?.name,
        })
      })
    })
  }

  // Gửi thông báo đến user cụ thể
  public async sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.connectedUsers.get(userId)

    if (socketId) {
      this.io.to(socketId).emit('new_notification', notification)
      console.log(`Notification sent to user ${userId}`)
    } else {
      console.log(`User ${userId} is not connected`)
    }
  }

  // Gửi thông báo đến room (team, project)
  public sendNotificationToRoom(roomId: string, notification: any) {
    this.io.to(roomId).emit('new_notification', notification)
    console.log(`Notification sent to room ${roomId}`)
  }

  // Broadcast thông báo đến tất cả users
  public broadcastNotification(notification: any) {
    this.io.emit('new_notification', notification)
    console.log('Notification broadcasted to all users')
  }

  // Gửi thông báo realtime và lưu vào database
  public async createAndSendNotification(
    recipientId: string,
    type: 'task_assigned' | 'task_completed' | 'task_updated' | 'team_invite' | 'system' | 'mention',
    title: string,
    message: string,
    senderId?: string,
    data?: any
  ) {
    try {
      // Tạo thông báo trong database
      const notification = await createNotification({
        recipientId,
        senderId,
        type,
        title,
        message,
        data,
      })

      // Gửi thông báo realtime
      await this.sendNotificationToUser(recipientId, notification)

      return notification
    } catch (error) {
      console.error('Error creating and sending notification:', error)
      throw error
    }
  }

  // Gửi thông báo đến nhiều users
  public async createAndSendBroadcastNotification(
    recipientIds: string[],
    type: 'task_assigned' | 'task_completed' | 'task_updated' | 'team_invite' | 'system' | 'mention',
    title: string,
    message: string,
    senderId?: string,
    data?: any
  ) {
    try {
      const notifications = []

      for (const recipientId of recipientIds) {
        const notification = await createNotification({
          recipientId,
          senderId,
          type,
          title,
          message,
          data,
        })

        notifications.push(notification)
        await this.sendNotificationToUser(recipientId, notification)
      }

      return notifications
    } catch (error) {
      console.error('Error creating and sending broadcast notification:', error)
      throw error
    }
  }

  // Lấy danh sách users đang online
  public getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys())
  }

  // Kiểm tra user có online không
  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId)
  }

  // Lấy Socket.IO instance
  public getIO(): SocketIOServer {
    return this.io
  }
}

export default SocketService
