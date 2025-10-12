import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { getUserWishlist, removeFromWishlist, moveToCart } from '../../store/slices/wishlistSlice';
import { formatCurrency } from '../../utils';
import { useEffect } from 'react';

const WishlistOverview = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.wishlistItems);
  const loading = useAppSelector((state) => state.wishlist.loading);

  useEffect(() => {
    dispatch(getUserWishlist());
  }, [dispatch]);

  const handleRemove = (productUid: string) => {
    dispatch(removeFromWishlist(productUid));
  };

  const handleMoveToCart = (productUid: string) => {
    dispatch(moveToCart(productUid));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Wishlist is Empty</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Save your favorite items here</p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Wishlist ({wishlistItems.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item: any) => {
          const discountPercent = item.mrp_price > item.selling_price
            ? Math.round(((item.mrp_price - item.selling_price) / item.mrp_price) * 100)
            : 0;

          return (
            <div
              key={item.product_uid}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src={item.product_image || '/placeholder-product.png'}
                  alt={item.product_name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.png';
                  }}
                />
                {discountPercent > 0 && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    -{discountPercent}%
                  </span>
                )}
                <button
                  onClick={() => handleRemove(item.product_uid)}
                  className="absolute top-2 left-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {item.product_name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {formatCurrency(item.selling_price)}
                  </span>
                  {item.mrp_price > item.selling_price && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      {formatCurrency(item.mrp_price)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleMoveToCart(item.product_uid)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistOverview;

