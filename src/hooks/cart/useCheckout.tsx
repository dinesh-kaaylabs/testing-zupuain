import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux';
import { useToast } from '../ui/useToast';
import { fetchUserAddresses } from '../../store/slices/addressSlice';
import { fetchPaymentMethods, setSelectedPaymentMethod } from '../../store/slices/orderSlice';
import { fetchDeliverySlots, setSelectedDate, setSelectedSlot } from '../../store/slices/deliverySlotSlice';
import { fetchBag } from '../../store/slices/cartSlice';
import { Address, PaymentMethod, DeliverySlot, CreateOrderResponse } from '../../types/api';
import { useCoupon } from './useCoupon';
import { usePricing } from './usePricing';
import { useDerivedCartItems } from '../../utils/cartDataHelpers';
import { DecodedOrderData, BagDetail, CartItem, Coupon } from '../../types/api';
import { CouponDiscountResult } from '../../utils/couponUtils';
import { useCheckoutSteps, CheckoutStep } from './useCheckoutSteps';
import { useCheckoutValidation } from './useCheckoutValidation';
import { useOrderPlacement } from './useOrderPlacement';
import { useRazorpayPayment } from './useRazorpayPayment';

export type { CheckoutStep };

interface UseCheckoutReturn {
  // Step management
  currentStep: CheckoutStep;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: CheckoutStep) => void;
  canProceedToNextStep: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  stepIndex: number;
  totalSteps: number;
  availableSteps: CheckoutStep[];
  isDeliverySlotActive: boolean;

  // Address state
  addresses: Address[];
  selectedAddress: Address | null;
  addressLoading: boolean;
  addressError: string | null;
  setSelectedAddress: (address: Address | null) => void;
  refreshAddresses: () => void;

  // Delivery state
  deliverySlots: DeliverySlot[];
  selectedDeliveryDate: string | null;
  selectedDeliverySlot: DeliverySlot | null;
  deliveryLoading: boolean;
  deliveryError: string | null;
  setSelectedDeliveryDate: (date: string | null) => void;
  setSelectedDeliverySlot: (slot: DeliverySlot | null) => void;
  refreshDeliverySlots: () => void;

  // Payment state
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  paymentLoading: boolean;
  paymentError: string | null;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  refreshPaymentMethods: () => void;

  // Cart & Pricing state
  cartItems: (BagDetail | CartItem)[];
  pricing: {
    subtotal: number;
    deliveryCharge: number;
    baseDeliveryCharge: number;
    deliveryDiscount: number;
    productDiscount: number;
    discount: number;
    tax: number;
    codCharge: number;
    total: number;
    isFreeDelivery: boolean;
  };
  pricingSummary: {
    subtotal: string;
    deliveryCharge: string;
    baseDeliveryCharge: string;
    deliveryDiscount: string;
    productDiscount: string;
    discount: string;
    tax: string;
    codCharge: string;
    total: string;
    savings: string;
  };
  appliedCoupon: Coupon | null;
  appliedDiscount: CouponDiscountResult | null;
  handleApplyCoupon: (code: string) => Promise<boolean>;
  handleRemoveCoupon: () => void;
  formatCurrency: (amount: number) => string;

  // Order state
  orderUid: string | null;
  orderLoading: boolean;
  orderError: string | null;
  orderConfirmationData: DecodedOrderData | null;

  // Actions
  handlePlaceOrder: () => Promise<void>;
  validateCurrentStep: () => boolean;
  resetCheckout: () => void;

  // Review state
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
}

// Memoized selector for better performance
const selectCheckoutData = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  addresses: state.address.addresses,
  addressLoading: state.address.loading,
  addressError: state.address.error,
  bags: state.cart.bags,
  guestItems: state.cart.guestItems,
  totalAmount: state.cart.totalAmount,
  defaultStore: state.store.defaultStore,
  defaultTenant: state.tenant.defaultTenant,
  deliverySlots: state.deliverySlot.availableSlots,
  reduxSelectedDate: state.deliverySlot.selectedDate,
  reduxSelectedSlot: state.deliverySlot.selectedSlot,
  deliveryLoading: state.deliverySlot.loading,
  deliveryError: state.deliverySlot.error,
  paymentMethods: state.order.paymentMethods,
  reduxSelectedPayment: state.order.selectedPaymentMethod,
  paymentMethodsState: state.order.paymentMethodsState,
  baseDeliveryCharge: state.deliveryCharge.deliveryCharge?.delivery_charge || 0,
  cartLoading: state.cart.loading,
});

export const useCheckout = (): UseCheckoutReturn => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { success, error: showError } = useToast();

  const {
    isAuthenticated, user, addresses, addressLoading, addressError,
    bags, guestItems, totalAmount, defaultStore, defaultTenant,
    deliverySlots, reduxSelectedDate, reduxSelectedSlot, deliveryLoading, deliveryError,
    paymentMethods, reduxSelectedPayment, paymentMethodsState, baseDeliveryCharge,
    cartLoading,
  } = useAppSelector(selectCheckoutData);

  const isDeliverySlotActive = defaultTenant?.setting?.deliveryslot_management_active ?? false;

  // Local state
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDateLocal] = useState<string | null>(null);
  const [selectedDeliverySlot, setSelectedDeliverySlotLocal] = useState<DeliverySlot | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Derived values
  const isGuest = !isAuthenticated;
  const cartItems = useDerivedCartItems(isGuest, guestItems, bags);
  const isOnlinePayment = reduxSelectedPayment?.slug === 'razorpay' || reduxSelectedPayment?.slug === 'online';
  
  // Coupon management
  const couponConfig = useMemo(() => ({
    isAuthenticated,
    userUid: user?.user_uid,
    cartTotal: totalAmount,
    deliveryCharge: baseDeliveryCharge,
    cartItems,
    isOnlinePayment,
  }), [isAuthenticated, user?.user_uid, totalAmount, baseDeliveryCharge, cartItems, isOnlinePayment]);

  const { appliedCoupon, appliedDiscount, handleApplyCoupon, handleRemoveCoupon } = useCoupon(couponConfig);

  // Pricing management
  const pricingConfig = useMemo(() => ({
    subtotal: totalAmount,
    appliedCoupon,
    appliedDiscount,
    storeUid: defaultStore?.store_uid,
    selectedPaymentMethod: reduxSelectedPayment,
  }), [totalAmount, appliedCoupon, appliedDiscount, defaultStore?.store_uid, reduxSelectedPayment]);

  const { pricing, pricingSummary, formatCurrency } = usePricing(pricingConfig);

  // Step management
  const {
    currentStep,
    stepIndex,
    isFirstStep,
    isLastStep,
    totalSteps,
    availableSteps,
    goToNextStep: goToNextStepRaw,
    goToPreviousStep,
    goToStep,
    setCurrentStep,
    resetStep,
  } = useCheckoutSteps({ isDeliverySlotActive });

  // Validation
  const { validateStep, validateAndShowError } = useCheckoutValidation({
    selectedAddress,
    selectedDeliveryDate,
    selectedDeliverySlot,
    selectedPaymentMethod: reduxSelectedPayment,
    cartItemsCount: cartItems.length,
    termsAccepted,
    isDeliverySlotActive,
  });

  // Order placement
  const {
    orderUid,
    orderLoading,
    orderError,
    orderConfirmationData,
    retryCount,
    placeOrder,
    retryPlaceOrder,
    handleOrderConfirmation,
    resetOrderState,
    setOrderLoadingState,
    refreshCart,
  } = useOrderPlacement({
    cartItems,
    selectedAddress,
    selectedDeliveryDate,
    selectedDeliverySlot,
    selectedPaymentMethod: reduxSelectedPayment,
    appliedCoupon,
    appliedDiscount,
    pricing,
    storeUid: defaultStore?.store_uid || '',
    isDeliverySlotActive,
  });

  // Handle successful order confirmation
  const handleSuccessfulOrder = useCallback(async (orderData: CreateOrderResponse) => {
    await handleOrderConfirmation(orderData);
    setCurrentStep('confirmation');
    setOrderLoadingState(false);
  }, [handleOrderConfirmation, setCurrentStep, setOrderLoadingState]);

  // Handle failed order/payment
  const handleFailedOrder = useCallback(() => {
    setOrderLoadingState(false);
  }, [setOrderLoadingState]);

  // Razorpay payment integration
  const { initiateRazorpayPayment } = useRazorpayPayment({
    razorpayPublicKey: defaultTenant?.setting?.razorpay_public_token || '',
    totalAmount: pricing.total,
    onPaymentSuccess: handleSuccessfulOrder,
    onPaymentFailure: handleFailedOrder,
  });

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch initial data on mount - optimized with single effect
  useEffect(() => {
    if (!isAuthenticated || !defaultStore?.store_uid) return;

    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchUserAddresses()),
          dispatch(fetchPaymentMethods('B2C')),
          dispatch(fetchDeliverySlots({})),
          dispatch(fetchBag(defaultStore.store_uid)),
        ]);
      } catch (error) {
        console.error('❌ Error fetching initial checkout data:', error);
      }
    };

    fetchData();
  }, [dispatch, isAuthenticated, defaultStore?.store_uid]);

  // Redirect if cart is empty after data loads
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0 && currentStep !== 'confirmation') {
      const timer = setTimeout(() => {
        showError('Your cart is empty');
        navigate('/');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cartLoading, cartItems.length, currentStep, navigate, showError]);

  // Auto-select default address - Fixed dependency issue
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((addr: Address) => addr.is_default) || addresses[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addresses, selectedAddress]);

  // Auto-select default payment method
  useEffect(() => {
    if (paymentMethods.length > 0 && !reduxSelectedPayment) {
      dispatch(setSelectedPaymentMethod(paymentMethods[0]));
    }
  }, [paymentMethods, reduxSelectedPayment, dispatch]);

  // Validated step navigation
  const goToNextStep = useCallback(() => {
    if (!validateAndShowError(currentStep)) return;
    goToNextStepRaw();
  }, [currentStep, validateAndShowError, goToNextStepRaw]);

  const validateCurrentStep = useCallback(() => {
    return validateAndShowError(currentStep);
  }, [currentStep, validateAndShowError]);

  const canProceedToNextStep = validateStep(currentStep, false);

  // Data refresh callbacks
  const refreshAddresses = useCallback(() => { 
    if (isAuthenticated) {
      dispatch(fetchUserAddresses());
    }
  }, [dispatch, isAuthenticated]);

  const handleSetSelectedDeliveryDate = useCallback((date: string | null) => {
    setSelectedDeliveryDateLocal(date);
    dispatch(setSelectedDate(date));
    setSelectedDeliverySlotLocal(null);
    dispatch(setSelectedSlot(null));
  }, [dispatch]);

  const handleSetSelectedDeliverySlot = useCallback((slot: DeliverySlot | null) => {
    setSelectedDeliverySlotLocal(slot);
    dispatch(setSelectedSlot(slot));
  }, [dispatch]);

  const refreshDeliverySlots = useCallback(() => {
    dispatch(fetchDeliverySlots({}));
  }, [dispatch]);

  const handleSetPaymentMethod = useCallback((method: PaymentMethod | null) => { 
    if (method) {
      dispatch(setSelectedPaymentMethod(method));
    }
  }, [dispatch]);

  const refreshPaymentMethods = useCallback(() => {
    dispatch(fetchPaymentMethods('B2C'));
  }, [dispatch]);

  // Main order placement handler with Razorpay integration
  const handlePlaceOrder = useCallback(async () => {
    if (!validateCurrentStep()) return;

    const result = await placeOrder();

    if (result.success && result.orderData) {
      // Check if payment method is Razorpay
      if (reduxSelectedPayment?.slug === 'razorpay') {
        console.log('💳 Initiating Razorpay payment...');
        initiateRazorpayPayment(result.orderData, reduxSelectedPayment.slug);
      } else {
        // For COD or other payment methods, directly confirm order
        console.log('✅ Direct order confirmation (non-Razorpay)');
        await handleSuccessfulOrder(result.orderData);
        await refreshCart();
      }
    }
  }, [
    validateCurrentStep,
    placeOrder,
    reduxSelectedPayment,
    initiateRazorpayPayment,
    handleSuccessfulOrder,
    refreshCart,
  ]);

  // Reset checkout state
  const resetCheckout = useCallback(() => {
    resetStep();
    setSelectedAddress(null);
    setSelectedDeliveryDateLocal(null);
    setSelectedDeliverySlotLocal(null);
    setTermsAccepted(false);
    resetOrderState();
    dispatch(setSelectedDate(null));
    dispatch(setSelectedSlot(null));
  }, [dispatch, resetStep, resetOrderState]);

  // Return all checkout functionality
  return {
    // Step management
    currentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canProceedToNextStep,
    isFirstStep,
    isLastStep,
    stepIndex,
    totalSteps,
    availableSteps,
    isDeliverySlotActive,

    // Address management
    addresses,
    selectedAddress,
    addressLoading,
    addressError,
    setSelectedAddress,
    refreshAddresses,

    // Delivery management
    deliverySlots,
    selectedDeliveryDate: selectedDeliveryDate || reduxSelectedDate,
    selectedDeliverySlot: selectedDeliverySlot || reduxSelectedSlot,
    deliveryLoading,
    deliveryError,
    setSelectedDeliveryDate: handleSetSelectedDeliveryDate,
    setSelectedDeliverySlot: handleSetSelectedDeliverySlot,
    refreshDeliverySlots,

    // Payment management
    paymentMethods,
    selectedPaymentMethod: reduxSelectedPayment,
    paymentLoading: paymentMethodsState.loading,
    paymentError: paymentMethodsState.error,
    setPaymentMethod: handleSetPaymentMethod,
    refreshPaymentMethods,

    // Cart & Pricing
    cartItems,
    pricing,
    pricingSummary,
    appliedCoupon,
    appliedDiscount,
    handleApplyCoupon,
    handleRemoveCoupon,
    formatCurrency,

    // Order management
    orderUid,
    orderLoading,
    orderError,
    orderConfirmationData,
    handlePlaceOrder,
    validateCurrentStep,
    resetCheckout,

    // Review state
    termsAccepted,
    setTermsAccepted,
  };
};
