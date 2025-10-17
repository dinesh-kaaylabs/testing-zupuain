import { CheckCircle, Package, Truck, Download, Share2, Home, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/currencyFormatter';
import { DecodedOrderData } from '../../types/api';

interface ConfirmationStepProps {
  orderUid: string | null;
  orderConfirmationData: DecodedOrderData | null;
  pricing: {
    total: number;
  };
  selectedDeliveryDate?: string | null;
  resetCheckout: () => void;
}

export const ConfirmationStep = ({
  orderUid,
  orderConfirmationData,
  pricing,
  selectedDeliveryDate,
  resetCheckout,
}: ConfirmationStepProps) => {
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    if (orderUid) {
      navigate(`/order/${orderUid}`);
    }
  };

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download
    console.log('Downloading invoice for order:', orderUid);
  };

  const handleShareOrder = async () => {
    if (navigator.share && orderUid) {
      try {
        await navigator.share({
          title: 'Order Confirmation',
          text: `Order #${orderUid} placed successfully!`,
          url: window.location.origin + `/orders/${orderUid}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleContinueShopping = () => {
    resetCheckout();
    navigate('/products');
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Determine payment status
  const getPaymentStatus = () => {
    if (!orderConfirmationData) return { status: 'Pending', color: 'yellow' };
    
    const txStatus = orderConfirmationData.txStatus?.toLowerCase();
    if (txStatus === 'success' || txStatus === 'completed') {
      return { status: 'Paid', color: 'green' };
    } else if (txStatus === 'pending') {
      return { status: 'Pending', color: 'yellow' };
    } else if (txStatus === 'cod') {
      return { status: 'Cash on Delivery', color: 'blue' };
    } else {
      return { status: 'Processing', color: 'blue' };
    }
  };

  const paymentStatus = getPaymentStatus();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Success Banner */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 animate-bounce-slow">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white dark:bg-gray-800 border-2 border-green-500 dark:border-green-700 rounded-lg p-6 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Order Number */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order ID</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 font-mono">
              {orderUid || 'N/A'}
            </p>
          </div>

          {/* Payment Status */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Status</p>
            <span
              className={`
                inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
                ${
                  paymentStatus.color === 'green'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                    : paymentStatus.color === 'yellow'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                }
              `}
            >
              {paymentStatus.status}
            </span>
          </div>

          {/* Order Amount */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(orderConfirmationData?.order_price || pricing.total)}
            </p>
          </div>

          {/* Estimated Delivery */}
          {selectedDeliveryDate && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Delivery</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(selectedDeliveryDate)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          What's Next?
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Order Confirmation</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                You'll receive a confirmation email with order details
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Order Processing</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                We'll prepare your order for shipment
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Delivery Updates</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                Track your order in real-time with notifications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleTrackOrder}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
        >
          <Truck className="w-5 h-5" />
          <span>Track Order</span>
        </button>

        <button
          onClick={handleDownloadInvoice}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
        >
          <Download className="w-5 h-5" />
          <span>Download Invoice</span>
        </button>
      </div>

      {/* Share Button */}
      {navigator.share && (
        <button
          onClick={handleShareOrder}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-all duration-300"
        >
          <Share2 className="w-5 h-5" />
          <span>Share Order Details</span>
        </button>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-all duration-300"
        >
          <Home className="w-5 h-5" />
          <span>Go to Home</span>
        </button>

        <button
          onClick={handleContinueShopping}
          className="flex items-center justify-center space-x-2 px-6 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-all duration-300"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Support Info */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Need help with your order?{' '}
          <a href="/support" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

