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

const PLACEHOLDER_IMAGE = DEFAULTS.PLACEHOLDER_IMAGE;

export const getProductImages = (product: Product): ProductImage[] => product.product_image || [];

const getSortedImages = (product: Product): ProductImage[] => 
  [...getProductImages(product)].sort((a, b) => a.position - b.position);

export const getPrimaryImage = (product: Product): string => {
  const images = getSortedImages(product);
  return images.length > 0 ? images[0].product_image : PLACEHOLDER_IMAGE;
};

export const getSecondaryImage = (product: Product): string => {
  const images = getSortedImages(product);
  return images.length > 1 ? images[1].product_image : PLACEHOLDER_IMAGE;
};

export const getAllImages = (product: Product): string[] => {
  const images = getSortedImages(product);
  return images.length > 0 ? images.map(img => img.product_image) : [PLACEHOLDER_IMAGE];
};

export const getImageAlt = (product: Product, imageIndex: number = 0): string => 
  `${product.product_name} - Image ${imageIndex + 1}`;

export const calculateDiscount = (discount: string | null | undefined): number => 
  discount ? Math.round(parseFloat(discount)) : 0;

export const calculateDiscountedPrice = (product: Product): number => 
  Math.max(product.discount_amount || 0);

export const getDiscountedPrice = (price: string, mrp: string | null): number => {
  const priceNum = parseFloat(price);
  const mrpNum = mrp ? parseFloat(mrp) : priceNum;
  return mrpNum - priceNum;
};

export const getDisplayPrice = (product: Product): number => parseFloat(product.price);
export const getMRP = (product: Product): number | null => product.mrp ? parseFloat(product.mrp) : null;

export const isOutOfStock = (product: Product): boolean => 
  product.track_inventory && (!product.stock || parseInt(product.stock) < 0);

export const isLowStock = (product: Product, lowStockThreshold?: number): boolean => {
  if (!product.track_inventory || !product.stock) return false;
  const threshold = lowStockThreshold || product.low_stock_level || 10;
  const stock = parseInt(product.stock);
  return stock <= threshold && stock > 0;
};

export const getStockStatus = (product: Product, lowStockThreshold?: number): 'in_stock' | 'low_stock' | 'out_of_stock' => 
  isOutOfStock(product) ? 'out_of_stock' : 
  isLowStock(product, lowStockThreshold) ? 'low_stock' : 'in_stock';

const STOCK_STATUS_TEXT: Record<string, string> = {
  out_of_stock: 'Out of Stock',
  low_stock: 'Low Stock',
  in_stock: 'In Stock',
};

export const getStockStatusText = (product: Product, lowStockThreshold?: number): string => 
  STOCK_STATUS_TEXT[getStockStatus(product, lowStockThreshold)];

export const calculateAverageRating = (reviews: ProductRating[]): number => 
  reviews.length === 0 ? 0 : Math.round((reviews.reduce((sum, r) => sum + r.ratings, 0) / reviews.length) * 10) / 10;

export const getRatingDistribution = (reviews: ProductRating[]): Record<number, number> => {
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => dist[r.ratings] = (dist[r.ratings] || 0) + 1);
  return dist;
};

export const getRatingPercentage = (reviews: ProductRating[], rating: number): number => 
  reviews.length === 0 ? 0 : Math.round((getRatingDistribution(reviews)[rating] / reviews.length) * 100);

export const getRatingStars = (rating: number): { filled: number; empty: number; hasHalf: boolean } => {
  const filled = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return { filled, empty: 5 - filled - (hasHalf ? 1 : 0), hasHalf };
};

export const formatRatingText = (rating: number, totalReviews: number): string => {
  if (totalReviews === 0) return 'No reviews yet';
  const starWord = totalReviews === 1 ? 'star' : 'stars';
  const reviewWord = totalReviews === 1 ? 'review' : 'reviews';
  return `${rating} ${starWord} (${totalReviews} ${reviewWord})`;
};

export const formatReviewDate = (dateString: string): string => 
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export const getProductDescription = (product: Product): string => 
  product.text_content || product.clic_description || product.description || '';

export const getProductDisplayName = (product: Product, maxLength: number = DEFAULTS.MAX_PRODUCT_NAME_LENGTH): string => 
  product.product_name.length <= maxLength ? product.product_name : `${product.product_name.substring(0, maxLength - 3)}...`;

export const getProductBrand = (product: Product): string | null => product?.product_brand || null;
export const isProductAvailable = (product: Product): boolean => product.product_status && !isOutOfStock(product);
export const canAddToCart = (product: Product): boolean => isProductAvailable(product);
export const getMinOrderQuantity = (product: Product): number => product.min_order_quantity || 1;

export const createCartItem = (product: Product, displayData: ProductDisplayData, productCount: number = 1) => ({
  product_uid: product.product_uid,
  product_count: productCount,
  price: product.price,
  mrp: product.mrp || product.price,
  product_name: displayData.displayName,
  product_image: displayData.primaryImage,
  track_inventory: product.track_inventory,
  product_status: product.product_status,
  category_uid: product.category_uid,
  min_order_quantity: product.min_order_quantity || 1,
  stock: product.stock || 0
});

export const formatProductForDisplay = (product: Product, tenant?: Tenant | null, ratings: ProductRating[] = []): ProductDisplayData => {
  const discountedPrice = calculateDiscountedPrice(product);
  const mrp = getMRP(product);
  const price = formatCurrency(getDisplayPrice(product), tenant);
  const mrpFormatted = mrp ? formatCurrency(mrp, tenant) : null;
  const stockStatusText = getStockStatusText(product);
  const isAvailable = isProductAvailable(product);
  const canAddToCartProduct = canAddToCart(product);
  const averageRating = calculateAverageRating(ratings);
  const totalReviews = ratings.length;
  const ratingStars = getRatingStars(averageRating);
  const ratingText = formatRatingText(averageRating, totalReviews);
  return {
    product_uid: product?.product_uid,
    category_uid: product?.category_uid,
    primaryImage: getPrimaryImage(product),
    secondaryImage: getSecondaryImage(product),
    allImages: getAllImages(product),
    price,
    mrp: mrpFormatted,
    discountPercent: calculateDiscount(product.discount || null),
    discountedPrice,
    stockStatus: stockStatusText,
    isAvailable,
    canAddToCart: canAddToCartProduct,
    displayName: getProductDisplayName(product),
    brand: getProductBrand(product),
    description: getProductDescription(product),
    minOrderQuantity: getMinOrderQuantity(product),
    averageRating,
    totalReviews,
    ratingStars,
    ratingText,
  };
};

export const formatCategoryForDisplay = (category: Category): CategoryDisplayData => {
  return {
    category_uid: category.category_uid,
    category_name: category.category_name,
    category_image: category?.image || PLACEHOLDER_IMAGE,
    product_count: category.product_category_count,
  };
};
