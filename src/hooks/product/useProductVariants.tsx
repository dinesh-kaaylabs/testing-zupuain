import { useMemo, useState, useCallback } from 'react';
import { Product, ProductVariant, VariantAttribute } from '../../types/api';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useAppSelector } from '../redux/useAppSelector';

export interface VariantSelection {
  [optionName: string]: string;
}

export interface VariantDisplayData {
  price: string;
  mrp: string;
  discount: string;
  discountPercent: number;
  savings: string;
  stock: number | null;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockStatusText: string;
  productCode: string;
  canAddToCart: boolean;
  images: string[];
}

const ATTR_MAP: Record<string, string> = {
  'Selling Price': 'sellingPrice',
  'MRP Price': 'mrpPrice',
  'Discount in %': 'discountPercent',
  'Stock': 'stock',
  'Product Code': 'productCode',
  'Units': 'units',
  'Image': 'images',
};

const getInitialSelection = (product: Product | null): VariantSelection => {
  if (!product?.variant_option?.length) return {};
  return product.variant_option.reduce((acc, opt) => {
    if (opt.variant_option_values.length) {
      const sorted = [...opt.variant_option_values].sort((a, b) => a.order_key - b.order_key);
      acc[opt.option_name] = sorted[0].option_value;
    }
    return acc;
  }, {} as VariantSelection);
};

const parseAttrValue = (attr: VariantAttribute, key: string) => {
  if (key === 'images') {
    try {
      const val = typeof attr.attribute_value === 'string' ? JSON.parse(attr.attribute_value) : attr.attribute_value;
      return Array.isArray(val) ? val : [];
    } catch { return []; }
  }
  return ['number', 'float'].includes(attr.zm_attribute.data_type) ? Number(attr.attribute_value) : attr.attribute_value;
};

const getStockInfo = (stock: number | null, trackInventory: boolean, lowStockLevel = 10) => {
  if (!trackInventory) return { status: 'in_stock' as const, text: 'In Stock' };
  if (stock === null || stock <= 0) return { status: 'out_of_stock' as const, text: 'Out of Stock' };
  if (stock <= lowStockLevel) return { status: 'low_stock' as const, text: 'Low Stock' };
  return { status: 'in_stock' as const, text: 'In Stock' };
};

export const useProductVariants = (product: Product | null) => {
  const { defaultTenant } = useAppSelector((state) => state.tenant);
  
  const initialSelection = useMemo(() => getInitialSelection(product), [product?.product_uid]);
  const [selectedVariant, setSelectedVariant] = useState(initialSelection);

  const currentVariant = useMemo((): ProductVariant | null => {
    if (!product?.product_variants?.length || !Object.keys(selectedVariant).length) return null;

    const expectedUnits = [...(product.variant_option || [])]
      .sort((a, b) => a.order - b.order)
      .map(opt => selectedVariant[opt.option_name])
      .filter(Boolean)
      .join('/');

    return product.product_variants.find(v => {
      const unitsAttr = v.variant_attributes.find(a => a.zm_attribute.name === 'Units');
      return unitsAttr && String(unitsAttr.attribute_value) === expectedUnits;
    }) || null;
  }, [product?.product_variants, product?.variant_option, selectedVariant]);

  const variantDisplayData = useMemo((): VariantDisplayData | null => {
    if (!currentVariant) return null;

    const data: Record<string, any> = { sellingPrice: 0, mrpPrice: 0, discountPercent: 0, stock: null, productCode: '', images: [] };
    currentVariant.variant_attributes.forEach(attr => {
      const key = ATTR_MAP[attr.zm_attribute.name];
      if (key) data[key] = parseAttrValue(attr, key);
    });

    const savings = data.mrpPrice - data.sellingPrice;
    const stock = data.stock !== null ? Number(data.stock) : null;
    const stockInfo = getStockInfo(stock, product?.track_inventory || false, product?.low_stock_level || 10);

    return {
      price: formatCurrency(data.sellingPrice, defaultTenant),
      mrp: formatCurrency(data.mrpPrice, defaultTenant),
      discount: formatCurrency(savings, defaultTenant),
      discountPercent: Math.round(data.discountPercent),
      savings: formatCurrency(savings, defaultTenant),
      stock,
      stockStatus: stockInfo.status,
      stockStatusText: stockInfo.text,
      productCode: String(data.productCode),
      canAddToCart: (product?.product_status && stockInfo.status !== 'out_of_stock') || false,
      images: data.images.length ? data.images : [],
    };
  }, [currentVariant, product?.track_inventory, product?.low_stock_level, product?.product_status, defaultTenant]);

  const handleVariantChange = useCallback((optionName: string, value: string) => {
    setSelectedVariant(prev => ({ ...prev, [optionName]: value }));
  }, []);

  return {
    hasVariants: !!product?.variant_option?.length,
    variantOptions: product?.variant_option || [],
    selectedVariant,
    currentVariant,
    variantDisplayData,
    handleVariantChange,
  };
};
