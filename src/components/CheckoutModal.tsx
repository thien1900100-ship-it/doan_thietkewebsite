import { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Tag, CreditCard, Truck } from 'lucide-react';
import { CartItem, User, Order } from '../types';
import { api } from '../services/api';
import { formatVND } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser: User | null;
  onSuccess: (order: Order, bankInfo: any) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  currentUser,
  onSuccess
}: CheckoutModalProps) {
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_amount: number; description: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setRecipientName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setShippingAddress(currentUser.address || '');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.product.sale_price !== null ? item.product.sale_price : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const shippingFee = subtotal >= 1000000 ? 0 : 30000;
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await api.validateCoupon(couponCode.trim(), subtotal);
      setAppliedCoupon(res);
    } catch (err: any) {
      setCouponError(err.message || 'Mã giảm giá không hợp lệ');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipientName.trim() || !phone.trim() || !email.trim() || !shippingAddress.trim()) {
      setError('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        user_id: currentUser ? currentUser.id : null,
        recipient_name: recipientName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        shipping_address: shippingAddress.trim(),
        notes: notes.trim(),
        payment_method: paymentMethod,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };

      const res = await api.checkout(orderPayload);
      onSuccess(res.order, res.bank_info);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white w-full max-w-3xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              Xác nhận thông tin đặt hàng &amp; Thanh toán
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung form */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Cột 1: Thông tin giao hàng */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-1">
                1. Thông tin người nhận
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên người nhận *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0987654321"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email nhận đơn *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ giao hàng chi tiết *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú đơn hàng (nếu có)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Phương thức thanh toán */}
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Phương thức thanh toán:
                </h4>

                <label className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                  paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-blue-600"
                  />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Khách hàng kiểm tra sản phẩm trước khi thanh toán tiền mặt cho shipper.
                    </p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                  paymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-0.5 text-blue-600"
                  />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      <span>Chuyển khoản Ngân hàng (Mã QR VietQR)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Hệ thống tự động hiển thị mã QR VietQR kèm số tài khoản và cú pháp chuyển khoản chính xác.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Cột 2: Tóm tắt đơn hàng & Mã giảm giá */}
            <div className="space-y-4 bg-slate-50 p-4 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-1">
                2. Tóm tắt đơn hàng ({items.length} món)
              </h3>

              <div className="max-h-48 overflow-y-auto divide-y divide-slate-200 text-xs">
                {items.map(item => {
                  const unitPrice = item.product.sale_price !== null ? item.product.sale_price : item.product.price;
                  return (
                    <div key={item.product.id} className="py-2 flex justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.quantity} x {formatVND(unitPrice)}
                        </div>
                      </div>
                      <div className="font-bold text-slate-900 tabular-nums shrink-0">
                        {formatVND(unitPrice * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nhập mã giảm giá */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mã ưu đãi / Coupon:</span>
                </div>

                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="TECHZONE10, WELCOME50K"
                      className="flex-1 p-2 bg-white border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      disabled={couponLoading || !couponCode.trim()}
                      onClick={handleApplyCoupon}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors disabled:opacity-40"
                    >
                      {couponLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-800 font-mono">{appliedCoupon.code}</span>
                      <span className="text-emerald-700 ml-2">(-{formatVND(appliedCoupon.discount_amount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-slate-500 hover:text-rose-600 text-xs font-medium"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                )}

                {couponError && (
                  <div className="text-[11px] text-rose-600">{couponError}</div>
                )}

                <div className="text-[10px] text-slate-500">
                  Gợi ý mã: <span className="font-mono text-blue-600 font-bold">TECHZONE10</span> (giảm 10% từ 5tr), <span className="font-mono text-blue-600 font-bold">WELCOME50K</span> (giảm 50k từ 500k).
                </div>
              </div>

              {/* Chi tiết thành tiền */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tổng tiền hàng:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {formatVND(subtotal)}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Mã giảm giá ({appliedCoupon.code}):</span>
                    <span className="tabular-nums">-{formatVND(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
                  <span className="text-xl font-black text-blue-600 tabular-nums">
                    {formatVND(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Nút Đặt hàng */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Hệ thống đang xử lý...' : 'Xác nhận Đặt hàng ngay'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
