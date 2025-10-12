import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderErrorStateProps {
  error: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const OrderErrorState = ({ error, onRetry, isRetrying = false }: OrderErrorStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/30 rounded-full animate-pulse" />
            <div className="relative bg-orange-100 dark:bg-orange-900/50 rounded-full p-6">
              <AlertCircle className="h-20 w-20 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Something Went Wrong
          </h1>

          {/* Error Message */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700 dark:text-red-400">
              {error || 'An unexpected error occurred while loading your order details.'}
            </p>
          </div>

          {/* Suggestions */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please try refreshing the page or check your internet connection.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            {onRetry && (
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold text-white
                  transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    isRetrying
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg hover:scale-[1.02]'
                  }
                `}
              >
                <RefreshCw className={`h-5 w-5 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
            )}
            
            <button
              onClick={() => navigate('/account?tab=orders')}
              className="w-full py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              View All Orders
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderErrorState;

