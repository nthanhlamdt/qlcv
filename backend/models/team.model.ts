import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ITeamMember {
  user: mongoose.Types.ObjectId
  role: 'owner' | 'admin' | 'member'
  joinedAt: Date
  status: 'active' | 'pending' | 'suspended'
}

export interface ITeam extends Document {
  name: string
  description?: string
  avatarUrl?: string
  members: ITeamMember[]
  owner: mongoose.Types.ObjectId
  settings: {
    allowMemberInvite: boolean
    allowMemberCreateProject: boolean
    allowMemberDeleteProject: boolean
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const teamMemberSchema = new Schema<ITeamMember>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'member'],
    default: 'member',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended'],
    default: 'active',
  },
})

const teamSchema: Schema<ITeam> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên nhóm là bắt buộc'],
      maxlength: [100, 'Tên nhóm không được vượt quá 100 ký tự'],
    },
    description: {
      type: String,
      maxlength: [500, 'Mô tả không được vượt quá 500 ký tự'],
    },
    avatarUrl: {
      type: String,
    },
    members: [teamMemberSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    settings: {
      allowMemberInvite: {
        type: Boolean,
        default: true,
      },
      allowMemberCreateProject: {
        type: Boolean,
        default: true,
      },
      allowMemberDeleteProject: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

// Index để tối ưu query
teamSchema.index({ owner: 1 })
teamSchema.index({ 'members.user': 1 })
teamSchema.index({ isActive: 1 })

// Virtual để lấy số lượng thành viên
teamSchema.virtual('memberCount').get(function () {
  return this.members.filter(member => member.status === 'active').length
})

// Method để kiểm tra user có phải là thành viên không
teamSchema.methods.isMember = function (userId: string) {
  return this.members.some(
    member => member.user.toString() === userId && member.status === 'active'
  )
}

// Method để kiểm tra user có quyền admin không
teamSchema.methods.isAdmin = function (userId: string) {
  return this.members.some(
    member =>
      member.user.toString() === userId &&
      (member.role === 'admin' || member.role === 'owner') &&
      member.status === 'active'
  )
}

// Method để kiểm tra user có phải là owner không
teamSchema.methods.isOwner = function (userId: string) {
  return this.owner.toString() === userId
}

// Method để thêm thành viên
teamSchema.methods.addMember = function (userId: string, role: 'admin' | 'member' = 'member') {
  const existingMember = this.members.find(
    member => member.user.toString() === userId
  )

  if (existingMember) {
    existingMember.status = 'active'
    existingMember.role = role
  } else {
    this.members.push({
      user: userId,
      role,
      joinedAt: new Date(),
      status: 'active',
    })
  }

  return this.save()
}

// Method để xóa thành viên
teamSchema.methods.removeMember = function (userId: string) {
  this.members = this.members.filter(
    member => member.user.toString() !== userId
  )
  return this.save()
}

// Method để cập nhật role thành viên
teamSchema.methods.updateMemberRole = function (userId: string, role: 'admin' | 'member') {
  const member = this.members.find(
    member => member.user.toString() === userId
  )

  if (member) {
    member.role = role
    return this.save()
  }

  throw new Error('Thành viên không tồn tại')
}

export const TeamModel: Model<ITeam> = mongoose.model('Team', teamSchema)
