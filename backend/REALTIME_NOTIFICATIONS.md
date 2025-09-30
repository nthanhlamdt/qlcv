# 🔔 Chức năng Thông báo Realtime

## Tổng quan
Hệ thống thông báo realtime sử dụng Socket.IO để gửi thông báo tức thời đến người dùng đang online.

## Cài đặt và Khởi chạy

### 1. Cài đặt dependencies
```bash
npm install socket.io @types/socket.io
```

### 2. Khởi chạy server
```bash
npm run dev
```

Server sẽ chạy trên `http://localhost:8000` với Socket.IO sẵn sàng.

## API Endpoints

### Thông báo cơ bản
- `GET /api/notifications` - Lấy danh sách thông báo
- `GET /api/notifications/unread-count` - Đếm thông báo chưa đọc
- `POST /api/notifications` - Tạo thông báo mới
- `PATCH /api/notifications/:id/read` - Đánh dấu đã đọc
- `DELETE /api/notifications/:id` - Xóa thông báo

### Realtime
- `POST /api/realtime/notification` - Gửi thông báo realtime
- `POST /api/realtime/broadcast` - Gửi thông báo broadcast
- `POST /api/realtime/room` - Gửi thông báo đến room
- `GET /api/realtime/online-users` - Danh sách users online
- `POST /api/realtime/task-assigned` - Thông báo giao việc
- `POST /api/realtime/task-completed` - Thông báo hoàn thành

## Socket.IO Events

### Client → Server
- `join_room` - Tham gia room (team, project)
- `leave_room` - Rời khỏi room
- `typing_start` - Bắt đầu gõ
- `typing_stop` - Dừng gõ

### Server → Client
- `new_notification` - Thông báo mới
- `user_typing` - User đang gõ
- `user_stopped_typing` - User dừng gõ

## Cách sử dụng từ Frontend

### 1. Kết nối Socket.IO
```javascript
import io from 'socket.io-client'

const socket = io('http://localhost:8000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
})

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('new_notification', (notification) => {
  console.log('New notification:', notification)
  // Hiển thị thông báo trong UI
})
```

### 2. Tham gia room
```javascript
// Tham gia room team
socket.emit('join_room', 'team_123')

// Tham gia room project
socket.emit('join_room', 'project_456')
```

### 3. Gửi thông báo
```javascript
// Gửi thông báo đến user cụ thể
fetch('/api/realtime/notification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    recipientId: 'user_id',
    type: 'task_assigned',
    title: 'Công việc mới',
    message: 'Bạn có công việc mới được giao',
    data: { taskId: 'task_123' }
  })
})
```

## Các loại thông báo

### 1. Task Assigned
```javascript
{
  type: 'task_assigned',
  title: 'Công việc mới được giao',
  message: 'Bạn đã được giao công việc: Thiết kế UI',
  data: { taskId: 'task_123' }
}
```

### 2. Task Completed
```javascript
{
  type: 'task_completed',
  title: 'Công việc đã hoàn thành',
  message: 'Công việc "Thiết kế UI" đã được hoàn thành',
  data: { taskId: 'task_123' }
}
```

### 3. Team Invite
```javascript
{
  type: 'team_invite',
  title: 'Lời mời tham gia nhóm',
  message: 'Bạn được mời tham gia nhóm: Frontend Team',
  data: { teamId: 'team_123' }
}
```

### 4. System Notification
```javascript
{
  type: 'system',
  title: 'Thông báo hệ thống',
  message: 'Hệ thống sẽ bảo trì vào 2:00 AM',
  data: {}
}
```

## Test chức năng

### 1. Chạy test script
```bash
node test-realtime.js
```

### 2. Test với Postman
```bash
# Gửi thông báo test
POST http://localhost:8000/api/realtime/notification
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "recipientId": "user_id",
  "type": "system",
  "title": "Test Notification",
  "message": "This is a test notification"
}
```

## Cấu trúc Database

### Notification Model
```javascript
{
  recipient: ObjectId, // User nhận thông báo
  sender: ObjectId,    // User gửi thông báo (optional)
  type: String,        // Loại thông báo
  title: String,       // Tiêu đề
  message: String,     // Nội dung
  data: Object,        // Dữ liệu bổ sung
  isRead: Boolean,     // Đã đọc chưa
  readAt: Date,        // Thời gian đọc
  createdAt: Date,     // Thời gian tạo
  updatedAt: Date      // Thời gian cập nhật
}
```

## Bảo mật

- Tất cả Socket.IO connections đều cần JWT token
- Middleware xác thực kiểm tra token trước khi cho phép kết nối
- Users chỉ có thể nhận thông báo của chính họ
- Room-based notifications cần quyền truy cập phù hợp

## Monitoring

- Log tất cả kết nối/disconnect
- Track số lượng users online
- Monitor performance của Socket.IO
- Log lỗi và exceptions

## Troubleshooting

### 1. Kết nối thất bại
- Kiểm tra JWT token có hợp lệ không
- Kiểm tra CORS settings
- Kiểm tra server có chạy không

### 2. Không nhận được thông báo
- Kiểm tra user có online không
- Kiểm tra room có đúng không
- Kiểm tra event listeners

### 3. Performance issues
- Giới hạn số lượng connections
- Sử dụng Redis adapter cho scaling
- Optimize database queries
