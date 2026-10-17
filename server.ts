import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './server/data/store.js';
import { generateTechzoneZip } from './server/exportZip.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'TECHZONE E-Commerce API', timestamp: new Date().toISOString() });
  });

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    const user = store.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
    }
    const token = `fake-jwt-token-${user.id}-${Date.now()}`;
    const { password: _, ...userWithoutPass } = user;
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: userWithoutPass
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone, address } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu.' });
    }
    const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'Email này đã được đăng ký tài khoản.' });
    }
    // Bảo mật: Role luôn là 'customer'
    const newUser = {
      id: Math.max(...store.users.map(u => u.id)) + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: (phone || '').trim(),
      address: (address || '').trim(),
      role: 'customer' as const,
      created_at: new Date().toISOString()
    };
    store.users.push(newUser);
    const token = `fake-jwt-token-${newUser.id}-${Date.now()}`;
    const { password: _, ...userWithoutPass } = newUser;
    res.status(201).json({
      message: 'Đăng ký tài khoản thành công',
      token,
      user: userWithoutPass
    });
  });

  // Taxonomy
  app.get('/api/categories', (req, res) => {
    res.json({ categories: store.categories });
  });

  app.get('/api/brands', (req, res) => {
    res.json({ brands: store.brands });
  });

  // Products
  app.get('/api/products', (req, res) => {
    const { category, brand, min_price, max_price, in_stock, featured, new: isNew, q, sort, page, per_page } = req.query;
    const result = store.getProducts({
      category: category as string,
      brand: brand as string,
      min_price: min_price ? parseFloat(min_price as string) : undefined,
      max_price: max_price ? parseFloat(max_price as string) : undefined,
      in_stock: in_stock === 'true',
      featured: featured === 'true',
      new: isNew === 'true',
      q: q as string,
      sort: sort as string,
      page: page ? parseInt(page as string, 10) : 1,
      per_page: per_page ? parseInt(per_page as string, 10) : 12
    });
    res.json(result);
  });

  app.get('/api/products/:slugOrId', (req, res) => {
    const detail = store.getProductDetail(req.params.slugOrId);
    if (!detail) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
    }
    res.json(detail);
  });

  app.post('/api/products/:id/reviews', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { user_id, rating, comment } = req.body || {};
    if (!user_id) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập để đánh giá.' });
    }
    try {
      const review = store.addReview(productId, parseInt(user_id, 10), parseInt(rating, 10), comment);
      res.status(201).json({ message: 'Gửi đánh giá thành công!', review });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Lỗi khi gửi đánh giá.' });
    }
  });

  // Coupons
  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body || {};
    const result = store.validateCoupon(code || '', parseFloat(subtotal || 0));
    if (!result.valid) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  });

  // Orders & Checkout
  app.post('/api/orders/checkout', (req, res) => {
    try {
      const order = store.createOrder(req.body);
      const isBankTransfer = req.body.payment_method === 'bank_transfer';
      res.status(201).json({
        message: 'Đặt hàng thành công!',
        order,
        bank_info: isBankTransfer
          ? {
              bank_name: 'MB Bank (Ngân hàng Quân Đội)',
              account_number: '090123456789',
              account_holder: 'CONG TY TNHH TECHZONE VIET NAM',
              transfer_note: `THANHTOAN ${order.order_code}`,
              amount: order.total_amount
            }
          : null
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Lỗi xử lý đơn hàng.' });
    }
  });

  app.get('/api/orders/my-orders', (req, res) => {
    const userId = req.query.user_id ? parseInt(req.query.user_id as string, 10) : null;
    if (!userId) {
      return res.json({ orders: [] });
    }
    const orders = store.orders.filter(o => o.user_id === userId);
    res.json({ orders });
  });

  app.post('/api/orders/:id/cancel', (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    const userId = req.body.user_id ? parseInt(req.body.user_id, 10) : undefined;
    try {
      const order = store.cancelOrder(orderId, userId);
      res.json({ message: 'Hủy đơn hàng và hoàn lại tồn kho thành công!', order });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Lỗi khi hủy đơn hàng.' });
    }
  });

  // Wishlist
  app.get('/api/wishlist', (req, res) => {
    const userId = req.query.user_id ? parseInt(req.query.user_id as string, 10) : 0;
    const products = store.getWishlistProducts(userId);
    res.json({ products });
  });

  app.post('/api/wishlist/toggle', (req, res) => {
    const { user_id, product_id } = req.body || {};
    if (!user_id || !product_id) {
      return res.status(400).json({ error: 'Thiếu thông tin người dùng hoặc sản phẩm.' });
    }
    const result = store.toggleWishlist(parseInt(user_id, 10), parseInt(product_id, 10));
    res.json(result);
  });

  // Admin Portal API
  app.get('/api/admin/dashboard', (req, res) => {
    const stats = store.getAdminStats();
    res.json(stats);
  });

  app.post('/api/admin/products', (req, res) => {
    try {
      const product = store.createProduct(req.body);
      res.status(201).json({ message: 'Thêm sản phẩm thành công!', product });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/admin/products/:id', (req, res) => {
    try {
      const product = store.updateProduct(parseInt(req.params.id, 10), req.body);
      res.json({ message: 'Cập nhật sản phẩm thành công!', product });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete('/api/admin/products/:id', (req, res) => {
    try {
      const result = store.deleteProduct(parseInt(req.params.id, 10));
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/admin/orders', (req, res) => {
    const status = req.query.status as string;
    const q = (req.query.q as string || '').toLowerCase().trim();
    let orders = [...store.orders];
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    if (q) {
      orders = orders.filter(o =>
        o.order_code.toLowerCase().includes(q) ||
        o.recipient_name.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }
    res.json({ orders });
  });

  app.put('/api/admin/orders/:id/status', (req, res) => {
    try {
      const order = store.updateOrderStatus(parseInt(req.params.id, 10), req.body.status);
      res.json({ message: 'Cập nhật trạng thái thành công!', order });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/admin/customers', (req, res) => {
    const customers = store.users.filter(u => u.role === 'customer').map(c => {
      const { password, ...safe } = c;
      const orderCount = store.orders.filter(o => o.user_id === c.id).length;
      const totalSpent = store.orders
        .filter(o => o.user_id === c.id && o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0);
      return {
        ...safe,
        order_count: orderCount,
        total_spent: totalSpent
      };
    });
    res.json({ customers });
  });

  app.get('/api/admin/coupons', (req, res) => {
    res.json({ coupons: store.coupons });
  });

  app.post('/api/admin/coupons', (req, res) => {
    try {
      const coupon = store.createCoupon(req.body);
      res.status(201).json({ message: 'Tạo mã giảm giá thành công!', coupon });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ZIP Download endpoint
  app.get('/api/export-zip', async (req, res) => {
    try {
      const zipBuffer = await generateTechzoneZip();
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="TECHZONE.zip"');
      res.send(zipBuffer);
    } catch (err: any) {
      res.status(500).json({ error: 'Không thể tạo file ZIP: ' + err.message });
    }
  });

  // Mount Vite development middlewares
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);

  app.listen(port, 'localhost', () => {
    console.log(`TECHZONE full-stack server running at http://localhost:${port}`);
  });
}

startServer();
