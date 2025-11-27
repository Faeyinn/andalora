// ============================================================================
// DATABASE TYPES
// ============================================================================

export type User = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  university: string;
  nim: string; // Nomor Induk Mahasiswa (unique)
  role: "admin" | "user";
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type ListingPlan = {
  id: string;
  name: string;
  duration_days: number;
  price: number;
  description?: string;
  is_active: boolean;
  created_at: string;
};

export type ProductStatus = "pending_payment" | "active" | "expired" | "sold";
export type ProductCondition = "baru" | "seperti baru" | "bekas baik" | "bekas";

export type Product = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category_id?: string;
  condition: ProductCondition;
  status: ProductStatus;
  images: string[];
  listing_plan_id?: string;
  listing_expires_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: User;
  category?: Category;
  listing_plan?: ListingPlan;
};

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled";

export type ListingPayment = {
  id: string;
  product_id: string;
  user_id: string;
  listing_plan_id: string;
  amount: number;
  status: PaymentStatus;
  payment_method: string;
  midtrans_order_id?: string;
  midtrans_transaction_id?: string;
  midtrans_snap_token?: string;
  paid_at?: string;
  created_at: string;
  // Joined data
  product?: Product;
  listing_plan?: ListingPlan;
};

export type Favorite = {
  id: string;
  user_id?: string;
  product_id: string;
  session_id?: string;
  created_at: string;
  // Joined data
  product?: Product;
};

export type NotificationType =
  | "listing_approved"
  | "listing_expiring"
  | "listing_expired"
  | "product_sold"
  | "payment_success"
  | "payment_failed";

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  related_product_id?: string;
  created_at: string;
  // Joined data
  product?: Product;
};

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export type SignupRequest = {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  university: string;
  nim: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  session: {
    access_token: string;
    refresh_token: string;
  };
};

export type CreateProductRequest = {
  title: string;
  description: string;
  price: number;
  category_id: string;
  condition: ProductCondition;
  images: string[];
};

export type UpdateProductRequest = Partial<CreateProductRequest>;

export type CreatePaymentRequest = {
  product_id: string;
  listing_plan_id: string;
};

export type ProductsQuery = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  condition?: ProductCondition;
  min_price?: number;
  max_price?: number;
  sort?: "newest" | "price_low" | "price_high";
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type GuestSession = {
  session_id: string;
  created_at: string;
};
