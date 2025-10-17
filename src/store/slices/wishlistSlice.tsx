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

const LS_KEY = 'guestWishlist';
const getLS = (): Product[] => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
};
const setLS = (items: Product[]) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(items)); } catch {}
};
const addLS = (p: Product) => {
  const items = getLS();
  if (!items.find(i => i.product_uid === p.product_uid)) setLS([...items, p]);
};
const removeLS = (uid: string) => setLS(getLS().filter(i => i.product_uid !== uid));

const getStoreUid = (state: RootState) => 
  state.store?.defaultStore?.store_uid || 
  JSON.parse(localStorage.getItem('defaultStore') || '{}')?.store_uid || '';

export const getUserWishlist = createAsyncThunk('wishlist/get', async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  if (!state.auth.isAuthenticated) return getLS();
  try {
    const res = await wishlistApi.getUserWishlist();
    if (!res.success) return rejectWithValue(res.message || 'Failed');
    return res.data?.flatMap(i => i.zm_products || []) || [];
  } catch (e: any) { return rejectWithValue(e.message || 'Error'); }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (product: Product, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  if (!state.auth.isAuthenticated) { addLS(product); return product; }
  try {
    const res = await wishlistApi.addToWishlist({ product_uid: product.product_uid, store_uid: getStoreUid(state) });
    if (!res.success) return rejectWithValue(res.message || 'Failed');
    return product;
  } catch (e: any) { return rejectWithValue(e.message || 'Error'); }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (uid: string, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  if (!state.auth.isAuthenticated) { removeLS(uid); return uid; }
  try {
    const res = await wishlistApi.removeFromWishlist(uid, getStoreUid(state));
    if (!res.success) return rejectWithValue(res.message || 'Failed');
    return uid;
  } catch (e: any) { return rejectWithValue(e.message || 'Error'); }
});

export const moveToCart = createAsyncThunk('wishlist/move', async (uid: string, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  if (!state.auth.isAuthenticated) { removeLS(uid); return uid; }
  try {
    const res = await wishlistApi.moveToCart(uid, getStoreUid(state));
    if (!res.success) return rejectWithValue(res.message || 'Failed');
    return uid;
  } catch (e: any) { return rejectWithValue(e.message || 'Error'); }
});

export const moveAllToCart = createAsyncThunk('wishlist/moveAll', async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const items = state.wishlist.wishlistItems;
  if (!items.length) return rejectWithValue('Empty');
  if (!state.auth.isAuthenticated) { setLS([]); return { movedCount: items.length, failedItems: [] }; }
  try {
    const res = await wishlistApi.moveAllToCart(getStoreUid(state));
    if (!res.success) return rejectWithValue(res.message || 'Failed');
    return { movedCount: res.data?.movedCount || items.length, failedItems: res.data?.failedItems || [] };
  } catch (e: any) { return rejectWithValue(e.message || 'Error'); }
});

export const clearAllWishlist = createAsyncThunk('wishlist/clear', async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const items = state.wishlist.wishlistItems;
  if (!items.length) return rejectWithValue('Empty');
  if (!state.auth.isAuthenticated) { setLS([]); return { success: true }; }
  try {
    const res = await wishlistApi.clearAllWishlist(getStoreUid(state));
    if (!res.success) return rejectWithValue(res.message || 'Failed');
    return { success: true };
  } catch (e: any) { return rejectWithValue(e.message || 'Error'); }
});

const setLoad = (s: WishlistState, l: boolean, e: string | null = null) => { s.loading = l; if (e) s.error = e; };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: s => { s.error = null; },
    initializeWishlist: s => { s.wishlistItems = getLS(); },
    clearWishlist: s => { s.wishlistItems = []; s.error = null; },
  },
  extraReducers: b => {
    b.addCase(getUserWishlist.pending, s => setLoad(s, true))
      .addCase(getUserWishlist.fulfilled, (s, a) => { setLoad(s, false); s.wishlistItems = a.payload || []; })
      .addCase(getUserWishlist.rejected, (s, a) => { setLoad(s, false, a.payload as string); s.wishlistItems = []; })
      .addCase(addToWishlist.pending, s => setLoad(s, true))
      .addCase(addToWishlist.fulfilled, (s, a) => { setLoad(s, false); if (!s.wishlistItems.find(i => i?.product_uid === a.payload.product_uid)) s.wishlistItems.push(a.payload); })
      .addCase(addToWishlist.rejected, (s, a) => setLoad(s, false, a.payload as string))
      .addCase(removeFromWishlist.pending, s => setLoad(s, true))
      .addCase(removeFromWishlist.fulfilled, (s, a) => { setLoad(s, false); s.wishlistItems = s.wishlistItems.filter(i => i?.product_uid !== a.payload); })
      .addCase(removeFromWishlist.rejected, (s, a) => setLoad(s, false, a.payload as string))
      .addCase(moveToCart.fulfilled, (s, a) => { s.wishlistItems = s.wishlistItems.filter(i => i?.product_uid !== a.payload); })
      .addCase(moveAllToCart.pending, s => setLoad(s, true))
      .addCase(moveAllToCart.fulfilled, (s, a) => { setLoad(s, false); const f = a.payload.failedItems || []; s.wishlistItems = f.length ? s.wishlistItems.filter(i => f.includes(i?.product_uid)) : []; })
      .addCase(moveAllToCart.rejected, (s, a) => setLoad(s, false, a.payload as string))
      .addCase(clearAllWishlist.pending, s => setLoad(s, true))
      .addCase(clearAllWishlist.fulfilled, s => { setLoad(s, false); s.wishlistItems = []; })
      .addCase(clearAllWishlist.rejected, (s, a) => setLoad(s, false, a.payload as string));
  },
});

export const { clearError, initializeWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
