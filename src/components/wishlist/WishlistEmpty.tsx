import { Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WishlistEmptyProps {
  searchQuery?: string;
  totalItems: number;
}

const WishlistEmpty = ({ searchQuery, totalItems }: WishlistEmptyProps) => {
  const navigate = useNavigate();

  const isSearching = searchQuery && searchQuery.trim().length > 0;

  if (isSearching) {
    // Search results empty state
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
            <Heart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No items match your search
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find any items matching "{searchQuery}"
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Showing 0 of {totalItems} items
          </p>
        </div>
      </div>
    );
  }

  // Completely empty wishlist
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full mb-6">
          <Heart className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Your wishlist is empty
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Save items you love to your wishlist and shop them later
        </p>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          <ShoppingBag className="h-5 w-5" />
          Start Shopping
        </button>
      </div>
    </div>
  );
};

export default WishlistEmpty;

