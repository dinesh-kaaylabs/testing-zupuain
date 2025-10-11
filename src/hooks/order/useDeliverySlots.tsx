import { useMemo } from 'react';
import { DeliverySlot } from '../../types/api';

interface UseDeliverySlotsReturn {
  availableDates: string[];
  slotsForDate: DeliverySlot[];
  hasSlots: boolean;
  hasSlotsForDate: boolean;
}

export const useDeliverySlots = (deliverySlots: DeliverySlot[], selectedDate: string | null): UseDeliverySlotsReturn => {
  const availableDates = useMemo(() => 
    [...new Set(deliverySlots.map(s => s.delivery_date))].filter(Boolean).sort() as string[]
  , [deliverySlots]);

  const slotsForDate = useMemo(() => 
    selectedDate ? deliverySlots.filter(s => s.delivery_date === selectedDate) : []
  , [deliverySlots, selectedDate]);

  return {
    availableDates,
    slotsForDate,
    hasSlots: deliverySlots.length > 0,
    hasSlotsForDate: slotsForDate.length > 0,
  };
};
