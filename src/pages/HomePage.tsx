import React from 'react';
import SEOHead from '../components/common/SEOHead';
import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import PromotionalBanners from '../components/home/PromotionalBanners';
import BestSellers from '../components/home/BestSellers';
import Testimonials from '../components/home/Testimonials';
import NewsletterSignup from '../components/home/NewsletterSignup';

const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Home - LuxeHome | Premium Home & Lifestyle Products"
        description="Discover premium home decor, furniture, and lifestyle products at LuxeHome. Quality craftsmanship meets modern design. Shop featured products, best sellers, and exclusive deals."
        keywords="home decor, furniture, lifestyle, premium, luxury, design, featured products, best sellers, home improvement"
        type="website"
      />
      
      <main className="min-h-screen">
        {/* Hero Section with 3-slide carousel */}
        <HeroSection />

        {/* Featured Categories - 6 category cards in responsive grid */}
        <FeaturedCategories />

        {/* Featured Products - Horizontal scroll with 8+ products */}
        <FeaturedProducts />

        {/* Promotional Banners - 2 banners side-by-side */}
        <PromotionalBanners />

        {/* Best Sellers - Horizontal scroll with rank badges */}
        <BestSellers />

        {/* Testimonials - 3 customer reviews with trust indicators */}
        <Testimonials />

        {/* Newsletter Signup - Email validation with incentive */}
        <NewsletterSignup />
      </main>
    </>
  );
};

export default HomePage;
