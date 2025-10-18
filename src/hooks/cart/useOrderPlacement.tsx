import { useState, useCallback } from 'react';
import { useAppDispatch } from '../redux';
import { useToast } from '../ui/useToast';
import { createOrder } from '../../store/slices/orderSlice';
import { fetchBag } from '../../store/slices/cartSlice';
import { decodeOrderDataFromUrl } from '../../utils/orderUtils';
import {
  Address,
  PaymentMethod,
  DeliverySlot,
  CreateOrderBodyRequest,
  CreateOrderUserBagItem,
  CreateOrderResponse,
  BagDetail,
  CartItem,
  Coupon,
  DecodedOrderData,
} from '../../types/api';
import { CouponDiscountResult } from '../../utils/couponUtils';

interface UseOrderPlacementProps {
  cartItems: (BagDetail | CartItem)[];
  selectedAddress: Address | null;
  selectedDeliveryDate: string | null;
  selectedDeliverySlot: DeliverySlot | null;
  selectedPaymentMethod: PaymentMethod | null;
  appliedCoupon: Coupon | null;
  appliedDiscount: CouponDiscountResult | null;
  pricing: {
    subtotal: number;
    deliveryCharge: number;
    codCharge: number;
    total: number;
  };
  storeUid: string;
  isDeliverySlotActive: boolean;
}

export const useOrderPlacement = ({
  cartItems,
  selectedAddress,
  selectedDeliveryDate,
  selectedDeliverySlot,
  selectedPaymentMethod,
  appliedCoupon,
  appliedDiscount,
  pricing,
  storeUid,
  isDeliverySlotActive,
}: UseOrderPlacementProps) => {
  const dispatch = useAppDispatch();
  const { success, error: showError } = useToast();

  const [orderUid, setOrderUid] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderConfirmationData, setOrderConfirmationData] = useState<DecodedOrderData | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const buildUserBagItems = useCallback((items: (BagDetail | CartItem)[]): CreateOrderUserBagItem[] => 
    items.map(item => {
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
        id: isBag ? String(item.product_variant_id) : undefined,
      };
    }), []);

  const refreshCart = useCallback(async () => {
    if (!storeUid) return;
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      await dispatch(fetchBag(storeUid)).unwrap();
      console.log('✅ Cart refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh cart:', error);
    }
  }, [storeUid, dispatch]);

  const handleOrderConfirmation = useCallback(async (result: CreateOrderResponse) => {
    try {
      if (result.urlLink) {
        const decodedData = decodeOrderDataFromUrl(result.urlLink);
        if (decodedData) {
          setOrderConfirmationData(decodedData);
          console.log('📦 Order confirmation data decoded:', decodedData);
        }
      }
      await refreshCart();
      success('Order placed successfully! 🎉');
      setOrderError(null);
      setRetryCount(0);
      return true;
    } catch (error) {
      console.error('❌ Error in order confirmation:', error);
      showError('Order placed but failed to refresh cart');
      return false;
    }
  }, [success, showError, refreshCart]);

  const placeOrder = useCallback(async (): Promise<{ success: boolean; orderData?: CreateOrderResponse }> => {
    const requiredFields = isDeliverySlotActive
      ? [selectedAddress, selectedDeliveryDate, selectedDeliverySlot, selectedPaymentMethod, storeUid]
      : [selectedAddress, selectedPaymentMethod, storeUid];

    if (requiredFields.some(field => !field)) {
      const errorMsg = 'Missing required information for order placement';
      showError(errorMsg);
      setOrderError(errorMsg);
      return { success: false };
    }

    if (cartItems.length === 0) {
      const errorMsg = 'Your cart is empty';
      showError(errorMsg);
      setOrderError(errorMsg);
      return { success: false };
    }

    setOrderLoading(true);
    setOrderError(null);

    try {
      const orderRequest: CreateOrderBodyRequest = {
        cod_charge: selectedPaymentMethod?.slug === 'cod' ? pricing.codCharge || 0 : 0,
        coupon_amount: appliedDiscount?.discountAmount || 0,
        delivery_charge: pricing.deliveryCharge,
        discount_amount: !!appliedDiscount,
        discount_percent: appliedCoupon?.coupon_percentage || 0,
        final_price: pricing.total,
        price: pricing.subtotal,
        slugData: 'CART',
        userBag: buildUserBagItems(cartItems),
        buyer_gst_number: null,
        checkout_flag: 1,
        customer_type_id: 1,
        dayName: isDeliverySlotActive && selectedDeliverySlot ? (selectedDeliverySlot.dayName || '') : '',
        delivery_address_id: selectedAddress!.b2c_address_id,
        delivery_date: isDeliverySlotActive && selectedDeliveryDate ? selectedDeliveryDate : '',
        delivery_time: isDeliverySlotActive && selectedDeliverySlot ? (selectedDeliverySlot.delivery_time || '') : '',
        order_notes: null,
        payment_method_id: selectedPaymentMethod!.payment_method_id,
        secured: true,
        slug: selectedPaymentMethod!.slug,
        store_uid: storeUid,
      };

      console.log('📤 Creating order with request:', orderRequest);
      const result = await dispatch(createOrder(orderRequest)).unwrap();
      console.log('✅ Order creation result:', result);

      if (!result?.order_uid) throw new Error('Order creation failed - no order UID returned');

      setOrderUid(result.order_uid);
      setRetryCount(0);
      return { success: true, orderData: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
      console.error('❌ Order placement error:', error);
      setOrderError(errorMessage);
      showError(errorMessage);
      setOrderLoading(false);
      return { success: false };
    }
  }, [selectedAddress, selectedDeliveryDate, selectedDeliverySlot, selectedPaymentMethod, storeUid, cartItems, appliedDiscount, appliedCoupon, pricing, isDeliverySlotActive, dispatch, showError, buildUserBagItems]);

  const retryPlaceOrder = useCallback(async (): Promise<{ success: boolean; orderData?: CreateOrderResponse }> => {
    if (retryCount >= 3) {
      showError('Maximum retry attempts reached. Please try again later.');
      return { success: false };
    }
    setRetryCount(prev => prev + 1);
    console.log(`🔄 Retrying order placement (attempt ${retryCount + 1}/3)`);
    return await placeOrder();
  }, [retryCount, placeOrder, showError]);

  const resetOrderState = useCallback(() => {
    setOrderUid(null);
    setOrderError(null);
    setOrderLoading(false);
    setOrderConfirmationData(null);
    setRetryCount(0);
  }, []);

  return {
    orderUid,
    orderLoading,
    orderError,
    orderConfirmationData,
    retryCount,
    placeOrder,
    retryPlaceOrder,
    handleOrderConfirmation,
    resetOrderState,
    setOrderLoadingState: setOrderLoading,
    refreshCart,
  };
};

