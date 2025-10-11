import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux';
import { useToast } from '../ui/useToast';
import { fetchUserAddresses } from '../../store/slices/addressSlice';
import { fetchPaymentMethods, createOrder, setSelectedPaymentMethod } from '../../store/slices/orderSlice';
import { fetchDeliverySlots, setSelectedDate, setSelectedSlot } from '../../store/slices/deliverySlotSlice';
import { fetchBag } from '../../store/slices/cartSlice';
import { Address, PaymentMethod, DeliverySlot, CreateOrderBodyRequest, CreateOrderUserBagItem } from '../../types/api';
import { useCoupon } from './useCoupon';
import { usePricing } from './usePricing';
import { useDerivedCartItems } from '../../utils/cartDataHelpers';
import { decodeOrderDataFromUrl } from '../../utils/orderUtils';
import { DecodedOrderData, BagDetail, CartItem, Coupon } from '../../types/api';
import { CouponDiscountResult } from '../../utils/couponUtils';

export type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review' | 'confirmation';

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
  } = useAppSelector((state) => ({
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
  }));

  const isDeliverySlotActive = defaultTenant?.setting?.deliveryslot_management_active ?? false;

  const STEP_ORDER = useMemo((): CheckoutStep[] => {
    const steps: CheckoutStep[] = ['address'];
    if (isDeliverySlotActive) steps.push('delivery');
    steps.push('payment', 'review', 'confirmation');
    return steps;
  }, [isDeliverySlotActive]);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDateLocal] = useState<string | null>(null);
  const [selectedDeliverySlot, setSelectedDeliverySlotLocal] = useState<DeliverySlot | null>(null);
  const [orderUid, setOrderUid] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderConfirmationData, setOrderConfirmationData] = useState<DecodedOrderData | null>(null);

  const isGuest = !isAuthenticated;
  const cartItems = useDerivedCartItems(isGuest, guestItems, bags);
  const isOnlinePayment = reduxSelectedPayment?.slug === 'razorpay' || reduxSelectedPayment?.slug === 'online';
  const couponConfig = useMemo(() => ({
    isAuthenticated,
    userUid: user?.user_uid,
    cartTotal: totalAmount,
    deliveryCharge: baseDeliveryCharge,
    cartItems,
    isOnlinePayment,
  }), [isAuthenticated, user?.user_uid, totalAmount, baseDeliveryCharge, cartItems, isOnlinePayment]);

  const { appliedCoupon, appliedDiscount, handleApplyCoupon, handleRemoveCoupon } = useCoupon(couponConfig);

  const pricingConfig = useMemo(() => ({
    subtotal: totalAmount,
    appliedCoupon,
    appliedDiscount,
    storeUid: defaultStore?.store_uid,
    selectedPaymentMethod: reduxSelectedPayment,
  }), [totalAmount, appliedCoupon, appliedDiscount, defaultStore?.store_uid, reduxSelectedPayment]);

  const { pricing, pricingSummary, formatCurrency } = usePricing(pricingConfig);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login?redirect=/checkout');
  }, [isAuthenticated, navigate]);
  
  // Fetch initial data on mount
  useEffect(() => {
    if (!isAuthenticated || !defaultStore?.store_uid) return;
    dispatch(fetchUserAddresses());
    dispatch(fetchPaymentMethods('B2C'));
    dispatch(fetchDeliverySlots({}));
    dispatch(fetchBag(defaultStore.store_uid));
  }, [dispatch, isAuthenticated, defaultStore]);

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

  useEffect(() => {
    if (addresses.length && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.is_default);
      setSelectedAddress(defaultAddress || addresses[0]);
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    if (paymentMethods.length && !reduxSelectedPayment) {
      dispatch(setSelectedPaymentMethod(paymentMethods[0]));
    }
  }, [paymentMethods, reduxSelectedPayment, dispatch]);

  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const isFirstStep = stepIndex === 0;
  const isLastStep = currentStep === 'confirmation';
  const totalSteps = STEP_ORDER.length - 1;
  const validateStep = useCallback((step: CheckoutStep, showErrorMsg = false): boolean => {
    let isValid = true;
    let msg = '';

    switch (step) {
      case 'address':
        isValid = !!selectedAddress;
        msg = 'Please select a delivery address';
        break;
      case 'delivery':
        isValid = !isDeliverySlotActive || !!(selectedDeliveryDate && selectedDeliverySlot);
        msg = 'Please select a delivery date and time slot';
        break;
      case 'payment':
        isValid = !!reduxSelectedPayment;
        msg = 'Please select a payment method';
        break;
      case 'review':
        if (cartItems.length === 0) {
          isValid = false;
          msg = 'Your cart is empty';
        } else if (!termsAccepted) {
          isValid = false;
          msg = 'Please accept the terms and conditions';
        } else {
          const baseValid = !!selectedAddress && !!reduxSelectedPayment;
          isValid = isDeliverySlotActive 
            ? baseValid && !!selectedDeliveryDate && !!selectedDeliverySlot
            : baseValid;
          msg = 'Please complete all required steps';
        }
        break;
      default:
        isValid = true;
    }

    if (!isValid && showErrorMsg && msg) showError(msg);
    return isValid;
  }, [selectedAddress, selectedDeliveryDate, selectedDeliverySlot, reduxSelectedPayment, 
      cartItems.length, isDeliverySlotActive, showError, termsAccepted]);

  const validateCurrentStep = useCallback(() => validateStep(currentStep, true), [currentStep, validateStep]);
  const canProceedToNextStep = validateStep(currentStep, false);

  const goToNextStep = useCallback(() => {
    if (!validateCurrentStep()) return;

    const nextIndex = stepIndex + 1;
    if (nextIndex < STEP_ORDER.length - 1) {
      setCurrentStep(STEP_ORDER[nextIndex]);
    }
  }, [stepIndex, validateCurrentStep, STEP_ORDER]);

  const goToPreviousStep = useCallback(() => {
    if (isFirstStep) return;
    const prevIndex = stepIndex - 1;
    setCurrentStep(STEP_ORDER[prevIndex]);
  }, [stepIndex, isFirstStep, STEP_ORDER]);

  const goToStep = useCallback((step: CheckoutStep) => setCurrentStep(step), []);
  const refreshAddresses = useCallback(() => { 
    if (isAuthenticated) dispatch(fetchUserAddresses()); 
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

  const refreshDeliverySlots = useCallback(() => dispatch(fetchDeliverySlots({})), [dispatch]);
  const handleSetPaymentMethod = useCallback((method: PaymentMethod | null) => { 
    if (method) dispatch(setSelectedPaymentMethod(method)); 
  }, [dispatch]);
  const refreshPaymentMethods = useCallback(() => dispatch(fetchPaymentMethods('B2C')), [dispatch]);
  const handlePlaceOrder = useCallback(async () => {
    if (!validateCurrentStep()) return;

    const requiredFields = isDeliverySlotActive
      ? [selectedAddress, selectedDeliveryDate, selectedDeliverySlot, reduxSelectedPayment, defaultStore?.store_uid]
      : [selectedAddress, reduxSelectedPayment, defaultStore?.store_uid];

    if (requiredFields.some(field => !field)) {
      showError('Missing required information for order placement');
      return;
    }

    setOrderLoading(true);
    setOrderError(null);

    try {
      const userBag: CreateOrderUserBagItem[] = cartItems.map(item => {
        const isBag = 'bag_detail_id' in item;
        const product = isBag ? item.zm_products?.[0] : null;
        
        return {
          product_uid: item.product_uid,
          stock: isBag ? product?.stock?.toString() || null : item.stock?.toString() || null,
          product_count: item.product_count,
          price: isBag ? item.selling_price.toString() : item.price,
          track_inventory: isBag ? product?.track_inventory || false : item.track_inventory,
          product_status: isBag ? product?.product_status || true : item.product_status,
          category_uid: isBag ? product?.category_uid || '' : item.category_uid,
          min_order_quantity: isBag ? product?.min_order_quantity || null : item.min_order_quantity || null,
        };
      });
      const orderRequest: CreateOrderBodyRequest = {
        cod_charge: reduxSelectedPayment?.slug === 'cod' ? pricing.codCharge || 0 : 0,
        coupon_amount: appliedDiscount?.discountAmount || 0,
        delivery_charge: pricing.deliveryCharge,
        discount_amount: !!appliedDiscount,
        discount_percent: appliedCoupon?.coupon_percentage || 0,
        final_price: pricing.total,
        price: pricing.subtotal,
        slugData: 'CART',
        userBag,
        buyer_gst_number: null,
        checkout_flag: 1,
        customer_type_id: 1,
        dayName: isDeliverySlotActive && selectedDeliverySlot ? (selectedDeliverySlot.dayName || '') : '',
        delivery_address_id: selectedAddress!.b2c_address_id,
        delivery_date: isDeliverySlotActive && selectedDeliveryDate ? selectedDeliveryDate : '',
        delivery_time: isDeliverySlotActive && selectedDeliverySlot ? selectedDeliverySlot.delivery_time || '' : '',
        order_notes: null,
        payment_method_id: reduxSelectedPayment!.payment_method_id,
        secured: true,
        slug: reduxSelectedPayment!.slug,
        store_uid: defaultStore!.store_uid,
      };

      const result = await dispatch(createOrder(orderRequest)).unwrap();
      console.log('🚀 Order creation result:', result);
      if (result?.order_uid) {
        setOrderUid(result.order_uid);
        
        // Decode order confirmation data from urlLink
        if (result.urlLink) {
          const decodedData = decodeOrderDataFromUrl(result.urlLink);
          if (decodedData) {
            setOrderConfirmationData(decodedData);
            console.log('📦 Order confirmation data decoded:', decodedData);
          }
        }
        
        // Refresh cart to clear items
        if (defaultStore?.store_uid) {
          await dispatch(fetchBag(defaultStore.store_uid)).unwrap();
        }
        success('Order placed successfully!');
        setCurrentStep('confirmation');
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error) || 'Failed to place order. Please try again.';
      setOrderError(errorMessage);
      showError(errorMessage);
    } finally {
      setOrderLoading(false);
    }
  }, [validateCurrentStep, selectedAddress, selectedDeliveryDate, selectedDeliverySlot, reduxSelectedPayment, 
      defaultStore, cartItems, appliedDiscount, appliedCoupon, pricing, dispatch, success, showError, isDeliverySlotActive]);
  const resetCheckout = useCallback(() => {
    setCurrentStep('address');
    setSelectedAddress(null);
    setSelectedDeliveryDateLocal(null);
    setSelectedDeliverySlotLocal(null);
    setOrderUid(null);
    setOrderError(null);
    setTermsAccepted(false);
    setOrderConfirmationData(null);
    dispatch(setSelectedDate(null));
    dispatch(setSelectedSlot(null));
  }, [dispatch]);

  return {
    currentStep, goToNextStep, goToPreviousStep, goToStep, canProceedToNextStep,
    isFirstStep, isLastStep, stepIndex, totalSteps, availableSteps: STEP_ORDER, isDeliverySlotActive,
    addresses, selectedAddress, addressLoading, addressError, setSelectedAddress, refreshAddresses,
    deliverySlots, selectedDeliveryDate: selectedDeliveryDate || reduxSelectedDate,
    selectedDeliverySlot: selectedDeliverySlot || reduxSelectedSlot,
    deliveryLoading, deliveryError, setSelectedDeliveryDate: handleSetSelectedDeliveryDate,
    setSelectedDeliverySlot: handleSetSelectedDeliverySlot, refreshDeliverySlots,
    paymentMethods, selectedPaymentMethod: reduxSelectedPayment,
    paymentLoading: paymentMethodsState.loading, paymentError: paymentMethodsState.error,
    setPaymentMethod: handleSetPaymentMethod, refreshPaymentMethods,
    cartItems, pricing, pricingSummary, appliedCoupon, appliedDiscount,
    handleApplyCoupon, handleRemoveCoupon, formatCurrency,
    orderUid, orderLoading, orderError, orderConfirmationData,
    handlePlaceOrder, validateCurrentStep, resetCheckout,
    termsAccepted, setTermsAccepted,
  };
};
