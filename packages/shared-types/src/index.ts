// ==========================================
// User & Auth
// ==========================================
export type UserRole = 'customer' | 'support' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'suspended';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

// ==========================================
// Products & Versions
// ==========================================
export type ProductType = 'cbot' | 'indicator' | 'bundle';
export type PlatformType = 'ctrader' | 'metatrader5' | 'tradingview';
export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  product_type: ProductType;
  platform: PlatformType;
  version: string;
  status: ProductStatus;
  download_file_path?: string | null;
  features?: string[];
  supported_symbols?: string[];
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVersion {
  id: string;
  product_id: string;
  version: string;
  release_notes: string;
  download_file_path: string;
  minimum_supported_version?: string | null;
  status: 'active' | 'deprecated' | 'archived';
  created_at: string;
}

// ==========================================
// Plans & Pricing
// ==========================================
export type BillingInterval = 'monthly' | 'quarterly' | 'semi_annual' | 'yearly' | 'lifetime';

export interface Plan {
  id: string;
  name: string;
  billing_interval: BillingInterval;
  duration_days: number;
  description?: string;
  active: boolean;
}

export interface ProductPlan {
  id: string;
  product_id: string;
  plan_id: string;
  price: number;
  currency: string;
  max_accounts: number;
  active: boolean;
  plan?: Plan;
  product?: Product;
}

// ==========================================
// Bundles & Memberships
// ==========================================
export interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  active: boolean;
  products?: Product[];
}

export interface Membership {
  id: string;
  name: string;
  price: number;
  billing_interval: BillingInterval;
  active: boolean;
  products?: Product[];
}

// ==========================================
// Orders & Payments
// ==========================================
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
  paid_at?: string | null;
  items?: OrderItem[];
  profile?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_plan_id: string;
  quantity: number;
  unit_price: number;
  currency: string;
  product?: Product;
  product_plan?: ProductPlan;
}

export interface PaymentEvent {
  id: string;
  provider: string;
  provider_event_id: string;
  order_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  processed_at?: string | null;
  created_at: string;
}

// ==========================================
// Subscriptions
// ==========================================
export type SubscriptionStatus = 'pending' | 'active' | 'past_due' | 'expired' | 'cancelled' | 'refunded';

export interface Subscription {
  id: string;
  user_id: string;
  order_id: string;
  product_plan_id: string;
  status: SubscriptionStatus;
  start_at: string;
  expires_at: string;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
  product_plan?: ProductPlan;
  order?: Order;
  profile?: Profile;
}

// ==========================================
// Trading Accounts
// ==========================================
export type TradingEnvironment = 'demo' | 'live';
export type AccountVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface TradingAccount {
  id: string;
  user_id: string;
  broker: string;
  account_number: string;
  environment: TradingEnvironment;
  verification_status: AccountVerificationStatus;
  verified_at?: string | null;
  created_at: string;
}

// ==========================================
// Licenses
// ==========================================
export type LicenseStatus = 'pending' | 'active' | 'suspended' | 'expired' | 'revoked';

export interface License {
  id: string;
  subscription_id: string;
  product_id: string;
  trading_account_id?: string | null;
  license_key_hash: string;
  license_key_prefix: string;
  status: LicenseStatus;
  issued_at: string;
  expires_at: string;
  revoked_at?: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
  trading_account?: TradingAccount;
  subscription?: Subscription;
}

// ==========================================
// Entitlements
// ==========================================
export type EntitlementSourceType = 'subscription' | 'bundle' | 'membership' | 'manual';
export type EntitlementStatus = 'active' | 'expired' | 'revoked';

export interface Entitlement {
  id: string;
  user_id: string;
  product_id: string;
  source_type: EntitlementSourceType;
  source_id: string;
  status: EntitlementStatus;
  starts_at: string;
  expires_at: string;
  created_at: string;
  product?: Product;
}

// ==========================================
// License Validation API & Monitoring
// ==========================================
export interface LicenseValidationRequest {
  product_id: string;
  license_key: string;
  account_number: string;
  broker: string;
  environment: TradingEnvironment;
  instance_id: string;
  app_version: string;
}

export interface LicenseValidationSuccessResponse {
  valid: true;
  status: LicenseStatus;
  product_id: string;
  expires_at: string;
  server_time: string;
  cache_until: string;
  signature: string;
}

export type LicenseErrorCode =
  | 'INVALID_LICENSE'
  | 'LICENSE_EXPIRED'
  | 'LICENSE_REVOKED'
  | 'LICENSE_SUSPENDED'
  | 'ACCOUNT_MISMATCH'
  | 'PRODUCT_MISMATCH'
  | 'SUBSCRIPTION_INACTIVE'
  | 'API_UNAVAILABLE'
  | 'INVALID_SIGNATURE'
  | 'RATE_LIMITED';

export interface LicenseValidationFailureResponse {
  valid: false;
  code: LicenseErrorCode;
  message: string;
}

export type LicenseValidationResponse = LicenseValidationSuccessResponse | LicenseValidationFailureResponse;

export interface HeartbeatRequest {
  product_id: string;
  license_key: string;
  account_number: string;
  instance_id: string;
  app_version: string;
}

export interface HeartbeatResponse {
  valid: boolean;
  status: LicenseStatus;
  server_time: string;
  cache_until: string;
  signature?: string;
}

export interface BotInstance {
  id: string;
  license_id: string;
  instance_id: string;
  app_version: string;
  last_seen_at: string;
  status: 'online' | 'offline' | 'idle';
  created_at: string;
}

export interface LicenseEvent {
  id: string;
  license_id: string;
  event_type: 'validate' | 'heartbeat' | 'activate' | 'deactivate' | 'reject';
  ip_address?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string | null;
  action: string;
  resource_type: string;
  resource_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  actor?: Profile;
}

