import { useMemo } from 'react';
import { formatDate } from './shared';

export const useOrderHeader = (orderId: string, orderSerialNumber?: string, creationDate?: string) => 
  useMemo(() => {
    if (!orderId) return null;
    const isNew = creationDate ? Math.ceil((Date.now() - new Date(creationDate).getTime()) / 86400000) <= 2 : false;
    return {
      displayOrderNumber: orderSerialNumber || orderId,
      formattedDate: creationDate ? formatDate(creationDate, 'long') : null,
      hasDate: !!creationDate,
      isNew,
    };
  }, [orderId, orderSerialNumber, creationDate]);

export const useOrderHeaderActions = (isRefreshing: boolean, canCancel: boolean) => 
  useMemo(() => ({
    showRefreshButton: true,
    showCancelButton: canCancel,
    isRefreshDisabled: isRefreshing,
    refreshButtonState: isRefreshing ? 'loading' as const : 'idle' as const,
  }), [isRefreshing, canCancel]);

export const useOrderHeaderBreadcrumb = (returnPath?: string) => 
  useMemo(() => ({
    path: returnPath || '/account',
    label: 'Back to Orders',
  }), [returnPath]);
