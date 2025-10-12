import { useState, useMemo, useCallback } from 'react';
import type { Product } from '../../types/api';
import type { ProductDisplayData } from '../../utils/productUtils';

export type SortOption = 'recent' | 'price-low' | 'price-high' | 'name';

interface UseWishlistFiltersParams {
  products: Product[];
  displayDataMap: Map<string, ProductDisplayData>;
}

interface UseWishlistFiltersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  sortedProducts: Product[];
}

export const useWishlistFilters = ({
  products,
  displayDataMap,
}: UseWishlistFiltersParams): UseWishlistFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Filter by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
      const displayData = displayDataMap.get(product.product_uid);
      if (!displayData) return false;

      return (
        displayData.displayName.toLowerCase().includes(query) ||
        product.product_uid.toLowerCase().includes(query) ||
        (displayData.brand && displayData.brand.toLowerCase().includes(query))
      );
    });
  }, [products, searchQuery, displayDataMap]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'recent':
        // Most recent first - keep original order (wishlist order)
        return sorted;

      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = displayDataMap.get(a.product_uid)?.discountedPrice || 0;
          const priceB = displayDataMap.get(b.product_uid)?.discountedPrice || 0;
          return priceA - priceB;
        });

      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = displayDataMap.get(a.product_uid)?.discountedPrice || 0;
          const priceB = displayDataMap.get(b.product_uid)?.discountedPrice || 0;
          return priceB - priceA;
        });

      case 'name':
        return sorted.sort((a, b) => {
          const nameA = displayDataMap.get(a.product_uid)?.displayName || '';
          const nameB = displayDataMap.get(b.product_uid)?.displayName || '';
          return nameA.localeCompare(nameB);
        });

      default:
        return sorted;
    }
  }, [filteredProducts, sortBy, displayDataMap]);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSetSortBy = useCallback((sort: SortOption) => {
    setSortBy(sort);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    sortBy,
    setSortBy: handleSetSortBy,
    sortedProducts,
  };
};
