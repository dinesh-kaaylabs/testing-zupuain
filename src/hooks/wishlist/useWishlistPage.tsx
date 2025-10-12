import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux';
import { getUserWishlist } from '../../store/slices/wishlistSlice';
import { useWishlistDisplayData } from './useWishlistDisplayData';
import { useWishlistFilters, type SortOption } from './useWishlistFilters';
import { useWishlistSelection } from './useWishlistSelection';
import { useWishlistBulkActions } from './useWishlistBulkActions';
import type { Product } from '../../types/api';
import type { ProductDisplayData } from '../../utils/productUtils';

interface UseWishlistPageReturn {
  wishlistItems: Product[];
  loading: boolean;
  sortedProducts: Product[];
  displayDataMap: Map<string, ProductDisplayData>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  selectedItems: Set<string>;
  selectedCount: number;
  handleToggleSelect: (productUid: string) => void;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleRemoveSelected: () => Promise<void>;
  handleMoveSelectedToCart: () => Promise<void>;
}

/**
 * PRIMARY HOOK for Wishlist Page
 * Composes all wishlist functionality into a single hook
 * 
 * Usage:
 * ```tsx
 * const {
 *   wishlistItems,
 *   loading,
 *   sortedProducts,
 *   displayDataMap,
 *   searchQuery,
 *   setSearchQuery,
 *   sortBy,
 *   setSortBy,
 *   selectedItems,
 *   selectedCount,
 *   handleToggleSelect,
 *   handleSelectAll,
 *   handleDeselectAll,
 *   handleRemoveSelected,
 *   handleMoveSelectedToCart,
 * } = useWishlistPage();
 * ```
 */
export const useWishlistPage = (): UseWishlistPageReturn => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.wishlistItems);
  const loading = useAppSelector((state) => state.wishlist.loading);

  // Fetch wishlist on mount
  useEffect(() => {
    dispatch(getUserWishlist());
  }, [dispatch]);

  // Create display data map
  const { displayDataMap } = useWishlistDisplayData({
    products: wishlistItems,
  });

  // Handle search and sort
  const { searchQuery, setSearchQuery, sortBy, setSortBy, sortedProducts } =
    useWishlistFilters({
      products: wishlistItems,
      displayDataMap,
    });

  // Handle selection
  const {
    selectedItems,
    selectedCount,
    handleToggleSelect,
    handleSelectAll,
    handleDeselectAll,
    clearSelection,
  } = useWishlistSelection({
    products: sortedProducts, // Use sorted products for selection
  });

  // Handle bulk actions
  const { handleRemoveSelected, handleMoveSelectedToCart } =
    useWishlistBulkActions({
      selectedItems,
      products: wishlistItems,
      displayDataMap,
      clearSelection,
    });

  return {
    wishlistItems,
    loading,
    sortedProducts,
    displayDataMap,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedItems,
    selectedCount,
    handleToggleSelect,
    handleSelectAll,
    handleDeselectAll,
    handleRemoveSelected,
    handleMoveSelectedToCart,
  };
};
