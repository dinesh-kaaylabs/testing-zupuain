import { useCallback } from 'react';
import { DeliverySlot } from '../../types/api';

interface CapacityStatus {
  text: string;
  color: string;
}

export const useDeliverySlotCapacity = () => {
  const getCapacityPercentage = useCallback((slot: DeliverySlot): number => {
    if (!slot.max_orders_per_slot || slot.order_count === undefined) return 0;
    return (slot.order_count / slot.max_orders_per_slot) * 100;
  }, []);

  const getCapacityStatus = useCallback((slot: DeliverySlot): CapacityStatus => {
    const pct = getCapacityPercentage(slot);
    if (pct >= 100) return { text: 'Full', color: 'text-red-600 dark:text-red-400' };
    if (pct >= 75) return { text: 'Almost Full', color: 'text-orange-600 dark:text-orange-400' };
    if (pct >= 50) return { text: 'Filling Fast', color: 'text-yellow-600 dark:text-yellow-400' };
    return { text: 'Available', color: 'text-green-600 dark:text-green-400' };
  }, [getCapacityPercentage]);

  const isSlotFull = useCallback((slot: DeliverySlot): boolean => 
    !!(slot.max_orders_per_slot && slot.order_count !== undefined && slot.order_count >= slot.max_orders_per_slot)
  , []);

  const isSlotPopular = useCallback((slot: DeliverySlot): boolean => {
    const pct = getCapacityPercentage(slot);
    return pct >= 50 && pct < 100;
  }, [getCapacityPercentage]);

  return { getCapacityPercentage, getCapacityStatus, isSlotFull, isSlotPopular };
};
