// 1️⃣ controllers/ - Người chỉ huy 🚦
// Đây là nơi điều phối request từ người dùng. Khi có yêu cầu đến server, controller sẽ nhận request, kiểm tra dữ liệu, rồi gọi các dịch vụ (services) để xử lý. Sau đó, nó sẽ gửi kết quả về cho người dùng.

// 💡 Ví dụ: Bạn đăng nhập, controller sẽ nhận email và password, rồi gọi AuthService để kiểm tra thông tin đăng nhập.

// async login(req, res) {
//   const token = await AuthService.login(req.body);
//   res.json({ token });
// }
