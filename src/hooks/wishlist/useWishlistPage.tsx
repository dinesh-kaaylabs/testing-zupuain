import { useAppSelector } from '../redux';
import { useWishlistDisplayData } from './useWishlistDisplayData';
import { useWishlistFilters } from './useWishlistFilters';
import { useWishlistSelection } from './useWishlistSelection';
import { useWishlistBulkActions } from './useWishlistBulkActions';

export const useWishlistPage = () => {
  // Get wishlist state from Redux
  const { wishlistItems } = useAppSelector((state) => state.wishlist);
  const loading = useAppSelector((state) => state.wishlist.loading);

  // Create display data for all products
  const { displayDataMap } = useWishlistDisplayData({ products: wishlistItems });

  // Handle filtering and sorting
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortedProducts,
  } = useWishlistFilters({ products: wishlistItems, displayDataMap });

  // Handle selection
  const {
    selectedItems,
    selectedCount,
    handleToggleSelect,
    handleSelectAll,
    handleDeselectAll,
    clearSelection,
  } = useWishlistSelection({ products: sortedProducts });

  // Handle bulk actions
  const { handleRemoveSelected, handleMoveSelectedToCart } = useWishlistBulkActions({
    selectedItems,
    products: sortedProducts,
    displayDataMap,
    clearSelection,
  });

  return {
    // State
    wishlistItems,
    loading,
    sortedProducts,
    displayDataMap,
    
    // Search & Sort
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    
    // Selection
    selectedItems,
    selectedCount,
    handleToggleSelect,
    handleSelectAll,
    handleDeselectAll,
    
    // Bulk Actions
    handleRemoveSelected,
    handleMoveSelectedToCart,
  };
};
