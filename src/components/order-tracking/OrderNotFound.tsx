import { PackageX, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-ping opacity-75" />
            <div className="relative bg-red-100 dark:bg-red-900/50 rounded-full p-6">
              <PackageX className="h-20 w-20 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Order Not Found
          </h1>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            We couldn't find the order you're looking for. It may have been deleted or the link might be incorrect.
          </p>

          {/* Suggestions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Suggestions:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-6">
              <li>• Check your order history</li>
              <li>• Verify the order number</li>
              <li>• Contact customer support</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/account?tab=orders')}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              View Order History
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNotFound;

