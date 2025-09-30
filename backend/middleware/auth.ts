import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/ErrorHandler'

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const access_token = req.cookies.access_token


    if (!access_token) {
      return next(new ErrorHandler('Vui lòng đăng nhập để truy cập tài nguyên này', 401))
    }

    const decoded = jwt.verify(access_token, process.env.JWT_SECRET as string)

    const user = await UserModel.findById(decoded.sub)

    if (!user) {
      return next(new ErrorHandler('User không tồn tại', 401))
    }

    req.user = user
    next()
  } catch (error: any) {
    console.log(error)
    return next(new ErrorHandler('Token không hợp lệ', 401))
  }
}
