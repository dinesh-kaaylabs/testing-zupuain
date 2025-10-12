import { useCheckout } from '../hooks/cart/useCheckout';
import SEOHead from '../components/common/SEOHead';
import { CheckoutProgress } from '../components/checkout/CheckoutProgress';
import { AddressStep } from '../components/checkout/AddressStep';
import { DeliveryStep } from '../components/checkout/DeliveryStep';
import { PaymentStep } from '../components/checkout/PaymentStep';
import { ReviewStep } from '../components/checkout/ReviewStep';
import { ConfirmationStep } from '../components/checkout/ConfirmationStep';
import { SummarySidebar } from '../components/checkout/SummarySidebar';
import { CheckoutSkeleton } from '../components/checkout/CheckoutSkeleton';
import { CheckoutStep as Step } from '../hooks/cart/useCheckout';

const CheckoutPage = () => {
  const checkout = useCheckout();
  const {
    currentStep,
    stepIndex,
    totalSteps,
    availableSteps,
    isFirstStep,
    isLastStep,
    canProceedToNextStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isDeliverySlotActive,
    addressLoading,
    deliveryLoading,
    paymentLoading,
    cartItems,
  } = checkout;

  // Show skeleton while initial data is loading
  if ((addressLoading || paymentLoading) && cartItems.length === 0) {
    return <CheckoutSkeleton />;
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'address':
        return <AddressStep {...checkout} />;
      case 'delivery':
        return <DeliveryStep {...checkout} />;
      case 'payment':
        return <PaymentStep {...checkout} />;
      case 'review':
        return <ReviewStep {...checkout} />;
      case 'confirmation':
        return <ConfirmationStep {...checkout} />;
      default:
        return null;
    }
  };

  // Get step label
  const getStepLabel = (step: Step): string => {
    const labels: Record<Step, string> = {
      address: 'Address',
      delivery: 'Delivery',
      payment: 'Payment',
      review: 'Review Order',
      confirmation: 'Confirmed',
    };
    return labels[step] || step;
  };

  return (
    <>
      <SEOHead 
        title={`Checkout - ${getStepLabel(currentStep)}`}
        description="Complete your order securely with our streamlined checkout process"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
        <div className="container mx-auto px-4">
          {/* Confirmation step takes full width */}
          {currentStep === 'confirmation' ? (
            <div className="max-w-4xl mx-auto">
              <ConfirmationStep {...checkout} />
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="mb-6 sm:mb-8">
                <CheckoutProgress
                  currentStep={currentStep}
                  availableSteps={availableSteps}
                  stepIndex={stepIndex}
                  totalSteps={totalSteps}
                  onStepClick={goToStep}
                  isDeliverySlotActive={isDeliverySlotActive}
                />
              </div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main content - 2 columns on desktop */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                    {renderStepContent()}

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={goToPreviousStep}
                        disabled={isFirstStep}
                        className={`
                          px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300
                          ${isFirstStep
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                          }
                        `}
                      >
                        ← Back
                      </button>

                      <button
                        onClick={goToNextStep}
                        disabled={!canProceedToNextStep || isLastStep}
                        className={`
                          px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300
                          ${canProceedToNextStep && !isLastStep
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg hover:scale-[1.02]'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                          }
                        `}
                      >
                        {currentStep === 'review' ? 'Place Order' : 'Next →'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar - 1 column on desktop */}
                <div className="lg:col-span-1">
                  <SummarySidebar {...checkout} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
