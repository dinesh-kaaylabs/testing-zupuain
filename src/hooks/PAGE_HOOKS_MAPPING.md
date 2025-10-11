# Page-to-Hooks Mapping Reference

This document provides a clear mapping of which hooks should be used for each page/component in the application.

---

## 1. Home Page (`HomePage.tsx`)

### Main Page
- `useFeaturedProducts()` → Featured products section
- `useFeaturedCategories()` → Category grid
- `useBestSellers()` → Best sellers carousel
- `useProductUtils()` → Format product/category data
- `useCartActions()` → { handleAddToCart } for adding to cart
- `useWishlistActions()` → { isInWishlist, handleToggleWishlist } for wishlist
- `useAppSelector(state => state.newsletter)` → Newsletter state
- `useAppDispatch()` → Dispatch newsletter subscription

### Components
**HeroSection.tsx**
- Local state only (carousel management)

**FeaturedCategories.tsx**
- `useFeaturedCategories()` → Get categories
- Local formatting or `useCategoryDisplayData(category)` for single category

**CategoryCard.tsx**
- `useMemo` → Format individual category

**FeaturedProducts.tsx**
- `useFeaturedProducts()` → Get products
- `useProductUtils()` → Format products (NO tenant param)
- `useCartActions()` → Add to cart
- `useWishlistActions()` → Toggle wishlist

**BestSellers.tsx**
- `useBestSellers()` → Get best sellers
- `useProductUtils()` → Format products
- `useCartActions()` → Add to cart
- `useWishlistActions()` → Toggle wishlist

**NewsletterSignup.tsx**
- `useAppDispatch()` → Subscribe action
- `useAppSelector()` → Newsletter state
- Local state for email input

---

## 2. Product List Page (`ProductListPage.tsx`)

### Main Page
- `useProductList()` → **PRIMARY HOOK** - ALL functionality
  - Products data
  - Search with debounce
  - Filters (category, subcategory, availability)
  - Sort options
  - Pagination
  - Infinite scroll
  - View mode (grid/list)
- `useProductUtils()` → Format products (NO tenant param)
- `useCartActions()` → Add to cart
- `useWishlistActions()` → Wishlist management
- `useLocalStorage("product-view-mode", "grid")` → Persist view mode

### Components
**ProductGrid.tsx**
- Receives props from parent (no hooks)

**FilterSidebar.tsx**
- Receives filter state/handlers from `useProductList()`

**ProductCard.tsx**
- Receives product data and handlers as props

**Pagination.tsx**
- Receives page state/handlers from `useProductList()`

**InfiniteScroll.tsx**
- `useIntersectionObserver()` → Detect scroll
- Receives loadMore handler from `useProductList()`

---

## 3. Product Details Page (`ProductDetailsPage.tsx`)

### Main Page
- **⚠️ CRITICAL**: `useProductDetails()` takes NO parameters - uses `useParams()` internally
- Returns: `{ product, reviews, relatedProducts, loading, error, averageRating, totalReviews, refetch }`
- `useProductUtils()` → Format product data (NO tenant param)
- `useCartActions()` → Add to cart
- `useWishlistActions()` → Toggle wishlist
- `useAppSelector(state => state.tenant.defaultTenant)` → Tenant config (if needed elsewhere)
- `useAppSelector(state => state.product.categories)` → For breadcrumb

### Components
**ProductGallery.tsx**
- Local state for image viewer, zoom, navigation

**ProductInfo.tsx**
- Receives product data as props

**PurchaseSection.tsx**
- `useCartActions()` → Add to cart
- `useWishlistActions()` → Toggle wishlist
- Local state for quantity

**ProductTabs.tsx**
- Local state for active tab

**ReviewSection.tsx**
- Receives reviews from parent
- Local state for review form

**RelatedProducts.tsx**
- `useProductUtils()` → Format related products
- `useCartActions()` → Quick add to cart
- `useWishlistActions()` → Toggle wishlist

**Breadcrumb.tsx**
- `useAppSelector(state => state.product.categories)` → Build path

---

## 4. Cart Page (`CartPage.tsx`)

### Main Page
- `useCart()` → **PRIMARY MEGA-HOOK** - ALL functionality
  - Cart items
  - Pricing (integrates `usePricing()` internally)
  - Coupons (integrates `useCoupon()` internally)
  - Delivery charges
  - Item actions (increment, decrement, remove, move to wishlist)
  - Checkout preparation

### Components
**CartItem.tsx**
- `useCartItem(item)` → Individual item logic
- Receives handlers from `useCart()`

**PricingSummary.tsx**
- `usePricingSummary(pricing)` → Format pricing display
- Receives pricing from `useCart()`

**CouponInput.tsx**
- `useCouponInput({ availableCoupons, validCoupons, ... })` → UI state
- Receives coupon data/handlers from `useCart()`

**CouponList.tsx**
- Receives coupons and handlers as props

**BestCouponSuggestion.tsx**
- Receives best coupon from `useCart()`

**EmptyCart.tsx**
- No hooks (static component)

---

## 5. Checkout Page (`CheckoutPage.tsx`)

### Main Page
- `useCheckout()` → **MEGA-HOOK** - ALL functionality
  - Step management
  - Address management
  - Delivery slot management (conditional)
  - Payment method management
  - Cart data
  - Order placement

### Components
**CheckoutProgress.tsx**
- Receives step state from `useCheckout()`

**AddressStep.tsx**
- Receives addresses from `useCheckout()`
- `useAddressBook()` for inline add/edit (optional)

**DeliveryStep.tsx**
- Receives delivery slots from `useCheckout()`
- `useDeliverySlotCapacity()` → Show capacity warnings

**PaymentStep.tsx**
- Receives payment methods from `useCheckout()`

**ReviewStep.tsx**
- Receives all checkout data from `useCheckout()`
- Local state for terms acceptance

**ConfirmationStep.tsx**
- Receives order UID from `useCheckout()`

**SummarySidebar.tsx**
- Receives cart/pricing from `useCheckout()`

---

## 6. Order Tracking Page (`OrderTrackingPage.tsx`)

### Main Page
- `useParams<{ orderUid: string }>()` → Get order ID from URL
- `useOrderDetails(orderUid)` → **CRITICAL: Pass orderUid parameter**
  - Returns: `{ orderDetails, timeline, userDetails, orderSummary, loading, error, isRefreshing, refreshOrderData }`
- `useOrderCancel()` → Cancel order functionality

### Utility Hooks (All return object|null)
- `useOrderHeader(orderUid, serialNumber?, creationDate?)` → Header data
- `useDeliveryDetails(userDetails)` → Format delivery info
- `useOrderItems(orderDetails)` → Format order items
- `useOrderSummary(orderSummary)` → Format pricing

### Display Hooks (For Order Lists & Dashboards)
- `useOrderDisplay(order)` → Format single order for display
- `useOrdersDisplay(orders)` → Format multiple orders for display
- `useOrderStatistics(orders)` → Calculate order statistics
- `getOrderStatusColor(status)` → Status badge styling (utility function, NOT a hook)

### Components
**OrderHeader.tsx**
- `useOrderHeader()` → Format header data
- `useOrderHeaderActions()` → Action states
- `useOrderHeaderBreadcrumb()` → Navigation

**OrderStatusCard.tsx**
- Receives status from parent
- `ORDER_STATUS_COLORS` from constants

**OrderTimelineCard.tsx**
- Receives timeline from parent

**OrderItemsList.tsx**
- `useOrderItems(products)` → Format items

**OrderSummaryCard.tsx**
- `useOrderSummary(orderSummary)` → Format pricing

**DeliveryDetailsCard.tsx**
- `useDeliveryDetails(userDetails)` → Format delivery info

**CancelOrderModal.tsx**
- `useOrderCancel()` → Cancel action
- Local state for reason input

---

## 7. My Account Page (`MyAccountPage.tsx`)

### Main Page
- Local state for `activeSection` and `isMobileMenuOpen`
- Lazy load section components

### Section Components

**DashboardOverview.tsx**
- `useDashboard()` → Stats, recent orders, pending count
  - **Note**: `stats.wishlistItems` is a NUMBER (count), not an array
- `useOrderDisplay(order)` → Format individual orders (optional)
- `useOrdersDisplay(recentOrders)` → Format multiple orders (optional)
- `getOrderStatusColor(status)` → Status badge colors (utility function)

**ProfileSection.tsx**
- `useAccountProfile()` → Profile management

**OrderHistory.tsx**
- `useOrderHistory()` → Orders with filters
- `useOrdersDisplay(filteredOrders)` → Format orders for display (optional)
- `useOrderStatistics(orders)` → Order statistics (optional)
- `getOrderStatusColor(status)` → Status badge colors

**AddressBook.tsx**
- `useAddressBook()` → Address management

**WishlistOverview.tsx** (in My Account)
- `useAppSelector(state => state.wishlist.items)` → **DIRECT REDUX**
- `useAppDispatch()` → `getUserWishlist()`
- `useWishlistActions()` → Actions

**AccountSettings.tsx**
- `useAccountSettings()` → Settings management

**SupportCenter.tsx**
- Local state only (FAQ accordion)

**AccountSidebar.tsx**
- Receives activeSection and handlers as props

---

## 8. Wishlist Page (`WishlistPage.tsx`)

### Main Page (Standalone, different from My Account section)
- `useAppSelector(state => state.wishlist.items)` → **DIRECT REDUX**
- `useAppSelector(state => state.wishlist.loading)` → Loading state
- `useAppDispatch()` → Dispatch `getUserWishlist()` on mount
- `useWishlistActions()` → `{ wishlistItems, isInWishlist, handleToggleWishlist, handleAddToWishlist, handleRemoveFromWishlist }`
  - **Note**: No handleMoveToCart in this hook!
- `useCartActions()` → `{ handleAddToCart }` for moving items to cart
- `useProductUtils()` → Format products (NO tenant param)
- Local state for:
  - `selectedItems: Set<string>` → Bulk selection
  - `searchQuery: string` → Search filter
  - `sortBy: SortOption` → Sort dropdown
- `useMemo` → `productsDisplayData` Map
- `useMemo` → `filteredAndSortedItems` array

### Components
**WishlistGrid.tsx**
- Receives items and handlers as props

**WishlistCard.tsx**
- Receives product data and handlers as props
- Checkbox for bulk selection

**WishlistHeader.tsx**
- Search input and sort dropdown

**BulkActionsBar.tsx**
- Receives selected items and handlers

**EmptyWishlist.tsx**
- No hooks (static component)

---

## 9. Login Page (`LoginPage.tsx`)

### Main Page
- Local state for tab switching
- `useLocation()` → Get redirect path from state
- `useNavigate()` → Navigate after login

### Components
**LoginForm.tsx**
- `useLogin()` → **CORRECTED**: Returns `{ credentials, errors, loading, handleInputChange, handleSubmit, validateField, clearErrors }`
- `useGuestCartSync()` → Cart sync after login (called internally)
- Form state managed by hook

**OTPForm.tsx**
- `useOTP()` → Phone/OTP authentication
- `useGuestCartSync()` → Cart sync after OTP verify
- Local state for phone/OTP inputs

---

## 10. Register Page (`RegisterPage.tsx`)

### Main Page
- `useNavigate()` → Redirect to login after 3s success
- Local state for success message

### Components
**RegistrationForm.tsx**
- `useRegistration()` → Registration handler
- `usePasswordStrength(password)` → Password validation
- `useTermsModal()` → Terms modal state
- Local state for form fields

**PasswordStrengthMeter.tsx**
- Receives strength data as props

---

## Common Utility Hooks (Used Across Multiple Pages)

### Redux Hooks
- `useAppDispatch()` → Typed dispatch
- `useAppSelector()` → Typed selector

### UI Hooks
- `useToast()` → Toast notifications

### Utility Hooks
- `useDebounce(value, delay)` → Debounce input (300ms for search)
- `useLocalStorage(key, initialValue)` → Persist preferences
- `useIntersectionObserver(options)` → Lazy loading, infinite scroll
- `useSmartRetry()` → Retry failed operations
- `usePerformanceMonitor()` → Monitor performance
- `useWebVitals()` → Track Core Web Vitals

### Product Hooks
- `useProductUtils()` → Format products/categories
  - **Usage**: Call at component top level → `const { formatProductForDisplay } = useProductUtils();`
  - **Signature**: `formatProductForDisplay(product, ratings?)` - NO tenant parameter
  - Then use inside map: `products.map(p => formatProductForDisplay(p))`
- `useProductDisplayData(product)` → Memoized display data for SINGLE product
- `useCategoryDisplayData(category)` → Memoized category data for SINGLE category

### Cart/Wishlist Actions
- `useCartActions()` → `{ handleAddToCart(product, displayData, quantity?), handleIncrementQuantity(uid, bagDetailId?), handleDecrementQuantity(uid, bagDetailId?), handleRemoveFromCart(uid, bagDetailId?) }`
  - All methods return `Promise<boolean>` (true on success, false on failure)
- `useWishlistActions()` → `{ wishlistItems, wishlistProductUids: string[], isInWishlist(uid), handleAddToWishlist(product), handleRemoveFromWishlist(uid), handleToggleWishlist(product) }`
  - All methods return `Promise<boolean>` (true on success, false on failure)
  - **No moveToCart**: Use `useCartActions().handleAddToCart()` separately

### Order Display Hooks
- `useOrderDisplay(order)` → Format single order for lists
- `useOrdersDisplay(orders)` → Format multiple orders for lists
- `useOrderStatistics(orders)` → Calculate order statistics
- `getOrderStatusColor(status)` → Status badge colors (utility function)

---

## Hook Usage Patterns by Page Priority

### Priority 1 (Already Implemented - Verify Only)
✅ Home Page → `useFeaturedProducts`, `useFeaturedCategories`, `useBestSellers`
✅ Login Page → `useLogin`, `useOTP`, `useGuestCartSync`
✅ Register Page → `useRegistration`, `usePasswordStrength`, `useTermsModal`

### Priority 1 (Need Implementation)
🔨 Product List Page → `useProductList` (mega-hook)
🔨 Product Details Page → `useProductDetails()` (NO param), `useProductUtils`
🔨 Cart Page → `useCart` (mega-hook integrating coupons + pricing)
🔨 Checkout Page → `useCheckout` (mega-hook for complete flow)
🔨 Order Tracking Page → `useOrderDetails(orderUid)`, utility hooks with null checks
🔨 My Account Page → `useDashboard`, `useAccountProfile`, `useOrderHistory`, `useAddressBook`, `useAccountSettings`
🔨 Wishlist Page → Direct Redux + `useWishlistActions`

---

## Critical Reminders

### 1. Parameter Passing
✅ **DO**: `useOrderDetails(orderUid)` - Pass parameter from `useParams()`
✅ **DO**: `useProductDetails()` - NO parameter, uses `useParams()` internally
❌ **DON'T**: `useProductDetails(productId)` - Don't pass parameter

### 2. Mega-Hooks Usage
✅ **DO**: Use `useCart()` for all cart functionality
✅ **DO**: Use `useCheckout()` for all checkout functionality
❌ **DON'T**: Use `useCoupon()` or `usePricing()` separately - they're integrated

### 3. Null Checks for Utility Hooks
```typescript
const headerData = useOrderHeader(orderUid, serialNumber, creationDate);
if (!headerData) return null; // Always check
```

### 4. formatProductForDisplay Pattern
```typescript
// At component top level
const { formatProductForDisplay } = useProductUtils();

// ⚠️ CORRECTED: Only 2 params max, NO tenant
const displayData = formatProductForDisplay(product, ratings);
// displayData returns ProductDisplayData interface:
// {
//   product_uid, category_uid,
//   primaryImage, secondaryImage, allImages[],
//   price: "$19.99", mrp: "$29.99" | null,
//   displayName, brand, description,
//   isAvailable: boolean, stockStatus: string,
//   discountPercent, discountedPrice,
//   averageRating, totalReviews, ratingStars, ratingText
// }

// In useMemo for multiple products
const productsDisplayData = useMemo(() => 
  new Map(products.map(p => [p.product_uid, formatProductForDisplay(p)])),
  [products, formatProductForDisplay]
);

// Then access in render:
const displayData = productsDisplayData.get(product.product_uid);
<img src={displayData.primaryImage} alt={displayData.displayName} />
<span>{displayData.price}</span> {/* Already formatted */}
```

### 5. Wishlist Redux Pattern
```typescript
// Standalone Wishlist Page - DIRECT REDUX
const wishlistItems = useAppSelector(state => state.wishlist.items);
const loading = useAppSelector(state => state.wishlist.loading);

useEffect(() => {
  dispatch(getUserWishlist());
}, []);
```

### 6. Login Hook Pattern (CORRECTED)
```typescript
const { 
  credentials,        // { email_address, password, rememberMe }
  errors,            // Field-level errors
  loading, 
  handleInputChange, // (field, value)
  handleSubmit,      // (e) => Promise<boolean>
  validateField,     // (field)
  clearErrors 
} = useLogin();

// Usage in form
<input 
  value={credentials.email_address}
  onChange={(e) => handleInputChange('email_address', e.target.value)}
  onBlur={() => validateField('email_address')}
/>
```

---

## Summary

This mapping ensures:
- ✅ Each page uses the correct hooks
- ✅ Mega-hooks are used instead of separate hooks
- ✅ Parameters are passed correctly (orderUid needed, productId NOT needed)
- ✅ Null checks are implemented
- ✅ Performance optimizations (useMemo, useCallback) are applied
- ✅ Direct Redux is used where appropriate (Wishlist page)
- ✅ `formatProductForDisplay()` signature is correct (2 params max, NO tenant)

Use this as a reference when implementing or reviewing any page!
