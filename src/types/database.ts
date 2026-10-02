export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  description: string;
  short_description: string;
  price: number; // Outright price
  sale_price?: number | null; // Discounted outright price
  monthly_price: number; // Subscription price / month (THB)
  main_image: string;
  status: 'active' | 'inactive';
  is_featured: boolean;
  is_promotion: boolean;
  badge?: string; // e.g. "ขายดีอันดับ 1", "โปรโมชั่น", "สินค้าใหม่"
  sort_order: number;
  specifications: Record<string, string>;
  highlights: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  icon?: string;
  sort_order: number;
  status: 'active' | 'inactive';
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_url: string;
  sort_order: number;
  status: 'active' | 'inactive';
  badge?: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  dealer_name: string;
  dealer_code: string;
  phone: string;
  line_url: string;
  line_id: string;
  agent_line_url?: string;
  agent_line_id?: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  logo_url: string;
  footer_text: string;
  dealer_disclaimer: string;
  working_hours: string;
  announcement?: string;
}

export interface Inquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_line?: string;
  product_id?: string;
  product_name?: string;
  plan_type: 'subscription' | 'outright' | 'consult' | 'agent';
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'phone' | 'line' | 'product';
    label: string;
    payload?: string;
  };
}
