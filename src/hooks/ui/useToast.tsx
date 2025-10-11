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
  const createCustomToast = (variant: typeof TOAST_VARIANTS.warning | typeof TOAST_VARIANTS.info, message: string, options?: CustomToastOptions) => 
    toast(message, { ...variant, ...options, style: { ...variant.style, ...options?.style } });

  return {
    toast: (message: string, options?: CustomToastOptions) => toast(message, options),
    success: (message: string, options?: CustomToastOptions) => toast.success(message, options),
    error: (message: string, options?: CustomToastOptions) => toast.error(message, options),
    loading: (message: string, options?: CustomToastOptions) => toast.loading(message, options),
    warning: (message: string, options?: CustomToastOptions) => createCustomToast(TOAST_VARIANTS.warning, message, options),
    info: (message: string, options?: CustomToastOptions) => createCustomToast(TOAST_VARIANTS.info, message, options),
    dismiss: (toastId?: string) => toast.dismiss(toastId),
    dismissAll: () => toast.dismiss(),
    promise: <T,>(promise: Promise<T>, messages: { loading: string; success: string | ((data: T) => string); error: string | ((error: Error) => string); }, options?: CustomToastOptions) => toast.promise(promise, messages, options),
    colors: TOAST_COLORS,
  };
};
