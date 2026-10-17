import fs from 'fs';
import path from 'path';
import {
  CategoryData,
  BrandData,
  ProductData,
  CouponData,
  OrderData,
  ReviewData,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS
} from './products.js';

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  password: string; // Plain/hash for demo accounts
  phone: string;
  address: string;
  role: 'customer' | 'admin';
  created_at: string;
}

const DATA_FILE = path.resolve(process.cwd(), '.techzone_state.json');

class TechzoneStore {
  public categories: CategoryData[] = [...INITIAL_CATEGORIES];
  public brands: BrandData[] = [...INITIAL_BRANDS];
  public products: ProductData[] = [...INITIAL_PRODUCTS];
  public coupons: CouponData[] = [...INITIAL_COUPONS];
  public orders: OrderData[] = [...INITIAL_ORDERS];
  public reviews: ReviewData[] = [...INITIAL_REVIEWS];
  public wishlists: { [userId: number]: number[] } = {
    2: [1, 10],
    3: [4, 16]
  };
  public users: UserAccount[] = [
    {
      id: 1,
      name: 'Quản Trị Viên TechZone',
      email: 'admin@techzone.vn',
      password: 'admin123',
      phone: '0901234567',
      address: 'Tầng 12, Tòa nhà TechZone Tower, Q.1, TP. Hồ Chí Minh',
      role: 'admin',
      created_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Nguyễn Văn An',
      email: 'khachhang@techzone.vn',
      password: 'user123',
      phone: '0987654321',
      address: 'Số 45 Đường Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      role: 'customer',
      created_at: '2026-02-15T00:00:00Z'
    },
    {
      id: 3,
      name: 'Trần Minh Quân',
      email: 'tranminh@gmail.com',
      password: 'user123',
      phone: '0912345678',
      address: 'Số 18 Hoàng Cầu, Đống Đa, Hà Nội',
      role: 'customer',
      created_at: '2026-03-01T00:00:00Z'
    }
  ];

  constructor() {
    this.loadFromDisk();
  }

  private saveToDisk() {
    try {
      const data = {
        categories: this.categories,
        brands: this.brands,
        products: this.products,
        coupons: this.coupons,
        orders: this.orders,
        reviews: this.reviews,
        wishlists: this.wishlists,
        users: this.users
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Ignore disk write errors in sandboxed environments
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && parsed.products.length > 0) this.products = parsed.products;
        if (parsed.categories) this.categories = parsed.categories;
        if (parsed.brands) this.brands = parsed.brands;
        if (parsed.coupons) this.coupons = parsed.coupons;
        if (parsed.orders) this.orders = parsed.orders;
        if (parsed.reviews) this.reviews = parsed.reviews;
        if (parsed.wishlists) this.wishlists = parsed.wishlists;
        if (parsed.users) this.users = parsed.users;
      }
    } catch {
      // fallback to initial data
    }
  }

  // --- SẢN PHẨM ---
  public getProducts(params: {
    category?: string;
    brand?: string;
    brand_id?: number;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    featured?: boolean;
    new?: boolean;
    q?: string;
    sort?: string;
    page?: number;
    per_page?: number;
  }) {
    let filtered = this.products.filter(p => p.status !== 'hidden');

    if (params.category) {
      filtered = filtered.filter(p => p.category_slug === params.category);
    }
    if (params.category_id) {
      filtered = filtered.filter(p => p.category_id === Number(params.category_id));
    }
    if (params.brand) {
      filtered = filtered.filter(p => p.brand_name.toLowerCase() === params.brand?.toLowerCase());
    }
    if (params.brand_id) {
      filtered = filtered.filter(p => p.brand_id === Number(params.brand_id));
    }
    if (params.min_price !== undefined) {
      filtered = filtered.filter(p => {
        const curr = p.sale_price || p.price;
        return curr >= params.min_price!;
      });
    }
    if (params.max_price !== undefined) {
      filtered = filtered.filter(p => {
        const curr = p.sale_price || p.price;
        return curr <= params.max_price!;
      });
    }
    if (params.in_stock) {
      filtered = filtered.filter(p => p.stock_quantity > 0);
    }
    if (params.featured) {
      filtered = filtered.filter(p => p.is_featured);
    }
    if (params.new) {
      filtered = filtered.filter(p => p.is_new);
    }
    if (params.q) {
      const q = params.q.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    // Sắp xếp
    if (params.sort === 'price_asc') {
      filtered.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (params.sort === 'price_desc') {
      filtered.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    } else if (params.sort === 'newest') {
      filtered.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0) || b.id - a.id);
    } else {
      // Default: featured first then ID
      filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || a.id - b.id);
    }

    const page = Math.max(1, params.page || 1);
    const perPage = Math.max(1, params.per_page || 12);
    const total = filtered.length;
    const pages = Math.ceil(total / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return {
      products: paginated,
      total,
      page,
      pages,
      per_page: perPage
    };
  }

  public getProductDetail(slugOrId: string) {
    const isId = /^\d+$/.test(slugOrId);
    const product = isId
      ? this.products.find(p => p.id === Number(slugOrId))
      : this.products.find(p => p.slug === slugOrId);

    if (!product) return null;

    const reviews = this.reviews.filter(r => r.product_id === product.id);
    const related = this.products
      .filter(p => p.category_id === product.category_id && p.id !== product.id && p.status === 'active')
      .slice(0, 4);

    return {
      product,
      reviews,
      related_products: related
    };
  }

  // --- COUPON VALIDATION ---
  public validateCoupon(code: string, subtotal: number) {
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.is_active);
    if (!coupon) {
      return { valid: false, error: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' };
    }
    if (coupon.used_count >= coupon.usage_limit) {
      return { valid: false, error: 'Mã giảm giá đã hết lượt sử dụng.' };
    }
    if (subtotal < coupon.min_order_value) {
      return {
        valid: false,
        error: `Đơn hàng tối thiểu ${coupon.min_order_value.toLocaleString('vi-VN')} ₫ để dùng mã này.`
      };
    }

    let discount = 0;
    if (coupon.discount_type === 'percent') {
      discount = subtotal * (coupon.discount_value / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    discount = Math.min(discount, subtotal);

    return {
      valid: true,
      code: coupon.code,
      description: coupon.description,
      discount_amount: discount
    };
  }

  // --- CHECKOUT & TRANSACTIONAL STOCK DECREMENT ---
  public createOrder(orderPayload: {
    user_id: number | null;
    recipient_name: string;
    phone: string;
    email: string;
    shipping_address: string;
    notes?: string;
    payment_method: 'cod' | 'bank_transfer';
    coupon_code?: string;
    items: { product_id: number; quantity: number }[];
  }) {
    if (!orderPayload.items || orderPayload.items.length === 0) {
      throw new Error('Giỏ hàng của bạn đang trống.');
    }

    let subtotal = 0;
    const itemsSnapshot = [];

    // 1. Kiểm tra tồn kho trước & tính giá chính thức từ server
    for (const reqItem of orderPayload.items) {
      const product = this.products.find(p => p.id === reqItem.product_id);
      if (!product) {
        throw new Error(`Sản phẩm mã #${reqItem.product_id} không tồn tại.`);
      }
      if (product.status !== 'active') {
        throw new Error(`Sản phẩm "${product.name}" hiện không mở bán.`);
      }
      if (product.stock_quantity < reqItem.quantity) {
        throw new Error(
          `Sản phẩm "${product.name}" chỉ còn ${product.stock_quantity} cái trong kho. Không thể đặt ${reqItem.quantity}.`
        );
      }

      const unitPrice = product.sale_price !== null ? product.sale_price : product.price;
      const lineTotal = unitPrice * reqItem.quantity;
      subtotal += lineTotal;

      itemsSnapshot.push({
        product,
        quantity: reqItem.quantity,
        unitPrice,
        lineTotal
      });
    }

    // 2. Trừ tồn kho nguyên tử
    for (const snap of itemsSnapshot) {
      snap.product.stock_quantity -= snap.quantity;
    }

    // 3. Xử lý mã giảm giá
    let discountAmount = 0;
    let validCouponCode: string | null = null;
    if (orderPayload.coupon_code) {
      const couponCheck = this.validateCoupon(orderPayload.coupon_code, subtotal);
      if (couponCheck.valid && couponCheck.discount_amount) {
        discountAmount = couponCheck.discount_amount;
        validCouponCode = couponCheck.code!;
        const c = this.coupons.find(x => x.code === validCouponCode);
        if (c) c.used_count += 1;
      }
    }

    // 4. Phí vận chuyển: Miễn phí nếu >= 1.000.000 ₫, ngược lại 30.000 ₫
    const shippingFee = subtotal >= 1000000 ? 0 : 30000;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderCode = `TZ-${dateStr}-${randStr}`;

    const newOrder: OrderData = {
      id: this.orders.length ? Math.max(...this.orders.map(o => o.id)) + 1 : 1,
      order_code: orderCode,
      user_id: orderPayload.user_id,
      recipient_name: orderPayload.recipient_name,
      phone: orderPayload.phone,
      email: orderPayload.email,
      shipping_address: orderPayload.shipping_address,
      notes: orderPayload.notes || '',
      payment_method: orderPayload.payment_method,
      payment_status: 'unpaid',
      subtotal,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      coupon_code: validCouponCode,
      status: 'pending',
      stock_restocked: false,
      created_at: new Date().toISOString(),
      items: itemsSnapshot.map((s, idx) => ({
        id: idx + 1,
        product_id: s.product.id,
        product_name: s.product.name,
        product_sku: s.product.sku,
        unit_price: s.unitPrice,
        quantity: s.quantity,
        subtotal: s.lineTotal
      }))
    };

    this.orders.unshift(newOrder);
    this.saveToDisk();

    return newOrder;
  }

  // --- HỦY ĐƠN & HOÀN TỒN KHO AN TOÀN (IDEMPOTENT) ---
  public cancelOrder(orderId: number, userId?: number, isAdmin = false) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng.');
    }

    if (!isAdmin && userId && order.user_id !== userId) {
      throw new Error('Bạn không có quyền thao tác trên đơn hàng này.');
    }

    if (!['pending', 'confirmed'].includes(order.status) && !isAdmin) {
      throw new Error(`Đơn hàng đang ở trạng thái "${order.status}", không thể tự hủy.`);
    }

    // Hoàn lại kho nếu chưa hoàn lần nào
    if (!order.stock_restocked) {
      for (const item of order.items) {
        const prod = this.products.find(p => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity += item.quantity;
        }
      }
      order.stock_restocked = true;
    }

    order.status = 'cancelled';
    this.saveToDisk();
    return order;
  }

  // --- CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (ADMIN) ---
  public updateOrderStatus(orderId: number, newStatus: OrderData['status']) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Không tìm thấy đơn hàng.');

    if (newStatus === 'cancelled' && !order.stock_restocked) {
      for (const item of order.items) {
        const prod = this.products.find(p => p.id === item.product_id);
        if (prod) prod.stock_quantity += item.quantity;
      }
      order.stock_restocked = true;
    } else if (order.status === 'cancelled' && newStatus !== 'cancelled' && order.stock_restocked) {
      for (const item of order.items) {
        const prod = this.products.find(p => p.id === item.product_id);
        if (prod && prod.stock_quantity >= item.quantity) {
          prod.stock_quantity -= item.quantity;
        }
      }
      order.stock_restocked = false;
    }

    order.status = newStatus;
    if (newStatus === 'delivered') {
      order.payment_status = 'paid';
    }

    this.saveToDisk();
    return order;
  }

  // --- ĐÁNH GIÁ SẢN PHẨM ---
  public addReview(productId: number, userId: number, rating: number, comment: string) {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('Yêu cầu đăng nhập.');

    // Kiểm tra xem khách đã từng mua sản phẩm này chưa
    const hasBought = this.orders.some(
      o => o.user_id === userId &&
           ['confirmed', 'shipping', 'delivered'].includes(o.status) &&
           o.items.some(i => i.product_id === productId)
    );

    if (!hasBought) {
      throw new Error('Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua hàng thành công.');
    }

    let review = this.reviews.find(r => r.product_id === productId && r.user_id === userId);
    if (review) {
      review.rating = rating;
      review.comment = comment;
      review.created_at = new Date().toISOString();
    } else {
      review = {
        id: this.reviews.length ? Math.max(...this.reviews.map(r => r.id)) + 1 : 1,
        product_id: productId,
        user_id: userId,
        author_name: user.name,
        rating,
        comment,
        created_at: new Date().toISOString()
      };
      this.reviews.push(review);
    }

    // Cập nhật rating trung bình của sản phẩm
    const productReviews = this.reviews.filter(r => r.product_id === productId);
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    const prod = this.products.find(p => p.id === productId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1));
      prod.review_count = productReviews.length;
    }

    this.saveToDisk();
    return review;
  }

  // --- WISHLIST ---
  public toggleWishlist(userId: number, productId: number) {
    if (!this.wishlists[userId]) this.wishlists[userId] = [];
    const list = this.wishlists[userId];
    const idx = list.indexOf(productId);
    let added = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      added = false;
    } else {
      list.push(productId);
      added = true;
    }
    this.saveToDisk();
    return { added, wishlist: list };
  }

  public getWishlistProducts(userId: number) {
    const ids = this.wishlists[userId] || [];
    return this.products.filter(p => ids.includes(p.id));
  }

  // --- ADMIN DASHBOARD ANALYTICS ---
  public getAdminStats() {
    const totalRevenue = this.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const totalOrders = this.orders.length;
    const totalCustomers = this.users.filter(u => u.role === 'customer').length;
    const totalProducts = this.products.length;

    const lowStockProducts = this.products
      .filter(p => p.stock_quantity <= 15 && p.status !== 'hidden')
      .sort((a, b) => a.stock_quantity - b.stock_quantity)
      .slice(0, 8);

    const recentOrders = this.orders.slice(0, 8);

    const ordersByStatus = {
      pending: this.orders.filter(o => o.status === 'pending').length,
      confirmed: this.orders.filter(o => o.status === 'confirmed').length,
      shipping: this.orders.filter(o => o.status === 'shipping').length,
      delivered: this.orders.filter(o => o.status === 'delivered').length,
      cancelled: this.orders.filter(o => o.status === 'cancelled').length
    };

    // Doanh thu theo tháng
    const monthlyRevenue = [
      { month: 'T5', revenue: 45000000 },
      { month: 'T6', revenue: 78000000 },
      { month: 'T7', revenue: 62000000 },
      { month: 'T8', revenue: 89000000 },
      { month: 'T9', revenue: 104000000 },
      { month: 'T10', revenue: totalRevenue }
    ];

    return {
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      total_customers: totalCustomers,
      total_products: totalProducts,
      low_stock_products: lowStockProducts,
      recent_orders: recentOrders,
      orders_by_status: ordersByStatus,
      monthly_revenue: monthlyRevenue
    };
  }

  // --- PRODUCT CRUD (ADMIN) ---
  public createProduct(data: Partial<ProductData>) {
    if (!data.name || !data.sku) {
      throw new Error('Vui lòng cung cấp tên sản phẩm và mã SKU.');
    }
    if ((data.price || 0) < 0 || (data.sale_price !== undefined && data.sale_price !== null && data.sale_price < 0)) {
      throw new Error('Giá sản phẩm không được là số âm.');
    }
    if ((data.stock_quantity || 0) < 0) {
      throw new Error('Số lượng tồn kho không được là số âm.');
    }

    const cat = this.categories.find(c => c.id === data.category_id) || this.categories[0];
    const brand = this.brands.find(b => b.id === data.brand_id) || this.brands[0];

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProd: ProductData = {
      id: this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1,
      category_id: cat.id,
      category_name: cat.name,
      category_slug: cat.slug,
      brand_id: brand.id,
      brand_name: brand.name,
      sku: data.sku.toUpperCase(),
      name: data.name,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      price: data.price || 0,
      sale_price: data.sale_price || null,
      stock_quantity: data.stock_quantity || 0,
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      short_description: data.short_description || '',
      description: data.description || '',
      specs: data.specs || {},
      is_featured: !!data.is_featured,
      is_new: !!data.is_new,
      status: data.status || 'active',
      rating: 5.0,
      review_count: 0
    };

    this.products.unshift(newProd);
    this.saveToDisk();
    return newProd;
  }

  public updateProduct(id: number, data: Partial<ProductData>) {
    const prod = this.products.find(p => p.id === id);
    if (!prod) throw new Error('Không tìm thấy sản phẩm.');

    if (data.price !== undefined && data.price < 0) {
      throw new Error('Giá bán không được âm.');
    }
    if (data.sale_price !== undefined && data.sale_price !== null && data.sale_price < 0) {
      throw new Error('Giá khuyến mãi không được âm.');
    }
    if (data.stock_quantity !== undefined && data.stock_quantity < 0) {
      throw new Error('Tồn kho không được âm.');
    }

    if (data.category_id) {
      const cat = this.categories.find(c => c.id === data.category_id);
      if (cat) {
        prod.category_id = cat.id;
        prod.category_name = cat.name;
        prod.category_slug = cat.slug;
      }
    }
    if (data.brand_id) {
      const brand = this.brands.find(b => b.id === data.brand_id);
      if (brand) {
        prod.brand_id = brand.id;
        prod.brand_name = brand.name;
      }
    }

    Object.assign(prod, {
      ...data,
      id: prod.id // preserve id
    });

    this.saveToDisk();
    return prod;
  }

  public deleteProduct(id: number) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx < 0) throw new Error('Không tìm thấy sản phẩm.');

    // Kiểm tra xem đã có đơn hàng nào mua sản phẩm này chưa
    const hasOrder = this.orders.some(o => o.items.some(i => i.product_id === id));
    if (hasOrder) {
      this.products[idx].status = 'hidden';
      this.saveToDisk();
      return { message: 'Sản phẩm đã có trong đơn hàng nên được ẩn đi thay vì xóa.' };
    }

    this.products.splice(idx, 1);
    this.saveToDisk();
    return { message: 'Xóa sản phẩm thành công.' };
  }

  // --- COUPON MANAGEMENT ---
  public createCoupon(data: Partial<CouponData>) {
    if (!data.code || !data.discount_value) {
      throw new Error('Vui lòng điền mã và giá trị giảm giá.');
    }
    const newCoupon: CouponData = {
      id: this.coupons.length ? Math.max(...this.coupons.map(c => c.id)) + 1 : 1,
      code: data.code.toUpperCase(),
      description: data.description || '',
      discount_type: data.discount_type || 'percent',
      discount_value: data.discount_value,
      min_order_value: data.min_order_value || 0,
      max_discount: data.max_discount || null,
      usage_limit: data.usage_limit || 100,
      used_count: 0,
      is_active: data.is_active !== undefined ? data.is_active : true
    };
    this.coupons.push(newCoupon);
    this.saveToDisk();
    return newCoupon;
  }
}

export const store = new TechzoneStore();
