import { User, MapPin, Phone, CreditCard } from 'lucide-react';

interface DeliverySection {
  id: string;
  label: string;
  value: string | string[];
  icon: string;
  bgColor: string;
  iconColor: string;
  isClickable?: boolean;
  href?: string;
}

interface DeliveryDetailsCardProps {
  sections: DeliverySection[];
}

const getIcon = (iconName: string, iconColor: string) => {
  const iconMap: Record<string, JSX.Element> = {
    'user': <User className={`h-5 w-5 ${iconColor}`} />,
    'map-pin': <MapPin className={`h-5 w-5 ${iconColor}`} />,
    'phone': <Phone className={`h-5 w-5 ${iconColor}`} />,
    'credit-card': <CreditCard className={`h-5 w-5 ${iconColor}`} />,
  };
  return iconMap[iconName] || <User className={`h-5 w-5 ${iconColor}`} />;
};

const DeliveryDetailsCard = ({ sections }: DeliveryDetailsCardProps) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  const renderValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((line, index) => (
            <p key={index} className="text-gray-900 dark:text-gray-100">
              {line}
            </p>
          ))}
        </div>
      );
    }
    return <p className="text-gray-900 dark:text-gray-100">{value}</p>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Delivery Details
      </h2>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${section.bgColor} dark:bg-opacity-10 transition-all ${
              section.isClickable ? 'hover:shadow-md cursor-pointer' : ''
            }`}
            onClick={() => {
              if (section.isClickable && section.href) {
                window.location.href = section.href;
              }
            }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`flex-shrink-0 p-2 rounded-lg ${section.bgColor}`}>
                {getIcon(section.icon, section.iconColor)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                  {section.label}
                </p>
                <div className="text-sm font-medium">
                  {renderValue(section.value)}
                </div>
                {section.isClickable && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Click to call
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
          Need to update delivery details?{' '}
          <a
            href="/contact"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default DeliveryDetailsCard;

