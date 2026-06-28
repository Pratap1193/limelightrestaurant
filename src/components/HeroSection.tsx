import React from 'react';
import { HeroContent } from '../types';
import { ChevronDown, Calendar, Utensils } from 'lucide-react';

interface HeroSectionProps {
  hero: HeroContent;
  onBookTableClick: () => void;
  onViewMenuClick: () => void;
}

export default function HeroSection({ hero, onBookTableClick, onViewMenuClick }: HeroSectionProps) {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={hero.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85"}
          alt="Limelight Fine Dining Banner"
          className="w-full h-full object-cover scale-105 filter brightness-65 transition-all duration-1000"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85";
          }}
        />
        {/* Elegant pink-accented charcoal gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-neutral-950/40"></div>
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-pink-950/20"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 flex flex-col items-center">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 font-sans font-medium text-xs tracking-wider uppercase mb-6 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
          Fine Dining & Luxury Hospitality in Haridwar
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6 drop-shadow-md">
          {hero.title || "Limelight Restaurant"}
        </h1>
        
        <p className="font-sans text-neutral-300 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mb-10 text-glow">
          {hero.subtitle || "Experience luxury fine dining in Haridwar with exquisite multi-cuisine delicacies, elegant pink-infused interiors, and royal hospitality."}
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-md">
          <button
            onClick={onBookTableClick}
            className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full shadow-lg shadow-pink-600/20 hover:shadow-pink-600/45 transition-all duration-300 cursor-pointer overflow-hidden text-sm tracking-wider uppercase"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <Calendar size={16} />
            <span>{hero.ctaText || "Book a Table"}</span>
          </button>

          <button
            onClick={onViewMenuClick}
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-pink-300/40 font-semibold rounded-full transition-all duration-300 backdrop-blur-sm text-sm tracking-wider uppercase cursor-pointer"
          >
            <Utensils size={16} className="text-pink-400 group-hover:scale-110 transition-transform" />
            <span>{hero.ctaTextSecondary || "View Menu"}</span>
          </button>
        </div>
      </div>

      {/* Floating scroll down indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 animate-bounce cursor-pointer opacity-70 hover:opacity-100" 
        onClick={onViewMenuClick}
      >
        <span className="text-white text-[10px] uppercase font-mono tracking-widest">Explore</span>
        <ChevronDown size={14} className="text-pink-400" />
      </div>
    </div>
  );
}
