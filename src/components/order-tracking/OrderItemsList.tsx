import { Package, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: number;
  product_uid: string;
  name: string;
  image: string;
  quantity: number;
  units?: string;
  unitPriceFormatted: string;
  totalPriceFormatted: string;
}

interface OrderItemsListProps {
  items: OrderItem[];
  totalItems: number;
}

const OrderItemsList = ({ items, totalItems }: OrderItemsListProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Items ({totalItems})
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`
              flex gap-4 pb-4
              ${index !== items.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}
            `}
          >
            {/* Product Image */}
            <Link
              to={`/products/${item.product_uid}`}
              className="flex-shrink-0 group relative overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.png';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                <ExternalLink className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <Link
                to={`/products/${item.product_uid}`}
                className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 block mb-1"
              >
                {item.name}
              </Link>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                <span>Qty: {item.quantity}{item.units ? ` ${item.units}` : ''}</span>
                <span>•</span>
                <span>Unit Price: {item.unitPriceFormatted}</span>
              </div>

              {/* SKU if available */}
              {item.product_uid && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  SKU: {item.product_uid}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex-shrink-0 text-right">
              <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {item.totalPriceFormatted}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Total
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>Total Items</span>
          <span className="font-semibold">{totalItems}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsList;

