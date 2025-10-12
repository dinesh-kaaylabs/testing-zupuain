import { useState, useCallback, ChangeEvent } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { createAddress, updateAddress } from '../../store/slices/addressSlice';
import { useToast } from '../../hooks/ui/useToast';
import { Address } from '../../types/api';

interface AddressFormProps {
  address: Address | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  address_tag: string;
  complete_address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  is_default: boolean;
}

const INITIAL_FORM: FormData = {
  address_tag: 'Home',
  complete_address: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
  is_default: false,
};

export const AddressForm = ({ address, onClose, onSuccess }: AddressFormProps) => {
  const dispatch = useAppDispatch();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState<FormData>(() => {
    if (!address) return INITIAL_FORM;
    return {
      address_tag: address.address_tag || 'Home',
      complete_address: address.complete_address || address.address || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      landmark: address.landmark || '',
      is_default: address.is_default || false,
    };
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.complete_address.trim()) newErrors.complete_address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        address_tag: formData.address_tag,
        address: formData.complete_address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        landmark: formData.landmark,
        is_default: formData.is_default,
        country: 'India',
      };

      if (address?.b2c_address_id) {
        await dispatch(updateAddress({ addressId: address.b2c_address_id, addressData: payload })).unwrap();
        success('Address updated successfully!');
      } else {
        await dispatch(createAddress(payload)).unwrap();
        success('Address added successfully!');
      }

      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save address';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, address, dispatch, onSuccess, success, showError, isSubmitting]);

  const addressTags = ['Home', 'Work', 'Other'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          {address ? 'Edit Address' : 'Add New Address'}
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address Tag */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address Type
          </label>
          <div className="flex space-x-2">
            {addressTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleChange('address_tag', tag)}
                className={`
                  flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${
                    formData.address_tag === tag
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Complete Address */}
        <div>
          <label htmlFor="complete_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Complete Address <span className="text-red-500">*</span>
          </label>
          <textarea
            id="complete_address"
            value={formData.complete_address}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange('complete_address', e.target.value)}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
              errors.complete_address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="House No., Building Name, Street, Area"
          />
          {errors.complete_address && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.complete_address}</p>
          )}
        </div>

        {/* City & State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('city', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="City"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              id="state"
              type="text"
              value={formData.state}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('state', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="State"
            />
            {errors.state && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.state}</p>}
          </div>
        </div>

        {/* Pincode & Landmark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              id="pincode"
              type="text"
              value={formData.pincode}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('pincode', e.target.value)}
              maxLength={6}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                errors.pincode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="123456"
            />
            {errors.pincode && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pincode}</p>}
          </div>

          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Landmark (Optional)
            </label>
            <input
              id="landmark"
              type="text"
              value={formData.landmark}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('landmark', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="Nearby landmark"
            />
          </div>
        </div>

        {/* Default Address */}
        <div className="flex items-center space-x-2">
          <input
            id="is_default"
            type="checkbox"
            checked={formData.is_default}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('is_default', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="is_default" className="text-sm text-gray-700 dark:text-gray-300">
            Set as default address
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Address</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

