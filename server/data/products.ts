export interface ProductSpec {
  [key: string]: string;
}

export interface ProductData {
  id: number;
  category_id: number;
  category_name: string;
  category_slug: string;
  brand_id: number;
  brand_name: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  thumbnail: string;
  short_description: string;
  description: string;
  specs: ProductSpec;
  is_featured: boolean;
  is_new: boolean;
  status: 'active' | 'hidden' | 'out_of_stock';
  rating: number;
  review_count: number;
}

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  display_order: number;
}

export interface BrandData {
  id: number;
  name: string;
  slug: string;
  country: string;
  logo: string;
}

export interface CouponData {
  id: number;
  code: string;
  description: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
}

export interface OrderItemData {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderData {
  id: number;
  order_code: string;
  user_id: number | null;
  recipient_name: string;
  phone: string;
  email: string;
  shipping_address: string;
  notes: string;
  payment_method: 'cod' | 'bank_transfer';
  payment_status: 'unpaid' | 'paid';
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  coupon_code: string | null;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  stock_restocked: boolean;
  created_at: string;
  items: OrderItemData[];
}

export interface ReviewData {
  id: number;
  product_id: number;
  user_id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export const INITIAL_CATEGORIES: CategoryData[] = [
  { id: 1, name: 'Điện thoại thông minh', slug: 'dien-thoai-thong-minh', icon: 'Smartphone', description: 'Điện thoại flagship, tầm trung chính hãng', display_order: 1 },
  { id: 2, name: 'Laptop & Máy tính', slug: 'laptop-va-may-tinh', icon: 'Laptop', description: 'Laptop gaming, ultrabook đồ họa, máy trạm', display_order: 2 },
  { id: 3, name: 'Máy tính bảng', slug: 'may-tinh-bang', icon: 'Tablet', description: 'Tablet màn hình đẹp cho học tập và đồ họa', display_order: 3 },
  { id: 4, name: 'Màn hình máy tính', slug: 'man-hinh-may-tinh', icon: 'Monitor', description: 'Màn hình đồ họa chuẩn màu, màn hình gaming', display_order: 4 },
  { id: 5, name: 'Linh kiện máy tính', slug: 'linh-kien-may-tinh', icon: 'Cpu', description: 'CPU, VGA, RAM, SSD, Mainboard, Nguồn máy tính', display_order: 5 },
  { id: 6, name: 'Tai nghe & Âm thanh', slug: 'tai-nghe-va-am-thanh', icon: 'Headphones', description: 'Tai nghe chống ồn, loa bluetooth cao cấp', display_order: 6 },
  { id: 7, name: 'Bàn phím & Gaming Gear', slug: 'ban-phim-chuot-gaming', icon: 'Keyboard', description: 'Bàn phím cơ, chuột gaming siêu nhẹ', display_order: 7 },
  { id: 8, name: 'Phụ kiện điện thoại', slug: 'phu-kien-dien-thoai', icon: 'BatteryCharging', description: 'Củ sạc GaN, pin dự phòng, cáp sạc nhanh', display_order: 8 },
  { id: 9, name: 'Thiết bị mạng & Khác', slug: 'thiet-bi-mang-va-khac', icon: 'Wifi', description: 'Router Wi-Fi 6, Mesh, NAS lưu trữ', display_order: 9 },
];

export const INITIAL_BRANDS: BrandData[] = [
  { id: 1, name: 'Apple', slug: 'apple', country: 'USA', logo: 'apple.svg' },
  { id: 2, name: 'ASUS', slug: 'asus', country: 'Taiwan', logo: 'asus.svg' },
  { id: 3, name: 'Dell', slug: 'dell', country: 'USA', logo: 'dell.svg' },
  { id: 4, name: 'Lenovo', slug: 'lenovo', country: 'China', logo: 'lenovo.svg' },
  { id: 5, name: 'Samsung', slug: 'samsung', country: 'South Korea', logo: 'samsung.svg' },
  { id: 6, name: 'Sony', slug: 'sony', country: 'Japan', logo: 'sony.svg' },
  { id: 7, name: 'Logitech', slug: 'logitech', country: 'Switzerland', logo: 'logitech.svg' },
  { id: 8, name: 'Intel', slug: 'intel', country: 'USA', logo: 'intel.svg' },
  { id: 9, name: 'Corsair', slug: 'corsair', country: 'USA', logo: 'corsair.svg' },
  { id: 10, name: 'Kingston', slug: 'kingston', country: 'USA', logo: 'kingston.svg' },
  { id: 11, name: 'TP-Link', slug: 'tp-link', country: 'China', logo: 'tp-link.svg' },
  { id: 12, name: 'MSI', slug: 'msi', country: 'Taiwan', logo: 'msi.svg' },
];

export const INITIAL_PRODUCTS: ProductData[] = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Điện thoại thông minh',
    category_slug: 'dien-thoai-thong-minh',
    brand_id: 1,
    brand_name: 'Apple',
    sku: 'IP16PM-256',
    name: 'iPhone 16 Pro Max 256GB Titan Tự Nhiên',
    slug: 'iphone-16-pro-max-256gb',
    price: 34990000,
    sale_price: 32490000,
    stock_quantity: 25,
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    short_description: 'Flagship cao cấp nhất của Apple với chip A18 Pro và camera nút điều khiển Camera Control.',
    description: 'iPhone 16 Pro Max sở hữu màn hình Super Retina XDR 6.9 inch lớn nhất từ trước đến nay với viền mỏng ấn tượng. Khung titan cấp 5 siêu bền nhẹ. Hệ thống camera chuyên nghiệp 48MP Fusion cùng khả năng quay video 4K 120 fps Dolby Vision.',
    specs: {
      'Màn hình': '6.9 inch OLED Super Retina XDR 120Hz',
      'Vi xử lý': 'Apple A18 Pro 6 nhân',
      'RAM': '8GB',
      'Bộ nhớ': '256GB NVMe siêu tốc',
      'Camera': 'Chính 48MP + Góc rộng 48MP + Tele 5x 12MP',
      'Pin & Sạc': '4685 mAh, Sạc nhanh 30W MagSafe',
      'Hệ điều hành': 'iOS 18'
    },
    is_featured: true,
    is_new: true,
    status: 'active',
    rating: 5.0,
    review_count: 14
  },
  {
    id: 2,
    category_id: 1,
    category_name: 'Điện thoại thông minh',
    category_slug: 'dien-thoai-thong-minh',
    brand_id: 5,
    brand_name: 'Samsung',
    sku: 'SAMS24U-512',
    name: 'Samsung Galaxy S24 Ultra 5G 512GB Xám Titan',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    price: 33990000,
    sale_price: 29990000,
    stock_quantity: 18,
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    short_description: 'Quyền năng Galaxy AI, bút S-Pen tích hợp, khung viền Titanium và camera 200MP Zoom 100x.',
    description: 'Samsung Galaxy S24 Ultra trang bị vi xử lý Snapdragon 8 Gen 3 for Galaxy, màn hình phẳng Dynamic AMOLED 2X sáng 2600 nits phủ kính Gorilla Armor chống chói đỉnh cao. Bộ tính năng Galaxy AI thông minh hỗ trợ dịch thuật trực tiếp và khoanh vùng tìm kiếm.',
    specs: {
      'Màn hình': '6.8 inch Quad HD+ Dynamic AMOLED 2X 120Hz',
      'Vi xử lý': 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
      'RAM': '12GB',
      'Bộ nhớ': '512GB UFS 4.0',
      'Camera': '200MP + 50MP + 12MP + 10MP',
      'Pin & Sạc': '5000 mAh, Sạc siêu nhanh 45W',
      'Hệ điều hành': 'Android 14, One UI 6.1'
    },
    is_featured: true,
    is_new: false,
    status: 'active',
    rating: 4.9,
    review_count: 22
  },
  {
    id: 3,
    category_id: 1,
    category_name: 'Điện thoại thông minh',
    category_slug: 'dien-thoai-thong-minh',
    brand_id: 1,
    brand_name: 'Apple',
    sku: 'IP15-128',
    name: 'iPhone 15 128GB Xanh Mint Chính Hãng VN/A',
    slug: 'iphone-15-128gb-chinh-hang',
    price: 20990000,
    sale_price: 18990000,
    stock_quantity: 40,
    thumbnail: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    short_description: 'Thiết kế mặt lưng kính pha màu sang trọng, Dynamic Island tiện lợi và cổng USB-C tiện dụng.',
    description: 'iPhone 15 mang đến cụm Dynamic Island trực quan, camera chính 48MP chụp ảnh siêu nét và chip A16 Bionic mạnh mẽ. Cổng kết nối Type-C chuẩn mới thuận tiện khi sạc chung với MacBook và iPad.',
    specs: {
      'Màn hình': '6.1 inch Super Retina XDR OLED',
      'Vi xử lý': 'Apple A16 Bionic',
      'RAM': '6GB',
      'Bộ nhớ': '128GB NVMe',
      'Camera': 'Chính 48MP + Góc siêu rộng 12MP',
      'Pin': '3349 mAh, Hỗ trợ sạc nhanh 20W'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.8,
    review_count: 31
  },
  {
    id: 4,
    category_id: 2,
    category_name: 'Laptop & Máy tính',
    category_slug: 'laptop-va-may-tinh',
    brand_id: 1,
    brand_name: 'Apple',
    sku: 'MBP14-M3P',
    name: 'MacBook Pro 14 M3 Pro 18GB/512GB Space Black',
    slug: 'macbook-pro-14-m3-pro-18gb-512gb',
    price: 49990000,
    sale_price: 46490000,
    stock_quantity: 12,
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    short_description: 'Sức mạnh vượt trội từ chip M3 Pro, màn hình Liquid Retina XDR 120Hz và thời lượng pin 18 giờ.',
    description: 'Dành riêng cho lập trình viên, nhà sáng tạo nội dung và kỹ sư đồ họa. Chip Apple M3 Pro với 11 nhân CPU, 14 nhân GPU cùng công nghệ Ray Tracing tăng tốc phần cứng. Hệ thống tản nhiệt chủ động êm ái.',
    specs: {
      'Màn hình': '14.2 inch Liquid Retina XDR (3024x1964) ProMotion 120Hz',
      'Vi xử lý': 'Apple M3 Pro (11 nhân CPU, 14 nhân GPU)',
      'RAM': '18GB Unified Memory',
      'Bộ nhớ': '512GB PCIe SSD siêu tốc',
      'Cổng kết nối': '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3',
      'Trọng lượng': '1.61 kg'
    },
    is_featured: true,
    is_new: true,
    status: 'active',
    rating: 5.0,
    review_count: 19
  },
  {
    id: 5,
    category_id: 2,
    category_name: 'Laptop & Máy tính',
    category_slug: 'laptop-va-may-tinh',
    brand_id: 2,
    brand_name: 'ASUS',
    sku: 'ROG-ZEPH-G16',
    name: 'ASUS ROG Zephyrus G16 OLED Core Ultra 9 / RTX 4070',
    slug: 'asus-rog-zephyrus-g16-oled',
    price: 61990000,
    sale_price: 57990000,
    stock_quantity: 8,
    thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    short_description: 'Laptop Gaming mỏng nhẹ cao cấp hàng đầu với màn hình ROG Nebula OLED 2.5K 240Hz.',
    description: 'Thiết kế nhôm nguyên khối CNC siêu mỏng chỉ 1.49cm. Cấu hình đỉnh cao Intel Core Ultra 9 185H kết hợp NVIDIA GeForce RTX 4070 8GB GDDR6, hệ thống tản nhiệt buồng hơi tân tiến.',
    specs: {
      'Màn hình': '16 inch 2.5K ROG Nebula OLED 240Hz 0.2ms 100% DCI-P3',
      'CPU': 'Intel Core Ultra 9 185H (16 nhân, 22 luồng up to 5.1GHz)',
      'Card đồ họa': 'NVIDIA GeForce RTX 4070 8GB GDDR6 (TGP 105W)',
      'RAM': '32GB LPDDR5X 7467MHz',
      'Ổ cứng': '1TB M.2 NVMe PCIe 4.0 SSD',
      'Trọng lượng': '1.85 kg'
    },
    is_featured: true,
    is_new: true,
    status: 'active',
    rating: 4.9,
    review_count: 11
  },
  {
    id: 6,
    category_id: 2,
    category_name: 'Laptop & Máy tính',
    category_slug: 'laptop-va-may-tinh',
    brand_id: 3,
    brand_name: 'Dell',
    sku: 'DELL-XPS13-9340',
    name: 'Dell XPS 13 9340 Intel Core Ultra 7 16GB/512GB FHD+',
    slug: 'dell-xps-13-9340-core-ultra-7',
    price: 38990000,
    sale_price: 36490000,
    stock_quantity: 15,
    thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    short_description: 'Thiết kế viền vô cực tối giản, thanh cảm ứng điện dung hiện đại và bàn di chuột kính liền mạch.',
    description: 'Dòng máy chuẩn mực của phân khúc Ultrabook doanh nhân. Vỏ nhôm gia công CNC kết hợp kính cường lực Gorilla Glass. Vi xử lý Core Ultra 7 tích hợp NPU xử lý trí tuệ nhân tạo chuyên biệt.',
    specs: {
      'Màn hình': '13.4 inch FHD+ (1920x1200) InfinityEdge 500 nits 120Hz',
      'CPU': 'Intel Core Ultra 7 155H (16 nhân 22 luồng)',
      'RAM': '16GB LPDDR5x 7467MHz',
      'Ổ cứng': '512GB PCIe 4.0 NVMe SSD',
      'Trọng lượng': '1.19 kg'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.7,
    review_count: 9
  },
  {
    id: 7,
    category_id: 2,
    category_name: 'Laptop & Máy tính',
    category_slug: 'laptop-va-may-tinh',
    brand_id: 4,
    brand_name: 'Lenovo',
    sku: 'LEGION-PRO5',
    name: 'Lenovo Legion Pro 5 16IRX9 i7-14700HX / RTX 4060',
    slug: 'lenovo-legion-pro-5-16irx9',
    price: 39990000,
    sale_price: 37490000,
    stock_quantity: 14,
    thumbnail: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    short_description: 'Cỗ máy gaming quốc dân bền bỉ, tản nhiệt Legion ColdFront 5.0 và màn 16 inch 240Hz sắc nét.',
    description: 'Lenovo Legion Pro 5 khẳng định vị thế nhờ khung máy đầm chắc, bàn phím Legion TrueStrike gõ cực nảy. CPU Intel Gen 14 dòng HX hiệu năng cao và card RTX 4060 max công suất 140W.',
    specs: {
      'Màn hình': '16 inch WQXGA (2560x1600) IPS 240Hz 500nits G-SYNC',
      'CPU': 'Intel Core i7-14700HX (20 nhân, 28 luồng)',
      'GPU': 'NVIDIA GeForce RTX 4060 8GB GDDR6 140W',
      'RAM': '16GB DDR5 5600MHz',
      'Ổ cứng': '1TB SSD M.2 2280 PCIe 4.0'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.8,
    review_count: 16
  },
  {
    id: 8,
    category_id: 3,
    category_name: 'Máy tính bảng',
    category_slug: 'may-tinh-bang',
    brand_id: 1,
    brand_name: 'Apple',
    sku: 'IPAD-PRO-11-M4',
    name: 'iPad Pro 11 inch M4 Wi-Fi 256GB Đen Không Gian',
    slug: 'ipad-pro-11-inch-m4-256gb',
    price: 28990000,
    sale_price: 26990000,
    stock_quantity: 20,
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    short_description: 'Thiết kế mỏng kỷ lục 5.3mm, chip Apple M4 thế hệ mới cùng màn hình Ultra Retina XDR Tandem OLED.',
    description: 'Chiếc máy tính bảng đột phá nhất của Apple với công nghệ 2 lớp màn hình OLED xếp chồng cho độ sáng đỉnh 1600 nits. Hỗ trợ Apple Pencil Pro và Magic Keyboard mới.',
    specs: {
      'Màn hình': '11 inch Ultra Retina XDR Tandem OLED 120Hz',
      'Vi xử lý': 'Apple M4 9 nhân CPU, 10 nhân GPU',
      'RAM': '8GB',
      'Bộ nhớ': '256GB NVMe',
      'Độ mỏng': '5.3 mm siêu nhẹ 444g'
    },
    is_featured: true,
    is_new: true,
    status: 'active',
    rating: 5.0,
    review_count: 27
  },
  {
    id: 9,
    category_id: 3,
    category_name: 'Máy tính bảng',
    category_slug: 'may-tinh-bang',
    brand_id: 5,
    brand_name: 'Samsung',
    sku: 'TAB-S9-PLUS',
    name: 'Samsung Galaxy Tab S9 Plus 5G 12GB/256GB Kèm S-Pen',
    slug: 'samsung-galaxy-tab-s9-plus-5g',
    price: 23990000,
    sale_price: 20490000,
    stock_quantity: 16,
    thumbnail: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
    short_description: 'Màn hình Dynamic AMOLED 2X rực rỡ, chuẩn kháng nước IP68 đầu tiên trên tablet cao cấp.',
    description: 'Tablet màn hình lớn 12.4 inch phục vụ tối đa nhu cầu ghi chú, phác thảo đồ họa và đa nhiệm DeX. Trang bị chip Snapdragon 8 Gen 2 for Galaxy và hệ thống 4 loa AKG sống động.',
    specs: {
      'Màn hình': '12.4 inch Dynamic AMOLED 2X 120Hz HDR10+',
      'CPU': 'Snapdragon 8 Gen 2 for Galaxy',
      'RAM': '12GB',
      'Bộ nhớ': '256GB UFS 4.0',
      'Kháng nước': 'IP68 cả máy và bút S-Pen'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.8,
    review_count: 12
  },
  {
    id: 10,
    category_id: 4,
    category_name: 'Màn hình máy tính',
    category_slug: 'man-hinh-may-tinh',
    brand_id: 3,
    brand_name: 'Dell',
    sku: 'DELL-U2724D',
    name: 'Màn hình Dell UltraSharp U2724D 27 inch 2K IPS Black 120Hz',
    slug: 'dell-ultrasharp-u2724d-27-inch',
    price: 11990000,
    sale_price: 10890000,
    stock_quantity: 30,
    thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    short_description: 'Độ chuẩn màu vượt trội 98% DCI-P3, tấm nền IPS Black tương phản 2000:1 và tần số quét mượt mà 120Hz.',
    description: 'Màn hình chuẩn mực cho thiết kế đồ họa và sáng tạo. Tích hợp cảm biến ánh sáng xung quanh tự động điều chỉnh độ sáng, chân đế công thái học xoay lật 90 độ linh hoạt.',
    specs: {
      'Kích thước': '27 inch QHD (2560 x 1440)',
      'Tấm nền': 'IPS Black thế hệ mới, tương phản 2000:1',
      'Tần số quét': '120Hz',
      'Độ phủ màu': '100% sRGB, 98% Display P3, Delta E < 2',
      'Cổng kết nối': 'DisplayPort 1.4, HDMI, USB-C upstream/downstream'
    },
    is_featured: true,
    is_new: false,
    status: 'active',
    rating: 4.9,
    review_count: 38
  },
  {
    id: 11,
    category_id: 4,
    category_name: 'Màn hình máy tính',
    category_slug: 'man-hinh-may-tinh',
    brand_id: 2,
    brand_name: 'ASUS',
    sku: 'ROG-PG27AQDM',
    name: 'Màn hình Gaming ASUS ROG Swift OLED PG27AQDM 27 inch 2K 240Hz 0.03ms',
    slug: 'asus-rog-swift-oled-pg27aqdm',
    price: 23990000,
    sale_price: 21990000,
    stock_quantity: 10,
    thumbnail: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
    short_description: 'Tấm nền OLED siêu tốc 240Hz, thời gian phản hồi 0.03ms vô đối cho game thủ Esport.',
    description: 'Sự kết hợp hoàn hảo giữa độ tương phản tuyệt đối của OLED và tần số quét khủng 240Hz. Hệ thống tản nhiệt thông minh tùy chỉnh giúp giảm nguy cơ lưu ảnh (burn-in).',
    specs: {
      'Kích thước': '26.5 inch OLED 2K (2560 x 1440)',
      'Tần số quét': '240Hz',
      'Thời gian phản hồi': '0.03ms (GTG)',
      'Độ sáng': '1000 nits đỉnh (3% APL)',
      'Đồng bộ hình ảnh': 'G-SYNC Compatible, FreeSync Premium'
    },
    is_featured: false,
    is_new: true,
    status: 'active',
    rating: 4.9,
    review_count: 15
  },
  {
    id: 12,
    category_id: 5,
    category_name: 'Linh kiện máy tính',
    category_slug: 'linh-kien-may-tinh',
    brand_id: 8,
    brand_name: 'Intel',
    sku: 'CPU-I7-14700K',
    name: 'CPU Intel Core i7 14700K (20 Nhân 28 Luồng / Up to 5.6GHz)',
    slug: 'intel-core-i7-14700k',
    price: 11490000,
    sale_price: 10490000,
    stock_quantity: 45,
    thumbnail: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    short_description: 'Bộ vi xử lý kiến trúc Raptor Lake Refresh mạnh mẽ cho cả Render đồ họa nặng và Gaming đỉnh cao.',
    description: 'Trang bị 8 nhân hiệu năng cao (P-core) và 12 nhân tiết kiệm điện (E-core). Hỗ trợ chuẩn RAM DDR5 và PCIe Gen 5.0, socket LGA1700 tương thích bo mạch chủ Z790/B760.',
    specs: {
      'Socket': 'LGA 1700',
      'Số nhân / luồng': '20 nhân (8P + 12E), 28 luồng',
      'Xung nhịp': 'Cơ bản 3.4GHz, Turbo boost 5.6GHz',
      'Bộ nhớ đệm': '33MB Intel Smart Cache',
      'Công suất TDP': '125W (Cực đại 253W)'
    },
    is_featured: true,
    is_new: false,
    status: 'active',
    rating: 4.9,
    review_count: 42
  },
  {
    id: 13,
    category_id: 5,
    category_name: 'Linh kiện máy tính',
    category_slug: 'linh-kien-may-tinh',
    brand_id: 12,
    brand_name: 'MSI',
    sku: 'VGA-MSI-4070S-TRIO',
    name: 'Card màn hình MSI GeForce RTX 4070 SUPER 12G GAMING X TRIO',
    slug: 'msi-geforce-rtx-4070-super-12g-gaming-x-trio',
    price: 19990000,
    sale_price: 18490000,
    stock_quantity: 12,
    thumbnail: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    short_description: 'Kiến trúc Ada Lovelace, công nghệ nâng khung hình DLSS 3 và tản nhiệt 3 quạt TRI FROZR 3 mát mẻ.',
    description: 'Card đồ họa cân bằng nhất cho trải nghiệm chơi game 2K Ray Tracing mượt mà. 7168 nhân CUDA và 12GB bộ nhớ GDDR6X băng thông cao.',
    specs: {
      'Nhân đồ họa': 'NVIDIA GeForce RTX 4070 SUPER',
      'Số nhân CUDA': '7168 Cores',
      'Bộ nhớ VRAM': '12GB GDDR6X 192-bit',
      'Xung nhịp Boost': '2640 MHz',
      'Nguồn yêu cầu': 'Từ 650W, đầu nối 16-pin'
    },
    is_featured: true,
    is_new: true,
    status: 'active',
    rating: 5.0,
    review_count: 20
  },
  {
    id: 14,
    category_id: 5,
    category_name: 'Linh kiện máy tính',
    category_slug: 'linh-kien-may-tinh',
    brand_id: 9,
    brand_name: 'Corsair',
    sku: 'RAM-CORSAIR-D5-32G',
    name: 'RAM Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 6000MHz Black',
    slug: 'corsair-dominator-titanium-rgb-32gb-ddr5',
    price: 4790000,
    sale_price: 4290000,
    stock_quantity: 35,
    thumbnail: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    short_description: 'Thanh RAM DDR5 phân khúc cao cấp nhất với nắp trên tháo rời và đèn LED RGB Capellix rực rỡ.',
    description: 'Vỏ nhôm rèn chính xác, chip nhớ phân loại thủ công cho khả năng ép xung XMP 3.0 cực kỳ ổn định trên nền tảng Intel và AMD.',
    specs: {
      'Chuẩn RAM': 'DDR5',
      'Dung lượng': '32GB (2 x 16GB)',
      'Bus tốc độ': '6000 MT/s (CL30-36-36-76)',
      'Điện áp': '1.40V',
      'Hỗ trợ ép xung': 'Intel XMP 3.0 & AMD EXPO'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.8,
    review_count: 14
  },
  {
    id: 15,
    category_id: 5,
    category_name: 'Linh kiện máy tính',
    category_slug: 'linh-kien-may-tinh',
    brand_id: 10,
    brand_name: 'Kingston',
    sku: 'SSD-KC3000-1TB',
    name: 'Ổ cứng SSD Kingston KC3000 1TB M.2 PCIe Gen 4x4 NVMe (7000MB/s)',
    slug: 'kingston-kc3000-1tb-pcie-gen-4x4-nvme',
    price: 2590000,
    sale_price: 2290000,
    stock_quantity: 50,
    thumbnail: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    short_description: 'Tốc độ đọc ghi kinh ngạc lên đến 7,000MB/s, tản nhiệt nhôm graphene mỏng nhẹ cho PC và PS5.',
    description: 'Sử dụng bộ điều khiển Phison E18 mới nhất và chip nhớ 3D TLC NAND cao cấp. Tối ưu thời gian khởi động hệ điều hành và load game siêu nhanh.',
    specs: {
      'Chuẩn cắm': 'M.2 2280 PCIe 4.0 NVMe',
      'Dung lượng': '1TB (1024GB)',
      'Tốc độ đọc': 'Lên tới 7,000 MB/s',
      'Tốc độ ghi': 'Lên tới 6,000 MB/s',
      'Độ bền TBW': '800 TBW'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.9,
    review_count: 53
  },
  {
    id: 16,
    category_id: 6,
    category_name: 'Tai nghe & Âm thanh',
    category_slug: 'tai-nghe-va-am-thanh',
    brand_id: 6,
    brand_name: 'Sony',
    sku: 'SONY-WH1000XM5',
    name: 'Tai nghe chụp tai Sony WH-1000XM5 Chống Ồn Đỉnh Cao - Đen',
    slug: 'sony-wh-1000xm5-chong-on-dinh-cao',
    price: 8490000,
    sale_price: 7290000,
    stock_quantity: 22,
    thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    short_description: '2 bộ xử lý âm thanh, 8 micro khử ồn tự động tối ưu hóa và chất lượng đàm thoại trong trẻo hàng đầu.',
    description: 'Chiếc tai nghe over-ear chống ồn tốt nhất hiện nay. Màng loa 30mm thiết kế đặc biệt mang lại âm thanh độ phân giải cao Hi-Res Audio, thời lượng pin 30 giờ liên tục.',
    specs: {
      'Màng loa': '30mm sợi carbon composite',
      'Công nghệ ANC': 'Bộ xử lý tích hợp V1 + QN1 với 8 micro',
      'Bluetooth': '5.2, Codec LDAC, AAC, SBC',
      'Thời lượng pin': '30 giờ (bật ANC), Sạc nhanh 3 phút nghe 3 giờ',
      'Trọng lượng': '250g'
    },
    is_featured: true,
    is_new: false,
    status: 'active',
    rating: 5.0,
    review_count: 48
  },
  {
    id: 17,
    category_id: 6,
    category_name: 'Tai nghe & Âm thanh',
    category_slug: 'tai-nghe-va-am-thanh',
    brand_id: 1,
    brand_name: 'Apple',
    sku: 'AIRPODS-PRO-2-USBC',
    name: 'Tai nghe Apple AirPods Pro 2 MagSafe (USB-C) Chính Hãng',
    slug: 'apple-airpods-pro-2-magsafe-usb-c',
    price: 6190000,
    sale_price: 5390000,
    stock_quantity: 60,
    thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    short_description: 'Chip Apple H2, tính năng Âm Thanh Thích Ứng (Adaptive Audio) và khả năng chống ồn gấp đôi.',
    description: 'Hộp sạc nâng cấp cổng USB-C bền bỉ chuẩn mới, loa tích hợp trên hộp sạc hỗ trợ tính năng Tìm Chính Xác (Precision Finding). Kháng nước và mồ hôi chuẩn IP54.',
    specs: {
      'Chip điều khiển': 'Apple H2 trong tai nghe, Apple U1 trong hộp sạc',
      'Công nghệ âm thanh': 'Spatial Audio theo dõi chuyển động đầu',
      'Pin': '6 giờ nghe (30 giờ kèm hộp sạc)',
      'Kết nối': 'Bluetooth 5.3, Cổng sạc USB-C và MagSafe'
    },
    is_featured: true,
    is_new: true,
    status: 'active',
    rating: 4.9,
    review_count: 67
  },
  {
    id: 18,
    category_id: 6,
    category_name: 'Tai nghe & Âm thanh',
    category_slug: 'tai-nghe-va-am-thanh',
    brand_id: 6,
    brand_name: 'Sony',
    sku: 'SONY-SRS-XB100',
    name: 'Loa Bluetooth Sony SRS-XB100 Siêu Nhỏ Gọn Kháng Nước IP67',
    slug: 'sony-srs-xb100-loa-bluetooth-nho-gon',
    price: 1290000,
    sale_price: 1090000,
    stock_quantity: 40,
    thumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    short_description: 'Âm trầm Extra Bass mạnh mẽ trong thân hình nhỏ gọn, dây đeo tiện lợi cho các chuyến dã ngoại.',
    description: 'Trang bị bộ xử lý khuếch tán âm thanh Sound Diffusion Processor lan tỏa âm nhạc khắp không gian. Chống bụi chống nước IP67 và pin bền bỉ đến 16 tiếng.',
    specs: {
      'Công suất': '5W kèm màng rung thụ động Passive Radiator',
      'Tiêu chuẩn kháng nước': 'IP67 chống nước và bụi',
      'Pin': 'Lên tới 16 giờ, sạc cổng USB-C',
      'Đàm thoại': 'Tích hợp micro chống vọng tiếng ồn'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.7,
    review_count: 18
  },
  {
    id: 19,
    category_id: 7,
    category_name: 'Bàn phím & Gaming Gear',
    category_slug: 'ban-phim-chuot-gaming',
    brand_id: 7,
    brand_name: 'Logitech',
    sku: 'LOGI-G-PRO-X-SUPERLIGHT-2',
    name: 'Chuột Gaming Không Dây Logitech G Pro X Superlight 2 Trắng',
    slug: 'logitech-g-pro-x-superlight-2',
    price: 3690000,
    sale_price: 3190000,
    stock_quantity: 28,
    thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    short_description: 'Trọng lượng siêu nhẹ 60g, switch lai quang-cơ LIGHTFORCE và cảm biến HERO 2 độ phân giải 32,000 DPI.',
    description: 'Chuột thi đấu eSports đỉnh cao được các tuyển thủ chuyên nghiệp tin cậy hàng đầu. Tần số phản hồi không dây LIGHTSPEED 4000Hz (0.25ms) cực nhạy.',
    specs: {
      'Cảm biến': 'HERO 2 (100 - 32,000 DPI, 500+ IPS)',
      'Switch phím': 'Quang học lai cơ học LIGHTFORCE',
      'Trọng lượng': '60 gram',
      'Tần số gửi tín hiệu': '4000Hz (0.25ms)',
      'Thời lượng pin': 'Lên đến 95 giờ liên tục'
    },
    is_featured: true,
    is_new: false,
    status: 'active',
    rating: 5.0,
    review_count: 36
  },
  {
    id: 20,
    category_id: 7,
    category_name: 'Bàn phím & Gaming Gear',
    category_slug: 'ban-phim-chuot-gaming',
    brand_id: 2,
    brand_name: 'ASUS',
    sku: 'ROG-AZOTH-OLED',
    name: 'Bàn phím cơ ASUS ROG Azoth 75% Wireless Switch ROG NX Snow',
    slug: 'ban-phim-co-asus-rog-azoth-75-wireless',
    price: 6490000,
    sale_price: 5890000,
    stock_quantity: 15,
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    short_description: 'Màn hình OLED 2 inch hiển thị thông số, cấu trúc đệm Gasket mount 3 lớp tiêu âm và tính năng Hot-swap.',
    description: 'Bàn phím cơ custom lắp ráp sẵn cao cấp nhất thị trường. Kết nối 3 chế độ (Bluetooth, 2.4GHz SpeedNova, Type-C). Tặng kèm bộ dụng cụ lube switch cao cấp.',
    specs: {
      'Layout phím': '75% (81 phím)',
      'Switch': 'ROG NX Snow Linear bôi trơn sẵn từ nhà máy',
      'Đệm cấu trúc': 'Gasket Mount với 3 lớp đệm Poron/Silicone',
      'Màn hình': 'OLED 2 inch kèm núm xoay điều khiển 3 hướng',
      'Thời lượng pin': 'Hơn 2000 giờ sử dụng không dây'
    },
    is_featured: true,
    is_new: true,
    status: 'active',
    rating: 5.0,
    review_count: 24
  },
  {
    id: 21,
    category_id: 7,
    category_name: 'Bàn phím & Gaming Gear',
    category_slug: 'ban-phim-chuot-gaming',
    brand_id: 7,
    brand_name: 'Logitech',
    sku: 'LOGI-MX-MASTER-3S',
    name: 'Chuột Không Dây Logitech MX Master 3S Chống Ồn Quiet Clicks',
    slug: 'chuot-logitech-mx-master-3s-quiet-clicks',
    price: 2490000,
    sale_price: 2190000,
    stock_quantity: 35,
    thumbnail: 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=800&q=80',
    short_description: 'Chuẩn mực chuột công thái học cho lập trình viên và thiết kế đồ họa với cuộn từ tính MagSpeed 1000 dòng/giây.',
    description: 'Cảm biến quang học 8000 DPI hoạt động trên mọi bề mặt kể cả mặt kính trong suốt. Công nghệ click êm ái giảm 90% tiếng ồn, kết nối 3 thiết bị cùng lúc.',
    specs: {
      'Cảm biến': 'Darkfield 8000 DPI lướt trên mặt kính',
      'Bánh lăn': 'Điện từ MagSpeed cuộn cực nhanh',
      'Pin': 'Dùng 70 ngày cho 1 lần sạc đầy',
      'Tính năng': 'Logi Options+, Easy-Switch 3 thiết bị'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.9,
    review_count: 51
  },
  {
    id: 22,
    category_id: 8,
    category_name: 'Phụ kiện điện thoại',
    category_slug: 'phu-kien-dien-thoai',
    brand_id: 1,
    brand_name: 'Apple',
    sku: 'APPLE-20W-ADAPTER',
    name: 'Củ Sạc Nhanh Apple 20W Type-C Chính Hãng',
    slug: 'cu-sac-nhanh-apple-20w-type-c',
    price: 550000,
    sale_price: 490000,
    stock_quantity: 120,
    thumbnail: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    short_description: 'Củ sạc chính hãng Apple chuẩn Power Delivery tối ưu hóa tốc độ sạc cho iPhone và iPad.',
    description: 'Thiết kế chân cắm tròn chuẩn Việt Nam, bảo vệ ngắn mạch và kiểm soát nhiệt độ an toàn tuyệt đối cho pin thiết bị của bạn.',
    specs: {
      'Công suất': '20W Power Delivery (PD)',
      'Cổng ra': '1x USB Type-C',
      'Tương thích': 'iPhone 8 đến iPhone 16 Pro Max, iPad',
      'Chứng chỉ': 'An toàn tiêu chuẩn Apple'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.8,
    review_count: 85
  },
  {
    id: 23,
    category_id: 8,
    category_name: 'Phụ kiện điện thoại',
    category_slug: 'phu-kien-dien-thoai',
    brand_id: 5,
    brand_name: 'Samsung',
    sku: 'SAMS-POWERBANK-20000',
    name: 'Pin Sạc Dự Phòng Samsung 20.000mAh Sạc Nhanh 45W Siêu Bền',
    slug: 'pin-sac-du-phong-samsung-20000mah-45w',
    price: 1490000,
    sale_price: 1250000,
    stock_quantity: 45,
    thumbnail: 'https://images.unsplash.com/photo-1609592424368-24d1a03f56eb?auto=format&fit=crop&w=800&q=80',
    short_description: 'Dung lượng khủng sạc được cả laptop và điện thoại với công suất tối đa 45W Power Delivery.',
    description: 'Vỏ ngoài chế tác từ vật liệu tái chế thân thiện với môi trường. Hỗ trợ sạc nhanh đồng thời 3 thiết bị qua 3 cổng Type-C hiện đại.',
    specs: {
      'Dung lượng': '20,000 mAh (74 Wh)',
      'Công suất sạc ra': 'Tối đa 45W PD 3.0 PPS',
      'Cổng kết nối': '3 cổng USB Type-C hỗ trợ sạc 2 chiều',
      'Bảo vệ an toàn': 'Chống quá dòng, quá nhiệt, ngắn mạch'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.7,
    review_count: 29
  },
  {
    id: 24,
    category_id: 9,
    category_name: 'Thiết bị mạng & Khác',
    category_slug: 'thiet-bi-mang-va-khac',
    brand_id: 11,
    brand_name: 'TP-Link',
    sku: 'TPLINK-ARCHER-AX73',
    name: 'Router Wi-Fi 6 Băng Tần Kép TP-Link Archer AX73 AX5400',
    slug: 'router-wifi-6-tp-link-archer-ax73-ax5400',
    price: 2590000,
    sale_price: 2190000,
    stock_quantity: 25,
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    short_description: 'Tốc độ Wi-Fi 6 siêu tốc 5400 Mbps với 6 ăng-ten ngoài độ lợi cao và công nghệ OneMesh phủ sóng toàn diện.',
    description: 'Trang bị CPU 3 nhân 1.5GHz xử lý đồng thời hàng chục thiết bị xem video 4K/8K và chơi game không gián đoạn. Bảo mật HomeShield nâng cao chống tấn công mạng.',
    specs: {
      'Chuẩn Wi-Fi': 'Wi-Fi 6 (802.11ax/ac/n/a/b/g)',
      'Tốc độ': '4804 Mbps (5 GHz) + 574 Mbps (2.4 GHz)',
      'Ăng-ten': '6 ăng-ten ngoài hiệu suất cao',
      'Cổng giao tiếp': '1x Gigabit WAN, 4x Gigabit LAN, 1x USB 3.0'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.8,
    review_count: 34
  },
  {
    id: 25,
    category_id: 9,
    category_name: 'Thiết bị mạng & Khác',
    category_slug: 'thiet-bi-mang-va-khac',
    brand_id: 11,
    brand_name: 'TP-Link',
    sku: 'DECO-X50-3PACK',
    name: 'Hệ Thống Wi-Fi Mesh TP-Link Deco X50 AX3000 (Bộ 3 Thiết Bị)',
    slug: 'he-thong-wifi-mesh-tp-link-deco-x50-ax3000-3pack',
    price: 4990000,
    sale_price: 4390000,
    stock_quantity: 15,
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    short_description: 'Phủ sóng Wi-Fi 6 xuyên tường toàn bộ ngôi nhà đến 600m2, chuyển vùng mượt mà không rớt mạng.',
    description: 'Hệ thống Deco thông minh dùng thuật toán AI để tự động tối ưu hóa đường truyền mạng. Kết nối đồng thời hơn 150 thiết bị trong nhà thông minh.',
    specs: {
      'Tốc độ Mesh': 'AX3000 (2402 Mbps 5GHz + 574 Mbps 2.4GHz)',
      'Độ phủ sóng': 'Lên tới 600 m2 (bộ 3 pack)',
      'Cổng Ethernet': '3 cổng Gigabit trên mỗi thiết bị',
      'Chuyển vùng': 'Chuẩn liền mạch 802.11k/v/r'
    },
    is_featured: true,
    is_new: false,
    status: 'active',
    rating: 4.9,
    review_count: 21
  },
  {
    id: 26,
    category_id: 1,
    category_name: 'Điện thoại thông minh',
    category_slug: 'dien-thoai-thong-minh',
    brand_id: 5,
    brand_name: 'Samsung',
    sku: 'SAMS-A55-5G',
    name: 'Samsung Galaxy A55 5G 8GB/128GB Xanh Iceblue',
    slug: 'samsung-galaxy-a55-5g-128gb',
    price: 9990000,
    sale_price: 8990000,
    stock_quantity: 30,
    thumbnail: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    short_description: 'Khung viền kim loại cao cấp, màn hình Super AMOLED 120Hz và khả năng chống nước IP67 bền bỉ.',
    description: 'Chiếc điện thoại tầm trung quốc dân với chip Exynos 1480 có GPU đồ họa AMD RDNA thế hệ mới.',
    specs: {
      'Màn hình': '6.6 inch Super AMOLED 120Hz FHD+',
      'Vi xử lý': 'Exynos 1480 8 nhân (4nm)',
      'RAM': '8GB',
      'Bộ nhớ': '128GB (hỗ trợ thẻ MicroSD)',
      'Pin': '5000 mAh sạc nhanh 25W'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.6,
    review_count: 19
  },
  {
    id: 27,
    category_id: 2,
    category_name: 'Laptop & Máy tính',
    category_slug: 'laptop-va-may-tinh',
    brand_id: 2,
    brand_name: 'ASUS',
    sku: 'ASUS-ZENBOOK-14',
    name: 'ASUS Zenbook 14 OLED UX3405 Core Ultra 5 / 16GB / 512GB',
    slug: 'asus-zenbook-14-oled-ux3405',
    price: 25990000,
    sale_price: 23990000,
    stock_quantity: 20,
    thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    short_description: 'Tuyệt phẩm ultrabook siêu mỏng 1.2kg, màn hình Lumina OLED 3K 120Hz chuẩn màu điện ảnh.',
    description: 'Đạt chuẩn quân đội MIL-STD 810H, bàn phím ErgoSense êm ái và pin bền bỉ suốt ngày dài.',
    specs: {
      'Màn hình': '14 inch 3K OLED 120Hz 100% DCI-P3 400 nits',
      'CPU': 'Intel Core Ultra 5 125H tích hợp NPU AI',
      'RAM': '16GB LPDDR5X',
      'Ổ cứng': '512GB M.2 NVMe PCIe 4.0 SSD',
      'Trọng lượng': '1.2 kg'
    },
    is_featured: false,
    is_new: true,
    status: 'active',
    rating: 4.8,
    review_count: 17
  },
  {
    id: 28,
    category_id: 4,
    category_name: 'Màn hình máy tính',
    category_slug: 'man-hinh-may-tinh',
    brand_id: 5,
    brand_name: 'Samsung',
    sku: 'SAMS-ODYSSEY-G7',
    name: 'Màn hình Cong Gaming Samsung Odyssey G7 32 inch 2K 240Hz 1000R',
    slug: 'samsung-odyssey-g7-32-inch-2k-240hz',
    price: 14990000,
    sale_price: 12990000,
    stock_quantity: 14,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    short_description: 'Độ cong hoàn hảo 1000R tương thích trường nhìn mắt người, tần số quét 240Hz và chấm lượng tử QLED.',
    description: 'Trải nghiệm đắm chìm trong các tựa game bắn súng và đua xe đỉnh cao với thời gian đáp ứng 1ms.',
    specs: {
      'Kích thước': '32 inch cong 1000R',
      'Độ phân giải': '2K QHD (2560 x 1440)',
      'Tần số quét': '240Hz, phản hồi 1ms (GtG)',
      'Công nghệ màu': 'QLED Quantum Dot HDR 600'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.8,
    review_count: 25
  },
  {
    id: 29,
    category_id: 5,
    category_name: 'Linh kiện máy tính',
    category_slug: 'linh-kien-may-tinh',
    brand_id: 12,
    brand_name: 'MSI',
    sku: 'MAIN-MSI-Z790-TOMAHAWK',
    name: 'Bo Mạch Chủ MSI MAG Z790 TOMAHAWK WIFI DDR5',
    slug: 'mainboard-msi-mag-z790-tomahawk-wifi',
    price: 7990000,
    sale_price: 7190000,
    stock_quantity: 22,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    short_description: 'Thiết kế nguồn 16+1+1 Duet Rail 90A SPS cực kỳ mạnh mẽ, tản nhiệt Extended Heatsink đồ sộ.',
    description: 'Bo mạch chủ chuẩn ATX tối ưu cho các bộ vi xử lý Intel Core thế hệ 14 mới nhất.',
    specs: {
      'Socket': 'LGA 1700, Chipset Intel Z790',
      'Khe RAM': '4x DDR5 up to 7200+ MHz (OC)',
      'Khe M.2': '4x M.2 PCIe 4.0 NVMe tản nhiệt Shield Frozr',
      'Kết nối mạng': 'Intel 2.5Gbps LAN & Wi-Fi 6E'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.9,
    review_count: 30
  },
  {
    id: 30,
    category_id: 6,
    category_name: 'Tai nghe & Âm thanh',
    category_slug: 'tai-nghe-va-am-thanh',
    brand_id: 1,
    brand_name: 'Apple',
    sku: 'AIRPODS-MAX-USBC',
    name: 'Tai nghe chụp tai Apple AirPods Max (USB-C) - Midnight',
    slug: 'apple-airpods-max-usb-c-midnight',
    price: 13990000,
    sale_price: 12890000,
    stock_quantity: 10,
    thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    short_description: 'Thiết kế vòm lưới thoáng khí độc đáo, âm thanh chân thực với chip H1 trên mỗi bên củ tai.',
    description: 'Vỏ chụp tai bằng nhôm anod hóa sang trọng, chế độ Xuyên Âm tự nhiên nhất thế giới tai nghe.',
    specs: {
      'Màng loa': '40mm Dynamic do Apple phát triển',
      'Công nghệ ANC': 'Chống ồn chủ động chuyên nghiệp',
      'Thời lượng pin': '20 giờ nghe nhạc với ANC',
      'Cổng kết nối': 'USB-C chuẩn mới'
    },
    is_featured: true,
    is_new: true,
    status: 'active',
    rating: 4.9,
    review_count: 23
  },
  {
    id: 31,
    category_id: 7,
    category_name: 'Bàn phím & Gaming Gear',
    category_slug: 'ban-phim-chuot-gaming',
    brand_id: 9,
    brand_name: 'Corsair',
    sku: 'CORSAIR-K70-MAX',
    name: 'Bàn phím cơ Corsair K70 MAX RGB Magnetic Switch MGX',
    slug: 'ban-phim-corsair-k70-max-rgb-mgx',
    price: 5690000,
    sale_price: 4990000,
    stock_quantity: 18,
    thumbnail: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    short_description: 'Switch từ tính CORSAIR MGX cho phép tùy chỉnh điểm kích hoạt siêu nhạy từ 0.4mm đến 3.6mm.',
    description: 'Tích hợp tính năng Rapid Trigger giúp game thủ phản xạ nhanh như chớp trong game FPS.',
    specs: {
      'Loại switch': 'Magnetic MGX công nghệ từ tính',
      'Tần số quét': '8000Hz công nghệ xử lý AXON',
      'Keycap': 'Double-shot PBT 1.5mm',
      'Đệm kê tay': 'Từ tính mút hoạt tính êm ái'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.8,
    review_count: 16
  },
  {
    id: 32,
    category_id: 8,
    category_name: 'Phụ kiện điện thoại',
    category_slug: 'phu-kien-dien-thoai',
    brand_id: 1,
    brand_name: 'Apple',
    sku: 'MAGSAFE-CHARGER-1M',
    name: 'Đế Sạc Không Dây Apple MagSafe Charger 1m Chính Hãng',
    slug: 'de-sac-khong-day-apple-magsafe-charger-1m',
    price: 1190000,
    sale_price: 990000,
    stock_quantity: 60,
    thumbnail: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
    short_description: 'Nam châm căn chỉnh chuẩn xác gắn chặt vào mặt lưng iPhone 12 đến 16, công suất sạc lên đến 25W.',
    description: 'Tương thích tiêu chuẩn sạc Qi2 mới nhất, hỗ trợ sạc cả tai nghe AirPods Pro.',
    specs: {
      'Loại sạc': 'Sạc không dây từ tính MagSafe',
      'Công suất': 'Lên đến 25W khi dùng củ sạc 30W',
      'Cáp kết nối': 'Cáp dù 1 mét chống rối'
    },
    is_featured: false,
    is_new: false,
    status: 'active',
    rating: 4.9,
    review_count: 44
  }
];

export const INITIAL_COUPONS: CouponData[] = [
  {
    id: 1,
    code: 'TECHZONE10',
    description: 'Giảm 10% tối đa 1.000.000đ cho đơn hàng từ 5 triệu',
    discount_type: 'percent',
    discount_value: 10,
    min_order_value: 5000000,
    max_discount: 1000000,
    usage_limit: 200,
    used_count: 15,
    is_active: true
  },
  {
    id: 2,
    code: 'WELCOME50K',
    description: 'Giảm trực tiếp 50.000đ cho khách hàng với đơn từ 500.000đ',
    discount_type: 'fixed',
    discount_value: 50000,
    min_order_value: 500000,
    max_discount: 50000,
    usage_limit: 500,
    used_count: 32,
    is_active: true
  },
  {
    id: 3,
    code: 'GAMING2026',
    description: 'Giảm 5% cho đơn hàng linh kiện và gaming từ 10 triệu',
    discount_type: 'percent',
    discount_value: 5,
    min_order_value: 10000000,
    max_discount: 800000,
    usage_limit: 100,
    used_count: 8,
    is_active: true
  }
];

export const INITIAL_ORDERS: OrderData[] = [
  {
    id: 1,
    order_code: 'TZ-20261015-001',
    user_id: 2,
    recipient_name: 'Nguyễn Văn An',
    phone: '0987654321',
    email: 'khachhang@techzone.vn',
    shipping_address: 'Số 45 Đường Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    notes: 'Giao giờ hành chính',
    payment_method: 'cod',
    payment_status: 'paid',
    subtotal: 32490000,
    discount_amount: 1000000,
    shipping_fee: 0,
    total_amount: 31490000,
    coupon_code: 'TECHZONE10',
    status: 'delivered',
    stock_restocked: false,
    created_at: '2026-10-15T09:30:00Z',
    items: [
      {
        id: 1,
        product_id: 1,
        product_name: 'iPhone 16 Pro Max 256GB Titan Tự Nhiên',
        product_sku: 'IP16PM-256',
        unit_price: 32490000,
        quantity: 1,
        subtotal: 32490000
      }
    ]
  },
  {
    id: 2,
    order_code: 'TZ-20261016-002',
    user_id: 2,
    recipient_name: 'Nguyễn Văn An',
    phone: '0987654321',
    email: 'khachhang@techzone.vn',
    shipping_address: 'Số 45 Đường Lê Lợi, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    notes: 'Gọi trước khi giao',
    payment_method: 'bank_transfer',
    payment_status: 'paid',
    subtotal: 5390000,
    discount_amount: 50000,
    shipping_fee: 0,
    total_amount: 5340000,
    coupon_code: 'WELCOME50K',
    status: 'shipping',
    stock_restocked: false,
    created_at: '2026-10-16T14:15:00Z',
    items: [
      {
        id: 2,
        product_id: 17,
        product_name: 'Tai nghe Apple AirPods Pro 2 MagSafe (USB-C) Chính Hãng',
        product_sku: 'AIRPODS-PRO-2-USBC',
        unit_price: 5390000,
        quantity: 1,
        subtotal: 5390000
      }
    ]
  },
  {
    id: 3,
    order_code: 'TZ-20261017-003',
    user_id: 3,
    recipient_name: 'Trần Minh Quân',
    phone: '0912345678',
    email: 'tranminh@gmail.com',
    shipping_address: 'Số 18 Hoàng Cầu, Đống Đa, Hà Nội',
    notes: 'Hàng giá trị cao xin cẩn thận',
    payment_method: 'cod',
    payment_status: 'unpaid',
    subtotal: 46490000,
    discount_amount: 0,
    shipping_fee: 0,
    total_amount: 46490000,
    coupon_code: null,
    status: 'pending',
    stock_restocked: false,
    created_at: '2026-10-17T08:00:00Z',
    items: [
      {
        id: 3,
        product_id: 4,
        product_name: 'MacBook Pro 14 M3 Pro 18GB/512GB Space Black',
        product_sku: 'MBP14-M3P',
        unit_price: 46490000,
        quantity: 1,
        subtotal: 46490000
      }
    ]
  },
  {
    id: 4,
    order_code: 'TZ-20261014-004',
    user_id: 4,
    recipient_name: 'Lê Thị Thu Thảo',
    phone: '0934567890',
    email: 'thuthao@gmail.com',
    shipping_address: 'Số 88 Trần Phú, Quận Hải Châu, TP. Đà Nẵng',
    notes: 'Hủy do đổi sang mẫu khác',
    payment_method: 'cod',
    payment_status: 'unpaid',
    subtotal: 10890000,
    discount_amount: 0,
    shipping_fee: 0,
    total_amount: 10890000,
    coupon_code: null,
    status: 'cancelled',
    stock_restocked: true,
    created_at: '2026-10-14T11:20:00Z',
    items: [
      {
        id: 4,
        product_id: 10,
        product_name: 'Màn hình Dell UltraSharp U2724D 27 inch 2K IPS Black 120Hz',
        product_sku: 'DELL-U2724D',
        unit_price: 10890000,
        quantity: 1,
        subtotal: 10890000
      }
    ]
  }
];

export const INITIAL_REVIEWS: ReviewData[] = [
  {
    id: 1,
    product_id: 1,
    user_id: 2,
    author_name: 'Nguyễn Văn An',
    rating: 5,
    comment: 'Máy đẹp xuất sắc, viền màn hình siêu mỏng, nút camera control dùng rất thích. Đóng gói cẩn thận và giao nhanh.',
    created_at: '2026-10-15T16:00:00Z'
  },
  {
    id: 2,
    product_id: 4,
    user_id: 3,
    author_name: 'Trần Minh Quân',
    rating: 5,
    comment: 'M3 Pro chạy Docker và Xcode mượt mà, máy chạy mát rượi cả ngày, pin dùng được 14 tiếng liên tục.',
    created_at: '2026-10-16T10:30:00Z'
  },
  {
    id: 3,
    product_id: 10,
    user_id: 4,
    author_name: 'Lê Thị Thu Thảo',
    rating: 5,
    comment: 'Màn hình Dell UltraSharp màu sắc chuẩn xác, tấm nền IPS Black tương phản sâu rất đáng tiền cho dân thiết kế.',
    created_at: '2026-10-15T11:00:00Z'
  },
  {
    id: 4,
    product_id: 16,
    user_id: 2,
    author_name: 'Nguyễn Văn An',
    rating: 5,
    comment: 'Chống ồn của Sony XM5 phải nói là đỉnh nhất hiện nay, đeo rất êm không bị bí tai.',
    created_at: '2026-10-16T17:45:00Z'
  }
];
