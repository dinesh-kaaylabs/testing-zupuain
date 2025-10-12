import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useLogin } from '../../hooks/auth/useLogin';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const {
    credentials,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    validateField,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
            value={credentials.email_address}
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
            value={credentials.password}
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
            placeholder="Enter your password"
            autoComplete="current-password"
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
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={credentials.rememberMe || false}
            onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
            disabled={loading}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
            Remember me
          </span>
        </label>

        <a
          href="/forgot-password"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
        >
          Forgot password?
        </a>
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
            <span>Signing in...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </button>

      {/* Alternative Login Option */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Having trouble logging in?{' '}
          <button
            type="button"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
            onClick={() => {
              // Switch to OTP tab - this would be handled by parent
              const otpTabButton = document.querySelector('[data-tab="otp"]') as HTMLButtonElement;
              otpTabButton?.click();
            }}
          >
            Try OTP Login
          </button>
        </p>
      </div>
    </form>
  );
};

