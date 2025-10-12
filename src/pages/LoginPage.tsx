import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, MessageSquare } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';
import { useGuestCartSync } from '../hooks/auth/useGuestCartSync';
import SEOHead from '../components/common/SEOHead';
import { LoginForm } from '../components/auth/LoginForm';
import { OTPForm } from '../components/auth/OTPForm';

type AuthTab = 'email' | 'otp';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { syncGuestCart, hasGuestItems, guestItemCount } = useGuestCartSync();

  const [activeTab, setActiveTab] = useState<AuthTab>('email');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Handle successful login
  const handleLoginSuccess = async () => {
    // Sync guest cart if there are items
    if (hasGuestItems) {
      await syncGuestCart();
    }

    // Navigate to redirect path or home
    const redirectTo = location.state?.from?.pathname || '/';
    navigate(redirectTo, { replace: true });
  };

  // Handle tab change with animation
  const handleTabChange = (tab: AuthTab) => {
    if (tab === activeTab) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <>
      <SEOHead 
        title="Login"
        description="Sign in to your account to access your orders, wishlist, and personalized shopping experience"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-md">
          {/* Guest Cart Badge */}
          {hasGuestItems && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-fade-in">
              <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                🛒 You have <strong>{guestItemCount}</strong> {guestItemCount === 1 ? 'item' : 'items'} in your cart
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 text-center mt-1">
                Login to save your cart and checkout
              </p>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👋</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-blue-100">
                Sign in to continue shopping
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  data-tab="email"
                  onClick={() => handleTabChange('email')}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-all duration-300
                    ${
                      activeTab === 'email'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </button>

                <button
                  data-tab="otp"
                  onClick={() => handleTabChange('otp')}
                  className={`
                    flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-all duration-300
                    ${
                      activeTab === 'otp'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Phone OTP</span>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8">
              <div
                className={`
                  transition-opacity duration-300
                  ${isTransitioning ? 'opacity-0' : 'opacity-100'}
                `}
              >
                {activeTab === 'email' ? (
                  <LoginForm onSuccess={handleLoginSuccess} />
                ) : (
                  <OTPForm onSuccess={handleLoginSuccess} />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-900 px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
                >
                  Sign up now
                </button>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
