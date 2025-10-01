import mongoose, { Document, Model, Schema } from 'mongoose'

export type TaskStatus = 'backlog' | 'pending' | 'in-progress' | 'review' | 'completed' | 'blocked'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface ITask extends Document {
  team?: mongoose.Types.ObjectId
  type: 'personal' | 'team'
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignees?: mongoose.Types.ObjectId[]
  dueDate?: Date
  tags: string[]
  createdBy: mongoose.Types.ObjectId
  position?: string // Column position for Kanban board
  notes?: Array<{
    _id?: mongoose.Types.ObjectId
    content: string
    createdBy: mongoose.Types.ObjectId
    createdAt: Date
  }>
}

const taskSchema = new Schema<ITask>(
  {
    team: { type: Schema.Types.ObjectId, ref: 'Team', index: true },
    type: { type: String, enum: ['personal', 'team'], default: 'team', index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: { type: String, enum: ['backlog', 'pending', 'in-progress', 'review', 'completed', 'blocked'], default: 'pending', index: true },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium', index: true },
    assignees: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    dueDate: { type: Date },
    tags: { type: [String], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: String }, // Column position for Kanban board
    notes: [
      {
        content: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
)

taskSchema.index({ team: 1, status: 1 })
taskSchema.index({ team: 1, priority: 1 })

export const TaskModel: Model<ITask> = mongoose.model<ITask>('Task', taskSchema)


