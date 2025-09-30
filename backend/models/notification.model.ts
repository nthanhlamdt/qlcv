import mongoose, { Document, Model, Schema } from 'mongoose'

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId
  sender?: mongoose.Types.ObjectId
  type: 'task_assigned' | 'task_completed' | 'task_updated' | 'team_invite' | 'system' | 'mention'
  title: string
  message: string
  data?: {
    taskId?: string
    teamId?: string
    projectId?: string
    [key: string]: any
  }
  isRead: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const notificationSchema: Schema<INotification> = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Người nhận thông báo là bắt buộc'],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['task_assigned', 'task_completed', 'task_updated', 'team_invite', 'system', 'mention'],
      required: [true, 'Loại thông báo là bắt buộc'],
    },
    title: {
      type: String,
      required: [true, 'Tiêu đề thông báo là bắt buộc'],
      maxlength: [200, 'Tiêu đề không được vượt quá 200 ký tự'],
    },
    message: {
      type: String,
      required: [true, 'Nội dung thông báo là bắt buộc'],
      maxlength: [500, 'Nội dung không được vượt quá 500 ký tự'],
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

// Index để tối ưu query
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 })
notificationSchema.index({ recipient: 1, type: 1 })

export const NotificationModel: Model<INotification> = mongoose.model('Notification', notificationSchema)
