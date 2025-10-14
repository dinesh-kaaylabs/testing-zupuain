import { useMemo } from 'react';
import { DeliverySlot } from '../../types/api';

export interface SlotCapacity {
  status: 'full' | 'limited' | 'filling' | 'available';
  color: 'red' | 'orange' | 'yellow' | 'green';
  label: string;
}

export const useDeliveryStep = (deliverySlots: DeliverySlot[], selectedDeliveryDate: string | null) => {
  const availableDates = useMemo(() => 
    ([...new Set(deliverySlots.map(slot => slot.delivery_date))].filter(Boolean) as string[]).sort(),
    [deliverySlots]
  );

  const slotsForDate = useMemo(() => 
    selectedDeliveryDate ? deliverySlots.filter(slot => slot.delivery_date === selectedDeliveryDate) : [],
    [deliverySlots, selectedDeliveryDate]
  );

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getSlotCapacity = (slot: DeliverySlot): SlotCapacity | null => {
    if (!slot.max_orders_per_slot) return null;
    const remaining = slot.max_orders_per_slot - (slot.order_count || 0);
    const percentage = (remaining / slot.max_orders_per_slot) * 100;
    
    if (percentage <= 0) return { status: 'full', color: 'red', label: 'Full' };
    if (percentage <= 25) return { status: 'limited', color: 'orange', label: `${remaining} left` };
    if (percentage <= 50) return { status: 'filling', color: 'yellow', label: `${remaining} left` };
    return { status: 'available', color: 'green', label: 'Available' };
  };

  return { availableDates, slotsForDate, formatDate, getSlotCapacity };
};

