import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tenantReducer from './slices/tenantSlice';
import storeReducer from './slices/storeSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import newsletterReducer from './slices/newsletterSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from './slices/orderSlice';
import deliverySlotReducer from './slices/deliverySlotSlice';
import deliveryChargeReducer from './slices/deliveryChargeSlice';
import couponReducer from './slices/couponSlice';

// Consolidated reducer configuration
const reducers = {
  auth: authReducer,
  tenant: tenantReducer,
  store: storeReducer,
  product: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  newsletter: newsletterReducer,
  address: addressReducer,
  order: orderReducer,
  deliverySlot: deliverySlotReducer,
  deliveryCharge: deliveryChargeReducer,
  coupon: couponReducer,
};

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
