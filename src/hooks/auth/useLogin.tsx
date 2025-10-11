import { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { loginUser } from '../../store/slices/authSlice';
import { useToast } from '../ui/useToast';

interface LoginCredentials {
  email_address: string;
  password: string;
  rememberMe?: boolean;
}

interface UseLoginReturn {
  credentials: LoginCredentials;
  errors: Record<string, string>;
  loading: boolean;
  handleInputChange: (field: keyof LoginCredentials, value: string | boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<boolean>;
  validateField: (field: keyof LoginCredentials) => void;
  clearErrors: () => void;
}

const initialCredentials: LoginCredentials = {
  email_address: '',
  password: '',
  rememberMe: false,
};

export const useLogin = (): UseLoginReturn => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { success, error: errorToast } = useToast();
  
  const [credentials, setCredentials] = useState<LoginCredentials>(initialCredentials);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback((field: keyof LoginCredentials, value: string | boolean) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Memoize email regex to avoid recreation
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validateField = useCallback((field: keyof LoginCredentials) => {
    const value = credentials[field];
    
    if (field === 'email_address') {
      if (!value || typeof value !== 'string') {
        setErrors(prev => ({ ...prev, [field]: 'Email is required' }));
      } else if (!emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, [field]: 'Please enter a valid email address' }));
      } else {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    } else if (field === 'password') {
      if (!value || typeof value !== 'string') {
        setErrors(prev => ({ ...prev, [field]: 'Password is required' }));
      } else if (value.length < 6) {
        setErrors(prev => ({ ...prev, [field]: 'Password must be at least 6 characters' }));
      } else {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  }, [credentials, emailRegex]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    
    // Validate form
    validateField('email_address');
    validateField('password');
    
    // Check for errors after validation
    const currentErrors = errors;
    if (currentErrors.email_address || currentErrors.password) {
      errorToast('Please fix the errors below');
      return false;
    }

    try {
      const result = await dispatch(loginUser({
        email_address: credentials.email_address,
        password: credentials.password,
      }));
      if (loginUser.fulfilled.match(result)) {
        success(`Welcome back, ${result.payload.user.user_name}!`);
        // Reset form
        setCredentials(initialCredentials);
        setErrors({});
        return true; // Login successful
      } else if (loginUser.rejected.match(result)) {
        const errorMessage = result.payload as string || 'Login failed';
        
        // Check if the error is about OTP login requirement
        if (errorMessage.includes('OTP login') || errorMessage.includes('password login')) {
          errorToast('Please use OTP login for this account. Click "Login with OTP" below.');
        } else {
          errorToast(errorMessage);
        }
        return false; // Login failed
      }
      return false; // Default to failed
    } catch (err) {
      errorToast('An unexpected error occurred. Please try again.');
      return false; // Login failed
    }
  }, [dispatch, credentials, errors, errorToast, success, validateField]);

  return {
    credentials,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    validateField,
    clearErrors,
  };
};
