import { FileText, Edit, MapPin, Truck, CreditCard, Tag, X, ShoppingBag } from 'lucide-react';
import { Address, PaymentMethod, DeliverySlot, BagDetail, CartItem } from '../../types/api';
import { formatCurrency } from '../../utils/currencyFormatter';

interface ReviewStepProps {
  // Address
  selectedAddress: Address | null;
  goToStep: (step: any) => void;
  
  // Delivery
  selectedDeliveryDate: string | null;
  selectedDeliverySlot: DeliverySlot | null;
  isDeliverySlotActive: boolean;
  
  // Payment
  selectedPaymentMethod: PaymentMethod | null;
  
  // Cart & Pricing
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
  appliedCoupon: any;
  handleRemoveCoupon: () => void;
  
  // Terms
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  
  // Order
  handlePlaceOrder: () => Promise<void>;
  orderLoading: boolean;
}

export const ReviewStep = ({
  selectedAddress,
  goToStep,
  selectedDeliveryDate,
  selectedDeliverySlot,
  isDeliverySlotActive,
  selectedPaymentMethod,
  cartItems,
  pricing,
  appliedCoupon,
  handleRemoveCoupon,
  termsAccepted,
  setTermsAccepted,
  handlePlaceOrder,
  orderLoading,
}: ReviewStepProps) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-600" />
          Review Your Order
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Please review your order details before placing the order
        </p>
      </div>

      {/* Delivery Address */}
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Delivery Address</h3>
          </div>
          <button
            onClick={() => goToStep('address')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1 text-sm"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>
        {selectedAddress && (
          <div className="pl-7">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {selectedAddress.address_tag || 'Other'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedAddress.complete_address || selectedAddress.address}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
            </p>
          </div>
        )}
      </div>

      {/* Delivery Schedule (Conditional) */}
      {isDeliverySlotActive && selectedDeliveryDate && selectedDeliverySlot && (
        <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Delivery Schedule</h3>
            </div>
            <button
              onClick={() => goToStep('delivery')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1 text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
          <div className="pl-7">
            <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
              {formatDate(selectedDeliveryDate)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedDeliverySlot.delivery_time || `${selectedDeliverySlot.start_time} - ${selectedDeliverySlot.end_time}`}
            </p>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Payment Method</h3>
          </div>
          <button
            onClick={() => goToStep('payment')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1 text-sm"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>
        {selectedPaymentMethod && (
          <div className="pl-7">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {selectedPaymentMethod.method_name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {selectedPaymentMethod.slug.toUpperCase()}
            </p>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center space-x-2 mb-3">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Order Items ({cartItems.length})
          </h3>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {cartItems.map((item, index) => {
            const isBag = 'bag_detail_id' in item;
            const product = isBag ? item.zm_products?.[0] : null;
            const name = isBag ? product?.product_name : item.product_name;
            const image = isBag ? product?.product_image?.[0]?.product_image : item.product_image;
            const price = isBag ? item.selling_price : parseFloat(item.price);
            const quantity = item.product_count;

            return (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                <img
                  src={image || '/placeholder.png'}
                  alt={name || 'Product'}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Qty: {quantity}
                  </p>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(price * quantity)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Applied Coupon */}
      {appliedCoupon && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  Coupon Applied: {appliedCoupon.coupon_code}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                  {appliedCoupon.description}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
              aria-label="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Price Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
            <span className="text-gray-900 dark:text-gray-100">{formatCurrency(pricing.subtotal)}</span>
          </div>
          
          {pricing.productDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Product Discount</span>
              <span>- {formatCurrency(pricing.productDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Delivery Charge</span>
            {pricing.isFreeDelivery ? (
              <span className="text-green-600 dark:text-green-400 font-medium">FREE</span>
            ) : (
              <span className="text-gray-900 dark:text-gray-100">{formatCurrency(pricing.deliveryCharge)}</span>
            )}
          </div>

          {pricing.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Coupon Discount</span>
              <span>- {formatCurrency(pricing.discount)}</span>
            </div>
          )}

          {pricing.codCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">COD Charge</span>
              <span className="text-gray-900 dark:text-gray-100">{formatCurrency(pricing.codCharge)}</span>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(pricing.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <label className="flex items-start space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 cursor-pointer"
            required
          />
          <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
            I agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Terms and Conditions
            </a>
            {' '}and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Privacy Policy
            </a>
          </span>
        </label>
        {!termsAccepted && (
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2 ml-8">
            Please accept the terms and conditions to proceed
          </p>
        )}
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={!termsAccepted || orderLoading}
        className={`
          w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2
          ${
            termsAccepted && !orderLoading
              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {orderLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Placing Order...</span>
          </>
        ) : (
          <>
            <span>Place Order</span>
            <span>•</span>
            <span>{formatCurrency(pricing.total)}</span>
          </>
        )}
      </button>
    </div>
  );
};

