# Wishlist Page - Complete Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Hooks Documentation](#hooks-documentation)
5. [Components Documentation](#components-documentation)
6. [Data Flow](#data-flow)
7. [Features](#features)
8. [Usage Examples](#usage-examples)
9. [Constraints & Best Practices](#constraints--best-practices)
10. [Testing Guide](#testing-guide)
11. [Common Issues & Solutions](#common-issues--solutions)

---

## Overview

The Wishlist Page is a **standalone, full-featured wishlist management system** with advanced features including:

- 🔍 **Search** with 300ms debounce
- 🔄 **4 Sort Options** (Recent, Price Low/High, Name A-Z)
- ☑️ **Bulk Actions** (Select All, Remove, Move to Cart)
- 📱 **Responsive Grid** (4-3-2-1 columns)
- 🎨 **Modern UI** with animations and dark mode
- 🚀 **Performance Optimized** with lazy loading and memoization

### Key Philosophy

**Single Primary Hook Pattern**: The entire page functionality is encapsulated in `useWishlistPage()`, which composes all sub-hooks. This provides:
- ✅ Simplified page-level code
- ✅ Consistent data flow
- ✅ Easy testing and maintenance
- ✅ Clear separation of concerns

---

## Architecture

### Hook Composition Strategy

```
useWishlistPage() ⭐ PRIMARY HOOK
│
├── useAppSelector(state.wishlist)
│   └── wishlistItems: Product[]
│   └── loading: boolean
│
├── useWishlistDisplayData({ products })
│   └── displayDataMap: Map<string, ProductDisplayData>
│       ├── primaryImage, displayName, price, mrp
│       ├── discountPercent, isAvailable
│       └── stockStatus, canAddToCart
│
├── useWishlistFilters({ products, displayDataMap })
│   ├── searchQuery (with 300ms internal debounce)
│   ├── sortBy (recent | price-low | price-high | name)
│   └── sortedProducts: Product[]
│
├── useWishlistSelection({ products: sortedProducts })
│   ├── selectedItems: Set<string>
│   ├── selectedCount: number
│   └── handlers: toggle, selectAll, deselectAll
│
└── useWishlistBulkActions({ selectedItems, products, displayDataMap })
    ├── handleRemoveSelected (with confirmation)
    └── handleMoveSelectedToCart (skips out-of-stock)
        ├── useCartActions()
        ├── useWishlistActions()
        └── useToast()
```

### Component Structure (SRP)

```
WishlistPage.tsx (Orchestrator)
│
├── <WishlistHeader />
│   ├── Title + Item Count
│   ├── Search Bar (debounced)
│   └── Sort Dropdown
│
├── <BulkActionsBar />
│   ├── Select All / Deselect All
│   └── Bulk Actions (Remove, Move to Cart)
│
└── <WishlistGrid /> or <WishlistEmpty />
    │
    └── <WishlistCard />[] (for each product)
        ├── Checkbox (selection)
        ├── Product Image (lazy-loaded)
        ├── Product Info (name, price, discount)
        ├── Remove Button (heart icon)
        └── Move to Cart Button
```

---

## File Structure

```
src/
├── pages/
│   └── WishlistPage.tsx                 # Main page (uses useWishlistPage)
│
├── hooks/wishlist/
│   ├── index.tsx                        # Hook exports
│   ├── useWishlistPage.tsx             # ⭐ PRIMARY HOOK - Composes all
│   ├── useWishlistDisplayData.tsx      # Format product display data
│   ├── useWishlistFilters.tsx          # Search + sort logic
│   ├── useWishlistSelection.tsx        # Bulk selection state
│   ├── useWishlistBulkActions.tsx      # Bulk operations
│   └── useWishlistActions.tsx          # Individual actions (existing)
│
└── components/wishlist/
    ├── index.tsx                        # Component exports
    ├── WishlistHeader.tsx               # Search + Sort controls
    ├── BulkActionsBar.tsx               # Bulk selection + actions
    ├── WishlistGrid.tsx                 # Product grid container
    ├── WishlistCard.tsx                 # Individual product card
    ├── WishlistSkeleton.tsx             # Loading skeleton (8 cards)
    ├── WishlistEmpty.tsx                # Empty states
    └── WISHLIST_README.md               # This file
```

---

## Hooks Documentation

### 🌟 `useWishlistPage()` - PRIMARY HOOK

**Purpose**: Single entry point for all wishlist functionality. Composes all sub-hooks.

**Location**: `src/hooks/wishlist/useWishlistPage.tsx`

**Returns**:
```typescript
interface UseWishlistPageReturn {
  // Data
  wishlistItems: Product[];              // Raw wishlist from Redux
  loading: boolean;                      // Loading state
  sortedProducts: Product[];             // Filtered & sorted products
  displayDataMap: Map<string, ProductDisplayData>; // Formatted data
  
  // Search & Sort
  searchQuery: string;                   // Current search query
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;                    // Current sort option
  setSortBy: (sort: SortOption) => void;
  
  // Selection
  selectedItems: Set<string>;            // Selected product UIDs
  selectedCount: number;                 // Count of selected items
  handleToggleSelect: (productUid: string) => void;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  
  // Bulk Actions
  handleRemoveSelected: () => Promise<void>;
  handleMoveSelectedToCart: () => Promise<void>;
}

type SortOption = 'recent' | 'price-low' | 'price-high' | 'name';
```

**Usage Example**:
```tsx
const WishlistPage = () => {
  const {
    wishlistItems,
    loading,
    sortedProducts,
    displayDataMap,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedItems,
    selectedCount,
    handleToggleSelect,
    handleSelectAll,
    handleDeselectAll,
    handleRemoveSelected,
    handleMoveSelectedToCart,
  } = useWishlistPage();

  if (loading && wishlistItems.length === 0) {
    return <WishlistSkeleton />;
  }

  return (
    <>
      <WishlistHeader
        totalItems={wishlistItems.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      {/* ... rest of the page */}
    </>
  );
};
```

**Internal Behavior**:
- Fetches wishlist on mount: `dispatch(getUserWishlist())`
- Creates display data map for all products
- Handles search with debounce (300ms internally)
- Applies sorting to filtered results
- Manages selection state
- Provides bulk action handlers

---

### `useWishlistDisplayData({ products })`

**Purpose**: Transforms raw products into display-ready data with formatting.

**Location**: `src/hooks/wishlist/useWishlistDisplayData.tsx`

**Parameters**:
```typescript
interface UseWishlistDisplayDataParams {
  products: Product[];
}
```

**Returns**:
```typescript
interface UseWishlistDisplayDataReturn {
  displayDataMap: Map<string, ProductDisplayData>;
}

// ProductDisplayData from productUtils.ts
interface ProductDisplayData {
  product_uid: string;
  category_uid: string;
  primaryImage: string;
  secondaryImage: string;
  allImages: string[];
  price: string;                    // Formatted: "$299.99"
  mrp: string | null;               // Formatted: "$399.99"
  discountPercent: number;          // e.g., 25
  discountedPrice: number;          // Numeric price
  stockStatus: string;              // "In Stock" / "Out of Stock"
  isAvailable: boolean;
  canAddToCart: boolean;
  displayName: string;
  brand: string | null;
  description: string;
  minOrderQuantity: number;
  averageRating: number;
  totalReviews: number;
  ratingStars: { filled: number; empty: number; hasHalf: boolean };
  ratingText: string;
}
```

**How to Use**:
```tsx
const displayData = displayDataMap.get(product.product_uid);
if (!displayData) return null;

<div>
  <img src={displayData.primaryImage} alt={displayData.displayName} />
  <h3>{displayData.displayName}</h3>
  <p>{displayData.price}</p>
  {displayData.discountPercent > 0 && (
    <span>{displayData.discountPercent}% OFF</span>
  )}
</div>
```

**Performance**: Uses `useMemo` to avoid recalculating on every render.

---

### `useWishlistFilters({ products, displayDataMap })`

**Purpose**: Handles search and sorting logic.

**Location**: `src/hooks/wishlist/useWishlistFilters.tsx`

**Parameters**:
```typescript
interface UseWishlistFiltersParams {
  products: Product[];
  displayDataMap: Map<string, ProductDisplayData>;
}
```

**Returns**:
```typescript
interface UseWishlistFiltersReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  sortedProducts: Product[];          // Filtered & sorted
}
```

**Search Behavior**:
- **Debounce**: 300ms (handled internally via `useEffect`)
- **Search Fields**: `displayName`, `product_uid`, `brand`
- **Case Insensitive**: Converts query to lowercase

**Sort Options**:
1. **`recent`** (default): Original wishlist order
2. **`price-low`**: Sort by `discountedPrice` ascending
3. **`price-high`**: Sort by `discountedPrice` descending
4. **`name`**: Sort by `displayName` alphabetically

**Example**:
```tsx
const { searchQuery, setSearchQuery, sortBy, setSortBy, sortedProducts } = 
  useWishlistFilters({ products: wishlistItems, displayDataMap });

// User types in search box
<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

// After 300ms, sortedProducts updates automatically
sortedProducts.map(product => <ProductCard key={product.product_uid} />)
```

---

### `useWishlistSelection({ products })`

**Purpose**: Manages bulk selection state for checkboxes.

**Location**: `src/hooks/wishlist/useWishlistSelection.tsx`

**Parameters**:
```typescript
interface UseWishlistSelectionParams {
  products: Product[];  // Pass sortedProducts, not all products
}
```

**Returns**:
```typescript
interface UseWishlistSelectionReturn {
  selectedItems: Set<string>;          // Product UIDs
  selectedCount: number;
  handleToggleSelect: (productUid: string) => void;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  clearSelection: () => void;          // Internal use
}
```

**Why `Set<string>`?**
- O(1) lookup: `selectedItems.has(productUid)`
- Automatic deduplication
- Memory efficient

**Example**:
```tsx
const { selectedItems, selectedCount, handleToggleSelect, handleSelectAll } = 
  useWishlistSelection({ products: sortedProducts });

// Checkbox state
const isSelected = selectedItems.has(product.product_uid);

// Toggle selection
<input
  type="checkbox"
  checked={isSelected}
  onChange={() => handleToggleSelect(product.product_uid)}
/>

// Select all button
<button onClick={handleSelectAll}>
  Select All ({sortedProducts.length})
</button>

// Selection count
<span>{selectedCount} selected</span>
```

---

### `useWishlistBulkActions({ selectedItems, products, displayDataMap, clearSelection })`

**Purpose**: Handles bulk remove and bulk move to cart operations.

**Location**: `src/hooks/wishlist/useWishlistBulkActions.tsx`

**Parameters**:
```typescript
interface UseWishlistBulkActionsParams {
  selectedItems: Set<string>;
  products: Product[];
  displayDataMap: Map<string, ProductDisplayData>;
  clearSelection: () => void;
}
```

**Returns**:
```typescript
interface UseWishlistBulkActionsReturn {
  handleRemoveSelected: () => Promise<void>;
  handleMoveSelectedToCart: () => Promise<void>;
}
```

**`handleRemoveSelected()` Behavior**:
1. Shows confirmation dialog: `window.confirm()`
2. Message: "Are you sure you want to remove X items?"
3. Removes all selected items via `handleRemoveFromWishlist()`
4. Clears selection on success
5. Toast notification: "X items removed from wishlist"

**`handleMoveSelectedToCart()` Behavior**:
1. Loops through selected items
2. **Skips out-of-stock items** (`displayData.isAvailable === false`)
3. Calls `handleAddToCart(product, displayData, 1)`
4. Removes from wishlist on successful cart addition
5. Clears selection
6. Toast notifications:
   - Success: "X items moved to cart"
   - Warning: "X out-of-stock items skipped"

**Example**:
```tsx
const { handleRemoveSelected, handleMoveSelectedToCart } = 
  useWishlistBulkActions({
    selectedItems,
    products: wishlistItems,
    displayDataMap,
    clearSelection,
  });

<button onClick={handleRemoveSelected}>
  Remove Selected ({selectedCount})
</button>

<button onClick={handleMoveSelectedToCart}>
  Move to Cart ({selectedCount})
</button>
```

**Dependencies**:
- `useCartActions()` → `handleAddToCart(product, displayData, quantity)`
- `useWishlistActions()` → `handleRemoveFromWishlist(productUid)`
- `useToast()` → Toast notifications

---

## Components Documentation

### `WishlistHeader.tsx`

**Purpose**: Display page title, item count, search bar, and sort dropdown.

**Props**:
```typescript
interface WishlistHeaderProps {
  totalItems: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}
```

**Features**:
- **Search Bar**:
  - Debounce: 300ms (internal `useEffect`)
  - Placeholder: "Search wishlist..."
  - Search icon (lucide-react)
- **Sort Dropdown**:
  - Options: Most Recent, Price: Low to High, Price: High to Low, Name: A to Z
  - Sort icon (lucide-react)
- **Responsive**: Stacks on mobile, side-by-side on desktop

**Example**:
```tsx
<WishlistHeader
  totalItems={wishlistItems.length}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  sortBy={sortBy}
  onSortChange={setSortBy}
/>
```

---

### `BulkActionsBar.tsx`

**Purpose**: Bulk selection controls and action buttons.

**Props**:
```typescript
interface BulkActionsBarProps {
  selectedCount: number;
  totalItems: number;                  // sortedProducts.length
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onRemoveSelected: () => void;
  onMoveSelectedToCart: () => void;
}
```

**Features**:
- **Select All / Deselect All** toggle button
- **Selection Count**: "X items selected"
- **Bulk Actions** (only shown when items selected):
  - Move to Cart button (blue)
  - Remove button (red)
- **Responsive**: Stacks on mobile, horizontal on desktop
- **Animation**: `animate-slide-in` on mount

**Visibility**: Hidden when `totalItems === 0`

**Example**:
```tsx
<BulkActionsBar
  selectedCount={selectedCount}
  totalItems={sortedProducts.length}
  onSelectAll={handleSelectAll}
  onDeselectAll={handleDeselectAll}
  onRemoveSelected={handleRemoveSelected}
  onMoveSelectedToCart={handleMoveSelectedToCart}
/>
```

---

### `WishlistGrid.tsx`

**Purpose**: Responsive grid container for product cards.

**Props**:
```typescript
interface WishlistGridProps {
  products: Product[];                 // sortedProducts
  displayDataMap: Map<string, ProductDisplayData>;
  selectedItems: Set<string>;
  onToggleSelect: (productUid: string) => void;
}
```

**Grid Layout**:
- `xl`: 4 columns (`xl:grid-cols-4`)
- `lg`: 3 columns (`lg:grid-cols-3`)
- `sm`: 2 columns (`sm:grid-cols-2`)
- Mobile: 1 column (`grid-cols-1`)
- Gap: 24px (`gap-6`)

**Example**:
```tsx
<WishlistGrid
  products={sortedProducts}
  displayDataMap={displayDataMap}
  selectedItems={selectedItems}
  onToggleSelect={handleToggleSelect}
/>
```

**Null Safety**: Skips products without display data.

---

### `WishlistCard.tsx`

**Purpose**: Individual product card with all interactions.

**Props**:
```typescript
interface WishlistCardProps {
  product: Product;
  displayData: ProductDisplayData;
  isSelected: boolean;
  onToggleSelect: (productUid: string) => void;
}
```

**Features**:
- **Checkbox** (top-left): Select/deselect product
- **Remove Button** (top-right): Heart icon (filled red)
- **Product Image**: Lazy-loaded, click to view details
- **Discount Badge** (bottom-left): Shows `discountPercent`
- **Out of Stock Overlay**: Semi-transparent with text
- **Product Info**:
  - Name (2-line clamp)
  - Price (formatted)
  - MRP (strikethrough if discount)
- **Move to Cart Button**:
  - Disabled if out of stock
  - Shows loading spinner during action
  - Click stops propagation

**Interactions**:
1. **Click Card**: Navigate to `/products/${product_uid}`
2. **Click Checkbox**: Toggle selection
3. **Click Heart**: Remove from wishlist
4. **Click Move to Cart**: Add to cart + remove from wishlist

**Animations**:
- Card: `hover:scale-[1.02]`, `hover:shadow-xl`
- Image: `group-hover:scale-110`
- Fade-in on mount: `animate-fade-in`

**Example**:
```tsx
<WishlistCard
  product={product}
  displayData={displayDataMap.get(product.product_uid)!}
  isSelected={selectedItems.has(product.product_uid)}
  onToggleSelect={handleToggleSelect}
/>
```

---

### `WishlistSkeleton.tsx`

**Purpose**: Loading skeleton for initial page load.

**Features**:
- Header skeleton (title, search, sort)
- Bulk actions skeleton
- **8 product card skeletons** (as per spec)
- Responsive grid layout
- Pulsing animation: `animate-pulse`

**Usage**:
```tsx
if (loading && wishlistItems.length === 0) {
  return <WishlistSkeleton />;
}
```

---

### `WishlistEmpty.tsx`

**Purpose**: Empty state displays.

**Props**:
```typescript
interface WishlistEmptyProps {
  searchQuery?: string;
  totalItems: number;
}
```

**Two States**:

1. **Search Empty** (`searchQuery` exists):
   - Heart icon (gray)
   - "No items match your search"
   - Shows: "Showing 0 of X items"

2. **Completely Empty** (no `searchQuery`):
   - Heart icon (red gradient background)
   - "Your wishlist is empty"
   - "Start Shopping" button → navigates to `/products`

**Example**:
```tsx
{sortedProducts.length === 0 ? (
  <WishlistEmpty
    searchQuery={searchQuery}
    totalItems={wishlistItems.length}
  />
) : (
  <WishlistGrid ... />
)}
```

---

## Data Flow

### 1. Initial Load

```
User lands on /wishlist
    ↓
WishlistPage mounts
    ↓
useWishlistPage() executes
    ↓
useEffect(() => dispatch(getUserWishlist()), [])
    ↓
Redux: wishlistSlice.loading = true
    ↓
API call to fetch wishlist
    ↓
Redux: wishlistSlice.wishlistItems = Product[]
    ↓
useWishlistDisplayData() creates displayDataMap
    ↓
useWishlistFilters() returns sortedProducts
    ↓
Render: WishlistGrid with WishlistCards
```

### 2. Search Flow

```
User types in search box
    ↓
WishlistHeader: onChange(e.target.value)
    ↓
Local state: setLocalQuery(value)
    ↓
useEffect with 300ms debounce
    ↓
onSearchChange(localQuery) called
    ↓
useWishlistFilters: setSearchQuery(query)
    ↓
useMemo: filteredProducts recalculated
    ↓
useMemo: sortedProducts recalculated
    ↓
Re-render: WishlistGrid with filtered results
    ↓
If no results: WishlistEmpty (search state)
```

### 3. Bulk Move to Cart Flow

```
User selects multiple items → selectedItems Set
    ↓
User clicks "Move to Cart"
    ↓
handleMoveSelectedToCart() executes
    ↓
Loop through selectedItems:
    ├─ Get product and displayData
    ├─ Check if available (displayData.isAvailable)
    ├─ If available:
    │   ├─ handleAddToCart(product, displayData, 1)
    │   ├─ If success: handleRemoveFromWishlist(productUid)
    │   └─ movedCount++
    └─ If unavailable: skippedCount++
    ↓
clearSelection()
    ↓
Toast notifications:
    ├─ Success: "X items moved to cart"
    └─ Warning: "X out-of-stock items skipped"
    ↓
Redux: wishlistItems updated
    ↓
Re-render: Updated grid
```

---

## Features

### 🔍 Search

**Trigger**: User types in search bar  
**Debounce**: 300ms (internal)  
**Search Fields**:
- Product name (`displayData.displayName`)
- Product UID (`product.product_uid`)
- Brand (`displayData.brand`)

**Case**: Insensitive  
**Result**: Updates `sortedProducts` automatically

---

### 🔄 Sort

**Options**:
1. **Recent** (default): Original wishlist order
2. **Price: Low to High**: Ascending by `discountedPrice`
3. **Price: High to Low**: Descending by `discountedPrice`
4. **Name: A to Z**: Alphabetical by `displayName`

**Trigger**: Dropdown change  
**Result**: Immediate re-sort of filtered products

---

### ☑️ Bulk Selection

**Features**:
- Individual checkbox on each card
- Select All button
- Deselect All button
- Selection count display

**State**: `Set<string>` of product UIDs  
**Performance**: O(1) lookups for checkbox state

---

### 🗑️ Bulk Remove

**Flow**:
1. User selects items
2. Clicks "Remove" button
3. Confirmation dialog: "Are you sure you want to remove X items?"
4. If confirmed:
   - Remove each item via API
   - Clear selection
   - Toast: "X items removed from wishlist"
5. Grid updates automatically

---

### 🛒 Bulk Move to Cart

**Flow**:
1. User selects items
2. Clicks "Move to Cart" button
3. **Smart Handling**:
   - Available items: Add to cart → Remove from wishlist
   - Out-of-stock items: Skip with counter
4. Toast notifications:
   - Success: "X items moved to cart"
   - Warning: "X out-of-stock items skipped"
5. Clear selection
6. Grid updates

**Critical**: Requires both `product` and `displayData` for `handleAddToCart()`

---

### 🖼️ Lazy Loading

**Images**: All product images use `loading="lazy"` attribute  
**Performance**: Defers off-screen image loading  
**Result**: Faster initial page load

---

### 🎨 Animations

**Card Animations**:
- `animate-fade-in` on mount
- `hover:scale-[1.02]` on hover
- `hover:shadow-xl` on hover

**Image Animations**:
- `group-hover:scale-110` on card hover

**Bulk Actions Bar**:
- `animate-slide-in` on appearance

**Skeleton**:
- `animate-pulse` pulsing effect

---

### 📱 Responsive Design

**Breakpoints**:
- Mobile: 1 column, stacked layout
- Tablet (sm): 2 columns, stacked header
- Desktop (lg): 3 columns, horizontal header
- Large (xl): 4 columns

**Touch-Friendly**:
- Large buttons (44px+ height)
- Adequate spacing
- Tap targets

---

### 🌓 Dark Mode

**All components** have dark mode variants:
- `dark:bg-gray-800`
- `dark:text-gray-100`
- `dark:border-gray-700`

**Tested**: All states in both light and dark modes

---

## Usage Examples

### Basic Page Setup

```tsx
import { useWishlistPage } from '../hooks/wishlist/useWishlistPage';
import {
  WishlistHeader,
  BulkActionsBar,
  WishlistGrid,
  WishlistEmpty,
  WishlistSkeleton,
} from '../components/wishlist';
import SEOHead from '../components/common/SEOHead';

const WishlistPage = () => {
  // Single hook for everything!
  const {
    wishlistItems,
    loading,
    sortedProducts,
    displayDataMap,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedItems,
    selectedCount,
    handleToggleSelect,
    handleSelectAll,
    handleDeselectAll,
    handleRemoveSelected,
    handleMoveSelectedToCart,
  } = useWishlistPage();

  // Loading skeleton
  if (loading && wishlistItems.length === 0) {
    return <WishlistSkeleton />;
  }

  const totalItems = wishlistItems.length;
  const hasResults = sortedProducts.length > 0;

  return (
    <>
      <SEOHead title="My Wishlist - LuxeHome" description="Your saved products" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <WishlistHeader
            totalItems={totalItems}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Bulk Actions */}
          {totalItems > 0 && (
            <BulkActionsBar
              selectedCount={selectedCount}
              totalItems={sortedProducts.length}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onRemoveSelected={handleRemoveSelected}
              onMoveSelectedToCart={handleMoveSelectedToCart}
            />
          )}

          {/* Search Results Info */}
          {searchQuery && totalItems > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {sortedProducts.length} of {totalItems} items
            </div>
          )}

          {/* Grid or Empty State */}
          {hasResults ? (
            <WishlistGrid
              products={sortedProducts}
              displayDataMap={displayDataMap}
              selectedItems={selectedItems}
              onToggleSelect={handleToggleSelect}
            />
          ) : (
            <WishlistEmpty searchQuery={searchQuery} totalItems={totalItems} />
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
```

---

### Custom Card Actions

```tsx
import { WishlistCard } from '../components/wishlist';

const CustomWishlistCard = () => {
  const { displayDataMap, selectedItems, handleToggleSelect } = useWishlistPage();

  return (
    <>
      {sortedProducts.map((product) => {
        const displayData = displayDataMap.get(product.product_uid);
        if (!displayData) return null;

        return (
          <WishlistCard
            key={product.product_uid}
            product={product}
            displayData={displayData}
            isSelected={selectedItems.has(product.product_uid)}
            onToggleSelect={handleToggleSelect}
          />
        );
      })}
    </>
  );
};
```

---

### Programmatic Selection

```tsx
const { selectedItems, handleToggleSelect, handleSelectAll } = useWishlistPage();

// Select specific items programmatically
const selectDiscountedItems = () => {
  sortedProducts.forEach((product) => {
    const displayData = displayDataMap.get(product.product_uid);
    if (displayData && displayData.discountPercent > 20) {
      if (!selectedItems.has(product.product_uid)) {
        handleToggleSelect(product.product_uid);
      }
    }
  });
};

<button onClick={selectDiscountedItems}>
  Select Items with 20%+ Discount
</button>
```

---

## Constraints & Best Practices

### ✅ DO's

1. **Always use `useWishlistPage()`** at the page level
   ```tsx
   // ✅ Good
   const WishlistPage = () => {
     const { sortedProducts, displayDataMap, ... } = useWishlistPage();
   };
   ```

2. **Pass `sortedProducts` to WishlistGrid**, not `wishlistItems`
   ```tsx
   // ✅ Good
   <WishlistGrid products={sortedProducts} />
   
   // ❌ Bad - bypasses search/sort
   <WishlistGrid products={wishlistItems} />
   ```

3. **Use `displayDataMap.get()` for product data**
   ```tsx
   // ✅ Good
   const displayData = displayDataMap.get(product.product_uid);
   if (!displayData) return null;
   ```

4. **Check availability before cart actions**
   ```tsx
   // ✅ Good
   if (displayData.isAvailable) {
     await handleAddToCart(product, displayData, 1);
   }
   ```

5. **Pass both product and displayData to handleAddToCart**
   ```tsx
   // ✅ Good
   await handleAddToCart(product, displayData, 1);
   
   // ❌ Bad - missing displayData
   await handleAddToCart(product, 1);
   ```

---

### ❌ DON'Ts

1. **Don't modify hook internals**
   ```tsx
   // ❌ Bad - hooks are READ-ONLY
   const hook = useWishlistPage();
   hook.sortedProducts.push(newProduct); // ❌
   ```

2. **Don't bypass the primary hook**
   ```tsx
   // ❌ Bad - duplicates logic
   const { wishlistItems } = useAppSelector(state => state.wishlist);
   const [filtered, setFiltered] = useState([]);
   // ... manual filtering
   
   // ✅ Good - use the hook
   const { sortedProducts } = useWishlistPage();
   ```

3. **Don't mutate `selectedItems` directly**
   ```tsx
   // ❌ Bad
   selectedItems.add(productUid);
   
   // ✅ Good
   handleToggleSelect(productUid);
   ```

4. **Don't create duplicate search debounce**
   ```tsx
   // ❌ Bad - debounce already handled
   const [localQuery, setLocalQuery] = useState('');
   useEffect(() => {
     const timer = setTimeout(() => setSearchQuery(localQuery), 300);
     return () => clearTimeout(timer);
   }, [localQuery]);
   
   // ✅ Good - just use setSearchQuery directly
   <input onChange={(e) => setSearchQuery(e.target.value)} />
   ```

5. **Don't skip null checks for displayData**
   ```tsx
   // ❌ Bad - can crash
   const displayData = displayDataMap.get(product.product_uid);
   return <div>{displayData.displayName}</div>;
   
   // ✅ Good
   const displayData = displayDataMap.get(product.product_uid);
   if (!displayData) return null;
   return <div>{displayData.displayName}</div>;
   ```

---

### 🎯 Performance Best Practices

1. **Lazy load images**: Always use `loading="lazy"`
2. **Use Set for selection**: O(1) lookups vs O(n) for arrays
3. **Memoize expensive computations**: Already done in hooks
4. **Debounce search**: Already handled (300ms)
5. **Skeleton loading**: Show immediately on mount

---

## Testing Guide

### Unit Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useWishlistPage } from '../hooks/wishlist/useWishlistPage';

describe('useWishlistPage', () => {
  it('should fetch wishlist on mount', () => {
    const { result } = renderHook(() => useWishlistPage());
    expect(result.current.loading).toBe(true);
  });

  it('should filter products by search query', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWishlistPage());
    await waitForNextUpdate();

    act(() => {
      result.current.setSearchQuery('sofa');
    });

    await waitForNextUpdate();
    expect(result.current.sortedProducts.length).toBeGreaterThan(0);
  });

  it('should sort products by price', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useWishlistPage());
    await waitForNextUpdate();

    act(() => {
      result.current.setSortBy('price-low');
    });

    const prices = result.current.sortedProducts.map((p) =>
      result.current.displayDataMap.get(p.product_uid)?.discountedPrice
    );

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
```

---

### Component Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import WishlistCard from '../components/wishlist/WishlistCard';

describe('WishlistCard', () => {
  const mockProduct = { product_uid: '123', product_name: 'Test Product' };
  const mockDisplayData = {
    displayName: 'Test Product',
    price: '$299.99',
    primaryImage: 'test.jpg',
    isAvailable: true,
    discountPercent: 25,
  };

  it('should render product information', () => {
    render(
      <WishlistCard
        product={mockProduct}
        displayData={mockDisplayData}
        isSelected={false}
        onToggleSelect={jest.fn()}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$299.99')).toBeInTheDocument();
    expect(screen.getByText('25% OFF')).toBeInTheDocument();
  });

  it('should call onToggleSelect when checkbox is clicked', () => {
    const mockToggle = jest.fn();
    render(
      <WishlistCard
        product={mockProduct}
        displayData={mockDisplayData}
        isSelected={false}
        onToggleSelect={mockToggle}
      />
    );

    const checkbox = screen.getByLabelText(/select item/i);
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledWith('123');
  });

  it('should disable move to cart for out-of-stock items', () => {
    const outOfStockData = { ...mockDisplayData, isAvailable: false };
    render(
      <WishlistCard
        product={mockProduct}
        displayData={outOfStockData}
        isSelected={false}
        onToggleSelect={jest.fn()}
      />
    );

    const moveToCartButton = screen.getByText(/move to cart/i);
    expect(moveToCartButton).toBeDisabled();
  });
});
```

---

### Integration Testing

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WishlistPage from '../pages/WishlistPage';

describe('WishlistPage Integration', () => {
  it('should complete full bulk move to cart flow', async () => {
    render(<WishlistPage />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Select items
    const checkboxes = screen.getAllByLabelText(/select item/i);
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    // Move to cart
    const moveToCartButton = screen.getByText(/move to cart/i);
    fireEvent.click(moveToCartButton);

    // Verify toast notification
    await waitFor(() => {
      expect(screen.getByText(/2 items moved to cart/i)).toBeInTheDocument();
    });

    // Verify items removed from wishlist
    await waitFor(() => {
      expect(checkboxes[0]).not.toBeInTheDocument();
    });
  });
});
```

---

## Common Issues & Solutions

### Issue 1: Search not working

**Problem**: Typing in search bar doesn't filter products

**Solution**: Check that you're passing `sortedProducts` to WishlistGrid, not `wishlistItems`
```tsx
// ✅ Correct
<WishlistGrid products={sortedProducts} />

// ❌ Wrong
<WishlistGrid products={wishlistItems} />
```

---

### Issue 2: "Cannot read property 'displayName' of undefined"

**Problem**: Missing null check for displayData

**Solution**: Always check if displayData exists
```tsx
const displayData = displayDataMap.get(product.product_uid);
if (!displayData) return null; // ✅ Add this check
```

---

### Issue 3: Bulk move to cart fails silently

**Problem**: handleAddToCart expects both product and displayData

**Solution**: Pass both arguments
```tsx
// ❌ Wrong
await handleAddToCart(product, 1);

// ✅ Correct
await handleAddToCart(product, displayData, 1);
```

---

### Issue 4: Selection state not updating

**Problem**: Mutating selectedItems Set directly

**Solution**: Use the provided handlers
```tsx
// ❌ Wrong
selectedItems.add(productUid);

// ✅ Correct
handleToggleSelect(productUid);
```

---

### Issue 5: Sort by "Recent" not working

**Problem**: Product interface doesn't have `creation_date`

**Solution**: "Recent" now maintains original wishlist order (already fixed in implementation)

---

### Issue 6: Images loading slowly

**Problem**: All images load at once

**Solution**: Ensure `loading="lazy"` is set on all `<img>` tags (already implemented)

---

### Issue 7: Dark mode not working

**Problem**: Missing dark mode classes

**Solution**: All components have dark mode classes. Ensure your theme provider is configured correctly.

---

## Performance Metrics

**Expected Performance**:
- Initial Load: < 2s
- Search Response: < 350ms (300ms debounce + 50ms render)
- Bulk Action: < 1s per 10 items
- Image Loading: Progressive (lazy)
- Memory: ~5MB for 100 products

**Optimization Techniques Used**:
1. ✅ `useMemo` for expensive computations
2. ✅ `useCallback` for stable function references
3. ✅ Lazy loading images
4. ✅ Debounced search
5. ✅ Set data structure for O(1) lookups
6. ✅ Skeleton loaders for perceived performance

---

## Future Enhancements

**Potential Additions**:
1. **Filters**: Price range, category, brand filters
2. **View Toggle**: Grid vs List view
3. **Share Wishlist**: Generate shareable links
4. **Wishlist Groups**: Organize into collections
5. **Price Drop Alerts**: Notify when prices drop
6. **Export**: Export wishlist as PDF/CSV
7. **Comparison**: Compare selected items
8. **Recently Viewed**: Show recently viewed products

---

## Changelog

### Version 1.0.0 (Current)
- ✅ Initial implementation
- ✅ Search with debounce
- ✅ 4 sort options
- ✅ Bulk actions (remove, move to cart)
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading skeletons
- ✅ Empty states
- ✅ Lazy loading images
- ✅ Toast notifications
- ✅ Availability checks

---

## Support

**Questions or Issues?**
- Check [Common Issues & Solutions](#common-issues--solutions)
- Review [Usage Examples](#usage-examples)
- Verify [Constraints & Best Practices](#constraints--best-practices)

**Contributors**: Built following Single Responsibility Principle (SRP) and Hook Composition Pattern.

---

## License

Part of the LuxeHome e-commerce platform.

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅

