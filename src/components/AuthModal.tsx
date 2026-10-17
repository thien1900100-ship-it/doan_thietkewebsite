import { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, KeyRound } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLoginView) {
        const res = await api.login({ email: email.trim(), password });
        onAuthSuccess(res.user);
        onClose();
      } else {
        if (!name.trim()) {
          setError('Vui lòng nhập họ và tên');
          setLoading(false);
          return;
        }
        const res = await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          address: address.trim()
        });
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi xác thực');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setEmail('admin@techzone.vn');
      setPassword('admin123');
    } else {
      setEmail('khachhang@techzone.vn');
      setPassword('user123');
    }
    setIsLoginView(true);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md border border-slate-200 shadow-2xl p-6 sm:p-8 rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {isLoginView ? 'ĐĂNG NHẬP TECHZONE' : 'TẠO TÀI KHOẢN MỚI'}
            </h3>
            <p className="text-xs text-slate-500">
              {isLoginView
                ? 'Đăng nhập để theo dõi đơn hàng và lưu sản phẩm yêu thích'
                : 'Trở thành thành viên TechZone để nhận nhiều ưu đãi'}
            </p>
          </div>

          {/* Nút nạp nhanh tài khoản demo */}
          <div className="p-3 bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Nạp nhanh tài khoản kiểm thử đồ án:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('customer')}
                className="py-1 px-2 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 text-[11px] font-medium"
              >
                Khách hàng demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="py-1 px-2 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 text-[11px] font-medium"
              >
                Quản trị Admin demo
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLoginView && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@techzone.vn hoặc user@gmail.com"
                  className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {!isLoginView && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0987654321"
                      className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ nhận hàng</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Địa chỉ số nhà, đường, quận/huyện"
                      className="w-full p-2.5 pl-9 bg-slate-50 border border-slate-300 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loading
                ? 'Đang xử lý...'
                : isLoginView
                ? 'Đăng nhập ngay'
                : 'Đăng ký tài khoản'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError(null);
              }}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              {isLoginView
                ? 'Chưa có tài khoản? Đăng ký ngay'
                : 'Đã có tài khoản? Quay lại Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
