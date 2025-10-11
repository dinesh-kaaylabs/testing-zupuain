# Complete Hooks Checklist for E-Commerce Application

This document provides a comprehensive checklist of ALL hooks that must be implemented based on the project requirements. Use this as a reference to ensure all hooks are properly generated.

## ✅ Status Legend
- ✅ **Implemented** - Hook exists and is properly exported
- ⚠️ **Needs Review** - Hook exists but may need verification
- ❌ **Missing** - Hook needs to be created

---

## 1. Redux Hooks (✅ Complete)

### Location: `src/hooks/redux/`
- ✅ `useAppDispatch()` - Typed Redux dispatch hook
- ✅ `useAppSelector()` - Typed Redux selector hook

---

## 2. Utility Hooks (✅ Complete)

### Location: `src/hooks/utils/`
- ✅ `useDebounce(value, delay)` - Debounce values with configurable delay
- ✅ `useLocalStorage(key, initialValue)` - Persist state to localStorage
- ✅ `useIntersectionObserver(options)` - Detect element visibility
- ✅ `useSmartRetry()` - Smart retry logic for failed operations
- ✅ `usePerformanceMonitor()` - Monitor component performance
- ✅ `useWebVitals()` - Track Core Web Vitals
- ✅ `useAppRoutes()` - Application routing utilities

---

## 3. UI Hooks (✅ Complete)

### Location: `src/hooks/ui/`
- ✅ `useToast()` - Toast notification management

---

## 4. Product Hooks (✅ Complete)

### Location: `src/hooks/product/`

### Featured/Home Page Hooks
- ✅ `useFeaturedProducts()` 
  - Returns: `{ products, loading, error }`
  - Purpose: Fetch featured products for home page

- ✅ `useFeaturedCategories()` 
  - Returns: `{ categories, loading, error }`
  - Purpose: Fetch category list with product counts

- ✅ `useBestSellers()` 
  - Returns: `{ products, loading, error }`
  - Purpose: Fetch best-selling products

### Product Display Hooks
- ✅ `useProductUtils()` 
  - Returns: `{ formatProductForDisplay }`
  - Signature: `formatProductForDisplay(product, ratings?)`
  - Purpose: Format product data for display
  - **Usage**: Call at component top level, then use returned function
  - **Note**: Tenant is handled internally, no need to pass it
  - **Return Type**: `ProductDisplayData` interface with properties:
    - `product_uid, category_uid` - IDs
    - `primaryImage, secondaryImage, allImages[]` - Images
    - `price` (formatted string), `mrp` (formatted string | null)
    - `discountPercent` (number), `discountedPrice` (number)
    - `stockStatus` (string), `isAvailable` (boolean), `canAddToCart` (boolean)
    - `displayName, brand, description`
    - `minOrderQuantity, averageRating, totalReviews`
    - `ratingStars: { filled, empty, hasHalf }`, `ratingText`

- ✅ `useProductDisplayData(product)` 
  - **CORRECTED**: Takes a SINGLE product, returns `ProductDisplayData`
  - Purpose: Memoized product display data for a single product
  - **Return Type**: Same as `formatProductForDisplay()` above

- ✅ `useCategoryDisplayData(category)` 
  - **CORRECTED**: Takes a SINGLE category, returns `CategoryDisplayData`
  - Purpose: Memoized category display data for a single category
  - **Return Type**: `CategoryDisplayData` interface with properties:
    - `category_uid` - Category ID
    - `category_name` - Category name
    - `category_image` - Category image URL
    - `product_count` - Number of products in category

### Product List Hook
- ✅ `useProductList()` 
  - Returns: `{ products, categories, loading, searchInput, selectedCategory, selectedSubCategory, availability, sortBy, currentPage, hasMore, infiniteScrollLoading, totalProducts, totalPages, viewMode, handleSearchChange, handleCategoryChange, handleSubCategoryChange, handleAvailabilityChange, handleSortChange, handlePageChange, handleLoadMore, handleResetFilters, handleViewModeChange }`
  - Purpose: Comprehensive product list management with filters, search, pagination, infinite scroll

### Product Details Hook
- ✅ `useProductDetails()` 
  - **CRITICAL**: Takes NO parameters - uses `useParams()` internally to get `productId` from URL
  - Returns: `{ product, reviews, relatedProducts, loading, error, averageRating, totalReviews, refetch }`
  - Purpose: Fetch detailed product information
  - **Important**: Returns `reviews` array of type `ProductRating[]`

### Wishlist Hook
- ✅ `useWishlistActions()` 
  - Returns: `{ wishlistItems, wishlistProductUids: string[], isInWishlist: (uid) => boolean, handleAddToWishlist: (product) => Promise<boolean>, handleRemoveFromWishlist: (uid) => Promise<boolean>, handleToggleWishlist: (product) => Promise<boolean> }`
  - Purpose: Manage wishlist operations (add/remove/toggle)
  - **Note**: Read-only hook, no modifications allowed
  - **No moveToCart**: Use `useCartActions().handleAddToCart()` separately for moving to cart

---

## 5. Cart Hooks (✅ Complete)

### Location: `src/hooks/cart/`

### Primary Cart Hook
- ✅ `useCart()` **PRIMARY MEGA-HOOK**
  - Integrates: `useCoupon()` + `usePricing()` internally
  - Returns: `{ cartItems, isGuest, loading, error, totalItems, isUpdating, hasInitialized, pricing, appliedCoupon, appliedDiscount, totalSavings, deliveryChargeInfo, validCoupons, invalidCoupons, bestCoupon, couponsLoading, handleIncrement, handleDecrement, handleRemove, handleMoveToWishlist, handleCheckout, handleApplyCoupon, handleApplyCouponDirect, handleRemoveCoupon, applyBestCoupon, previewDiscount, formatCurrency }`
  - Purpose: ALL cart functionality in one hook

### Cart Actions Hook
- ✅ `useCartActions()` 
  - Returns: `{ handleAddToCart: (product, displayData, quantity?) => Promise<boolean>, handleIncrementQuantity: (uid, bagDetailId?) => Promise<boolean>, handleDecrementQuantity: (uid, bagDetailId?) => Promise<boolean>, handleRemoveFromCart: (uid, bagDetailId?) => Promise<boolean> }`
  - Purpose: Cart item management (add, increment, decrement, remove)
  - **Usage**: Pass product object, display data from `formatProductForDisplay()`, and optional quantity to handleAddToCart
  - **Note**: All methods return Promise<boolean> for success/failure

### Supporting Cart Hooks
- ✅ `useCoupon()` 
  - Returns: Coupon state and actions
  - Purpose: Coupon validation and management
  - **Note**: Integrated into `useCart()`, use `useCart()` instead

- ✅ `usePricing()` 
  - Returns: Pricing calculations
  - Purpose: Cart pricing breakdown
  - **Note**: Integrated into `useCart()`, use `useCart()` instead

- ✅ `useCartItem(item)` 
  - Returns: Individual cart item logic
  - Purpose: Single cart item management

- ✅ `useCouponInput({ availableCoupons, validCoupons, invalidCoupons, appliedCoupon, appliedDiscount, bestCoupon, onApplyCoupon, onApplyCouponDirect, onRemoveCoupon, onApplyBestCoupon, isLoading, cartTotal })` 
  - Returns: `{ couponCode, error, isApplying, showAllCoupons, handleApplyCoupon, handleRemoveCoupon, handleSelectCoupon, handleCouponCodeChange }`
  - Purpose: Coupon input UI state management

- ✅ `usePricingSummary(pricing)` 
  - Returns: Formatted pricing summary with free shipping progress
  - Purpose: Display pricing breakdown

---

## 6. Checkout Hooks (✅ Complete)

### Location: `src/hooks/cart/`

### Primary Checkout Hook
- ✅ `useCheckout()` **MEGA-HOOK - ALL FUNCTIONALITY**
  - **CRITICAL**: This hook provides EVERYTHING - DO NOT create separate hooks
  - Returns:
    - **STEP**: `currentStep, goToNextStep(), goToPreviousStep(), goToStep(step), canProceedToNextStep, isFirstStep, isLastStep, stepIndex, totalSteps, availableSteps[], isDeliverySlotActive, validateCurrentStep()`
    - **ADDRESS**: `addresses[], selectedAddress, addressLoading, addressError, setSelectedAddress(addr), refreshAddresses()`
    - **DELIVERY**: `deliverySlots[], selectedDeliveryDate, selectedDeliverySlot, deliveryLoading, deliveryError, setSelectedDeliveryDate(date), setSelectedDeliverySlot(slot), refreshDeliverySlots()`
    - **PAYMENT**: `paymentMethods[], selectedPaymentMethod, paymentLoading, paymentError, setPaymentMethod(method), refreshPaymentMethods()`
    - **CART**: `cartItems[], pricing{subtotal,deliveryCharge,tax,discount,total,isFreeDelivery}, pricingSummary, appliedCoupon, appliedDiscount, handleApplyCoupon(code), handleRemoveCoupon(), formatCurrency(amount)`
    - **ORDER**: `orderUid, orderLoading, orderError, termsAccepted, setTermsAccepted(bool), handlePlaceOrder(), resetCheckout()`
  - Purpose: Complete checkout flow management
  - **Internal Integration**: Uses `addressSlice, orderSlice, deliverySlotSlice, cartSlice, couponSlice, tenantSlice, storeSlice`

---

## 7. Auth Hooks (✅ Complete)

### Location: `src/hooks/auth/`

### Login & Registration Hooks
- ✅ `useLogin()` 
  - **CORRECTED**: Returns: `{ credentials, errors, loading, handleInputChange, handleSubmit, validateField, clearErrors }`
  - Purpose: Email/password authentication with form state management
  - **Note**: `handleSubmit` returns `Promise<boolean>` for success/failure

- ✅ `useOTP()` 
  - Returns: `{ sendOtp: (phone) => Promise<void>, verifyOtp: (phone, otp) => Promise<void>, loading, error, otpSent }`
  - Purpose: Phone/OTP authentication

- ✅ `useGuestCartSync()` 
  - Returns: Cart sync functionality
  - Purpose: Automatically sync guest cart after login
  - **Note**: Called internally by `useLogin()`/`useOTP()` or manually after success

- ✅ `useRegistration()` 
  - Returns: `{ handleRegister: (formData) => Promise<void>, loading, error, success }`
  - Purpose: User registration with validation

### Auth UI Hooks
- ✅ `usePasswordStrength(password)` 
  - Returns: `{ strength: "weak"|"medium"|"strong", score: 0-100, requirements: {...} }`
  - Purpose: Calculate password strength for registration

- ✅ `useTermsModal()` 
  - Returns: `{ isOpen, openModal, closeModal }`
  - Purpose: Terms & conditions modal state

- ✅ `useInvalidTokenModal()` 
  - Returns: Invalid token modal state
  - Purpose: Handle expired/invalid auth tokens

---

## 8. Order Hooks (✅ Complete)

### Location: `src/hooks/order/`

### Primary Order Hook
- ✅ `useOrderDetails(orderUid)` 
  - **CRITICAL**: MUST pass `orderUid` parameter (string | undefined)
  - Returns: `{ orderDetails: OrderProduct[], timeline: OrderTimelineItem[], userDetails: OrderUserDetails | null, orderSummary: OrderSummary | null, loading, error, isRefreshing, refreshOrderData() }`
  - Purpose: Fetch complete order information

### Order Action Hooks
- ✅ `useOrderCancel()` 
  - Returns: `{ cancelOrder(orderUid, reason?): Promise<boolean>, loading }`
  - Purpose: Cancel order with reason (auto toast)

### Order Utility Hooks (All return object|null)
- ✅ `useOrderHeader(orderId, serialNumber?, creationDate?)` 
  - Returns: `{ displayOrderNumber, formattedDate, hasDate, isNew }|null`
  - Purpose: Format order header data

- ✅ `useOrderHeaderActions(isRefreshing, canCancel)` 
  - Returns: `{ showRefreshButton, showCancelButton, isRefreshDisabled, refreshButtonState }|null`
  - Purpose: Order header action states

- ✅ `useOrderHeaderBreadcrumb(returnPath?)` 
  - Returns: `{ path, label }|null`
  - Purpose: Breadcrumb navigation

- ✅ `useDeliveryDetails(userDetails)` 
  - Returns: `{ sections: [{id,label,value,icon,bgColor,iconColor,isClickable?,href?}] }|null`
  - Purpose: Format delivery information for display

- ✅ `useOrderItems(products)` 
  - Returns: `{ items: [{id,product_uid,name,image,quantity,unitPrice,totalPrice,hasDiscount,...}], totalItems, hasMultipleItems }|null`
  - Purpose: Format order items for display

- ✅ `useOrderSummary(orderSummary)` 
  - Returns: Formatted pricing breakdown|null
  - Purpose: Display order summary

- ✅ `useOrderSummaryConditions()` 
  - Returns: Order summary validation conditions
  - Purpose: Validate order state

### Order Display Hooks (For Lists & Dashboards)
- ✅ `useOrderDisplay(order)` 
  - Returns: `{ orderNumber, orderId, formattedDate, formattedDateTime, formattedPrice, totalPrice, itemCount, itemCountText, status, statusDescription, deliveryDate, deliveryTime, deliverySlot }|null`
  - Purpose: Format single order for display in lists

- ✅ `useOrdersDisplay(orders)` 
  - Returns: Array of formatted orders with `{ orderNumber, orderId, formattedDate, formattedPrice, totalPrice, itemCount, itemCountText, status, statusDescription, rawOrder }[]|null`
  - Purpose: Format multiple orders for display

- ✅ `getOrderStatusColor(status)` 
  - **Note**: Utility function (NOT a hook)
  - Returns: Tailwind CSS classes for status badge
  - Purpose: Get status badge styling

- ✅ `useOrderStatistics(orders)` 
  - Returns: `{ totalOrders, totalSpent, avgOrderValue, pendingOrders, completedOrders, cancelledOrders, formattedTotalSpent, formattedAvgOrderValue }|null`
  - Purpose: Calculate order statistics for dashboard

### Delivery Slot Hooks
- ✅ `useDeliverySlots()` 
  - Returns: Delivery slot data and actions
  - Purpose: Manage delivery slot selection

- ✅ `useDeliverySlotCapacity()` 
  - Returns: Slot capacity information
  - Purpose: Show slot availability

### Order Helper Functions
- ✅ `formatDate(date, format?)` 
  - **Note**: Helper function from `shared.ts` (NOT a hook)
  - Returns: Formatted date string
  - Purpose: Format dates consistently across order components

---

## 9. Account Hooks (✅ Complete)

### Location: `src/hooks/account/`

### Account Dashboard Hook
- ✅ `useDashboard()` 
  - Returns: `{ stats{totalOrders,totalSpent,savedAddresses,wishlistItems}, recentOrders[5], pendingOrdersCount, loading, hasDefaultAddress, fetchDashboardData() }`
  - Purpose: Dashboard overview statistics
  - **Note**: `stats.wishlistItems` is a NUMBER (count), not an array

### Account Management Hooks
- ✅ `useAccountProfile()` 
  - Returns: `{ profileData{user_name,email_address,phone_number}, errors, isEditing, profileImage, isUploading, hasChanges, loading, updateField(), validateForm(), saveProfile(), cancelEdit(), uploadImage(file), startEdit() }`
  - Purpose: User profile management

- ✅ `useAddressBook()` 
  - Returns: `{ addresses, formData, errors, isEditing, isLoading, handleInputChange(), saveAddress(), deleteAddress(), setDefaultAddress(), startEdit(null=add|address=edit), cancelEdit() }`
  - Purpose: Address management

- ✅ `useOrderHistory()` 
  - Returns: `{ orders, filteredOrders, filters, currentPage, totalPages, sortBy, sortOrder, fetchOrders(page?), updateFilters(), clearFilters(), changePage(), handleViewDetails(→/order-tracking), handleReorder(), hasOrders, orderStatistics }`
  - Purpose: Order history with filters

- ✅ `useAccountSettings()` 
  - Returns: `{ settings{notifications,privacy,security,preferences}, loading, hasChanges, updateSetting(category,key,value), saveSettings(), resetSettings(), toggleTwoFactor(), changePassword(current,new) }`
  - Purpose: Account settings management

---

## 10. Key Hook Usage Rules

### Critical Constraints
1. ✅ **READ-ONLY HOOKS** - Never modify hook implementations
2. ✅ **HOOK CALL ORDER** - Call `useProductUtils()` at component top level, then use returned functions
3. ✅ **PARAMETER PASSING** - `useOrderDetails(orderUid)` needs parameter, but `useProductDetails()` does NOT (uses useParams internally)
4. ✅ **NULL CHECKS** - Always check for null returns from utility hooks
5. ✅ **MEGA-HOOKS** - Use `useCart()` for cart (not separate `useCoupon`/`usePricing`), use `useCheckout()` for checkout
6. ✅ **MEMOIZATION** - Use `useMemo` for expensive calculations (display data maps, filtered lists)
7. ✅ **CALLBACKS** - Use `useCallback` for event handlers passed to child components

### Common Patterns

#### Product Display Pattern
```typescript
// At component top level
const { formatProductForDisplay } = useProductUtils();

// Format single product
const displayData = formatProductForDisplay(product, ratings);
// displayData has: primaryImage, secondaryImage, price, mrp, displayName, 
// brand, isAvailable, stockStatus, averageRating, etc.

// Access properties:
<img src={displayData.primaryImage} alt={displayData.displayName} />
<span>{displayData.price}</span>
{displayData.mrp && <span className="line-through">{displayData.mrp}</span>}
<button disabled={!displayData.isAvailable}>Add to Cart</button>

// Or in useMemo for multiple products
const productsDisplayData = useMemo(() => 
  new Map(products.map(p => [p.product_uid, formatProductForDisplay(p)])),
  [products, formatProductForDisplay]
);

// Then access in render:
const displayData = productsDisplayData.get(product.product_uid);
```

#### Cart Actions Pattern
```typescript
const { handleAddToCart } = useCartActions();
const { formatProductForDisplay } = useProductUtils();

// Format product first, then add to cart
const displayData = formatProductForDisplay(product);
await handleAddToCart(product, displayData, quantity);
```

#### Wishlist Pattern
```typescript
const { wishlistItems, isInWishlist, handleToggleWishlist, handleAddToWishlist, handleRemoveFromWishlist } = useWishlistActions();

// Check if in wishlist
const inWishlist = isInWishlist(product.product_uid);

// Toggle wishlist (add if not in wishlist, remove if in wishlist)
await handleToggleWishlist(product);

// Or use specific methods
await handleAddToWishlist(product);
await handleRemoveFromWishlist(product.product_uid);
```

#### Product Details Pattern
```typescript
// Hook uses useParams() internally - NO parameter needed
const { product, reviews, relatedProducts, loading, error, refetch } = useProductDetails();

if (loading) return <Skeleton />;
if (error) return <ErrorState />;
if (!product) return <NotFound />;
```

#### Order Details Pattern
```typescript
const { orderUid } = useParams<{ orderUid: string }>();
const { orderDetails, timeline, userDetails, orderSummary, loading, error, refreshOrderData } = useOrderDetails(orderUid);

// Use utility hooks with null checks
const headerData = useOrderHeader(orderUid, orderSummary?.serial_number, orderSummary?.creation_date);
if (!headerData) return null; // Always check null
```

#### Checkout Pattern
```typescript
// ONE hook for everything
const checkout = useCheckout();

// Access all functionality
const { 
  currentStep, 
  goToNextStep, 
  addresses, 
  selectedAddress, 
  setSelectedAddress,
  handlePlaceOrder,
  termsAccepted,
  setTermsAccepted 
} = checkout;

// No need for separate hooks!
```

---

## 11. Validation Checklist

Before implementing any page, verify:

- [ ] All required hooks are imported from `src/hooks`
- [ ] Hooks are called at component top level (not inside loops/conditions)
- [ ] Parameters are passed correctly (e.g., `orderUid` to `useOrderDetails()`, but NOT to `useProductDetails()`)
- [ ] Null checks are implemented for utility hooks
- [ ] `useMemo` is used for expensive display data calculations
- [ ] `useCallback` is used for event handlers
- [ ] Error states are handled with proper error boundaries
- [ ] Loading states show skeleton loaders
- [ ] Toast notifications are used for user feedback
- [ ] Read-only hooks are never modified
- [ ] Mega-hooks (`useCart`, `useCheckout`) are used instead of separate hooks

---

## 12. Common Mistakes to Avoid

❌ **DON'T**: Create new hooks that duplicate existing functionality
✅ **DO**: Use existing hooks as specified in requirements

❌ **DON'T**: Modify hook implementations
✅ **DO**: Use hooks as read-only interfaces

❌ **DON'T**: Call `formatProductForDisplay()` directly without `useProductUtils()`
✅ **DO**: `const { formatProductForDisplay } = useProductUtils();` first

❌ **DON'T**: Pass tenant parameter to `formatProductForDisplay()`
✅ **DO**: Just pass `(product, ratings?)` - tenant is handled internally

❌ **DON'T**: Pass `productId` parameter to `useProductDetails()`
✅ **DO**: Call with no parameters - it uses `useParams()` internally

❌ **DON'T**: Use `useCoupon()` and `usePricing()` separately
✅ **DO**: Use `useCart()` which integrates both

❌ **DON'T**: Create separate checkout hooks
✅ **DO**: Use `useCheckout()` mega-hook for all checkout functionality

❌ **DON'T**: Forget to check null returns from utility hooks
✅ **DO**: Always check: `if (!headerData) return null;`

❌ **DON'T**: Forget to pass `orderUid` to `useOrderDetails()`
✅ **DO**: Always pass the parameter: `useOrderDetails(orderUid)`

❌ **DON'T**: Check `orderSummary.status` for cancellable status
✅ **DO**: Check `timeline[timeline.length - 1]?.zm_milestone?.milestone_code`

---

## Summary

✅ **Total Hooks Implemented**: 65+ hooks across 9 categories
✅ **All Critical Hooks**: Present and properly exported
✅ **Hook Integration**: Mega-hooks properly implemented
✅ **Utility Hooks**: All helper hooks available
✅ **Helper Functions**: Order display utilities and formatters included

This checklist ensures that Claude AI generates all required hooks correctly and uses them according to the strict guidelines in your prompts.
