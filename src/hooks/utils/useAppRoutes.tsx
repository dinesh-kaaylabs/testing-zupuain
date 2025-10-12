import { useMemo, lazy } from 'react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PageSkeleton from '../../components/common/PageSkeleton';
import SEOHead from '../../components/common/SEOHead';

// Lazy load pages
const pages = {
  home: lazy(() => import('../../pages/HomePage')),
  products: lazy(() => import('../../pages/ProductListPage')),
  product: lazy(() => import('../../pages/ProductDetailsPage')),
  cart: lazy(() => import('../../pages/CartPage')),
  checkout: lazy(() => import('../../pages/CheckoutPage')),
  login: lazy(() => import('../../pages/LoginPage')),
  register: lazy(() => import('../../pages/RegisterPage')),
  account: lazy(() => import('../../pages/MyAccountPage')),
  wishlist: lazy(() => import('../../pages/WishlistPage')),
  tracking: lazy(() => import('../../pages/OrderTrackingPage')),
  notFound: lazy(() => import('../../pages/NotFoundPage')),
};

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  fallback: React.ReactNode;
  layout?: boolean; // false = no header/footer
}

const withSEO = (Component: React.ComponentType, seo?: { title?: string; description?: string; keywords?: string; type?: 'website' | 'article' | 'product'; noindex?: boolean }) => (
  <>
    {seo && <SEOHead {...seo} />}
    <Component />
  </>
);

export const useAppRoutes = (): RouteConfig[] => {
  return useMemo(() => [
    { path: "/", element: withSEO(pages.home, { title: "LuxeHome - Premium Home & Lifestyle", description: "Discover premium home decor, furniture, and lifestyle products. Quality craftsmanship meets modern design.", keywords: "home decor, furniture, lifestyle, premium, luxury, design" }), fallback: <PageSkeleton type="home" /> },
    { path: "/products", element: withSEO(pages.products, { title: "Products - LuxeHome", description: "Browse our curated collection of premium home and lifestyle products.", keywords: "products, home decor, furniture, lifestyle" }), fallback: <PageSkeleton type="list" /> },
    { path: "/product/:productId", element: withSEO(pages.product, { title: "Product Details - LuxeHome", description: "View detailed information about our premium products.", type: "product" }), fallback: <PageSkeleton type="product" /> },
    { path: "/cart", element: withSEO(pages.cart, { title: "Shopping Cart - LuxeHome", description: "Review your selected items before checkout.", noindex: true }), fallback: <LoadingSpinner text="Loading cart..." /> },
    { path: "/checkout", element: withSEO(pages.checkout, { title: "Checkout - LuxeHome", description: "Complete your purchase securely.", noindex: true }), fallback: <LoadingSpinner text="Loading checkout..." /> },
    { path: "/account", element: withSEO(pages.account, { title: "My Account - LuxeHome", description: "Manage your account and order history.", noindex: true }), fallback: <PageSkeleton type="account" /> },
    { path: "/login", element: <pages.login />, fallback: <LoadingSpinner text="Loading login..." />, layout: false },
    { path: "/register", element: <pages.register />, fallback: <LoadingSpinner text="Loading registration..." />, layout: false },
    { path: "/orders/:orderId", element: <pages.tracking />, fallback: <LoadingSpinner text="Loading order..." /> },
    { path: "/wishlist", element: <pages.wishlist />, fallback: <LoadingSpinner text="Loading wishlist..." /> },
    { path: "*", element: <pages.notFound />, fallback: <LoadingSpinner text="Page not found..." /> },
  ], []);
};
