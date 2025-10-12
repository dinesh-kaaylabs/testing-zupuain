import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Slide {
  id: number;
  image: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryLink: string;
  ctaSecondaryLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&h=600&fit=crop',
    headline: 'Transform Your Living Space',
    subheadline: 'Discover premium furniture and decor for every room',
    ctaPrimary: 'Shop Now',
    ctaSecondary: 'View Collection',
    ctaPrimaryLink: '/products',
    ctaSecondaryLink: '/products?category=furniture',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1920&h=600&fit=crop',
    headline: 'New Season Collection',
    subheadline: 'Fresh designs and trending styles just arrived',
    ctaPrimary: 'Explore New',
    ctaSecondary: 'Best Sellers',
    ctaPrimaryLink: '/products?filter=new',
    ctaSecondaryLink: '/products?filter=bestsellers',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1920&h=600&fit=crop',
    headline: 'Up to 50% Off',
    subheadline: 'Limited time offers on selected items',
    ctaPrimary: 'Shop Sale',
    ctaSecondary: 'Learn More',
    ctaPrimaryLink: '/products?filter=sale',
    ctaSecondaryLink: '/about',
  },
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <section 
      className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero Carousel"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== currentSlide}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-in-left">
                  {slide.headline}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 animate-slide-in-left animation-delay-200">
                  {slide.subheadline}
                </p>
                <div className="flex flex-wrap gap-4 animate-slide-in-left animation-delay-400">
                  <button
                    onClick={() => navigate(slide.ctaPrimaryLink)}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    aria-label={slide.ctaPrimary}
                  >
                    {slide.ctaPrimary}
                  </button>
                  <button
                    onClick={() => navigate(slide.ctaSecondaryLink)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-300 border border-white/30 hover:border-white/50"
                    aria-label={slide.ctaSecondary}
                  >
                    {slide.ctaSecondary}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 border border-white/30 hover:border-white/50 z-10"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 border border-white/30 hover:border-white/50 z-10"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-12 h-3 bg-white' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

