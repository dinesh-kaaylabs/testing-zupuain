import { useCallback } from 'react';
import { useAppDispatch } from '../redux';
import { useToast } from '../ui/useToast';
import { verifyRazorpayPayment } from '../../store/slices/orderSlice';
import { CreateOrderResponse } from '../../types/api';
import { DEFAULTS } from '../../utils/constants';

interface UseRazorpayPaymentProps {
  razorpayPublicKey: string;
  totalAmount: number;
  onPaymentSuccess: (orderData: CreateOrderResponse) => void;
  onPaymentFailure: () => void;
}

export const useRazorpayPayment = ({
  razorpayPublicKey,
  totalAmount,
  onPaymentSuccess,
  onPaymentFailure,
}: UseRazorpayPaymentProps) => {
  const dispatch = useAppDispatch();
  const { error: showError } = useToast();

  const initiateRazorpayPayment = useCallback((orderData: CreateOrderResponse, paymentSlug: string) => {
    if (typeof window.Razorpay === 'undefined') {
      showError('Payment gateway not loaded. Please refresh and try again.');
      onPaymentFailure();
      return;
    }

    const options = {
      key: razorpayPublicKey,
      amount: totalAmount * 100,
      currency: DEFAULTS.CURRENCY_NAME || 'INR',
      order_id: orderData.data?.id || '',
      name: 'Order Payment',
      description: 'Payment for your order',
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try {
          console.log('🚀 Razorpay payment response:', response);
          const verificationResult = await dispatch(verifyRazorpayPayment({ ...response, slug: paymentSlug })).unwrap();
          console.log('✅ Razorpay verification result:', verificationResult);
          
          if (verificationResult.success) {
            onPaymentSuccess(orderData);
          } else {
            showError(verificationResult.data?.message || 'Payment verification failed');
            onPaymentFailure();
          }
        } catch (error) {
          console.error('❌ Payment verification error:', error);
          showError(error instanceof Error ? error.message : 'Payment verification failed');
          onPaymentFailure();
        }
      },
      modal: { ondismiss: () => { showError('Payment cancelled by user'); onPaymentFailure(); } },
      theme: { color: '#3B82F6' },
    };

    try {
      const razorpayInstance = new window.Razorpay(options);
      (razorpayInstance as any).on?.('payment.failed', (response: any) => {
        console.error('❌ Razorpay payment failed:', response?.error);
        showError(response?.error?.description || DEFAULTS.RAZOR_PAYMENT_FAILED_MESSAGE || 'Payment failed');
        onPaymentFailure();
      });
      razorpayInstance.open();
    } catch (error) {
      console.error('❌ Error opening Razorpay:', error);
      showError('Failed to open payment gateway');
      onPaymentFailure();
    }
  }, [razorpayPublicKey, totalAmount, dispatch, showError, onPaymentSuccess, onPaymentFailure]);

  return { initiateRazorpayPayment };
};

