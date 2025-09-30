import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ITeamInvite extends Document {
  team: mongoose.Types.ObjectId
  inviter: mongoose.Types.ObjectId
  inviteeEmail: string
  inviteeUser?: mongoose.Types.ObjectId // Nếu user đã có tài khoản
  role: 'admin' | 'member'
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  token: string
  expiresAt: Date
  acceptedAt?: Date
  rejectedAt?: Date
  message?: string
  createdAt: Date
  updatedAt: Date
}

const teamInviteSchema: Schema<ITeamInvite> = new Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    inviter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inviteeEmail: {
      type: String,
      required: [true, 'Email người được mời là bắt buộc'],
      lowercase: true,
      trim: true,
    },
    inviteeUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending',
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    },
    acceptedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    message: {
      type: String,
      maxlength: [200, 'Lời nhắn không được vượt quá 200 ký tự'],
    },
  },
  { timestamps: true }
)

// Index để tối ưu query
teamInviteSchema.index({ team: 1, inviteeEmail: 1 })
teamInviteSchema.index({ token: 1 })
teamInviteSchema.index({ status: 1 })
teamInviteSchema.index({ expiresAt: 1 })

// Index để tìm lời mời chưa hết hạn
teamInviteSchema.index({
  inviteeEmail: 1,
  status: 'pending',
  expiresAt: { $gt: new Date() }
})

// Pre-save middleware để tạo token
teamInviteSchema.pre('save', function (next) {
  if (this.isNew && !this.token) {
    // Tạo token ngẫu nhiên
    this.token = require('crypto').randomBytes(32).toString('hex')
  }
  next()
})

// Method để kiểm tra lời mời có hết hạn không
teamInviteSchema.methods.isExpired = function () {
  return this.expiresAt < new Date()
}

// Method để chấp nhận lời mời
teamInviteSchema.methods.accept = function () {
  this.status = 'accepted'
  this.acceptedAt = new Date()
  return this.save()
}

// Method để từ chối lời mời
teamInviteSchema.methods.reject = function () {
  this.status = 'rejected'
  this.rejectedAt = new Date()
  return this.save()
}

// Static method để tìm lời mời hợp lệ
teamInviteSchema.statics.findValidInvite = function (token: string) {
  return this.findOne({
    token,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  })
}

// Static method để tìm lời mời theo email và team
teamInviteSchema.statics.findPendingInvite = function (email: string, teamId: string) {
  return this.findOne({
    inviteeEmail: email,
    team: teamId,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  })
}

// Static method để làm hết hạn các lời mời cũ
teamInviteSchema.statics.expireOldInvites = function () {
  return this.updateMany(
    {
      status: 'pending',
      expiresAt: { $lt: new Date() },
    },
    {
      status: 'expired',
    }
  )
}

export const TeamInviteModel: Model<ITeamInvite> = mongoose.model('TeamInvite', teamInviteSchema)
