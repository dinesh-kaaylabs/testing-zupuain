import { useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { BagDetail, CartItem } from '../../types/api';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useCartItemData } from '../../hooks/cart/useCartItemData';

interface SummarySidebarProps {
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
  appliedCoupon: any;
  currentStep: string;
}

// Helper component to use the hook for each item
const CartItemPreview = ({ item }: { item: BagDetail | CartItem }) => {
  const { name, image, quantity, units } = useCartItemData(item);

  return (
    <div className="flex items-center space-x-2">
      <img
        src={image || '/placeholder.png'}
        alt={name || 'Product'}
        className="w-10 h-10 object-cover rounded border border-gray-200 dark:border-gray-700"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
          {name}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Qty: {quantity}{units ? ` ${units}` : ''}
        </p>
      </div>
    </div>
  );
};

export const SummarySidebar = ({
  cartItems,
  pricing,
  appliedCoupon,
  currentStep,
}: SummarySidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const totalItems = cartItems.reduce((sum, item) => sum + item.product_count, 0);
  const totalSavings = pricing.productDiscount + pricing.discount + pricing.deliveryDiscount;

  return (
    <div className="lg:sticky lg:top-24">
      {/* Mobile Collapsible Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between mb-4 shadow-sm"
      >
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Order Summary
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {totalItems} items • {formatCurrency(pricing.total)}
            </p>
          </div>
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Sidebar Content */}
      <div
        className={`
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden
          transition-all duration-300
          ${isCollapsed ? 'max-h-0 lg:max-h-none border-0 lg:border' : 'max-h-[2000px]'}
        `}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Order Summary
            </h3>
          </div>

          {/* Cart Items Preview */}
          {currentStep !== 'confirmation' && (
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'} in cart
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cartItems.slice(0, 3).map((item, index) => (
                  <CartItemPreview key={index} item={item} />
                ))}
                {cartItems.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                    + {cartItems.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-3 mb-4">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {formatCurrency(pricing.subtotal)}
              </span>
            </div>

            {/* Product Discount */}
            {pricing.productDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 dark:text-green-400">Product Discount</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  - {formatCurrency(pricing.productDiscount)}
                </span>
              </div>
            )}

            {/* Delivery Charge */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Delivery Charge</span>
              {pricing.isFreeDelivery ? (
                <div className="flex items-center space-x-2">
                  {pricing.baseDeliveryCharge > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      {formatCurrency(pricing.baseDeliveryCharge)}
                    </span>
                  )}
                  <span className="text-green-600 dark:text-green-400 font-semibold">FREE</span>
                </div>
              ) : (
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {formatCurrency(pricing.deliveryCharge)}
                </span>
              )}
            </div>

            {/* Delivery Discount */}
            {pricing.deliveryDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 dark:text-green-400">Delivery Discount</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  - {formatCurrency(pricing.deliveryDiscount)}
                </span>
              </div>
            )}

            {/* Coupon Discount */}
            {pricing.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 dark:text-green-400 flex items-center">
                  <Tag className="w-3 h-3 mr-1" />
                  Coupon Discount
                </span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  - {formatCurrency(pricing.discount)}
                </span>
              </div>
            )}

            {/* COD Charge */}
            {pricing.codCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">COD Charges</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {formatCurrency(pricing.codCharge)}
                </span>
              </div>
            )}

            {/* Tax */}
            {pricing.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {formatCurrency(pricing.tax)}
                </span>
              </div>
            )}
          </div>

          {/* Total Savings Banner */}
          {totalSavings > 0 && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900 dark:text-green-100">
                  Total Savings
                </span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalSavings)} 🎉
                </span>
              </div>
            </div>
          )}

          {/* Applied Coupon */}
          {appliedCoupon && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                    Coupon Applied
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                    {appliedCoupon.coupon_code}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  (Inclusive of all taxes)
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(pricing.total)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

