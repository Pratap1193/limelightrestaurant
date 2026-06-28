import React from 'react';
import { AboutSection as AboutType } from '../types';
import { ChefHat, Award, Leaf, Users2, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  about: AboutType;
  onBookClick: () => void;
}

export default function AboutSection({ about, onBookClick }: AboutSectionProps) {
  // Map icons helper based on labels
  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'master chefs':
        return <ChefHat className="text-pink-500 w-5 h-5" />;
      case 'delighted guests':
        return <Users2 className="text-pink-500 w-5 h-5" />;
      case 'signature dishes':
        return <Sparkles className="text-pink-500 w-5 h-5" />;
      default:
        return <Award className="text-pink-500 w-5 h-5" />;
    }
  };

  return (
    <section id="about" className="py-24 bg-white text-neutral-900 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-50/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Images Grid */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-pink-100">
              <img
                src={about.imageUrl || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"}
                alt="Limelight Fine Dining Ambiance"
                className="w-full object-cover aspect-4/5 hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Float Badge */}
            <div className="absolute -bottom-6 -right-6 bg-pink-600 text-white rounded-2xl p-6 shadow-xl border border-pink-500/30 max-w-xs animate-in slide-in-from-bottom duration-500">
              <p className="font-serif text-lg font-bold">Haridwar's Finest</p>
              <p className="font-sans text-xs text-pink-100 mt-1">Voted Best Luxury Family Restaurant of Uttarakhand for multi-cuisine dining.</p>
            </div>
          </div>

          {/* Right Side: Text & Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-600 font-sans font-medium text-xs tracking-wider uppercase mb-5 self-start">
              <Sparkles size={12} className="animate-spin duration-3000" />
              Our Culinary Journey
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-2">
              {about.title}
            </h2>
            <h3 className="font-sans text-pink-600 font-medium text-base sm:text-lg mb-6">
              {about.subtitle}
            </h3>

            <div className="w-16 h-1 bg-pink-600 rounded-full mb-6"></div>

            <p className="font-sans text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 font-light whitespace-pre-line">
              {about.story}
            </p>

            {/* Features bullet checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {about.features.map((feat, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-pink-100 text-pink-600 mt-0.5">
                    <Leaf size={12} className="fill-pink-600/10" />
                  </div>
                  <span className="font-sans text-sm text-neutral-700 font-medium">{feat}</span>
                </div>
              ))}
            </div>

            {/* Stats list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-pink-50/50 rounded-3xl p-6 border border-pink-100/50">
              {about.stats.map((stat, i) => (
                <div key={i} className="text-center sm:text-left flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-1.5 mb-1">
                    {getIcon(stat.label)}
                    <span className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <span className="font-sans text-[11px] font-semibold text-neutral-500 uppercase tracking-widest leading-none">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Trigger scroll to table booking */}
            <div className="mt-8 self-start">
              <button
                onClick={onBookClick}
                className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-sans font-semibold text-sm rounded-full shadow-lg shadow-pink-600/10 hover:shadow-pink-600/30 transition-all uppercase tracking-wider cursor-pointer"
              >
                Plan Your Celebration
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
