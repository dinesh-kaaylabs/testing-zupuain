import { useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { registerUser, loginUser } from '../../store/slices/authSlice';
import { useToast } from '../ui/useToast';
import { FormData, validateRegistrationForm } from '../../utils/formValidation';

interface UseRegistrationReturn {
  formData: FormData;
  errors: Record<string, string>;
  loading: boolean;
  handleInputChange: (field: keyof FormData, value: string | boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<boolean>;
  validateField: (field: keyof FormData) => void;
  clearErrors: () => void;
}

const initialFormData: FormData = {
  user_name: '',
  phone_number: '',
  email_address: '',
  password: '',
  confirm_password: '',
  termsAccepted: false,
};

export const useRegistration = (): UseRegistrationReturn => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { success, error: errorToast } = useToast();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Use ref to avoid recreating handleInputChange on every error change
  const errorsRef = useRef(errors);
  errorsRef.current = errors;

  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errorsRef.current[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const validateField = useCallback((field: keyof FormData) => {
    // Validate on-demand, only when explicitly called
    const { errors: validationErrors } = validateRegistrationForm(formData);
    if (validationErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: validationErrors[field]! }));
    }
  }, [formData]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Helper to handle auto-login after registration
  const handleAutoLogin = useCallback(async (credentials: { email_address: string; password: string }) => {
    try {
      const loginResult = await dispatch(loginUser(credentials));
      
      if (loginUser.fulfilled.match(loginResult)) {
        success(`Welcome, ${loginResult.payload.user.user_name}!`);
        setFormData(initialFormData);
        setErrors({});
        return true;
      } else {
        errorToast('Registration successful! Please log in manually.');
        setFormData(initialFormData);
        setErrors({});
        return true;
      }
    } catch (loginErr) {
      console.error('Auto-login error:', loginErr);
      errorToast('Registration successful! Please log in manually.');
      setFormData(initialFormData);
      setErrors({});
      return true;
    }
  }, [dispatch, success, errorToast]);

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    
    // Validate only on submit
    const { isValid, errors: validationErrors } = validateRegistrationForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors as Record<string, string>);
      errorToast('Please fix the errors below');
      return false;
    }

    try {
      const credentials = {
        email_address: formData.email_address,
        password: formData.password,
      };

      const result = await dispatch(registerUser({
        user_name: formData.user_name,
        email_address: formData.email_address,
        password: formData.password,
        phone_number: formData.phone_number,
      }));

      console.log('Registration result:', result);
      
      // Check if registration was successful
      const isSuccess = registerUser.fulfilled.match(result);
      
      if (isSuccess) {
        success('Registration successful! Logging you in...');
        return await handleAutoLogin(credentials);
      } else if (registerUser.rejected.match(result)) {
        const errorMessage = result.payload as string || 'Registration failed';
        errorToast(errorMessage);
        return false;
      } else {
        errorToast('Registration failed. Please try again.');
        return false;
      }
    } catch (err) {
      console.error('Registration error:', err);
      errorToast('An unexpected error occurred. Please try again.');
      return false;
    }
  }, [dispatch, formData, errorToast, success, handleAutoLogin]);

  return {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    validateField,
    clearErrors,
  };
};
