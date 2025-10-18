import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/useAppDispatch';
import { useAppSelector } from '../redux/useAppSelector';
import { buyNow } from '../../store/slices/cartSlice';
import { Product } from '../../types/api';
import { ProductDisplayData, createCartItem, getDefaultVariantId } from '../../utils/productUtils';
import { useToast } from '../ui/useToast';

interface UseBuyNowReturn {
  handleBuyNow: (product: Product, displayData: ProductDisplayData, quantity?: number, variantId?: string | null) => Promise<void>;
  isBuying: boolean;
}

export const useBuyNow = (): UseBuyNowReturn => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { loading, isAuthenticated } = useAppSelector(({ cart, auth }) => ({ 
    loading: cart.loading, 
    isAuthenticated: auth.isAuthenticated 
  }));

  const handleBuyNow = useCallback(
    async (product: Product, displayData: ProductDisplayData, qty?: number, variantId?: string | null) => {
      try {
        if (!displayData.canAddToCart) {
          error('Product is currently out of stock');
          return;
        }

        // Validate inventory
        if (product.track_inventory && product.stock != null) {
          const requested = qty || displayData.minOrderQuantity;
          const available = typeof product.stock === 'string' ? parseInt(product.stock, 10) : product.stock;
          if (requested > available) {
            error(`Only ${available} items available in stock`);
            return;
          }
        }

        const vId = variantId ?? getDefaultVariantId(product);
        await dispatch(buyNow(createCartItem(product, displayData, qty || displayData.minOrderQuantity, vId))).unwrap();
        
        success('Proceeding to checkout...');

        const params = new URLSearchParams({ product_uid: product.product_uid, slug: 'BUY' });
        if (vId) params.append('variant_id', vId);
        
        navigate(isAuthenticated ? `/cart?${params}` : `/login?redirect=/cart?${params}`);
      } catch (err) {
        error(err instanceof Error ? err.message : 'Failed to process buy now');
      }
    },
    [dispatch, navigate, success, error, isAuthenticated]
  );

  return { handleBuyNow, isBuying: loading };
};

