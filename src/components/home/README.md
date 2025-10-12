# Home Page Components

This directory contains all the components for the Home Page implementation, following the requirements specified in the user prompt.

## Components Overview

### 1. **HeroSection.tsx**
- **Purpose**: Landing page hero with 3-slide carousel
- **Features**:
  - Auto-advance every 5 seconds
  - Manual navigation with arrow buttons
  - Dot indicators for slide position
  - Pause on hover
  - Smooth fade transitions
  - Responsive design (400px mobile, 500px tablet, 600px desktop)
  - Primary and secondary CTA buttons
  - Gradient overlays for text readability

### 2. **FeaturedCategories.tsx**
- **Purpose**: Display 6 featured categories in a responsive grid
- **Features**:
  - Uses `useFeaturedCategories()` hook
  - Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
  - Skeleton loaders during data fetch
  - Navigate to product list on click
- **Child Component**: CategoryCard.tsx

### 3. **CategoryCard.tsx**
- **Purpose**: Reusable category card component
- **Features**:
  - Uses `useMemo` for performance optimization
  - Calls `formatCategoryForDisplay()` inside the component
  - Displays category image, name, and product count
  - Hover effects with scale and shadow
  - Gradient overlay
  - Interactive "Shop Now" text on hover
  - Keyboard accessible (Enter key support)

### 4. **FeaturedProducts.tsx**
- **Purpose**: Horizontal scrolling section with 8+ featured products
- **Features**:
  - Uses `useFeaturedProducts()` hook
  - Calls `formatProductForDisplay()` inside map
  - Horizontal scroll with custom scroll buttons
  - Add to cart functionality
  - Wishlist toggle with heart icon
  - Product ratings display
  - Discount badges
  - Stock status handling
  - Responsive design with mobile "View All" button
  - Smooth scroll behavior

### 5. **PromotionalBanners.tsx**
- **Purpose**: Two side-by-side promotional banners
- **Features**:
  - Gradient backgrounds (blue and purple)
  - Custom icons (truck for shipping, star for membership)
  - Hover effects with scale and shine animation
  - Decorative background patterns
  - Responsive: stack on mobile, side-by-side on desktop
  - Click/keyboard navigation to respective pages

### 6. **BestSellers.tsx**
- **Purpose**: Horizontal scroll with best-selling products
- **Features**:
  - Uses `useBestSellers()` hook
  - Rank badges (#1, #2, #3, etc.) with gold gradient
  - "BEST SELLER" badge on each product
  - Same functionality as FeaturedProducts (cart, wishlist, ratings)
  - Horizontal scroll with navigation buttons
  - Calls `formatProductForDisplay()` inside map
  - Responsive design

### 7. **Testimonials.tsx**
- **Purpose**: Display 3 customer reviews with trust indicators
- **Features**:
  - 3 testimonial cards in responsive grid
  - Star rating visualization
  - Customer avatar, name, and role
  - Quote styling with quote icon
  - Hover effects with lift animation
  - Trust indicators section with statistics:
    - 10k+ Happy Customers
    - 4.8/5 Average Rating
    - 50k+ Products Sold
    - 99% Satisfaction Rate

### 8. **NewsletterSignup.tsx**
- **Purpose**: Email subscription form with validation and incentive
- **Features**:
  - Email validation using `validateEmail()` from formValidation.ts
  - Redux integration with `subscribeNewsletter()` action
  - "10% off first order" incentive prominently displayed
  - Loading states with spinner
  - Success/error message display
  - Auto-clear success message after 5 seconds
  - Disabled state after successful subscription
  - Benefits section (Exclusive Offers, Early Access, Design Tips)
  - Gradient background with decorative elements
  - Privacy note included
  - Responsive design

## Data Flow & Hooks Usage

### Hooks Called at Component Top Level
- `useFeaturedProducts()` → Returns products, loading, error
- `useFeaturedCategories()` → Returns categories, loading, error
- `useBestSellers()` → Returns products, loading, error
- `useProductUtils()` → Returns { formatProductForDisplay }
- `useCartActions()` → Returns { handleAddToCart }
- `useWishlistActions()` → Returns { isInWishlist, handleToggleWishlist }
- `useAppSelector(state => state.newsletter)` → Returns newsletter state
- `useAppDispatch()` → Returns dispatch function

### Format Functions Called Inside Map
```typescript
// Called inside map for each product
const displayData = formatProductForDisplay(product);

// Called inside map for each category (in CategoryCard via useMemo)
const displayData = useMemo(() => formatCategoryForDisplay(category), [category]);
```

## Constraints Followed

1. ✅ **Hook Rules**: All hooks called at component top level, never inside loops/conditions
2. ✅ **formatProductForDisplay**: Only 2 parameters used (product, ratings optional)
3. ✅ **formatCategoryForDisplay**: Called inside useMemo in CategoryCard
4. ✅ **Newsletter Slice**: Uses subscribeNewsletter(email) and clearNewsletterState()
5. ✅ **Form Validation**: Uses validateEmail(email) utility
6. ✅ **Single Responsibility**: Each component handles one specific section
7. ✅ **Skeleton Loaders**: All components show loading skeletons
8. ✅ **Animations**: Fade-in, slide-in, scale on hover, carousel transitions
9. ✅ **Read-Only Hooks**: No modifications to hook implementations

## HomePage.tsx Integration

The main `HomePage.tsx` file imports and renders all components in order:

```typescript
<HomePage>
  <SEOHead /> // Meta tags for SEO
  <HeroSection />
  <FeaturedCategories />
  <FeaturedProducts />
  <PromotionalBanners />
  <BestSellers />
  <Testimonials />
  <NewsletterSignup />
</HomePage>
```

## SEO Implementation

The page includes proper SEO with:
- Title: "Home - LuxeHome | Premium Home & Lifestyle Products"
- Description: Comprehensive description of the store
- Keywords: Relevant home decor and furniture keywords
- Type: "website"
- Open Graph tags
- Schema.org markup

## Styling & Animations

All components use Tailwind CSS with custom animations defined in `index.css`:
- `animate-fade-in`: Fade in with slight slide up
- `animate-slide-in-left`: Slide in from left
- `animation-delay-200/400/600`: Staggered animation delays
- `scrollbar-hide`: Hide scrollbars on horizontal scroll
- `line-clamp-2`: Truncate text to 2 lines
- Hover effects: scale, shadow, translate, rotate

## Responsive Design

All components are fully responsive:
- **Mobile**: 1 column layouts, smaller text, stack elements
- **Tablet**: 2 column layouts, medium text
- **Desktop**: 3 column layouts, larger text, side-by-side elements

## Accessibility

- Semantic HTML elements (section, button, etc.)
- ARIA labels on interactive elements
- Keyboard navigation support (Enter key)
- Alt text on images
- Focus states on interactive elements
- Proper heading hierarchy

## Performance Optimizations

1. **useMemo**: Used in CategoryCard for memoizing formatted data
2. **Lazy loading**: Images use `loading="lazy"` attribute
3. **Code splitting**: Components are separate files
4. **Skeleton loaders**: Prevent layout shift during loading
5. **Conditional rendering**: Don't render if no data or error
6. **useCallback**: Used in HeroSection for slide navigation functions

## Error Handling

- All components gracefully handle errors by returning `null`
- Loading states prevent empty UI flashes
- Newsletter form validates email before submission
- Cart/wishlist actions handle success/failure with toasts

## Testing Checklist

- [ ] Hero carousel auto-advances every 5 seconds
- [ ] Hero carousel pauses on hover
- [ ] Categories navigate to product list with correct filter
- [ ] Products can be added to cart
- [ ] Wishlist toggle works correctly
- [ ] Best sellers show rank badges
- [ ] Newsletter form validates email
- [ ] Newsletter shows success message after subscription
- [ ] All sections load with proper skeleton states
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Animations play smoothly
- [ ] Images load correctly with fallbacks
- [ ] SEO meta tags are present

## Future Enhancements

1. Add real product images from API
2. Implement A/B testing for hero slides
3. Add analytics tracking for user interactions
4. Implement virtual scrolling for product lists
5. Add image lazy loading with blur-up effect
6. Implement infinite scroll for products
7. Add social proof notifications
8. Implement real-time inventory updates

