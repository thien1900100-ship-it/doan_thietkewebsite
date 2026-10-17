import { useState, useEffect, useCallback } from 'react';
import {
  Filter,
  ArrowUpDown,
  Search,
  Sparkles,
  PackageX,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  Download,
  Building,
  RotateCcw
} from 'lucide-react';
import { Product, Category, Brand, CartItem, User, Order } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AccountModal } from './components/AccountModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PolicyModal } from './components/PolicyModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // --- AUTH & DEMO ROLE STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 2,
    name: 'Nguyễn Văn An',
    email: 'khachhang@techzone.vn',
    phone: '0987654321',
    address: 'Số 45 Đường Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    role: 'customer'
  });

  // --- CATALOG & TAXONOMY ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // --- FILTER STATES ---
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // --- CART & WISHLIST ---
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('techzone_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlistIds, setWishlistIds] = useState<number[]>([1, 10]);

  // --- MODAL VISIBILITY STATES ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [policyType, setPolicyType] = useState<string | null>(null);
  const [orderSuccessData, setOrderSuccessData] = useState<{ order: Order; bankInfo: any } | null>(null);

  // --- TOAST NOTIFICATIONS ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('techzone_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Load Categories & Brands initial
  useEffect(() => {
    api.getCategories().then(res => setCategories(res.categories || []));
    api.getBrands().then(res => setBrands(res.brands || []));
  }, []);

  // Fetch Products based on current filters
  const loadProducts = useCallback(async () => {
    setLoading(true);

    let min_price: number | undefined;
    let max_price: number | undefined;

    if (selectedPriceRange === 'under-5m') {
      max_price = 5000000;
    } else if (selectedPriceRange === '5m-15m') {
      min_price = 5000000;
      max_price = 15000000;
    } else if (selectedPriceRange === '15m-30m') {
      min_price = 15000000;
      max_price = 30000000;
    } else if (selectedPriceRange === 'above-30m') {
      min_price = 30000000;
    }

    try {
      const res = await api.getProducts({
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        min_price,
        max_price,
        in_stock: inStockOnly || undefined,
        q: searchKeyword || undefined,
        sort: sortBy,
        page: currentPage,
        per_page: 12
      });

      setProducts(res.products || []);
      setTotalProducts(res.total || 0);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.error(err);
      addToast('Lỗi khi tải danh sách sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, selectedPriceRange, inStockOnly, searchKeyword, sortBy, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reset page when filters change
  const handleCategorySelect = (catSlug: string | null) => {
    setSelectedCategory(catSlug);
    setCurrentPage(1);
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
    const elem = document.getElementById('products-section');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPriceRange('all');
    setInStockOnly(false);
    setSearchKeyword('');
    setSortBy('default');
    setCurrentPage(1);
    addToast('Đã đặt lại tất cả bộ lọc', 'info');
  };

  // --- CART HANDLERS ---
  const handleAddToCart = (product: Product, quantity = 1) => {
    if (product.stock_quantity <= 0) {
      addToast(`Sản phẩm "${product.name}" hiện đang hết hàng`, 'error');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock_quantity, existing.quantity + quantity);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { product, quantity: Math.min(product.stock_quantity, quantity) }];
      }
    });

    addToast(`Đã thêm ${quantity} x "${product.name}" vào giỏ hàng`);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    addToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  // --- WISHLIST HANDLER ---
  const handleToggleWishlist = async (product: Product) => {
    const isWished = wishlistIds.includes(product.id);
    let next: number[];
    if (isWished) {
      next = wishlistIds.filter(id => id !== product.id);
      addToast(`Đã xóa "${product.name}" khỏi danh sách yêu thích`, 'info');
    } else {
      next = [...wishlistIds, product.id];
      addToast(`Đã thêm "${product.name}" vào danh sách yêu thích`);
    }
    setWishlistIds(next);

    if (currentUser) {
      api.toggleWishlist(currentUser.id, product.id).catch(console.error);
    }
  };

  // --- DEMO ROLE SWITCHER ---
  const handleRoleSwitch = (role: 'guest' | 'customer' | 'admin') => {
    if (role === 'guest') {
      setCurrentUser(null);
      setIsAdminOpen(false);
      addToast('Đã chuyển sang vai trò: Khách vãng lai (Chưa đăng nhập)', 'info');
    } else if (role === 'customer') {
      setCurrentUser({
        id: 2,
        name: 'Nguyễn Văn An',
        email: 'khachhang@techzone.vn',
        phone: '0987654321',
        address: 'Số 45 Đường Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        role: 'customer'
      });
      setIsAdminOpen(false);
      addToast('Đã chuyển sang: Khách hàng (Nguyễn Văn An)', 'success');
    } else {
      setCurrentUser({
        id: 1,
        name: 'Quản Trị Viên TechZone',
        email: 'admin@techzone.vn',
        phone: '0901234567',
        address: 'Tầng 12, Tòa nhà TechZone Tower, Q.1, TP. Hồ Chí Minh',
        role: 'admin'
      });
      setIsAdminOpen(true);
      addToast('Đã chuyển sang: Quản trị viên (Admin) - Đang mở trang quản trị', 'success');
    }
  };

  // --- ZIP DOWNLOAD HANDLER ---
  const handleDownloadZip = () => {
    addToast('Đang tạo và tải file nén TECHZONE.zip...', 'info');
    window.location.href = '/api/export-zip';
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Header & Navigation */}
      <Navbar
        currentUser={currentUser}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          if (!currentUser) setIsAuthOpen(true);
          else setIsAccountOpen(true);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenPolicy={type => setPolicyType(type)}
        onSearch={handleSearch}
        onRoleSwitch={handleRoleSwitch}
        onDownloadZip={handleDownloadZip}
      />

      {/* 2. Category Navigation Bar (9 Categories) */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* 3. Hero Campaign Banner */}
      {!searchKeyword && !selectedCategory && (
        <HeroBanner
          onExploreClick={() => {
            const elem = document.getElementById('products-section');
            elem?.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectProduct={prod => setSelectedProduct(prod)}
          featuredProduct={products.find(p => p.id === 1) || products[0]}
        />
      )}

      {/* 4. Main Product Catalog & Filter Layout */}
      <main id="products-section" className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cột trái: Bộ lọc đa năng (Filter Sidebar) */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 p-5 space-y-5 rounded-xl shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm uppercase tracking-wide">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span>Bộ lọc sản phẩm</span>
                </div>
                {(selectedCategory || selectedBrand || selectedPriceRange !== 'all' || inStockOnly || searchKeyword) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Đặt lại</span>
                  </button>
                )}
              </div>

              {/* Lọc theo Thương hiệu */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Thương hiệu công nghệ
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600">
                    <input
                      type="radio"
                      name="brand_filter"
                      checked={selectedBrand === null}
                      onChange={() => setSelectedBrand(null)}
                      className="text-blue-600"
                    />
                    <span>Tất cả thương hiệu</span>
                  </label>
                  {brands.map(b => (
                    <label
                      key={b.id}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600"
                    >
                      <input
                        type="radio"
                        name="brand_filter"
                        checked={selectedBrand === b.name}
                        onChange={() => setSelectedBrand(b.name)}
                        className="text-blue-600"
                      />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Lọc theo Khoảng giá */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Khoảng giá (VNĐ)
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <input
                      type="radio"
                      name="price_range"
                      checked={selectedPriceRange === 'all'}
                      onChange={() => setSelectedPriceRange('all')}
                      className="text-blue-600"
                    />
                    <span>Tất cả mức giá</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <input
                      type="radio"
                      name="price_range"
                      checked={selectedPriceRange === 'under-5m'}
                      onChange={() => setSelectedPriceRange('under-5m')}
                      className="text-blue-600"
                    />
                    <span>Dưới 5 triệu ₫</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <input
                      type="radio"
                      name="price_range"
                      checked={selectedPriceRange === '5m-15m'}
                      onChange={() => setSelectedPriceRange('5m-15m')}
                      className="text-blue-600"
                    />
                    <span>Từ 5 triệu - 15 triệu ₫</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <input
                      type="radio"
                      name="price_range"
                      checked={selectedPriceRange === '15m-30m'}
                      onChange={() => setSelectedPriceRange('15m-30m')}
                      className="text-blue-600"
                    />
                    <span>Từ 15 triệu - 30 triệu ₫</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <input
                      type="radio"
                      name="price_range"
                      checked={selectedPriceRange === 'above-30m'}
                      onChange={() => setSelectedPriceRange('above-30m')}
                      className="text-blue-600"
                    />
                    <span>Trên 30 triệu ₫ (Flagship)</span>
                  </label>
                </div>
              </div>

              {/* Lọc Còn hàng */}
              <div className="pt-3 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="text-blue-600"
                  />
                  <span>Chỉ hiện sản phẩm còn hàng</span>
                </label>
              </div>
            </div>

            {/* Banner hỗ trợ kỹ thuật nhỏ */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/60 text-slate-800 border border-blue-100 space-y-2 text-xs rounded-xl">
              <div className="font-bold flex items-center gap-1.5 text-blue-700">
                <Headphones className="w-4 h-4" />
                <span>Tư vấn build PC &amp; Laptop</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Đội ngũ kỹ thuật viên TECHZONE hỗ trợ tối ưu cấu hình đồ họa, AI và Gaming theo ngân sách của bạn.
              </p>
              <div className="font-mono text-blue-700 font-semibold pt-1">
                Hotline: 1900 6868 (8:00 - 21:30)
              </div>
            </div>
          </aside>

          {/* Cột phải: Danh sách sản phẩm & Phân trang */}
          <section className="lg:col-span-3 space-y-5">
            {/* Thanh tiêu đề & Sắp xếp */}
            <div className="bg-white border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {selectedCategory
                    ? categories.find(c => c.slug === selectedCategory)?.name
                    : 'Tất cả sản phẩm công nghệ'}
                </span>
                <span className="text-slate-400">({totalProducts} sản phẩm)</span>
                {searchKeyword && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 border border-blue-200 font-medium">
                    Từ khóa: "{searchKeyword}"
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-slate-500 font-medium">Sắp xếp theo:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="p-1.5 pl-2 pr-6 border border-slate-300 text-xs font-medium bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="default">Nổi bật nhất</option>
                    <option value="newest">Hàng mới về</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                  </select>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid sản phẩm */}
            {loading ? (
              <div className="py-24 text-center bg-white border border-slate-200 space-y-2 rounded-xl">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin mx-auto"></div>
                <div className="text-xs text-slate-500 font-medium">Đang tải sản phẩm từ cơ sở dữ liệu...</div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isWishlisted={wishlistIds.includes(prod.id)}
                    onSelect={p => setSelectedProduct(p)}
                    onAddToCart={p => handleAddToCart(p, 1)}
                    onToggleWishlist={p => handleToggleWishlist(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white border border-slate-200 space-y-3 p-6 rounded-xl">
                <PackageX className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Không tìm thấy sản phẩm phù hợp</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Hãy thử điều chỉnh lại bộ lọc giá, tìm kiếm từ khóa khác hoặc bấm đặt lại bộ lọc.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
                >
                  Xóa bộ lọc &amp; Xem lại tất cả
                </button>
              </div>
            )}

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 text-xs font-bold border transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
                  title="Trang sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 5. Footer chuyên nghiệp */}
      <footer className="bg-slate-100 text-slate-700 border-t border-slate-200 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Cột 1: Thông tin thương hiệu */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xl font-black text-slate-900 tracking-tight">
                <span className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  TZ
                </span>
                <span>TECHZONE</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Hệ thống bán lẻ thiết bị công nghệ chính hãng, linh kiện PC, laptop, màn hình và phụ kiện gaming cao cấp.
              </p>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div>Địa chỉ: Tòa nhà TechZone Tower, Q.1, TP.HCM</div>
                <div>Điện thoại: 1900 6868 · Email: hotro@techzone.vn</div>
              </div>
            </div>

            {/* Cột 2: Chính sách mua hàng */}
            <div className="space-y-2">
              <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">
                Chính sách cửa hàng
              </h4>
              <ul className="space-y-1.5 text-slate-600">
                <li>
                  <button onClick={() => setPolicyType('warranty')} className="hover:text-blue-600">
                    Chính sách bảo hành 24 tháng
                  </button>
                </li>
                <li>
                  <button onClick={() => setPolicyType('return')} className="hover:text-blue-600">
                    Chính sách đổi trả 1-đổi-1
                  </button>
                </li>
                <li>
                  <button onClick={() => setPolicyType('shipping')} className="hover:text-blue-600">
                    Chính sách vận chuyển &amp; giao hàng
                  </button>
                </li>
                <li>
                  <button onClick={() => setPolicyType('about')} className="hover:text-blue-600">
                    Giới thiệu công ty TECHZONE
                  </button>
                </li>
              </ul>
            </div>

            {/* Cột 3: Đối tác thương hiệu */}
            <div className="space-y-2">
              <h4 className="text-slate-900 font-bold uppercase tracking-wider text-xs">
                Đối tác chính hãng
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                <span>• Apple Authorised</span>
                <span>• ASUS ROG Partner</span>
                <span>• Dell Technologies</span>
                <span>• Lenovo ThinkPad</span>
                <span>• Samsung Electronics</span>
                <span>• Sony Hi-Res Audio</span>
                <span>• Intel Inside</span>
                <span>• MSI Gaming</span>
              </div>
            </div>

            {/* Cột 4: Đóng gói đồ án & Xuất file */}
            <div className="space-y-3 bg-white p-4 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Xuất mã nguồn &amp; Cơ sở dữ liệu</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Tải về toàn bộ mã nguồn Frontend + Backend Python Flask + File SQL `schema.sql` &amp; `seed.sql` đã kiểm thử thành công.
              </p>
              <button
                onClick={handleDownloadZip}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải file TECHZONE.zip</span>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>© 2026 TECHZONE VIETNAM. Bản quyền thuộc về Đồ Án Thương Mại Điện Tử.</div>
            <div className="flex items-center gap-4">
              <span>Bảo mật dữ liệu chuẩn PCI-DSS</span>
              <span>·</span>
              <span>Hỗ trợ thanh toán COD &amp; VietQR</span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- CÁC MODAL HỆ THỐNG --- */}

      {/* 1. Modal chi tiết sản phẩm */}
      <ProductDetailModal
        product={selectedProduct}
        currentUser={currentUser}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => {
          handleAddToCart(p, qty);
          setSelectedProduct(null);
        }}
        onBuyNow={(p, qty) => handleBuyNow(p, qty)}
        onSelectRelated={p => setSelectedProduct(p)}
      />

      {/* 2. Drawer Giỏ hàng */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Modal Thanh toán */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        onSuccess={(order, bankInfo) => {
          setIsCheckoutOpen(false);
          setCartItems([]);
          setOrderSuccessData({ order, bankInfo });
          loadProducts(); // Cập nhật lại tồn kho ngay lập tức
        }}
      />

      {/* 4. Modal Đặt hàng thành công & Biên nhận */}
      <OrderSuccessModal
        order={orderSuccessData?.order || null}
        bankInfo={orderSuccessData?.bankInfo || null}
        onClose={() => setOrderSuccessData(null)}
        onViewOrders={() => {
          setOrderSuccessData(null);
          setIsAccountOpen(true);
        }}
      />

      {/* 5. Modal Tài khoản khách hàng & Lịch sử đơn */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setIsAccountOpen(false);
          addToast('Đã đăng xuất tài khoản', 'info');
        }}
        onSelectProduct={p => {
          setIsAccountOpen(false);
          setSelectedProduct(p);
        }}
        onAddToCart={p => handleAddToCart(p, 1)}
        onOrderCancelled={() => loadProducts()}
      />

      {/* 6. Modal Đăng nhập / Đăng ký */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={user => {
          setCurrentUser(user);
          addToast(`Chào mừng ${user.name} đã đăng nhập thành công!`);
        }}
      />

      {/* 7. Modal Trang Quản trị Admin */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        categories={categories}
        brands={brands}
        onDataChanged={() => loadProducts()}
        onDownloadZip={handleDownloadZip}
      />

      {/* 8. Modal Chính sách */}
      <PolicyModal
        type={policyType}
        onClose={() => setPolicyType(null)}
      />

      {/* 9. Container Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
