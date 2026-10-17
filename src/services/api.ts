import {
  Product,
  Category,
  Brand,
  Order,
  Review,
  Coupon,
  User,
  AdminStats
} from '../types';

export const api = {
  // Categories & Brands
  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await fetch('/api/categories');
    return res.json();
  },

  async getBrands(): Promise<{ brands: Brand[] }> {
    const res = await fetch('/api/brands');
    return res.json();
  },

  // Products
  async getProducts(params: Record<string, any> = {}): Promise<{
    products: Product[];
    total: number;
    page: number;
    pages: number;
    per_page: number;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
    const res = await fetch(`/api/products?${query.toString()}`);
    return res.json();
  },

  async getProductDetail(slugOrId: string): Promise<{
    product: Product;
    reviews: Review[];
    related_products: Product[];
  }> {
    const res = await fetch(`/api/products/${slugOrId}`);
    if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
    return res.json();
  },

  async submitReview(productId: number, data: { user_id: number; rating: number; comment: string }) {
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Lỗi khi gửi đánh giá');
    return json;
  },

  // Coupons
  async validateCoupon(code: string, subtotal: number): Promise<{
    valid: boolean;
    code: string;
    description: string;
    discount_amount: number;
  }> {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Mã giảm giá không hợp lệ');
    return json;
  },

  // Orders
  async checkout(orderData: any): Promise<{
    message: string;
    order: Order;
    bank_info: any;
  }> {
    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Lỗi khi đặt hàng');
    return json;
  },

  async getMyOrders(userId: number): Promise<{ orders: Order[] }> {
    const res = await fetch(`/api/orders/my-orders?user_id=${userId}`);
    return res.json();
  },

  async cancelOrder(orderId: number, userId: number): Promise<{ message: string; order: Order }> {
    const res = await fetch(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Lỗi khi hủy đơn hàng');
    return json;
  },

  // Wishlist
  async getWishlist(userId: number): Promise<{ products: Product[] }> {
    const res = await fetch(`/api/wishlist?user_id=${userId}`);
    return res.json();
  },

  async toggleWishlist(userId: number, productId: number): Promise<{ added: boolean; wishlist: number[] }> {
    const res = await fetch('/api/wishlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, product_id: productId })
    });
    return res.json();
  },

  // Auth
  async login(credentials: { email: string; password: string }): Promise<{
    message: string;
    token: string;
    user: User;
  }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Đăng nhập không thành công');
    return json;
  },

  async register(data: any): Promise<{
    message: string;
    token: string;
    user: User;
  }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Đăng ký không thành công');
    return json;
  },

  // Admin APIs
  async getAdminDashboard(): Promise<AdminStats> {
    const res = await fetch('/api/admin/dashboard');
    return res.json();
  },

  async createProduct(data: any): Promise<{ message: string; product: Product }> {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Lỗi khi thêm sản phẩm');
    return json;
  },

  async updateProduct(id: number, data: any): Promise<{ message: string; product: Product }> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Lỗi khi cập nhật sản phẩm');
    return json;
  },

  async deleteProduct(id: number): Promise<{ message: string }> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Lỗi khi xóa sản phẩm');
    return json;
  },

  async getAdminOrders(params: { status?: string; q?: string } = {}): Promise<{ orders: Order[] }> {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.q) query.append('q', params.q);
    const res = await fetch(`/api/admin/orders?${query.toString()}`);
    return res.json();
  },

  async updateOrderStatus(id: number, status: string): Promise<{ message: string; order: Order }> {
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Lỗi khi cập nhật trạng thái');
    return json;
  },

  async getAdminCustomers(): Promise<{ customers: any[] }> {
    const res = await fetch('/api/admin/customers');
    return res.json();
  },

  async getAdminCoupons(): Promise<{ coupons: Coupon[] }> {
    const res = await fetch('/api/admin/coupons');
    return res.json();
  },

  async createCoupon(data: any): Promise<{ message: string; coupon: Coupon }> {
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Lỗi khi tạo mã giảm giá');
    return json;
  }
};
