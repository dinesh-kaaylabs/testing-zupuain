import React from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';
import { TOAST_CONFIG } from '../../config/toastConfig';

interface ToastProviderProps {
  config?: Partial<ToasterProps>;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ config }) => (
  <Toaster {...TOAST_CONFIG} {...config} />
);

export default ToastProvider;
