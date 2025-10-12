import { Plus, MapPin, Edit2, Trash2, Check } from 'lucide-react';
import { useAddressBook } from '../../hooks/account/useAddressBook';
import { ADDRESS_TAG_COLORS } from '../../utils/constants';

const AddressBook = () => {
  const { addresses, loading, hasAddresses, openForm, handleDelete, handleSetDefault } = useAddressBook();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Addresses</h2>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Address
        </button>
      </div>

      {hasAddresses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.b2c_address_uid}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ADDRESS_TAG_COLORS[address.address_tag.toLowerCase()] || ADDRESS_TAG_COLORS.default}`}>
                    {address.address_tag}
                  </span>
                  {address.is_default && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openForm(address)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.b2c_address_uid)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>{address.complete_address || address.address}</p>
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p>{address.country}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {address.phone_number}</p>
              </div>
              {!address.is_default && (
                <button
                  onClick={() => handleSetDefault(address.b2c_address_uid)}
                  className="mt-4 w-full py-2 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Addresses Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Add your delivery address</p>
          <button
            onClick={() => openForm()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            Add Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressBook;

