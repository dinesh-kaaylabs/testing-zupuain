import { useModal } from '../utils/useModal';

export const useInvalidTokenModal = () => 
  useModal('Your session has expired. Please login again to continue.');
