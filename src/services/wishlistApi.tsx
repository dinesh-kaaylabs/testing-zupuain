import { apiClient as api } from './apiClient';
import { ApiResponse as Res, Wishlist as W, WishlistResponse as WRes } from '../types/api';
import { withErrorHandling as err } from '../utils/apiResponseHandler';

export interface AddToWishlistRequest extends Record<string, unknown> {
  product_uid: string;
  store_uid: string;
}

const w = '/wishlist';
export const wishlistApi = {
  getUserWishlist: (): Promise<WRes> => api.get<WRes>(w).catch(() => { throw new Error('Failed'); }),
  addToWishlist: (d: AddToWishlistRequest): Promise<Res<W>> => err(() => api.post<W>(w, d), 'Failed'),
  removeFromWishlist: (p: string, s: string): Promise<Res<void>> => err(() => api.delete<void>(`${w}?product_uid=${p}&store_uid=${s}`), 'Failed'),
  moveToCart: (p: string, s: string): Promise<Res<void>> => err(() => api.post<void>(`${w}/move-to-cart`, { product_uid: p, store_uid: s }), 'Failed'),
  moveAllToCart: (s: string): Promise<Res<{ movedCount: number; failedItems: string[] }>> => err(() => api.post(`${w}/move-all-to-cart`, { store_uid: s }), 'Failed'),
  clearAllWishlist: (s: string): Promise<Res<void>> => err(() => api.delete<void>(`/clear/all?store_uid=${s}`), 'Failed')
};
