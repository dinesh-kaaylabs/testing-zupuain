import { useCallback } from 'react';
import { Tenant } from '../types/api';
import { useAppSelector } from '../hooks';
import { DEFAULTS } from './constants';

export const formatCurrency = (
  amount: string | number, 
  tenant?: Tenant | null,
  fallbackCurrency: string = DEFAULTS.CURRENCY
): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) {
    return `${fallbackCurrency}0.00`;
  }
  const currencySymbol = tenant?.setting?.currency || DEFAULTS.CURRENCY_NAME;
  const locale = tenant?.setting?.currency_locale || DEFAULTS.CURRENCY_LOCALE;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencySymbol,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    return `${currencySymbol}${numericAmount.toFixed(2)}`;
  }
};

export const useCurrencyFormatter = () => {
  const { defaultTenant } = useAppSelector((state) => state.tenant);
  const formatCurrencyCallback = useCallback((amount: string | number): string => {
    return formatCurrency(amount, defaultTenant);
  }, [defaultTenant]);
  return { formatCurrency: formatCurrencyCallback };
};
