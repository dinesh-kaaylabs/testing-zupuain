import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useAppSelector } from '../../hooks';
import ThemeToggle from '../ui/ThemeToggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { totalItems } = useAppSelector((state) => state.cart);
  const { wishlistItems } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { defaultTenant } = useAppSelector((state) => state.tenant);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img
              src={defaultTenant?.setting?.brand_logo || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=40&h=40&fit=crop&crop=center"}
              alt="LuxeHome"
              className="h-8 w-8 lg:h-10 lg:w-10 rounded-lg object-cover"
            />
            <span className="text-xl lg:text-2xl font-bold text-primary">LuxeHome</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-text hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-textSecondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-text hover:text-primary transition-colors"
              aria-label={`Wishlist (${wishlistItems.length} items)`}
            >
              <Heart className="h-6 w-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-text hover:text-primary transition-colors"
              aria-label={`Shopping cart (${totalItems} items)`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="flex items-center space-x-2 p-2 text-text hover:text-primary transition-colors"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden lg:inline text-sm font-medium">
                    {user?.user_name || 'Account'}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-text hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-textSecondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-border">
          <div className="px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-text hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
