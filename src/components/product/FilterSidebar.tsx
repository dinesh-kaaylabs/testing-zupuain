import React from 'react';
import { Category } from '../../types/api';
import { PRODUCT_OPTIONS } from '../../utils/constants';

interface FilterSidebarProps {
  // Filter states
  searchInput: string;
  selectedCategory: string;
  selectedSubCategory: string;
  availability: string;
  sortBy: string;
  categories: Category[];
  
  // Handlers
  onSearchChange: (value: string) => void;
  onCategoryChange: (uid: string) => void;
  onSubCategoryChange: (uid: string) => void;
  onAvailabilityChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
  
  // Mobile
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  searchInput,
  selectedCategory,
  selectedSubCategory,
  availability,
  sortBy,
  categories,
  onSearchChange,
  onCategoryChange,
  onSubCategoryChange,
  onAvailabilityChange,
  onSortChange,
  onResetFilters,
  isMobile = false,
  isOpen = true,
  onClose,
}) => {
  const selectedCategoryData = categories.find(c => c.category_uid === selectedCategory);
  const subCategories = selectedCategoryData?.sub_category || [];

  const filterContent = (
    <div className="space-y-6">
      {/* Header - Mobile Only */}
      {isMobile && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Search Products
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          {PRODUCT_OPTIONS.SORT.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Availability
        </label>
        <div className="space-y-2">
          {PRODUCT_OPTIONS.STOCK.map((option) => (
            <label
              key={option.value}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="availability"
                value={option.value}
                checked={availability === option.value}
                onChange={(e) => onAvailabilityChange(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Category
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={() => onCategoryChange('')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              All Categories
            </span>
          </label>
          {categories.map((category) => (
            <label
              key={category.category_uid}
              className="flex items-center cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                value={category.category_uid}
                checked={selectedCategory === category.category_uid}
                onChange={() => onCategoryChange(category.category_uid)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {category.category_name}
                {category.product_category_count > 0 && (
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                    ({category.product_category_count})
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sub Categories */}
      {subCategories.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Sub Category
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="subcategory"
                value=""
                checked={selectedSubCategory === ''}
                onChange={() => onSubCategoryChange('')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                All Sub Categories
              </span>
            </label>
            {subCategories.map((subCategory: any) => (
              <label
                key={subCategory.sub_category_uid}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="subcategory"
                  value={subCategory.sub_category_uid}
                  checked={selectedSubCategory === subCategory.sub_category_uid}
                  onChange={() => onSubCategoryChange(subCategory.sub_category_uid)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {subCategory.sub_category_name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Reset Filters */}
      <button
        onClick={onResetFilters}
        className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors duration-200"
      >
        Reset Filters
      </button>
    </div>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 z-50 overflow-y-auto transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6">
            {filterContent}
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </div>
      {filterContent}
    </div>
  );
};

export default FilterSidebar;

