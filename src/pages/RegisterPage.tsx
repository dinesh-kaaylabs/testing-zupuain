import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles } from 'lucide-react';
import { RegistrationForm } from '../components/auth/RegistrationForm';
import SEOHead from '../components/common/SEOHead';
import { useAppSelector } from '../hooks/redux';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Handle registration success with countdown
  useEffect(() => {
    if (registrationSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [registrationSuccess, navigate]);

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
  };

  if (registrationSuccess) {
    return (
      <>
        <SEOHead 
          title="Registration Successful - LuxeHome" 
          description="Welcome to LuxeHome! Your account has been created successfully." 
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center animate-slide-up">
              {/* Success Icon */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-75" />
                <div className="relative bg-green-100 dark:bg-green-900/50 rounded-full p-4">
                  <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center justify-center gap-2">
                <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
                Welcome Aboard!
                <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Your account has been created successfully!
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  You've been automatically logged in.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Redirecting to home page in...
                </p>
                <div className="mt-4 text-6xl font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                  {countdown}
                </div>
              </div>

              {/* Manual Redirect Button */}
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              >
                Go to Home Now
              </button>

              {/* Welcome Tips */}
              <div className="mt-6 text-left space-y-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Get Started:
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✓ Browse our premium collection</li>
                  <li>✓ Add items to your wishlist</li>
                  <li>✓ Enjoy exclusive member benefits</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Register - Create Your Account" 
        description="Create your LuxeHome account to access exclusive products, track orders, and enjoy a personalized shopping experience." 
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join LuxeHome and start your premium shopping experience
            </p>
          </div>

          {/* Registration Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <RegistrationForm onSuccess={handleRegistrationSuccess} />
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our{' '}
              <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </a>{' '}
              and consent to receive updates and promotional emails.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
