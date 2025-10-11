import { useAppSelector } from '../redux/useAppSelector';
import { useAppDispatch } from '../redux/useAppDispatch';
import { getAllCategories } from '../../store/slices/productSlice';
import { useEffect } from 'react';

const FEATURED_CATEGORIES_LIMIT = 6;

export const useFeaturedCategories = () => {
  const dispatch = useAppDispatch();
  const { categories, main } = useAppSelector((state) => state.product);

  useEffect(() => {
    if (categories.length === 0 && !main.loading) {
      dispatch(getAllCategories());
    }
  }, [dispatch, categories.length, main.loading]);

  return {
    categories: categories.slice(0, FEATURED_CATEGORIES_LIMIT),
    loading: main.loading,
    error: main.error,
    refetch: () => dispatch(getAllCategories())
  };
};
