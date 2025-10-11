import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { deliveryChargeApi } from '../../services/deliveryChargeApi';

interface DeliveryCharge {
  delivery_charge: number;
}

interface DeliveryChargeCriteria {
  criteria_id: string;
  delivery_charge: number;
  criteria_name: string;
  is_active: boolean;
  tenant_uid: string;
  creation_date: string;
  modified_date: string;
}

interface DeliveryChargeCriteriaByCartPrice extends DeliveryChargeCriteria {
  cart_charge_mapped: {
    id: number;
    criteria_id: string;
    minimum_charge: number;
    maximum_charge: number;
    is_active: boolean;
  };
}

interface DeliveryChargeCriteriaByWeight extends DeliveryChargeCriteria {
  weight_charge_mapped: {
    id: number;
    criteria_id: string;
    minimum_weight: number;
    maximum_weight: number;
    details: string;
    is_active: boolean;
  };
}

interface DeliveryChargeState {
  deliveryCharge: DeliveryCharge | null;
  cartPriceCharges: DeliveryChargeCriteriaByCartPrice[];
  weightCharges: DeliveryChargeCriteriaByWeight[];
  locationCharges: DeliveryChargeCriteria[];
  loading: boolean;
  error: string | null;
}

const initialState: DeliveryChargeState = {
  deliveryCharge: null,
  cartPriceCharges: [],
  weightCharges: [],
  locationCharges: [],
  loading: false,
  error: null,
};

// Generic async thunk helper
const createDeliveryChargeThunk = (name: string, apiCall: () => Promise<any>) =>
  createAsyncThunk(name, async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall();
      if (!response.success) return rejectWithValue(response.message || 'Operation failed');
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  });

export const getDeliveryCharge = createAsyncThunk(
  'deliveryCharge/getDeliveryCharge',
  async (storeUid: string, { rejectWithValue }) => {
    try {
      const response = await deliveryChargeApi.getDeliveryCharge();
      if (!response.success) return rejectWithValue(response.message || 'Failed to fetch delivery charge');
      return response.data?.[0] || { delivery_charge: 0 };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchDeliveryChargeCriteria = createAsyncThunk(
  'deliveryCharge/fetchDeliveryChargeCriteria',
  async (_, { rejectWithValue }) => {
    try {
      const [cartPriceResponse, weightResponse, locationResponse] = await Promise.all([
        deliveryChargeApi.getDeliveryChargeCriteriaByCartPrice(),
        deliveryChargeApi.getDeliveryChargeCriteriaByWeight(),
        deliveryChargeApi.getDeliveryChargeCriteria()
      ]);

      return {
        cartPriceCharges: cartPriceResponse.success ? cartPriceResponse.data?.rows || [] : [],
        weightCharges: weightResponse.success ? weightResponse.data?.rows || [] : [],
        locationCharges: locationResponse.success ? locationResponse.data || [] : []
      };
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

const deliveryChargeSlice = createSlice({
  name: 'deliveryCharge',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeliveryCharge.pending, (state) => handleLoading(state, true))
      .addCase(getDeliveryCharge.fulfilled, (state, action) => {
        handleLoading(state, false);
        state.deliveryCharge = action.payload;
      })
      .addCase(getDeliveryCharge.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      .addCase(fetchDeliveryChargeCriteria.fulfilled, (state, action) => {
        state.cartPriceCharges = action.payload.cartPriceCharges;
        state.weightCharges = action.payload.weightCharges;
        state.locationCharges = action.payload.locationCharges;
      });
  },
});

export const { clearError } = deliveryChargeSlice.actions;
export default deliveryChargeSlice.reducer;
