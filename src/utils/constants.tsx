export const LIMITS = {
  FEATURED: 8,
  BEST_SELLER: 8,
  DEFAULT: 10,
  INITIAL_OFFSET: 1
} as const;

export const DEFAULTS = {
  SORT_BY: 'creation_date-desc',
  SORT_BY_BEST_SELLERS: 'creation_date-asc',
  AVAILABILITY: 'all',
  APP_TYPE: 'B2C',
  CURRENCY: '₹',
  CURRENCY_LOCALE: 'en-IN',
  CURRENCY_NAME: 'INR',
  LOW_STOCK_THRESHOLD: 10,
  PLACEHOLDER_IMAGE: '/placeholder-image.jpg',
  MAX_PRODUCT_NAME_LENGTH: 50,
  CHECKOUT_MILESTONE_CODE: 'CHK',
  RAZOR_PAYMENT_FAILED_MESSAGE: 'Payment failed. Try different Payment method. If money deducted it will be auto refunded.',
} as const;

export const PRODUCT_OPTIONS = {
  SORT: [
    { label: "Alphabetically, A-Z", value: "product_name-asc" },
    { label: "Alphabetically, Z-A", value: "product_name-desc" },
    { label: "Price, low to high", value: "price-asc" },
    { label: "Price, high to low", value: "price-desc" },
    { label: "Date, old to new", value: "creation_date-asc" },
    { label: "Date, new to old", value: "creation_date-desc" },
  ],
  STOCK: [
    { label: "All products", value: "all" },
    { label: "In stock", value: "in_stock" },
    { label: "Low stock", value: "low_stock" },
    { label: "Out of stock", value: "out_stock" },
  ]
} as const;

export const FEATURED_PRODUCTS_LIMIT = LIMITS.FEATURED;
export const BEST_SELLER_PRODUCTS_LIMIT = LIMITS.BEST_SELLER;
export const DEFAULT_LIMIT = LIMITS.DEFAULT;
export const INITIAL_OFFSET = LIMITS.INITIAL_OFFSET;
export const DEFAULT_SORT_BY = DEFAULTS.SORT_BY;
export const DEFAULT_SORT_BY_BEST_SELLERS = DEFAULTS.SORT_BY_BEST_SELLERS;
export const DEFAULT_AVAILABILITY = DEFAULTS.AVAILABILITY;
export const DEFAULT_APP_TYPE = DEFAULTS.APP_TYPE;
export const PRODUCT_VIEW_SORT_OPTIONS = PRODUCT_OPTIONS.SORT;
export const PRODUCT_VIEW_STOCK_AVAILABILITY = PRODUCT_OPTIONS.STOCK;
export const MAX_PRODUCT_NAME_LENGTH = DEFAULTS.MAX_PRODUCT_NAME_LENGTH;

// Profile field configuration
export const PROFILE_FIELDS = [
  { key: 'user_name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', editable: true },
  { key: 'email_address', label: 'Email Address', type: 'email', placeholder: 'Enter your email', editable: true },
  { key: 'phone_number', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number', editable: false },
] as const;

// Address configuration
export const ADDRESS_TAGS = ['Home', 'Office', 'Other'] as const;

export const ADDRESS_TAG_COLORS: Record<string, string> = {
  home: 'bg-green-100 text-green-800 border-green-200',
  office: 'bg-blue-100 text-blue-800 border-blue-200',
  work: 'bg-blue-100 text-blue-800 border-blue-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

// Order status configuration
export const ORDER_STATUS_COLORS: Record<string, string> = {
  delivered: 'bg-green-100 text-green-800 border-green-200',
  shipped: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  confirmed: 'bg-purple-100 text-purple-800 border-purple-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'processing', label: 'Processing' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export const ORDER_SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'status', label: 'Status' },
] as const;
