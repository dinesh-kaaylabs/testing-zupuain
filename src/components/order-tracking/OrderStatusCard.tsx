import { CheckCircle2, Clock, Package, Truck, XCircle, AlertCircle } from 'lucide-react';
import { ORDER_STATUS_COLORS } from '../../utils/constants';

interface OrderStatusCardProps {
  status: string;
  statusMessage?: string;
  estimatedDelivery?: string;
  timestamp?: string;
}

const getStatusIcon = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'delivered':
      return <CheckCircle2 className="h-8 w-8" />;
    case 'shipped':
    case 'out_for_delivery':
      return <Truck className="h-8 w-8" />;
    case 'processing':
    case 'confirmed':
      return <Package className="h-8 w-8" />;
    case 'cancelled':
      return <XCircle className="h-8 w-8" />;
    case 'pending':
      return <Clock className="h-8 w-8" />;
    default:
      return <AlertCircle className="h-8 w-8" />;
  }
};

const getStatusColor = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  const colorMap: Record<string, string> = {
    delivered: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    shipped: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    out_for_delivery: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    processing: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    confirmed: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    pending: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    cancelled: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };
  return colorMap[normalizedStatus] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
};

const OrderStatusCard = ({ 
  status, 
  statusMessage, 
  estimatedDelivery,
  timestamp 
}: OrderStatusCardProps) => {
  const statusColor = getStatusColor(status);
  const statusIcon = getStatusIcon(status);
  const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Order Status
      </h2>

      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div className={`flex-shrink-0 p-4 rounded-full border-2 ${statusColor}`}>
          {statusIcon}
        </div>

        {/* Status Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {displayStatus}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              ORDER_STATUS_COLORS[status.toLowerCase()] || ORDER_STATUS_COLORS.default
            }`}>
              {displayStatus}
            </span>
          </div>

          {statusMessage && (
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {statusMessage}
            </p>
          )}

          {timestamp && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
              Updated: {new Date(timestamp).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          )}

          {estimatedDelivery && status.toLowerCase() !== 'delivered' && status.toLowerCase() !== 'cancelled' && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Estimated Delivery
              </p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {new Date(estimatedDelivery).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar (for non-cancelled/delivered orders) */}
      {status.toLowerCase() !== 'cancelled' && status.toLowerCase() !== 'delivered' && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                status.toLowerCase() === 'pending' ? 'bg-amber-500 w-1/4' :
                status.toLowerCase() === 'confirmed' ? 'bg-purple-500 w-1/2' :
                status.toLowerCase() === 'processing' ? 'bg-purple-500 w-1/2' :
                status.toLowerCase() === 'shipped' ? 'bg-blue-500 w-3/4' :
                'bg-green-500 w-full'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusCard;

