import React from 'react';
import { WhyChooseUsItem } from '../types';
import * as Icons from 'lucide-react';

interface WhyChooseUsSectionProps {
  items: WhyChooseUsItem[];
}

export default function WhyChooseUsSection({ items }: WhyChooseUsSectionProps) {
  // Resolve icons dynamically from lucide-react safely
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-6 h-6 text-pink-600" />;
    }
    return <Icons.Sparkles className="w-6 h-6 text-pink-600" />;
  };

  return (
    <section id="why-choose-us" className="py-24 bg-neutral-50 border-y border-pink-100/30 relative overflow-hidden">
      {/* Pink blush background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-pink-100/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/50 border border-pink-200 text-pink-700 font-sans font-medium text-xs tracking-wider uppercase mb-3">
            <Icons.Heart size={12} className="fill-pink-700/10" />
            Designed For Memorable Dinings
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Why Dine at Limelight?
          </h2>
          <div className="w-12 h-1 bg-pink-600 mx-auto rounded-full mb-4"></div>
          <p className="font-sans text-neutral-600 text-sm sm:text-base font-light">
            We hold ourselves to a standard of impeccable hospitality, beautiful aesthetics, and pristine culinary perfection.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white p-8 rounded-3xl border border-pink-100/30 shadow-md shadow-pink-500/5 hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-200 transition-all duration-300 flex flex-col items-start"
            >
              <div className="p-4 bg-pink-50 rounded-2xl mb-6 group-hover:bg-pink-100 transition-all duration-300">
                {renderIcon(item.iconName)}
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 mb-3 group-hover:text-pink-600 transition-colors">
                {item.title}
              </h3>
              <p className="font-sans text-sm text-neutral-600 leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
