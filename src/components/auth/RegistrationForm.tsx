import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRegistration } from '../../hooks/auth/useRegistration';
import { useTermsModal } from '../../hooks/auth/useTermsModal';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { TermsModal } from './TermsModal';

interface RegistrationFormProps {
  onSuccess: () => void;
}

export const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    validateField,
  } = useRegistration();

  const { isOpen: isTermsModalOpen, openModal: openTermsModal, closeModal: closeTermsModal } = useTermsModal();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      onSuccess();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Full Name Field */}
        <div>
          <label
            htmlFor="user_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="user_name"
              type="text"
              value={formData.user_name}
              onChange={(e) => handleInputChange('user_name', e.target.value)}
              onBlur={() => validateField('user_name')}
              disabled={loading}
              className={`
                block w-full pl-10 pr-3 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-gray-700 dark:text-gray-100
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                ${
                  errors.user_name
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }
              `}
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>
          {errors.user_name && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in">
              {errors.user_name}
            </p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              onBlur={() => validateField('phone_number')}
              disabled={loading}
              className={`
                block w-full pl-10 pr-3 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-gray-700 dark:text-gray-100
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                ${
                  errors.phone_number
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }
              `}
              placeholder="Enter 10-digit phone number"
              autoComplete="tel"
              maxLength={10}
            />
          </div>
          {errors.phone_number && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in">
              {errors.phone_number}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email_address"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email_address"
              type="email"
              value={formData.email_address}
              onChange={(e) => handleInputChange('email_address', e.target.value)}
              onBlur={() => validateField('email_address')}
              disabled={loading}
              className={`
                block w-full pl-10 pr-3 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-gray-700 dark:text-gray-100
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                ${
                  errors.email_address
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }
              `}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          {errors.email_address && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in">
              {errors.email_address}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => validateField('password')}
              disabled={loading}
              className={`
                block w-full pl-10 pr-12 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-gray-700 dark:text-gray-100
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                ${
                  errors.password
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }
              `}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in">
              {errors.password}
            </p>
          )}
          
          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={formData.password} />
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirm_password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirm_password}
              onChange={(e) => handleInputChange('confirm_password', e.target.value)}
              onBlur={() => validateField('confirm_password')}
              disabled={loading}
              className={`
                block w-full pl-10 pr-12 py-3 border rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:bg-gray-700 dark:text-gray-100
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                ${
                  errors.confirm_password
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }
              `}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in">
              {errors.confirm_password}
            </p>
          )}
        </div>

        {/* Terms & Conditions Checkbox */}
        <div>
          <label className="flex items-start cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
              disabled={loading}
              className={`
                mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 
                disabled:opacity-50 cursor-pointer
                ${errors.termsAccepted ? 'border-red-500' : ''}
              `}
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <button
                type="button"
                onClick={openTermsModal}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Terms & Conditions
              </button>
            </span>
          </label>
          {errors.termsAccepted && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in">
              {errors.termsAccepted}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold text-white
            transition-all duration-300 flex items-center justify-center space-x-2
            ${
              loading
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg hover:scale-[1.02]'
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </form>

      {/* Terms Modal */}
      <TermsModal isOpen={isTermsModalOpen} onClose={closeTermsModal} />
    </>
  );
};

