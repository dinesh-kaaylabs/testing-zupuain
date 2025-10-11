# Hooks Quick Reference Card

**Fast lookup for hook APIs and usage patterns**

---

## 🚀 Most Used Hooks

### Product Operations
```typescript
// 1. Fetch featured products
const { products, loading, error } = useFeaturedProducts();

// 2. Fetch best sellers
const { products, loading, error } = useBestSellers();

// 3. Get product details (⚠️ NO parameter - uses useParams internally)
const { product, reviews, relatedProducts, loading, error, refetch } = useProductDetails();

// 4. Format for display (⚠️ NO tenant parameter - handled internally)
const { formatProductForDisplay } = useProductUtils();
const displayData = formatProductForDisplay(product, ratings);
// ⚠️ Signature: formatProductForDisplay(product, ratings?) - only 2 params!
// ⚠️ Returns ProductDisplayData with these properties:
//    - primaryImage, secondaryImage, allImages[] (image URLs)
//    - price (formatted string like "$19.99"), mrp (formatted string | null)
//    - displayName, brand, description (strings)
//    - isAvailable (boolean), stockStatus (string)
//    - discountPercent (number), discountedPrice (number)
//    - averageRating, totalReviews, ratingStars, ratingText

// 5. Format category for display
const categoryData = useCategoryDisplayData(category);
// Returns: { category_uid, category_name, category_image, product_count }

// 6. Add to cart (and other cart actions)
const { handleAddToCart, handleIncrementQuantity, handleDecrementQuantity, handleRemoveFromCart } = useCartActions();
await handleAddToCart(product, displayData, quantity);
await handleIncrementQuantity(product_uid, bagDetailId);
await handleDecrementQuantity(product_uid, bagDetailId);
await handleRemoveFromCart(product_uid, bagDetailId);

// 7. Wishlist operations
const { wishlistItems, wishlistProductUids, isInWishlist, handleAddToWishlist, handleRemoveFromWishlist, handleToggleWishlist } = useWishlistActions();
const inWishlist = isInWishlist(product.product_uid);
await handleToggleWishlist(product);  // Toggle (add or remove)
await handleAddToWishlist(product);    // Explicit add
await handleRemoveFromWishlist(product_uid);  // Explicit remove
```

---

## 🛒 Cart & Checkout

### Cart (Use Mega-Hook)
```typescript
// ✅ Use ONE hook for everything
const {
  // Data
  cartItems, pricing, appliedCoupon, validCoupons, bestCoupon,
  // States
  loading, isUpdating, totalItems, totalSavings,
  // Item Actions
  handleIncrement, handleDecrement, handleRemove, handleMoveToWishlist,
  // Coupon Actions
  handleApplyCoupon, handleRemoveCoupon, applyBestCoupon,
  // Navigation
  handleCheckout,
  // Utilities
  formatCurrency
} = useCart();

// ❌ DON'T use useCoupon() or usePricing() separately - they're integrated!
```

### Checkout (Use Mega-Hook)
```typescript
// ✅ Use ONE hook for complete checkout
const {
  // Step Management
  currentStep, goToNextStep, goToPreviousStep, goToStep,
  canProceedToNextStep, isFirstStep, isLastStep, stepIndex,
  totalSteps, availableSteps, isDeliverySlotActive, validateCurrentStep,
  
  // Address
  addresses, selectedAddress, addressLoading, addressError,
  setSelectedAddress, refreshAddresses,
  
  // Delivery (conditional on tenantConfig)
  deliverySlots, selectedDeliveryDate, selectedDeliverySlot,
  deliveryLoading, deliveryError,
  setSelectedDeliveryDate, setSelectedDeliverySlot, refreshDeliverySlots,
  
  // Payment
  paymentMethods, selectedPaymentMethod, paymentLoading, paymentError,
  setPaymentMethod, refreshPaymentMethods,
  
  // Cart
  cartItems, pricing, pricingSummary, appliedCoupon, appliedDiscount,
  handleApplyCoupon, handleRemoveCoupon, formatCurrency,
  
  // Order
  orderUid, orderLoading, orderError, termsAccepted,
  setTermsAccepted, handlePlaceOrder, resetCheckout
} = useCheckout();

// ❌ DON'T create separate hooks for address/delivery/payment
```

---

## 📦 Order Tracking

### Order Details
```typescript
// Get order ID from URL
const { orderUid } = useParams<{ orderUid: string }>();

// Fetch order details (⚠️ MUST pass orderUid)
const {
  orderDetails,  // OrderProduct[]
  timeline,      // OrderTimelineItem[]
  userDetails,   // OrderUserDetails | null
  orderSummary,  // OrderSummary | null
  loading,
  error,
  isRefreshing,
  refreshOrderData
} = useOrderDetails(orderUid);

// Cancel order
const { cancelOrder, loading: cancelLoading } = useOrderCancel();
await cancelOrder(orderUid, reason);
```

### Order Display (For Lists & Dashboards)
```typescript
// Format single order for display
const orderDisplay = useOrderDisplay(order);
if (!orderDisplay) return null;
const { orderNumber, formattedDate, formattedPrice, itemCountText, status } = orderDisplay;

// Format multiple orders
const ordersDisplay = useOrdersDisplay(orders);

// Get status badge color (⚠️ NOT a hook, just a utility function)
import { getOrderStatusColor } from '@/hooks';
const statusColor = getOrderStatusColor(status);

// Calculate order statistics
const stats = useOrderStatistics(orders);
if (stats) {
  const { totalOrders, formattedTotalSpent, avgOrderValue } = stats;
}
```

### Order Utility Hooks (⚠️ All return object|null - CHECK NULL!)
```typescript
// 1. Format header
const headerData = useOrderHeader(
  orderUid, 
  orderSummary?.serial_number, 
  orderSummary?.creation_date
);
if (!headerData) return null; // ⚠️ Always check!
const { displayOrderNumber, formattedDate, hasDate, isNew } = headerData;

// 2. Format delivery details
const deliveryData = useDeliveryDetails(userDetails);
if (!deliveryData) return null;
const { sections } = deliveryData;

// 3. Format order items
const itemsData = useOrderItems(orderDetails);
if (!itemsData) return null;
const { items, totalItems, hasMultipleItems } = itemsData;

// 4. Format order summary
const summaryData = useOrderSummary(orderSummary);
if (!summaryData) return null;
```

### Check Cancellable Status
```typescript
// ⚠️ Use milestone_code from timeline, NOT orderSummary.status
const CANCELLABLE_STATUSES = ["pending", "confirmed"];
const currentMilestoneCode = timeline?.[timeline.length - 1]?.zm_milestone?.milestone_code?.toLowerCase() || "";
const canCancel = CANCELLABLE_STATUSES.includes(currentMilestoneCode);
```

---

## 👤 Account Management

### Dashboard
```typescript
const {
  stats: { totalOrders, totalSpent, savedAddresses, wishlistItems }, // ⚠️ wishlistItems is a NUMBER
  recentOrders,      // Last 5 orders
  pendingOrdersCount,
  loading,
  hasDefaultAddress,
  fetchDashboardData
} = useDashboard();
```

### Profile
```typescript
const {
  profileData: { user_name, email_address, phone_number },
  errors,
  isEditing,
  profileImage,
  isUploading,
  hasChanges,
  loading,
  updateField,
  validateForm,
  saveProfile,
  cancelEdit,
  uploadImage,
  startEdit
} = useAccountProfile();
```

### Order History
```typescript
const {
  orders,
  filteredOrders,
  filters,
  currentPage,
  totalPages,
  sortBy,
  sortOrder,
  fetchOrders,
  updateFilters,
  clearFilters,
  changePage,
  handleViewDetails,  // Navigate to order tracking
  handleReorder,
  hasOrders,
  orderStatistics
} = useOrderHistory();
```

### Address Book
```typescript
const {
  addresses,
  formData,
  errors,
  isEditing,
  isLoading,
  handleInputChange,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
  startEdit,  // Pass null for add, address object for edit
  cancelEdit
} = useAddressBook();
```

### Settings
```typescript
const {
  settings: { notifications, privacy, security, preferences },
  loading,
  hasChanges,
  updateSetting,  // (category, key, value)
  saveSettings,
  resetSettings,
  toggleTwoFactor,
  changePassword   // (currentPassword, newPassword)
} = useAccountSettings();
```

---

## ❤️ Wishlist (Standalone Page)

```typescript
// ⚠️ Use DIRECT REDUX, not a hook
const wishlistItems = useAppSelector(state => state.wishlist.items);
const loading = useAppSelector(state => state.wishlist.loading);
const dispatch = useAppDispatch();

// Fetch on mount
useEffect(() => {
  dispatch(getUserWishlist());
}, []);

// Actions hook
const { wishlistItems, isInWishlist, handleToggleWishlist, handleAddToWishlist, handleRemoveFromWishlist } = useWishlistActions();
// Note: No handleMoveToCart - use useCartActions().handleAddToCart() separately

// Local state for UI
const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
const [searchQuery, setSearchQuery] = useState('');
const [sortBy, setSortBy] = useState<SortOption>('latest');

// Memoize display data
const { formatProductForDisplay } = useProductUtils();
const productsDisplayData = useMemo(() => 
  new Map(wishlistItems.map(item => [
    item.product_uid,
    formatProductForDisplay(item.product) // ⚠️ Only 1-2 params, NO tenant
  ])),
  [wishlistItems, formatProductForDisplay]
);
```

---

## 🔐 Authentication

### Login
```typescript
// ⚠️ CORRECTED API - Form state management
const { 
  credentials,        // { email_address, password, rememberMe }
  errors,            // Field errors
  loading, 
  handleInputChange, // (field, value)
  handleSubmit,      // (e) => Promise<boolean>
  validateField,     // (field)
  clearErrors 
} = useLogin();

// Usage
<input 
  value={credentials.email_address}
  onChange={(e) => handleInputChange('email_address', e.target.value)}
/>
```

### Phone/OTP
```typescript
const { sendOtp, verifyOtp, loading, error, otpSent } = useOTP();
await sendOtp(phoneNumber);
await verifyOtp(phoneNumber, otp);

// Cart sync (auto-called by useLogin/useOTP)
const { syncCart } = useGuestCartSync();
```

### Registration
```typescript
const { handleRegister, loading, error, success } = useRegistration();
await handleRegister({ user_name, phone_number, email_address, password });

// Password strength meter
const { strength, score, requirements } = usePasswordStrength(password);
// Returns: strength: "weak" | "medium" | "strong", score: 0-100

// Terms modal
const { isOpen, openModal, closeModal } = useTermsModal();
```

---

## 🛠️ Utility Hooks

### Redux
```typescript
const dispatch = useAppDispatch();
const data = useAppSelector(state => state.slice.data);
```

### UI
```typescript
const toast = useToast();
toast.success('Success message');
toast.error('Error message');
toast.info('Info message');
```

### Performance
```typescript
// Debounce (for search inputs)
const debouncedValue = useDebounce(searchQuery, 300);

// LocalStorage
const [value, setValue] = useLocalStorage('key', defaultValue);

// Intersection Observer (lazy loading)
const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

// Smart Retry
const { retry, isRetrying, attempt } = useSmartRetry(maxRetries);
```

---

## 📏 Common Patterns

### Pattern 1: Display Data with useMemo
```typescript
const { formatProductForDisplay } = useProductUtils();

// ⚠️ NO tenant parameter needed!
const productsDisplayData = useMemo(() => 
  new Map(products.map(p => [
    p.product_uid,
    formatProductForDisplay(p) // Just product, optional ratings
  ])),
  [products, formatProductForDisplay]
);

// Access in render - displayData contains all formatted values
const displayData = productsDisplayData.get(product.product_uid);
if (!displayData) return null;

// Use the formatted data:
<img src={displayData.primaryImage} />
<h3>{displayData.displayName}</h3>
<span>{displayData.price}</span> {/* Already formatted like "$19.99" */}
{displayData.mrp && <span className="line-through">{displayData.mrp}</span>}
{displayData.brand && <p>{displayData.brand}</p>}
<button disabled={!displayData.isAvailable}>Add to Cart</button>
```

### Pattern 2: Event Handlers with useCallback
```typescript
const { formatProductForDisplay } = useProductUtils();
const { handleAddToCart } = useCartActions();

const handleAdd = useCallback(async (product: Product) => {
  const displayData = formatProductForDisplay(product);
  await handleAddToCart(product, displayData, 1);
}, [formatProductForDisplay, handleAddToCart]);
```

### Pattern 3: Null Checks for Utility Hooks
```typescript
const headerData = useOrderHeader(orderId, serialNumber, creationDate);
if (!headerData) return <LoadingSpinner />; // or null

const { displayOrderNumber, formattedDate } = headerData;
```

### Pattern 4: Conditional Rendering
```typescript
if (loading && !data) return <Skeleton />;
if (error) return <ErrorState error={error} onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState />;
```

---

## ⚠️ Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|----------|
| `useCoupon()` separately | `useCart()` includes coupons |
| `useProductDetails(productId)` | `useProductDetails()` (no param) |
| `formatProductForDisplay(p, tenant, ratings)` | `formatProductForDisplay(p, ratings)` (2 params max) |
| `bestSellers.products` | `bestSellers` (no .products) |
| `orderSummary.status` for cancel | `timeline[...].milestone_code` |
| No null check utility hooks | Always `if (!data) return null;` |
| `useCallback(() => {}, [])` missing deps | Include all dependencies |
| Forget `orderUid` param | `useOrderDetails(orderUid)` needs param |
| `stats.wishlistItems` is array | It's a NUMBER (count) |

---

## 🎯 Hook Selection Guide

**Need to...**

- Fetch products? → `useFeaturedProducts()`, `useBestSellers()`, `useProductDetails()` (no param)
- Format products? → `useProductUtils()` (call at top level)
- Add to cart? → `useCartActions().handleAddToCart()`
- Manage cart? → `useCart()` (mega-hook)
- Checkout flow? → `useCheckout()` (mega-hook)
- Track order? → `useOrderDetails(orderUid)` + utility hooks
- Manage account? → `useDashboard()`, `useAccountProfile()`, etc.
- Wishlist page? → Direct Redux + `useWishlistActions()`
- Auth? → `useLogin()`, `useOTP()`, `useRegistration()`
- Debounce search? → `useDebounce(value, 300)`
- Toast message? → `useToast()`

---

## 📚 Documentation Links

- **Complete List**: See `HOOKS_CHECKLIST.md`
- **Page Mapping**: See `PAGE_HOOKS_MAPPING.md`

---

**Remember**: Hooks are READ-ONLY. Use as provided, never modify implementations! 🔒
