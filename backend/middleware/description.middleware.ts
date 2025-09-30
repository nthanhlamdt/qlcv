/*
middleware/ - Người gác cổng 🚔
Middleware giống như bảo vệ cổng của hệ thống. Mọi request phải đi qua nó trước khi đến controller. Nó có thể kiểm tra xem bạn đã đăng nhập chưa, có quyền truy cập hay không.

💡 Ví dụ: Nếu bạn chưa đăng nhập mà muốn xem thông tin tài khoản, middleware sẽ chặn ngay!

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  next();
};
 */

/*📌 Client (Người dùng gửi request từ trình duyệt/Postman)
   │
   ▼
🚦 routes/ (Lối đi của request)
   │   ├── Xác định request nào đi đến đâu
   │   ├── Ví dụ: "/login" → AuthController.login()
   ▼
🚔 middleware/ (Người gác cổng)
   │   ├── Kiểm tra quyền truy cập, xác thực token
   │   ├── Ví dụ: Chặn người dùng chưa đăng nhập
   ▼
🏛 controllers/ (Người chỉ huy)
   │   ├── Nhận request, kiểm tra dữ liệu
   │   ├── Gọi service để xử lý logic
   │   ├── Ví dụ: Nhận email + password → gọi AuthService
   ▼
🧠 services/ (Bộ não xử lý)
   │   ├── Thực hiện logic nghiệp vụ
   │   ├── Gọi models để lấy/lưu dữ liệu
   │   ├── Ví dụ: Kiểm tra email, mật khẩu → tạo token
   ▼
🏛 models/ (Định nghĩa dữ liệu)
   │   ├── Đại diện cho bảng trong database
   │   ├── Ví dụ: Định nghĩa User { username, email, password }
   ▼
🔌 providers/ (Nhà cung cấp dịch vụ)
   │   ├── Kết nối với database, email, API bên thứ ba
   │   ├── Ví dụ: Kết nối MongoDB khi server khởi động
   ▼
🛠 utils/ (Hộp công cụ)
   │   ├── Hàm tiện ích (tạo token, hash mật khẩu)
   │   ├── Ví dụ: generateToken(user)
   ▼
🗄 Database (MongoDB, MySQL, Firebase)
   ├── Lưu trữ dữ liệu của ứng dụng
   ├── Ví dụ: Lưu thông tin người dùng, đơn hàng
   ▼
📌 Client nhận phản hồi (trả về kết quả JSON)
*/
