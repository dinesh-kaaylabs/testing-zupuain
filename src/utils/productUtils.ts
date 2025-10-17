import { Category, Product, ProductImage, ProductRating, Tenant } from '../types/api';
import { DEFAULTS } from './constants';
import { formatCurrency } from './currencyFormatter';

export interface ProductDisplayData {
  product_uid: string;
  category_uid: string;
  primaryImage: string;
  secondaryImage: string;
  allImages: string[];
  price: string;
  mrp: string | null;
  discountPercent: number;
  discountedPrice: number;
  stockStatus: string;
  isAvailable: boolean;
  canAddToCart: boolean;
  displayName: string;
  brand: string | null;
  description: string;
  minOrderQuantity: number;
  averageRating: number;
  totalReviews: number;
  ratingStars: { filled: number; empty: number; hasHalf: boolean };
  ratingText: string;
}

export interface CategoryDisplayData {
  category_uid: string;
  category_name: string;
  category_image: string;
  product_count: number;
}

const PLACEHOLDER = DEFAULTS.PLACEHOLDER_IMAGE;
const STOCK_TEXT: Record<string, string> = { out_of_stock: 'Out of Stock', low_stock: 'Low Stock', in_stock: 'In Stock' };

const getSortedImages = (product: Product) => 
  [...(product.product_image || [])].sort((a, b) => a.position - b.position);

export const getPrimaryImage = (product: Product): string => 
  getSortedImages(product)[0]?.product_image || PLACEHOLDER;

export const getSecondaryImage = (product: Product): string => 
  getSortedImages(product)[1]?.product_image || PLACEHOLDER;

export const getAllImages = (product: Product): string[] => {
  const imgs = getSortedImages(product).map(i => i.product_image);
  return imgs.length ? imgs : [PLACEHOLDER];
};

export const getImageAlt = (product: Product, idx = 0) => `${product.product_name} - Image ${idx + 1}`;
export const calculateDiscount = (discount: string | null | undefined) => discount ? Math.round(parseFloat(discount)) : 0;
export const calculateDiscountedPrice = (product: Product) => Math.max(product.discount_amount || 0);
export const getDisplayPrice = (product: Product) => parseFloat(product.price);
export const getMRP = (product: Product) => product.mrp ? parseFloat(product.mrp) : null;

export const isOutOfStock = (product: Product) => 
  product.track_inventory && (!product.stock || parseInt(product.stock) <= 0);

export const isLowStock = (product: Product, threshold?: number) => {
  if (!product.track_inventory || !product.stock) return false;
  const limit = threshold || product.low_stock_level || 10;
  const stock = parseInt(product.stock);
  return stock > 0 && stock <= limit;
};

export const getStockStatus = (product: Product, threshold?: number): 'in_stock' | 'low_stock' | 'out_of_stock' => 
  isOutOfStock(product) ? 'out_of_stock' : isLowStock(product, threshold) ? 'low_stock' : 'in_stock';

export const getStockStatusText = (product: Product, threshold?: number) => 
  STOCK_TEXT[getStockStatus(product, threshold)];

export const calculateAverageRating = (reviews: ProductRating[]) => 
  reviews.length ? Math.round((reviews.reduce((sum, r) => sum + r.ratings, 0) / reviews.length) * 10) / 10 : 0;

export const getRatingDistribution = (reviews: ProductRating[]) => {
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => dist[r.ratings] = (dist[r.ratings] || 0) + 1);
  return dist;
};

export const getRatingPercentage = (reviews: ProductRating[], rating: number) => 
  reviews.length ? Math.round((getRatingDistribution(reviews)[rating] / reviews.length) * 100) : 0;

export const getRatingStars = (rating: number) => {
  const filled = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return { filled, empty: 5 - filled - (hasHalf ? 1 : 0), hasHalf };
};

export const formatRatingText = (rating: number, total: number) => 
  total === 0 ? 'No reviews yet' : `${rating} ${total === 1 ? 'star' : 'stars'} (${total} ${total === 1 ? 'review' : 'reviews'})`;

export const formatReviewDate = (dateString: string) => 
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const getProductDescription = (product: Product) => 
  product.text_content || product.clic_description || product.description || '';

export const getProductDisplayName = (product: Product, max = DEFAULTS.MAX_PRODUCT_NAME_LENGTH) => 
  product.product_name.length <= max ? product.product_name : `${product.product_name.substring(0, max - 3)}...`;

export const getProductBrand = (product: Product) => product?.product_brand || null;
export const isProductAvailable = (product: Product) => product.product_status && !isOutOfStock(product);
export const canAddToCart = (product: Product) => isProductAvailable(product);
export const getMinOrderQuantity = (product: Product) => product.min_order_quantity || 1;

export const getDefaultVariantId = (product: Product): string | null => 
  product.product_variants?.length ? product.product_variants[0].id : null;

export const createCartItem = (product: Product, displayData: ProductDisplayData, count = 1, variantId?: string | null) => ({
  product_uid: product.product_uid,
  product_count: count,
  price: product.price,
  mrp: product.mrp || product.price,
  product_name: displayData.displayName,
  product_image: displayData.primaryImage,
  track_inventory: product.track_inventory,
  product_status: product.product_status,
  category_uid: product.category_uid,
  min_order_quantity: product.min_order_quantity || 1,
  stock: product.stock || 0,
  product_variant_id: variantId || undefined,
});

export const formatProductForDisplay = (product: Product, tenant?: Tenant | null, ratings: ProductRating[] = []): ProductDisplayData => {
  const mrp = getMRP(product);
  const avgRating = calculateAverageRating(ratings);
  const totalReviews = ratings.length;
  
  return {
    product_uid: product.product_uid,
    category_uid: product.category_uid,
    primaryImage: getPrimaryImage(product),
    secondaryImage: getSecondaryImage(product),
    allImages: getAllImages(product),
    price: formatCurrency(getDisplayPrice(product), tenant),
    mrp: mrp ? formatCurrency(mrp, tenant) : null,
    discountPercent: calculateDiscount(product.discount || null),
    discountedPrice: calculateDiscountedPrice(product),
    stockStatus: getStockStatusText(product),
    isAvailable: isProductAvailable(product),
    canAddToCart: canAddToCart(product),
    displayName: getProductDisplayName(product),
    brand: getProductBrand(product),
    description: getProductDescription(product),
    minOrderQuantity: getMinOrderQuantity(product),
    averageRating: avgRating,
    totalReviews,
    ratingStars: getRatingStars(avgRating),
    ratingText: formatRatingText(avgRating, totalReviews),
  };
};

export const formatCategoryForDisplay = (category: Category): CategoryDisplayData => ({
  category_uid: category.category_uid,
  category_name: category.category_name,
  category_image: category?.image || PLACEHOLDER,
  product_count: category.product_category_count,
});
