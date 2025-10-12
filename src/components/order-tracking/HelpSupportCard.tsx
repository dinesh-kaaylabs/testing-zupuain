import { MessageCircle, Phone, Mail, HelpCircle, FileText, RotateCcw } from 'lucide-react';

const HelpSupportCard = () => {
  const supportOptions = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      href: '/contact',
      color: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Call Us',
      description: '1-800-LUXEHOME',
      action: 'Call Now',
      href: 'tel:1-800-LUXEHOME',
      color: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email Support',
      description: 'support@luxehome.com',
      action: 'Send Email',
      href: 'mailto:support@luxehome.com',
      color: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  const quickLinks = [
    {
      icon: <HelpCircle className="h-4 w-4" />,
      label: 'Order Issues',
      href: '/help/order-issues',
    },
    {
      icon: <RotateCcw className="h-4 w-4" />,
      label: 'Returns & Refunds',
      href: '/help/returns',
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: 'Refund Policy',
      href: '/help/refund-policy',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Need Help?
      </h2>

      {/* Support Options */}
      <div className="space-y-3 mb-6">
        {supportOptions.map((option, index) => (
          <a
            key={index}
            href={option.href}
            className={`
              block p-4 rounded-lg border-2 transition-all
              bg-gradient-to-r ${option.color} ${option.borderColor}
              hover:shadow-md hover:scale-[1.02]
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`${option.textColor}`}>
                {option.icon}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${option.textColor}`}>
                  {option.label}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
              <span className={`text-xs font-medium ${option.textColor}`}>
                {option.action} →
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Links */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Quick Links
        </p>
        <div className="space-y-2">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              {link.icon}
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Support Hours */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Support Hours
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Monday - Friday: 9:00 AM - 6:00 PM
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Saturday: 10:00 AM - 4:00 PM
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Sunday: Closed
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportCard;

