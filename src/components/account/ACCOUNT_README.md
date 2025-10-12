# My Account Page Documentation

## 📋 Overview

The My Account Page provides a comprehensive user dashboard with 7 main sections for managing profile, orders, addresses, wishlist, settings, and support. The implementation follows Single Responsibility Principle (SRP) with lazy-loaded sections, mobile-responsive design, and optimized performance.

---

## 🏗️ Architecture

### Component Structure

```
MyAccountPage.tsx (Main Container with Section Routing)
├── SEOHead (Dynamic meta tags)
├── AccountSidebar (Mobile Overlay + Desktop Sidebar)
│   ├── Profile Header (Avatar, Name, Email, Date)
│   └── Navigation Menu (7 sections)
└── Content Area (Lazy Loaded Sections)
    ├── DashboardOverview
    │   ├── Stats Cards (4) → Orders, Spent, Addresses, Wishlist
    │   ├── Pending Orders Banner
    │   ├── Profile Completion Progress (85%)
    │   ├── Recent Orders (5 cards)
    │   └── Quick Actions (4 buttons)
    ├── ProfileSection
    │   ├── Image Upload (5MB max)
    │   ├── Form Fields (name, email, phone)
    │   └── Edit/Save/Cancel Actions
    ├── OrderHistory
    │   ├── Filters (Search, Status, Sort)
    │   ├── Order Cards Grid
    │   └── Pagination (10/page)
    ├── AddressBook
    │   ├── Address Cards Grid (2 col)
    │   ├── Add/Edit/Delete/Set Default
    │   └── Address Form Modal
    ├── WishlistOverview (DIRECT REDUX)
    │   ├── Product Cards Grid (3-4 col)
    │   ├── Move to Cart / Remove
    │   └── Empty State
    ├── AccountSettings
    │   ├── 4 Tabs (Notifications, Privacy, Security, Preferences)
    │   ├── Toggle Switches
    │   ├── 2FA Modal
    │   └── Save/Reset Actions
    └── SupportCenter
        ├── Contact Cards (Email, Phone, Chat)
        ├── FAQ Accordion
        └── Help Articles
```

### File Organization

```
src/
├── pages/
│   └── MyAccountPage.tsx          # Main page with routing (113 lines)
├── components/account/
│   ├── AccountSidebar.tsx         # Sidebar + mobile overlay (109 lines)
│   ├── DashboardOverview.tsx      # Dashboard with stats (148 lines)
│   ├── ProfileSection.tsx         # Profile edit (127 lines)
│   ├── OrderHistory.tsx           # Order list + filters (108 lines)
│   ├── AddressBook.tsx            # Address management (110 lines)
│   ├── WishlistOverview.tsx       # Wishlist with Redux (106 lines)
│   ├── AccountSettings.tsx        # Settings tabs (146 lines)
│   ├── SupportCenter.tsx          # Support + FAQ (110 lines)
│   └── ACCOUNT_README.md          # This documentation
├── hooks/account/
│   ├── useDashboard.tsx           # Dashboard data hook
│   ├── useAccountProfile.tsx      # Profile management hook
│   ├── useOrderHistory.tsx        # Order history hook
│   ├── useAddressBook.tsx         # Address CRUD hook
│   └── useAccountSettings.tsx     # Settings management hook
└── utils/
    └── constants.tsx              # ORDER_STATUS_COLORS, ADDRESS_TAG_COLORS
```

---

## 🎯 Components

### 1. MyAccountPage.tsx

**Purpose**: Main container with section routing and lazy loading.

**Key Features**:
- ✅ Section-based routing without URL changes
- ✅ Lazy loading for better performance
- ✅ Mobile hamburger menu
- ✅ Responsive layout (sidebar + content)
- ✅ SEO optimization per section
- ✅ Suspense with Loading Spinner

**Section Management**:
```typescript
type SectionId = 'dashboard' | 'profile' | 'orders' | 'addresses' | 'wishlist' | 'settings' | 'support';

const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

**Lazy Loading**:
```typescript
const DashboardOverview = lazy(() => import('../components/account/DashboardOverview'));
// ... other sections

<Suspense fallback={<LoadingSpinner />}>
  {renderSection()}
</Suspense>
```

---

### 2. AccountSidebar.tsx

**Purpose**: Navigation sidebar with profile header and mobile overlay.

**Props**:
```typescript
interface AccountSidebarProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  isMobileMenuOpen: boolean;
  onClose: () => void;
}
```

**Features**:
- ✅ Gradient avatar with user initial
- ✅ Profile info (name, email, member date)
- ✅ 7 menu items with icons
- ✅ Active state (bg-blue-50, border-l-4)
- ✅ Mobile overlay (bg-black/50)
- ✅ Smooth transitions
- ✅ Fixed on mobile, static on desktop

**Menu Icons**:
- Dashboard: User
- Profile: User
- Orders: Package
- Addresses: MapPin
- Wishlist: Heart
- Settings: Settings
- Support: HelpCircle

---

### 3. DashboardOverview.tsx

**Purpose**: Overview dashboard with stats, recent orders, and quick actions.

**Props**:
```typescript
interface DashboardOverviewProps {
  onNavigate: (section: string) => void;
}
```

**Hook Used**:
```typescript
const { stats, recentOrders, pendingOrdersCount, loading, hasDefaultAddress } = useDashboard();

// CRITICAL: stats.wishlistItems is a NUMBER (count), not an array!
stats: {
  totalOrders: number;
  totalSpent: number;
  savedAddresses: number;
  wishlistItems: number; // ← NUMBER, not array!
}
```

**Features**:
- ✅ 4 clickable stat cards (Orders, Spent, Addresses, Wishlist)
- ✅ Pending orders banner (amber, dismissible)
- ✅ Profile completion progress bar (85%)
- ✅ Recent 5 orders with status badges
- ✅ 4 quick action buttons
- ✅ Empty states with CTAs

**Sub-Components** (React.memo):
- `StatCard` - Stat display with icon
- `OrderCard` - Order preview card
- `QuickActionCard` - Action button with icon

---

### 4. ProfileSection.tsx

**Purpose**: Profile information display and editing.

**Hook Used**:
```typescript
const {
  profileData,        // { user_name, email_address, phone_number }
  errors,
  loading,
  hasChanges,
  isEditing,
  profileImage,
  isUploading,
  updateField,
  saveProfile,
  startEditing,
  cancelEditing,
  handleImageUpload,
} = useAccountProfile();
```

**Features**:
- ✅ Display/Edit mode toggle
- ✅ Profile image upload (5MB max, preview)
- ✅ 3 form fields (name editable, email editable, phone readonly)
- ✅ Real-time validation
- ✅ hasChanges detection
- ✅ Save/Cancel buttons
- ✅ Toast notifications
- ✅ Loading states

**Validation**: Uses `validateUserName`, `validateEmail`, `validatePhoneNumber` from utils.

---

### 5. OrderHistory.tsx

**Purpose**: Order history with filters and search.

**Hook Used**:
```typescript
const {
  filteredOrders,
  loading,
  filters,
  updateFilters,
  hasOrders,
} = useOrderHistory();
```

**Features**:
- ✅ Search input (debounced 300ms)
- ✅ Status filter dropdown
- ✅ Sort options
- ✅ Order cards grid
- ✅ Click to navigate to order tracking
- ✅ Status badges with ORDER_STATUS_COLORS
- ✅ Pagination (10 per page)
- ✅ Loading skeletons (10)
- ✅ Empty state with CTA

---

### 6. AddressBook.tsx

**Purpose**: Address management with CRUD operations.

**Hook Used**:
```typescript
const {
  addresses,
  loading,
  hasAddresses,
  openForm,
  handleDelete,
  handleSetDefault,
} = useAddressBook();
```

**Features**:
- ✅ 2-column grid (1 on mobile)
- ✅ Address cards with tags (Home, Office, Other)
- ✅ Default badge with checkmark
- ✅ Edit/Delete buttons
- ✅ "Set as Default" button
- ✅ Add address button
- ✅ Delete protection (last address, default address)
- ✅ Confirm dialog for delete
- ✅ Address form modal (separate component)

**Address Card Display**:
- Tag with ADDRESS_TAG_COLORS
- Complete address
- City, State, Pincode
- Country
- Phone number

**Form Validation**:
- Pincode: 5-6 digits
- Phone: 10 digits
- All fields required except landmark

---

### 7. WishlistOverview.tsx

**Purpose**: Wishlist display with DIRECT REDUX integration.

**CRITICAL - Direct Redux Usage**:
```typescript
// NO useWishlist() hook - use Redux directly!
const dispatch = useAppDispatch();
const wishlistItems = useAppSelector((state) => state.wishlist.wishlistItems); // ← ARRAY
const loading = useAppSelector((state) => state.wishlist.loading);

useEffect(() => {
  dispatch(getUserWishlist());
}, [dispatch]);

const handleRemove = (productUid: string) => {
  dispatch(removeFromWishlist(productUid));
};

const handleMoveToCart = (productUid: string) => {
  dispatch(moveToCart(productUid));
};
```

**Features**:
- ✅ 3-4 column grid (1 on mobile)
- ✅ Product cards with lazy-loaded images
- ✅ Discount percentage badge
- ✅ Price display (selling + MRP strikethrough)
- ✅ Move to Cart button
- ✅ Remove button (trash icon)
- ✅ Hover scale effect (scale-105)
- ✅ Empty state with heart icon
- ✅ Loading skeletons (8)

---

### 8. AccountSettings.tsx

**Purpose**: Settings management with 4 tabs.

**Hook Used**:
```typescript
const {
  settings,
  loading,
  hasChanges,
  updateSetting,
  saveSettings,
  resetSettings,
} = useAccountSettings();
```

**Tabs**:
1. **Notifications**
   - Email Notifications (toggle)
   - Order Updates (toggle)
   - Promotional Emails (toggle)

2. **Privacy**
   - Profile Visibility (public/private)
   - Allow Data Collection (toggle)

3. **Security**
   - Two-Factor Authentication (2FA modal)
   - Login Alerts (toggle)
   - Change Password

4. **Preferences** (localStorage)
   - Theme (light/dark/system)
   - Language (dropdown)
   - Items per page

**Features**:
- ✅ Nested state updates
- ✅ hasChanges detection
- ✅ Save/Reset buttons
- ✅ localStorage for preferences
- ✅ Toast notifications

---

### 9. SupportCenter.tsx

**Purpose**: Customer support with FAQ and contact options.

**Features**:
- ✅ 3 contact cards (Email, Phone, Live Chat)
- ✅ Clickable links (mailto:, tel:)
- ✅ FAQ accordion (expand/collapse)
- ✅ Color-coded cards (blue, green, purple)
- ✅ Support hours display

**FAQ Items** (expandable):
- How do I track my order?
- What is your return policy?
- How do I change my delivery address?
- How do I cancel an order?

---

## 🎣 Hooks

### 1. useDashboard()

**Location**: `src/hooks/account/useDashboard.tsx`

**Purpose**: Fetch dashboard data and stats.

**Return Type**:
```typescript
interface UseDashboardReturn {
  stats: DashboardStats;           // CRITICAL: wishlistItems is NUMBER
  recentOrders: OrderListItem[];   // First 5 orders
  pendingOrdersCount: number;
  loading: boolean;
  hasDefaultAddress: boolean;
  fetchDashboardData: () => void;
}

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  savedAddresses: number;
  wishlistItems: number;  // ← NUMBER, not array!
}
```

**Key Features**:
- ✅ Fetches orders, addresses, wishlist count
- ✅ Auto-fetch on mount
- ✅ Calculates total spent
- ✅ Filters pending orders

---

### 2. useAccountProfile()

**Location**: `src/hooks/account/useAccountProfile.tsx`

**Purpose**: Manage profile data and image upload.

**Return Type**:
```typescript
interface UseAccountProfileReturn {
  profileData: ProfileFormData;
  errors: Partial<Record<keyof ProfileFormData, string>>;
  loading: boolean;
  hasChanges: boolean;
  isEditing: boolean;
  profileImage: string | null;
  isUploading: boolean;
  updateField: (field: keyof ProfileFormData, value: string) => void;
  saveProfile: () => Promise<boolean>;
  resetForm: () => void;
  startEditing: () => void;
  cancelEditing: () => void;
  handleImageUpload: (file: File) => Promise<void>;
}
```

**Validation**: Uses `validateUserName`, `validateEmail`, `validatePhoneNumber`.

**Image Upload**: Max 5MB, preview with URL.createObjectURL.

---

### 3. useOrderHistory()

**Location**: `src/hooks/account/useOrderHistory.tsx`

**Purpose**: Manage order history with filters.

**Return Type**:
```typescript
interface UseOrderHistoryReturn {
  orders: OrderListItem[];
  filteredOrders: OrderListItem[];
  filters: OrderFilters;
  currentPage: number;
  totalPages: number;
  sortBy: 'date' | 'amount' | 'status';
  sortOrder: 'asc' | 'desc';
  fetchOrders: (page?: number) => Promise<void>;
  updateFilters: (newFilters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
  changePage: (page: number) => void;
  handleViewDetails: (order: OrderListItem) => void;
  handleReorder: (order: OrderListItem) => void;
  hasOrders: boolean;
  orderStatistics: OrderStatistics;
}
```

**Filters**:
- Status filter
- Date range filter
- Search term (debounced 300ms)
- Sort by (date, amount)

---

### 4. useAddressBook()

**Location**: `src/hooks/account/useAddressBook.tsx`

**Purpose**: Address CRUD operations.

**Return Type**:
```typescript
interface UseAddressBookReturn {
  addresses: Address[];
  formData: AddressFormData;
  errors: Partial<Record<keyof AddressFormData, string>>;
  isEditing: boolean;
  loading: boolean;
  showForm: boolean;
  openForm: (address?: Address) => void;
  closeForm: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDelete: (addressId: string) => Promise<void>;
  handleSetDefault: (addressId: string) => Promise<void>;
  hasAddresses: boolean;
}
```

**Validation**:
- Pincode: 5-6 digits
- All fields required except landmark
- Prevents deleting last/default address

---

### 5. useAccountSettings()

**Location**: `src/hooks/account/useAccountSettings.tsx`

**Purpose**: Manage user settings with localStorage for preferences.

**Return Type**:
```typescript
interface UseAccountSettingsReturn {
  settings: AccountSettingsData;
  loading: boolean;
  hasChanges: boolean;
  updateSetting: <T>(category: T, key: string, value: any) => void;
  saveSettings: () => Promise<boolean>;
  resetSettings: () => void;
  toggleTwoFactor: () => Promise<boolean>;
  changePassword: (current: string, new: string) => Promise<boolean>;
}
```

**Settings Structure**:
```typescript
{
  notifications: { emailNotifications, orderUpdates, promotionalEmails },
  privacy: { profileVisibility, allowDataCollection },
  security: { twoFactorEnabled, loginAlerts },
  preferences: { language, theme, itemsPerPage }, // ← localStorage
}
```

---

## ✅ Implementation Constraints

### Critical Requirements

1. **Section Routing**:
   ```typescript
   type SectionId = 'dashboard' | 'profile' | 'orders' | 'addresses' | 'wishlist' | 'settings' | 'support';
   const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
   ```

2. **Lazy Loading**:
   ```typescript
   const DashboardOverview = lazy(() => import('...'));
   <Suspense fallback={<LoadingSpinner />}>
     {renderSection()}
   </Suspense>
   ```

3. **Mobile Menu**:
   ```typescript
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   // Overlay closes on click, menu slides in/out
   ```

4. **Dashboard Stats vs Wishlist Section**:
   ```typescript
   // Dashboard: stats.wishlistItems = NUMBER (count)
   const { stats } = useDashboard();
   console.log(typeof stats.wishlistItems); // 'number'

   // Wishlist Section: wishlistItems = ARRAY (from Redux)
   const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);
   console.log(Array.isArray(wishlistItems)); // true
   ```

5. **Wishlist DIRECT REDUX** (NO useWishlist hook):
   ```typescript
   const dispatch = useAppDispatch();
   const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);
   dispatch(getUserWishlist());
   dispatch(removeFromWishlist(uid));
   dispatch(moveToCart(uid));
   ```

---

## 🎨 Design System

### Layout

**Desktop (lg+)**:
```
┌────────────────────────────────────────────┐
│ Sidebar (w-80) │ Main Content (flex-1)     │
│                │                            │
│ Profile Header │ Section Header            │
│ Menu Items     │ Section Content           │
│                │                            │
└────────────────────────────────────────────┘
```

**Mobile**:
```
┌────────────────┐
│ Hamburger Menu │ ← Opens overlay sidebar
├────────────────┤
│ Section Header │
│ Section Content│
│                │
└────────────────┘
```

### Colors

**Status Colors** (ORDER_STATUS_COLORS):
- Delivered: Green (bg-green-100 text-green-800)
- Shipped: Blue (bg-blue-100 text-blue-800)
- Processing/Confirmed: Purple (bg-purple-100 text-purple-800)
- Pending: Amber (bg-amber-100 text-amber-800)
- Cancelled: Red (bg-red-100 text-red-800)

**Address Tag Colors**:
- Home: Green (bg-green-100 text-green-800)
- Office/Work: Blue (bg-blue-100 text-blue-800)
- Other: Gray (bg-gray-100 text-gray-800)

### Animations

```css
/* Fade in */
.animate-fade-in { animation: fade-in 0.3s ease-out; }

/* Slide up */
.animate-slide-up { animation: slide-up 0.4s ease-out; }

/* Scale on hover */
.hover:scale-105 { transform: scale(1.05); }

/* Pulse for loading */
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
```

---

## 🔄 User Flow

### Dashboard Flow

```
1. User logs in → Redirected to My Account
   ↓
2. Dashboard loads (default section)
   ↓
3. useDashboard() fetches:
   - Orders (for stats + recent)
   - Addresses (for count + default check)
   - Wishlist (for count only)
   ↓
4. Display:
   - 4 stat cards (clickable → navigate to section)
   - Pending orders banner (if any)
   - Profile completion progress
   - Recent 5 orders
   - 4 quick action buttons
```

### Profile Edit Flow

```
1. Click "Profile" in sidebar
   ↓
2. ProfileSection loads → Display mode
   ↓
3. Click "Edit Profile" → Edit mode
   ↓
4. User edits fields → hasChanges = true
   ↓
5. Click "Save Changes"
   ↓
6. Validation → saveProfile()
   ↓
7. Success toast → Edit mode off
```

### Wishlist Flow

```
1. Click "Wishlist" in sidebar
   ↓
2. WishlistOverview loads
   ↓
3. useEffect → dispatch(getUserWishlist())
   ↓
4. Display grid of products
   ↓
5. User actions:
   - Click "Move to Cart" → dispatch(moveToCart(uid))
   - Click trash icon → dispatch(removeFromWishlist(uid))
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Navigation**:
- [ ] All 7 sections load correctly
- [ ] Mobile hamburger menu works
- [ ] Sidebar overlay closes on backdrop click
- [ ] Active section highlights correctly
- [ ] Section transitions are smooth

**Dashboard**:
- [ ] Stats display correct counts
- [ ] Stats cards are clickable
- [ ] Recent orders display (max 5)
- [ ] Pending banner shows when applicable
- [ ] Progress bar shows 85%
- [ ] Quick actions navigate correctly

**Profile**:
- [ ] Display mode shows current data
- [ ] Edit button enables edit mode
- [ ] Image upload works (5MB limit)
- [ ] Validation shows errors
- [ ] hasChanges detection works
- [ ] Save updates profile
- [ ] Cancel reverts changes

**Orders**:
- [ ] Search filters orders
- [ ] Status filter works
- [ ] Order cards display correctly
- [ ] Click navigates to tracking page
- [ ] Status badges show correct colors
- [ ] Empty state displays when no orders

**Addresses**:
- [ ] Grid displays addresses (2 col → 1 mobile)
- [ ] Add address opens form
- [ ] Edit address populates form
- [ ] Delete shows confirmation
- [ ] Cannot delete last/default address
- [ ] Set default updates correctly

**Wishlist (CRITICAL)**:
- [ ] Items load from Redux (wishlistItems array)
- [ ] Product cards display (3-4 col)
- [ ] Discount badges show
- [ ] MRP strikethrough displays
- [ ] Move to Cart works
- [ ] Remove updates Redux state
- [ ] Empty state shows heart icon

**Settings**:
- [ ] All 4 tabs display
- [ ] Toggles update state
- [ ] hasChanges detection works
- [ ] Save persists changes
- [ ] Reset reverts to original
- [ ] Preferences save to localStorage

**Support**:
- [ ] Contact cards are clickable
- [ ] Email/Phone links work
- [ ] FAQ accordion expands/collapses
- [ ] All FAQ items display

---

## 📊 Performance Optimizations

1. **Lazy Loading**: All sections lazy-loaded with Suspense
2. **React.memo**: StatCard, OrderCard, QuickActionCard memoized
3. **useMemo**: Filtered orders, stats calculations
4. **useCallback**: Event handlers stable references
5. **Debounce**: Search input debounced 300ms
6. **Image Lazy Loading**: `loading="lazy"` on product images
7. **Conditional Rendering**: Skeletons during loading

---

## 🐛 Common Issues & Solutions

### Issue 1: "wishlistItems is not an array"

**Cause**: Using wrong property name from Redux state.

**Solution**:
```typescript
// ❌ Wrong
const wishlistItems = useAppSelector(state => state.wishlist.items);

// ✅ Correct
const wishlistItems = useAppSelector(state => state.wishlist.wishlistItems);
```

### Issue 2: "Dashboard shows wrong wishlist count"

**Cause**: Trying to use wishlistItems.length on undefined.

**Solution**:
```typescript
// useDashboard returns COUNT, not array
const { stats } = useDashboard();
console.log(stats.wishlistItems); // number, not array!
```

### Issue 3: "Mobile menu doesn't close"

**Cause**: Missing onClose callback.

**Solution**: Ensure `onSectionChange` calls `setIsMobileMenuOpen(false)`.

---

## 📚 Related Documentation

- [Dashboard Hook](../../hooks/account/useDashboard.tsx)
- [Profile Hook](../../hooks/account/useAccountProfile.tsx)
- [Order History Hook](../../hooks/account/useOrderHistory.tsx)
- [Address Book Hook](../../hooks/account/useAddressBook.tsx)
- [Settings Hook](../../hooks/account/useAccountSettings.tsx)
- [Wishlist Redux Slice](../../store/slices/wishlistSlice.tsx)

---

## 🤝 Contributing

When modifying account components:

1. **Follow SRP**: Each component has one responsibility
2. **Maintain Hook Rules**: Hooks are READ-ONLY
3. **Test Mobile**: Verify mobile overlay and responsive design
4. **Update Tests**: Add test cases for new features
5. **Check Dark Mode**: Verify all changes work in both themes
6. **Document Changes**: Update this README

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0  
**Author**: LuxeHome Development Team

