import { useMemo } from 'react';
import { Calendar, Clock, Truck, AlertCircle, TrendingUp } from 'lucide-react';
import { DeliverySlot } from '../../types/api';
import { formatCurrency } from '../../utils/currencyFormatter';

interface DeliveryStepProps {
  deliverySlots: DeliverySlot[];
  selectedDeliveryDate: string | null;
  selectedDeliverySlot: DeliverySlot | null;
  deliveryLoading: boolean;
  deliveryError: string | null;
  setSelectedDeliveryDate: (date: string | null) => void;
  setSelectedDeliverySlot: (slot: DeliverySlot | null) => void;
  refreshDeliverySlots: () => void;
}

export const DeliveryStep = ({
  deliverySlots,
  selectedDeliveryDate,
  selectedDeliverySlot,
  deliveryLoading,
  deliveryError,
  setSelectedDeliveryDate,
  setSelectedDeliverySlot,
}: DeliveryStepProps) => {
  // Get unique dates from slots
  const availableDates = useMemo(() => {
    const dates = [...new Set(deliverySlots.map(slot => slot.delivery_date))].filter(Boolean) as string[];
    return dates.sort();
  }, [deliverySlots]);

  // Get slots for selected date
  const slotsForDate = useMemo(() => {
    if (!selectedDeliveryDate) return [];
    return deliverySlots.filter(slot => slot.delivery_date === selectedDeliveryDate);
  }, [deliverySlots, selectedDeliveryDate]);

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get slot capacity info
  const getSlotCapacity = (slot: DeliverySlot) => {
    if (!slot.max_orders_per_slot) return null;
    const remaining = slot.max_orders_per_slot - (slot.order_count || 0);
    const percentage = (remaining / slot.max_orders_per_slot) * 100;
    
    if (percentage <= 0) return { status: 'full', color: 'red', label: 'Full' };
    if (percentage <= 25) return { status: 'limited', color: 'orange', label: `${remaining} left` };
    if (percentage <= 50) return { status: 'filling', color: 'yellow', label: `${remaining} left` };
    return { status: 'available', color: 'green', label: 'Available' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <Truck className="w-6 h-6 mr-2 text-blue-600" />
          Delivery Schedule
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Choose your preferred delivery date and time slot
        </p>
      </div>

      {/* Error Message */}
      {deliveryError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{deliveryError}</p>
        </div>
      )}

      {/* Loading State */}
      {deliveryLoading && availableDates.length === 0 ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        </div>
      ) : availableDates.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No delivery slots available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please check back later or contact support
          </p>
        </div>
      ) : (
        <>
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Select Delivery Date
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableDates.map((date) => {
                const isSelected = selectedDeliveryDate === date;
                const dateObj = new Date(date);
                
                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDeliveryDate(date);
                      setSelectedDeliverySlot(null);
                    }}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-300
                      ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800'
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className={`text-lg font-bold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {formatDate(date)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Selection */}
          {selectedDeliveryDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Select Time Slot
              </label>
              {slotsForDate.length === 0 ? (
                <div className="p-6 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">No slots available for this date</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slotsForDate.map((slot) => {
                    const isSelected = selectedDeliverySlot?.id === slot.id;
                    const capacity = getSlotCapacity(slot);
                    const isFull = capacity?.status === 'full';

                    return (
                      <button
                        key={slot.id}
                        onClick={() => !isFull && setSelectedDeliverySlot(slot)}
                        disabled={isFull}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-300 text-left
                          ${
                            isFull
                              ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 opacity-50 cursor-not-allowed'
                              : isSelected
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className={`font-semibold ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                              {slot.delivery_time || `${slot.start_time} - ${slot.end_time}`}
                            </div>
                            {slot.delivery_charge !== undefined && slot.delivery_charge > 0 && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                + {formatCurrency(slot.delivery_charge)} delivery fee
                              </div>
                            )}
                          </div>

                          {/* Capacity Badge */}
                          {capacity && (
                            <div className={`
                              ml-2 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1
                              ${
                                capacity.status === 'full'
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                  : capacity.status === 'limited'
                                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                                  : capacity.status === 'filling'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                  : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                              }
                            `}>
                              {capacity.status === 'limited' && <TrendingUp className="w-3 h-3" />}
                              <span>{capacity.label}</span>
                            </div>
                          )}
                        </div>

                        {/* Order Count */}
                        {slot.max_orders_per_slot && slot.order_count !== undefined && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {slot.order_count} of {slot.max_orders_per_slot} orders booked
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Selection Summary */}
          {selectedDeliveryDate && selectedDeliverySlot && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                    Delivery Scheduled
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>{formatDate(selectedDeliveryDate)}</strong> • {selectedDeliverySlot.delivery_time || `${selectedDeliverySlot.start_time} - ${selectedDeliverySlot.end_time}`}
                  </p>
                  {selectedDeliverySlot.delivery_charge !== undefined && selectedDeliverySlot.delivery_charge > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Delivery fee: {formatCurrency(selectedDeliverySlot.delivery_charge)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

