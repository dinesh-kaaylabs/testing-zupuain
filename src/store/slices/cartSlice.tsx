import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '../../services/cartApi';
import { Bag, CartItem } from '../../types/api';
import { RootState } from '../store';

interface CartState {
  items: CartItem[];
  guestItems: CartItem[];
  bags: Bag[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  guestItems: JSON.parse(localStorage.getItem('guestCart') || '[]'),
  bags: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalAmount: 0,
};

// Consolidated localStorage operations
const localStorageOps = {
  get: (): CartItem[] => {
    try {
      const cart = localStorage.getItem('guestCart');
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  },
  set: (items: CartItem[]): void => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  },
  remove: (): void => {
    try {
      localStorage.removeItem('guestCart');
    } catch (error) {
      console.error('Failed to remove cart from localStorage:', error);
    }
  }
};

// Helper function to calculate cart totals
const calculateCartTotals = (state: CartState) => {
  let totalItems = 0;
  let totalAmount = 0;

  if (state.bags.length > 0) {
    state.bags.forEach(bag => {
      if (bag.bag_details?.length) {
        bag.bag_details.forEach(detail => {
          totalItems += detail.product_count || 0;
          totalAmount += (detail.selling_price || 0) * (detail.product_count || 0);
        });
      }
    });
  } else {
    state.guestItems.forEach(item => {
      totalItems += item.product_count || 0;
      totalAmount += parseFloat(item.price || '0') * (item.product_count || 0);
    });
  }

  state.totalItems = totalItems;
  state.totalAmount = totalAmount;
};

// Async thunks with consolidated error handling
const handleAsyncError = (error: any): string => error.message || 'Network error occurred';

export const fetchBag = createAsyncThunk(
  'cart/fetchBag',
  async (store_uid: string, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = state.auth.isAuthenticated;
    
    try {
      if (!isAuthenticated) {
        return { isGuest: true, data: localStorageOps.get() };
      }
      
      const response = await cartApi.getBag(store_uid);
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch cart');
      }
      return { isGuest: false, data: response.data || [] };
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: any, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { isAuthenticated } = state.auth;
    const { defaultStore } = state.store;
    if (!isAuthenticated) {
      return { ...data, isGuest: true };
    }
    if (!defaultStore?.store_uid) {
      return rejectWithValue('Store not available');
    }
    try {
      const response = await cartApi.addToCart({
        product: {
          product_uid: data.product_uid,
          product_count: data.product_count,
          track_inventory: data.track_inventory,
          product_status: data.product_status,
          product_variant_id: data?.product_variant_id || undefined,
          id: data?.product_variant_id || undefined,
          product_id: parseInt(data.price),
          price: data.price,
          mrp: data.mrp,
          min_order_quantity: data.min_order_quantity,
        },
        slugData: 'CART',
        store_uid: defaultStore.store_uid,
      });

      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to add to cart');
      }
      return { ...data, isGuest: false };
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

// Generic cart operation thunk factory
const createCartOperationThunk = (name: string, apiCall: (data: any) => Promise<any>, errorMessage: string) =>
  createAsyncThunk(
    `cart/${name}`,
    async (data: any, { rejectWithValue, getState }) => {
      const state = getState() as RootState;
      const { isAuthenticated } = state.auth;

      if (!isAuthenticated) {
        return { product_uid: data.product_uid, isGuest: true };
      }

      try {        
        const response = await apiCall(data);
        if (!response.success) {
          return rejectWithValue(response.message || errorMessage);
        }
        return { product_uid: data.product_uid, isGuest: false };
      } catch (error: any) {
        return rejectWithValue(handleAsyncError(error));
      }
    }
  );

export const incrementQuantity = createCartOperationThunk(
  'incrementQuantity',
  cartApi.incrementQuantity,
  'Failed to increment quantity'
);

export const decrementQuantity = createCartOperationThunk(
  'decrementQuantity',
  cartApi.decrementQuantity,
  'Failed to decrement quantity'
);

export const removeFromCart = createCartOperationThunk(
  'removeFromCart',
  cartApi.removeFromCart,
  'Failed to remove from cart'
);

export const syncGuestCart = createAsyncThunk(
  'cart/syncGuestCart',
  async (data: { guestItems: CartItem[]; store_uid: string }, { rejectWithValue }) => {
    if (data.guestItems.length === 0) return [];

    try {
      const bulkRequest = {
        product: data.guestItems.map(item => ({
          product_uid: item.product_uid,
          product_count: item.product_count,
          track_inventory: item.track_inventory,
          product_status: item.product_status,
          product_id: parseInt(item.price),
          id: item.product_variant_id,
          slug: 'CART',
          mrp: item.mrp,
          price: item.price,
          min_order_quantity: item.min_order_quantity,
          product_variant_id: item.product_variant_id,
        })),
        store_uid: data.store_uid,
      };

      const response = await cartApi.createBulkBagProduct(bulkRequest);
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to sync cart');
      }
      return data.guestItems;
    } catch (error: any) {
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

// Helper function for loading states
const handleLoading = (state: any, loading: boolean, error: string | null = null) => {
  state.loading = loading;
  if (error !== null) state.error = error;
};

// Helper function for guest cart operations
const updateGuestCart = (state: any, items: CartItem[]) => {
  state.guestItems = items;
  localStorageOps.set(items);
  calculateCartTotals(state);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Bag
      .addCase(fetchBag.pending, (state) => handleLoading(state, true))
      .addCase(fetchBag.fulfilled, (state, action) => {
        handleLoading(state, false);
        const { isGuest, data } = action.payload;
        
        if (isGuest) {
          state.guestItems = Array.isArray(data) ? data as CartItem[] : [];
          state.bags = [];
        } else {
          state.bags = Array.isArray(data) ? data as Bag[] : [];
          state.guestItems = [];
        }
        
        calculateCartTotals(state);
      })
      .addCase(fetchBag.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => handleLoading(state, true))
      .addCase(addToCart.fulfilled, (state, action) => {
        handleLoading(state, false);
        if (action.payload.isGuest) {
          const existingItem = state.guestItems.find(
            item => item.product_uid === action.payload.product_uid &&
            (item.product_variant_id || null) === (action.payload.product_variant_id || null)
          );

          if (existingItem) {
            existingItem.product_count += action.payload.product_count;
          } else {
            state.guestItems.push({
              product_uid: action.payload.product_uid,
              product_count: action.payload.product_count,
              price: action.payload.price,
              mrp: action.payload.mrp,
              product_name: action.payload.product_name,
              product_image: action.payload.product_image,
              track_inventory: action.payload.track_inventory,
              product_status: action.payload.product_status,
              category_uid: action.payload.category_uid,
              min_order_quantity: action.payload.min_order_quantity,
              stock: action.payload.stock,
              product_variant_id: action.payload.product_variant_id || null,
              product_variant_text: action.payload.product_variant_text || undefined
            });
          }
          updateGuestCart(state, state.guestItems);
        }
        calculateCartTotals(state);
      })
      .addCase(addToCart.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Quantity operations
      .addCase(incrementQuantity.pending, (state) => { state.error = null; })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        if (action.payload.isGuest) {
          const item = state.guestItems.find(item => item.product_uid === action.payload.product_uid);
          if (item) {
            item.product_count += 1;
            updateGuestCart(state, state.guestItems);
          }
        }
        state.error = null;
      })
      .addCase(incrementQuantity.rejected, (state, action) => { state.error = action.payload as string; })
      
      .addCase(decrementQuantity.pending, (state) => { state.error = null; })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        if (action.payload.isGuest) {
          const item = state.guestItems.find(item => item.product_uid === action.payload.product_uid);
          if (item) {
            if (item.product_count <= 1) {
              const filteredItems = state.guestItems.filter(i => i.product_uid !== action.payload.product_uid);
              updateGuestCart(state, filteredItems);
            } else {
              item.product_count -= 1;
              updateGuestCart(state, state.guestItems);
            }
          }
        }
        state.error = null;
      })
      .addCase(decrementQuantity.rejected, (state, action) => { state.error = action.payload as string; })
      
      .addCase(removeFromCart.pending, (state) => { state.error = null; })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (action.payload.isGuest) {
          const filteredItems = state.guestItems.filter(
            item => item.product_uid !== action.payload.product_uid
          );
          updateGuestCart(state, filteredItems);
        }
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => { state.error = action.payload as string; })
      
      // Sync Guest Cart
      .addCase(syncGuestCart.fulfilled, (state) => {
        handleLoading(state, false);
        state.guestItems = [];
        localStorageOps.remove();
        calculateCartTotals(state);
      });
  },
});

export default cartSlice.reducer;
