# Order Tracking Page Documentation

## 📋 Overview

The Order Tracking Page provides a comprehensive real-time order tracking experience with status updates, timeline visualization, order details, delivery information, and customer actions. The implementation follows Single Responsibility Principle (SRP) with 13 focused components, each under 150 lines.

---

## 🏗️ Architecture

### Component Structure

```
OrderTrackingPage.tsx (Main Container - 175 lines)
├── SEOHead (Dynamic meta tags)
├── OrderHeader
│   ├── Breadcrumb navigation
│   ├── Order number & date
│   └── Actions (Refresh, Cancel)
├── OrderStatusCard
│   ├── Animated status indicator
│   ├── Color-coded status
│   ├── Estimated delivery
│   └── Progress bar
├── OrderTimelineCard
│   ├── Vertical timeline stepper
│   ├── Glassmorphism design
│   ├── Milestone icons
│   └── Timestamps
├── OrderItemsList
│   ├── Product cards
│   ├── Image, name, qty, prices
│   └── Navigation links
├── OrderSummaryCard (Sticky Sidebar)
│   ├── Price breakdown
│   ├── Formatted currency
│   └── Savings banner
├── DeliveryDetailsCard (Sticky Sidebar)
│   ├── Customer info
│   ├── Delivery address
│   ├── Contact details
│   └── Payment method
├── HelpSupportCard
│   ├── Live chat
│   ├── Phone support
│   ├── Email support
│   └── Quick links
└── CancelOrderModal
    ├── Reason selection
    ├── Confirmation dialog
    └── Loading state
```

### File Organization

```
src/
├── pages/
│   └── OrderTrackingPage.tsx       # Main page (175 lines)
├── components/order-tracking/
│   ├── OrderHeader.tsx             # Header with actions (95 lines)
│   ├── OrderStatusCard.tsx         # Status indicator (122 lines)
│   ├── OrderTimelineCard.tsx       # Timeline stepper (128 lines)
│   ├── OrderItemsList.tsx          # Items list (108 lines)
│   ├── OrderSummaryCard.tsx        # Price summary (96 lines)
│   ├── DeliveryDetailsCard.tsx     # Delivery info (98 lines)
│   ├── HelpSupportCard.tsx         # Support options (131 lines)
│   ├── CancelOrderModal.tsx        # Cancel dialog (248 lines - complex UI)
│   ├── OrderErrorState.tsx         # Error state (82 lines)
│   ├── OrderNotFound.tsx           # 404 state (75 lines)
│   ├── OrderTrackingSkeleton.tsx   # Loading skeleton (108 lines)
│   ├── index.tsx                   # Exports (11 lines)
│   └── ORDER_TRACKING_README.md    # This documentation
├── hooks/order/
│   ├── useOrderDetails.ts          # Main data fetch hook
│   ├── useOrderCancel.ts           # Cancel order hook
│   ├── useOrderHeader.tsx          # Header data processing
│   ├── useDeliveryDetails.tsx      # Delivery data processing
│   ├── useOrderItems.tsx           # Items data processing
│   └── useOrderSummary.tsx         # Summary data processing
└── utils/
    └── constants.tsx               # ORDER_STATUS_COLORS
```

---

## 🎯 Components

### 1. OrderTrackingPage.tsx

**Purpose**: Main container orchestrating all order tracking components and data flow.

**Key Features**:
- ✅ URL parameter extraction (`orderUid`)
- ✅ Comprehensive data fetching
- ✅ Conditional rendering (loading, error, not found, success)
- ✅ 3-column layout (2 main + 1 sidebar)
- ✅ Responsive design (collapses to 1-column mobile)
- ✅ Real-time data refresh
- ✅ Cancel order functionality
- ✅ SEO optimization

**State Management**:
```typescript
const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
```

**Data Flow**:
```typescript
// 1. Get orderUid from URL
const { orderUid } = useParams<{ orderUid: string }>();

// 2. Fetch all order data
const { orderDetails, timeline, userDetails, orderSummary, loading, error, isRefreshing, refreshOrderData } = useOrderDetails(orderUid);

// 3. Process data with utility hooks
const headerData = useOrderHeader(...);
const deliveryDetails = useDeliveryDetails(userDetails);
const orderItems = useOrderItems(orderDetails);
const summaryData = useOrderSummary(orderSummary);

// 4. Determine current status and cancellability
const currentMilestone = timeline?.[timeline.length - 1];
const currentStatus = currentMilestone?.zm_milestone?.milestone_code?.toLowerCase();
const canCancel = CANCELLABLE_STATUSES.includes(currentStatus);
```

**Usage**:
```tsx
// In router configuration
<Route path="/orders/:orderUid" element={<OrderTrackingPage />} />
```

---

### 2. OrderHeader.tsx

**Purpose**: Display order number, date, and action buttons.

**Props**:
```typescript
interface OrderHeaderProps {
  displayOrderNumber: string;
  formattedDate: string | null;
  isNew?: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onCancel?: () => void;
  canCancel: boolean;
}
```

**Features**:
- ✅ Breadcrumb navigation (back to orders)
- ✅ Order number with "NEW" badge
- ✅ Formatted creation date
- ✅ Refresh button with loading spinner
- ✅ Cancel button (conditional)
- ✅ Glassmorphism design (`backdrop-blur-sm`)

---

### 3. OrderStatusCard.tsx

**Purpose**: Display current order status with visual indicators.

**Props**:
```typescript
interface OrderStatusCardProps {
  status: string;
  statusMessage?: string;
  estimatedDelivery?: string;
  timestamp?: string;
}
```

**Status Colors**:
- 🟢 **Delivered**: Green
- 🔵 **Shipped**: Blue
- 🟣 **Processing/Confirmed**: Purple
- 🟡 **Pending**: Amber
- 🔴 **Cancelled**: Red

**Features**:
- ✅ Animated status icon
- ✅ Color-coded status badge
- ✅ Status message display
- ✅ Last updated timestamp
- ✅ Estimated delivery date (for active orders)
- ✅ Progress bar visualization

---

### 4. OrderTimelineCard.tsx

**Purpose**: Vertical timeline showing order milestone progression.

**Props**:
```typescript
interface OrderTimelineCardProps {
  timeline: OrderTimelineItem[];
}
```

**Features**:
- ✅ Vertical stepper layout
- ✅ Glassmorphism cards for each milestone
- ✅ CheckCircle2 for completed, Clock for current
- ✅ Connecting lines between milestones
- ✅ Animated "Current" badge with ping effect
- ✅ Formatted date and time
- ✅ Color-coded (green = completed, blue = current)

**Timeline Item Structure**:
```typescript
{
  order_timeline_id: number;
  creation_date: string;
  zm_milestone: {
    milestone_code: string;     // Display name
    milestone_description: string;     // Description
    milestone_code: string;            // Status code
  }
}
```

---

### 5. OrderItemsList.tsx

**Purpose**: Display ordered products with images, quantities, and prices.

**Props**:
```typescript
interface OrderItem {
  id: number;
  product_uid: string;
  name: string;
  image: string;
  quantity: number;
  unitPriceFormatted: string;
  totalPriceFormatted: string;
}

interface OrderItemsListProps {
  items: OrderItem[];
  totalItems: number;
}
```

**Features**:
- ✅ Product image with hover zoom
- ✅ Clickable product links
- ✅ Quantity and unit price display
- ✅ Total price per item
- ✅ SKU display
- ✅ Image error fallback
- ✅ External link icon on hover

---

### 6. OrderSummaryCard.tsx

**Purpose**: Sticky sidebar card showing price breakdown.

**Props**:
```typescript
interface OrderSummaryCardProps {
  lineItems: SummaryLineItem[];
  totalFormatted: string;
  hasDiscount: boolean;
  savingsFormatted?: string;
}
```

**Line Items**:
- Subtotal (with DollarSign icon)
- Discount (with Tag icon, green text)
- Delivery (with Truck icon, "FREE" if applicable)
- COD Charge (with CreditCard icon, conditional)
- GST (with FileText icon, conditional)

**Features**:
- ✅ Sticky positioning (`sticky top-6`)
- ✅ Icon-enhanced line items
- ✅ Highlighted total amount
- ✅ Savings banner (gradient green background)
- ✅ Payment confirmation indicator

---

### 7. DeliveryDetailsCard.tsx

**Purpose**: Sticky sidebar card showing delivery and customer info.

**Props**:
```typescript
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
```

**Sections**:
1. **Customer**: Name
2. **Address**: Complete address (multi-line)
3. **Contact**: Phone number (clickable `tel:` link)
4. **Payment**: Payment method

**Features**:
- ✅ Sticky positioning (`sticky top-6`)
- ✅ Color-coded section backgrounds
- ✅ Icon-enhanced display
- ✅ Clickable phone number
- ✅ Link to contact support

---

### 8. HelpSupportCard.tsx

**Purpose**: Provide support options and quick links.

**Features**:
- ✅ Live chat link
- ✅ Phone number (clickable)
- ✅ Email link
- ✅ Quick links (order issues, returns, refund policy)
- ✅ Support hours display
- ✅ Gradient background cards

**Support Options**:
```typescript
[
  { label: 'Live Chat', href: '/contact', color: 'blue' },
  { label: 'Call Us', href: 'tel:1-800-LUXEHOME', color: 'green' },
  { label: 'Email Support', href: 'mailto:support@luxehome.com', color: 'purple' },
]
```

---

### 9. CancelOrderModal.tsx

**Purpose**: Two-step cancel order process with reason selection.

**Props**:
```typescript
interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
  orderNumber: string;
  loading?: boolean;
}
```

**Cancel Reasons**:
1. Changed my mind
2. Found a better price elsewhere
3. Ordered by mistake
4. Delivery time too long
5. Need to modify order
6. Other reason (with textarea)

**Flow**:
1. **Step 1**: Select cancellation reason
   - Radio button selection
   - Textarea for "Other reason"
   - Character limit (200)
   - "Keep Order" or "Continue" buttons
   
2. **Step 2**: Confirmation screen
   - Warning icon and message
   - Order number display
   - Selected reason display
   - "Go Back" or "Yes, Cancel Order" buttons

**Features**:
- ✅ Two-screen modal flow
- ✅ Backdrop click to close
- ✅ Loading state with spinner
- ✅ Disabled state during submission
- ✅ Auto-reset on close
- ✅ Warning UI (red colors, AlertTriangle icon)

---

### 10. OrderErrorState.tsx

**Purpose**: Display error message with retry option.

**Props**:
```typescript
interface OrderErrorStateProps {
  error: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}
```

**Features**:
- ✅ Orange warning icon
- ✅ Error message display
- ✅ Retry button with loading state
- ✅ Link to all orders
- ✅ Back to home button

---

### 11. OrderNotFound.tsx

**Purpose**: 404 state for invalid order UID.

**Features**:
- ✅ Red PackageX icon with ping animation
- ✅ Helpful error message
- ✅ Suggestions list (check history, verify number, contact support)
- ✅ "View Order History" button
- ✅ "Back to Home" button

---

### 12. OrderTrackingSkeleton.tsx

**Purpose**: Loading skeleton matching the page layout.

**Features**:
- ✅ Pulsing animation
- ✅ Matches exact layout structure
- ✅ Header skeleton
- ✅ Status card skeleton
- ✅ Timeline skeleton (3 items)
- ✅ Items skeleton (2 items)
- ✅ Sidebar skeletons (summary, delivery)

---

## 🎣 Hooks

### 1. useOrderDetails(orderUid)

**Location**: `src/hooks/order/useOrderDetails.ts`

**Purpose**: Fetch all order-related data.

**Parameters**:
- `orderUid: string | undefined` - Order UID from URL params

**Return Type**:
```typescript
interface UseOrderDetailsReturn {
  orderDetails: OrderProduct[];
  timeline: OrderTimelineItem[];
  userDetails: OrderUserDetails | null;
  orderSummary: OrderSummary | null;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  refreshOrderData: () => Promise<void>;
}
```

**Key Features**:
- ✅ Parallel data fetching (`Promise.all`)
- ✅ Auto-fetch on mount
- ✅ Manual refresh function
- ✅ Separate `isRefreshing` state
- ✅ Redux integration

**Usage**:
```typescript
const { orderDetails, timeline, userDetails, orderSummary, loading, error, isRefreshing, refreshOrderData } = useOrderDetails(orderUid);
```

---

### 2. useOrderCancel()

**Location**: `src/hooks/order/useOrderCancel.ts`

**Purpose**: Handle order cancellation with API call and toast notifications.

**Return Type**:
```typescript
interface UseOrderCancelReturn {
  cancelOrder: (orderUid: string, reason?: string) => Promise<boolean>;
  loading: boolean;
}
```

**Key Features**:
- ✅ Auto toast notifications (success/error)
- ✅ Returns boolean for success handling
- ✅ Error handling with try-catch
- ✅ Loading state management

**Usage**:
```typescript
const { cancelOrder, loading } = useOrderCancel();
const success = await cancelOrder(orderUid, 'Changed my mind');
if (success) {
  // Refresh order data
}
```

---

### 3. useOrderHeader(orderId, serialNumber, creationDate)

**Location**: `src/hooks/order/useOrderHeader.tsx`

**Purpose**: Process header data (order number, date, isNew badge).

**Return Type**:
```typescript
interface OrderHeaderData {
  displayOrderNumber: string;
  formattedDate: string | null;
  hasDate: boolean;
  isNew: boolean;
}
```

**Key Features**:
- ✅ Returns `null` if orderId not provided
- ✅ `isNew` = true if order < 2 days old
- ✅ Formatted date with `formatDate()` utility
- ✅ Memoized for performance

---

### 4. useDeliveryDetails(userDetails)

**Location**: `src/hooks/order/useDeliveryDetails.tsx`

**Purpose**: Transform user details into display sections.

**Return Type**:
```typescript
interface UseDeliveryDetailsReturn {
  sections: DeliverySection[];
}
```

**Output Sections**:
1. Customer (purple gradient)
2. Address (gray background)
3. Contact (green gradient, clickable)
4. Payment (blue gradient)

---

### 5. useOrderItems(products)

**Location**: `src/hooks/order/useOrderItems.tsx`

**Purpose**: Transform product data into display format.

**Return Type**:
```typescript
interface UseOrderItemsReturn {
  items: OrderItemDisplay[];
  totalItems: number;
  hasMultipleItems: boolean;
}
```

**Key Features**:
- ✅ Formatted currency strings
- ✅ Calculated total prices
- ✅ Discount detection
- ✅ Returns `null` if no products

---

### 6. useOrderSummary(summary)

**Location**: `src/hooks/order/useOrderSummary.tsx`

**Purpose**: Process order summary into display format.

**Return Type**:
```typescript
interface UseOrderSummaryReturn {
  lineItems: OrderSummaryLineItem[];
  totalFormatted: string;
  hasDiscount: boolean;
  savingsAmount: number;
  savingsFormatted: string;
}
```

**Key Features**:
- ✅ Conditional line items (discount, COD, GST)
- ✅ Icon assignment for each line
- ✅ "FREE" label for zero delivery charge
- ✅ Returns `null` if no summary

---

## ✅ Implementation Constraints

### Critical Requirements

1. **useOrderDetails MUST receive orderUid parameter**:
   ```typescript
   const { orderUid } = useParams<{ orderUid: string }>();
   useOrderDetails(orderUid); // ✅ Correct
   useOrderDetails();         // ❌ Wrong
   ```

2. **Current milestone = last item in timeline**:
   ```typescript
   const currentMilestone = timeline[timeline.length - 1];
   const currentStatus = currentMilestone?.zm_milestone?.milestone_code?.toLowerCase();
   ```

3. **Cancellable status check uses milestone_code, NOT orderSummary.status**:
   ```typescript
   const CANCELLABLE_STATUSES = ['pending', 'confirmed'];
   const canCancel = CANCELLABLE_STATUSES.includes(currentStatus);
   ```

4. **ALL utility hooks return `object | null` - ALWAYS check for null**:
   ```typescript
   const headerData = useOrderHeader(...);
   if (!headerData) return null; // ✅ Required
   ```

---

## 🎨 Design System

### Glassmorphism

```css
backdrop-blur-sm bg-white/90 dark:bg-gray-800/90
```

Applied to:
- OrderHeader
- OrderStatusCard
- OrderTimelineCard
- OrderItemsList
- OrderSummaryCard
- DeliveryDetailsCard
- HelpSupportCard

### Status Colors

```typescript
ORDER_STATUS_COLORS = {
  delivered: 'bg-green-100 text-green-800 border-green-200',
  shipped: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  confirmed: 'bg-purple-100 text-purple-800 border-purple-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
}
```

### Layout

**Desktop (lg+)**:
```
┌─────────────────────────────────────────────┐
│ OrderHeader (full width)                     │
├─────────────────────────────────────────────┤
│ OrderStatusCard (2/3)  │ OrderSummaryCard   │
│ OrderTimelineCard (2/3)│ DeliveryDetails    │
│ OrderItemsList (2/3)   │ HelpSupportCard    │
└─────────────────────────────────────────────┘
```

**Mobile**:
```
┌─────────────────┐
│ OrderHeader     │
│ OrderStatusCard │
│ OrderTimelineCard│
│ OrderItemsList  │
│ OrderSummaryCard│
│ DeliveryDetails │
│ HelpSupportCard │
└─────────────────┘
```

---

## 🔄 User Flow

### Normal Tracking Flow

```
1. User clicks order from history
   ↓
2. Navigate to /orders/{orderUid}
   ↓
3. OrderTrackingPage extracts orderUid
   ↓
4. useOrderDetails(orderUid) fetches all data
   ↓
5. Show OrderTrackingSkeleton while loading
   ↓
6. Process data with utility hooks
   ↓
7. Render main layout with all components
   ↓
8. User can:
   - View current status
   - See timeline history
   - Check delivery details
   - Refresh data
   - Cancel order (if eligible)
   - Get support
```

### Cancel Order Flow

```
1. User clicks "Cancel Order" button
   ↓
2. CancelOrderModal opens (Step 1)
   ↓
3. User selects cancellation reason
   ↓
4. User clicks "Continue"
   ↓
5. CancelOrderModal shows confirmation (Step 2)
   ↓
6. User clicks "Yes, Cancel Order"
   ↓
7. useOrderCancel() API call
   ↓
8. Toast notification (success/error)
   ↓
9. If success → refreshOrderData()
   ↓
10. Modal closes, status updates to "cancelled"
```

### Error Handling Flow

```
1. useOrderDetails returns error
   ↓
2. Render OrderErrorState
   ↓
3. User clicks "Try Again"
   ↓
4. refreshOrderData() executes
   ↓
5. If success → render main layout
   ↓
6. If fail → stay on error state
```

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Data Loading**:
- [ ] Valid orderUid loads correctly
- [ ] Invalid orderUid shows OrderNotFound
- [ ] Loading shows OrderTrackingSkeleton
- [ ] Network error shows OrderErrorState with retry
- [ ] Refresh button updates data
- [ ] Refresh shows loading spinner on button

**Status Display**:
- [ ] Pending order shows amber color
- [ ] Confirmed order shows purple color
- [ ] Shipped order shows blue color
- [ ] Delivered order shows green color
- [ ] Cancelled order shows red color
- [ ] Progress bar matches current status
- [ ] Estimated delivery shows for active orders
- [ ] No estimated delivery for delivered/cancelled

**Timeline**:
- [ ] All milestones display in chronological order
- [ ] Latest milestone has "Current" badge
- [ ] Latest milestone has blue color
- [ ] Completed milestones have green color
- [ ] Connecting lines are visible
- [ ] Timestamps formatted correctly
- [ ] Ping animation on current milestone

**Items List**:
- [ ] Product images load correctly
- [ ] Image fallback works for broken images
- [ ] Product names are clickable
- [ ] Clicking product navigates to product page
- [ ] Quantities display correctly
- [ ] Prices formatted with currency symbol
- [ ] Total items count is accurate

**Order Summary**:
- [ ] Subtotal displays correctly
- [ ] Discount shows in green (if applicable)
- [ ] Delivery shows "FREE" or amount
- [ ] COD charge shows (if applicable)
- [ ] GST shows (if applicable)
- [ ] Total amount is bold and prominent
- [ ] Savings banner shows (if discount exists)
- [ ] Savings amount matches discount
- [ ] Payment confirmation indicator present

**Delivery Details**:
- [ ] Customer name displays
- [ ] Complete address displays (multi-line)
- [ ] Phone number is clickable
- [ ] Clicking phone triggers dialer
- [ ] Payment method displays
- [ ] All sections have correct icons
- [ ] Background colors match design

**Cancel Order**:
- [ ] Cancel button only shows for pending/confirmed
- [ ] Cancel button hidden for other statuses
- [ ] Clicking cancel opens modal
- [ ] All 6 reasons are selectable
- [ ] "Other reason" shows textarea
- [ ] Textarea has 200 char limit
- [ ] Character count updates
- [ ] Continue button disabled without selection
- [ ] Continue button disabled if "Other" without text
- [ ] Confirmation screen shows order number
- [ ] Confirmation screen shows selected reason
- [ ] Cancellation shows loading spinner
- [ ] Success closes modal and refreshes
- [ ] Success shows toast notification
- [ ] Error shows toast and keeps modal open

**Responsive Design**:
- [ ] Desktop shows 3-column layout
- [ ] Tablet shows 2-column layout
- [ ] Mobile shows 1-column layout
- [ ] Sidebar cards are sticky on desktop
- [ ] Touch-friendly on mobile
- [ ] Buttons are accessible size
- [ ] Text is readable at all sizes

**Dark Mode**:
- [ ] All components render in dark mode
- [ ] Colors have sufficient contrast
- [ ] Icons are visible
- [ ] Borders are visible
- [ ] Gradients work in dark mode

**Accessibility**:
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] ARIA labels on icon buttons
- [ ] Focus states are visible
- [ ] Error messages are accessible

---

## 📊 Performance Considerations

### Optimization Techniques

1. **Memoization**:
   - All utility hooks use `useMemo`
   - Prevents unnecessary recalculations
   - Stable references for props

2. **Conditional Rendering**:
   - Early returns for loading/error/not found
   - Component-level null checks
   - Avoids rendering hidden elements

3. **Sticky Positioning**:
   - Uses CSS `position: sticky`
   - No JavaScript scroll listeners
   - GPU-accelerated

4. **Image Optimization**:
   - Error fallback prevents broken images
   - Lazy loading (browser default)
   - Hover effects use CSS transforms

5. **Data Fetching**:
   - Parallel fetching with `Promise.all`
   - Single hook for all order data
   - Prevents multiple API calls

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot read property 'milestone_code' of undefined"

**Cause**: Timeline is empty or malformed.

**Solution**: Add optional chaining and fallback:
```typescript
const currentStatus = timeline?.[timeline.length - 1]?.zm_milestone?.milestone_code?.toLowerCase() || 'pending';
```

### Issue 2: Utility hooks return null, page doesn't render

**Cause**: Missing null checks before rendering.

**Solution**: Add guards in main page:
```typescript
if (!headerData || !orderItems || !summaryData) {
  return <OrderTrackingSkeleton />;
}
```

### Issue 3: Cancel button shows for delivered orders

**Cause**: Using `orderSummary.status` instead of `milestone_code`.

**Solution**: Use timeline milestone:
```typescript
const currentStatus = timeline?.[timeline.length - 1]?.zm_milestone?.milestone_code?.toLowerCase();
const canCancel = CANCELLABLE_STATUSES.includes(currentStatus);
```

### Issue 4: Sidebar not sticky on mobile

**Cause**: `sticky` doesn't work well in flex/grid on mobile.

**Solution**: This is expected. Sidebar is only sticky on desktop (lg+).

### Issue 5: Refresh button doesn't show loading

**Cause**: Not using `isRefreshing` state.

**Solution**: Pass `isRefreshing` to OrderHeader:
```typescript
<OrderHeader isRefreshing={isRefreshing} onRefresh={refreshOrderData} />
```

---

## 🔄 Future Enhancements

### Potential Improvements

1. **Real-time Updates**:
   - WebSocket integration for live status updates
   - Auto-refresh every 30 seconds
   - Push notifications for status changes

2. **Enhanced Timeline**:
   - Photo proof of delivery
   - GPS tracking map
   - Courier contact information

3. **Order Modifications**:
   - Change delivery address
   - Reschedule delivery
   - Add special instructions

4. **Advanced Features**:
   - Download invoice/receipt
   - Print packing slip
   - Share order tracking link
   - Rate delivery experience

5. **Analytics**:
   - Track time spent on page
   - Monitor cancel reasons
   - Identify pain points

6. **Accessibility**:
   - Screen reader announcements
   - High contrast mode
   - Font size adjustment

---

## 📚 Related Documentation

- [Order Hooks Documentation](../../hooks/order/README.md)
- [Order API Documentation](../../services/orderApi.tsx)
- [Redux Order Slice](../../store/slices/orderSlice.tsx)
- [Constants Utilities](../../utils/constants.tsx)

---

## 🤝 Contributing

When modifying order tracking components:

1. **Follow SRP**: Each component should have one responsibility
2. **Maintain Hook Rules**: Hooks should be READ-ONLY
3. **Check Null Values**: Always validate utility hook returns
4. **Update Tests**: Add test cases for new features
5. **Test Dark Mode**: Verify all changes work in both themes
6. **Mobile Responsive**: Test on various screen sizes
7. **Document Changes**: Update this README

---

## 📞 Support

For questions or issues:
- **Technical Lead**: [Your Name]
- **Documentation**: This file
- **Issue Tracker**: [Your GitHub Issues URL]

---

**Last Updated**: October 12, 2025  
**Version**: 1.0.0  
**Author**: LuxeHome Development Team

