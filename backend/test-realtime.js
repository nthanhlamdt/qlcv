// Test script cho chức năng thông báo realtime
const io = require('socket.io-client')

// Kết nối đến server
const socket = io('http://localhost:8000', {
  auth: {
    token: 'YOUR_JWT_TOKEN_HERE' // Thay thế bằng token thực tế
  }
})

// Lắng nghe kết nối
socket.on('connect', () => {
  console.log('✅ Connected to server')
  console.log('Socket ID:', socket.id)
})

// Lắng nghe thông báo mới
socket.on('new_notification', (notification) => {
  console.log('🔔 New notification received:')
  console.log(JSON.stringify(notification, null, 2))
})

// Lắng nghe user typing
socket.on('user_typing', (data) => {
  console.log(`👤 ${data.userName} is typing...`)
})

// Lắng nghe user stopped typing
socket.on('user_stopped_typing', (data) => {
  console.log(`👤 ${data.userName} stopped typing`)
})

// Lắng nghe lỗi
socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message)
})

// Lắng nghe disconnect
socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason)
})

// Test join room
setTimeout(() => {
  console.log('🏠 Joining room: team_123')
  socket.emit('join_room', 'team_123')
}, 2000)

// Test typing events
setTimeout(() => {
  console.log('⌨️ Simulating typing...')
  socket.emit('typing_start', { roomId: 'team_123' })

  setTimeout(() => {
    console.log('⌨️ Stopping typing...')
    socket.emit('typing_stop', { roomId: 'team_123' })
  }, 3000)
}, 5000)

// Giữ kết nối
process.on('SIGINT', () => {
  console.log('\n👋 Closing connection...')
  socket.disconnect()
  process.exit(0)
})
