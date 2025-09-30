import mongoose, { Document, Model, Schema } from 'mongoose'

export type TaskStatus = 'pending' | 'in-progress' | 'completed'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface ITask extends Document {
  team: mongoose.Types.ObjectId
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: mongoose.Types.ObjectId
  dueDate?: Date
  tags: string[]
  createdBy: mongoose.Types.ObjectId
}

const taskSchema = new Schema<ITask>(
  {
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending', index: true },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium', index: true },
    assignee: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    tags: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

taskSchema.index({ team: 1, status: 1 })
taskSchema.index({ team: 1, priority: 1 })

export const TaskModel: Model<ITask> = mongoose.model<ITask>('Task', taskSchema)


