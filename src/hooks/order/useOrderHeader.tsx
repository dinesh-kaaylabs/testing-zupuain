import { useMemo } from 'react';
import { formatDate } from './shared';

interface OrderHeaderData {
  displayOrderNumber: string;
  formattedDate: string | null;
  hasDate: boolean;
  isNew: boolean;
}

interface OrderHeaderActions {
  showRefreshButton: boolean;
  showCancelButton: boolean;
  isRefreshDisabled: boolean;
  refreshButtonState: 'loading' | 'idle';
}

interface OrderHeaderBreadcrumb {
  path: string;
  label: string;
}

export const useOrderHeader = (orderId: string, orderSerialNumber?: string, creationDate?: string): OrderHeaderData=> 
  useMemo(() => {
    if (!orderId) return { displayOrderNumber: '', formattedDate: null, hasDate: false, isNew: false };
    const isNew = creationDate ? Math.ceil((Date.now() - new Date(creationDate).getTime()) / 86400000) <= 2 : false;
    return {
      displayOrderNumber: orderSerialNumber || orderId,
      formattedDate: creationDate ? formatDate(creationDate, 'long') : null,
      hasDate: !!creationDate,
      isNew,
    };
  }, [orderId, orderSerialNumber, creationDate]);

export const useOrderHeaderActions = (isRefreshing: boolean, canCancel: boolean): OrderHeaderActions => 
  useMemo(() => ({
    showRefreshButton: true,
    showCancelButton: canCancel,
    isRefreshDisabled: isRefreshing,
    refreshButtonState: isRefreshing ? 'loading' as const : 'idle' as const,
  }), [isRefreshing, canCancel]);

export const useOrderHeaderBreadcrumb = (returnPath: string): OrderHeaderBreadcrumb => 
  useMemo(() => ({
    path: returnPath || '/account',
    label: 'Back to Orders',
  }), [returnPath]);
