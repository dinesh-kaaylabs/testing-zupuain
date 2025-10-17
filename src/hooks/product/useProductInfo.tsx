import { useMemo } from 'react';
import { ProductDisplayData } from '../../utils/productUtils';
import { VariantDisplayData } from './useProductVariants';

interface UseProductInfoParams {
  displayData: ProductDisplayData;
  productCode?: string | null;
  variantDisplayData?: VariantDisplayData | null;
}

export const useProductInfo = ({
  displayData,
  productCode,
  variantDisplayData,
}: UseProductInfoParams) => {
  // Effective product code (variant or base)
  const effectiveProductCode = useMemo(
    () => variantDisplayData?.productCode || productCode,
    [variantDisplayData?.productCode, productCode]
  );

  // Price display logic
  const priceInfo = useMemo(() => {
    const price = variantDisplayData?.price || displayData.price;
    const mrp = variantDisplayData?.mrp || displayData.mrp;
    const discountPercent = variantDisplayData?.discountPercent || displayData.discountPercent;
    const savings = variantDisplayData?.savings || 
      (displayData.mrp && displayData.discountedPrice > 0 
        ? `₹${displayData.discountedPrice.toFixed(2)}` 
        : '');

    return {
      price,
      mrp,
      discountPercent,
      savings,
      hasMrp: !!mrp,
      hasDiscount: discountPercent > 0,
      hasSavings: !!savings,
    };
  }, [
    variantDisplayData?.price,
    variantDisplayData?.mrp,
    variantDisplayData?.discountPercent,
    variantDisplayData?.savings,
    displayData.price,
    displayData.mrp,
    displayData.discountPercent,
    displayData.discountedPrice,
  ]);

  // Stock status logic
  const stockInfo = useMemo(() => {
    const statusText = variantDisplayData?.stockStatusText || displayData.stockStatus;
    
    const getStatusColor = (status: string) => {
      if (status === 'Out of Stock') {
        return {
          container: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800',
          dot: 'bg-red-500',
        };
      }
      if (status === 'Low Stock') {
        return {
          container: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800',
          dot: 'bg-yellow-500 animate-pulse',
        };
      }
      return {
        container: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800',
        dot: 'bg-green-500',
      };
    };

    return {
      statusText,
      colors: getStatusColor(statusText),
    };
  }, [variantDisplayData?.stockStatusText, displayData.stockStatus]);

  return {
    effectiveProductCode,
    priceInfo,
    stockInfo,
  };
};

