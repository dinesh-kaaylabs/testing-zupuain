import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import { useProductList } from '../hooks/product/useProductList';
import { useProductUtils } from '../hooks/product/useProductUtils';
import { useCartActions } from '../hooks/cart/useCartActions';
import { useWishlistActions } from '../hooks/wishlist/useWishlistActions';
import { useLocalStorage } from '../hooks/utils/useLocalStorage';
import ProductGrid, { ProductGridSkeleton } from '../components/product/ProductGrid';
import FilterSidebar from '../components/product/FilterSidebar';
import Pagination from '../components/product/Pagination';
import InfiniteScroll from '../components/product/InfiniteScroll';

const ProductListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  // Mega-hook with all functionality
  const {
    products,
    categories,
    loading,
    searchQuery,
    selectedCategory,
    selectedSubCategory,
    availability,
    sortBy,
    currentPage,
    hasMore,
    infiniteScrollLoading,
    totalProducts,
    totalPages,
    subCategories,
    hasSubCategories,
    handleSearchChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleAvailabilityChange,
    handleSortChange,
    handlePageChange,
    handleLoadMore,
    handleResetFilters,
  } = useProductList();

  // View mode persistence
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('product-view-mode', 'grid');

  // Scroll mode: 'pagination' or 'infinite'
  const [scrollMode, setScrollMode] = useState<'pagination' | 'infinite'>('pagination');

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Format products for display
  const { formatProductForDisplay } = useProductUtils();
  const productsDisplayData = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      map.set(product.product_uid, formatProductForDisplay(product));
    });
    return map;
  }, [products, formatProductForDisplay]);

  // Cart and wishlist actions
  const { handleAddToCart } = useCartActions();
  const { isInWishlist, handleToggleWishlist } = useWishlistActions();

  // Get category name for SEO
  const selectedCategoryData = categories.find(c => c.category_uid === selectedCategory);
  const categoryName = selectedCategoryData?.category_name || 'All Products';

  // Set category from URL param on mount
  React.useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      handleCategoryChange(categoryParam);
    }
  }, [categoryParam]); // Only run when URL param changes

  return (
    <>
      <SEOHead
        title={`${categoryName} (${totalProducts} products) - Product Catalog`}
        description={`Browse ${totalProducts} products in ${categoryName}. Find the perfect items with advanced filters, sorting options, and detailed product information.`}
        keywords={`${categoryName}, products, shopping, online store, ${selectedSubCategory ? categories.find(c => c.category_uid === selectedCategory)?.sub_category?.find((s: any) => s.sub_category_uid === selectedSubCategory)?.sub_category_name : ''}`}
        type="website"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {categoryName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {/* Scroll Mode Toggle */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                <button
                  onClick={() => setScrollMode('pagination')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    scrollMode === 'pagination'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Pagination
                </button>
                <button
                  onClick={() => setScrollMode('infinite')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    scrollMode === 'infinite'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Infinite
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-label="Grid view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-label="List view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                searchInput={searchQuery}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                availability={availability}
                sortBy={sortBy}
                categories={categories}
                subCategories={subCategories}
                hasSubCategories={hasSubCategories}
                onSearchChange={handleSearchChange}
                onCategoryChange={handleCategoryChange}
                onSubCategoryChange={handleSubCategoryChange}
                onAvailabilityChange={handleAvailabilityChange}
                onSortChange={handleSortChange}
                onResetFilters={handleResetFilters}
              />
            </aside>

            {/* Mobile Filter Drawer */}
            <FilterSidebar
              searchInput={searchQuery}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              availability={availability}
              sortBy={sortBy}
              categories={categories}
              subCategories={subCategories}
              hasSubCategories={hasSubCategories}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onSubCategoryChange={handleSubCategoryChange}
              onAvailabilityChange={handleAvailabilityChange}
              onSortChange={handleSortChange}
              onResetFilters={handleResetFilters}
              isMobile
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
            />

            {/* Products Grid */}
            <main className="flex-1 min-w-0">
              {loading ? (
                <ProductGridSkeleton viewMode={viewMode} count={12} />
              ) : (
                <>
                  <ProductGrid
                    products={products}
                    productsDisplayData={productsDisplayData}
                    viewMode={viewMode}
                    isInWishlist={isInWishlist}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                  />

                  {/* Pagination or Infinite Scroll */}
                  {scrollMode === 'pagination' ? (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  ) : (
                    <InfiniteScroll
                      hasMore={hasMore}
                      loading={infiniteScrollLoading}
                      onLoadMore={handleLoadMore}
                    />
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListPage;
