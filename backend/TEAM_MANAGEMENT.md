# 👥 Chức năng Quản lý Nhóm và Mời Thành viên

## Tổng quan
Hệ thống quản lý nhóm với khả năng mời thành viên bằng email và gửi thông báo realtime. Người được mời có thể xác nhận hoặc từ chối lời mời.

## API Endpoints

### 1. Quản lý Nhóm

#### Tạo nhóm mới
```http
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Frontend Team",
  "description": "Nhóm phát triển giao diện người dùng",
  "avatarUrl": "https://example.com/avatar.jpg",
  "settings": {
    "allowMemberInvite": true,
    "allowMemberCreateProject": true,
    "allowMemberDeleteProject": false
  }
}
```

#### Lấy danh sách nhóm của user
```http
GET /api/teams?memberId=user_id&isActive=true&limit=20&page=1
Authorization: Bearer <token>
```

#### Lấy thông tin chi tiết nhóm
```http
GET /api/teams/:teamId
Authorization: Bearer <token>
```

#### Cập nhật thông tin nhóm
```http
PUT /api/teams/:teamId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Team Name",
  "description": "Updated description"
}
```

#### Xóa nhóm
```http
DELETE /api/teams/:teamId
Authorization: Bearer <token>
```

### 2. Mời Thành viên

#### Mời thành viên mới
```http
POST /api/teams/:teamId/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "inviteeEmail": "newmember@example.com",
  "role": "member",
  "message": "Chào mừng bạn tham gia nhóm!"
}
```

#### Lấy thông tin lời mời (public)
```http
GET /api/teams/invite/:token
```

#### Chấp nhận lời mời
```http
POST /api/teams/invite/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "invite_token_here"
}
```

#### Từ chối lời mời
```http
POST /api/teams/invite/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "invite_token_here"
}
```

#### Lấy danh sách lời mời của user
```http
GET /api/teams/invites/my-invites
Authorization: Bearer <token>
```

### 3. Quản lý Thành viên

#### Xóa thành viên khỏi nhóm
```http
DELETE /api/teams/:teamId/members/:memberId
Authorization: Bearer <token>
```

#### Cập nhật role thành viên
```http
PATCH /api/teams/:teamId/members/:memberId/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

## Các Role trong Nhóm

### Owner
- Tạo và xóa nhóm
- Mời và xóa thành viên
- Cập nhật role thành viên
- Cập nhật cài đặt nhóm
- Tất cả quyền của Admin và Member

### Admin
- Mời thành viên mới
- Xóa thành viên (trừ Owner)
- Cập nhật thông tin nhóm
- Tất cả quyền của Member

### Member
- Xem thông tin nhóm
- Tham gia các hoạt động của nhóm

## Thông báo Realtime

### Khi mời thành viên
- Gửi thông báo realtime đến người được mời (nếu đã có tài khoản)
- Event: `new_notification`
- Type: `team_invite`

### Khi chấp nhận lời mời
- Gửi thông báo đến tất cả thành viên trong nhóm
- Event: `new_notification`
- Type: `team_invite`
- Message: "{user_name} đã tham gia nhóm {team_name}"

### Khi từ chối lời mời
- Không gửi thông báo (chỉ cập nhật trạng thái)

## Cấu trúc Database

### Team Model
```javascript
{
  name: String,           // Tên nhóm
  description: String,    // Mô tả
  avatarUrl: String,      // Avatar nhóm
  members: [{             // Danh sách thành viên
    user: ObjectId,       // ID user
    role: String,         // owner/admin/member
    joinedAt: Date,       // Ngày tham gia
    status: String        // active/pending/suspended
  }],
  owner: ObjectId,        // ID chủ sở hữu
  settings: {             // Cài đặt nhóm
    allowMemberInvite: Boolean,
    allowMemberCreateProject: Boolean,
    allowMemberDeleteProject: Boolean
  },
  isActive: Boolean,      // Trạng thái hoạt động
  createdAt: Date,
  updatedAt: Date
}
```

### TeamInvite Model
```javascript
{
  team: ObjectId,         // ID nhóm
  inviter: ObjectId,      // ID người mời
  inviteeEmail: String,   // Email người được mời
  inviteeUser: ObjectId,  // ID user (nếu có tài khoản)
  role: String,           // admin/member
  status: String,         // pending/accepted/rejected/expired
  token: String,          // Token xác thực
  expiresAt: Date,        // Thời gian hết hạn
  message: String,        // Lời nhắn
  createdAt: Date,
  updatedAt: Date
}
```

## Luồng hoạt động

### 1. Tạo nhóm
1. User tạo nhóm mới
2. User tự động trở thành Owner
3. Nhóm được tạo với cài đặt mặc định

### 2. Mời thành viên
1. Owner/Admin mời thành viên bằng email
2. Tạo TeamInvite record với token
3. Gửi thông báo realtime (nếu user đã có tài khoản)
4. Token có thời hạn 7 ngày

### 3. Chấp nhận lời mời
1. User nhận token từ link hoặc thông báo
2. Gọi API accept với token
3. Thêm user vào nhóm với role được mời
4. Gửi thông báo đến tất cả thành viên
5. Cập nhật trạng thái lời mời

### 4. Từ chối lời mời
1. User gọi API reject với token
2. Cập nhật trạng thái lời mời
3. Không gửi thông báo

## Bảo mật

- Tất cả API cần JWT token (trừ getInviteByToken)
- Kiểm tra quyền truy cập cho mỗi hành động
- Token lời mời có thời hạn và chỉ sử dụng được 1 lần
- Chỉ Owner/Admin mới có quyền mời/xóa thành viên
- Chỉ Owner mới có quyền xóa nhóm và cập nhật role

## Error Handling

- 400: Dữ liệu không hợp lệ
- 401: Chưa xác thực
- 403: Không có quyền truy cập
- 404: Không tìm thấy tài nguyên
- 409: Xung đột (email đã được mời, đã là thành viên)

## Frontend Integration

### Kết nối Socket.IO
```javascript
import io from 'socket.io-client'

const socket = io('http://localhost:8000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
})

// Lắng nghe thông báo mời nhóm
socket.on('new_notification', (notification) => {
  if (notification.type === 'team_invite') {
    // Hiển thị thông báo mời nhóm
    showTeamInviteNotification(notification)
  }
})
```

### Hiển thị danh sách lời mời
```javascript
// Lấy danh sách lời mời
const response = await fetch('/api/teams/invites/my-invites', {
  headers: { 'Authorization': `Bearer ${token}` }
})
const { data: invites } = await response.json()

// Hiển thị UI cho từng lời mời
invites.forEach(invite => {
  renderInviteCard(invite)
})
```

### Xử lý chấp nhận/từ chối
```javascript
// Chấp nhận lời mời
const acceptInvite = async (token) => {
  const response = await fetch('/api/teams/invite/accept', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ token })
  })
  
  if (response.ok) {
    // Cập nhật UI, chuyển đến trang nhóm
    window.location.href = `/teams/${teamId}`
  }
}

// Từ chối lời mời
const rejectInvite = async (token) => {
  const response = await fetch('/api/teams/invite/reject', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ token })
  })
  
  if (response.ok) {
    // Ẩn thông báo lời mời
    hideInviteNotification(token)
  }
}
```
