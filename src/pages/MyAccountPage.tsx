import { useState, lazy, Suspense } from 'react';
import { Menu } from 'lucide-react';
import AccountSidebar from '../components/account/AccountSidebar';
import SEOHead from '../components/common/SEOHead';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load sections for better performance
const DashboardOverview = lazy(() => import('../components/account/DashboardOverview'));
const ProfileSection = lazy(() => import('../components/account/ProfileSection'));
const OrderHistory = lazy(() => import('../components/account/OrderHistory'));
const AddressBook = lazy(() => import('../components/account/AddressBook'));
const WishlistOverview = lazy(() => import('../components/account/WishlistOverview'));
const AccountSettings = lazy(() => import('../components/account/AccountSettings'));
const SupportCenter = lazy(() => import('../components/account/SupportCenter'));

type SectionId = 'dashboard' | 'profile' | 'orders' | 'addresses' | 'wishlist' | 'settings' | 'support';

const SECTION_TITLES: Record<SectionId, string> = {
  dashboard: 'Dashboard',
  profile: 'Profile',
  orders: 'Order History',
  addresses: 'Addresses',
  wishlist: 'Wishlist',
  settings: 'Settings',
  support: 'Support Center',
};

const MyAccountPage = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionChange = (section: SectionId) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview onNavigate={handleSectionChange} />;
      case 'profile':
        return <ProfileSection />;
      case 'orders':
        return <OrderHistory />;
      case 'addresses':
        return <AddressBook />;
      case 'wishlist':
        return <WishlistOverview />;
      case 'settings':
        return <AccountSettings />;
      case 'support':
        return <SupportCenter />;
      default:
        return <DashboardOverview onNavigate={handleSectionChange} />;
    }
  };

  return (
    <>
      <SEOHead
        title={`My Account - ${SECTION_TITLES[activeSection]}`}
        description="Manage your account, orders, addresses, and preferences"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto flex">
          {/* Sidebar */}
          <AccountSidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isMobileMenuOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 min-h-screen">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {SECTION_TITLES[activeSection]}
                </h1>
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 md:p-8">
              <div className="hidden lg:block mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {SECTION_TITLES[activeSection]}
                </h1>
              </div>

              <Suspense fallback={<LoadingSpinner />}>
                {renderSection()}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default MyAccountPage;
