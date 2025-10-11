import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { wishlistApi } from '../../services/wishlistApi';
import { Product } from '../../types/api';
import { RootState } from '../store';

interface WishlistState {
  wishlistItems: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

// Consolidated localStorage operations
const localStorageOps = {
  get: (): Product[] => {
    try {
      const wishlist = localStorage.getItem('guestWishlist');
      return wishlist ? JSON.parse(wishlist) : [];
    } catch {
      return [];
    }
  },
  set: (wishlist: Product[]): void => {
    try {
      localStorage.setItem('guestWishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error);
    }
  },
  add: (product: Product): void => {
    try {
      const wishlist = localStorageOps.get();
      if (!wishlist.find(item => item.product_uid === product.product_uid)) {
        localStorageOps.set([...wishlist, product]);
      }
    } catch (error) {
      console.error('Failed to add product to localStorage wishlist:', error);
    }
  },
  remove: (productUid: string): void => {
    try {
      const wishlist = localStorageOps.get();
      localStorageOps.set(wishlist.filter(item => item.product_uid !== productUid));
    } catch (error) {
      console.error('Failed to remove product from localStorage wishlist:', error);
    }
  }
};

// Generic wishlist thunk helper
const createWishlistThunk = (name: string, apiCall: () => Promise<any>) =>
  createAsyncThunk(name, async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;

    if (!isAuthenticated) {
      return localStorageOps.get();
    }

    try {
      const response = await apiCall();
      if (!response.success) {
        return rejectWithValue(response.message || 'Operation failed');
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  });

export const getUserWishlist = createWishlistThunk(
  'wishlist/getUserWishlist',
  wishlistApi.getUserWishlist
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product: Product, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;

    if (!isAuthenticated) {
      localStorageOps.add(product);
      return product;
    }

    try {
      const response = await wishlistApi.addToWishlist(product.product_uid);
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to add to wishlist');
      }
      return response.data || product;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productUid: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;

    if (!isAuthenticated) {
      localStorageOps.remove(productUid);
      return productUid;
    }

    try {
      const response = await wishlistApi.removeFromWishlist(productUid);
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to remove from wishlist');
      }
      return productUid;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const moveToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async (productUid: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;

    if (!isAuthenticated) {
      localStorageOps.remove(productUid);
      return productUid;
    }

    try {
      const response = await wishlistApi.moveToCart(productUid);
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to move to cart');
      }
      return productUid;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Helper function for loading states
const handleLoading = (state: any, loading: boolean, error: string | null = null) => {
  state.loading = loading;
  if (error !== null) state.error = error;
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    initializeWishlist: (state) => {
      state.wishlistItems = localStorageOps.get();
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user wishlist
      .addCase(getUserWishlist.pending, (state) => handleLoading(state, true))
      .addCase(getUserWishlist.fulfilled, (state, action: PayloadAction<Product[]>) => {
        handleLoading(state, false);
        state.wishlistItems = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getUserWishlist.rejected, (state, action) => {
        handleLoading(state, false, action.payload as string);
        state.wishlistItems = [];
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => handleLoading(state, true))
      .addCase(addToWishlist.fulfilled, (state, action) => {
        handleLoading(state, false);
        if (!Array.isArray(state.wishlistItems)) state.wishlistItems = [];
        if (!state.wishlistItems.find(item => item?.product_uid === action.payload.product_uid)) {
          state.wishlistItems.push(action.payload);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => handleLoading(state, true))
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<string>) => {
        handleLoading(state, false);
        if (!Array.isArray(state.wishlistItems)) state.wishlistItems = [];
        state.wishlistItems = state.wishlistItems.filter(item => item?.product_uid !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Move to cart
      .addCase(moveToCart.fulfilled, (state, action: PayloadAction<string>) => {
        if (!Array.isArray(state.wishlistItems)) state.wishlistItems = [];
        state.wishlistItems = state.wishlistItems.filter(item => item?.product_uid !== action.payload);
      });
  },
});

export const { clearError, initializeWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
