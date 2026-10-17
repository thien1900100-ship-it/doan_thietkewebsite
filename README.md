# TECHZONE - NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ ĐỒ CÔNG NGHỆ

Hệ thống website thương mại điện tử chuyên đồ công nghệ, máy tính, điện thoại, linh kiện và thiết bị kỹ thuật số hoàn chỉnh bao gồm Frontend, Backend và Cơ sở dữ liệu.

---

## 1. Kiến trúc hệ thống kép (Dual-Capability)

1. **Ứng dụng Web Live (Node.js/Express + React 19 + Tailwind CSS)**:
   - Khởi chạy trực tiếp trên môi trường trình duyệt này (port 3000).
   - Đầy đủ tính năng: Tìm kiếm, lọc theo giá/danh mục/thương hiệu, giỏ hàng, mã giảm giá, đặt hàng COD/VietQR, trừ kho giao dịch, hủy đơn hoàn tồn kho tự động, quản trị Admin.
2. **Gói mã nguồn Python Flask + MySQL độc lập**:
   - Thư mục `python_app/` chứa toàn bộ code Flask, SQLAlchemy models, Blueprints, JWT Auth.
   - Thư mục `database/` chứa `schema.sql` (cấu trúc bảng MySQL) và `seed.sql` (dữ liệu mẫu hơn 32 sản phẩm công nghệ).
   - Tệp nén `TECHZONE.zip` xuất ra đầy đủ, tải về 1-click từ nút trên thanh điều hướng hoặc qua API `/api/export-zip`.

---

## 2. Thông tin tài khoản Demo

Hệ thống đã tích hợp sẵn thanh công cụ chuyển đổi nhanh vai trò (Demo Switcher) trên thanh thông báo đầu trang để người chấm thi / đánh giá đồ án có thể chuyển qua lại tức thì:

| Vai trò | Email | Mật khẩu | Chức năng nổi bật |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@techzone.vn` | `admin123` | Dashboard biểu đồ doanh thu, Thêm/Sửa/Xóa sản phẩm, duyệt đơn, tạo mã coupon, tải mã nguồn |
| **Khách hàng mẫu 1** | `khachhang@techzone.vn` | `user123` | Đã có sẵn lịch sử đơn hàng, quyền hủy đơn hoàn kho và gửi đánh giá sản phẩm |
| **Khách hàng mẫu 2** | `tranminh@gmail.com` | `user123` | Mua sắm, theo dõi tiến trình đơn hàng |
| **Khách vãng lai** | *(Không cần đăng nhập)* | *(Không)* | Tìm kiếm, xem chi tiết, lọc giá, đặt hàng COD / VietQR nhanh |

---

## 3. Danh mục 9 ngành hàng công nghệ

1. **Điện thoại thông minh**: iPhone 16 Pro Max, Galaxy S24 Ultra, iPhone 15, Galaxy A55...
2. **Laptop & Máy tính**: MacBook Pro M3 Pro, ASUS ROG Zephyrus G16, Dell XPS 13, Lenovo Legion Pro 5...
3. **Máy tính bảng**: iPad Pro M4 Tandem OLED, Galaxy Tab S9 Plus...
4. **Màn hình máy tính**: Dell UltraSharp U2724D IPS Black 120Hz, ASUS ROG Swift OLED 240Hz, Samsung Odyssey G7...
5. **Linh kiện máy tính**: CPU Intel Core i7 14700K, Card MSI RTX 4070 Super Trio, RAM Corsair Dominator Titanium DDR5, SSD Kingston KC3000 7000MB/s...
6. **Tai nghe & Âm thanh**: Sony WH-1000XM5, Apple AirPods Pro 2 USB-C, Loa Sony SRS-XB100, AirPods Max...
7. **Bàn phím & Gaming Gear**: Logitech G Pro X Superlight 2, Bàn phím cơ ASUS ROG Azoth 75%, Logitech MX Master 3S, Corsair K70 MAX...
8. **Phụ kiện điện thoại**: Củ sạc nhanh Apple 20W Type-C, Pin dự phòng Samsung 20.000mAh 45W, Đế sạc không dây Apple MagSafe...
9. **Thiết bị mạng & Khác**: Router Wi-Fi 6 TP-Link Archer AX73, Hệ thống Wi-Fi Mesh TP-Link Deco X50...

---

## 4. Hướng dẫn chạy Backend Python Flask và MySQL trên máy tính cá nhân

### Bước 1: Khởi tạo Cơ sở dữ liệu MySQL
1. Khởi động MySQL Server (bằng XAMPP, Laragon hoặc Docker).
2. Tạo cơ sở dữ liệu và nạp dữ liệu:
```bash
mysql -u root -p -e "CREATE DATABASE techzone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p techzone_db < database/schema.sql
mysql -u root -p techzone_db < database/seed.sql
```

### Bước 2: Cài đặt và chạy Python Flask
```bash
cd python_app

# Tạo môi trường ảo
python -m venv venv

# Kích hoạt môi trường ảo:
# Trên Windows:
venv\Scripts\activate
# Trên Linux/macOS:
source venv/bin/activate

# Cài đặt thư viện:
pip install -r requirements.txt

# Tạo file .env từ .env.example
cp .env.example .env

# Chạy server Flask
python run.py
```
Backend API sẽ lắng nghe tại `http://localhost:5000`.

---

## 5. Danh sách các bài kiểm thử nghiệp vụ đã hoàn thành

- [x] **Xác thực & Phân quyền**: Ngăn chặn người dùng sửa role thành admin; bảo vệ các route `/api/admin/*`.
- [x] **Toàn vẹn giá tiền**: Server tính toán lại toàn bộ đơn giá từ DB, từ chối dữ liệu giá giả từ client.
- [x] **Giao dịch tồn kho**: Trừ kho nguyên tử khi đặt hàng thành công, báo lỗi khi khách mua vượt số lượng còn lại trong kho.
- [x] **Hoàn tồn kho Idempotent**: Khi hủy đơn ở trạng thái Cho phép (Pending/Confirmed), kho được cộng lại đúng 1 lần duy nhất (`stock_restocked = true`).
- [x] **Kiểm tra mã giảm giá**: Kiểm tra ngày bắt đầu/kết thúc, giới hạn lượt dùng, đơn tối thiểu, tính đúng phần trăm và trần tối đa.
- [x] **Đánh giá sản phẩm**: Chỉ cho phép khách hàng đã mua và nhận hàng thành công được đánh giá (1-5 sao).
- [x] **Đóng gói dự án**: Tự động sinh `TECHZONE.zip` tải về trực tiếp từ giao diện.
