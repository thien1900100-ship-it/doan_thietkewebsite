import { ArrowRight, ShieldCheck, Truck, RefreshCw, Cpu } from 'lucide-react';
import { Product } from '../types';

interface HeroBannerProps {
  onExploreClick: () => void;
  onSelectProduct: (product: Product) => void;
  featuredProduct?: Product;
}

export function HeroBanner({ onExploreClick, onSelectProduct, featuredProduct }: HeroBannerProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 text-slate-900 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Cột trái: Thông điệp thương hiệu & CTA */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Đồ Án Thương Mại Điện Tử · TechZone Flagship
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Hệ Thống Thiết Bị Công Nghệ &amp; Phần Cứng Hiệu Năng Cao
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Phân phối chính hãng điện thoại cao cấp, laptop đồ họa/gaming, linh kiện máy tính, màn hình chuẩn màu và phụ kiện gaming chuyên nghiệp.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
              >
                <span>Khám phá sản phẩm</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {featuredProduct && (
                <button
                  onClick={() => onSelectProduct(featuredProduct)}
                  className="px-5 py-3 border border-slate-300 hover:border-blue-400 bg-white/70 text-slate-700 font-medium text-sm transition-colors"
                >
                  Xem iPhone 16 Pro Max
                </button>
              )}
            </div>

            {/* Các cam kết dịch vụ */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-blue-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Bảo hành chính hãng 24T</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Giao hàng siêu tốc 2H</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Đổi mới trong 30 ngày</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Khối sản phẩm nổi bật */}
          <div className="lg:col-span-5">
            <div className="relative border border-blue-100 bg-white/90 p-6 rounded-2xl shadow-sm">
              <div className="absolute top-4 right-4 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 uppercase tracking-wide rounded-full">
                Flash Sale
              </div>

              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 border border-slate-200 relative mb-4 rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
                  alt="iPhone 16 Pro Max"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-500 font-mono">APPLE · FLAGSHIP 2026</div>
                <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                  iPhone 16 Pro Max 256GB Titan Tự Nhiên
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-bold text-blue-600 tabular-nums">32.490.000 ₫</span>
                  <span className="text-xs text-slate-500 line-through tabular-nums">34.990.000 ₫</span>
                  <span className="text-xs font-semibold text-emerald-700">-7%</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Chip Apple A18 Pro, màn hình 6.9 inch Super Retina XDR 120Hz viền siêu mỏng, nút điều khiển Camera Control tiện lợi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
