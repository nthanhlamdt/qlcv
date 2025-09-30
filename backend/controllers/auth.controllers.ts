import { Request, Response, NextFunction } from 'express'
import { CatchAsyncError } from '../utils/CatchAsyncError'
import { loginUser, registerUser, refreshAccessToken } from '../services/auth.service'

const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '60', 10)
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '3', 10)

const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000), // 5 minutes
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}

const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // 3 days
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}

export const register = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body
  const { user, token, refreshToken } = await registerUser({ name, email, password })

  res.cookie('access_token', token, accessTokenOptions)
  res.cookie('refresh_token', refreshToken, refreshTokenOptions)

  res.status(201).json({
    success: true,
    user,
    token,
  })
})

export const login = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  const { user, token, refreshToken } = await loginUser({ email, password })

  res.cookie('access_token', token, accessTokenOptions)
  res.cookie('refresh_token', refreshToken, refreshTokenOptions)

  res.status(200).json({
    success: true,
    user,
    token,
  })
})

export const logout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie('access_token', '', { maxAge: 1 })
  res.cookie('refresh_token', '', { maxAge: 1 })

  res.status(200).json({
    success: true,
    message: 'Đăng xuất thành công',
  })
})

export const refreshToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const refresh_token = req.cookies.refresh_token
  const { token } = await refreshAccessToken(refresh_token)

  res.cookie('access_token', token, accessTokenOptions)

  res.status(200).json({
    success: true,
    token,
  })
})

export const getUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    user: req.user,
  })
})

export const testCookies = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    cookies: req.cookies,
    headers: req.headers,
  })
})
