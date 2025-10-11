import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppSelector } from '../redux';
import { useToast } from '../ui/useToast';
import { validateUserName, validateEmail, validatePhoneNumber } from '../../utils';

interface ProfileFormData {
  user_name: string;
  email_address: string;
  phone_number: string;
}

const VALIDATORS = {
  user_name: validateUserName,
  email_address: validateEmail,
  phone_number: validatePhoneNumber,
} as const;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const useAccountProfile = () => {
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { success, error } = useToast();
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    user_name: '',
    email_address: '',
    phone_number: '',
  });
  
  const [originalData, setOriginalData] = useState<ProfileFormData>(profileData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      const data = {
        user_name: user.user_name || '',
        email_address: user.email_address || '',
        phone_number: user.phone_number || '',
      };
      setProfileData(data);
      setOriginalData(data);
    }
  }, [user]);

  const hasChanges = useMemo(() => 
    JSON.stringify(profileData) !== JSON.stringify(originalData),
    [profileData, originalData]
  );

  const updateField = useCallback((field: keyof ProfileFormData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};
    (Object.keys(VALIDATORS) as (keyof ProfileFormData)[]).forEach(field => {
      const err = VALIDATORS[field](profileData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profileData]);

  const resetForm = useCallback(() => {
    setProfileData(originalData);
    setErrors({});
    setIsEditing(false);
  }, [originalData]);

  const saveProfile = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      error('Please fix the errors before saving');
      return false;
    }

    setLoading(true);
    try {
      // TODO: API call - await userApi.updateProfile(profileData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOriginalData(profileData);
      setIsEditing(false);
      success('Profile updated successfully');
      return true;
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  }, [profileData, validateForm, success, error]);

  const handleImageUpload = useCallback(async (file: File): Promise<void> => {
    if (!file.type.startsWith('image/')) {
      error('Please select an image file');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // TODO: Upload to server - await userApi.uploadProfileImage(file);
      success('Profile image updated');
    } catch (err: any) {
      error(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [success, error]);

  return {
    profileData,
    errors,
    loading: loading || authLoading,
    hasChanges,
    isEditing,
    profileImage,
    isUploading,
    updateField,
    saveProfile,
    resetForm,
    startEditing: () => setIsEditing(true),
    cancelEditing: resetForm,
    handleImageUpload,
  };
};
