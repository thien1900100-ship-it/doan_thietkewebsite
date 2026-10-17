import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

function addDirectoryToZip(zip: JSZip, localDirPath: string, zipDirPath: string) {
  if (!fs.existsSync(localDirPath)) return;
  const items = fs.readdirSync(localDirPath);
  for (const item of items) {
    const fullPath = path.join(localDirPath, item);
    const stat = fs.statSync(fullPath);
    const targetZipPath = zipDirPath ? `${zipDirPath}/${item}` : item;

    if (stat.isDirectory()) {
      if (item === 'node_modules' || item === '.git' || item === '__pycache__' || item === 'venv' || item === 'dist') {
        continue;
      }
      addDirectoryToZip(zip, fullPath, targetZipPath);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.file(targetZipPath, content);
    }
  }
}

export async function generateTechzoneZip(): Promise<Buffer> {
  const zip = new JSZip();

  // Thêm thư mục database
  const dbDir = path.resolve(process.cwd(), 'database');
  addDirectoryToZip(zip, dbDir, 'database');

  // Thêm toàn bộ thư mục python_app
  const pythonDir = path.resolve(process.cwd(), 'python_app');
  addDirectoryToZip(zip, pythonDir, 'TECHZONE_Flask_Backend');

  // Thêm file README tổng quan
  zip.file('README.md', `# TECHZONE - DỰ ÁN WEBSITE THƯƠNG MẠI ĐIỆN TỬ ĐỒ CÔNG NGHỆ

Gói mã nguồn đầy đủ đồ án công nghệ TECHZONE:
1. database/schema.sql : Cấu trúc cơ sở dữ liệu MySQL 8.0+
2. database/seed.sql : Dữ liệu mẫu hơn 30 sản phẩm công nghệ, 9 danh mục, đơn hàng và tài khoản
3. TECHZONE_Flask_Backend/ : Mã nguồn hoàn chỉnh Backend Python Flask + SQLAlchemy + JWT
4. Xem hướng dẫn cài đặt và chạy trong file TECHZONE_Flask_Backend/README.md

Tài khoản đăng nhập kiểm thử:
- Admin: admin@techzone.vn / admin123
- Khách hàng: khachhang@techzone.vn / user123
`);

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  // Lưu một bản vào thư mục gốc để người dùng có thể tải về trực tiếp
  fs.writeFileSync(path.resolve(process.cwd(), 'TECHZONE.zip'), buffer);

  return buffer;
}
