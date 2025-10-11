import React, { useEffect } from 'react';
import { useInvalidTokenModal } from '../../hooks';
import InvalidTokenModal from './InvalidTokenModal';
import { invalidTokenEvent } from '../../services/apiClient';

const InvalidTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen, openModal, closeModal, message, setMessage } = useInvalidTokenModal();

  useEffect(() => {
    const handleInvalidToken = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      const errorMessage = customEvent.detail?.message || 'Your session has expired. Please login again to continue.';
      setMessage(errorMessage);
      openModal();
    };

    // Listen for invalid token events
    invalidTokenEvent.addEventListener('invalidToken', handleInvalidToken);

    return () => {
      invalidTokenEvent.removeEventListener('invalidToken', handleInvalidToken);
    };
  }, [openModal, setMessage]);

  return (
    <>
      {children}
      <InvalidTokenModal 
        isOpen={isOpen} 
        onClose={closeModal}
        message={message}
      />
    </>
  );
};

export default InvalidTokenProvider;
