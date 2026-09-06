export type ProductStatus = 'Active' | 'Inactive' | 'Out of Stock';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  previous_price?: number | null;
  discount?: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  status: ProductStatus;
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  order_id: string; // e.g. SBB-10001
  customer_name: string;
  phone: string;
  alternative_phone?: string;
  division: string;
  district: string;
  upazila: string;
  area?: string;
  address: string;
  delivery_note?: string;
  
  // Historical Snapshot fields
  product_id: string;
  product_name_snapshot: string;
  product_image_snapshot: string;
  selected_size?: string;
  selected_color?: string;
  quantity: number;
  product_price_snapshot: number;
  delivery_charge: number;
  total: number;
  payment_method: 'Cash on Delivery';
  status: OrderStatus;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  logo?: string;
  contact_number: string;
  email: string;
  store_address: string;
  social_facebook?: string;
  social_instagram?: string;
  social_youtube?: string;
  delivery_inside_dhaka: number;
  delivery_dhaka_suburbs: number;
  delivery_outside_dhaka: number;
  banner_title: string;
  banner_subtitle: string;
  banner_badge: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  selected_size?: string;
  selected_color?: string;
  quantity: number;
}
