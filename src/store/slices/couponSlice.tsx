import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { couponApi } from '../../services/couponApi';
import { UserCoupon } from '../../types/api';
import { RootState } from '../store';

interface CouponState {
  availableCoupons: UserCoupon[];
  appliedCoupon: UserCoupon | null;
  appliedCouponDiscount: number;
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  availableCoupons: [],
  appliedCoupon: null,
  appliedCouponDiscount: 0,
  loading: false,
  error: null,
};

export const fetchUserCoupons = createAsyncThunk(
  'coupon/fetchUserCoupons',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const user = state.auth.user;
      const isAuthenticated = state.auth.isAuthenticated;
      
      let response;
      
      if (isAuthenticated && user?.user_uid) {
        // Fetch user-specific coupons with usage tracking
        response = await couponApi.getUserCoupons({
          user_uid: user.user_uid,
          is_active: 1
        });
      } else {
        // Fetch all available coupons for guests
        response = await couponApi.getAllCoupons({
          is_active: 1
        });
      }

      if (!response.success) return rejectWithValue(response.message || 'Failed to fetch coupons');
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchAllCoupons = createAsyncThunk(
  'coupon/fetchAllCoupons',
  async (searchWord: string | undefined, { rejectWithValue }) => {
    try {
      const response = await couponApi.getAllCoupons({
        is_active: 1,
        searchWord
      });

      if (!response.success) return rejectWithValue(response.message || 'Failed to fetch coupons');
      return response.data || [];
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

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAppliedCoupon: (state, action: PayloadAction<{ coupon: UserCoupon | null; discount: number }>) => {
      state.appliedCoupon = action.payload.coupon;
      state.appliedCouponDiscount = action.payload.discount;
    },
    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      state.appliedCouponDiscount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCoupons.pending, (state) => handleLoading(state, true))
      .addCase(fetchUserCoupons.fulfilled, (state, action: PayloadAction<UserCoupon[]>) => {
        handleLoading(state, false);
        state.availableCoupons = action.payload;
      })
      .addCase(fetchUserCoupons.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string))
      
      .addCase(fetchAllCoupons.pending, (state) => handleLoading(state, true))
      .addCase(fetchAllCoupons.fulfilled, (state, action: PayloadAction<UserCoupon[]>) => {
        handleLoading(state, false);
        state.availableCoupons = action.payload;
      })
      .addCase(fetchAllCoupons.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string));
  },
});

export const { clearError, setAppliedCoupon, clearAppliedCoupon } = couponSlice.actions;
export default couponSlice.reducer;
