import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addressApi } from '../../services/addressApi';
import { Address } from '../../types/api';

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};
export const fetchUserAddresses = createAsyncThunk(
  'address/fetchUserAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressApi.getUserAddresses();
      if (!response.success) return rejectWithValue(response.message || 'Failed to fetch addresses');
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (addressData: any, { rejectWithValue }) => {
    try {
      const response = await addressApi.createAddress(addressData);
      if (!response.success) return rejectWithValue(response.message || 'Failed to create address');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ addressId, addressData }: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await addressApi.updateAddress(addressId, addressData);
      if (!response.success) return rejectWithValue(response.message || 'Failed to update address');
      // Refetch addresses after successful update
      await dispatch(fetchUserAddresses());
      return { addressId, updatedAddress: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await addressApi.deleteAddress(addressId);
      if (!response.success) return rejectWithValue(response.message || 'Failed to delete address');
      // Refetch addresses after successful deletion
      await dispatch(fetchUserAddresses());
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async (addressId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await addressApi.setDefaultAddress(addressId);
      if (!response.success) return rejectWithValue(response.message || 'Failed to set default address');
      // Refetch addresses after successfully setting default
      await dispatch(fetchUserAddresses());
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to set default address');
    }
  }
);

// Helper function for loading states
const handleLoading = (state: any, loading: boolean, error: string | null = null) => {
  state.loading = loading;
  if (error !== null) state.error = error;
};

// Helper function for setting default address
const setDefaultAddressHelper = (state: any, addressId: string) => {
  state.addresses = state.addresses.map((addr: Address) => ({
    ...addr,
    is_default: addr.b2c_address_id === addressId
  }));
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Addresses
      .addCase(fetchUserAddresses.pending, (state) => handleLoading(state, true))
      .addCase(fetchUserAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
        handleLoading(state, false);
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Create Address
      .addCase(createAddress.pending, (state) => handleLoading(state, true))
      .addCase(createAddress.fulfilled, (state, action) => {
        handleLoading(state, false);
        if (action.payload) {
          state.addresses.push(action.payload);
          if (action.payload.is_default) {
            setDefaultAddressHelper(state, action.payload.b2c_address_id);
          }
        }
      })
      .addCase(createAddress.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Update Address
      .addCase(updateAddress.pending, (state) => handleLoading(state, true))
      .addCase(updateAddress.fulfilled, (state, action) => {
        handleLoading(state, false);
        const { addressId, updatedAddress } = action.payload;
        if (updatedAddress) {
          const index = state.addresses.findIndex(addr => addr.b2c_address_id === addressId);
          if (index !== -1) {
            state.addresses[index] = updatedAddress;
            if (updatedAddress.is_default) {
              setDefaultAddressHelper(state, addressId);
            }
          }
        }
      })
      .addCase(updateAddress.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Delete Address
      .addCase(deleteAddress.pending, (state) => handleLoading(state, true))
      .addCase(deleteAddress.fulfilled, (state, action) => {
        handleLoading(state, false);
        state.addresses = state.addresses.filter(addr => addr.b2c_address_id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      // Set Default Address
      .addCase(setDefaultAddress.pending, (state) => handleLoading(state, true))
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        handleLoading(state, false);
        setDefaultAddressHelper(state, action.payload);
      })
      .addCase(setDefaultAddress.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string));
  },
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;
