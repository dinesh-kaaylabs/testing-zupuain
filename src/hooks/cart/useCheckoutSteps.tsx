import { useState, useCallback, useMemo } from 'react';

export type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review' | 'confirmation';

export const useCheckoutSteps = ({ isDeliverySlotActive }: { isDeliverySlotActive: boolean }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');

  const STEP_ORDER = useMemo(() => {
    const steps: CheckoutStep[] = ['address'];
    if (isDeliverySlotActive) steps.push('delivery');
    steps.push('payment', 'review', 'confirmation');
    return steps;
  }, [isDeliverySlotActive]);

  const stepIndex = STEP_ORDER.indexOf(currentStep);

  const goToNextStep = useCallback(() => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEP_ORDER.length - 1) setCurrentStep(STEP_ORDER[nextIndex]);
  }, [stepIndex, STEP_ORDER]);

  const goToPreviousStep = useCallback(() => {
    if (stepIndex > 0) setCurrentStep(STEP_ORDER[stepIndex - 1]);
  }, [stepIndex, STEP_ORDER]);

  const goToStep = useCallback((step: CheckoutStep) => setCurrentStep(step), []);
  const resetStep = useCallback(() => setCurrentStep('address'), []);

  return {
    currentStep,
    stepIndex,
    isFirstStep: stepIndex === 0,
    isLastStep: currentStep === 'confirmation',
    totalSteps: STEP_ORDER.length - 1,
    availableSteps: STEP_ORDER,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    setCurrentStep,
    resetStep,
  };
};

