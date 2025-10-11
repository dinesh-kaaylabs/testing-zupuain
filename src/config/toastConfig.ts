import { ToastOptions, ToasterProps } from 'react-hot-toast';

// Base styles shared across all toast variants
const baseStyle = {
  borderRadius: '12px',
  padding: '16px',
  fontSize: '14px',
  fontWeight: '500',
  color: 'white',
};

// Toast variant configurations with minimal repetition
const createToastVariant = (bg: string, shadow: string, duration = 4000): ToastOptions => ({
  duration,
  style: { ...baseStyle, background: bg, boxShadow: shadow },
  iconTheme: { primary: 'white', secondary: bg },
});

export const TOAST_CONFIG: ToasterProps = {
  position: 'top-right',
  reverseOrder: false,
  gutter: 8,
  toastOptions: {
    duration: 4000,
    style: {
      ...baseStyle,
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
    },
    success: createToastVariant('var(--color-success)', '0 8px 25px rgba(16, 185, 129, 0.3)'),
    error: createToastVariant('var(--color-error)', '0 8px 25px rgba(239, 68, 68, 0.3)', 5000),
    loading: {
      duration: Infinity,
      style: { ...baseStyle, background: 'var(--color-primary)', boxShadow: '0 8px 25px rgba(127, 90, 240, 0.3)' },
    },
  },
};

// Export custom toast variants for use with toast.custom()
export const TOAST_VARIANTS = {
  warning: createToastVariant('var(--color-warning)', '0 8px 25px rgba(245, 158, 11, 0.3)'),
  info: createToastVariant('var(--color-primary)', '0 8px 25px rgba(127, 90, 240, 0.3)'),
};

// Export toast colors for custom usage
export const TOAST_COLORS = {
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  warning: 'var(--color-warning)',
  info: 'var(--color-primary)',
  loading: 'var(--color-primary)',
};
