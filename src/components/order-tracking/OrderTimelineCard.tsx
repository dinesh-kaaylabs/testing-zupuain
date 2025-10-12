import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { OrderTimelineItem } from '../../types/api';

interface OrderTimelineCardProps {
  timeline: OrderTimelineItem[];
}

const OrderTimelineCard = ({ timeline }: OrderTimelineCardProps) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  };

  const getStatusColor = (index: number, total: number) => {
    if (index === total - 1) {
      // Current/latest status
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-500 dark:border-blue-400',
        text: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-500',
        line: 'bg-blue-500',
      };
    }
    // Completed statuses
    return {
      bg: 'bg-green-100 dark:bg-green-900/30',
      border: 'border-green-500 dark:border-green-400',
      text: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-500',
      line: 'bg-green-500',
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
        Order Timeline
      </h2>

      <div className="relative">
        {timeline.map((item, index) => {
          const colors = getStatusColor(index, timeline.length);
          const { date, time } = formatDate(item.creation_date);
          const isLast = index === timeline.length - 1;
          const isFirst = index === 0;

          return (
            <div key={item.order_timeline_id} className="relative">
              {/* Timeline Line */}
              {!isFirst && (
                <div 
                  className={`absolute left-5 -top-4 w-0.5 h-8 ${colors.line}`}
                  style={{ transform: 'translateX(-50%)' }}
                />
              )}

              {/* Timeline Item */}
              <div className={`flex gap-4 ${!isLast ? 'pb-8' : ''}`}>
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center border-4 border-white dark:border-gray-800`}>
                    {isLast ? (
                      <Clock className="h-5 w-5 text-white" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    )}
                  </div>
                  {isLast && (
                    <div className="absolute -inset-1 rounded-full animate-ping opacity-75 bg-blue-400" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 ${colors.bg} rounded-lg p-4 border-2 ${colors.border}`}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${colors.text} mb-1`}>
                        {item.zm_milestone?.milestone_code || 'Status Update'}
                      </h3>
                      {item.zm_milestone?.milestone_description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {item.zm_milestone.milestone_description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {time}
                        </span>
                        <span>•</span>
                        <span>{date}</span>
                      </div>
                    </div>
                    {isLast && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {timeline.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Circle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No timeline updates available yet</p>
        </div>
      )}
    </div>
  );
};

export default OrderTimelineCard;

