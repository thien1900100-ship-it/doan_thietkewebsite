import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { formatVND } from '../utils/format';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export function ProductCard({
  product,
  isWishlisted,
  onSelect,
  onAddToCart,
  onToggleWishlist
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const currentPrice = product.sale_price !== null ? product.sale_price : product.price;
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white border border-slate-200 hover:border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* 1. Phần ảnh & nhãn trạng thái */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
        {!imgError ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-500 p-4 text-center text-xs">
            <span className="font-semibold text-slate-700">{product.brand_name}</span>
            <span className="mt-1 line-clamp-1">{product.sku}</span>
          </div>
        )}

        {/* Nhãn giảm giá hoặc mới (Góc vuông, tối giản) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {hasDiscount && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 tracking-tight">
              -{discountPercent}%
            </span>
          )}
          {product.is_new && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 tracking-tight">
              MỚI
            </span>
          )}
        </div>

        {/* Nút yêu thích */}
        <button
          onClick={e => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-1.5 transition-colors border ${
            isWishlisted
              ? 'bg-rose-600 text-white border-rose-600'
              : 'bg-white/90 text-slate-700 border-slate-200 hover:text-rose-600'
          }`}
          title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* 2. Thông tin sản phẩm */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Metadata clean text, no pill tags */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="uppercase text-slate-700 font-bold">{product.brand_name}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category_name}</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">{product.sku}</span>
          </div>

          {/* Tên sản phẩm */}
          <h3
            onClick={() => onSelect(product)}
            className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Đánh giá & tồn kho */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-slate-700 font-semibold text-xs tabular-nums">
                {product.rating > 0 ? product.rating.toFixed(1) : '5.0'}
              </span>
              <span className="text-slate-400 text-[11px]">({product.review_count || 12})</span>
            </div>

            <div className="text-[11px] font-medium">
              {product.stock_quantity > 0 ? (
                <span className="text-emerald-700">Còn {product.stock_quantity} sp</span>
              ) : (
                <span className="text-rose-600 font-semibold">Tạm hết hàng</span>
              )}
            </div>
          </div>
        </div>

        {/* Giá tiền & Nút thao tác */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className={`text-base font-bold tabular-nums ${hasDiscount ? 'text-blue-600' : 'text-slate-900'}`}>
              {formatVND(currentPrice)}
            </div>
            {hasDiscount && (
              <div className="text-xs text-slate-400 line-through tabular-nums">
                {formatVND(product.price)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelect(product)}
              className="p-2 border border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-colors"
              title="Xem thông số kỹ thuật"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              disabled={product.stock_quantity <= 0}
              onClick={() => onAddToCart(product)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${
                product.stock_quantity > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              title={product.stock_quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mua</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
