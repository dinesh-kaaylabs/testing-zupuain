import { useState } from 'react';
import { useAppDispatch } from '../redux';
import { createAddress, updateAddress } from '../../store/slices/addressSlice';
import { useToast } from '../ui/useToast';
import { Address } from '../../types/api';

export interface FormData {
  address_tag: string;
  complete_address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  is_default: boolean;
}

const initForm = (address: Address | null): FormData => ({
  address_tag: address?.address_tag || 'Home',
  complete_address: address?.complete_address || address?.address || '',
  city: address?.city || '',
  state: address?.state || '',
  pincode: address?.pincode || '',
  landmark: address?.landmark || '',
  is_default: address?.is_default || false,
});

export const useAddressForm = (address: Address | null, onSuccess: () => void) => {
  const dispatch = useAppDispatch();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState(() => initForm(address));
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const { complete_address, city, state, pincode } = formData;

    if (!complete_address.trim()) newErrors.complete_address = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = 'Pincode must be 6 digits';

    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = { ...formData, address: formData.complete_address, country: 'India' };
      if (address?.b2c_address_id) {
        await dispatch(updateAddress({ addressId: address.b2c_address_id, addressData: payload })).unwrap();
      } else {
        await dispatch(createAddress(payload)).unwrap();
      }
      success(`Address ${address ? 'updated' : 'added'} successfully!`);
      onSuccess();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, errors, isSubmitting, handleChange, handleSubmit };
};

