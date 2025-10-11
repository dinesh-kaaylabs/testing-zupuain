import { useState, useCallback } from 'react';
import { orderApi } from '../../services/orderApi';
import { toast } from 'react-hot-toast';

interface UseOrderCancelReturn {
  cancelOrder: (orderUid: string, reason?: string) => Promise<boolean>;
  loading: boolean;
}

export const useOrderCancel = (): UseOrderCancelReturn => {
  const [loading, setLoading] = useState(false);

  const cancelOrder = useCallback(async (orderUid: string, reason?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await orderApi.cancelOrder(orderUid, reason);
      const success = res.success;
      toast[success ? 'success' : 'error'](res.message || (success ? 'Order cancelled successfully' : 'Failed to cancel order'));
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while cancelling the order';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancelOrder, loading };
};
