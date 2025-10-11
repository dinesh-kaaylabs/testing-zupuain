import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../redux';
import { useToast } from '../ui/useToast';
import { Address } from '../../types/api';
import { 
  fetchUserAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress as deleteAddressAction, 
  setDefaultAddress as setDefaultAddressAction 
} from '../../store/slices/addressSlice';

interface AddressFormData {
  address_tag: string;
  complete_address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string;
  is_default: boolean;
}

const INITIAL_FORM: AddressFormData = {
  address_tag: 'Home',
  complete_address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  landmark: '',
  is_default: false,
};

const VALIDATORS: Record<string, (v: any) => string> = {
  address_tag: (v: string) => !v?.trim() ? 'Label is required' : v.trim().length < 2 ? 'Label too short' : '',
  complete_address: (v: string) => !v?.trim() ? 'Address is required' : v.trim().length < 10 ? 'Address too short' : '',
  city: (v: string) => !v?.trim() ? 'City is required' : '',
  state: (v: string) => !v?.trim() ? 'State is required' : '',
  country: (v: string) => !v?.trim() ? 'Country is required' : '',
  pincode: (v: string) => !v?.trim() ? 'PIN code is required' : !/^\d{5,6}$/.test(v.trim()) ? 'Invalid PIN code' : '',
};

interface UseAddressBookReturn {
  addresses: Address[];
  selectedAddress: Address | null;
  defaultAddress: Address | null;
  formData: AddressFormData;
  errors: Partial<Record<keyof AddressFormData, string>>;
  isEditing: boolean;
  loading: boolean;
  showForm: boolean;
  editingAddress: Address | null;
  fetchAddresses: () => Promise<void>;
  selectAddress: (address: Address | null) => void;
  startEditing: (address?: Address) => void;
  cancelEditing: () => void;
  updateField: (field: keyof AddressFormData, value: string | boolean) => void;
  saveAddress: () => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  setAsDefault: (addressId: string) => Promise<boolean>;
  openForm: (address?: Address) => void;
  closeForm: () => void;
  handleEdit: (address?: Address) => void;
  handleDelete: (addressId: string) => Promise<void>;
  handleSetDefault: (addressId: string) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  hasAddresses: boolean;
}

export const useAddressBook = (): UseAddressBookReturn => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { addresses, loading } = useAppSelector((state) => state.address);
  const { success, error } = useToast();
  
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const defaultAddress = useMemo(() => 
    addresses.find(addr => addr.is_default) || null, 
    [addresses]
  );

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    try {
      await dispatch(fetchUserAddresses()).unwrap();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      error(errorMessage || 'Failed to fetch addresses');
    }
  }, [user, dispatch, error]);

  const updateField = useCallback((field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};
    Object.keys(VALIDATORS).forEach(field => {
      const value = formData[field as keyof AddressFormData];
      if (value !== undefined) {
        const err = VALIDATORS[field]?.(value);
        if (err) newErrors[field as keyof AddressFormData] = err;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const openForm = useCallback((address?: Address) => {
    if (address) {
      setFormData({
        address_tag: address.address_tag,
        complete_address: address.complete_address || address.address || '',
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
        landmark: address.landmark || '',
        is_default: address.is_default,
      });
      setEditingId(address.b2c_address_uid);
    } else {
      setFormData(INITIAL_FORM);
      setEditingId(null);
    }
    setShowForm(true);
    setErrors({});
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      error('Please fix the errors before saving');
      return;
    }

    try {
      if (editingId) {
        await dispatch(updateAddress({ addressId: editingId, addressData: formData })).unwrap();
        success('Address updated');
      } else {
        await dispatch(createAddress(formData)).unwrap();
        success('Address added');
      }
      closeForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      error(errorMessage || 'Failed to save address');
    }
  }, [formData, editingId, validateForm, dispatch, success, error, closeForm]);

  const handleDelete = useCallback(async (addressId: string) => {
    const addr = addresses.find(a => a.b2c_address_uid === addressId);
    if (addresses.length <= 1) {
      error('Must have at least one address');
      return;
    }
    if (addr?.is_default) {
      error('Cannot delete default address');
      return;
    }

    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddressAction(addressId)).unwrap();
        success('Address deleted');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        error(errorMessage || 'Failed to delete address');
      }
    }
  }, [addresses, dispatch, success, error]);

  const handleSetDefault = useCallback(async (addressId: string) => {
    try {
      await dispatch(setDefaultAddressAction(addressId)).unwrap();
      success('Default address updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      error(errorMessage || 'Failed to update default address');
    }
  }, [dispatch, success, error]);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  return {
    addresses,
    selectedAddress,
    defaultAddress,
    formData,
    errors,
    isEditing: !!editingId,
    loading,
    showForm,
    editingAddress: editingId ? addresses.find(a => a.b2c_address_uid === editingId) || null : null,
    fetchAddresses,
    selectAddress: setSelectedAddress,
    startEditing: openForm,
    cancelEditing: closeForm,
    updateField,
    saveAddress: async () => {
      if (!validateForm()) {
        error('Please fix the errors before saving');
        return false;
      }
      try {
        if (editingId) {
          await dispatch(updateAddress({ addressId: editingId, addressData: formData })).unwrap();
          success('Address updated');
        } else {
          await dispatch(createAddress(formData)).unwrap();
          success('Address added');
        }
        closeForm();
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        error(errorMessage || 'Failed to save address');
        return false;
      }
    },
    deleteAddress: async (addressId: string) => {
      const addr = addresses.find(a => a.b2c_address_uid === addressId);
      if (addresses.length <= 1 || addr?.is_default) {
        error(addresses.length <= 1 ? 'Must have at least one address' : 'Cannot delete default address');
        return false;
      }
      try {
        await dispatch(deleteAddressAction(addressId)).unwrap();
        success('Address deleted');
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        error(errorMessage || 'Failed to delete address');
        return false;
      }
    },
    setAsDefault: async (addressId: string) => {
      try {
        await dispatch(setDefaultAddressAction(addressId)).unwrap();
        success('Default address updated');
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        error(errorMessage || 'Failed to update default address');
        return false;
      }
    },
    openForm,
    closeForm,
    handleEdit: openForm,
    handleDelete,
    handleSetDefault,
    handleSubmit,
    hasAddresses: addresses.length > 0,
  };
};
