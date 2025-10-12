import { memo } from 'react';
import { ShoppingBag, DollarSign, MapPin, Heart, ArrowRight, Package, AlertCircle } from 'lucide-react';
import { useDashboard } from '../../hooks/account/useDashboard';
import { formatCurrency, ORDER_STATUS_COLORS } from '../../utils';
import { OrderListItem } from '../../types/api';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

const StatCard = memo(({ title, value, icon, color, onClick }: StatCardProps) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={`
      p-6 rounded-xl border-2 transition-all duration-300
      ${onClick ? 'hover:scale-105 hover:shadow-lg cursor-pointer' : 'cursor-default'}
      ${color} border-opacity-20 hover:border-opacity-40
    `}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        {icon}
      </div>
    </div>
  </button>
));

StatCard.displayName = 'StatCard';

interface QuickActionProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuickActionCard = memo(({ title, icon, onClick }: QuickActionProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
      {icon}
    </div>
    <span className="font-medium text-gray-900 dark:text-gray-100">{title}</span>
    <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
  </button>
));

QuickActionCard.displayName = 'QuickActionCard';

const OrderCard = memo(({ order, onClick }: { order: OrderListItem; onClick: () => void }) => {
  const statusColor = ORDER_STATUS_COLORS[order.milestone_code.toLowerCase()] || ORDER_STATUS_COLORS.default;
  
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-md text-left"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">Order #{order.order_serial_number}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{order.product_name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {order.milestone_code}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {new Date(order.creation_date).toLocaleDateString()}
        </span>
        <span className="font-bold text-gray-900 dark:text-gray-100">
          {formatCurrency(order.total_price)}
        </span>
      </div>
    </button>
  );
});

OrderCard.displayName = 'OrderCard';

interface DashboardOverviewProps {
  onNavigate: (section: string) => void;
}

const DashboardOverview = ({ onNavigate }: DashboardOverviewProps) => {
  const { stats, recentOrders, pendingOrdersCount, loading, hasDefaultAddress } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Orders Banner */}
      {pendingOrdersCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                You have {pendingOrdersCount} pending order{pendingOrdersCount > 1 ? 's' : ''}
              </p>
              <button
                onClick={() => onNavigate('orders')}
                className="text-sm text-amber-700 dark:text-amber-300 hover:underline"
              >
                View orders →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          color="bg-blue-50 dark:bg-blue-900/20 border-blue-500"
          onClick={() => onNavigate('orders')}
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          icon={<DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />}
          color="bg-green-50 dark:bg-green-900/20 border-green-500"
        />
        <StatCard
          title="Saved Addresses"
          value={stats.savedAddresses}
          icon={<MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
          color="bg-purple-50 dark:bg-purple-900/20 border-purple-500"
          onClick={() => onNavigate('addresses')}
        />
        <StatCard
          title="Wishlist Items"
          value={stats.wishlistItems}
          icon={<Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />}
          color="bg-pink-50 dark:bg-pink-900/20 border-pink-500"
          onClick={() => onNavigate('wishlist')}
        />
      </div>

      {/* Profile Completion Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Profile Completion</h3>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">85%</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-[85%] transition-all duration-500" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {hasDefaultAddress ? 'Almost there!' : 'Add a default address to complete your profile'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Orders</h3>
            <button
              onClick={() => onNavigate('orders')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <OrderCard
                  key={order.order_uid}
                  order={order}
                  onClick={() => window.location.href = `/orders/${order.order_uid}`}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <QuickActionCard
              title="Track Order"
              icon={<Package className="h-5 w-5" />}
              onClick={() => onNavigate('orders')}
            />
            <QuickActionCard
              title="Add Address"
              icon={<MapPin className="h-5 w-5" />}
              onClick={() => onNavigate('addresses')}
            />
            <QuickActionCard
              title="View Wishlist"
              icon={<Heart className="h-5 w-5" />}
              onClick={() => onNavigate('wishlist')}
            />
            <QuickActionCard
              title="Get Support"
              icon={<AlertCircle className="h-5 w-5" />}
              onClick={() => onNavigate('support')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

