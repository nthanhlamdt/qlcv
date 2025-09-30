import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { ErrorMiddleware } from './middleware/error'
import { mainRouter } from './routes/route'

dotenv.config()
export const app = express()

app.use(express.json({ limit: '50mb' }))

app.use(cookieParser())

app.use(cors({
  origin: process.env.ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}))

// Mount main router
app.use('/api', mainRouter)

app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: 'API thành công',
  })
})

app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any
  err.statusCode = 404
  next(err)
})

app.use(ErrorMiddleware)
