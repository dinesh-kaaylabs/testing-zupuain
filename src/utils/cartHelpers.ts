import { BagDetail, CartItem } from '../types/api';

export const isBagDetail = (item: BagDetail | CartItem): item is BagDetail => 'bag_detail_id' in item;

export const getItemInfo = (item: BagDetail | CartItem) => {
  const isBag = isBagDetail(item);
  const product = isBag ? item.zm_products?.[0] : null;
  const price = isBag ? item.selling_price : parseFloat(item.price);
  const mrp = isBag ? item.mrp_price : parseFloat(item.mrp);
  return {
    productUid: item.product_uid,
    productCount: item.product_count,
    bagDetailId: isBag ? item.bag_detail_id : undefined,
    price, mrp, product,
    name: isBag ? product?.product_name || 'Product' : item.product_name,
    image: isBag ? product?.product_image?.[0]?.product_image : item.product_image,
    stock: isBag ? parseInt(product?.stock || '0') : item.stock || 0,
    trackInventory: isBag ? product?.track_inventory : item.track_inventory,
    minOrderQuantity: isBag ? product?.min_order_quantity || 1 : item.min_order_quantity || 1,
    units: isBag ? item.units || 'unit' : 'unit',
  };
};

export const calculateItemPricing = (item: BagDetail | CartItem) => {
  const { price, mrp, productCount } = getItemInfo(item);
  const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return { price, mrp, discountPercent, totalPrice: price * productCount,
    totalMrp: mrp * productCount, savings: (mrp - price) * productCount };
};

export const checkStockAvailability = (item: BagDetail | CartItem, lowStockThreshold = 10) => {
  const { stock, trackInventory, minOrderQuantity, productCount } = getItemInfo(item);
  return { stock, minOrderQuantity, isLowStock: trackInventory && stock > 0 && stock <= lowStockThreshold,
    isOutOfStock: trackInventory && stock <= 0, canIncrement: !trackInventory || stock > productCount,
    canDecrement: productCount > minOrderQuantity };
};

export const getProductDisplayDetails = (item: BagDetail | CartItem) => {
  const { productCount, price, mrp, name, image, units } = getItemInfo(item);
  const discount = mrp - price;
  return { name, image, price, mrp, units, quantity: productCount, discount,
    discountPercent: mrp > 0 ? Math.round((discount / mrp) * 100) : 0, itemTotal: price * productCount };
};

export const getCartItemInfo = (item: BagDetail | CartItem) => {
  const info = getItemInfo(item);
  return { productUid: info.productUid, productCount: info.productCount, bagDetailId: info.bagDetailId,
    price: info.price, mrp: info.mrp, product: info.product };
};

export const getProductDetails = (item: BagDetail | CartItem) => {
  const info = getItemInfo(item);
  return { name: info.name, image: info.image, stock: info.stock, trackInventory: info.trackInventory,
    minOrderQuantity: info.minOrderQuantity };
};
