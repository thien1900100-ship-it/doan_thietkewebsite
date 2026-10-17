import { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { Product, Review, User } from '../types';
import { api } from '../services/api';
import { formatVND, formatDate } from '../utils/format';

interface ProductDetailModalProps {
  product: Product | null;
  currentUser: User | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onSelectRelated: (product: Product) => void;
}

export function ProductDetailModal({
  product,
  currentUser,
  onClose,
  onAddToCart,
  onBuyNow,
  onSelectRelated
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Form đánh giá
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setReviewError(null);
    setReviewSuccess(null);
    setLoading(true);

    api.getProductDetail(String(product.id))
      .then(res => {
        setReviews(res.reviews || []);
        setRelatedProducts(res.related_products || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [product]);

  if (!product) return null;

  const currentPrice = product.sale_price !== null ? product.sale_price : product.price;
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setReviewError('Vui lòng đăng nhập để gửi đánh giá sản phẩm.');
      return;
    }
    if (!comment.trim()) {
      setReviewError('Vui lòng nhập lời nhận xét của bạn.');
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const res = await api.submitReview(product.id, {
        user_id: currentUser.id,
        rating,
        comment: comment.trim()
      });
      setReviewSuccess('Đánh giá của bạn đã được ghi nhận thành công!');
      setComment('');
      // Làm mới danh sách đánh giá
      const updated = await api.getProductDetail(String(product.id));
      setReviews(updated.reviews || []);
    } catch (err: any) {
      setReviewError(err.message || 'Lỗi khi gửi đánh giá');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white w-full max-w-4xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Nội dung cuộn */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* 1. Phần chính: Ảnh & Mua hàng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Cột ảnh */}
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-slate-100 border border-slate-200 overflow-hidden relative">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2 py-0.5">
                    SALE
                  </span>
                )}
              </div>

              {/* Cam kết ngắn */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Bảo hành 24T</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 border border-slate-100">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Giao toàn quốc</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 border border-slate-100">
                  <RefreshCw className="w-4 h-4 text-amber-600" />
                  <span>Đổi mới 30 ngày</span>
                </div>
              </div>
            </div>

            {/* Cột chi tiết & Purchase Module */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="uppercase text-slate-800 font-bold">{product.brand_name}</span>
                  <span>·</span>
                  <span>{product.category_name}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-400">SKU: {product.sku}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-slate-900 font-bold text-sm tabular-nums">
                      {product.rating > 0 ? product.rating.toFixed(1) : '5.0'}
                    </span>
                  </div>
                  <span className="text-slate-400 text-xs">·</span>
                  <span className="text-xs text-slate-600 underline">
                    {reviews.length || product.review_count || 12} đánh giá của khách hàng
                  </span>
                </div>
              </div>

              {/* Khối giá tiền */}
              <div className="p-4 bg-slate-50 border border-slate-200 flex items-baseline gap-3">
                <div className="text-2xl font-black text-blue-600 tabular-nums">
                  {formatVND(currentPrice)}
                </div>
                {hasDiscount && (
                  <div className="text-sm text-slate-400 line-through tabular-nums">
                    {formatVND(product.price)}
                  </div>
                )}
                {hasDiscount && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 border border-rose-200">
                    Tiết kiệm {formatVND(product.price - currentPrice)}
                  </span>
                )}
              </div>

              {/* Tình trạng tồn kho */}
              <div className="text-xs font-medium">
                Tình trạng:{' '}
                {product.stock_quantity > 0 ? (
                  <span className="text-emerald-700 font-bold">
                    Còn hàng ({product.stock_quantity} sản phẩm trong kho)
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold">Tạm hết hàng</span>
                )}
              </div>

              {/* Chọn số lượng */}
              {product.stock_quantity > 0 && (
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs font-semibold text-slate-700">Số lượng mua:</span>
                  <div className="flex items-center border border-slate-300">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={product.stock_quantity}
                      value={quantity}
                      onChange={e => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) {
                          setQuantity(Math.min(product.stock_quantity, Math.max(1, val)));
                        }
                      }}
                      className="w-12 h-8 text-center text-sm font-semibold border-x border-slate-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={quantity >= product.stock_quantity}
                      onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Nút hành động */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  disabled={product.stock_quantity <= 0}
                  onClick={() => onAddToCart(product, quantity)}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs sm:text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Thêm vào giỏ</span>
                </button>

                <button
                  disabled={product.stock_quantity <= 0}
                  onClick={() => onBuyNow(product, quantity)}
                  className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  Mua ngay
                </button>
              </div>

              {/* Mô tả ngắn */}
              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                {product.short_description || product.description}
              </p>
            </div>
          </div>

          {/* 2. Bảng thông số kỹ thuật chi tiết */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Thông số kỹ thuật chi tiết
              </h3>
              <div className="border border-slate-200 divide-y divide-slate-200 text-xs sm:text-sm">
                {Object.entries(product.specs).map(([key, value], idx) => (
                  <div
                    key={key}
                    className={`grid grid-cols-3 p-3 ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                  >
                    <div className="font-semibold text-slate-700">{key}</div>
                    <div className="col-span-2 text-slate-900 font-mono text-xs sm:text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Mô tả chi tiết */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Đặc điểm nổi bật
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50 p-4 border border-slate-200">
              {product.description}
            </div>
          </div>

          {/* 4. Đánh giá & Nhận xét của khách hàng */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Đánh giá từ khách hàng ({reviews.length})
              </h3>
            </div>

            {/* Form gửi đánh giá */}
            <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-semibold text-slate-800">
                Gửi nhận xét về sản phẩm (Dành cho khách hàng đã mua):
              </div>

              {reviewError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600">Số sao:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'text-amber-500 fill-current' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm thực tế về độ hoàn thiện, hiệu năng, pin của sản phẩm..."
                className="w-full p-2.5 bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />

              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-500">
                  {currentUser ? `Đăng bởi: ${currentUser.name}` : 'Cần đăng nhập tài khoản'}
                </span>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? 'Đang gửi...' : 'Gửi nhận xét'}</span>
                </button>
              </div>
            </form>

            {/* Danh sách nhận xét */}
            <div className="space-y-3 pt-2">
              {reviews.length > 0 ? (
                reviews.map(r => (
                  <div key={r.id} className="p-3.5 border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{r.author_name}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 text-[10px] border border-emerald-200 font-semibold">
                          Đã mua hàng
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{formatDate(r.created_at)}</span>
                    </div>

                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200">
                  Chưa có nhận xét nào. Hãy là người đầu tiên đánh giá sản phẩm sau khi mua hàng!
                </div>
              )}
            </div>
          </div>

          {/* 5. Sản phẩm liên quan */}
          {relatedProducts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Sản phẩm cùng danh mục
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 border border-slate-200 bg-white hover:border-blue-600 cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="aspect-square bg-slate-100 overflow-hidden">
                      <img
                        src={rel.thumbnail}
                        alt={rel.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-900 line-clamp-1">
                      {rel.name}
                    </div>
                    <div className="text-xs font-bold text-blue-600 tabular-nums">
                      {formatVND(rel.sale_price || rel.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
