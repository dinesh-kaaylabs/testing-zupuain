import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tenantApi } from '../../services/tenantApi';
import { Tenant } from '../../types/api';

interface TenantState {
  defaultTenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  defaultTenant: null,
  loading: false,
  error: null,
};

export const fetchTenant = createAsyncThunk(
  'tenant/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tenantApi.getTenant();
      if (!response.success) return rejectWithValue(response.message);
      return response.data;
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

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenant.pending, (state) => handleLoading(state, true))
      .addCase(fetchTenant.fulfilled, (state, action: PayloadAction<Tenant>) => {
        handleLoading(state, false);
        state.defaultTenant = action.payload;
      })
      .addCase(fetchTenant.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string));
  },
});

export const { clearError } = tenantSlice.actions;
export default tenantSlice.reducer;
