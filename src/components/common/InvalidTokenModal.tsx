import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux/useAppDispatch';
import { logout } from '../../store/slices/authSlice';

interface InvalidTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const InvalidTokenModal: React.FC<InvalidTokenModalProps> = ({ 
  isOpen, 
  onClose,
  message = "Your session has expired. Please login again to continue."
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleRedirectToLogin = () => {
    dispatch(logout());
    onClose();
    navigate('/login', { replace: true });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleRedirectToLogin();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="invalid-token-title"
      aria-describedby="invalid-token-description"
    >
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all animate-scaleIn">
        {/* Icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-6 text-center">
          <h3 
            id="invalid-token-title"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Session Expired
          </h3>
          <p 
            id="invalid-token-description"
            className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
          >
            {message}
          </p>

          {/* Action Button */}
          <button
            onClick={handleRedirectToLogin}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            autoFocus
          >
            Go to Login
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-t-2xl"></div>
      </div>
    </div>
  );
};

export default InvalidTokenModal;
