import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => (
  <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
    <Loader2 className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'} animate-spin text-purple-600 dark:text-purple-400`} />
    {text && <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium">{text}</p>}
  </div>
);

export default LoadingSpinner;
