import toast, { ToastOptions } from 'react-hot-toast';
import { TOAST_VARIANTS, TOAST_COLORS } from '../../config/toastConfig';

interface CustomToastOptions extends Omit<ToastOptions, 'style'> {
  style?: React.CSSProperties;
}

export const useToast = () => {
  const createCustomToast = (variant: any, message: string, options?: CustomToastOptions) => 
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
    promise: <T,>(promise: Promise<T>, messages: { loading: string; success: string | ((data: T) => string); error: string | ((error: any) => string); }, options?: CustomToastOptions) => toast.promise(promise, messages, options),
    colors: TOAST_COLORS,
  };
};
