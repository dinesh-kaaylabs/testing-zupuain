import { DecodedOrderData } from '../types/api';
import { decodeBase64Json } from './commonUtils';

// Decodes base64 encoded order data from URL query param 'success'
export const decodeOrderDataFromUrl = (urlLink: string): DecodedOrderData | null => {
  try {
    const encodedData = new URL(urlLink, window.location.origin).searchParams.get('success');
    if (!encodedData) return null;
    return decodeBase64Json<DecodedOrderData>(encodedData);
  } catch {
    return null;
  }
};

// Payment method slug to readable text
const PAYMENT_METHODS: Record<string, string> = {
  cod: 'Cash on Delivery',
  razorpay: 'Razorpay',
  online: 'Online Payment',
  upi: 'UPI Payment',
  card: 'Card Payment',
};

export const formatPaymentMethodName = (slug: string) => 
  PAYMENT_METHODS[slug.toLowerCase()] || slug.toUpperCase();

// Transaction status with color coding
const TX_STATUS: Record<string, { text: string; color: string }> = {
  SUCCESS: { text: 'Success', color: 'green' },
  PENDING: { text: 'Pending', color: 'yellow' },
  FAILED: { text: 'Failed', color: 'red' },
  PROCESSING: { text: 'Processing', color: 'blue' },
};

export const formatTransactionStatus = (txStatus: string) => 
  TX_STATUS[txStatus.toUpperCase()] || { text: txStatus, color: 'gray' };

// Calculate total items from products array
export const calculateTotalItems = (products: DecodedOrderData['products']) => 
  products.reduce((sum, p) => sum + p.product_count, 0);
