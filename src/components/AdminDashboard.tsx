import { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Download,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Boxes
} from 'lucide-react';
import { AdminStats, Product, Order, Coupon, Category, Brand } from '../types';
import { api } from '../services/api';
import { formatVND, formatDate, ORDER_STATUS_LABELS } from '../utils/format';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  brands: Brand[];
  onDataChanged: () => void;
  onDownloadZip: () => void;
}

export function AdminDashboard({
  isOpen,
  onClose,
  categories,
  brands,
  onDataChanged,
  onDownloadZip
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter/Search states
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<number | ''>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Product CRUD modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    price: 0,
    sale_price: '' as string | number,
    stock_quantity: 0,
    category_id: categories[0]?.id || 1,
    brand_id: brands[0]?.id || 1,
    thumbnail: '',
    short_description: '',
    description: '',
    is_featured: false,
    is_new: false,
    status: 'active' as 'active' | 'hidden'
  });
  const [productFormError, setProductFormError] = useState<string | null>(null);

  // Coupon create form state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    description: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    discount_value: 10,
    min_order_value: 0,
    max_discount: '',
    usage_limit: 100
  });

  const [message, setMessage] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [dash, prods, ords, custs, coups] = await Promise.all([
        api.getAdminDashboard(),
        api.getProducts({ per_page: 100 }),
        api.getAdminOrders(),
        api.getAdminCustomers(),
        api.getAdminCoupons()
      ]);
      setStats(dash);
      setProducts(prods.products || []);
      setOrders(ords.orders || []);
      setCustomers(custs.customers || []);
      setCoupons(coups.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- PRODUCT CRUD HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      sku: `TZ-${Date.now().toString().slice(-6)}`,
      price: 1000000,
      sale_price: '',
      stock_quantity: 10,
      category_id: categories[0]?.id || 1,
      brand_id: brands[0]?.id || 1,
      thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      short_description: '',
      description: 'Sản phẩm công nghệ chính hãng TechZone phân phối.',
      is_featured: false,
      is_new: true,
      status: 'active'
    });
    setProductFormError(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      sku: prod.sku,
      price: prod.price,
      sale_price: prod.sale_price !== null ? prod.sale_price : '',
      stock_quantity: prod.stock_quantity,
      category_id: prod.category_id,
      brand_id: prod.brand_id,
      thumbnail: prod.thumbnail,
      short_description: prod.short_description || '',
      description: prod.description || '',
      is_featured: prod.is_featured,
      is_new: prod.is_new,
      status: prod.status === 'hidden' ? 'hidden' : 'active'
    });
    setProductFormError(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError(null);

    // KIỂM TRA ĐẦU VÀO: Không cho phép giá hoặc số lượng âm
    if (productForm.price < 0) {
      setProductFormError('Giá bán sản phẩm không được là số âm.');
      return;
    }
    const salePriceNum = productForm.sale_price !== '' ? Number(productForm.sale_price) : null;
    if (salePriceNum !== null && salePriceNum < 0) {
      setProductFormError('Giá khuyến mãi không được là số âm.');
      return;
    }
    if (productForm.stock_quantity < 0) {
      setProductFormError('Số lượng tồn kho không được là số âm.');
      return;
    }
    if (!productForm.name.trim() || !productForm.sku.trim()) {
      setProductFormError('Vui lòng điền tên sản phẩm và mã SKU.');
      return;
    }

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        sale_price: salePriceNum,
        stock_quantity: Number(productForm.stock_quantity)
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        setMessage(`Cập nhật thành công sản phẩm: ${productForm.name}`);
      } else {
        await api.createProduct(payload);
        setMessage(`Thêm mới thành công sản phẩm: ${productForm.name}`);
      }

      setIsProductModalOpen(false);
      fetchAllData();
      onDataChanged();
    } catch (err: any) {
      setProductFormError(err.message || 'Lỗi khi lưu sản phẩm');
    }
  };

  const handleDeleteProduct = async (prod: Product) => {
    if (!confirm(`Bạn có chắc muốn xóa hoặc ẩn sản phẩm "${prod.name}"?`)) return;
    try {
      const res = await api.deleteProduct(prod.id);
      setMessage(res.message);
      fetchAllData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- ORDER STATUS UPDATE ---
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      setMessage(res.message);
      fetchAllData();
      onDataChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- COUPON CREATE ---
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    try {
      await api.createCoupon({
        ...couponForm,
        code: couponForm.code.trim().toUpperCase(),
        max_discount: couponForm.max_discount ? Number(couponForm.max_discount) : null
      });
      setMessage(`Tạo mã ưu đãi ${couponForm.code} thành công!`);
      setIsCouponModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesQ = productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCatFilter === '' || p.category_id === Number(productCatFilter);
    return matchesQ && matchesCat;
  });

  const filteredOrders = orders.filter(o => {
    const matchesStatus = !orderStatusFilter || o.status === orderStatusFilter;
    const matchesQ = !orderSearch ||
      o.order_code.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.recipient_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchesStatus && matchesQ;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-50 w-full max-w-6xl h-[95vh] border border-slate-200 shadow-2xl flex flex-col rounded-2xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-white text-slate-900 p-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              TZ
            </span>
            <div>
              <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                <span>TECHZONE ADMIN SUITE</span>
                <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 border border-blue-200">
                  Phân quyền Quản trị
                </span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Quản lý kho hàng, đơn hàng, khách hàng, mã giảm giá và xuất mã nguồn đồ án
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadZip}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
              title="Tải toàn bộ source code Flask Backend + MySQL schema + Seed"
            >
              <Download className="w-4 h-4" />
              <span>Tải file TECHZONE.zip</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Toolbar */}
        <div className="bg-white border-b border-slate-200 px-4 flex flex-wrap items-center justify-between text-xs font-semibold">
          <div className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 py-3 px-2 border-b-2 transition-colors ${
                activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng quan</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 py-3 px-2 border-b-2 transition-colors ${
                activeTab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Sản phẩm ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 py-3 px-2 border-b-2 transition-colors ${
                activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đơn hàng ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-1.5 py-3 px-2 border-b-2 transition-colors ${
                activeTab === 'customers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Khách hàng ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-1.5 py-3 px-2 border-b-2 transition-colors ${
                activeTab === 'coupons' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Mã giảm giá ({coupons.length})</span>
            </button>
          </div>

          <div className="py-2 text-[11px] text-slate-500 font-mono hidden md:block">
            Database: <span className="font-bold text-slate-700">techzone_db</span>
          </div>
        </div>

        {/* Thông báo thao tác */}
        {message && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{message}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600 text-xs">
              Đóng
            </button>
          </div>
        )}

        {/* Nội dung Tab */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: OVERVIEW & DASHBOARD METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Khối KPIs thống kê */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>TỔNG DOANH THU</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                    {formatVND(stats?.total_revenue || 0)}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Từ {stats?.total_orders || 0} đơn hàng thực tế</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>TỔNG ĐƠN HÀNG</span>
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                    {stats?.total_orders || 0}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Chờ duyệt: {stats?.orders_by_status?.pending || 0} · Đang giao: {stats?.orders_by_status?.shipping || 0}
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>TỔNG SẢN PHẨM</span>
                    <Boxes className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                    {stats?.total_products || products.length}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Phân bổ trên 9 danh mục công nghệ
                  </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>KHÁCH HÀNG</span>
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                    {stats?.total_customers || customers.length}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Đã đăng ký tài khoản thành viên
                  </div>
                </div>
              </div>

              {/* Biểu đồ doanh thu 6 tháng gần nhất (Dạng SVG Bar Chart trực quan) */}
              <div className="p-5 bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Biểu đồ Doanh thu Theo Tháng (Năm 2026)
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Đơn vị: VNĐ</span>
                </div>

                <div className="h-44 flex items-end gap-4 sm:gap-8 pt-6 border-b border-slate-200 px-4">
                  {(stats?.monthly_revenue || []).map((m, idx) => {
                    const maxVal = 120000000;
                    const heightPercent = Math.min(100, Math.round((m.revenue / maxVal) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] text-slate-500 font-mono tabular-nums">
                          {(m.revenue / 1000000).toFixed(0)}Tr
                        </span>
                        <div
                          style={{ height: `${Math.max(10, heightPercent)}%` }}
                          className={`w-full max-w-[48px] transition-all duration-500 ${
                            idx === (stats?.monthly_revenue || []).length - 1
                              ? 'bg-blue-600'
                              : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                        />
                        <span className="text-xs font-bold text-slate-700">{m.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bảng Cảnh báo Sản phẩm Sắp Hết Hàng */}
              <div className="p-5 bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Cảnh báo tồn kho thấp (Tồn ≤ 15 sản phẩm)</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Xem toàn bộ kho
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                      <tr>
                        <th className="p-2.5">Mã SKU</th>
                        <th className="p-2.5">Tên sản phẩm</th>
                        <th className="p-2.5">Danh mục</th>
                        <th className="p-2.5 text-right">Giá bán</th>
                        <th className="p-2.5 text-center">Tồn kho</th>
                        <th className="p-2.5 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(stats?.low_stock_products || []).map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-slate-600 font-semibold">{p.sku}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{p.name}</td>
                          <td className="p-2.5 text-slate-600">{p.category_name}</td>
                          <td className="p-2.5 text-right tabular-nums font-bold">
                            {formatVND(p.sale_price || p.price)}
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 font-bold tabular-nums">
                              {p.stock_quantity}
                            </span>
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              Nhập thêm kho
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUẢN LÝ SẢN PHẨM (CRUD HOÀN CHỈNH) */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Toolbar tìm kiếm & lọc */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-slate-200">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative min-w-[200px]">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      placeholder="Tìm theo tên hoặc SKU..."
                      className="w-full p-2 pl-8 text-xs border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  <select
                    value={productCatFilter}
                    onChange={e => setProductCatFilter(e.target.value ? Number(e.target.value) : '')}
                    className="p-2 text-xs border border-slate-300 bg-white focus:outline-none"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm sản phẩm mới</span>
                </button>
              </div>

              {/* Bảng danh sách sản phẩm */}
              <div className="bg-white border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                    <tr>
                      <th className="p-3">Ảnh</th>
                      <th className="p-3">Mã SKU</th>
                      <th className="p-3">Tên sản phẩm</th>
                      <th className="p-3">Hãng</th>
                      <th className="p-3">Danh mục</th>
                      <th className="p-3 text-right">Giá niêm yết</th>
                      <th className="p-3 text-right">Giá bán</th>
                      <th className="p-3 text-center">Tồn kho</th>
                      <th className="p-3 text-center">Trạng thái</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <img
                            src={prod.thumbnail}
                            alt=""
                            className="w-10 h-10 object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="p-3 font-mono text-slate-600 font-bold">{prod.sku}</td>
                        <td className="p-3 font-semibold text-slate-900 max-w-xs">{prod.name}</td>
                        <td className="p-3 text-slate-700 font-medium">{prod.brand_name}</td>
                        <td className="p-3 text-slate-600">{prod.category_name}</td>
                        <td className="p-3 text-right tabular-nums text-slate-500">
                          {formatVND(prod.price)}
                        </td>
                        <td className="p-3 text-right tabular-nums font-bold text-blue-600">
                          {formatVND(prod.sale_price || prod.price)}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 font-bold tabular-nums border text-[11px] ${
                            prod.stock_quantity <= 10
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {prod.stock_quantity}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            prod.status === 'active' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                          }`}>
                            {prod.status === 'active' ? 'Đang bán' : 'Ẩn'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Sửa sản phẩm"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod)}
                            className="p-1 text-rose-600 hover:text-rose-800"
                            title="Xóa/Ẩn sản phẩm"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QUẢN LÝ ĐƠN HÀNG */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-slate-200">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative min-w-[220px]">
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      placeholder="Tìm theo mã đơn, tên, sđt..."
                      className="w-full p-2 pl-8 text-xs border border-slate-300 focus:outline-none focus:border-blue-600"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    className="p-2 text-xs border border-slate-300 bg-white focus:outline-none"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="shipping">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                <div className="text-xs text-slate-500">
                  Tổng {filteredOrders.length} đơn hàng
                </div>
              </div>

              <div className="bg-white border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                    <tr>
                      <th className="p-3">Mã đơn</th>
                      <th className="p-3">Ngày tạo</th>
                      <th className="p-3">Khách hàng</th>
                      <th className="p-3">Số điện thoại</th>
                      <th className="p-3">Hình thức TT</th>
                      <th className="p-3 text-right">Tổng tiền</th>
                      <th className="p-3 text-center">Trạng thái</th>
                      <th className="p-3 text-center">Cập nhật trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map(ord => {
                      const statusInfo = ORDER_STATUS_LABELS[ord.status] || {
                        label: ord.status,
                        color: 'bg-slate-100 text-slate-700'
                      };

                      return (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-blue-600">{ord.order_code}</td>
                          <td className="p-3 text-slate-500">{formatDate(ord.created_at)}</td>
                          <td className="p-3 font-semibold text-slate-900">{ord.recipient_name}</td>
                          <td className="p-3 text-slate-600 font-mono">{ord.phone}</td>
                          <td className="p-3">
                            <span className="uppercase text-[10px] font-bold text-slate-700">
                              {ord.payment_method === 'bank_transfer' ? 'Chuyển khoản' : 'COD'}
                            </span>
                          </td>
                          <td className="p-3 text-right tabular-nums font-black text-slate-900">
                            {formatVND(ord.total_amount)}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 text-[11px] font-semibold border ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <select
                              value={ord.status}
                              onChange={e => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="p-1 border border-slate-300 text-xs bg-white focus:outline-none"
                            >
                              <option value="pending">Chờ xác nhận</option>
                              <option value="confirmed">Đã xác nhận</option>
                              <option value="shipping">Đang giao</option>
                              <option value="delivered">Đã giao</option>
                              <option value="cancelled">Hủy đơn (Hoàn kho)</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: QUẢN LÝ KHÁCH HÀNG */}
          {activeTab === 'customers' && (
            <div className="bg-white border border-slate-200 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="p-3">Họ và tên</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Số điện thoại</th>
                    <th className="p-3">Địa chỉ</th>
                    <th className="p-3 text-center">Số đơn đã mua</th>
                    <th className="p-3 text-right">Tổng chi tiêu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{c.name}</td>
                      <td className="p-3 text-slate-600 font-mono">{c.email}</td>
                      <td className="p-3 text-slate-600 font-mono">{c.phone || 'Chưa có'}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{c.address || 'Chưa có'}</td>
                      <td className="p-3 text-center font-bold text-slate-900">{c.order_count || 0}</td>
                      <td className="p-3 text-right tabular-nums font-black text-blue-600">
                        {formatVND(c.total_spent || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: QUẢN LÝ MÃ GIẢM GIÁ */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-3 border border-slate-200">
                <span className="text-xs font-semibold text-slate-700">
                  Cấu hình mã khuyến mãi cho giỏ hàng
                </span>
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo mã giảm giá</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                    <tr>
                      <th className="p-3">Mã Code</th>
                      <th className="p-3">Mô tả</th>
                      <th className="p-3">Loại giảm</th>
                      <th className="p-3">Mức giảm</th>
                      <th className="p-3">Đơn tối thiểu</th>
                      <th className="p-3 text-center">Lượt dùng</th>
                      <th className="p-3 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coupons.map(cp => (
                      <tr key={cp.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-blue-600">{cp.code}</td>
                        <td className="p-3 text-slate-700">{cp.description}</td>
                        <td className="p-3">
                          {cp.discount_type === 'percent' ? 'Phần trăm (%)' : 'Số tiền cố định'}
                        </td>
                        <td className="p-3 font-bold text-slate-900 tabular-nums">
                          {cp.discount_type === 'percent'
                            ? `${cp.discount_value}%`
                            : formatVND(cp.discount_value)}
                        </td>
                        <td className="p-3 tabular-nums">{formatVND(cp.min_order_value)}</td>
                        <td className="p-3 text-center tabular-nums">
                          {cp.used_count} / {cp.usage_limit}
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            Hoạt động
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL THÊM / SỬA SẢN PHẨM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 text-slate-900">
              <h3 className="text-sm font-bold uppercase tracking-tight">
                {editingProduct ? `Sửa sản phẩm: ${editingProduct.name}` : 'Thêm sản phẩm mới'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="overflow-y-auto p-6 space-y-4 text-xs">
              {productFormError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                  {productFormError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Ví dụ: Laptop Dell XPS 14 Core Ultra 7"
                    className="w-full p-2 border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full p-2 border border-slate-300 font-mono uppercase focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số lượng tồn kho * (≥ 0)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={productForm.stock_quantity}
                    onChange={e => setProductForm({ ...productForm, stock_quantity: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giá niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giá khuyến mãi (Nếu có)</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.sale_price}
                    onChange={e => setProductForm({ ...productForm, sale_price: e.target.value })}
                    placeholder="Bỏ trống nếu không giảm"
                    className="w-full p-2 border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Danh mục *</label>
                  <select
                    value={productForm.category_id}
                    onChange={e => setProductForm({ ...productForm, category_id: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 bg-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thương hiệu *</label>
                  <select
                    value={productForm.brand_id}
                    onChange={e => setProductForm({ ...productForm, brand_id: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 bg-white focus:outline-none"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">URL Hình ảnh đại diện *</label>
                  <input
                    type="url"
                    required
                    value={productForm.thumbnail}
                    onChange={e => setProductForm({ ...productForm, thumbnail: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2 border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Mô tả tóm tắt</label>
                  <input
                    type="text"
                    value={productForm.short_description}
                    onChange={e => setProductForm({ ...productForm, short_description: e.target.value })}
                    className="w-full p-2 border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Mô tả chi tiết</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2 border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center gap-4 col-span-2 pt-2 border-t">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={productForm.is_featured}
                      onChange={e => setProductForm({ ...productForm, is_featured: e.target.checked })}
                    />
                    <span>Sản phẩm nổi bật</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={productForm.is_new}
                      onChange={e => setProductForm({ ...productForm, is_new: e.target.checked })}
                    />
                    <span>Hàng mới về</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium ml-auto">
                    <span>Trạng thái:</span>
                    <select
                      value={productForm.status}
                      onChange={e => setProductForm({ ...productForm, status: e.target.value as any })}
                      className="p-1 border border-slate-300 bg-white"
                    >
                      <option value="active">Đang bán</option>
                      <option value="hidden">Ẩn</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TẠO MÃ GIẢM GIÁ */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md shadow-2xl p-6 space-y-4 text-xs rounded-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold uppercase text-slate-900">Tạo mã giảm giá mới</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã Code *</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="VOUCHER2026"
                  className="w-full p-2 border border-slate-300 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả ngắn</label>
                <input
                  type="text"
                  value={couponForm.description}
                  onChange={e => setCouponForm({ ...couponForm, description: e.target.value })}
                  placeholder="Giảm 10% cho đơn từ 2 triệu"
                  className="w-full p-2 border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loại giảm</label>
                  <select
                    value={couponForm.discount_type}
                    onChange={e => setCouponForm({ ...couponForm, discount_type: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 bg-white"
                  >
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giá trị giảm *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={couponForm.discount_value}
                    onChange={e => setCouponForm({ ...couponForm, discount_value: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Đơn hàng tối thiểu (VNĐ)</label>
                <input
                  type="number"
                  min={0}
                  value={couponForm.min_order_value}
                  onChange={e => setCouponForm({ ...couponForm, min_order_value: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số lượt sử dụng tối đa</label>
                <input
                  type="number"
                  min={1}
                  value={couponForm.usage_limit}
                  onChange={e => setCouponForm({ ...couponForm, usage_limit: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold"
                >
                  Tạo mã
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
