/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Utensils } from 'lucide-react';

interface HeroSliderProps {
  bannerImages: string[];
  onBookNow: () => void;
  onExploreMenu: () => void;
}

export default function HeroSlider({ bannerImages, onBookNow, onExploreMenu }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const slidesInfo = [
    {
      title: 'Gastronomy Meets Luxury',
      subtitle: 'LIMELIGHT SPECIALS',
      description: 'Enter a world of high-end culinary creation and sensory design, tailored perfectly in our signature pink-themed salon.',
    },
    {
      title: 'A Culinary Spotlight',
      subtitle: 'CHEF SPECIAL DISHES',
      description: 'Taste the brilliance of masterfully crafted Indian, Chinese, and Continental fusion delicacies under custom ambient lights.',
    },
    {
      title: 'Moments to Remember',
      subtitle: 'EXCLUSIVE SOCIALS & EVENTS',
      description: 'From live music ensembles to high-octane DJ nights, find your perfect weekend spot at Limelight Restaurant.',
    },
  ];

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [bannerImages]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % bannerImages.length);
  };

  if (!bannerImages || bannerImages.length === 0) {
    return <div className="h-[75vh] bg-neutral-900 flex items-center justify-center text-white">Loading Banners...</div>;
  }

  return (
    <div className="relative h-[85vh] sm:h-[80vh] md:h-[85vh] w-full overflow-hidden bg-black" id="hero-slider">
      {/* Slides track */}
      <div className="absolute inset-0 w-full h-full">
        {bannerImages.map((image, index) => {
          const info = slidesInfo[index % slidesInfo.length];
          return (
            <div
              key={index}
              id={`hero-slide-${index}`}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === current ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
              } transform duration-1000`}
            >
              {/* Backing image with elegant gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/30 z-10" />
              <img
                src={image}
                alt={`Limelight Slide ${index + 1}`}
                className="w-full h-full object-cover object-center"
                loading="eager"
              />

              {/* Text content card overlay */}
              <div className="absolute inset-0 z-20 flex items-center px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
                <div className="max-w-2xl text-left text-white space-y-6 fade-in-up">
                  <span className="inline-block px-3 py-1 bg-brand text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                    {info.subtitle}
                  </span>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none">
                    {info.title.split(' ').map((word, i) => (
                      <span key={i} className={word.toLowerCase() === 'luxury' || word.toLowerCase() === 'spotlight' ? 'text-brand block sm:inline' : ''}>
                        {word}{' '}
                      </span>
                    ))}
                  </h1>

                  <p className="text-gray-300 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-xl">
                    {info.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={onBookNow}
                      id={`slide-${index}-book-btn`}
                      className="px-8 py-3.5 bg-brand text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black hover:border-white border border-brand transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer glow-btn"
                    >
                      <Calendar size={14} />
                      <span>Book A Table</span>
                    </button>
                    
                    <button
                      onClick={onExploreMenu}
                      id={`slide-${index}-menu-btn`}
                      className="px-8 py-3.5 bg-transparent text-white font-bold text-xs uppercase tracking-widest hover:bg-brand hover:border-brand border border-white/40 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Utensils size={14} />
                      <span>Explore Our Menu</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Navigation controls */}
      {bannerImages.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            id="hero-slider-prev"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 border border-white/10 hover:border-brand text-white flex items-center justify-center hover:bg-brand transition-all duration-200 cursor-pointer"
            aria-label="Previous banner"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={handleNext}
            id="hero-slider-next"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 border border-white/10 hover:border-brand text-white flex items-center justify-center hover:bg-brand transition-all duration-200 cursor-pointer"
            aria-label="Next banner"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slider indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2.5">
            {bannerImages.map((_, idx) => (
              <button
                key={idx}
                id={`hero-dot-${idx}`}
                onClick={() => setCurrent(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current ? 'w-8 bg-brand' : 'w-2.5 bg-white/40'
                }`}
                aria-label={`Go to banner slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
