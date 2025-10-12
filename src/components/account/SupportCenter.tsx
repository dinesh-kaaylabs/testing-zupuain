import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'How do I track my order?',
    answer: 'You can track your order from the Orders section. Click on any order to view its current status and delivery timeline.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Items must be unused and in original packaging. Contact support to initiate a return.',
  },
  {
    question: 'How do I change my delivery address?',
    answer: 'Go to the Addresses section and add or edit your addresses. You can set a default address for faster checkout.',
  },
  {
    question: 'How do I cancel an order?',
    answer: 'Orders can be cancelled from the order tracking page if they are in "Pending" or "Confirmed" status. Once shipped, orders cannot be cancelled.',
  },
];

const SupportCenter = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="mailto:support@luxehome.com"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-lg"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Email Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">support@luxehome.com</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Response within 24 hours</p>
        </a>

        <a
          href="tel:1-800-LUXEHOME"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-all hover:shadow-lg"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Phone Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">1-800-LUXEHOME</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Mon-Fri, 9 AM - 6 PM</p>
        </a>

        <button
          onClick={() => window.location.href = '/contact'}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all hover:shadow-lg text-left"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Live Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chat with us now</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</p>
        </button>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-left">{item.question}</span>
                {expandedFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;

