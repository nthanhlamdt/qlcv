# 📋 Tóm tắt Chức năng Quản lý Nhóm

## ✅ Đã hoàn thành

### 1. Database Models
- **Team Model** (`backend/models/team.model.ts`)
  - Quản lý thông tin nhóm (name, description, avatar, settings)
  - Quản lý thành viên với roles (owner, admin, member)
  - Methods: isMember, isAdmin, isOwner, addMember, removeMember, updateMemberRole
  - Indexing để tối ưu performance

- **TeamInvite Model** (`backend/models/teamInvite.model.ts`)
  - Quản lý lời mời tham gia nhóm
  - Token-based authentication với thời hạn 7 ngày
  - Status tracking: pending, accepted, rejected, expired
  - Methods: accept, reject, isExpired

### 2. Business Logic (Services)
- **Team Service** (`backend/services/team.service.ts`)
  - `createTeam` - Tạo nhóm mới
  - `getTeams` - Lấy danh sách nhóm với pagination
  - `getTeamById` - Lấy thông tin chi tiết nhóm
  - `updateTeam` - Cập nhật thông tin nhóm
  - `deleteTeam` - Xóa nhóm
  - `inviteMember` - Mời thành viên mới
  - `acceptInvite` - Chấp nhận lời mời
  - `rejectInvite` - Từ chối lời mời
  - `getUserInvites` - Lấy danh sách lời mời của user
  - `removeMember` - Xóa thành viên
  - `updateMemberRole` - Cập nhật role thành viên

### 3. API Controllers
- **Team Controllers** (`backend/controllers/team.controllers.ts`)
  - `createNewTeam` - POST /api/teams
  - `getUserTeams` - GET /api/teams
  - `getTeamDetails` - GET /api/teams/:teamId
  - `updateTeamInfo` - PUT /api/teams/:teamId
  - `deleteTeamById` - DELETE /api/teams/:teamId
  - `inviteTeamMember` - POST /api/teams/:teamId/invite
  - `acceptTeamInvite` - POST /api/teams/invite/accept
  - `rejectTeamInvite` - POST /api/teams/invite/reject
  - `getUserTeamInvites` - GET /api/teams/invites/my-invites
  - `removeTeamMember` - DELETE /api/teams/:teamId/members/:memberId
  - `updateTeamMemberRole` - PATCH /api/teams/:teamId/members/:memberId/role
  - `getInviteByToken` - GET /api/teams/invite/:token (public)

### 4. API Routes
- **Team Routes** (`backend/routes/team.routes.ts`)
  - Tất cả routes đã được định nghĩa
  - Middleware authentication cho protected routes
  - Public route cho lấy thông tin lời mời

### 5. Realtime Notifications
- **Tích hợp Socket.IO** cho thông báo realtime
- Thông báo khi mời thành viên (nếu user đã có tài khoản)
- Thông báo khi có thành viên mới tham gia
- Event: `new_notification` với type `team_invite`

### 6. Security & Permissions
- **Role-based access control**:
  - Owner: Tất cả quyền (tạo, xóa, mời, xóa thành viên, cập nhật role)
  - Admin: Mời thành viên, xóa thành viên (trừ owner), cập nhật thông tin
  - Member: Xem thông tin nhóm, tham gia hoạt động
- **JWT Authentication** cho tất cả API calls
- **Token-based invites** với thời hạn 7 ngày
- **Validation** cho tất cả input data

## 🔧 Cách sử dụng

### 1. Tạo nhóm mới
```bash
POST /api/teams
Authorization: Bearer <token>
{
  "name": "Frontend Team",
  "description": "Nhóm phát triển giao diện",
  "settings": {
    "allowMemberInvite": true,
    "allowMemberCreateProject": true,
    "allowMemberDeleteProject": false
  }
}
```

### 2. Mời thành viên
```bash
POST /api/teams/:teamId/invite
Authorization: Bearer <token>
{
  "inviteeEmail": "newmember@example.com",
  "role": "member",
  "message": "Chào mừng bạn tham gia nhóm!"
}
```

### 3. Chấp nhận lời mời
```bash
POST /api/teams/invite/accept
Authorization: Bearer <token>
{
  "token": "invite_token_here"
}
```

### 4. Từ chối lời mời
```bash
POST /api/teams/invite/reject
Authorization: Bearer <token>
{
  "token": "invite_token_here"
}
```

## 📊 Database Schema

### Teams Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  avatarUrl: String,
  members: [{
    user: ObjectId,
    role: String, // owner/admin/member
    joinedAt: Date,
    status: String // active/pending/suspended
  }],
  owner: ObjectId,
  settings: {
    allowMemberInvite: Boolean,
    allowMemberCreateProject: Boolean,
    allowMemberDeleteProject: Boolean
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### TeamInvites Collection
```javascript
{
  _id: ObjectId,
  team: ObjectId,
  inviter: ObjectId,
  inviteeEmail: String,
  inviteeUser: ObjectId, // optional
  role: String, // admin/member
  status: String, // pending/accepted/rejected/expired
  token: String,
  expiresAt: Date,
  acceptedAt: Date, // optional
  rejectedAt: Date, // optional
  message: String, // optional
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Tính năng nổi bật

1. **Realtime Notifications** - Thông báo tức thời qua Socket.IO
2. **Role-based Permissions** - Phân quyền chi tiết theo vai trò
3. **Token-based Invites** - Lời mời bảo mật với token có thời hạn
4. **Email Integration Ready** - Sẵn sàng tích hợp gửi email
5. **Comprehensive API** - API đầy đủ cho mọi chức năng
6. **Data Validation** - Validation toàn diện cho input
7. **Error Handling** - Xử lý lỗi chi tiết và thân thiện
8. **Pagination Support** - Hỗ trợ phân trang cho danh sách
9. **MongoDB Indexing** - Tối ưu performance với indexes
10. **TypeScript Support** - Type safety đầy đủ

## 🔄 Luồng hoạt động

1. **Tạo nhóm** → User tạo nhóm → Tự động trở thành Owner
2. **Mời thành viên** → Owner/Admin mời bằng email → Tạo invite token → Gửi thông báo realtime
3. **Chấp nhận lời mời** → User nhận token → Gọi API accept → Thêm vào nhóm → Thông báo team
4. **Từ chối lời mời** → User gọi API reject → Cập nhật status → Không thông báo
5. **Quản lý thành viên** → Owner/Admin có thể xóa, cập nhật role thành viên

## 📝 Ghi chú

- Tất cả API đều cần JWT token (trừ getInviteByToken)
- Token lời mời có thời hạn 7 ngày
- Chỉ Owner mới có thể xóa nhóm và cập nhật role
- Thông báo realtime chỉ gửi cho user đã có tài khoản
- Hệ thống sẵn sàng tích hợp frontend và gửi email
