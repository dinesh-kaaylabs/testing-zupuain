import { useCallback, useMemo } from 'react';
import toast, { ToastOptions } from 'react-hot-toast';
import { TOAST_VARIANTS, TOAST_COLORS } from '../../config/toastConfig';

interface CustomToastOptions extends Omit<ToastOptions, 'style'> {
  style?: React.CSSProperties;
}

interface UseToastReturn {
  toast: (message: string, options?: CustomToastOptions) => string;
  success: (message: string, options?: CustomToastOptions) => string;
  error: (message: string, options?: CustomToastOptions) => string;
  loading: (message: string, options?: CustomToastOptions) => string;
  warning: (message: string, options?: CustomToastOptions) => string;
  info: (message: string, options?: CustomToastOptions) => string;
  dismiss: (toastId?: string) => void;
  dismissAll: () => void;
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: CustomToastOptions
  ) => Promise<T>;
  colors: typeof TOAST_COLORS;
}

export const useToast = (): UseToastReturn => {
  const createCustomToast = useCallback((variant: typeof TOAST_VARIANTS.warning | typeof TOAST_VARIANTS.info, message: string, options?: CustomToastOptions) => 
    toast(message, { ...variant, ...options, style: { ...variant.style, ...options?.style } }), []);

  const showToast = useCallback((message: string, options?: CustomToastOptions) => toast(message, options), []);
  const showSuccess = useCallback((message: string, options?: CustomToastOptions) => toast.success(message, options), []);
  const showError = useCallback((message: string, options?: CustomToastOptions) => toast.error(message, options), []);
  const showLoading = useCallback((message: string, options?: CustomToastOptions) => toast.loading(message, options), []);
  const showWarning = useCallback((message: string, options?: CustomToastOptions) => createCustomToast(TOAST_VARIANTS.warning, message, options), [createCustomToast]);
  const showInfo = useCallback((message: string, options?: CustomToastOptions) => createCustomToast(TOAST_VARIANTS.info, message, options), [createCustomToast]);
  const dismiss = useCallback((toastId?: string) => toast.dismiss(toastId), []);
  const dismissAll = useCallback(() => toast.dismiss(), []);
  const promiseToast = useCallback(<T,>(promise: Promise<T>, messages: { loading: string; success: string | ((data: T) => string); error: string | ((error: Error) => string); }, options?: CustomToastOptions) => toast.promise(promise, messages, options), []);

  return useMemo(() => ({
    toast: showToast,
    success: showSuccess,
    error: showError,
    loading: showLoading,
    warning: showWarning,
    info: showInfo,
    dismiss,
    dismissAll,
    promise: promiseToast,
    colors: TOAST_COLORS,
  }), [showToast, showSuccess, showError, showLoading, showWarning, showInfo, dismiss, dismissAll, promiseToast]);
};
