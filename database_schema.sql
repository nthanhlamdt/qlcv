-- Database Schema cho hệ thống QLCV (Quản lý công việc nhóm)
-- Tạo database
CREATE DATABASE qlcv;
USE qlcv;

-- 1. Bảng Users (Người dùng)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    role VARCHAR(100) DEFAULT 'Member',
    department VARCHAR(100),
    location VARCHAR(100),
    bio TEXT,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    join_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Bảng Teams (Nhóm/Dự án)
CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),
    status ENUM('active', 'completed', 'paused', 'cancelled') DEFAULT 'active',
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    deadline DATE,
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Bảng Team Members (Thành viên nhóm)
CREATE TABLE team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(100) DEFAULT 'Member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_user (team_id, user_id)
);

-- 4. Bảng Tasks (Công việc)
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    type ENUM('personal', 'team') DEFAULT 'personal',
    assignee_id INT,
    team_id INT NULL,
    created_by INT NOT NULL,
    due_date DATE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Bảng Task Tags (Thẻ công việc)
CREATE TABLE task_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_task_tag (task_id, tag_name)
);

-- 6. Bảng Comments (Bình luận)
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Bảng Calendar Events (Sự kiện lịch)
CREATE TABLE calendar_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    type ENUM('task', 'meeting', 'deadline', 'personal') DEFAULT 'task',
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    user_id INT NOT NULL,
    team_id INT NULL,
    task_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

-- 8. Bảng Notifications (Thông báo)
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type ENUM('task_assigned', 'task_completed', 'comment_added', 'deadline_approaching', 'team_invite', 'meeting_reminder') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_id INT NULL, -- ID của task, team, hoặc event liên quan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Bảng Activity Logs (Nhật ký hoạt động)
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action_type ENUM('task_created', 'task_completed', 'task_updated', 'comment_added', 'team_joined', 'meeting_attended') NOT NULL,
    description TEXT NOT NULL,
    related_user_id INT NULL,
    related_task_id INT NULL,
    related_team_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (related_task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    FOREIGN KEY (related_team_id) REFERENCES teams(id) ON DELETE SET NULL
);

-- 10. Bảng User Settings (Cài đặt người dùng)
CREATE TABLE user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    theme ENUM('light', 'dark', 'system') DEFAULT 'system',
    language VARCHAR(10) DEFAULT 'vi',
    timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo indexes để tối ưu performance
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_team ON tasks(team_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_comments_task ON comments(task_id);
CREATE INDEX idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- Insert dữ liệu mẫu
INSERT INTO users (name, email, password, phone, role, department, location, bio, join_date) VALUES
('Nguyễn Văn A', 'nguyen.van.a@company.com', '$2b$10$hash1', '0123456789', 'Senior Frontend Developer', 'Engineering', 'Hà Nội', 'Passionate frontend developer với 5+ năm kinh nghiệm', '2023-01-15'),
('Trần Thị B', 'tran.thi.b@company.com', '$2b$10$hash2', '0987654321', 'Backend Developer', 'Engineering', 'TP.HCM', 'Chuyên gia backend với kinh nghiệm Node.js và Python', '2023-02-01'),
('Lê Văn C', 'le.van.c@company.com', '$2b$10$hash3', '0369258147', 'UI/UX Designer', 'Design', 'Hà Nội', 'Creative designer với đam mê tạo ra trải nghiệm người dùng tuyệt vời', '2023-01-20'),
('Phạm Thị D', 'pham.thi.d@company.com', '$2b$10$hash4', '0147258369', 'QA Engineer', 'Quality Assurance', 'Đà Nẵng', 'Chuyên gia testing với kinh nghiệm automation testing', '2023-03-01');

INSERT INTO teams (name, description, status, priority, deadline, progress, created_by) VALUES
('Website Thương mại điện tử', 'Dự án phát triển website bán hàng online với đầy đủ tính năng thanh toán', 'active', 'high', '2024-03-30', 75, 1),
('Ứng dụng Mobile Banking', 'Phát triển ứng dụng ngân hàng di động với các tính năng chuyển tiền', 'active', 'high', '2024-04-15', 60, 2),
('Hệ thống CRM', 'Xây dựng hệ thống quản lý khách hàng với tính năng theo dõi leads', 'active', 'medium', '2024-02-20', 85, 1);

INSERT INTO team_members (team_id, user_id, role) VALUES
(1, 1, 'Project Lead'),
(1, 2, 'Backend Developer'),
(1, 3, 'UI/UX Designer'),
(1, 4, 'QA Engineer'),
(2, 2, 'Tech Lead'),
(2, 1, 'Frontend Developer'),
(3, 1, 'Full-stack Developer'),
(3, 4, 'QA Engineer');

INSERT INTO tasks (title, description, status, priority, type, assignee_id, team_id, created_by, due_date) VALUES
('Thiết kế giao diện trang chủ', 'Tạo mockup và prototype cho trang chủ website mới', 'completed', 'high', 'personal', 1, NULL, 1, '2024-01-15'),
('Phát triển API đăng nhập', 'Xây dựng endpoint API cho chức năng đăng nhập với JWT', 'in-progress', 'medium', 'team', 2, 1, 1, '2024-01-18'),
('Kiểm thử tính năng thanh toán', 'Thực hiện test case cho module thanh toán online', 'pending', 'high', 'personal', 4, NULL, 1, '2024-01-20'),
('Tối ưu hóa database', 'Cải thiện performance database bằng cách tối ưu query', 'in-progress', 'low', 'team', 2, 2, 2, '2024-01-25'),
('Viết tài liệu API', 'Tạo documentation chi tiết cho tất cả API endpoints', 'pending', 'medium', 'team', 1, 1, 1, '2024-01-22');

INSERT INTO task_tags (task_id, tag_name) VALUES
(1, 'design'),
(1, 'frontend'),
(1, 'ui/ux'),
(2, 'backend'),
(2, 'api'),
(2, 'authentication'),
(3, 'testing'),
(3, 'payment'),
(3, 'qa'),
(4, 'database'),
(4, 'performance'),
(4, 'optimization'),
(5, 'documentation'),
(5, 'api');
