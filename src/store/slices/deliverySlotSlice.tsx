import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { deliverySlotApi } from '../../services/deliverySlotApi';
import { DeliveryDay, DeliverySlot } from '../../types/api';

interface DeliverySlotState {
  availableSlots: DeliverySlot[]; // Changed to flat array
  rawDays: DeliveryDay[]; // Store original data
  selectedDate: string | null;
  selectedSlot: DeliverySlot | null;
  loading: boolean;
  error: string | null;
}

const initialState: DeliverySlotState = {
  availableSlots: [],
  rawDays: [],
  selectedDate: null,
  selectedSlot: null,
  loading: false,
  error: null,
};

// Helper function to get next date for a given day name
const getNextDateForDay = (dayName: string, weeksAhead: number = 0): string => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDayIndex = daysOfWeek.findIndex(d => d.toLowerCase() === dayName.toLowerCase());
  
  if (targetDayIndex === -1) return new Date().toISOString().split('T')[0];
  
  const today = new Date();
  const currentDayIndex = today.getDay();
  
  let daysToAdd = targetDayIndex - currentDayIndex;
  if (daysToAdd < 0) daysToAdd += 7;
  daysToAdd += weeksAhead * 7;
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);
  
  return targetDate.toISOString().split('T')[0];
};

// Transform nested data to flat array with delivery dates
const transformDeliveryData = (deliveryDays: DeliveryDay[], maxDays: number = 28): DeliverySlot[] => {
  const flatSlots: DeliverySlot[] = [];
  
  // Calculate how many weeks we need to generate based on maxDays
  const maxWeeks = Math.ceil(maxDays / 7);
  
  deliveryDays.forEach((day) => {
    if (!day.is_active || !day.delivery_slots?.length) return;
    
    for (let week = 0; week < maxWeeks; week++) {
      const deliveryDate = getNextDateForDay(day.day_name, week);
      
      // Check if this date is within the maxDays limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deliveryDateObj = new Date(deliveryDate);
      const daysDifference = Math.floor((deliveryDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      // Skip dates beyond maxDays
      if (daysDifference >= maxDays) continue;
      
      day.delivery_slots.forEach((slot) => {
        if (slot.is_active) {
          // Format time for display if not provided
          const formatTime = (time: string) => {
            if (!time) return '';
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
          };

          const deliveryTime = slot.delivery_time || 
            `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`;

          flatSlots.push({
            ...slot,
            delivery_slot_id: slot.id,
            delivery_date: deliveryDate,
            delivery_time: deliveryTime,
            dayName: day.day_name,
            max_orders_per_slot: slot.max_orders_per_slot || undefined,
            delivery_charge: slot.delivery_charge || 0,
            order_count: slot.order_count || 0,
          });
        }
      });
    }
  });
  
  return flatSlots.sort((a, b) => {
    const dateCompare = (a.delivery_date || '').localeCompare(b.delivery_date || '');
    if (dateCompare !== 0) return dateCompare;
    return (a.start_time || '').localeCompare(b.start_time || '');
  });
};

export const fetchDeliverySlots = createAsyncThunk(
  'deliverySlot/fetchDeliverySlots',
  async (params: { dayName?: string; delivery_date?: string }, { rejectWithValue, getState }) => {
    try {
      const response = await deliverySlotApi.getDeliverySlots(params);
      if (!response.success) return rejectWithValue(response.message || 'Failed to fetch delivery slots');
      
      // Get maxDays from tenant settings
      const state = getState() as any;
      const maxDays = state.tenant?.defaultTenant?.setting?.deliveryslot_max_day || 28;
      
      return { data: response.data || [], maxDays };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Helper function for loading states
const handleLoading = (state: any, loading: boolean, error: string | null = null) => {
  state.loading = loading;
  if (error !== null) state.error = error;
};

const deliverySlotSlice = createSlice({
  name: 'deliverySlot',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },
    setSelectedSlot: (state, action: PayloadAction<DeliverySlot | null>) => {
      state.selectedSlot = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliverySlots.pending, (state) => handleLoading(state, true))
      .addCase(fetchDeliverySlots.fulfilled, (state, action: PayloadAction<{ data: DeliveryDay[], maxDays: number }>) => {
        handleLoading(state, false);
        state.rawDays = action.payload.data;
        state.availableSlots = transformDeliveryData(action.payload.data, action.payload.maxDays);
      })
      .addCase(fetchDeliverySlots.rejected, (state, action) => 
        handleLoading(state, false, action.payload as string));
  },
});

export const { setSelectedDate, setSelectedSlot, clearError } = deliverySlotSlice.actions;
export default deliverySlotSlice.reducer;
