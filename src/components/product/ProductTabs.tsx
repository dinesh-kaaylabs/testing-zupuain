import React, { useState } from 'react';
import { Product, ProductRating } from '../../types/api';
import ReviewSection from './ReviewSection';

interface ProductTabsProps {
  product: Product;
  reviews: ProductRating[];
  averageRating: number;
  totalReviews: number;
}

type TabType = 'description' | 'specifications' | 'shipping' | 'reviews';

const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  reviews,
  averageRating,
  totalReviews,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const tabs = [
    { id: 'description' as TabType, label: 'Description', icon: '📝' },
    { id: 'specifications' as TabType, label: 'Specifications', icon: '📋' },
    { id: 'shipping' as TabType, label: 'Shipping & Returns', icon: '🚚' },
    { id: 'reviews' as TabType, label: `Reviews (${totalReviews})`, icon: '⭐' },
  ];

  return (
    <div id="product-tabs" className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm sm:text-base whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 sm:p-8">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Product Description
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              {product.text_content || product.description || product.clic_description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.text_content || product.description || product.clic_description || '',
                  }}
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No detailed description available for this product.
                </p>
              )}
            </div>
            {product.key_features && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Key Features
                </h4>
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.key_features }}
                />
              </div>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specifications' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Product Specifications
            </h3>
            <div className="grid gap-4">
              {product.product_brand && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Brand</span>
                  <span className="col-span-1 sm:col-span-2 text-gray-600 dark:text-gray-400">{product.product_brand}</span>
                </div>
              )}
              {product.product_code && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Product Code</span>
                  <span className="col-span-1 sm:col-span-2 text-gray-600 dark:text-gray-400 font-mono">{product.product_code}</span>
                </div>
              )}
              {product.upc && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">UPC</span>
                  <span className="col-span-1 sm:col-span-2 text-gray-600 dark:text-gray-400 font-mono">{product.upc}</span>
                </div>
              )}
              {product.country_of_origin && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Country of Origin</span>
                  <span className="col-span-1 sm:col-span-2 text-gray-600 dark:text-gray-400">{product.country_of_origin}</span>
                </div>
              )}
              {product.manufacturer_details && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Manufacturer</span>
                  <span className="col-span-1 sm:col-span-2 text-gray-600 dark:text-gray-400">{product.manufacturer_details}</span>
                </div>
              )}
              {product.marketed_by && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Marketed By</span>
                  <span className="col-span-1 sm:col-span-2 text-gray-600 dark:text-gray-400">{product.marketed_by}</span>
                </div>
              )}
              {product.shelf_life && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Shelf Life</span>
                  <span className="col-span-1 sm:col-span-2 text-gray-600 dark:text-gray-400">{product.shelf_life}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shipping & Returns Tab */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Shipping Information
              </h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Free shipping on orders over $50</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Standard delivery: 3-5 business days</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Express delivery available at checkout</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Returns & Refunds
              </h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>30-day hassle-free returns</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Full refund if not satisfied</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Exchange available within 15 days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div id="reviews" className="animate-fade-in">
            <ReviewSection
              productUid={product.product_uid}
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;

