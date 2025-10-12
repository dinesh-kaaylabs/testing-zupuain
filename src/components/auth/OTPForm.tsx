import { useState, useEffect, useCallback } from 'react';
import { Phone, Hash, Loader2, Send, CheckCircle } from 'lucide-react';
import { useOTP } from '../../hooks/auth/useOTP';

interface OTPFormProps {
  onSuccess: () => void;
}

export const OTPForm = ({ onSuccess }: OTPFormProps) => {
  const {
    otpData,
    errors,
    loading,
    otpSent,
    handleInputChange,
    handleSendOTP,
    handleVerifyOTP,
    validateField,
    resetOTP,
  } = useOTP();

  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && otpSent) {
      setCanResend(true);
    }
  }, [countdown, otpSent]);

  const handleSendOTPClick = useCallback(async () => {
    await handleSendOTP();
    if (!errors.phone_number) {
      setCountdown(60); // 60 seconds countdown
      setCanResend(false);
    }
  }, [handleSendOTP, errors.phone_number]);

  const handleResendOTP = useCallback(async () => {
    if (canResend) {
      await handleSendOTP();
      setCountdown(60);
      setCanResend(false);
    }
  }, [canResend, handleSendOTP]);

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleVerifyOTP(e);
    if (success) {
      onSuccess();
    }
  };

  const handleChangeNumber = () => {
    resetOTP();
    setCountdown(0);
    setCanResend(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
            value={otpData.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value.replace(/\D/g, ''))}
            onBlur={() => validateField('phone_number')}
            disabled={loading || otpSent}
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
            placeholder="Enter your phone number"
            autoComplete="tel"
            maxLength={10}
          />
          {otpSent && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>
        {errors.phone_number && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in">
            {errors.phone_number}
          </p>
        )}
        {otpSent && (
          <button
            type="button"
            onClick={handleChangeNumber}
            disabled={loading}
            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors disabled:opacity-50"
          >
            Change number?
          </button>
        )}
      </div>

      {/* Send OTP Button */}
      {!otpSent && (
        <button
          type="button"
          onClick={handleSendOTPClick}
          disabled={loading || !otpData.phone_number}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold text-white
            transition-all duration-300 flex items-center justify-center space-x-2
            ${
              loading || !otpData.phone_number
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg hover:scale-[1.02]'
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending OTP...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send OTP</span>
            </>
          )}
        </button>
      )}

      {/* OTP Field (shown after OTP is sent) */}
      {otpSent && (
        <>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Enter OTP
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                value={otpData.otp}
                onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, ''))}
                onBlur={() => validateField('otp')}
                disabled={loading}
                className={`
                  block w-full pl-10 pr-3 py-3 border rounded-lg
                  text-center text-2xl font-mono tracking-widest
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  dark:bg-gray-700 dark:text-gray-100
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                  ${
                    errors.otp
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }
                `}
                placeholder="● ● ● ● ● ●"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
              />
            </div>
            {errors.otp && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-fade-in">
                {errors.otp}
              </p>
            )}
          </div>

          {/* Countdown Timer & Resend */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resend OTP in{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {countdown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading || !canResend}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* Verify OTP Button */}
          <button
            type="submit"
            disabled={loading || otpData.otp.length !== 6}
            className={`
              w-full py-3 px-4 rounded-lg font-semibold text-white
              transition-all duration-300 flex items-center justify-center space-x-2
              ${
                loading || otpData.otp.length !== 6
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg hover:scale-[1.02]'
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Verify & Sign In</span>
              </>
            )}
          </button>
        </>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          {otpSent ? (
            <>
              📱 OTP sent to <strong>+91 {otpData.phone_number}</strong>
              <br />
              Please check your phone for the 6-digit verification code.
            </>
          ) : (
            <>
              📱 You'll receive a 6-digit OTP on your phone
              <br />
              Make sure to enter the correct phone number.
            </>
          )}
        </p>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Prefer email?{' '}
          <button
            type="button"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
            onClick={() => {
              // Switch to email tab - handled by parent
              const emailTabButton = document.querySelector('[data-tab="email"]') as HTMLButtonElement;
              emailTabButton?.click();
            }}
          >
            Use Email Login
          </button>
        </p>
      </div>
    </form>
  );
};

