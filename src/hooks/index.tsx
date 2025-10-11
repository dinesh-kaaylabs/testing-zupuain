// Redux hooks
export { useAppDispatch } from './redux/useAppDispatch';
export { useAppSelector } from './redux/useAppSelector';

// Utility hooks
export { useToast } from './ui/useToast';
export { useDebounce } from './utils/useDebounce';
export { useLocalStorage } from './utils/useLocalStorage';
export { useIntersectionObserver } from './utils/useIntersectionObserver';
export { useSmartRetry } from './utils/useSmartRetry';
export { usePerformanceMonitor, useWebVitals } from './utils/usePerformanceMonitor';

// Data hooks
export { useFeaturedProducts } from './product/useFeaturedProducts';
export { useFeaturedCategories } from './product/useFeaturedCategories';
export { useBestSellers } from './product/useBestSellers';

// Product hooks
export { useProductList } from './product/useProductList';
export { useProductUtils, useProductDisplayData, useCategoryDisplayData } from './product/useProductUtils';
export { useProductDetails } from './product/useProductDetails';

// Cart and Wishlist hooks
export { useCartActions } from './cart/useCartActions';
export { useWishlistActions } from './product/useWishlistActions';

// Wishlist Page Hooks
export { 
  useWishlistFilters, 
  useWishlistSelection, 
  useWishlistBulkActions,
  useWishlistDisplayData,
  useWishlistPage 
} from './wishlist';
export type { SortOption } from './wishlist';

// Auth hooks
export { useRegistration } from './auth/useRegistration';
export { usePasswordStrength } from './auth/usePasswordStrength';
export { useTermsModal } from './auth/useTermsModal';
export { useInvalidTokenModal } from './auth/useInvalidTokenModal';
export { useLogin } from './auth/useLogin';
export { useOTP } from './auth/useOTP';
export { useGuestCartSync } from './auth/useGuestCartSync';

// Cart & Checkout hooks
export { useCart } from './cart/useCart';
export { useCoupon } from './cart/useCoupon';
export { usePricing } from './cart/usePricing';
export { useCheckout } from './cart/useCheckout';
export { useCartItem } from './cart/useCartItem';
export { useCouponInput } from './cart/useCouponInput';
export { usePricingSummary } from './cart/usePricingSummary';

// Account hooks
export {
  useAccountProfile,
  useOrderHistory,
  useAddressBook,
  useAccountSettings,
  useDashboard,
} from './account';

// Order hooks
export {
  useOrderDetails,
  useOrderCancel,
  useOrderItems,
  useOrderSummary,
  useOrderSummaryConditions,
  useDeliveryDetails,
  useOrderHeader,
  useOrderHeaderActions,
  useOrderHeaderBreadcrumb,
  useOrderDisplay,
  useOrdersDisplay,
  getOrderStatusColor,
  useOrderStatistics,
} from './order';
export { useDeliverySlots } from './order/useDeliverySlots';
export { useDeliverySlotCapacity } from './order/useDeliverySlotCapacity';

// App hooks
export { useAppRoutes } from './utils/useAppRoutes';
