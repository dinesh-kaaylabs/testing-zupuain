import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { storeApi } from '../../services/storeApi';
import { Store } from '../../types/api';

interface StoreState {
  stores: Store[];
  defaultStore: Store | null;
  loading: boolean;
  error: string | null;
}

// Helper function for localStorage operations
const localStorageOps = {
  get: (): Store | null => {
    try {
      const store = localStorage.getItem('defaultStore');
      return store ? JSON.parse(store) : null;
    } catch {
      return null;
    }
  },
  set: (store: Store): void => {
    try {
      localStorage.setItem('defaultStore', JSON.stringify(store));
    } catch (error) {
      console.error('Failed to save store to localStorage:', error);
    }
  }
};

const initialState: StoreState = {
  stores: [],
  defaultStore: localStorageOps.get(),
  loading: false,
  error: null,
};

export const fetchStores = createAsyncThunk(
  'store/fetchStores',
  async (pincode: string | undefined, { rejectWithValue }) => {
    try {
      const response = await storeApi.getStoreByPincode(pincode);
      if (!response.success) return rejectWithValue(response.message);
      return response;
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

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setDefaultStore: (state, action: PayloadAction<Store>) => {
      state.defaultStore = action.payload;
      localStorageOps.set(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => handleLoading(state, true))
      .addCase(fetchStores.fulfilled, (state, action) => {
        handleLoading(state, false);
        const stores = action.payload.data || [];
        state.stores = stores;
        
        // Set first store as default if no default store exists
        if (!state.defaultStore && stores.length > 0) {
          state.defaultStore = stores[0];
          localStorageOps.set(stores[0]);
        }
      })
      .addCase(fetchStores.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string));
  },
});

export const { setDefaultStore, clearError } = storeSlice.actions;
export default storeSlice.reducer;
