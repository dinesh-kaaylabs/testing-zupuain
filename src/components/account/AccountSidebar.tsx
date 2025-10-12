import { User, Package, MapPin, Heart, Settings as SettingsIcon, HelpCircle, X } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';

type SectionId = 'dashboard' | 'profile' | 'orders' | 'addresses' | 'wishlist' | 'settings' | 'support';

interface AccountSidebarProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  isMobileMenuOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS: Array<{
  id: SectionId;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: <User className="h-5 w-5" /> },
  { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  { id: 'orders', label: 'Orders', icon: <Package className="h-5 w-5" /> },
  { id: 'addresses', label: 'Addresses', icon: <MapPin className="h-5 w-5" /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  { id: 'support', label: 'Support', icon: <HelpCircle className="h-5 w-5" /> },
];

const AccountSidebar = ({ activeSection, onSectionChange, isMobileMenuOpen, onClose }: AccountSidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.user_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
              {user?.user_name || 'User'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {user?.email_address || 'user@example.com'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Member since {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onSectionChange(item.id);
              onClose();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200
              ${
                activeSection === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 transform transition-transform duration-300 ease-in-out
          lg:transform-none
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>

        {sidebarContent}
      </aside>
    </>
  );
};

export default AccountSidebar;

