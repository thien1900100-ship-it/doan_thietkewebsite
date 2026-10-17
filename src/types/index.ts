export interface Product {
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
  specs: Record<string, string>;
  is_featured: boolean;
  is_new: boolean;
  status: 'active' | 'hidden' | 'out_of_stock';
  rating: number;
  review_count: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  display_order: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  country: string;
  logo: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
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
  items: OrderItem[];
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Coupon {
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

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'customer' | 'admin';
  created_at?: string;
}

export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  low_stock_products: Product[];
  recent_orders: Order[];
  orders_by_status: {
    pending: number;
    confirmed: number;
    shipping: number;
    delivered: number;
    cancelled: number;
  };
  monthly_revenue: { month: string; revenue: number }[];
}
