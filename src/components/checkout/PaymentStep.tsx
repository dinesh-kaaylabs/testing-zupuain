import React from 'react';
import { CreditCard, Smartphone, Building2, Wallet, Shield, Lock } from 'lucide-react';
import { PaymentMethod } from '../../types/api';

interface PaymentStepProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  paymentLoading: boolean;
  paymentError: string | null;
  setPaymentMethod: (method: PaymentMethod | null) => void;
}

export const PaymentStep = ({
  paymentMethods,
  selectedPaymentMethod,
  paymentLoading,
  paymentError,
  setPaymentMethod,
}: PaymentStepProps) => {
  // Get icon for payment method
  const getPaymentIcon = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'cod':
      case 'cash':
        return Wallet;
      case 'razorpay':
      case 'online':
        return CreditCard;
      case 'upi':
        return Smartphone;
      case 'netbanking':
        return Building2;
      case 'wallet':
        return Wallet;
      default:
        return CreditCard;
    }
  };

  // Get badge color for payment method
  const getPaymentBadgeColor = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'cod':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'razorpay':
      case 'online':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'upi':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-blue-600" />
          Payment Method
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Choose your preferred payment method
        </p>
      </div>

      {/* Error Message */}
      {paymentError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{paymentError}</p>
        </div>
      )}

      {/* Loading State */}
      {paymentLoading && paymentMethods.length === 0 ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      ) : paymentMethods.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No payment methods available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please contact support to enable payment options
          </p>
        </div>
      ) : (
        /* Payment Methods Grid */
        <div className="space-y-3">
          {paymentMethods
            .filter(method => method.is_active)
            .map((method) => {
              const Icon = getPaymentIcon(method.slug);
              const isSelected = selectedPaymentMethod?.payment_method_id === method.payment_method_id;

              return (
                <button
                  key={method.payment_method_id}
                  onClick={() => setPaymentMethod(method)}
                  className={`
                    w-full p-4 rounded-lg border-2 transition-all duration-300 text-left
                    ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    {/* Left side - Icon & Details */}
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div
                        className={`
                          flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                          ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }
                        `}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3
                            className={`
                              font-semibold
                              ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}
                            `}
                          >
                            {method.method_name}
                          </h3>
                          
                          {/* Verified Badge */}
                          {method.is_verified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {method.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {method.description}
                          </p>
                        )}

                        {/* Additional Info */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {/* Payment Type Badge */}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentBadgeColor(method.slug)}`}>
                            {method.slug.toUpperCase()}
                          </span>

                          {/* Processing Fee (if COD) */}
                          {method.slug.toLowerCase() === 'cod' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                              Processing fee may apply
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Radio Button */}
                    <div className="flex-shrink-0 ml-4">
                      <div
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                          ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300 dark:border-gray-600'
                          }
                        `}
                      >
                        {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      )}

      {/* Security Badge */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
          <Lock className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Safe & Secure Payments
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100">SSL Encrypted</h5>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                256-bit encryption
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <Lock className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-green-900 dark:text-green-100">PCI Compliant</h5>
              <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                Industry standard security
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Payment Summary */}
      {selectedPaymentMethod && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-800/30 rounded-full flex items-center justify-center">
              {React.createElement(getPaymentIcon(selectedPaymentMethod.slug), { 
                className: 'w-5 h-5 text-blue-600 dark:text-blue-400' 
              })}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Payment Method Selected
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {selectedPaymentMethod.method_name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

