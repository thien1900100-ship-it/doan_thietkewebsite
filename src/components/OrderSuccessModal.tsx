import { CheckCircle2, Copy, X, ArrowRight, QrCode } from 'lucide-react';
import { Order } from '../types';
import { formatVND } from '../utils/format';

interface OrderSuccessModalProps {
  order: Order | null;
  bankInfo: any | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export function OrderSuccessModal({
  order,
  bankInfo,
  onClose,
  onViewOrders
}: OrderSuccessModalProps) {
  if (!order) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white w-full max-w-2xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Header chúc mừng */}
          <div className="text-center space-y-2 border-b border-slate-200 pb-5">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ĐẶT HÀNG THÀNH CÔNG!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Cảm ơn bạn đã tin tưởng mua sắm tại TECHZONE. Mã đơn hàng của bạn là:
            </p>
            <div className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-sm">
              {order.order_code}
            </div>
          </div>

          {/* Hướng dẫn thanh toán nếu là Chuyển khoản ngân hàng */}
          {order.payment_method === 'bank_transfer' && (
            <div className="p-4 bg-slate-50 border border-blue-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wide">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>Thông tin chuyển khoản Ngân hàng (VietQR)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Giả lập mã QR VietQR chuẩn */}
                <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 space-y-2">
                  <div className="w-40 h-40 bg-slate-100 border border-slate-300 p-2 flex flex-col items-center justify-center relative">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=2|99|090123456789|CONG%20TY%20TECHZONE|${order.total_amount}|THANHTOAN%20${order.order_code}`}
                      alt="VietQR Chuyển Khoản"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Quét mã bằng app ngân hàng bất kỳ</span>
                </div>

                {/* Chi tiết tài khoản */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-slate-500 text-[11px]">Ngân hàng:</div>
                    <div className="font-bold text-slate-900">MB Bank (Ngân hàng Quân Đội)</div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[11px]">Số tài khoản:</div>
                    <div className="font-mono font-bold text-blue-700 text-sm flex items-center gap-2">
                      <span>090123456789</span>
                      <button
                        onClick={() => copyToClipboard('090123456789')}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="Sao chép"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[11px]">Chủ tài khoản:</div>
                    <div className="font-semibold text-slate-800">CONG TY TNHH TECHZONE VIET NAM</div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[11px]">Số tiền cần thanh toán:</div>
                    <div className="font-black text-rose-600 text-base tabular-nums">
                      {formatVND(order.total_amount)}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[11px]">Nội dung chuyển khoản (bắt buộc):</div>
                    <div className="font-mono font-bold text-slate-900 bg-white p-1.5 border border-slate-300 flex items-center justify-between">
                      <span>THANHTOAN {order.order_code}</span>
                      <button
                        onClick={() => copyToClipboard(`THANHTOAN ${order.order_code}`)}
                        className="text-slate-400 hover:text-slate-700 p-1"
                        title="Sao chép cú pháp"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nếu là COD */}
          {order.payment_method === 'cod' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold">Hình thức thanh toán: Khi nhận hàng (COD)</div>
              <div>
                Nhân viên bưu tá sẽ liên hệ giao hàng trong vòng 1-2 ngày làm việc. Quý khách vui lòng chuẩn bị số tiền đúng{' '}
                <span className="font-bold tabular-nums text-emerald-950">{formatVND(order.total_amount)}</span> khi nhận hàng.
              </div>
            </div>
          )}

          {/* Tóm tắt sản phẩm trong đơn */}
          <div className="space-y-2 border-t border-slate-200 pt-4 text-xs">
            <h4 className="font-bold text-slate-900 uppercase">Sản phẩm đã đặt:</h4>
            <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
              {order.items.map(item => (
                <div key={item.id} className="py-2 flex justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900">{item.product_name}</span>
                    <div className="text-slate-500 text-[11px]">Số lượng: {item.quantity} cái</div>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">{formatVND(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
              <span>Tổng thanh toán:</span>
              <span className="text-blue-600 tabular-nums">{formatVND(order.total_amount)}</span>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Tiếp tục mua sắm
            </button>
            <button
              onClick={onViewOrders}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              <span>Xem lịch sử đơn hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
