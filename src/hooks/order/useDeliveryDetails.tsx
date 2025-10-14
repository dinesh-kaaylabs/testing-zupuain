import { useMemo } from 'react';
import { OrderUserDetails } from '../../types/api';

interface DeliverySection {
  id: string;
  label: string;
  value: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  isClickable?: boolean;
  href?: string;
}

interface UseDeliveryDetailsReturn {
  sections: DeliverySection[];
}

export const useDeliveryDetails = (userDetails: OrderUserDetails): UseDeliveryDetailsReturn => 
  useMemo(() => {
    if (!userDetails) return { sections: [] };
    const { user_name, complete_address, address, customer_location, city, state, pincode, country, phone_number, payment_method } = userDetails;
    const fullAddress = `${complete_address || address || customer_location}, ${city}, ${state} ${pincode}, ${country}`;
    return {
      sections: [
        { id: 'customer', label: 'Customer', value: user_name, icon: 'user', bgColor: 'from-purple-50 to-pink-50', iconColor: 'text-purple-600' },
        { id: 'address', label: 'Address', value: fullAddress, icon: 'map-pin', bgColor: 'bg-gray-50', iconColor: 'text-red-500' },
        { id: 'contact', label: 'Contact', value: phone_number, icon: 'phone', bgColor: 'bg-green-50', iconColor: 'text-green-600', isClickable: true, href: `tel:${phone_number}` },
        { id: 'payment', label: 'Payment', value: payment_method, icon: 'credit-card', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      ],
    };
  }, [userDetails]);
