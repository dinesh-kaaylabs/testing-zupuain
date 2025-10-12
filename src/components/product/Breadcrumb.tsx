import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types/api';

interface BreadcrumbProps {
  categoryUid: string;
  subCategoryUid?: string | null;
  productName: string;
  categories: Category[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  categoryUid,
  subCategoryUid,
  productName,
  categories,
}) => {
  const breadcrumbData = useMemo(() => {
    const category = categories.find((c) => c.category_uid === categoryUid);
    const subCategory = category?.sub_category?.find((s: any) => s.sub_category_uid === subCategoryUid);

    return { category, subCategory };
  }, [categoryUid, subCategoryUid, categories]);

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {/* Home */}
        <li className="flex items-center">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
        </li>

        {/* Separator */}
        <li className="text-gray-400 dark:text-gray-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </li>

        {/* Category */}
        {breadcrumbData.category && (
          <>
            <li>
              <Link
                to={`/products?category=${categoryUid}`}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {breadcrumbData.category.category_name}
              </Link>
            </li>

            {breadcrumbData.subCategory && (
              <>
                {/* Separator */}
                <li className="text-gray-400 dark:text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>

                {/* Sub Category */}
                <li>
                  <Link
                    to={`/products?category=${categoryUid}&subcategory=${subCategoryUid}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {breadcrumbData.subCategory.sub_category_name}
                  </Link>
                </li>
              </>
            )}

            {/* Separator */}
            <li className="text-gray-400 dark:text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
          </>
        )}

        {/* Product Name */}
        <li>
          <span className="text-gray-900 dark:text-white font-medium line-clamp-1">
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;

