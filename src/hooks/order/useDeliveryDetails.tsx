import { useMemo } from 'react';
import { OrderUserDetails } from '../../types/api';

export const useDeliveryDetails = (userDetails: OrderUserDetails | null) => 
  useMemo(() => {
    if (!userDetails) return null;
    const { user_name, complete_address, city, state, pincode, country, phone_number, payment_method } = userDetails;
    return {
      sections: [
        { id: 'customer', label: 'Customer', value: user_name, icon: 'user', bgColor: 'from-purple-50 to-pink-50', iconColor: 'text-purple-600' },
        { id: 'address', label: 'Address', value: [complete_address, `${city}, ${state} ${pincode}`, country], icon: 'map-pin', bgColor: 'bg-gray-50', iconColor: 'text-red-500' },
        { id: 'contact', label: 'Contact', value: phone_number, icon: 'phone', bgColor: 'bg-green-50', iconColor: 'text-green-600', isClickable: true, href: `tel:${phone_number}` },
        { id: 'payment', label: 'Payment', value: payment_method, icon: 'credit-card', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      ],
    };
  }, [userDetails]);
