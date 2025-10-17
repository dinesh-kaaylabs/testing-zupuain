import React from 'react';
import { useNewsletterSignup } from '../../hooks/home/useNewsletterSignup';

const NewsletterSignup: React.FC = () => {
  const {
    email,
    emailError,
    touched,
    loading,
    success,
    error,
    handleEmailChange,
    handleBlur,
    handleSubmit,
  } = useNewsletterSignup();

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 animate-fade-in relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Newsletter
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-2">
            Subscribe now and get <span className="font-bold text-yellow-300">10% off</span> your first order!
          </p>
          <p className="text-blue-100 mb-8">
            Get exclusive deals, new product launches, and design inspiration delivered to your inbox.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email address"
                  disabled={loading || success}
                  className={`w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    emailError && touched
                      ? 'ring-2 ring-red-400 focus:ring-red-500'
                      : 'focus:ring-white'
                  } ${
                    success ? 'bg-green-100' : 'bg-white'
                  } disabled:opacity-60`}
                  aria-label="Email address"
                  aria-invalid={!!emailError && touched}
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
                {emailError && touched && (
                  <p id="email-error" className="mt-2 text-sm text-red-200 text-left">
                    {emailError}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || success || !!emailError}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
                  success
                    ? 'bg-green-500 text-white cursor-default'
                    : loading
                    ? 'bg-white/50 text-blue-900 cursor-wait'
                    : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg transform hover:scale-105'
                } disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subscribing...
                  </span>
                ) : success ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Subscribed!
                  </span>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-400 rounded-lg text-red-100 text-left">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-400 rounded-lg text-green-100 animate-fade-in">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Successfully subscribed! Check your email for your exclusive discount code.</span>
                </div>
              </div>
            )}
          </form>

          {/* Privacy Note */}
          <p className="mt-6 text-sm text-blue-200">
            We respect your privacy. Unsubscribe at any time.
          </p>

          {/* Benefits */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 mb-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <h3 className="font-semibold mb-1">Exclusive Offers</h3>
              <p className="text-sm text-blue-100">Special deals for subscribers only</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 mb-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="font-semibold mb-1">Early Access</h3>
              <p className="text-sm text-blue-100">Be first to see new arrivals</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-10 h-10 mb-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="font-semibold mb-1">Design Tips</h3>
              <p className="text-sm text-blue-100">Expert advice & inspiration</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;

