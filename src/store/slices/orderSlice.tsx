import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderApi } from '../../services/orderApi';
import { PaymentMethod, OrderListItem, OrderProduct, OrderTimelineItem, OrderUserDetails, OrderSummary, CreateOrderBodyRequest } from '../../types/api';

interface LoadingState {
  loading: boolean;
  error: string | null;
}

interface OrderState {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  orders: OrderListItem[];
  totalOrderCount: number;
  orderDetails: OrderProduct[];
  timeline: OrderTimelineItem[];
  userDetails: OrderUserDetails | null;
  orderSummary: OrderSummary | null;
  // Consolidated loading states
  main: LoadingState;
  paymentMethodsState: LoadingState;
}

const initialState: OrderState = {
  paymentMethods: [],
  selectedPaymentMethod: null,
  orders: [],
  totalOrderCount: 0,
  orderDetails: [],
  timeline: [],
  userDetails: null,
  orderSummary: null,
  // Consolidated loading states
  main: { loading: false, error: null },
  paymentMethodsState: { loading: false, error: null },
};

// Generic async thunk helper
const createOrderThunk = (name: string, apiCall: (...args: any[]) => Promise<any>) =>
  createAsyncThunk(name, async (params: any, { rejectWithValue }) => {
    try {
      const response = await apiCall(params);
      if (!response.success) return rejectWithValue(response.message || 'Operation failed');
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  });

export const fetchPaymentMethods = createOrderThunk(
  'order/fetchPaymentMethods',
  orderApi.getPaymentMethods
);

export const fetchUserOrders = createOrderThunk(
  'order/fetchUserOrders',
  orderApi.getUserOrders
);

export const fetchOrderDetails = createOrderThunk(
  'order/fetchOrderDetails',
  orderApi.getOrderProducts
);

export const fetchOrderTracking = createOrderThunk(
  'order/fetchOrderTracking',
  orderApi.getOrderTracking
);

export const fetchOrderTimeline = createOrderThunk(
  'order/fetchOrderTimeline',
  orderApi.getOrderTimeline
);

export const fetchOrderUserDetails = createOrderThunk(
  'order/fetchOrderUserDetails',
  orderApi.getOrderUserDetails
);

export const fetchOrderSummary = createOrderThunk(
  'order/fetchOrderSummary',
  orderApi.getOrderSummary
);

export const createOrder = createOrderThunk(
  'order/createOrder',
  orderApi.createCartOrder
);

// Helper function for loading states
const handleLoading = (state: any, loadingState: string, loading: boolean, error: string | null = null) => {
  state[loadingState].loading = loading;
  if (error !== null) state[loadingState].error = error;
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setSelectedPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.selectedPaymentMethod = action.payload;
    },
    clearError: (state) => {
      state.main.error = null;
      state.paymentMethodsState.error = null;
    },
    clearPaymentMethods: (state) => {
      state.paymentMethods = [];
      state.selectedPaymentMethod = null;
      state.paymentMethodsState.error = null;
    },
    clearOrderData: (state) => {
      state.orderDetails = [];
      state.timeline = [];
      state.userDetails = null;
      state.orderSummary = null;
      state.main.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Payment Methods
      .addCase(fetchPaymentMethods.pending, (state) => handleLoading(state, 'paymentMethodsState', true))
      .addCase(fetchPaymentMethods.fulfilled, (state, action: PayloadAction<PaymentMethod[]>) => {
        handleLoading(state, 'paymentMethodsState', false);
        state.paymentMethods = action.payload;
        if (action.payload.length > 0 && !state.selectedPaymentMethod) {
          state.selectedPaymentMethod = action.payload[0];
        }
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => 
        handleLoading(state, 'paymentMethodsState', false, action.payload as string))
      
      // User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        handleLoading(state, 'main', true);
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<{ count: number; rows: OrderListItem[] }>) => {
        handleLoading(state, 'main', false);
        state.orders = action.payload.rows;
        state.totalOrderCount = action.payload.count;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        handleLoading(state, 'main', false, action.payload as string);
      })
      
      // Order Details
      .addCase(fetchOrderDetails.pending, (state) => handleLoading(state, 'main', true))
      .addCase(fetchOrderDetails.fulfilled, (state, action: PayloadAction<OrderProduct[]>) => {
        handleLoading(state, 'main', false);
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => 
        handleLoading(state, 'main', false, action.payload as string))
      
      // Order Timeline
      .addCase(fetchOrderTimeline.pending, (state) => handleLoading(state, 'main', true))
      .addCase(fetchOrderTimeline.fulfilled, (state, action: PayloadAction<OrderTimelineItem[]>) => {
        handleLoading(state, 'main', false);
        state.timeline = action.payload;
      })
      .addCase(fetchOrderTimeline.rejected, (state, action) => 
        handleLoading(state, 'main', false, action.payload as string))
      
      // Order User Details
      .addCase(fetchOrderUserDetails.pending, (state) => handleLoading(state, 'main', true))
      .addCase(fetchOrderUserDetails.fulfilled, (state, action: PayloadAction<OrderUserDetails>) => {
        handleLoading(state, 'main', false);
        state.userDetails = action.payload;
      })
      .addCase(fetchOrderUserDetails.rejected, (state, action) => 
        handleLoading(state, 'main', false, action.payload as string))
      
      // Order Summary
      .addCase(fetchOrderSummary.pending, (state) => handleLoading(state, 'main', true))
      .addCase(fetchOrderSummary.fulfilled, (state, action: PayloadAction<OrderSummary>) => {
        handleLoading(state, 'main', false);
        state.orderSummary = action.payload;
      })
      .addCase(fetchOrderSummary.rejected, (state, action) => 
        handleLoading(state, 'main', false, action.payload as string))
      
      // Create Order
      .addCase(createOrder.pending, (state) => handleLoading(state, 'main', true))
      .addCase(createOrder.fulfilled, (state) => handleLoading(state, 'main', false))
      .addCase(createOrder.rejected, (state, action) => 
        handleLoading(state, 'main', false, action.payload as string));
  },
});

export const { setSelectedPaymentMethod, clearError, clearPaymentMethods, clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;
