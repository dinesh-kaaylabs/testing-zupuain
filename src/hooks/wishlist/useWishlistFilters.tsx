import { useState, useMemo } from 'react';
import type { Product } from '../../types/api';
import type { ProductDisplayData } from '../../utils/productUtils';

export type SortOption = 'recent' | 'price-low' | 'price-high' | 'name';

interface UseWishlistFiltersProps {
  products: Product[];
  displayDataMap: Map<string, ProductDisplayData>;
}

export const useWishlistFilters = ({ products, displayDataMap }: UseWishlistFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
      const displayData = displayDataMap.get(product.product_uid);
      if (!displayData) return false;

      return (
        displayData.displayName.toLowerCase().includes(query) ||
        displayData.brand?.toLowerCase().includes(query) ||
        product.product_name.toLowerCase().includes(query)
      );
    });
  }, [products, searchQuery, displayDataMap]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const productsCopy = [...filteredProducts];

    switch (sortBy) {
      case 'price-low':
        return productsCopy.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceA - priceB;
        });
      case 'price-high':
        return productsCopy.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceB - priceA;
        });
      case 'name':
        return productsCopy.sort((a, b) => {
          const nameA = displayDataMap.get(a.product_uid)?.displayName || '';
          const nameB = displayDataMap.get(b.product_uid)?.displayName || '';
          return nameA.localeCompare(nameB);
        });
      case 'recent':
      default:
        return productsCopy; // Keep original order (most recent first)
    }
  }, [filteredProducts, sortBy, displayDataMap]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredProducts,
    sortedProducts,
  };
};
