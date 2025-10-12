import { DollarSign, Tag, Truck, CreditCard, FileText, Sparkles } from 'lucide-react';

interface SummaryLineItem {
  label: string;
  value: string;
  icon: string;
  className: string;
  isPositive?: boolean;
}

interface OrderSummaryCardProps {
  lineItems: SummaryLineItem[];
  totalFormatted: string;
  hasDiscount: boolean;
  savingsFormatted?: string;
}

const getIcon = (iconName: string) => {
  const iconMap: Record<string, JSX.Element> = {
    'dollar-sign': <DollarSign className="h-4 w-4" />,
    'tag': <Tag className="h-4 w-4" />,
    'truck': <Truck className="h-4 w-4" />,
    'credit-card': <CreditCard className="h-4 w-4" />,
    'file-text': <FileText className="h-4 w-4" />,
  };
  return iconMap[iconName] || <DollarSign className="h-4 w-4" />;
};

const OrderSummaryCard = ({
  lineItems,
  totalFormatted,
  hasDiscount,
  savingsFormatted,
}: OrderSummaryCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Order Summary
      </h2>

      {/* Line Items */}
      <div className="space-y-3 mb-4">
        {lineItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span className={`${item.className} dark:opacity-80`}>
                {getIcon(item.icon)}
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
            <span
              className={`font-semibold ${
                item.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : item.className
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalFormatted}
          </span>
        </div>

        {/* Savings Banner */}
        {hasDiscount && savingsFormatted && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  You Saved
                </span>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {savingsFormatted}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Payment Status */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span>Payment Confirmed</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;

