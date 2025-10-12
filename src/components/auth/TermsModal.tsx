import { X, FileText, Shield, Scale, Info } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Terms & Conditions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            {/* Last Updated */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Last Updated:</strong> October 12, 2025
              </p>
            </div>

            {/* Introduction */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  1. Introduction
                </h3>
              </div>
              <p className="text-sm leading-relaxed">
                Welcome to LuxeHome. By accessing and using our services, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully before using our platform.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  2. Account Registration
                </h3>
              </div>
              <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
                <li>You must provide accurate and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One account per user is permitted</li>
                <li>You agree to notify us immediately of any unauthorized account access</li>
              </ul>
            </section>

            {/* User Obligations */}
            <section>
              <div className="flex items-center space-x-2 mb-3">
                <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  3. User Obligations
                </h3>
              </div>
              <p className="text-sm leading-relaxed mb-2">You agree not to:</p>
              <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Engage in any activity that disrupts or interferes with our services</li>
              </ul>
            </section>

            {/* Privacy & Data */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                4. Privacy & Data Protection
              </h3>
              <p className="text-sm leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our services, you consent to our data practices as described in our Privacy Policy.
              </p>
            </section>

            {/* Product Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                5. Product Information & Pricing
              </h3>
              <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
                <li>We strive to provide accurate product descriptions and pricing</li>
                <li>Prices are subject to change without notice</li>
                <li>We reserve the right to limit quantities</li>
                <li>Product availability is not guaranteed</li>
                <li>Colors may vary slightly from images due to display settings</li>
              </ul>
            </section>

            {/* Orders & Payments */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                6. Orders & Payments
              </h3>
              <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
                <li>All orders are subject to acceptance and availability</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Payment must be received before order processing</li>
                <li>We accept major credit cards, debit cards, and digital payment methods</li>
                <li>All transactions are processed securely</li>
              </ul>
            </section>

            {/* Shipping & Delivery */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                7. Shipping & Delivery
              </h3>
              <p className="text-sm leading-relaxed">
                Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers, weather, or other circumstances beyond our control. Risk of loss passes to you upon delivery.
              </p>
            </section>

            {/* Returns & Refunds */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                8. Returns & Refunds
              </h3>
              <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
                <li>Returns must be initiated within 30 days of delivery</li>
                <li>Items must be unused and in original packaging</li>
                <li>Certain items may be non-returnable</li>
                <li>Refunds will be processed within 7-10 business days</li>
                <li>Return shipping costs may apply</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                9. Intellectual Property
              </h3>
              <p className="text-sm leading-relaxed">
                All content on our platform, including text, graphics, logos, images, and software, is the property of LuxeHome or its licensors and is protected by copyright and trademark laws. Unauthorized use is strictly prohibited.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                10. Limitation of Liability
              </h3>
              <p className="text-sm leading-relaxed">
                To the maximum extent permitted by law, LuxeHome shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount you paid for the relevant product or service.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                11. Modifications to Terms
              </h3>
              <p className="text-sm leading-relaxed">
                We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                12. Governing Law
              </h3>
              <p className="text-sm leading-relaxed">
                These Terms & Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which LuxeHome operates, without regard to its conflict of law provisions.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                13. Contact Us
              </h3>
              <p className="text-sm leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li><strong>Email:</strong> legal@luxehome.com</li>
                <li><strong>Phone:</strong> 1-800-LUXEHOME</li>
                <li><strong>Address:</strong> 123 Luxury Lane, Premium City, PC 12345</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

