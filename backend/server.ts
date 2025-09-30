import { app } from "./app"
import connectDB from "./providers/db"
import SocketService from "./services/socket.service"
import { createServer } from "http"
require('dotenv').config()

const PORT = process.env.PORT || 8000

// Tạo HTTP server
const server = createServer(app)

// Khởi tạo Socket.IO service
const socketService = new SocketService(server)

// Export socket service để sử dụng ở các nơi khác
export { socketService }

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
      console.log(`🔌 Socket.IO ready for realtime connections`)
    })
  })
  .catch((err) => {
    console.log(err)
  })