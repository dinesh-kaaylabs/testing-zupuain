import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useAppDispatch } from '../redux/useAppDispatch';
import { useAppSelector } from '../redux/useAppSelector';
import { 
  searchProducts, 
  loadMoreProducts, 
  getAllCategories,
  setSearchQuery,
  setSortBy,
  setAvailability,
  setSelectedCategory,
  setSelectedSubCategory,
  setCurrentPage,
  resetFilters,
  clearProducts
} from '../../store/slices/productSlice';
import { useDebounce } from '../utils/useDebounce';
import { DEFAULT_LIMIT } from '../../utils/constants';
import { Product } from '../../types/api';

export const useProductList = () => {
  const dispatch = useAppDispatch();
  
  // Memoize selector to prevent unnecessary re-renders
  const productState = useAppSelector((state) => state.product);
  const {
    products,
    categories,
    main,
    infiniteScroll,
    searchQuery,
    sortBy,
    availability,
    selectedCategory,
    selectedSubCategory,
    currentPage,
    hasMore,
    totalProducts
  } = productState;

  // Use searchQuery directly from Redux instead of duplicating in local state
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [viewMode, setViewMode] = useState<'pagination' | 'infinite'>('pagination');
  const initialLoadTriggered = useRef(false);
  const isSearching = useRef(false);
  const previousDebouncedQuery = useRef(searchQuery);
  
  // Price range and rating filter states
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedRating, setSelectedRating] = useState(0);

  const totalPages = useMemo(() => Math.ceil(totalProducts / DEFAULT_LIMIT), [totalProducts]);

  // Memoize rating calculation to avoid recalculating on every render
  const calculateAverageRating = useCallback((product: Product): number => {
    if (!product.product_ratings?.length) return 0;
    const sum = product.product_ratings.reduce((acc: number, rating) => acc + rating.ratings, 0);
    return sum / product.product_ratings.length;
  }, []);

  // Apply price and rating filters - only when filters change
  const filteredProducts = useMemo(() => {
    // Skip filtering if no filters are active
    if (priceRange.min === 0 && priceRange.max === 10000 && selectedRating === 0) {
      return products;
    }

    return products.filter((product) => {
      const price = parseFloat(product.price);
      const isPriceInRange = price >= priceRange.min && (priceRange.max === 0 || price <= priceRange.max);
      
      if (!isPriceInRange) return false;
      
      if (selectedRating > 0) {
        const avgRating = calculateAverageRating(product);
        return avgRating > 0 && avgRating >= selectedRating;
      }
      
      return true;
    });
  }, [products, priceRange.min, priceRange.max, selectedRating, calculateAverageRating]);

  // Memoize search params object creation
  const getSearchParams = useCallback((overrides = {}) => ({
    searchQuery,
    sortBy,
    availability,
    category_uid: selectedCategory,
    sub_category_uid: selectedSubCategory,
    ...overrides
  }), [searchQuery, sortBy, availability, selectedCategory, selectedSubCategory]);

  const performSearch = useCallback((params = {}) => {
    if (isSearching.current) return;
    isSearching.current = true;
    dispatch(clearProducts());
    dispatch(searchProducts({ ...getSearchParams(params), reset: true })).finally(() => {
      isSearching.current = false;
    });
  }, [dispatch, getSearchParams]);

  // Load categories once on mount
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Initial product load - only once
  useEffect(() => {
    if (!initialLoadTriggered.current && products.length === 0 && !main.loading) {
      initialLoadTriggered.current = true;
      dispatch(searchProducts({ reset: true }));
    }
  }, [dispatch, products.length, main.loading]);

  // Handle debounced search - trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== previousDebouncedQuery.current) {
      previousDebouncedQuery.current = debouncedSearchQuery;
      dispatch(clearProducts());
      dispatch(searchProducts({ searchQuery: debouncedSearchQuery, reset: true }));
    }
  }, [debouncedSearchQuery, dispatch]);

  // Optimized handlers - combined Redux action + search into single function
  const handleSortChange = useCallback((newSortBy: string) => {
    if (newSortBy === sortBy) return;
    dispatch(setSortBy(newSortBy));
    dispatch(clearProducts());
    dispatch(searchProducts({ sortBy: newSortBy, reset: true }));
  }, [dispatch, sortBy]);

  const handleAvailabilityChange = useCallback((newAvailability: string) => {
    if (newAvailability === availability) return;
    dispatch(setAvailability(newAvailability));
    dispatch(clearProducts());
    dispatch(searchProducts({ availability: newAvailability, reset: true }));
  }, [dispatch, availability]);

  const handleCategoryChange = useCallback((categoryUid: string) => {
    if (categoryUid === selectedCategory) return;
    dispatch(setSelectedCategory(categoryUid));
    dispatch(setSelectedSubCategory(''));
    dispatch(clearProducts());
    dispatch(searchProducts({ category_uid: categoryUid, sub_category_uid: '', reset: true }));
  }, [dispatch, selectedCategory]);

  const handleSubCategoryChange = useCallback((subCategoryUid: string) => {
    if (subCategoryUid === selectedSubCategory) return;
    dispatch(setSelectedSubCategory(subCategoryUid));
    dispatch(clearProducts());
    dispatch(searchProducts({ sub_category_uid: subCategoryUid, reset: true }));
  }, [dispatch, selectedSubCategory]);

  const handlePageChange = useCallback((page: number) => {
    if (page === currentPage) return;
    dispatch(setCurrentPage(page));
    dispatch(searchProducts({ 
      searchQuery,
      sortBy,
      availability,
      category_uid: selectedCategory,
      sub_category_uid: selectedSubCategory,
      offset: page, 
      reset: false 
    }));
  }, [dispatch, currentPage, searchQuery, sortBy, availability, selectedCategory, selectedSubCategory]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !infiniteScroll.loading && !main.loading) {
      dispatch(loadMoreProducts());
    }
  }, [dispatch, hasMore, infiniteScroll.loading, main.loading]);

  // Simplified handlers without unnecessary callbacks
  const handlePriceRangeChange = useCallback((range: { min: number; max: number }) => {
    setPriceRange(range);
  }, []);

  const handleRatingChange = useCallback((rating: number) => {
    setSelectedRating(rating);
  }, []);

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
    setPriceRange({ min: 0, max: 10000 });
    setSelectedRating(0);
    // No need to call searchProducts - resetFilters already clears products
  }, [dispatch]);

  const handleViewModeChange = useCallback((mode: 'pagination' | 'infinite') => {
    setViewMode(mode);
  }, []);

  const refetch = useCallback(() => {
    initialLoadTriggered.current = false;
    dispatch(clearProducts());
    dispatch(searchProducts({ reset: true }));
  }, [dispatch]);

  // Handler for search input - dispatch directly to Redux
  const handleSearchChange = useCallback((value: string) => {
    dispatch(setSearchQuery(value));
  }, [dispatch]);

  return {
    products,
    filteredProducts,
    categories,
    loading: main.loading,
    error: main.error,
    searchQuery, // Return searchQuery directly from Redux
    sortBy,
    availability,
    selectedCategory,
    selectedSubCategory,
    currentPage,
    hasMore,
    infiniteScrollLoading: infiniteScroll.loading,
    totalProducts,
    totalPages,
    viewMode,
    priceRange,
    selectedRating,
    // Handlers
    handleSearchChange,
    handleSortChange,
    handleAvailabilityChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handlePageChange,
    handleLoadMore,
    handlePriceRangeChange,
    handleRatingChange,
    handleResetFilters,
    handleViewModeChange,
    refetch,
    // Utilities
    calculateAverageRating,
  };
};
