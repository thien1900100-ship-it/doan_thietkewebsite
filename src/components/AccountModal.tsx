import { useState, useEffect } from 'react';
import { X, User as UserIcon, Package, Heart, LogOut, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { User, Order, Product } from '../types';
import { api } from '../services/api';
import { formatVND, formatDate, ORDER_STATUS_LABELS } from '../utils/format';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOrderCancelled?: () => void;
}

export function AccountModal({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onSelectProduct,
  onAddToCart,
  onOrderCancelled
}: AccountModalProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !currentUser) return;
    setLoading(true);

    Promise.all([
      api.getMyOrders(currentUser.id),
      api.getWishlist(currentUser.id)
    ])
      .then(([ordersRes, wishlistRes]) => {
        setOrders(ordersRes.orders || []);
        setWishlistProducts(wishlistRes.products || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    setCancelling(true);
    setActionMessage(null);

    try {
      const res = await api.cancelOrder(cancelModalOrder.id, currentUser.id);
      setActionMessage('Đã hủy đơn hàng và hoàn lại số lượng tồn kho thành công!');
      // Cập nhật lại danh sách đơn hàng
      const updated = await api.getMyOrders(currentUser.id);
      setOrders(updated.orders || []);
      setCancelModalOrder(null);
      if (onOrderCancelled) onOrderCancelled();
    } catch (err: any) {
      alert(err.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white w-full max-w-4xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-none">
                {currentUser.name}
              </h2>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {currentUser.email} · Vai trò: {currentUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:border-rose-400 hover:text-rose-600 text-xs font-semibold text-slate-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Lịch sử đơn hàng ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'wishlist'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Sản phẩm yêu thích ({wishlistProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Thông tin cá nhân</span>
          </button>
        </div>

        {/* Thông báo kết quả thao tác */}
        {actionMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Nội dung Tab */}
        <div className="overflow-y-auto p-6 flex-1">
          {/* TAB 1: Lịch sử đơn hàng */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-500">Đang tải danh sách đơn hàng...</div>
              ) : orders.length > 0 ? (
                orders.map(order => {
                  const statusInfo = ORDER_STATUS_LABELS[order.status] || {
                    label: order.status,
                    color: 'bg-slate-100 text-slate-700'
                  };
                  const canCancel = ['pending', 'confirmed'].includes(order.status);

                  return (
                    <div
                      key={order.id}
                      className="border border-slate-200 bg-white p-4 space-y-3"
                    >
                      {/* Tiêu đề đơn hàng */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-600">
                            {order.order_code}
                          </span>
                          <span className="text-[11px] text-slate-400">·</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(order.created_at)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[11px] font-semibold border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>

                          {canCancel && (
                            <button
                              onClick={() => setCancelModalOrder(order)}
                              className="text-[11px] text-rose-600 hover:text-rose-800 hover:underline font-semibold ml-2"
                            >
                              Hủy đơn
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Danh sách sản phẩm trong đơn */}
                      <div className="divide-y divide-slate-100 text-xs">
                        {order.items.map(item => (
                          <div key={item.id} className="py-2 flex justify-between gap-2">
                            <div>
                              <div className="font-semibold text-slate-900">{item.product_name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                SKU: {item.product_sku} · SL: {item.quantity}
                              </div>
                            </div>
                            <div className="font-bold text-slate-900 tabular-nums">
                              {formatVND(item.subtotal)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chân đơn hàng */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-[11px] text-slate-500">
                          Giao đến: <span className="text-slate-800 font-medium">{order.recipient_name}</span> ({order.phone}) - {order.shipping_address}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-slate-500">Tổng thanh toán:</span>
                          <span className="text-sm font-black text-slate-900 tabular-nums">
                            {formatVND(order.total_amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-200">
                  Bạn chưa có đơn hàng nào tại TECHZONE.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Danh sách yêu thích */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {wishlistProducts.map(prod => (
                    <div
                      key={prod.id}
                      className="border border-slate-200 p-3 bg-white space-y-2 flex flex-col justify-between"
                    >
                      <div
                        onClick={() => onSelectProduct(prod)}
                        className="cursor-pointer space-y-1.5"
                      >
                        <div className="aspect-square bg-slate-100 overflow-hidden">
                          <img
                            src={prod.thumbnail}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-[11px] text-slate-400 uppercase font-bold">{prod.brand_name}</div>
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{prod.name}</h4>
                        <div className="text-xs font-bold text-blue-600 tabular-nums">
                          {formatVND(prod.sale_price || prod.price)}
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(prod)}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-200">
                  Danh sách yêu thích của bạn chưa có sản phẩm nào.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Thông tin cá nhân */}
          {activeTab === 'profile' && (
            <div className="max-w-md space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.name}
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ Email</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.phone || 'Chưa cập nhật'}
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ giao hàng mặc định</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.address || 'Chưa cập nhật'}
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 text-slate-800"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal xác nhận hủy đơn hàng */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-6 max-w-sm w-full space-y-4 shadow-xl rounded-2xl">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Xác nhận hủy đơn hàng</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn hủy đơn hàng{' '}
              <span className="font-mono font-bold text-slate-900">{cancelModalOrder.order_code}</span>?
              Toàn bộ số lượng sản phẩm trong đơn sẽ được hoàn trả lại tồn kho của hệ thống ngay lập tức.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="px-3 py-1.5 border border-slate-300 text-xs text-slate-700 hover:bg-slate-50 font-medium"
              >
                Không, giữ đơn
              </button>
              <button
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Đang hủy...' : 'Đồng ý hủy đơn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
