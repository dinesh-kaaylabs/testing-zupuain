import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productApi } from '../../services/productApi';
import { categoryApi } from '../../services/categoryApi';
import { Product, Category, ProductRating, RelatedProduct } from '../../types/api';
import { BEST_SELLER_PRODUCTS_LIMIT, DEFAULT_APP_TYPE, DEFAULT_AVAILABILITY, DEFAULT_LIMIT, DEFAULT_SORT_BY, DEFAULT_SORT_BY_BEST_SELLERS, FEATURED_PRODUCTS_LIMIT, INITIAL_OFFSET } from '../../utils/constants';

interface LoadingState {
  loading: boolean;
  error: string | null;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  bestSellingProducts: Product[];
  currentProduct: Product | null;
  productReviews: ProductRating[];
  relatedProducts: Product[];
  totalProducts: number;
  totalReviews: number;
  // Search and filter state
  searchQuery: string;
  sortBy: string;
  availability: string;
  selectedCategory: string;
  selectedSubCategory: string;
  currentPage: number;
  hasMore: boolean;
  // Consolidated loading states
  main: LoadingState;
  featured: LoadingState;
  bestSelling: LoadingState;
  reviews: LoadingState;
  related: LoadingState;
  infiniteScroll: LoadingState;
}

const initialState: ProductState = {
  products: [],
  categories: [],
  featuredProducts: [],
  bestSellingProducts: [],
  currentProduct: null,
  productReviews: [],
  relatedProducts: [],
  totalProducts: 0,
  totalReviews: 0,
  // Search and filter initial state
  searchQuery: '',
  sortBy: DEFAULT_SORT_BY,
  availability: DEFAULT_AVAILABILITY,
  selectedCategory: '',
  selectedSubCategory: '',
  currentPage: 1,
  hasMore: true,
  // Consolidated loading states
  main: { loading: false, error: null },
  featured: { loading: false, error: null },
  bestSelling: { loading: false, error: null },
  reviews: { loading: false, error: null },
  related: { loading: false, error: null },
  infiniteScroll: { loading: false, error: null },
};

// Helper function to build common API parameters
const buildApiParams = (getState: any, params: any = {}) => {
  const state = getState();
  const { defaultStore } = state.store;
  return {
    appType: DEFAULT_APP_TYPE,
    store_uid: defaultStore?.store_uid,
    sort_by: params?.sort_by || DEFAULT_SORT_BY,
    limit: params?.limit || DEFAULT_LIMIT,
    offset: params?.offset || INITIAL_OFFSET,
    ...(params?.availability !== undefined && params?.availability !== `${DEFAULT_AVAILABILITY}` ? { availability: params.availability } : {}),
    ...(params?.sub_category_uid ? { sub_category_uid: params.sub_category_uid } : {}),
    ...(params?.category_uid ? { category_uid: params.category_uid } : {}),
    ...(params?.search ? { search: params.search } : {}),
  };
};

// Generic async thunk handler
const createProductThunk = (name: string, apiCall: (params: any) => Promise<any>) =>
  createAsyncThunk(name, async (params: any = {}, { rejectWithValue, getState, signal }) => {
    try {
      const defaultParams = buildApiParams(getState, params);
      const response = await apiCall(defaultParams);
      
      if (signal.aborted) throw new Error('Request was aborted');
      if (!response.success) return rejectWithValue(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  });

export const getAllProducts = createProductThunk(
  'product/getAllProducts',
  productApi.getB2cProducts
);

export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (params: { productUid: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const { defaultStore } = state.store;
      const { user } = state.auth;
      
      const response = await productApi.getProductDetails(params.productUid, {
        appType: DEFAULT_APP_TYPE,
        store_uid: defaultStore?.store_uid,
        fromBag: true,
        productView: true,
        user_uid: user?.user_uid
      });
      
      if (!response.success) return rejectWithValue(response.message);
      return response?.rows || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllCategories = createAsyncThunk(
  'product/getAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getB2cCategories(DEFAULT_LIMIT, INITIAL_OFFSET);
      if (!response.success) return rejectWithValue(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProductReviews = createAsyncThunk(
  'product/getProductReviews',
  async (params: { product_uid: string }, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductReviews(params.product_uid);
      if (!response.success) return rejectWithValue(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRelatedProducts = createAsyncThunk(
  'product/getRelatedProducts',
  async (params: { product_uid: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const { defaultStore } = state.store;
      const response = await productApi.getRelatedProducts(params.product_uid, {
        appType: DEFAULT_APP_TYPE,
        store_uid: defaultStore?.store_uid
      });
      if (!response.success) return rejectWithValue(response.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFeaturedProducts = createProductThunk(
  'product/getFeaturedProducts',
  (params) => productApi.getB2cProducts({
    ...params,
    sort_by: params.sort_by || DEFAULT_SORT_BY,
    limit: params.limit || FEATURED_PRODUCTS_LIMIT,
  })
);

export const getBestSellingProducts = createProductThunk(
  'product/getBestSellingProducts',
  (params) => productApi.getB2cProducts({
    ...params,
    sort_by: params.sort_by || DEFAULT_SORT_BY_BEST_SELLERS,
    limit: params.limit || BEST_SELLER_PRODUCTS_LIMIT,
  })
);

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (params: any = {}, { rejectWithValue, getState, signal }) => {
    try {
      const state = getState() as any;
      const { product } = state;
      const defaultParams = buildApiParams(getState, {
        ...params,
        sort_by: params?.sortBy || product.sortBy,
        search: params?.searchQuery,
        availability: params?.availability !== DEFAULT_AVAILABILITY ? params.availability : undefined,
      });
      
      const response = await productApi.getB2cProducts(defaultParams);
      if (signal.aborted) throw new Error('Request was aborted');
      if (!response.success) return rejectWithValue(response.message);
      
      return {
        ...response.data,
        reset: params?.reset || false,
        searchQuery: params?.searchQuery || '',
        sortBy: params?.sortBy || product.sortBy,
        availability: params?.availability || product.availability,
        category_uid: params?.category_uid || product.selectedCategory,
        sub_category_uid: params?.sub_category_uid || product.selectedSubCategory,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadMoreProducts = createAsyncThunk(
  'product/loadMoreProducts',
  async (_, { rejectWithValue, getState, signal }) => {
    try {
      const state = getState() as any;
      const { product } = state;
      const nextPage = product.currentPage + 1;
      const nextOffset = nextPage;
      
      const defaultParams = buildApiParams(getState, {
        sort_by: product.sortBy,
        offset: nextOffset,
        search: product.searchQuery,
        availability: product.availability !== DEFAULT_AVAILABILITY ? product.availability : undefined,
        category_uid: product.selectedCategory,
        sub_category_uid: product.selectedSubCategory,
      });
      
      const response = await productApi.getB2cProducts(defaultParams);
      if (signal.aborted) throw new Error('Request was aborted');
      if (!response.success) return rejectWithValue(response.message);
      
      return { ...response.data, nextPage };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// Helper function to handle loading states
const handleLoadingState = (state: any, loadingState: string, loading: boolean, error: string | null = null) => {
  state[loadingState].loading = loading;
  if (error !== null) state[loadingState].error = error;
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state) => {
      Object.values(state).forEach((value: any) => {
        if (value && typeof value === 'object' && 'error' in value) {
          value.error = null;
        }
      });
    },
    setCurrentProduct: (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.productReviews = [];
      state.relatedProducts = [];
    },
    clearReviews: (state) => {
      state.productReviews = [];
      state.reviews.error = null;
    },
    clearRelatedProducts: (state) => {
      state.relatedProducts = [];
      state.related.error = null;
    },
    // Search and filter reducers
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setAvailability: (state, action: PayloadAction<string>) => {
      state.availability = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedSubCategory: (state, action: PayloadAction<string>) => {
      state.selectedSubCategory = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.sortBy = DEFAULT_SORT_BY;
      state.availability = DEFAULT_AVAILABILITY;
      state.selectedCategory = '';
      state.selectedSubCategory = '';
      state.currentPage = 1;
      state.products = [];
      state.hasMore = true;
    },
    clearProducts: (state) => {
      state.products = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Main products
      .addCase(getAllProducts.pending, (state) => handleLoadingState(state, 'main', true))
      .addCase(getAllProducts.fulfilled, (state, action) => {
        handleLoadingState(state, 'main', false);
        if (action.payload) {
          const isPagination = (action.meta.arg?.offset && action.meta.arg.offset > INITIAL_OFFSET);
          state.products = isPagination 
            ? [...state.products, ...action.payload.rows]
            : action.payload.rows;
          state.totalProducts = action.payload.count;
        }
      })
      .addCase(getAllProducts.rejected, (state, action) => 
        handleLoadingState(state, 'main', false, action.payload as string))
      
      // Product details
      .addCase(getProductDetails.pending, (state) => handleLoadingState(state, 'main', true))
      .addCase(getProductDetails.fulfilled, (state, action) => {
        handleLoadingState(state, 'main', false);
        if (action.payload?.length > 0) state.currentProduct = action.payload[0];
      })
      .addCase(getProductDetails.rejected, (state, action) => 
        handleLoadingState(state, 'main', false, action.payload as string))
      
      // Categories
      .addCase(getAllCategories.pending, (state) => handleLoadingState(state, 'main', true))
      .addCase(getAllCategories.fulfilled, (state, action) => {
        handleLoadingState(state, 'main', false);
        if (action.payload) {
          state.categories = action.payload;
        }
      })
      .addCase(getAllCategories.rejected, (state, action) => 
        handleLoadingState(state, 'main', false, action.payload as string))
      
      // Reviews
      .addCase(getProductReviews.pending, (state) => handleLoadingState(state, 'reviews', true))
      .addCase(getProductReviews.fulfilled, (state, action) => {
        handleLoadingState(state, 'reviews', false);
        if (action.payload) {
          state.productReviews = action.payload;
          state.totalReviews = action.payload.length;
        }
      })
      .addCase(getProductReviews.rejected, (state, action) => 
        handleLoadingState(state, 'reviews', false, action.payload as string))
      
      // Related products
      .addCase(getRelatedProducts.pending, (state) => handleLoadingState(state, 'related', true))
      .addCase(getRelatedProducts.fulfilled, (state, action) => {
        handleLoadingState(state, 'related', false);
        if (action.payload?.rows) {
          state.relatedProducts = action.payload.rows.map((item: RelatedProduct) => item.zm_product);
        }
      })
      .addCase(getRelatedProducts.rejected, (state, action) => 
        handleLoadingState(state, 'related', false, action.payload as string))
      
      // Featured products
      .addCase(getFeaturedProducts.pending, (state) => handleLoadingState(state, 'featured', true))
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        handleLoadingState(state, 'featured', false);
        if (action.payload) state.featuredProducts = action.payload.rows;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => 
        handleLoadingState(state, 'featured', false, action.payload as string))
      
      // Best selling products
      .addCase(getBestSellingProducts.pending, (state) => handleLoadingState(state, 'bestSelling', true))
      .addCase(getBestSellingProducts.fulfilled, (state, action) => {
        handleLoadingState(state, 'bestSelling', false);
        if (action.payload) state.bestSellingProducts = action.payload.rows;
      })
      .addCase(getBestSellingProducts.rejected, (state, action) => 
        handleLoadingState(state, 'bestSelling', false, action.payload as string))
      
      // Search products
      .addCase(searchProducts.pending, (state) => handleLoadingState(state, 'main', true))
      .addCase(searchProducts.fulfilled, (state, action) => {
        handleLoadingState(state, 'main', false);
        if (action.payload) {
          state.searchQuery = action.payload.searchQuery;
          state.sortBy = action.payload.sortBy;
          state.availability = action.payload.availability;
          state.selectedCategory = action.payload.category_uid;
          state.selectedSubCategory = action.payload.sub_category_uid;
          state.products = action.payload.rows || [];
          state.currentPage = action.payload.reset ? 1 : state.currentPage;
          state.totalProducts = action.payload.count || 0;
          state.hasMore = state.products.length < (action.payload.count || 0);
        }
      })
      .addCase(searchProducts.rejected, (state, action) => 
        handleLoadingState(state, 'main', false, action.payload as string))
      
      // Load more products
      .addCase(loadMoreProducts.pending, (state) => handleLoadingState(state, 'infiniteScroll', true))
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        handleLoadingState(state, 'infiniteScroll', false);
        if (action.payload) {
          state.products = [...state.products, ...(action.payload.rows || [])];
          if (action.payload.nextPage) state.currentPage = action.payload.nextPage;
          const totalPages = Math.ceil(state.totalProducts / DEFAULT_LIMIT);
          state.hasMore = state.currentPage < totalPages;
        }
      })
      .addCase(loadMoreProducts.rejected, (state, action) => 
        handleLoadingState(state, 'infiniteScroll', false, action.payload as string))
  },
});

export const { 
  clearError, 
  setCurrentProduct, 
  clearCurrentProduct, 
  clearReviews, 
  clearRelatedProducts,
  setSearchQuery,
  setSortBy,
  setAvailability,
  setSelectedCategory,
  setSelectedSubCategory,
  setCurrentPage,
  resetFilters,
  clearProducts
} = productSlice.actions;
export default productSlice.reducer;
