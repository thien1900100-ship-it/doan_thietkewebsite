# TECHZONE - NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ ĐỒ CÔNG NGHỆ

Dự án website bán hàng công nghệ điện tử TECHZONE hoàn chỉnh bao gồm Frontend, Backend và Cơ sở dữ liệu MySQL / SQLite.

## 1. Tính năng chính

### Phía Khách hàng (Frontend):
- **Trang chủ**: Banner quảng cáo công nghệ, danh mục nổi bật, sản phẩm bán chạy, sản phẩm mới nhất, thương hiệu đối tác.
- **Danh mục 9 ngành hàng**: Điện thoại thông minh, Laptop & PC, Máy tính bảng, Màn hình máy tính, Linh kiện PC, Tai nghe & Âm thanh, Bàn phím & Gaming Gear, Phụ kiện điện thoại, Thiết bị mạng.
- **Bộ lọc đa năng**: Lọc kết hợp theo danh mục, thương hiệu, khoảng giá, tình trạng còn hàng, sắp xếp giá/mới nhất.
- **Trang chi tiết sản phẩm (PDP)**: Xem ảnh, thông số kỹ thuật chi tiết dạng bảng, số lượng tồn kho, nút Thêm giỏ hàng, Mua ngay, đánh giá nhận xét của khách hàng đã mua.
- **Giỏ hàng & Thanh toán**: Tính tổng tiền tự động tại máy chủ, mã giảm giá (fixed/percent), phí vận chuyển linh hoạt, phương thức COD hoặc Chuyển khoản ngân hàng (VietQR).
- **Tài khoản khách hàng**: Đăng ký, đăng nhập an toàn (hash bcrypt), quản lý thông tin, xem lịch sử đơn hàng, hủy đơn hàng (hoàn lại tồn kho tức thì), danh sách yêu thích.

### Phía Quản trị viên (Admin):
- **Dashboard Thống kê**: Doanh thu thực tế, số lượng đơn hàng, số khách hàng, tổng sản phẩm, cảnh báo sản phẩm sắp hết hàng, biểu đồ cơ cấu đơn hàng.
- **Quản lý sản phẩm**: CRUD toàn diện, kiểm tra hợp lệ giá bán và tồn kho không âm, phân loại danh mục và thương hiệu.
- **Quản lý đơn hàng**: Cập nhật quy trình trạng thái (Chờ xác nhận -> Đã xác nhận -> Đang giao -> Đã giao / Hủy), cơ chế hoàn trả tồn kho tự động và chống cộng lặp tồn kho.
- **Quản lý khách hàng**: Xem danh sách thành viên, lịch sử mua sắm.
- **Quản lý mã giảm giá**: Tạo và cấu hình mã coupon, giá trị đơn hàng tối thiểu, lượt sử dụng.

---

## 2. Thông tin tài khoản Demo

| Vai trò | Email đăng nhập | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@techzone.vn` | `admin123` | Toàn quyền quản trị hệ thống |
| **Khách hàng mẫu 1** | `khachhang@techzone.vn` | `user123` | Đã có sẵn lịch sử đơn hàng và đánh giá |
| **Khách hàng mẫu 2** | `tranminh@gmail.com` | `user123` | Tài khoản khách hàng mẫu |

---

## 3. Hướng dẫn cài đặt & Khởi chạy Backend Python Flask

### Bước 1: Chuẩn bị môi trường
Yêu cầu máy tính đã cài đặt **Python 3.10+** và **MySQL Server 8.0+** (hoặc dùng XAMPP / Laragon / MySQL Workbench).

### Bước 2: Tạo Cơ sở dữ liệu MySQL
1. Mở MySQL Workbench hoặc terminal MySQL:
```sql
CREATE DATABASE techzone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
2. Nạp cấu trúc bảng và dữ liệu mẫu:
```bash
# Nạp file schema
mysql -u root -p techzone_db < database/schema.sql

# Nạp file dữ liệu mẫu (hơn 30 sản phẩm công nghệ)
mysql -u root -p techzone_db < database/seed.sql
```

### Bước 3: Cài đặt thư viện Python
Trong thư mục dự án:
```bash
# Tạo môi trường ảo (khuyến nghị)
python -m venv venv

# Kích hoạt môi trường ảo:
# Trên Windows:
venv\Scripts\activate
# Trên macOS / Linux:
source venv/bin/activate

# Cài đặt các thư viện cần thiết
pip install -r requirements.txt
```

### Bước 4: Cấu hình biến môi trường
Tạo file `.env` từ file mẫu `.env.example`:
```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=techzone_secret_key_change_me_in_production_2026
DATABASE_URL=mysql+pymysql://root:mat_khau_mysql_cua_ban@localhost:3306/techzone_db
PORT=5000
```
*(Nếu muốn chạy thử nhanh không cần cài MySQL, bạn chỉ cần đổi `DATABASE_URL=sqlite:///techzone.db` và chạy `flask init-db`)*.

### Bước 5: Khởi chạy Server
```bash
python run.py
```
Backend API sẽ lắng nghe tại: `http://localhost:5000`
Kiểm tra sức khỏe hệ thống: `http://localhost:5000/api/health`

---

## 4. Các điểm an toàn & Tối ưu kỹ thuật
- **Chống SQL Injection**: Toàn bộ câu truy vấn sử dụng Parameterized Query và ORM SQLAlchemy.
- **Bảo vệ mật khẩu**: Mã hóa một chiều bằng thư viện `Bcrypt` an toàn với salt ngẫu nhiên.
- **Toàn vẹn giá tiền**: Tổng tiền đơn hàng được tính toán và kiểm tra lại 100% tại Backend từ bảng sản phẩm, không phụ thuộc giá do client gửi lên.
- **Giao dịch tồn kho**: Sử dụng Database Transaction (`with_for_update()`) đảm bảo không bị bán vượt số lượng thực tế trong kho.
- **Hoàn tồn kho chuẩn xác**: Khi đơn hàng bị hủy, hệ thống hoàn lại đúng số lượng đã mua và đánh dấu cờ `stock_restocked = True` để tránh cộng dồn nhiều lần.
