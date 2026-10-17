import { X, ShieldCheck, RefreshCw, Truck, HelpCircle, Building2, Lock } from 'lucide-react';

interface PolicyModalProps {
  type: string | null;
  onClose: () => void;
}

export function PolicyModal({ type, onClose }: PolicyModalProps) {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-4 text-xs sm:text-sm rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'warranty' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-base uppercase">
              <ShieldCheck className="w-6 h-6" />
              <span>Chính sách bảo hành chính hãng 24 tháng</span>
            </div>
            <div className="space-y-2 text-slate-700 leading-relaxed">
              <p>
                Toàn bộ sản phẩm công nghệ (Điện thoại, Laptop, Màn hình, Linh kiện PC, Gaming Gear) được phân phối tại TECHZONE đều được hưởng chế độ bảo hành chính hãng từ 12 đến 24 tháng theo tiêu chuẩn nhà sản xuất (Apple, Asus, Dell, Lenovo, Samsung, Sony, Logitech, Corsair, Intel...).
              </p>
              <h4 className="font-bold text-slate-900 pt-2">Điều kiện bảo hành hợp lệ:</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Sản phẩm còn trong thời hạn bảo hành tính từ ngày xuất hóa đơn hoặc kích hoạt điện tử.</li>
                <li>Tem bảo hành và mã số Serial/IMEI/SKU trên thiết bị còn nguyên vẹn, không bị cạo sửa hoặc rách nát.</li>
                <li>Lỗi phát sinh do linh kiện hoặc lỗi kỹ thuật từ nhà sản xuất.</li>
              </ul>
            </div>
          </div>
        )}

        {type === 'shipping' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-base uppercase">
              <Truck className="w-6 h-6" />
              <span>Chính sách vận chuyển &amp; Giao hàng</span>
            </div>
            <div className="space-y-2 text-slate-700 leading-relaxed">
              <p>
                TECHZONE hợp tác với các đơn vị vận chuyển uy tín (Viettel Post, GHTK, GHN) để đảm bảo hàng hóa điện tử có giá trị cao được đóng gói bọt khí chống sốc 3 lớp an toàn tuyệt đối.
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 space-y-1 font-medium">
                <div>• Miễn phí giao hàng: Áp dụng cho tất cả đơn hàng từ 1.000.000 ₫ trở lên.</div>
                <div>• Phí vận chuyển tiêu chuẩn: 30.000 ₫ cho các đơn hàng dưới 1.000.000 ₫.</div>
                <div>• Thời gian giao hàng: Nội thành 1-2 ngày, các tỉnh thành khác 2-4 ngày làm việc.</div>
              </div>
            </div>
          </div>
        )}

        {type === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base uppercase">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span>Giới thiệu Hệ thống Bán lẻ Công nghệ TECHZONE</span>
            </div>
            <div className="space-y-2 text-slate-700 leading-relaxed">
              <p>
                TECHZONE là hệ thống bán lẻ công nghệ chuyên cung cấp thiết bị kỹ thuật số, linh kiện máy tính, điện thoại thông minh, laptop chuyên nghiệp và phụ kiện gaming cao cấp tại Việt Nam.
              </p>
              <p>
                Với phương châm <strong>"Chất lượng thật - Giá trị thật"</strong>, chúng tôi cam kết 100% sản phẩm có nguồn gốc xuất xứ rõ ràng, đầy đủ hóa đơn VAT và chế độ hậu mãi chu đáo nhất cho sinh viên, kỹ sư và cộng đồng đam mê công nghệ.
              </p>
              <div className="pt-2 text-xs text-slate-500 font-mono">
                Địa chỉ: Tầng 12, Tòa nhà TechZone Tower, Quận 1, TP. Hồ Chí Minh · Hotline: 1900 6868
              </div>
            </div>
          </div>
        )}

        {type === 'return' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-base uppercase">
              <RefreshCw className="w-6 h-6" />
              <span>Chính sách đổi trả 1 đổi 1 trong 30 ngày</span>
            </div>
            <div className="space-y-2 text-slate-700 leading-relaxed">
              <p>
                Khách hàng được quyền đổi sản phẩm mới 100% trong vòng 30 ngày đầu tiên nếu máy phát sinh lỗi phần cứng từ nhà sản xuất đã được trung tâm bảo hành ủy quyền xác nhận.
              </p>
              <p>
                Yêu cầu: Hộp máy, phụ kiện đi kèm (củ sạc, cáp, sách hướng dẫn) và quà tặng kèm còn đầy đủ, không trầy xước cấn móp.
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
          >
            Đã hiểu và Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
