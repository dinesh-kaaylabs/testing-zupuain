export interface ApiResponse<T = any> {
  [x: string]: any;
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

type BaseEntity = {
  creation_date: string;
  modified_date: string;
};

export interface Tenant extends BaseEntity {
  tenant_id: number;
  tenant_uid: string;
  tenant_mode: string;
  tenant_name: string;
  website_name?: string;
  admin_url: string;
  customer_url: string;
  domain_type: string;
  business_name: string;
  business_type?: string;
  secret_identifier: string;
  kl_gateway_api_key: string;
  market_place_vendor?: string;
  last_login?: string;
  subscription_expired?: number;
  subscription_end_date?: string;
  setting?: TenantSetting;
}

export interface StateDetails extends BaseEntity {
  id: number;
  state_name: string;
  is_active: boolean;
}

export interface DistrictDetails {
  district_name: string;
  district_id: number;
}

export interface TenantSetting extends BaseEntity {
  id: number;
  owner_name: string;
  business_name: string;
  email_address: string;
  notification_sender_email: string;
  business_type?: string;
  phone: string;
  website_url?: string;
  address_1: string;
  address_2: string;
  city?: number;
  state_id?: number;
  currency: string;
  currency_locale: string;
  grid_view?: boolean;
  list_view?: boolean;
  social_login: boolean;
  fresh_chat: boolean;
  date_format: string;
  brand_logo: string;
  admin_logo: string;
  admin_logo_e_tag: string;
  admin_logo_name: string;
  login_image: string;
  login_image_e_tag: string;
  login_image_name: string;
  otp_image: string;
  otp_image_e_tag?: string;
  otp_image_name?: string;
  logo_e_tag: string;
  logo_name: string;
  favicon_image_name: string;
  favicon_image: string;
  favicon_e_tag: string;
  login_background_image: string;
  background_image_e_tag: string;
  background_image_name: string;
  deliveryslot_management_active: boolean;
  deliveryslot_max_day: number;
  deliveryslot_max_day_is_active: boolean;
  deliveryslot_order_processing_time: string;
  deliveryslot_order_processing_time_is_active: boolean;
  max_orders_per_slot_is_active: boolean;
  max_orders_per_slot?: number | null;
  low_stock_label_is_active: boolean;
  low_stock_label_limit: number;
  country: string;
  pincode?: string;
  international_city?: string;
  international_state?: string;
  country_code?: string;
  address?: string;
  quick_links?: string;
  logo_tag_link?: string;
  newsletter_is_active: boolean;
  product_reservation_timeout: number;
  google_analytics_key?: string | null;
  google_tag_id?: string | null;
  google_analytics_status?: string | null;
  cashfree_api_id: string;
  cashfree_secret_key: string;
  theme_id?: number | null;
  razorpay_public_token: string;
  razorpay_access_token: string;
  delivery_charge: number;
  cod_charge: number;
  closed_store_message?: string;
  property_id?: string | null;
  paypal_client_id?: string;
  paypal_client_secret?: string;
  phonepe_merchant_id: string;
  phonepe_client_id?: string;
  phonepe_salt_key: string;
  phonepe_access_token?: string;
  phonepe_token_expire?: string | null;
  publish_key?: string | null;
  secret_key?: string | null;
  phonepe_salt_index?: number;
  domain_status?: string | null;
  authorised_domain?: string | null;
  facebook_pixel_id?: string | null;
  google_adsense_id?: string | null;
  tenant_uid: string;
  phone_number?: string;
  payu_merchant_key?: string;
  payu_salt_key?: string;
  is_enable_product_review: boolean;
  is_enable_order_notes: boolean;
  is_enable_order_documents: boolean;
  state_details?: StateDetails;
  district_details?: DistrictDetails;
}

export interface Store extends BaseEntity {
  store_id: number;
  store_uid: string;
  store_name: string;
  address_1: string;
  address_2: string;
  latitude: number;
  longitude: number;
  image: string;
  image_e_tag?: string;
  image_name: string;
  store_person_name: string;
  store_person_number: string;
  store_location: string;
  district: string;
  subdistrict: number;
  state: string;
  pincode: string;
  country_code: string;
  created_by?: string;
  modified_by?: string;
  international_state: string;
  international_city: string;
  international_code: string;
  is_central: boolean;
  store_delivery_pin: boolean;
  is_store_open: boolean;
  gst_number?: string;
  tenant_uid: string;
  is_one_store_enable: boolean;
  offline_start_time_stamp?: string;
  offline_end_time_stamp?: string;
  offline_color?: string;
  offline_message?: string;
  deletedAt?: string;
}

export interface Category {
  category_id: number;
  category_uid: string;
  category_name: string;
  name: string;
  image: string;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_custom_path?: string | null;
  seo_preview_image?: string | null;
  is_active: boolean;
  banner_image?: string | null;
  banner_title?: string | null;
  banner_description?: string | null;
  product_category_count: number;
  sub_category?: SubCategory[];
}

export interface SubCategory {
  category_uid: string;
  image?: string | null;
  sub_category_name: string;
  sub_category_uid: string;
  seo_custom_path?: string | null;
  is_active: boolean;
  product_sub_category_count: number;
}

export interface Product {
  product_id: number;
  product_uid: string;
  product_name: string;
  clic_description?: string | null;
  product_brand?: string | null;
  category_uid: string;
  sub_category_uid?: string | null;
  gst?: number | null;
  product_code?: string | null;
  upc?: string | null;
  key_features?: string | null;
  shelf_life?: string | null;
  manufacturer_details?: string | null;
  marketed_by?: string | null;
  country_of_origin?: string | null;
  seller?: string | null;
  description?: string | null;
  product_status: boolean;
  track_inventory: boolean;
  low_stock_level?: number | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_custom_path?: string | null;
  text_content?: string | null;
  seo_preview_image?: string | null;
  tenant_uid: string;
  tenant_mode: string;
  price: string;
  mrp?: string | null;
  discount?: string | null;
  discount_amount?: number | null;
  making_charge?: string | null;
  weight?: string | null;
  product_price_type: string;
  price_consistency_type?: string | null;
  min_order_quantity?: number | null;
  requires_prescription?: boolean;
  stock?: string | null;
  product_image: ProductImage[];
  product_variants: ProductVariant[];
  product_ratings: ProductRating[];
  variant_option: VariantOption[];
  coupon?: Coupon | null;
  zm_category?: Category;
  zm_sub_category?: SubCategory;
  path_name?: string;
}

export interface ProductImage extends BaseEntity {
  product_image_id: number;
  product_uid: string;
  product_image: string;
  e_tag: string;
  name: string;
  position: number;
  image_source: string;
  tenant_uid: string;
  deletedAt?: string;
}

export interface ProductVariant {
  id: string;
  product_uid: string;
  order_key: number;
  stock?: string | null;
  variant_attributes: VariantAttribute[];
  creation_date?: string;
  modified_date?: string;
}

export interface VariantAttribute {
  attribute_value: string | number;
  attribute_id: number;
  description?: string | null;
  zm_attribute: {
    name: string;
    data_type: string;
  };
}

export interface VariantOption {
  option_id: number;
  option_uid: string;
  slug?: string | null;
  option_name: string;
  product_uid: string;
  tenant_uid: string;
  order: number;
  creation_date: string;
  modified_date: string;
  deletedAt?: string | null;
  variant_option_values: VariantOptionValue[];
}

export interface VariantOptionValue {
  option_value_id: number;
  option_value_uid: string;
  option_uid: string;
  option_value: string;
  product_uid?: string | null;
  order_key: number;
  creation_date: string;
  modified_date: string;
  deletedAt?: string | null;
}

export interface ProductRating extends BaseEntity {
  id: number;
  rating_uid: string;
  product_uid: string;
  order_uid: string;
  user_uid: string;
  customer_review: string;
  customer_name: string;
  title: string;
  ratings: number;
  creation_date: string;
  modified_date: string;
  review_images?: ReviewImage[];
}

export interface ReviewImage extends BaseEntity {
  id: number;
  rating_uid: string;
  product_uid: string;
  order_uid: string;
  user_uid: string;
  review_image: string;
}

export interface RelatedProduct extends BaseEntity {
  related_product_id: number;
  related_product_uid: string;
  product_uid: string;
  mapping_product_uid: string;
  tenant_uid: string;
  deletedAt?: string;
  zm_product: Product;
}

export interface CartItem {
  product_uid: string;
  product_count: number;
  price: string;
  mrp: string;
  product_name: string;
  product_image: string;
  track_inventory: boolean;
  product_status: boolean;
  category_uid: string;
  min_order_quantity?: number;
  stock?: number;
  product_variant_id?: string;
  product_variant_text?: string;
}

export interface Bag extends BaseEntity {
  bag_id: number;
  bag_uid: string;
  order_uid?: string;
  user_uid: string;
  store_uid: string;
  tenant_uid: string;
  slug: string;
  bag_details: BagDetail[];
}

export interface BagDetail extends BaseEntity {
  bag_detail_id: number;
  bag_uid: string;
  product_uid: string;
  product_variant_id?: number;
  product_count: number;
  units: string;
  product_price: number;
  mrp_price: number;
  selling_price: number;
  discount_percent: number;
  product_gst?: number;
  pos_checkout_quantity?: number;
  active: boolean;
  tenant_uid: string;
  zm_products: Product[];
}

export interface User {
  user_uid: string;
  user_name: string;
  email_address: string;
  phone_number: string;
  role: {
    id: number;
    role: string;
    slug: string;
    creation_date: string;
    modified_date: string;
  };
  store?: any;
  tenant: Tenant;
}

export interface Address extends BaseEntity {
  b2c_address_id: string;
  b2c_address_uid: string;
  user_uid: string;
  address_tag: string;
  address?: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  complete_address: string;
  tenant_uid: string;
  deletedAt?: string;
}

export interface Coupon {
  coupon_id: string;
  coupon_uid: string;
  coupon_percentage: number | null;
  is_active: boolean;
  image?: string | null;
  e_tag?: string | null;
  image_name?: string | null;
  coupon_code: string;
  description: string;
  coupon_validity: string; // "Unlimited" | "Number of times"
  expiry_date: string;
  start_date: string;
  coupon_type_id?: number | null;
  number_of_times?: number | null; // Total usage limit (null means unlimited)
  valid_till_user: number; // Per user usage limit
  discount_offer: number; // Minimum order value for amount-cut-off, or discount value
  order_coupon_count?: number | null;
  user_uid?: string | null;
  coupon_discount_type?: string | null; // "Value" | "null" (string literal)
  coupon_type: 'amount-cut-off' | 'free-shipping' | 'coupon-on-specific';
  target_selection?: 'Category' | 'Product' | null;
  maximum_discount_amount: number | null; // Maximum discount cap
  created_by?: string | null;
  modified_by?: string | null;
  is_online_payment: boolean;
  tenant_uid: string;
  user_coupon_count: number; // Current user's usage count
  coupon_details: CouponDetail[]; // Contains eligible products/categories
}

export interface CouponDetail {
  id: number;
  coupon_product_uid: string;
  coupon_id: string;
  product_coupon_uid: string; // Product UID or Category UID
  creation_date: string;
  modified_date: string;
  deletedAt?: string | null;
}

export interface PaymentMethod extends BaseEntity {
  payment_method_id: string;
  method_name: string;
  slug: string;
  is_active: boolean;
  is_verified: boolean;
  is_proof: boolean;
  signup_url: string;
  description: string;
  merchant_name?: string;
  upi_id?: string;
  account_name?: string;
  account_number?: string;
  bank_branch?: string;
  ifsc_code?: string;
  tenant_uid: string;
}

export interface DeliverySlot {
  id: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  day_uid: string;
  delivery_time?: string;
  order_count?: number;
  delivery_date?: string;
  delivery_slot_id?: number;
  max_orders_per_slot?: number;
  delivery_charge?: number;
  dayName?: string;
}

export interface DeliveryDay {
  id: number;
  day_uid: string;
  day_name: string;
  is_active: boolean;
  delivery_slots: DeliverySlot[];
}

export interface DeliveryCharge {
  delivery_charge: number;
}

export interface Order extends BaseEntity {
  order_hdr_id: number;
  order_id: string;
  order_serial_number: string; // For display purposes
  order_uid: string;
  order_number: string;
  order_price: number;
  delivery_charge: number;
  delivery_date?: string;
  delivery_time?: string;
  delivery_address_id: string;
  total_price: number;
  milestone_id: number;
  milestone_code: string;
  store_uid: string;
  modified_by: string;
  milestone_description: string;
  customer_type_id: number;
  customer_type: string;
  product_name: string;
  order_product_count: number;
}

export interface OrderProduct extends BaseEntity {
  order_hdr_id: number;
  order_details_id: number;
  order_id: string;
  order_uid: string;
  order_number: string;
  tenant_uid: string;
  product_id: number;
  product_uid: string;
  product_image: string;
  product_name: string;
  product_variant_id?: number;
  product_count: number;
  product_price: number;
  units: string;
  product_discount_percent: number;
  product_discount_amount: number;
  mrp_price?: number;
  selling_price: number;
  product_gst_percent?: number;
  product_gst_amount: number;
  product_code: string;
}

export interface OrderSummary extends BaseEntity {
  order_hdr_id: number;
  order_details_id: number;
  order_id: string;
  order_uid: string;
  order_number: string;
  order_serial_number: string;
  tenant_uid: string;
  order_price: number;
  total_price: number;
  delivery_charge: number;
  cod_charge?: number;
  order_discount_amount: number;
  order_discount_percent: number;
  order_gst_amount: number;
}

export interface OrderTimeline extends BaseEntity {
  order_timeline_id: number;
  order_uid: string;
  milestone_id: number;
  created_by: string;
  tenant_uid: string;
  zm_milestone: {
    milestone_id: number;
    isid: number;
    application_type: string;
    milestone_transaction: string;
    sequence: number;
    milestone_code: string;
    milestone_description: string;
    created_by?: string;
    modified_by?: string;
    creation_date: string;
    modified_date: string;
  };
}

export interface OrderUserDetails extends BaseEntity {
  order_hdr_id: number;
  order_id: string;
  order_uid: string;
  order_number: string;
  tenant_uid: string;
  delivery_address_id: string;
  user_name: string;
  phone_number: string;
  address?: string; // address
  user_uid: string;
  country_code: string;
  customer_location?: string; // address for display purposes
  complete_address: string; // address for display purposes
  state: string;
  country: string;
  city: string;
  pincode: string;
  payment_method: string;
  payment_method_slug: string;
  payment_method_id: string;
}

export interface NewsletterSubscriber extends BaseEntity {
  newsletter_subscriber_uid: string;
  status: string;
  newsletter_subscriber_id: number;
  email: string;
  tenant_uid: string;
}

export interface Wishlist extends BaseEntity {
  wishlist_id: number;
  wishlist_uid: string;
  user_uid: string;
  product_uid: string;
  product_variant_id: number | null;
  tenant_uid: string;
  store_uid: string;
  deletedAt: string | null;
  zm_products: Product[];
}

export interface WishlistResponse extends ApiResponse<Wishlist[]> {
  count: number;
}

export interface ProductDetailsResponse {
  success: boolean;
  rows: Product[];
  count: number;
}

export type UserCoupon = Coupon;
export type OrderListItem = Order;
export type OrderTimelineItem = OrderTimeline;
export type CreateOrderResponse = {
  urlLink: string;
  order_uid: string;
  success: boolean;
  data: any
};

export interface DefaultImageData extends BaseEntity {
  id: number;
  brand_logo: string;
  admin_logo: string;
  login_image: string;
  otp_image: string;
  favicon_image: string;
  login_background_image: string;
  seo_default_image: string;
  seo_Prod_Cat_default_image: string;
}

export interface TenantApiResponse {
  success: boolean;
  data: {
    tenant_id: number;
    tenant_uid: string;
    tenant_mode: string;
    tenant_name: string;
    website_name: string | null;
    admin_url: string;
    customer_url: string;
    domain_type: string;
    business_name: string;
    business_type: string | null;
    secret_identifier: string;
    kl_gateway_api_key: string;
    market_place_vendor: string;
    last_login: string;
    subscription_expired: string | null;
    subscription_end_date: string | null;
    creation_date: string;
    modified_date: string;
    setting: TenantSetting;
    zupain_select_customer_url: string;
    select_url: string;
    WhatsAppAPI: string;
    report_url: string;
    api_key: string;
    client_id: string;
    scope: string;
    google_photos_client_id: string;
    client_secret: string;
    google_photos_scopes: string;
    google_spreadsheet_client_id: string;
  };
  defaultImageData: DefaultImageData;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface CreateOrderUserBagItem {
  product_uid: string;
  stock: string | null;
  product_count: number;
  price: string;
  track_inventory: boolean;
  product_status: boolean;
  category_uid: string;
  min_order_quantity: number | null;
}

export interface CreateOrderBodyRequest extends Record<string, unknown> {
  cod_charge: number;
  coupon_amount: number;
  delivery_charge: number;
  discount_amount: boolean;
  discount_percent: number;
  final_price: number;
  price: number;
  slugData: string;
  userBag: CreateOrderUserBagItem[];
  buyer_gst_number?: string | null;
  checkout_flag: number;
  customer_type_id: number;
  dayName: string;
  delivery_address_id: string;
  delivery_date: string;
  delivery_time: string;
  order_notes?: string | null;
  payment_method_id: string;
  secured: boolean;
  slug: string;
  store_uid: string;
}

export interface DecodedOrderData {
  orderId: string;
  txStatus: string;
  order_uid: string;
  order_price: number;
  slug: string;
  slugData: string;
  products: Array<{
    product_uid: string;
    id: number | null;
    stock: number | null;
    product_count: number;
    track_inventory: boolean;
    product_status: boolean;
  }>;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, handler: () => void): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

