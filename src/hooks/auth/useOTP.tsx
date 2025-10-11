import { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../redux';
import { sendOtp, verifyOtp } from '../../store/slices/authSlice';
import { useToast } from '../ui/useToast';

interface OTPData {
  phone_number: string;
  otp: string;
}

interface UseOTPReturn {
  otpData: OTPData;
  errors: Record<string, string>;
  loading: boolean;
  otpSent: boolean;
  handleInputChange: (field: keyof OTPData, value: string) => void;
  handleSendOTP: () => Promise<void>;
  handleVerifyOTP: (e: React.FormEvent) => Promise<boolean>;
  validateField: (field: keyof OTPData) => void;
  clearErrors: () => void;
  resetOTP: () => void;
}

const initialOTPData: OTPData = {
  phone_number: '',
  otp: '',
};

export const useOTP = (): UseOTPReturn => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const { success, error: errorToast } = useToast();
  
  const [otpData, setOtpData] = useState<OTPData>(initialOTPData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = useCallback((field: keyof OTPData, value: string) => {
    setOtpData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  // Memoize regex patterns to avoid recreation
  const phoneRegex = useMemo(() => /^[\+]?[1-9][\d]{0,15}$/, []);
  const otpRegex = useMemo(() => /^\d{6}$/, []);

  const validateField = useCallback((field: keyof OTPData) => {
    const value = otpData[field];
    
    if (field === 'phone_number') {
      if (!value) {
        setErrors(prev => ({ ...prev, [field]: 'Phone number is required' }));
      } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        setErrors(prev => ({ ...prev, [field]: 'Please enter a valid phone number' }));
      } else {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    } else if (field === 'otp') {
      if (!value) {
        setErrors(prev => ({ ...prev, [field]: 'OTP is required' }));
      } else if (value.length !== 6) {
        setErrors(prev => ({ ...prev, [field]: 'OTP must be 6 digits' }));
      } else if (!otpRegex.test(value)) {
        setErrors(prev => ({ ...prev, [field]: 'OTP must contain only numbers' }));
      } else {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  }, [otpData, phoneRegex, otpRegex]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSendOTP = useCallback(async () => {
    // Validate phone number first
    validateField('phone_number');
    
    // Check for errors after validation
    const currentErrors = errors;
    if (currentErrors.phone_number) {
      errorToast('Please fix the phone number error');
      return;
    }

    try {
      const result = await dispatch(sendOtp(otpData.phone_number));

      if (sendOtp.fulfilled.match(result)) {
        success('OTP sent successfully! Check your phone for the verification code.');
        setOtpSent(true);
      } else if (sendOtp.rejected.match(result)) {
        const errorMessage = result.payload as string || 'Failed to send OTP';
        errorToast(errorMessage);
      }
    } catch (err) {
      errorToast('An unexpected error occurred. Please try again.');
    }
  }, [dispatch, otpData.phone_number, errors, errorToast, success, validateField]);

  const handleVerifyOTP = useCallback(async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    
    validateField('otp');
    
    // Check for errors after validation
    const currentErrors = errors;
    if (currentErrors.otp) {
      errorToast('Please fix the OTP error');
      return false;
    }

    try {
      const result = await dispatch(verifyOtp({
        otp: otpData.otp,
        phone_number: otpData.phone_number,
      }));

      if (verifyOtp.fulfilled.match(result)) {
        success(`Welcome back, ${result.payload.user.user_name}!`);
        // Reset form
        setOtpData(initialOTPData);
        setErrors({});
        setOtpSent(false);
        return true; // OTP verification successful
      } else if (verifyOtp.rejected.match(result)) {
        const errorMessage = result.payload as string || 'OTP verification failed';
        errorToast(errorMessage);
        return false; // OTP verification failed
      }
      return false; // Default to failed
    } catch (err) {
      errorToast('An unexpected error occurred. Please try again.');
      return false; // OTP verification failed
    }
  }, [dispatch, otpData, errors, errorToast, success, validateField]);

  const resetOTP = useCallback(() => {
    setOtpData(initialOTPData);
    setErrors({});
    setOtpSent(false);
  }, []);

  return {
    otpData,
    errors,
    loading,
    otpSent,
    handleInputChange,
    handleSendOTP,
    handleVerifyOTP,
    validateField,
    clearErrors,
    resetOTP,
  };
};
