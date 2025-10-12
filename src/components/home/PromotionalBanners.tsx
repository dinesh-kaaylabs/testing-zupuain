import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  gradient: string;
  icon: string;
}

const banners: Banner[] = [
  {
    id: 1,
    title: 'Free Shipping',
    subtitle: 'On orders over $50',
    ctaText: 'Shop Now',
    ctaLink: '/products',
    gradient: 'from-blue-500 to-blue-700',
    icon: 'truck',
  },
  {
    id: 2,
    title: 'Member Exclusive',
    subtitle: 'Extra 15% off on first order',
    ctaText: 'Join Now',
    ctaLink: '/register',
    gradient: 'from-purple-500 to-purple-700',
    icon: 'star',
  },
];

const iconMap: Record<string, React.ReactNode> = {
  truck: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  star: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

const PromotionalBanners: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${banner.gradient} p-8 md:p-10 text-white group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105`}
              onClick={() => navigate(banner.ctaLink)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(banner.ctaLink)}
            >
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  {/* Icon */}
                  <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    {iconMap[banner.icon]}
                  </div>

                  {/* Text */}
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {banner.title}
                  </h3>
                  <p className="text-white/90 text-lg mb-6">
                    {banner.subtitle}
                  </p>

                  {/* CTA Button */}
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-lg transform hover:translate-x-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(banner.ctaLink);
                    }}
                  >
                    {banner.ctaText}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>

                {/* Decorative Element */}
                <div className="hidden lg:block ml-8">
                  <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-12">
                    <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                      {iconMap[banner.icon]}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;

