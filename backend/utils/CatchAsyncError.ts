// CatchAsyncError giúp bắt lỗi async/await và chuyển đến ErrorMiddleware
// Thay vì phải try/catch trong mỗi controller, chỉ cần wrap function với CatchAsyncError

import { NextFunction, Request, Response } from 'express'

export const CatchAsyncError = (func: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(func(req, res, next)).catch(next)
}
