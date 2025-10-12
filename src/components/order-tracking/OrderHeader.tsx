import { ChevronLeft, RefreshCw, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderHeaderProps {
  displayOrderNumber: string;
  formattedDate: string | null;
  isNew?: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onCancel?: () => void;
  canCancel: boolean;
}

const OrderHeader = ({
  displayOrderNumber,
  formattedDate,
  isNew = false,
  onRefresh,
  isRefreshing,
  onCancel,
  canCancel,
}: OrderHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700">
      {/* Breadcrumb */}
      <div className="px-6 pt-4 pb-2">
        <button
          onClick={() => navigate('/account?tab=orders')}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </button>
      </div>

      {/* Header Content */}
      <div className="px-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Order #{displayOrderNumber}
              </h1>
              {isNew && (
                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold rounded-full">
                  NEW
                </span>
              )}
            </div>
            {formattedDate && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Placed on {formattedDate}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${
                  isRefreshing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                }
              `}
              title="Refresh order details"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Cancel Button */}
            {canCancel && onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg font-medium transition-all border border-red-200 dark:border-red-800"
                title="Cancel order"
              >
                <XCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Cancel Order</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;

