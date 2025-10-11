import { useState, useCallback, useMemo } from 'react';
import { BagDetail, CartItem as CartItemType } from '../../types/api';
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

export const useCartItem = ({
  item, isGuest, onIncrement, onDecrement, onRemove, onMoveToWishlist, isUpdating = false,
}: UseCartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMovingToWishlist, setIsMovingToWishlist] = useState(false);
  const { formatCurrency } = useCurrencyFormatter();

  // Extract item info
  const itemInfo = getCartItemInfo(item);
  const { productUid, productCount, bagDetailId, product } = itemInfo;
  const details = getProductDetails(item);
  
  const productInfo = useMemo(() => ({ 
    productName: details.name, 
    productImage: details.image || DEFAULTS.PLACEHOLDER_IMAGE 
  }), [details.name, details.image]);

  const pricing = useMemo(() => calculateItemPricing(item), [item]);
  const stockInfo = useMemo(() => checkStockAvailability(item, DEFAULTS.LOW_STOCK_THRESHOLD), [item]);

  // Get variant info
  const variantInfo = useMemo(() => {
    const isBag = 'bag_detail_id' in item;
    const variantId = isBag ? item.product_variant_id : undefined;
    const variant = variantId && product?.product_variants?.find((v: any) => v.id === variantId.toString());
    const variantText = variant && typeof variant === 'object' && variant.variant_attributes
      ? variant.variant_attributes.map((attr: any) => `${attr.zm_attribute.name}: ${attr.attribute_value}`).join(', ')
      : undefined;
    return { variantId, variantText };
  }, [item, product]);

  // Action handlers
  const handleIncrement = useCallback(async () => {
    if (stockInfo.canIncrement && !isUpdating) await onIncrement(productUid, bagDetailId);
  }, [stockInfo.canIncrement, isUpdating, onIncrement, productUid, bagDetailId]);

  const handleDecrement = useCallback(async () => {
    if (!isUpdating && stockInfo.canDecrement) await onDecrement(productUid, bagDetailId);
  }, [isUpdating, stockInfo.canDecrement, onDecrement, productUid, bagDetailId]);

  const handleRemove = useCallback(async () => {
    if (isRemoving) return;
    setIsRemoving(true);
    try { await onRemove(productUid, bagDetailId); } 
    finally { setIsRemoving(false); }
  }, [isRemoving, onRemove, productUid, bagDetailId]);

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
    isRemoving, isMovingToWishlist, isUpdating, isGuest,
    handleIncrement, handleDecrement, handleRemove, handleMoveToWishlist, formatCurrency,
  };
};
