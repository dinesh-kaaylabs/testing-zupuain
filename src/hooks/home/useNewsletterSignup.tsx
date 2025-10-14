import { useState, useEffect, useCallback } from 'react';
import { useAppSelector } from '../redux/useAppSelector';
import { useAppDispatch } from '../redux/useAppDispatch';
import { subscribeNewsletter, clearNewsletterState } from '../../store/slices/newsletterSlice';
import { validateEmail } from '../../utils/formValidation';

export const useNewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [touched, setTouched] = useState(false);
  
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.newsletter);

  useEffect(() => {
    if (success) {
      setEmail('');
      setTouched(false);
      setEmailError(undefined);
      const timer = setTimeout(() => dispatch(clearNewsletterState()), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) setEmailError(validateEmail(value));
  }, [touched]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    setEmailError(validateEmail(email));
  }, [email]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const error = validateEmail(email);
    setEmailError(error);
    if (!error) dispatch(subscribeNewsletter({ email }));
  }, [email, dispatch]);

  return {
    email,
    emailError,
    touched,
    loading,
    success,
    error,
    handleEmailChange,
    handleBlur,
    handleSubmit,
  };
};

