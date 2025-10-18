import { useState, useCallback, useMemo } from 'react';
import { BagDetail, CartItem as CartItemType, Product, ProductVariant, VariantAttribute } from '../../types/api';
import { DEFAULTS } from '../../utils/constants';
import { getCartItemInfo, getProductDetails, calculateItemPricing, checkStockAvailability } from '../../utils/cartHelpers';
import { useCurrencyFormatter } from '../../utils/currencyFormatter';

interface UseCartItemProps {
  item: BagDetail | CartItemType;
  isGuest: boolean;
  onIncrement: (productUid: string, bagDetailId?: number) => Promise<void>;
  onDecrement: (productUid: string, bagDetailId?: number) => Promise<void>;
  onRemove: (productUid: string, bagDetailId?: number) => Promise<void>;
  onMoveToWishlist?: (productUid: string) => Promise<void>;
  isUpdating?: boolean;
}

interface ItemPricing {
  price: number;
  mrp: number;
  discountPercent: number;
  totalPrice: number;
  totalMrp: number;
  savings: number;
}

interface StockInfo {
  stock: number;
  minOrderQuantity: number;
  isLowStock: boolean | undefined;
  isOutOfStock: boolean | undefined;
  canIncrement: boolean;
  canDecrement: boolean;
}

interface UseCartItemReturn {
  productUid: string;
  productCount: number;
  productInfo: { productName: string; productImage: string };
  pricing: ItemPricing;
  stockInfo: StockInfo;
  variantInfo: { variantId?: number | string; variantText?: string };
  units?: string;
  isRemoving: boolean;
  isMovingToWishlist: boolean;
  isUpdating: boolean;
  isGuest: boolean;
  handleIncrement: () => Promise<void>;
  handleDecrement: () => Promise<void>;
  handleRemove: () => Promise<void>;
  handleMoveToWishlist: () => Promise<void>;
  formatCurrency: (amount: number) => string;
}

export const useCartItem = ({
  item, isGuest, onIncrement, onDecrement, onRemove, onMoveToWishlist, isUpdating = false,
}: UseCartItemProps): UseCartItemReturn => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMovingToWishlist, setIsMovingToWishlist] = useState(false);
  const { formatCurrency } = useCurrencyFormatter();
  
  // Extract item info
  const itemInfo = getCartItemInfo(item);
  const { productUid, productCount, productVariantId, product } = itemInfo;
  const details = getProductDetails(item);
  const fullInfo = useMemo(() => {
    const isBag = 'bag_detail_id' in item;
    return {
      units: isBag ? item.units : undefined
    };
  }, [item]);
  
  const productInfo = useMemo(() => ({ 
    productName: details.name, 
    productImage: details.image || DEFAULTS.PLACEHOLDER_IMAGE 
  }), [details.name, details.image]);

  const pricing = useMemo(() => calculateItemPricing(item), [item]);
  const stockInfo = useMemo(() => checkStockAvailability(item, DEFAULTS.LOW_STOCK_THRESHOLD), [item]);

  // Get variant info
  const variantInfo = useMemo(() => {
    const isBag = 'bag_detail_id' in item;
    console.log("item===============>", item);
    
    const variantId = isBag ? item.product_variant_id : (item as CartItemType).product_variant_id;
    
    // For guest users, use the stored variant text
    if (!isBag) {
      const guestItem = item as CartItemType;
      return { 
        variantId, 
        variantText: guestItem.product_variant_text 
      };
    }
    
    // For authenticated users, look up variant from product and filter attributes
    const variant = variantId && product?.product_variants?.find((v: ProductVariant) => v.id === variantId.toString());
    let variantText: string | undefined = undefined;
    
    if (variant && typeof variant === 'object' && variant.variant_attributes) {
      // Filter out internal attributes - only show user-facing variant options
      const internalAttributes = ['Selling Price', 'MRP Price', 'Discount in %', 'Stock', 'Product Code', 'Image', 'Color Code', 'Discount Amount', 'Manufacture date', 'Width (in cm)', 'Height (in cm)', 'Weight (in kg)', 'Length (in cm)', 'Minimum Order Quantity', 'Including TAX', 'Low Stock Level'];
      
      const displayAttributes = variant.variant_attributes
        .filter((attr: VariantAttribute) => !internalAttributes.includes(attr.zm_attribute.name))
        .map((attr: VariantAttribute) => `${attr.zm_attribute.name}: ${attr.attribute_value}`);
      
      variantText = displayAttributes.length > 0 ? displayAttributes.join(', ') : undefined;
    }
    
    return { variantId, variantText };
  }, [item, product]);

  // Action handlers
  const handleIncrement = useCallback(async () => {
    if (stockInfo.canIncrement && !isUpdating) await onIncrement(productUid, productVariantId);
  }, [stockInfo.canIncrement, isUpdating, onIncrement, productUid, productVariantId]);

  const handleDecrement = useCallback(async () => {
    if (!isUpdating && stockInfo.canDecrement) await onDecrement(productUid, productVariantId);
  }, [isUpdating, stockInfo.canDecrement, onDecrement, productUid, productVariantId]);

  const handleRemove = useCallback(async () => {
    if (isRemoving) return;
    setIsRemoving(true);
    try { await onRemove(productUid, productVariantId); } 
    finally { setIsRemoving(false); }
  }, [isRemoving, onRemove, productUid, productVariantId]);

  const handleMoveToWishlist = useCallback(async (): Promise<void> => {
    if (!onMoveToWishlist || isMovingToWishlist) return;
    setIsMovingToWishlist(true);
    try { 
      await onMoveToWishlist(productUid); 
    } finally { 
      setIsMovingToWishlist(false); 
    }
  }, [onMoveToWishlist, isMovingToWishlist, productUid]);

  // Consolidated return object
  return {
    productUid, productCount, productInfo, pricing, stockInfo, variantInfo,
    units: fullInfo.units,
    isRemoving, isMovingToWishlist, isUpdating, isGuest,
    handleIncrement, handleDecrement, handleRemove, handleMoveToWishlist, formatCurrency,
  };
};
