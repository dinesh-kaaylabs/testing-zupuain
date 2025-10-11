import { useModal } from '../utils/useModal';

interface UseTermsModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  message: string;
  setMessage: (message: string) => void;
}

export const useTermsModal = (): UseTermsModalReturn => useModal();
