import { apiClient } from './apiClient';
import { ApiResponse, Product, ProductRating, RelatedProduct } from '../types/api';
import { DEFAULT_APP_TYPE, DEFAULT_LIMIT, INITIAL_OFFSET } from '../utils/constants';
import { buildApiParams } from '../utils/apiUtils';
import { withErrorHandling } from '../utils/apiResponseHandler';

// Optimized type definitions
interface ProductListResponse {
  count: number;
  rows: Product[];
}

interface ProductDetailsResponse {
  rows: Product[];
  count: number;
}

interface RelatedProductsResponse {
  count: number;
  rows: RelatedProduct[];
}

// Optimized parameter types
type ProductListParams = {
  appType?: string;
  fromList?: boolean;
  product_uid?: string;
  category_uid?: string;
  sub_category_uid?: string;
  store_uid?: string;
  availability?: string;
  sort_by?: string;
  limit?: number;
  offset?: number;
};

type ProductDetailsParams = {
  appType?: string;
  store_uid?: string;
  fromBag?: boolean;
  productView?: boolean;
  user_uid?: string;
};

type RelatedProductsParams = {
  appType?: string;
  store_uid?: string;
};

// Optimized API service with reduced code duplication
const createProductEndpoint = (endpoint: string) => `/product/${endpoint}`;
const createRelatedEndpoint = (endpoint: string) => `/related/${endpoint}`;

export const productApi = {
  async getB2cProducts(params: ProductListParams = {}): Promise<ApiResponse<ProductListResponse>> {
    const defaultParams = {
      appType: DEFAULT_APP_TYPE,
      fromList: true,
      limit: DEFAULT_LIMIT,
      offset: INITIAL_OFFSET,
    };
    
    return withErrorHandling(
      () => apiClient.get<ProductListResponse>('/product/b2c', buildApiParams(params, defaultParams)),
      'Failed to fetch products'
    );
  },

  async getProductDetails(productUid: string, params: ProductDetailsParams = {}): Promise<ApiResponse<ProductDetailsResponse>> {
    const defaultParams = {
      appType: DEFAULT_APP_TYPE,
      productView: true,
      product_uid: productUid,
    };
    
    return withErrorHandling(
      () => apiClient.get<ProductDetailsResponse>('/product', buildApiParams(params, defaultParams)),
      'Failed to fetch product details'
    );
  },

  async getRelatedProducts(productUid: string, params: RelatedProductsParams = {}): Promise<ApiResponse<RelatedProductsResponse>> {
    return withErrorHandling(
      () => apiClient.get<RelatedProductsResponse>(
        createRelatedEndpoint(`get-all-related-products/${productUid}`), 
        buildApiParams(params)
      ),
      'Failed to fetch related products'
    );
  },

  async getProductReviews(productUid: string): Promise<ApiResponse<ProductRating[]>> {
    return withErrorHandling(
      () => apiClient.get<ProductRating[]>(createProductEndpoint(`get-customer-ratings/${productUid}`)),
      'Failed to fetch product reviews'
    );
  },
} as const;
