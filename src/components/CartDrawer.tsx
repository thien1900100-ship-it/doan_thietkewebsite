import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { formatVND } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.product.sale_price !== null ? item.product.sale_price : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 flex justify-end">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 rounded-l-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
              Giỏ hàng của bạn ({totalQuantity})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Danh sách sản phẩm trong giỏ */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {items.length > 0 ? (
            items.map(item => {
              const unitPrice = item.product.sale_price !== null ? item.product.sale_price : item.product.price;
              const lineTotal = unitPrice * item.quantity;

              return (
                <div key={item.product.id} className="py-3.5 flex gap-3 items-start">
                  <div className="w-16 h-16 bg-slate-100 border border-slate-200 shrink-0 overflow-hidden">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors shrink-0 p-1"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      SKU: {item.product.sku}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Bộ điều khiển số lượng */}
                      <div className="flex items-center border border-slate-300">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock_quantity}
                          className="w-6 h-6 flex items-center justify-center text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                          title={item.quantity >= item.product.stock_quantity ? 'Đạt số lượng tồn tối đa' : ''}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900 tabular-nums">
                          {formatVND(lineTotal)}
                        </div>
                        <div className="text-[10px] text-slate-500 tabular-nums">
                          {formatVND(unitPrice)} / cái
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">Giỏ hàng của bạn đang trống</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Tiếp tục mua hàng
              </button>
            </div>
          )}
        </div>

        {/* Footer tính tiền & Nút Checkout */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatVND(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span className="text-slate-700 font-semibold">
                  {subtotal >= 1000000 ? 'Miễn phí' : '30.000 ₫'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Tạm tính:</span>
              <span className="text-lg font-black text-blue-600 tabular-nums">
                {formatVND(subtotal + (subtotal >= 1000000 ? 0 : 30000))}
              </span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors"
            >
              <span>Tiến hành đặt hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
