import React, { useState } from 'react';
import { MenuItem, MenuCategory } from '../types';
import { Search, Sparkles, Award, Flame } from 'lucide-react';

interface MenuSectionProps {
  menu: MenuItem[];
  categories: MenuCategory[];
}

export default function MenuSection({ menu, categories }: MenuSectionProps) {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Settle active list of categories
  const categoryTabs = [{ id: 'all', name: 'All Platters', slug: 'all' }, ...categories];

  // Identify Chef's Signatures (e.g. first 3 items or items that look extra special)
  const signatureDishes = menu.slice(0, 3);

  // Filter items
  const filteredItems = menu.filter((item) => {
    const matchesCategory = activeCategorySlug === 'all' || item.categorySlug === activeCategorySlug;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (slug: string) => {
    const found = categories.find(c => c.slug === slug);
    return found ? found.name : slug;
  };

  return (
    <section id="menu" className="py-24 bg-pink-50/20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-100/30 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 font-sans font-medium text-xs tracking-wider uppercase mb-3">
            <Sparkles size={12} />
            The Limelight Gastronomy
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Our Exquisite Menu
          </h2>
          <div className="w-12 h-1 bg-pink-500 mx-auto rounded-full mb-4"></div>
          <p className="font-sans text-neutral-600 text-sm sm:text-base font-light">
            Each recipe at Limelight is curated to evoke memory, marry global techniques, and showcase elegant, rose-infused plating.
          </p>
        </div>

        {/* CHEF SIGNATURE DISHES BLOCK */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Award className="text-pink-600 animate-pulse" size={20} />
            <h3 className="font-serif text-2xl font-bold text-neutral-900">Chef’s Signature Dishes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureDishes.map((item) => (
              <div 
                key={`sig-${item.id}`}
                className="bg-white rounded-3xl border border-pink-100/60 p-5 flex gap-4 items-center shadow-md hover:shadow-lg transition-all relative overflow-hidden group"
              >
                {/* Visual marker ribbon */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                  <div className="bg-pink-600 text-white font-mono text-[9px] font-bold uppercase tracking-widest text-center py-1 absolute transform rotate-45 top-3 -right-5 w-20 shadow-sm">
                    Sig
                  </div>
                </div>

                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-pink-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
                  }}
                />
                
                <div className="text-left pr-4">
                  {/* Veg Indicator */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-3.5 h-3.5 border flex items-center justify-center rounded p-0.5 ${
                      item.isVeg ? 'border-green-600' : 'border-rose-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.isVeg ? 'bg-green-600' : 'bg-rose-600'
                      }`}></div>
                    </div>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Signature Favorite
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm sm:text-base text-neutral-900 group-hover:text-pink-600 transition-colors">
                    {item.name}
                  </h4>
                  <p className="font-sans text-neutral-500 text-xs font-light line-clamp-1 mb-1.5">{item.description}</p>
                  <span className="font-sans text-xs font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100/50">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-pink-100 pb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeCategorySlug === cat.slug
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-500/25 scale-105'
                    : 'bg-white text-neutral-600 hover:bg-pink-50 border border-pink-100/50 hover:text-pink-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-sm w-full mx-auto md:mx-0">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-sm placeholder:text-neutral-400 text-neutral-800"
            />
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl overflow-hidden border border-pink-100/40 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group h-full relative ${
                  !item.isAvailable ? 'opacity-75' : ''
                }`}
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  
                  {/* Status Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-pink-600 font-sans font-semibold text-[10px] rounded-full uppercase tracking-wider shadow-sm border border-pink-100">
                      {getCategoryName(item.categorySlug)}
                    </span>
                    {!item.isAvailable && (
                      <span className="px-3 py-1 bg-neutral-900/90 text-white font-sans font-semibold text-[10px] rounded-full uppercase tracking-wider shadow-sm">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Veg / Non-veg marker over image */}
                  <div className="absolute top-4 right-4 p-1.5 bg-white/95 rounded-xl shadow-md border border-neutral-100 flex items-center justify-center">
                    <div className={`w-4 h-4 border flex items-center justify-center rounded p-0.5 ${
                      item.isVeg ? 'border-green-600' : 'border-rose-600'
                    }`} title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}>
                      <div className={`w-2 h-2 rounded-full ${
                        item.isVeg ? 'bg-green-600' : 'bg-rose-600'
                      }`}></div>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="text-left">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="font-serif text-lg font-bold text-neutral-950 group-hover:text-pink-600 transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-sans font-semibold text-lg text-pink-600 whitespace-nowrap bg-pink-50/80 px-2.5 py-0.5 rounded-lg border border-pink-100/50">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="font-sans text-neutral-600 text-sm font-light leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-pink-50 flex items-center justify-between text-xs font-medium text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-rose-500'}`}></span>
                      {item.isAvailable ? 'Freshly Prepared' : 'Unavailable Today'}
                    </span>
                    <span className="font-mono uppercase tracking-widest text-[9px]">
                      {item.isVeg ? 'Pure Veg' : 'Non-Veg Option'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-pink-100/30 p-8">
            <p className="text-neutral-500 text-lg mb-2">No menu items found</p>
            <p className="text-neutral-400 text-sm max-w-md mx-auto">
              Try adjusting your category selection or search query to find dishes.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
