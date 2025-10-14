import { useCallback } from 'react';
import { Address, PaymentMethod, DeliverySlot } from '../../types/api';
import { useToast } from '../ui/useToast';
import { CheckoutStep } from './useCheckoutSteps';

interface UseCheckoutValidationProps {
  selectedAddress: Address | null;
  selectedDeliveryDate: string | null;
  selectedDeliverySlot: DeliverySlot | null;
  selectedPaymentMethod: PaymentMethod | null;
  cartItemsCount: number;
  termsAccepted: boolean;
  isDeliverySlotActive: boolean;
}

export const useCheckoutValidation = ({
  selectedAddress,
  selectedDeliveryDate,
  selectedDeliverySlot,
  selectedPaymentMethod,
  cartItemsCount,
  termsAccepted,
  isDeliverySlotActive,
}: UseCheckoutValidationProps) => {
  const { error: showError } = useToast();

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
        isValid = !!selectedPaymentMethod;
        msg = 'Please select a payment method';
        break;
      case 'review':
        if (cartItemsCount === 0) {
          isValid = false;
          msg = 'Your cart is empty';
        } else if (!termsAccepted) {
          isValid = false;
          msg = 'Please accept the terms and conditions';
        } else {
          const baseValid = !!selectedAddress && !!selectedPaymentMethod;
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
  }, [selectedAddress, selectedDeliveryDate, selectedDeliverySlot, selectedPaymentMethod, cartItemsCount, isDeliverySlotActive, termsAccepted, showError]);

  return {
    validateStep,
    canProceedFromStep: useCallback((step: CheckoutStep) => validateStep(step, false), [validateStep]),
    validateAndShowError: useCallback((step: CheckoutStep) => validateStep(step, true), [validateStep]),
  };
};

