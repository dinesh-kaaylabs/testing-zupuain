import { useState, useCallback } from 'react';

export const useModal = (defaultMessage?: string) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage || '');

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, openModal, closeModal, toggleModal, message, setMessage };
};
