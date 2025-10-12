import { useState } from 'react';
import { Heart, ShoppingCart, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartActions } from '../../hooks/cart/useCartActions';
import { useWishlistActions } from '../../hooks/wishlist/useWishlistActions';
import type { Product } from '../../types/api';
import type { ProductDisplayData } from '../../utils/productUtils';

interface WishlistCardProps {
  product: Product;
  displayData: ProductDisplayData;
  isSelected: boolean;
  onToggleSelect: (productUid: string) => void;
}

const WishlistCard = ({
  product,
  displayData,
  isSelected,
  onToggleSelect,
}: WishlistCardProps) => {
  const navigate = useNavigate();
  const { handleAddToCart } = useCartActions();
  const { handleRemoveFromWishlist } = useWishlistActions();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);
    await handleRemoveFromWishlist(product.product_uid);
    setIsRemoving(false);
  };

  const handleMoveToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    const success = await handleAddToCart(product, displayData, 1);
    if (success) {
      await handleRemoveFromWishlist(product.product_uid);
    }
    setIsAddingToCart(false);
  };

  const handleCardClick = () => {
    navigate(`/products/${product.product_uid}`);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelect(product.product_uid);
  };

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={displayData.primaryImage}
          alt={displayData.displayName}
          loading="lazy"
          onClick={handleCardClick}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Checkbox Overlay */}
        <button
          onClick={handleCheckboxClick}
          className="absolute top-3 left-3 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all z-10"
          aria-label={isSelected ? 'Deselect item' : 'Select item'}
        >
          {isSelected ? (
            <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <Square className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label="Remove from wishlist"
        >
          {isRemoving ? (
            <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart className="h-5 w-5 text-red-600 fill-red-600" />
          )}
        </button>

        {/* Discount Badge */}
        {displayData.discountPercent > 0 && (
          <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {displayData.discountPercent}% OFF
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!displayData.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4" onClick={handleCardClick}>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 min-h-[3rem]">
          {displayData.displayName}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {displayData.price}
          </span>
          {displayData.discountPercent > 0 && displayData.mrp && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {displayData.mrp}
            </span>
          )}
        </div>

        {/* Move to Cart Button */}
        <button
          onClick={handleMoveToCart}
          disabled={!displayData.isAvailable || isAddingToCart}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Move to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;

