import { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../redux/useAppDispatch';
import { useAppSelector } from '../redux/useAppSelector';
import { getProductDetails, getProductReviews, getRelatedProducts } from '../../store/slices/productSlice';
import { Product, ProductRating } from '../../types/api';

interface UseProductDetailsReturn {
  product: Product | null;
  reviews: ProductRating[];
  relatedProducts: Product[];
  loading: boolean;
  error: string | null;
  averageRating: number;
  totalReviews: number;
  refetch: () => void;
}

export const useProductDetails = (): UseProductDetailsReturn => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();
  const lastProductId = useRef<string | null>(null);
  
  const {
    currentProduct,
    productReviews,
    relatedProducts,
    main,
    reviews,
    related
  } = useAppSelector((state) => state.product);

  const fetchProductDetails = useCallback(async () => {
    if (!productId) return;

    try {
      await dispatch(getProductDetails({ productUid: productId }));
      await Promise.all([
        dispatch(getProductReviews({ product_uid: productId })),
        dispatch(getRelatedProducts({ product_uid: productId }))
      ]);
    } catch (err) {
      console.error('Failed to fetch product data:', err);
    }
  }, [dispatch, productId]);

  useEffect(() => {
    // Only fetch if productId has changed
    if (productId && productId !== lastProductId.current) {
      lastProductId.current = productId;
      fetchProductDetails();
    }
  }, [productId, fetchProductDetails]);

  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, review) => sum + review.ratings, 0) / productReviews.length 
    : 0;

  return {
    product: currentProduct,
    reviews: productReviews,
    relatedProducts,
    loading: main.loading || reviews.loading || related.loading,
    error: main.error || reviews.error || related.error,
    averageRating,
    totalReviews: productReviews.length,
    refetch: fetchProductDetails
  };
};
