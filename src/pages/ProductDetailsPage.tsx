import React, { useMemo, useState } from 'react';
import { useProductDetails } from '../hooks/product/useProductDetails';
import { useProductUtils } from '../hooks/product/useProductUtils';
import { useProductVariants } from '../hooks/product/useProductVariants';
import { useCartActions } from '../hooks/cart/useCartActions';
import { useWishlistActions } from '../hooks/wishlist/useWishlistActions';
import { useAppSelector } from '../hooks/redux/useAppSelector';
import { useToast } from '../hooks/ui/useToast';
import SEOHead from '../components/common/SEOHead';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import PurchaseSection from '../components/product/PurchaseSection';
import ProductTabs from '../components/product/ProductTabs';
import RelatedProducts from '../components/product/RelatedProducts';
import Breadcrumb from '../components/product/Breadcrumb';
import StickyProductBar from '../components/product/StickyProductBar';
import VariantSelector from '../components/product/VariantSelector';

const ProductDetailsPage: React.FC = () => {
  // CRITICAL: useProductDetails takes NO parameters - uses useParams internally
  const { product, reviews, relatedProducts, loading, error, averageRating, totalReviews } = useProductDetails();
  
  const { formatProductForDisplay } = useProductUtils();
  const { handleAddToCart } = useCartActions();
  const { isInWishlist, handleToggleWishlist } = useWishlistActions();
  const { success } = useToast();
  const categories = useAppSelector((state) => state.product.categories);

  // Variant handling
  const {
    hasVariants,
    variantOptions,
    selectedVariant,
    currentVariant,
    variantDisplayData,
    handleVariantChange,
  } = useProductVariants(product);

  const [copiedLink, setCopiedLink] = useState(false);

  // Format product for display - only 2 params
  const displayData = useMemo(() => {
    if (!product) return null;
    return formatProductForDisplay(product, reviews);
  }, [product, reviews, formatProductForDisplay]);

  // Handle add to cart
  const handleAddToCartWithQuantity = (quantity: number) => {
    if (product && displayData) {
      const variantId = currentVariant?.id || null;

      handleAddToCart(product, displayData, quantity, variantId);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (product) {
      handleToggleWishlist(product);
    }
  };

  // Social share handlers
  const handleShare = (platform: 'facebook' | 'twitter' | 'pinterest' | 'copy') => {
    const url = window.location.href;
    const title = product?.product_name || '';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'pinterest':
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        success('Link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2000);
        break;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Breadcrumb Skeleton */}
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gallery Skeleton */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  ))}
                </div>
              </div>
              
              {/* Info Skeleton */}
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <a href="/products" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  if (!displayData) return null;

  return (
    <>
      <SEOHead
        title={product.product_name}
        description={displayData.description}
        keywords={`${product.product_name}, ${displayData.brand || ''}, product, buy online`}
        type="product"
        image={displayData.primaryImage}
      />

      {/* Sticky Bar */}
      <StickyProductBar
        displayData={displayData}
        isInWishlist={isInWishlist(product.product_uid)}
        onAddToCart={() => handleAddToCartWithQuantity(displayData.minOrderQuantity)}
        onToggleWishlist={handleWishlistToggle}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            categoryUid={product.category_uid}
            subCategoryUid={product.sub_category_uid}
            productName={product.product_name}
            categories={categories}
          />

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Gallery */}
            <ProductGallery
              images={variantDisplayData?.images && variantDisplayData.images.length > 0 
                ? variantDisplayData.images 
                : displayData.allImages}
              productName={product.product_name}
            />

            {/* Product Details */}
            <div className="space-y-6">
              <ProductInfo
                displayData={displayData}
                productCode={product.product_code}
                averageRating={averageRating}
                totalReviews={totalReviews}
                variantDisplayData={variantDisplayData}
              />

              {/* Variant Selector */}
              {hasVariants && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Select Options
                  </h3>
                  <VariantSelector
                    variantOptions={variantOptions}
                    selectedVariant={selectedVariant}
                    onVariantChange={handleVariantChange}
                  />
                </div>
              )}

              {/* Social Share */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare('pinterest')}
                    className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                    aria-label="Share on Pinterest"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className={`p-2 rounded-full transition-colors ${
                      copiedLink
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    aria-label="Copy link"
                  >
                    {copiedLink ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Purchase Section */}
              <PurchaseSection
                product={product}
                displayData={displayData}
                isInWishlist={isInWishlist(product.product_uid)}
                onAddToCart={handleAddToCartWithQuantity}
                onToggleWishlist={handleWishlistToggle}
                variantDisplayData={variantDisplayData}
              />
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-12">
            <ProductTabs
              product={product}
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
