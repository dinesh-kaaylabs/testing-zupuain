import { useWishlistPage } from '../hooks/wishlist/useWishlistPage';
import WishlistHeader from '../components/wishlist/WishlistHeader';
import BulkActionsBar from '../components/wishlist/BulkActionsBar';
import WishlistGrid from '../components/wishlist/WishlistGrid';
import WishlistEmpty from '../components/wishlist/WishlistEmpty';
import WishlistSkeleton from '../components/wishlist/WishlistSkeleton';
import SEOHead from '../components/common/SEOHead';

const WishlistPage = () => {
  const {
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
  } = useWishlistPage();

  // Show loading skeleton on initial load
  if (loading && wishlistItems.length === 0) {
    return <WishlistSkeleton />;
  }

  const totalItems = wishlistItems.length;
  const hasSearchResults = sortedProducts.length > 0;

  return (
    <>
      <SEOHead
        title="My Wishlist - LuxeHome"
        description="Your saved products and favorites"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Search and Sort */}
          <WishlistHeader
            totalItems={totalItems}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Bulk Actions Bar */}
          {totalItems > 0 && (
            <BulkActionsBar
              selectedCount={selectedCount}
              totalItems={sortedProducts.length}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onRemoveSelected={handleRemoveSelected}
              onMoveSelectedToCart={handleMoveSelectedToCart}
            />
          )}

          {/* Results Info */}
          {searchQuery && totalItems > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {sortedProducts.length} of {totalItems} items
            </div>
          )}

          {/* Wishlist Grid or Empty State */}
          {hasSearchResults ? (
            <WishlistGrid
              products={sortedProducts}
              displayDataMap={displayDataMap}
              selectedItems={selectedItems}
              onToggleSelect={handleToggleSelect}
            />
          ) : (
            <WishlistEmpty searchQuery={searchQuery} totalItems={totalItems} />
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
