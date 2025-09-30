import mongoose, { Document, Model, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface IUser extends Document {
  name: string
  email: string
  password: string
  avatar?: {
    public_id: string
    url: string
  }
  isVerified: boolean
  comparePassword: (password: string) => Promise<boolean>
  signAccessToken: () => string
  signRefreshToken: () => string
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên của bạn'],
      maxlength: [30, 'Tên không được vượt quá 30 ký tự'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email của bạn'],
      unique: true,
      validate: {
        validator: (value: string) => emailRegexPattern.test(value),
        message: 'Vui lòng nhập một địa chỉ email hợp lệ',
      },
    },
    password: {
      type: String,
      minlength: [6, 'Mật khẩu của bạn phải có ít nhất 6 ký tự'],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Hash password trước khi save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// So sánh password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Tạo Access Token
userSchema.methods.signAccessToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || '', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  })
}

// Tạo Refresh Token
userSchema.methods.signRefreshToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET || '', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '3d',
  })
}

export const UserModel: Model<IUser> = mongoose.model('User', userSchema)
