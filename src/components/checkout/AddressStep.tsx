import { useState, useCallback } from 'react';
import { Home, Plus, MapPin, Edit2, Check } from 'lucide-react';
import { Address } from '../../types/api';
import { AddressForm } from './AddressForm';

interface AddressStepProps {
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  addressLoading: boolean;
  addressError: string | null;
  refreshAddresses: () => void;
}

export const AddressStep = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
  addressLoading,
  addressError,
  refreshAddresses,
}: AddressStepProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddNew = useCallback(() => {
    setEditingAddress(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setEditingAddress(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setEditingAddress(null);
    refreshAddresses();
  }, [refreshAddresses]);

  if (showForm) {
    return (
      <AddressForm
        address={editingAddress}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Home className="w-6 h-6 mr-2 text-blue-600" />
            Delivery Address
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Select or add a delivery address
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add New Address</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Error Message */}
      {addressError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{addressError}</p>
        </div>
      )}

      {/* Loading State */}
      {addressLoading && addresses.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No addresses found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add your first delivery address to continue
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Address</span>
          </button>
        </div>
      ) : (
        /* Address Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <button
              key={address.b2c_address_id}
              onClick={() => setSelectedAddress(address)}
              className={`
                relative p-4 text-left rounded-lg border-2 transition-all duration-300
                ${
                  selectedAddress?.b2c_address_id === address.b2c_address_id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800'
                }
              `}
            >
              {/* Selected Checkmark */}
              {selectedAddress?.b2c_address_id === address.b2c_address_id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Address Tag */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {address.address_tag || 'Other'}
                </span>
                {address.is_default && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    Default
                  </span>
                )}
              </div>

              {/* Address Details */}
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium line-clamp-2 mb-2">
                {address.complete_address || address.address}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {address.city}, {address.state} - {address.pincode}
              </p>

              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(address);
                }}
                className="absolute bottom-3 right-3 p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                aria-label="Edit address"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </button>
          ))}
        </div>
      )}

      {/* Info Banner */}
      {addresses.length > 0 && !selectedAddress && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Please select a delivery address to proceed
          </p>
        </div>
      )}
    </div>
  );
};

