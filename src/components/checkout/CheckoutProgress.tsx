import React from 'react';
import { CheckoutStep } from '../../hooks/cart/useCheckout';
import { CheckCircle, Home, Truck, CreditCard, FileText, CheckCircle2 } from 'lucide-react';

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  availableSteps: CheckoutStep[];
  stepIndex: number;
  totalSteps: number;
  onStepClick: (step: CheckoutStep) => void;
  isDeliverySlotActive: boolean;
}

export const CheckoutProgress = ({
  currentStep,
  availableSteps,
  stepIndex,
  onStepClick,
  isDeliverySlotActive,
}: CheckoutProgressProps) => {
  // Step configuration with icons
  const stepConfig: Record<CheckoutStep, { label: string; icon: typeof Home }> = {
    address: { label: 'Address', icon: Home },
    delivery: { label: 'Delivery', icon: Truck },
    payment: { label: 'Payment', icon: CreditCard },
    review: { label: 'Review', icon: FileText },
    confirmation: { label: 'Confirmed', icon: CheckCircle2 },
  };

  // Filter steps based on delivery slot activation
  const visibleSteps = availableSteps.filter(step => step !== 'confirmation');

  const getStepStatus = (step: CheckoutStep, index: number): 'completed' | 'active' | 'pending' => {
    const currentIndex = availableSteps.indexOf(currentStep);
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  const isClickable = (step: CheckoutStep, index: number): boolean => {
    const currentIndex = availableSteps.indexOf(currentStep);
    // Can click on completed steps or current step
    return index <= currentIndex && step !== 'confirmation';
  };

  return (
    <div className="w-full">
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {visibleSteps.map((step, index) => {
            const config = stepConfig[step];
            const Icon = config.icon;
            const status = getStepStatus(step, index);
            const clickable = isClickable(step, index);

            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                {/* Step Circle */}
                <button
                  onClick={() => clickable && onStepClick(step)}
                  disabled={!clickable}
                  className={`
                    relative flex flex-col items-center group
                    ${clickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  `}
                  aria-label={`Go to ${config.label} step`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`
                      relative z-10 flex items-center justify-center w-12 h-12 rounded-full
                      transition-all duration-300 border-2
                      ${
                        status === 'completed'
                          ? 'bg-green-500 border-green-500 text-white'
                          : status === 'active'
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                      }
                      ${clickable && status !== 'active' ? 'group-hover:scale-105 group-hover:shadow-md' : ''}
                    `}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`
                      mt-2 text-sm font-medium whitespace-nowrap transition-colors duration-300
                      ${
                        status === 'active'
                          ? 'text-blue-600 dark:text-blue-400'
                          : status === 'completed'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }
                    `}
                  >
                    {config.label}
                  </span>

                  {/* Step Number Badge (for completed) */}
                  {status === 'completed' && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      ✓
                    </div>
                  )}
                </button>

                {/* Connecting Line */}
                {index < visibleSteps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 relative">
                    <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600" />
                    <div
                      className={`
                        absolute inset-0 transition-all duration-500
                        ${status === 'completed' ? 'bg-green-500' : 'bg-transparent'}
                      `}
                      style={{
                        width: status === 'completed' ? '100%' : '0%',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          {visibleSteps.map((step, index) => {
            const status = getStepStatus(step, index);
            return (
              <div
                key={step}
                className={`
                  h-2 flex-1 mx-1 first:ml-0 last:mr-0 rounded-full transition-all duration-300
                  ${
                    status === 'completed'
                      ? 'bg-green-500'
                      : status === 'active'
                      ? 'bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }
                `}
              />
            );
          })}
        </div>

        {/* Current Step Info */}
        <div className="flex items-center justify-center space-x-3">
          <div
            className={`
              flex items-center justify-center w-10 h-10 rounded-full
              ${
                getStepStatus(currentStep, stepIndex) === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }
            `}
          >
            {React.createElement(stepConfig[currentStep].icon, { className: 'w-5 h-5' })}
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Step {stepIndex + 1} of {visibleSteps.length}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {stepConfig[currentStep].label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

