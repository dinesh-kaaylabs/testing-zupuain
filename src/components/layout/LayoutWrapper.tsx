import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className = ""
}) => (
  <div className={`min-h-screen w-full bg-gray-50 dark:bg-dark-900 transition-colors duration-300 ${className}`}>
    {showHeader && <Header />}
    <main className={showHeader ? "pt-16 lg:pt-20" : ""} role="main">{children}</main>
    {showFooter && <Footer />}
  </div>
);

export default LayoutWrapper;
