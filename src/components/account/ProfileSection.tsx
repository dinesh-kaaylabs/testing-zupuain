import { useState } from 'react';
import { Edit2, Save, X, Upload, Loader2 } from 'lucide-react';
import { useAccountProfile } from '../../hooks/account/useAccountProfile';

const ProfileSection = () => {
  const {
    profileData,
    errors,
    loading,
    hasChanges,
    isEditing,
    profileImage,
    isUploading,
    updateField,
    saveProfile,
    startEditing,
    cancelEditing,
    handleImageUpload,
  } = useAccountProfile();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      await handleImageUpload(file);
    }
  };

  const handleSave = async () => {
    const success = await saveProfile();
    if (success) {
      setImagePreview(null);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile Information</h2>
          {!isEditing ? (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          ) : null}
        </div>

        {/* Profile Image */}
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {imagePreview || profileImage ? (
                <img src={imagePreview || profileImage || ''} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profileData.user_name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Upload className="h-4 w-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">Profile Picture</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Max 5MB (JPG, PNG)</p>
            {isUploading && (
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2 mt-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading...
              </p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.user_name}
              onChange={(e) => updateField('user_name', e.target.value)}
              disabled={!isEditing || loading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                errors.user_name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.user_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.user_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email_address}
              onChange={(e) => updateField('email_address', e.target.value)}
              disabled={!isEditing || loading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                errors.email_address ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.email_address && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email_address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone_number}
              onChange={(e) => updateField('phone_number', e.target.value)}
              disabled={true}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-100 opacity-50 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Phone number cannot be changed</p>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={!hasChanges || loading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition-colors ${
                !hasChanges || loading
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={cancelEditing}
              disabled={loading}
              className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;

