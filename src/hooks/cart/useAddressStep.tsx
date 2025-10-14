import { useState } from 'react';
import { Address } from '../../types/api';

export const useAddressStep = (refreshAddresses: () => void) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const openForm = (address: Address | null = null) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const onSuccess = () => {
    closeForm();
    refreshAddresses();
  };

  return {
    showForm,
    editingAddress,
    handleAddNew: () => openForm(),
    handleEdit: openForm,
    handleFormClose: closeForm,
    handleFormSuccess: onSuccess,
  };
};

