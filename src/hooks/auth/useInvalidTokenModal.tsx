import { useModal } from '../utils/useModal';

interface UseInvalidTokenModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  message: string;
  setMessage: (message: string) => void;
}

export const useInvalidTokenModal = (): UseInvalidTokenModalReturn => 
  useModal('Your session has expired. Please login again to continue.');
