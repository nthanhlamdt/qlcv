import jwt, { Secret } from 'jsonwebtoken'
import ErrorHandler from '../utils/ErrorHandler'
import { UserModel } from '../models/user.model'

const JWT_SECRET: Secret = (process.env.JWT_SECRET || 'dev-secret') as Secret
const JWT_REFRESH_SECRET: Secret = (process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret') as Secret
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '5m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '3d'

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN })
}

export async function registerUser(params: { name: string; email: string; password: string }) {
  const { name, email, password } = params
  if (!email || !password) throw new ErrorHandler('Email và mật khẩu là bắt buộc', 400)

  const existed = await UserModel.findOne({ email })
  if (existed) throw new ErrorHandler('Email đã tồn tại', 409)

  const user = await UserModel.create({ name, email, password })
  const token = signToken(user.id)
  const refreshToken = signRefreshToken(user.id)

  return {
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    token,
    refreshToken,
  }
}

export async function loginUser(params: { email: string; password: string }) {
  const { email, password } = params
  if (!email || !password) throw new ErrorHandler('Thiếu email hoặc mật khẩu', 400)

  const user = await UserModel.findOne({ email }).select('+password')
  if (!user) throw new ErrorHandler('Email hoặc mật khẩu không đúng', 401)

  const ok = await user.comparePassword(password)
  if (!ok) throw new ErrorHandler('Email hoặc mật khẩu không đúng', 401)

  const token = signToken(user.id)
  const refreshToken = signRefreshToken(user.id)

  return {
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    token,
    refreshToken,
  }
}

export async function refreshAccessToken(refreshToken: string) {
  if (!refreshToken) throw new ErrorHandler('Refresh token không tồn tại', 401)

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { sub: string }
    const user = await UserModel.findById(decoded.sub)
    if (!user) throw new ErrorHandler('User không tồn tại', 401)

    const token = signToken(user.id)
    return { token }
  } catch (error) {
    throw new ErrorHandler('Refresh token không hợp lệ', 401)
  }
}
