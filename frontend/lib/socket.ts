import { io, Socket } from 'socket.io-client'

class SocketService {
  private socket: Socket | null = null
  private listeners: Map<string, Function[]> = new Map()

  connect(token: string) {
    if (this.socket?.connected) {
      return
    }

    this.socket = io('http://localhost:8000', {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason)
    })

    // Listen for new notifications
    this.socket.on('new_notification', (notification) => {
      this.emit('new_notification', notification)
    })

    // Listen for online users updates
    this.socket.on('getOnlineUsers', (users) => {
      this.emit('online_users', users)
    })

    // Listen for typing indicators
    this.socket.on('typing_start', (data) => {
      this.emit('typing_start', data)
    })

    this.socket.on('typing_stop', (data) => {
      this.emit('typing_stop', data)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Join a room
  joinRoom(roomName: string) {
    if (this.socket) {
      this.socket.emit('join_room', roomName)
    }
  }

  // Leave a room
  leaveRoom(roomName: string) {
    if (this.socket) {
      this.socket.emit('leave_room', roomName)
    }
  }

  // Send typing start event
  startTyping(roomName: string) {
    if (this.socket) {
      this.socket.emit('typing_start', roomName)
    }
  }

  // Send typing stop event
  stopTyping(roomName: string) {
    if (this.socket) {
      this.socket.emit('typing_stop', roomName)
    }
  }

  // Event listener system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback?: Function) {
    if (!this.listeners.has(event)) return

    if (callback) {
      const callbacks = this.listeners.get(event)!
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    } else {
      this.listeners.delete(event)
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => callback(data))
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

export const socketService = new SocketService()
