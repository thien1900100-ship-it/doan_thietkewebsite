import { useState } from 'react';
import { Search, ShoppingBag, Heart, User as UserIcon, Shield, Sparkles, Download, Layers } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onOpenPolicy: (type: string) => void;
  onSearch: (keyword: string) => void;
  onRoleSwitch: (role: 'guest' | 'customer' | 'admin') => void;
  onDownloadZip: () => void;
}

export function Navbar({
  currentUser,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenAccount,
  onOpenAdmin,
  onOpenPolicy,
  onSearch,
  onRoleSwitch,
  onDownloadZip
}: NavbarProps) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* 1. Thanh thông báo & chuyển đổi vai trò Demo */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/40 text-slate-700 text-xs px-4 py-2 border-b border-blue-100">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-blue-700 font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Ưu đãi tháng 10:
            </span>
            <span className="text-slate-600">Miễn phí giao hàng toàn quốc từ 1.000.000 ₫ · Bảo hành chính hãng 24 tháng</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] font-medium mr-1">Chế độ Demo đồ án:</span>
            <div className="inline-flex border border-slate-200 bg-white rounded-lg overflow-hidden">
              <button
                onClick={() => onRoleSwitch('guest')}
                className={`px-2 py-1 text-[11px] font-medium transition-colors ${
                  !currentUser ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                Khách vãng lai
              </button>
              <button
                onClick={() => onRoleSwitch('customer')}
                className={`px-2 py-1 text-[11px] font-medium border-l border-slate-200 transition-colors ${
                  currentUser?.role === 'customer' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                Khách hàng
              </button>
              <button
                onClick={() => onRoleSwitch('admin')}
                className={`px-2 py-1 text-[11px] font-medium border-l border-slate-200 transition-colors ${
                  currentUser?.role === 'admin' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                Admin
              </button>
            </div>

            <button
              onClick={onDownloadZip}
              title="Tải trọn bộ mã nguồn Frontend + Backend Flask + MySQL Database"
              className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors text-[11px]"
            >
              <Download className="w-3.5 h-3.5" />
              Tải TECHZONE.zip
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Bar Navigation Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <a href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900 shrink-0">
          <span className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
            TZ
          </span>
          <span>TECHZONE</span>
        </a>

        {/* Zone 2: Navigation Links & Live Search */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-700 shrink-0">
            <a href="#products-section" className="hover:text-blue-600 transition-colors">
              Sản phẩm
            </a>
            <button
              onClick={() => onOpenPolicy('warranty')}
              className="hover:text-blue-600 transition-colors text-left"
            >
              Bảo hành
            </button>
            <button
              onClick={() => onOpenPolicy('shipping')}
              className="hover:text-blue-600 transition-colors text-left"
            >
              Giao hàng
            </button>
            <button
              onClick={() => onOpenPolicy('about')}
              className="hover:text-blue-600 transition-colors text-left"
            >
              Giới thiệu
            </button>
          </nav>

          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Tìm iPhone 16, RTX 4070, MacBook, Sony XM5..."
              className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2 pl-9 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Nút Admin nếu là Admin */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Quản trị Admin</span>
            </button>
          )}

          {/* Yêu thích */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-slate-700 hover:text-blue-600 transition-colors"
            title="Danh sách yêu thích"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Giỏ hàng */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            <span className="bg-blue-800 text-white px-1.5 py-0.5 text-[11px] font-bold tabular-nums">
              {cartCount}
            </span>
          </button>

          {/* Tài khoản */}
          {currentUser ? (
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-800 hover:border-slate-400 text-xs font-medium transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-slate-500" />
              <span className="max-w-[100px] truncate">{currentUser.name.split(' ').pop()}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 border border-slate-300 text-slate-800 hover:border-blue-600 hover:text-blue-600 text-xs font-medium transition-colors"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm sản phẩm công nghệ..."
            className="w-full bg-slate-50 border border-slate-300 px-3.5 py-2 pl-9 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>
    </header>
  );
}
