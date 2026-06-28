/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Utensils, Image as ImageIcon, Phone, Mail, MapPin, Clock, Search, Eye, Plus, ArrowRight, User, Heart, MessageSquare, Shield, CheckCircle2, Star, Sparkles, Folder, FolderPlus, Trash2, Edit3, X } from 'lucide-react';
import { DatabaseState, MenuItem, Booking, GalleryFolder, GalleryImage, RestaurantEvent, CustomerReview, MenuCategory } from '../types/database';
import ReviewsSection from '../components/ReviewsSection';
import HeroSlider from '../components/HeroSlider';
import { submitToNetlify, triggerWhatsAppMessage, sendFormEmail } from '../utils/netlify';

interface PageProps {
  db: DatabaseState;
  setCurrentPage: (page: string) => void;
  // Booking prefill callback
  bookingPrefill?: { occasion: string; text?: string } | null;
  setBookingPrefill?: (prefill: any) => void;
  onBookNow?: () => void;
  setDb?: (state: DatabaseState) => void;
}

// Helper to format currency based on currency settings
export function formatPrice(price: number, websiteSettings: any) {
  const symbol = websiteSettings?.currencySymbol || '₹';
  const position = websiteSettings?.currencyPosition || 'before';
  const formattedPrice = Number.isInteger(price) ? price : price.toFixed(2);
  
  if (position === 'after') {
    return `${formattedPrice}${symbol}`;
  }
  return `${symbol}${formattedPrice}`;
}

// ==========================================
// 1. HOME PAGE
// ==========================================
export function HomePage({ db, setCurrentPage, onBookNow }: PageProps) {
  const { menuItems, events, reviews, websiteSettings, contactSettings } = db;
  const [readingBlog, setReadingBlog] = useState<any>(null);

  // Get featured chef specials
  const chefSpecials = menuItems.filter(item => item.isChefSpecial && item.isAvailable).slice(0, 4);

  const activeOffers = useMemo(() => {
    if (db.offers && db.offers.filter(o => o.isActive).length > 0) {
      return db.offers.filter(o => o.isActive).map(o => ({
        title: o.title,
        discount: o.discountPercentage > 0 ? `${o.discountPercentage}% Off Total Bill (Code: ${o.promoCode})` : `Special Campaign (Code: ${o.promoCode})`,
        terms: `${o.description}. Expiry date: ${o.expiryDate}.`
      }));
    }
    return [
      {
        title: 'Romantic Sunset Date Night',
        discount: 'Complimentary Dessert & Welcome Drinks',
        terms: 'Applicable for tables booked between 5 PM - 7 PM, Monday through Thursday.'
      },
      {
        title: 'Grand Family Feast Package',
        discount: '15% Off Total Menu Bill',
        terms: 'Applicable on bookings of 8 or more guests on weekends.'
      }
    ];
  }, [db.offers]);

  return (
    <div id="home-page" className="fade-in-up">
      {/* Hero Slider */}
      <HeroSlider
        bannerImages={websiteSettings.bannerImages}
        onBookNow={() => {
          if (onBookNow) onBookNow();
        }}
        onExploreMenu={() => setCurrentPage('menu')}
      />

      {/* Welcome & About Brief Section */}
      <section className="py-24 bg-black text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-brand" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-brand" />
              <img
                src={websiteSettings.bannerImages[1]}
                alt="Limelight Ambiance"
                className="w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="space-y-6">
              <span className="text-brand font-bold tracking-widest text-xs uppercase block border-l-2 border-brand pl-3">
                WELCOME TO LUXURY
              </span>
              <h2 className="text-4xl font-black uppercase tracking-tight">
                About Limelight Restaurant
              </h2>
              <p className="text-gray-300 leading-relaxed font-light">
                Limelight is not just a place to dine; it is a masterpiece of hospitality design. Conceived as an immersive haven where fine culinary crafts fuse with breathtaking pink-themed aesthetics, we set the absolute stage for memorable encounters.
              </p>
              <p className="text-gray-400 leading-relaxed font-light text-sm">
                Every dish is a canvas, curated with freshest ingredients and organic spices. Led by an award-winning culinary ensemble, we specialize in luxury Indian, Continental, and Chinese cuisine tailored for gastronomes who recognize perfection.
              </p>
              <div className="pt-4 flex space-x-6">
                <div>
                  <h4 className="text-brand font-black text-3xl">10+</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Signature Cuisines</p>
                </div>
                <div className="border-r border-white/15" />
                <div>
                  <h4 className="text-brand font-black text-3xl">14K+</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Satisfied Diners</p>
                </div>
                <div className="border-r border-white/15" />
                <div>
                  <h4 className="text-brand font-black text-3xl">4.9</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Guest Rating</p>
                </div>
              </div>
              <div className="pt-6">
                <button
                  onClick={() => setCurrentPage('about')}
                  className="px-6 py-3 border border-brand text-white text-xs uppercase font-bold tracking-widest hover:bg-brand transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Our Complete Story</span>
                  <ArrowRight size={14} className="text-brand group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Specialties Section */}
      <section className="py-20 bg-neutral-950 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-brand font-bold tracking-widest text-xs uppercase block">
              CHEF RECOMMENDATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Limelight Chef Specials
            </h2>
            <div className="w-16 h-1 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {chefSpecials.map((item) => (
              <div
                key={item.id}
                className="bg-black/40 border border-white/10 group hover:border-brand/50 transition-all duration-300 relative flex flex-col justify-between"
              >
                <div className="relative overflow-hidden h-64">
                  <span className="absolute top-3 left-3 z-20 px-2 py-1 bg-brand text-white font-black text-[9px] uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles size={8} className="fill-white" />
                    <span>Specialty</span>
                  </span>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white font-bold text-base tracking-wide uppercase line-clamp-1">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed font-light line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-brand font-extrabold text-lg">{formatPrice(item.price, db.websiteSettings)}</span>
                    <button
                      onClick={() => {
                        if (onBookNow) onBookNow();
                      }}
                      className="text-[10px] text-gray-300 hover:text-brand uppercase font-bold tracking-widest transition-colors cursor-pointer"
                    >
                      Order at Table
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setCurrentPage('menu')}
              className="px-8 py-3.5 bg-brand text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              See All Culinary Works
            </button>
          </div>
        </div>
      </section>

      {/* Offers & Promotions Panel */}
      <section className="py-20 bg-black text-white relative border-t border-white/10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-10 rounded-full filter blur-[150px] -z-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <span className="text-brand font-bold tracking-widest text-xs uppercase block">
              VIP EXPERIENCES
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight">
              Exclusive Promos & Offers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeOffers.map((offer, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 p-8 border-l-4 border-brand border border-white/5 space-y-4 hover:scale-102 transition-transform duration-300"
              >
                <h3 className="text-lg font-black uppercase tracking-wide text-brand">
                  {offer.title}
                </h3>
                <p className="text-white font-semibold text-sm">
                  {offer.discount}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed font-light">
                  {offer.terms}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onBookNow) onBookNow();
                    }}
                    className="text-[10px] text-brand uppercase font-bold tracking-wider hover:text-white transition-colors cursor-pointer"
                  >
                    Claim Slot Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Quick Peek */}
      <section className="py-20 bg-neutral-950 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-3">
              <span className="text-brand font-bold tracking-widest text-xs uppercase block border-l-2 border-brand pl-3">
                LIVELY EVENINGS
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight">
                Weekend Socials
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('events')}
              className="mt-4 md:mt-0 text-xs font-bold uppercase text-brand hover:text-white transition-colors tracking-widest cursor-pointer"
            >
              See All Social Calendar →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.slice(0, 3).map((ev) => (
              <div key={ev.id} className="relative group overflow-hidden h-80 border border-white/10">
                <img
                  src={ev.imageUrl}
                  alt={ev.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 filter brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                  <span className="text-[10px] font-bold text-brand uppercase tracking-widest">{ev.date}</span>
                  <h3 className="text-lg font-black uppercase tracking-wide text-white">{ev.title}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Blog/Gastronomy Stories Section */}
      <section className="py-20 bg-black text-white relative border-t border-white/10" id="home-blog-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-brand font-bold tracking-widest text-xs uppercase block">
              CHEF JOURNAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Gourmet Kitchen secrets
            </h2>
            <div className="w-16 h-1 bg-brand mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(db.blogs || []).filter(b => b.isPublished).slice(0, 3).map((blog) => (
              <div key={blog.id} className="bg-neutral-950 border border-white/5 flex flex-col group h-full">
                <div className="aspect-video w-full overflow-hidden bg-neutral-900 relative">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 border border-brand/20 text-brand text-[9px] uppercase font-bold tracking-widest">
                    {blog.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-gray-500 font-mono block">
                      {new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                    <h3 className="text-white font-bold text-base tracking-wide uppercase group-hover:text-brand transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-light line-clamp-3">
                      {blog.content}
                    </p>
                  </div>
                  <button
                    onClick={() => setReadingBlog(blog)}
                    className="text-[10px] text-brand uppercase font-extrabold tracking-widest hover:text-white transition-colors text-left mt-4 inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            ))}
            {((db.blogs || []).filter(b => b.isPublished).length === 0) && (
              <div className="col-span-full py-12 text-center text-gray-500 uppercase tracking-widest font-black text-xs border border-dashed border-white/10">
                No articles published yet. Visit the Admin Panel to write your first gourmet story!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Reader Modal */}
      {readingBlog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
          <div className="bg-neutral-950 border border-white/10 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative text-xs text-white" id="blog-reader-modal">
            <div className="aspect-video w-full overflow-hidden bg-neutral-900 relative">
              <img
                src={readingBlog.imageUrl}
                alt={readingBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <button
                onClick={() => setReadingBlog(null)}
                className="absolute top-4 right-4 p-2 bg-black/80 hover:bg-brand text-white transition-colors"
                title="Close Reader"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="px-2.5 py-1 bg-brand text-white text-[9px] uppercase font-bold tracking-widest">
                  {readingBlog.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mt-3 text-white">
                  {readingBlog.title}
                </h2>
              </div>
            </div>
            
            <div className="p-8 space-y-6 text-sm leading-relaxed text-gray-300 font-light">
              <div className="flex items-center space-x-2 text-gray-500 text-xs font-mono pb-4 border-b border-white/5">
                <User size={12} className="text-brand" />
                <span>By Executive Chef, Limelight</span>
                <span>•</span>
                <span>{new Date(readingBlog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed">
                {readingBlog.content}
              </p>
              
              <div className="pt-6 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => setReadingBlog(null)}
                  className="px-6 py-2.5 bg-brand text-white text-xs uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Reviews Live Hook */}
      <ReviewsSection
        reviews={reviews}
        onSubmitReview={(name, text, rating) => {
          // Push to simulated reviews queue
          const newReview: CustomerReview = {
            id: `rev-${Date.now()}`,
            guestName: name,
            reviewText: text,
            rating: rating,
            status: 'Pending', // Sent for moderation!
            createdAt: new Date().toISOString()
          };
          reviews.push(newReview);
          // Save back is handled by state callback in parent App.tsx
        }}
      />
    </div>
  );
}

// ==========================================
// 2. ABOUT US PAGE
// ==========================================
export function AboutPage({ db }: PageProps) {
  const { websiteSettings } = db;
  
  const highlights = [
    { title: 'Signature Cocktails', desc: 'Crafted cocktails matching our signature velvet theme colors.', icon: <Sparkles className="text-brand" size={24} /> },
    { title: 'Valet Parking', desc: 'Secure parking facilities managed seamlessly for all guests.', icon: <CheckCircle2 className="text-brand" size={24} /> },
    { title: 'Private Dining Salon', desc: 'Exclusive lounges available for intimate meetings or social gatherings.', icon: <Heart className="text-brand" size={24} /> },
    { title: 'Sustainably Sourced', desc: 'Using 100% locally produced, organic vegetables and spices.', icon: <Utensils className="text-brand" size={24} /> }
  ];

  const chefs = [
    { name: 'Chef Jean-Pierre Laurent', role: 'Executive Chef & Culinary Designer', desc: 'Classically trained in Paris, Chef Laurent brings 15+ years of Michelin-starred expertise to the Limelight kitchen.', img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Ananya Sharma', role: 'Head of Indian Cuisine Craft', desc: 'Known for her modern play on traditional Mughlai dishes, blending modern elements with authentic hand-ground spices.', img: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="py-16 bg-black text-white fade-in-up" id="about-us-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Intro Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <span className="text-brand font-bold tracking-widest text-xs uppercase block border-l-2 border-brand pl-3">
              THE VISION & LEGACY
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight">
              Our Culinary Odyssey
            </h2>
            <p className="text-gray-300 leading-relaxed font-light">
              Limelight Restaurant was established in the pursuit of combining fine-dining perfection with outstanding design. Set on a foundation of luxury, we strive to build custom spaces where culinary masterstrokes meet eye-catching pink visual palettes.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm font-light">
              We operate under the philosophy that dining is an active theatrical performance. From the choice of lighting, the customized music loops, down to the pink accents on our bespoke dinnerware, every moment is handpicked to cast a delightful limelight over our guests.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80"
              alt="Culinary Preparation"
              className="w-full h-96 object-cover border border-white/10"
            />
          </div>
        </div>

        {/* Vision & Mission Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 bg-neutral-950 p-12 border border-white/10">
          <div className="space-y-3">
            <h3 className="text-2xl font-black uppercase text-brand tracking-wide">
              Our Mission
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              To host exceptional gastronomic gatherings where visual excellence meets culinary depth. We aim to elevate fine dining to an art form, engaging all five senses in an environment of pink-accented luxury and premium social curation.
            </p>
          </div>
          <div className="space-y-3 border-t md:border-t-0 md:border-l border-white/15 pt-8 md:pt-0 md:pl-12">
            <h3 className="text-2xl font-black uppercase text-brand tracking-wide">
              Our Vision
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              To be globally recognized as a leading innovator in curated dining concepts. We strive to set new benchmarks for thematic dining, proving that exceptional hospitality, visually breathtaking designs, and world-class menus can exist in gorgeous harmony.
            </p>
          </div>
        </div>

        {/* Bento Grid Highlights */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black uppercase tracking-wide text-white">
              Restaurant Highlights
            </h3>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">A glimpse into our luxurious amenities</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((h, i) => (
              <div key={i} className="bg-black/40 p-6 border border-white/10 hover:border-brand/30 transition-all duration-200 space-y-4">
                <div className="w-12 h-12 bg-brand-10 rounded-full border border-brand/20 flex items-center justify-center">
                  {h.icon}
                </div>
                <h4 className="text-white font-bold text-base uppercase tracking-wide">{h.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed font-light">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Ensemble */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black uppercase tracking-wide text-white">
              The Culinary Artists
            </h3>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">The masterminds behind our award-winning menu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {chefs.map((c, idx) => (
              <div key={idx} className="bg-neutral-950 border border-white/5 overflow-hidden group hover:border-brand/30 transition-all duration-300">
                <div className="h-80 overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 space-y-3">
                  <h4 className="text-white font-bold text-lg tracking-wide">{c.name}</h4>
                  <span className="text-brand font-semibold text-xs uppercase tracking-widest block">{c.role}</span>
                  <p className="text-gray-400 text-xs leading-relaxed font-light pt-2">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. FOOD MENU PAGE
// ==========================================
export function MenuPage({ db, onBookNow }: PageProps) {
  const { menuItems, menuCategories } = db;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeImages, setActiveImages] = useState<Record<string, string>>({});

  // Dynamically obtain sorted categories
  const categoriesList = useMemo(() => {
    const cats = [...(menuCategories || [])].sort((a, b) => a.displayOrder - b.displayOrder);
    return ['All', ...cats.map(c => c.name)];
  }, [menuCategories]);

  // Sort menuItems by displayOrder (ascending), then by name
  const sortedItems = useMemo(() => {
    return [...menuItems].sort((a, b) => {
      const orderA = a.displayOrder ?? 999;
      const orderB = b.displayOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }, [menuItems]);

  const filteredItems = sortedItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.subcategory && item.subcategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-16 bg-black text-white fade-in-up" id="food-menu-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-brand font-bold tracking-widest text-xs uppercase block">
            ARTISAN DISHES
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tight">
            Our Fine Gastronomy Menu
          </h2>
          <div className="w-16 h-1 bg-brand mx-auto" />
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Filter our premium creations by category, or search for your favorite signature delicacies.
          </p>
        </div>

        {/* Search & Category Filter bar */}
        <div className="space-y-6 mb-12">
          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search dishes, ingredients, tags, spicy level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 text-white pl-12 pr-4 py-3 text-sm rounded-none focus:outline-none focus:border-brand"
            />
          </div>

          {/* Horizontal sliding categories filter */}
          <div className="flex justify-center overflow-x-auto py-2 px-4 space-x-3 scrollbar-none" id="menu-categories-tabs">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand text-white border-brand font-bold shadow-lg'
                    : 'bg-neutral-900 text-gray-300 border-white/10 hover:border-brand/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No dishes found matching your selection or keyword. Please try another query!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="menu-items-grid">
            {filteredItems.map((item) => {
              const displayImage = activeImages[item.id] || item.imageUrl;
              const hasDiscount = item.discountPrice !== undefined && item.discountPrice > 0 && item.discountPrice < item.price;
              const spicyIndicator = item.spicyLevel && item.spicyLevel > 0 
                ? Array.from({ length: item.spicyLevel }).map((_, i) => '🌶️').join('')
                : null;

              return (
                <div
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  className={`bg-neutral-950 p-6 border border-white/10 hover:border-brand/30 transition-all duration-300 flex flex-col sm:flex-row gap-6 relative rounded-none ${
                    !item.isAvailable ? 'opacity-50' : ''
                  }`}
                >
                  {/* Food Image and Multi-image thumbnail gallery */}
                  <div className="w-full sm:w-40 shrink-0 flex flex-col gap-2">
                    <div className="relative w-full h-40 overflow-hidden bg-neutral-900">
                      <img
                        src={displayImage}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-xs text-red-500 uppercase tracking-widest font-black">
                          Sold Out
                        </div>
                      )}
                      {hasDiscount && item.isAvailable && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5">
                          OFFER
                        </div>
                      )}
                    </div>

                    {/* Additional Images Strip */}
                    {item.isAvailable && item.additionalImages && item.additionalImages.length > 0 && (
                      <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none">
                        <button
                          type="button"
                          onClick={() => setActiveImages({ ...activeImages, [item.id]: item.imageUrl })}
                          className={`w-8 h-8 shrink-0 border transition-all ${
                            displayImage === item.imageUrl ? 'border-brand scale-110' : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <img src={item.imageUrl} alt="main" className="w-full h-full object-cover" />
                        </button>
                        {item.additionalImages.map((img, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setActiveImages({ ...activeImages, [item.id]: img })}
                            className={`w-8 h-8 shrink-0 border transition-all ${
                              displayImage === img ? 'border-brand scale-110' : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <img src={img} alt={`sub-${index}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info Text */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          {/* Authentic Indian Veg/Non-Veg Indicator */}
                          <div className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${item.isVeg !== false ? 'border-green-600' : 'border-red-600'}`} title={item.isVeg !== false ? 'Vegetarian' : 'Non-Vegetarian'}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg !== false ? 'bg-green-600' : 'bg-red-600'}`} />
                          </div>
                          <h3 className="text-white font-bold text-lg tracking-wide uppercase">
                            {item.name}
                          </h3>
                          {spicyIndicator && (
                            <span className="text-xs shrink-0" title={`Spicy Level: ${item.spicyLevel}/3`}>
                              {spicyIndicator}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          {hasDiscount ? (
                            <>
                              <span className="text-brand font-black text-lg">
                                {formatPrice(item.discountPrice!, db.websiteSettings)}
                              </span>
                              <span className="text-gray-500 text-xs line-through font-mono">
                                {formatPrice(item.price, db.websiteSettings)}
                              </span>
                            </>
                          ) : (
                            <span className="text-brand font-black text-lg">
                              {formatPrice(item.price, db.websiteSettings)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {item.isChefSpecial && (
                          <span className="inline-block bg-brand-10 text-brand text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border border-brand/20">
                            Chef's Special
                          </span>
                        )}
                        <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                          item.isVeg !== false 
                            ? 'bg-green-950/20 text-green-500 border-green-500/20' 
                            : 'bg-red-950/20 text-red-500 border-red-500/20'
                        }`}>
                          {item.isVeg !== false ? 'Veg' : 'Non-Veg'}
                        </span>
                        
                        <span className="inline-block bg-white/5 text-gray-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border border-white/5">
                          {item.subcategory ? `${item.category} / ${item.subcategory}` : item.category}
                        </span>

                        {item.prepTime && (
                          <span className="inline-block bg-neutral-900 text-amber-500 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border border-amber-500/10">
                            ⏱️ {item.prepTime}
                          </span>
                        )}

                        {/* Extra Tags */}
                        {item.tags && item.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="inline-block bg-neutral-900 text-brand text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border border-brand/10">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-gray-400 text-xs leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>

                    {item.isAvailable && onBookNow && (
                      <div className="pt-4 flex justify-end">
                        <button
                          onClick={onBookNow}
                          className="text-[10px] text-brand hover:text-white uppercase font-black tracking-widest transition-colors cursor-pointer"
                        >
                          Book Table to Taste →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. GALLERY PAGE
// ==========================================
export function GalleryPage({ db }: PageProps) {
  const { galleryFolders, galleryImages } = db;
  const [selectedFolderId, setSelectedFolderId] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const filteredImages = galleryImages.filter((img) => {
    const matchesFolder = selectedFolderId === 'All' || img.folderId === selectedFolderId;
    const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="py-16 bg-black text-white fade-in-up" id="gallery-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-brand font-bold tracking-widest text-xs uppercase block">
            VISUAL SPLENDOR
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tight">
            Our Luxury Photo Gallery
          </h2>
          <div className="w-16 h-1 bg-brand mx-auto" />
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Browse our dining salons, gourmet highlights, and magical private socials.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="space-y-6 mb-12">
          {/* Search field */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search images by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 text-white pl-12 pr-4 py-3 text-sm rounded-none focus:outline-none focus:border-brand"
            />
          </div>

          {/* Folder Filter Tabs */}
          <div className="flex justify-center flex-wrap gap-2.5" id="gallery-folder-filters">
            <button
              onClick={() => setSelectedFolderId('All')}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all duration-200 cursor-pointer ${
                selectedFolderId === 'All'
                  ? 'bg-brand text-white border border-brand font-bold'
                  : 'bg-neutral-900 text-gray-400 border border-white/10 hover:border-brand/40'
              }`}
            >
              All Photos
            </button>
            {galleryFolders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                  selectedFolderId === folder.id
                    ? 'bg-brand text-white border border-brand font-bold'
                    : 'bg-neutral-900 text-gray-400 border border-white/10 hover:border-brand/40'
                }`}
              >
                <Folder size={12} className={selectedFolderId === folder.id ? 'text-white' : 'text-gray-500'} />
                <span>{folder.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Images Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No images in this folder or match search parameters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6" id="gallery-images-grid">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                id={`gallery-card-${img.id}`}
                className="group relative h-72 overflow-hidden border border-white/10 hover:border-brand/50 transition-all duration-300 bg-neutral-900"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-20">
                  <button
                    onClick={() => setZoomImage(img.imageUrl)}
                    className="self-end w-10 h-10 rounded-full bg-brand/10 border border-brand/30 hover:bg-brand text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Zoom View"
                  >
                    <Eye size={18} />
                  </button>
                  
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wide">
                      {img.title}
                    </h4>
                    <span className="text-brand text-[10px] uppercase font-bold tracking-widest">
                      {galleryFolders.find(f => f.id === img.folderId)?.name || 'Gallery'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Zoom Modal */}
        {zoomImage && (
          <div
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 cursor-zoom-out"
            onClick={() => setZoomImage(null)}
            id="gallery-zoom-modal"
          >
            <div className="max-w-4xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setZoomImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-brand text-sm uppercase font-bold tracking-widest cursor-pointer"
              >
                Close (ESC)
              </button>
              <img
                src={zoomImage}
                alt="Zoomed Review"
                className="w-auto max-h-[80vh] mx-auto border border-white/25 shadow-2xl rounded-none object-contain"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// 5. RESERVATION / BOOKING PAGE
// ==========================================
export function BookingPage({ db, setDb, bookingPrefill, setBookingPrefill }: PageProps) {
  const { bookings, bookingTimeSlots, blockedDates } = db;
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(''); // Stores YYYY-MM-DD
  const [time, setTime] = useState('');   // Selected HH:MM AM/PM
  const [occasion, setOccasion] = useState('Dinner');
  const [request, setRequest] = useState('');
  const [bookedState, setBookedState] = useState(false);
  const [lastBookingId, setLastBookingId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // States for interactive calendar navigation
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

  // Handle pre-fills from event clicks
  useEffect(() => {
    if (bookingPrefill) {
      if (bookingPrefill.occasion) {
        setOccasion(bookingPrefill.occasion);
      }
      if (bookingPrefill.text) {
        setRequest(bookingPrefill.text);
      }
      // Reset after prefill is taken
      if (setBookingPrefill) {
        setBookingPrefill(null);
      }
    }
  }, [bookingPrefill, setBookingPrefill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim() || !email.trim() || !date || !time) {
      alert("Please complete all fields, including Date & Time Slot selection.");
      return;
    }

    // Verify date is not blocked
    const isDateBlocked = blockedDates?.some(b => b.date === date);
    if (isDateBlocked) {
      alert("The selected date is unavailable for bookings. Please select another date.");
      return;
    }

    // Verify slot is not already booked
    const isSlotBooked = bookings.some(
      b => b.date === date && b.time === time && b.status !== 'Rejected'
    );
    if (isSlotBooked) {
      alert("This time slot is already booked. Please select another slot.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    const bId = `book-${Date.now().toString().slice(-6)}`;
    const newBooking: Booking = {
      id: bId,
      guestName: name.trim(),
      mobileNumber: mobile.trim(),
      email: email.trim(),
      guestsCount: Number(guests),
      date: date,
      time: time,
      occasion: occasion,
      specialRequest: request.trim(),
      status: 'Pending', // Sent to Host for approval
      createdAt: new Date().toISOString(),
      isUnread: true // Trigger admin notifications badge!
    };

    // Update database and save to localStorage
    const nextBookings = [...bookings, newBooking];
    if (setDb) {
      setDb({ ...db, bookings: nextBookings });
    } else {
      bookings.push(newBooking);
    }

    // NEW: Auto-working Netlify integrations
    const submissionPayload = {
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      guests: Number(guests),
      date: date,
      time: time,
      occasion: occasion,
      request: request.trim()
    };

    // 1. Submit to Netlify Forms
    submitToNetlify('reservation', submissionPayload);

    // 2. Dispatch custom HTML emails (Customer confirmation & Admin alert)
    sendFormEmail('reservation', submissionPayload, db.contactSettings);

    // 3. Trigger WhatsApp click-to-chat confirmation
    triggerWhatsAppMessage('reservation', submissionPayload, db.contactSettings);

    setLastBookingId(bId);
    setShowConfirmModal(false);
    setBookedState(true);
  };

  // Helper to format Date as string YYYY-MM-DD
  const formatDateStr = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const todayStr = (() => {
    const today = new Date();
    return formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  })();

  return (
    <div className="py-16 bg-black text-white fade-in-up" id="booking-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header banner */}
        <div className="text-center space-y-4 mb-12">
          <span className="text-brand font-bold tracking-widest text-xs uppercase block">
            SPOTLIGHT RESERVATIONS
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tight">
            Reserve Your Luxury Table
          </h2>
          <div className="w-16 h-1 bg-brand mx-auto" />
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Please complete the details below. Our advanced booking system automates scheduling and confirms available slots instantly.
          </p>
        </div>

        {/* Content Panel */}
        {!bookedState ? (
          <div className="bg-neutral-950 p-6 sm:p-10 border border-white/10" id="booking-form-panel">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Section: Guest details (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest pb-2 border-b border-white/5 flex items-center space-x-2">
                    <User size={14} className="text-brand" />
                    <span>Guest Information</span>
                  </h3>

                  {/* Guest Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="booking-name" className="text-xs uppercase font-bold tracking-wider text-gray-400">
                      Guest Name *
                    </label>
                    <input
                      type="text"
                      id="booking-name"
                      required
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label htmlFor="booking-phone" className="text-xs uppercase font-bold tracking-wider text-gray-400">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="booking-phone"
                      required
                      placeholder="E.g. +91 98765 43210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>

                  {/* Email ID */}
                  <div className="space-y-1.5">
                    <label htmlFor="booking-email" className="text-xs uppercase font-bold tracking-wider text-gray-400">
                      Email ID *
                    </label>
                    <input
                      type="email"
                      id="booking-email"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>

                  {/* Guests Dropdown & Occasion side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="booking-guests" className="text-xs uppercase font-bold tracking-wider text-gray-400">
                        Guests Count *
                      </label>
                      <select
                        id="booking-guests"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-3 text-sm focus:outline-none focus:border-brand rounded-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                          <option key={num} value={num} className="bg-neutral-950">
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="booking-occasion" className="text-xs uppercase font-bold tracking-wider text-gray-400">
                        Occasion
                      </label>
                      <select
                        id="booking-occasion"
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-3 text-sm focus:outline-none focus:border-brand rounded-none"
                      >
                        {['Dinner', 'Lunch', 'Anniversary', 'Birthday Party', 'Corporate Event', 'Date Night', 'Private Social'].map((occ) => (
                          <option key={occ} value={occ} className="bg-neutral-950">
                            {occ}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Special Request */}
                  <div className="space-y-1.5">
                    <label htmlFor="booking-request" className="text-xs uppercase font-bold tracking-wider text-gray-400">
                      Special Requests / Dietary Notes
                    </label>
                    <textarea
                      id="booking-request"
                      rows={3}
                      placeholder="E.g., peanut allergy, high chair, window table, flower arrangement..."
                      value={request}
                      onChange={(e) => setRequest(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand rounded-none resize-none"
                    />
                  </div>
                </div>

                {/* Right Section: Interactive Auto Booking Date & Time selection (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-white font-bold uppercase text-xs tracking-widest pb-2 border-b border-white/5 flex items-center space-x-2">
                    <Calendar size={14} className="text-brand" />
                    <span>Select Date & Predefined Time Slot</span>
                  </h3>

                  {/* Visual Month Selector */}
                  <div className="bg-neutral-900/60 p-4 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-xs font-black uppercase text-brand tracking-widest">
                        {[
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ][calMonth]} {calYear}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (calMonth === 0) {
                              setCalMonth(11);
                              setCalYear(calYear - 1);
                            } else {
                              setCalMonth(calMonth - 1);
                            }
                          }}
                          className="p-1 hover:bg-white/5 text-gray-400 hover:text-white border border-white/10 text-xs cursor-pointer"
                        >
                          &larr; Prev
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (calMonth === 11) {
                              setCalMonth(0);
                              setCalYear(calYear + 1);
                            } else {
                              setCalMonth(calMonth + 1);
                            }
                          }}
                          className="p-1 hover:bg-white/5 text-gray-400 hover:text-white border border-white/10 text-xs cursor-pointer"
                        >
                          Next &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Sunday - Saturday header */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-gray-500 tracking-wider">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <div key={d} className="py-1">{d}</div>
                      ))}
                    </div>

                    {/* Calendar Day Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {(() => {
                        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                        const firstDayIdx = new Date(calYear, calMonth, 1).getDay();
                        const cells = [];
                        
                        // Pad empty slots before 1st of month
                        for (let i = 0; i < firstDayIdx; i++) {
                          cells.push(<div key={`empty-${i}`} className="aspect-square" />);
                        }
                        
                        // Render days
                        for (let d = 1; d <= daysInMonth; d++) {
                          const dateStr = formatDateStr(calYear, calMonth, d);
                          const isPast = dateStr < todayStr;
                          const isBlocked = blockedDates?.some((b) => b.date === dateStr);
                          const isSelected = date === dateStr;
                          
                          let cellStyle = 'bg-neutral-950 text-gray-400 border border-white/5 hover:border-brand cursor-pointer';
                          if (isPast) {
                            cellStyle = 'bg-neutral-900/10 text-gray-700 cursor-not-allowed border border-transparent';
                          } else if (isBlocked) {
                            cellStyle = 'bg-red-950/20 text-red-400 cursor-not-allowed border border-red-500/20 line-through';
                          } else if (isSelected) {
                            cellStyle = 'bg-brand text-white border border-brand font-bold scale-105 shadow-md shadow-brand/10';
                          }

                          cells.push(
                            <button
                              key={`day-${d}`}
                              type="button"
                              disabled={isPast || isBlocked}
                              onClick={() => {
                                setDate(dateStr);
                                setTime(''); // Reset time on date change to force new slot selection!
                              }}
                              className={`aspect-square p-1 flex flex-col justify-center items-center text-xs transition-all ${cellStyle}`}
                            >
                              <span>{d}</span>
                              {isBlocked && !isPast && (
                                <span className="text-[6px] font-bold text-red-500 uppercase tracking-tighter mt-0.5">Block</span>
                              )}
                            </button>
                          );
                        }
                        return cells;
                      })()}
                    </div>
                  </div>

                  {/* Predefined Dynamic Time Slot Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase font-bold tracking-wider text-gray-300">
                        Available Time Slots {date ? `for ${date}` : '(Select Date first)'}
                      </label>
                      {date && (
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono font-black">
                          {bookingTimeSlots?.length || 0} Slots Configured
                        </span>
                      )}
                    </div>

                    {!date ? (
                      <div className="p-4 bg-neutral-900/30 border border-white/5 text-center text-gray-500 text-xs uppercase tracking-wider">
                        Please select a date from the calendar to view available table slots.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {(() => {
                          const availableSlots = bookingTimeSlots?.filter((slot) => {
                            const isSlotBlockedGlobally = slot.isBlocked;
                            const isDateBlocked = blockedDates?.some((b) => b.date === date);
                            const isSlotBlockedOnDate = db.blockedSlotsByDate?.includes(`${date}:${slot.time}`);
                            const isSlotBooked = bookings.some(
                              (b) => b.date === date && b.time === slot.time && b.status !== 'Rejected'
                            );
                            const bookingsCount = bookings.filter(
                              (b) => b.date === date && b.time === slot.time && b.status !== 'Rejected'
                            ).length;
                            const isFullyBooked = bookingsCount >= (db.maxBookingsPerSlot || 1);

                            const isUnavailable = isSlotBlockedGlobally || isDateBlocked || isSlotBlockedOnDate || isSlotBooked || isFullyBooked;
                            return !isUnavailable;
                          }) || [];

                          if (availableSlots.length === 0) {
                            return (
                              <div className="col-span-full p-6 bg-red-950/10 border border-red-500/10 text-center text-red-400 text-xs uppercase tracking-wider">
                                No table slots are available for this date. Please choose another calendar date.
                              </div>
                            );
                          }

                          return availableSlots.map((slot) => {
                            const isSelected = time === slot.time;
                            let slotStyle = 'bg-neutral-900 text-white border border-white/5 hover:border-brand hover:bg-brand/5 cursor-pointer';
                            if (isSelected) {
                              slotStyle = 'bg-brand text-white border border-brand font-black scale-[1.02] shadow-md shadow-brand/10';
                            }

                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => setTime(slot.time)}
                                className={`py-3 px-2 text-center font-mono text-xs transition-all flex flex-col justify-center items-center rounded-none relative ${slotStyle}`}
                              >
                                <span className="font-bold">{slot.time}</span>
                                <span className="text-[8px] uppercase tracking-widest font-sans mt-0.5 font-bold">
                                  Available
                                </span>
                              </button>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button
                  type="submit"
                  disabled={!date || !time}
                  id="booking-submit-btn"
                  className={`w-full py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-none cursor-pointer ${
                    date && time
                      ? 'bg-brand text-white hover:bg-white hover:text-black glow-btn'
                      : 'bg-neutral-900 text-gray-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {!date 
                    ? 'Select Date on Calendar to Proceed' 
                    : !time 
                    ? 'Select Predefined Time Slot to Proceed' 
                    : 'Lock Spotlight Table Reservation Now'}
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="bg-neutral-950 p-8 sm:p-12 border border-brand/20 text-center space-y-8 max-w-2xl mx-auto animate-fade-in" id="booking-success-message">
            <div className="w-16 h-16 bg-brand/10 rounded-full border border-brand flex items-center justify-center mx-auto text-brand animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase text-white tracking-wide">
                Spotlight Table Locked!
              </h3>
              <p className="text-gray-400 text-xs uppercase tracking-widest">
                Reference ID: <span className="font-mono text-brand font-black select-all text-sm">{lastBookingId}</span>
              </p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
              Our reservation host has logged your pending spotlight table request. A team member is dispatching status reports to you now.
            </p>

            {/* Simulated Live Automated Notifications Box */}
            <div className="p-6 bg-black border border-white/10 text-xs text-left space-y-4 rounded-none max-w-md mx-auto">
              <h4 className="text-white font-mono font-black uppercase tracking-widest text-[10px] pb-2 border-b border-white/5">
                Automated Confirmation Status
              </h4>
              
              <div className="space-y-2.5 font-light">
                <div className="flex items-start space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider">SMS & WhatsApp Gateway [CONNECTED]</p>
                    <p className="text-gray-400 text-[10px]">Successfully queued dispatch to WhatsApp <strong className="text-white">{mobile}</strong></p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider">Email Delivery [SENT]</p>
                    <p className="text-gray-400 text-[10px]">HTML confirmation template sent to <strong className="text-white">{email}</strong></p>
                  </div>
                </div>
              </div>

              {/* Real WhatsApp Direct Link helper */}
              <div className="pt-2 border-t border-white/5">
                <a
                  href={`https://api.whatsapp.com/send?phone=${mobile.replace(/\D/g, '')}&text=Hello%20${encodeURIComponent(name)},%20your%20Limelight%20Restaurant%20table%20reservation%20for%20${guests}%20guests%20on%20${date}%20at%20${time}%20is%20logged!%20Ref:%20${lastBookingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366]/20 border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white text-[#25D366] text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 cursor-pointer rounded-none"
                >
                  <span className="font-bold">📱 Open Simulated WhatsApp Confirmation</span>
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setBookedState(false)}
                className="px-8 py-3 bg-neutral-900 hover:bg-brand border border-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded-none"
              >
                Reserve Another Table
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Smart Booking Confirmation Overlay Popup */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-neutral-950 border border-white/10 w-full max-w-md p-6 sm:p-10 relative text-xs text-white my-auto">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-4 animate-scale-up">
              <div className="space-y-1.5 border-b border-white/5 pb-4">
                <span className="text-brand font-mono font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-brand rounded-none inline-block"></span>
                  <span>Confirm Table Booking</span>
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  Verify Details
                </h3>
                <p className="text-gray-400 text-xs font-light">
                  Please review your reservation parameters before lock-in.
                </p>
              </div>

              {/* Booking Parameter Table */}
              <div className="bg-neutral-900/40 border border-white/5 p-4 rounded-none space-y-2.5">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider">Patron Name</span>
                  <span className="font-bold text-white text-[11px]">{name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider">Mobile Number</span>
                  <span className="font-mono text-white text-[11px]">{mobile}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider">Email Address</span>
                  <span className="text-white text-[11px]">{email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider">Guests & Occasion</span>
                  <span className="font-bold text-brand text-[11px] uppercase tracking-wide">{guests} Guests ({occasion})</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider">Target Date</span>
                  <span className="font-bold text-white text-[11px]">{date}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 uppercase font-bold text-[9px] tracking-wider">Time Slot</span>
                  <span className="font-mono font-black text-brand text-[11px]">{time}</span>
                </div>
                {request && (
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-gray-500 uppercase font-bold text-[8px] tracking-wider mb-1">Special Notes</p>
                    <p className="text-gray-300 font-light italic text-[10px] leading-relaxed">"{request}"</p>
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2 text-[10px] text-emerald-400 bg-emerald-950/10 border border-emerald-500/10 p-3">
                <Shield size={14} className="shrink-0" />
                <span className="font-light">Automatic slot collision checking complete. Slot is open for booking!</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-grow py-3 bg-neutral-900 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer rounded-none"
                >
                  Edit / Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  className="flex-grow py-3 bg-brand text-white text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black transition-colors cursor-pointer glow-btn"
                >
                  Confirm Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 6. EVENTS PAGE
// ==========================================
export function EventsPage({ db, setDb, setCurrentPage }: PageProps) {
  const { events } = db;

  const [bookingEvent, setBookingEvent] = useState<RestaurantEvent | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [guests, setGuests] = useState('2');
  const [submitted, setSubmitted] = useState(false);

  const handleOpenBooking = (ev: RestaurantEvent) => {
    setBookingEvent(ev);
    setSubmitted(false);
  };

  const handleCloseBooking = () => {
    setBookingEvent(null);
    setName('');
    setEmail('');
    setMobile('');
    setGuests('2');
    setSubmitted(false);
  };

  const handleBookEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEvent) return;

    if (!name.trim() || !email.trim() || !mobile.trim() || !guests) {
      alert('Please fill in all the required booking fields.');
      return;
    }

    const bId = `book-ev-${Date.now().toString().slice(-6)}`;
    const newBooking: Booking = {
      id: bId,
      guestName: name.trim(),
      mobileNumber: mobile.trim(),
      email: email.trim(),
      guestsCount: Number(guests),
      date: bookingEvent.date,
      time: bookingEvent.time,
      occasion: `Event: ${bookingEvent.title}`,
      specialRequest: `Automated VIP Event Seat Reservation for "${bookingEvent.title}"`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      isUnread: true
    };

    // Save to DB
    if (setDb) {
      setDb({ ...db, bookings: [...db.bookings, newBooking] });
    } else {
      db.bookings.push(newBooking);
    }

    const payload = {
      eventName: bookingEvent.title,
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      guests: Number(guests),
      date: bookingEvent.date
    };

    // 1. Submit to Netlify Forms
    submitToNetlify('event-booking', payload);

    // 2. Dispatch custom HTML emails (VIP Event confirmation + Admin notification)
    sendFormEmail('event-booking', payload, db.contactSettings);

    // 3. Trigger WhatsApp click-to-chat
    triggerWhatsAppMessage('event-booking', payload, db.contactSettings);

    setSubmitted(true);
  };

  return (
    <div className="py-16 bg-black text-white fade-in-up" id="events-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-brand font-bold tracking-widest text-xs uppercase block">
            WEEKLY SOCIALS
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tight">
            Events & Social Calendar
          </h2>
          <div className="w-16 h-1 bg-brand mx-auto" />
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Dine, dance, and celebrate in style. Discover what is in the spotlight this weekend.
          </p>
        </div>

        {/* Events list cards */}
        <div className="space-y-12" id="events-list">
          {events.map((ev, idx) => (
            <div
              key={ev.id}
              id={`event-item-${ev.id}`}
              className={`bg-neutral-950 border border-white/10 overflow-hidden flex flex-col lg:flex-row gap-8 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Event Image */}
              <div className="w-full lg:w-[45%] h-80 lg:h-96 overflow-hidden shrink-0">
                <img
                  src={ev.imageUrl}
                  alt={ev.title}
                  className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Event Info Details */}
              <div className="p-8 sm:p-12 flex-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="px-2.5 py-1 bg-brand text-white font-black uppercase tracking-wider text-[9px]">
                      {ev.date}
                    </span>
                    <span className="text-gray-400 flex items-center space-x-1.5">
                      <Clock size={12} className="text-brand" />
                      <span>{ev.time}</span>
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-wide pt-1">
                    {ev.title}
                  </h3>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed font-light">
                  {ev.description}
                </p>

                <div className="pt-4">
                  <button
                    onClick={() => handleOpenBooking(ev)}
                    id={`book-event-btn-${ev.id}`}
                    className="px-6 py-3 bg-brand text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 cursor-pointer glow-btn"
                  >
                    Reserve VIP Seat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* DEDICATED EVENT BOOKING MODAL */}
      {bookingEvent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="event-booking-modal">
          <div className="bg-neutral-950 border border-white/10 w-full max-w-lg p-8 relative">
            <button
              onClick={handleCloseBooking}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-12 space-y-4" id="event-booking-success">
                <div className="w-16 h-16 bg-brand-10 border border-brand/30 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold uppercase tracking-widest text-brand">Spot Reserved!</h4>
                <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                  Excellent choice! Your seats for <strong>"{bookingEvent.title}"</strong> are pending host confirmation. We have saved the booking to your profile and sent a beautiful guest pass to your email inbox.
                </p>
                <div className="pt-6">
                  <button
                    onClick={handleCloseBooking}
                    className="px-6 py-2.5 bg-brand text-white text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    Return to Calendar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookEventSubmit} className="space-y-5 text-xs" id="event-booking-modal-form">
                <div className="space-y-1">
                  <span className="text-brand font-black uppercase tracking-widest text-[9px]">Event Registration</span>
                  <h3 className="text-lg font-black uppercase text-white truncate">{bookingEvent.title}</h3>
                  <div className="flex space-x-3 text-gray-400 text-[10px] font-mono mt-1">
                    <span>Date: {bookingEvent.date}</span>
                    <span>•</span>
                    <span>Time: {bookingEvent.time}</span>
                  </div>
                </div>

                <div className="w-full h-px bg-white/10 my-4" />

                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tony Stark"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2.5 focus:border-brand focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. tony@stark.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2.5 focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2.5 focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold">Guests Count</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2.5 focus:border-brand focus:outline-none transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest (Individual)' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-[10px] text-gray-500 leading-relaxed font-light">
                  * By clicking the reservation button, your booking will be submitted for active validation by the Limelight host concierge.
                </p>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-brand hover:bg-white hover:text-black text-white text-xs uppercase tracking-widest font-black transition-all cursor-pointer"
                  >
                    Book Event Seat Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. CONTACT PAGE
// ==========================================
export function ContactPage({ db, setDb }: PageProps) {
  const { contactSettings } = db;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cards = [
    { title: 'The Lounge Address', value: contactSettings.address, icon: <MapPin className="text-brand" size={20} />, isAction: false },
    { title: 'Working Hours', value: contactSettings.workingHours, icon: <Clock className="text-brand" size={20} />, isAction: false },
    { title: 'Corporate Email', value: contactSettings.email, icon: <Mail className="text-brand" size={20} />, isAction: true, link: `mailto:${contactSettings.email}` },
    { title: 'Reservation Hotline', value: contactSettings.phone, icon: <Phone className="text-brand" size={20} />, isAction: true, link: `tel:${contactSettings.phone}` },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim() || !subject.trim() || !message.trim()) {
      alert('Please fill out all fields in the contact inquiry form.');
      return;
    }

    const newInquiry = {
      id: `inq-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      mobileNumber: mobile.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      isUnread: true,
    };

    if (setDb) {
      const existingInquiries = db.inquiries || [];
      setDb({
        ...db,
        inquiries: [newInquiry, ...existingInquiries],
      });
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    // 1. Submit to Netlify Forms
    submitToNetlify('contact', payload);

    // 2. Dispatch custom HTML emails (Customer confirmation & Admin alert)
    sendFormEmail('contact', payload, db.contactSettings);

    // 3. Trigger WhatsApp direct inquiry
    triggerWhatsAppMessage('contact', payload, db.contactSettings);

    setSubmitted(true);
    setName('');
    setEmail('');
    setMobile('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="py-16 bg-black text-white fade-in-up" id="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center space-y-3 mb-16">
          <span className="text-brand font-bold tracking-widest text-xs uppercase block">
            VISIT & REACH US
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tight">
            Our Location & Contact
          </h2>
          <div className="w-16 h-1 bg-brand mx-auto" />
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Reach out for table inquiries, party bookings, or executive lunches.
          </p>
        </div>

        {/* Info & Form Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Left Column: Contact details & quick cards (4 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-black uppercase tracking-wider text-brand border-l-2 border-brand pl-3 mb-6">
              Lounge Contacts
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4" id="contact-details-grid">
              {cards.map((c, i) => (
                <div
                  key={i}
                  className="bg-neutral-950 p-6 border border-white/10 hover:border-brand/30 transition-all duration-300 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-brand-10 rounded-full border border-brand/20 flex items-center justify-center">
                        {c.icon}
                      </div>
                      <h4 className="text-white font-bold text-xs uppercase tracking-wider">
                        {c.title}
                      </h4>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed font-light pl-12">
                      {c.value}
                    </p>
                  </div>

                  {c.isAction && c.link && (
                    <div className="pt-2 pl-12 mt-auto">
                      <a
                        href={c.link}
                        className="text-[10px] text-brand font-extrabold uppercase tracking-wider hover:text-white transition-colors block"
                      >
                        Connect Now →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Floating Quick WhatsApp direct banner */}
            <div className="bg-neutral-950 border border-white/10 p-6 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase">WhatsApp Helpdesk</h4>
                <p className="text-gray-400 text-[11px] mt-1 leading-relaxed">Need instant table clearance or quick booking modification?</p>
              </div>
              <a
                href={`https://wa.me/${contactSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-wider whitespace-nowrap"
              >
                Chat Live
              </a>
            </div>
          </div>

          {/* Right Column: Custom Gilded Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-950 p-8 border border-white/10 relative">
            <h3 className="text-xl font-black uppercase tracking-wider text-white border-l-2 border-brand pl-3 mb-6">
              Send Inquiry message
            </h3>

            {submitted ? (
              <div className="space-y-4 py-12 text-center" id="contact-success-panel">
                <div className="w-16 h-16 bg-brand-10 border border-brand/30 text-brand rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-up">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold uppercase tracking-wide text-brand">Inquiry Dispatched Successfully!</h4>
                <p className="text-gray-300 text-xs max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting Limelight. A customer relations supervisor has been notified of your message. We have sent a copy of this request to your inbox.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 bg-brand text-white text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs" id="contact-inquiry-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robert Downey"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2.5 focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. robert@stark.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2.5 focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2.5 focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Inquiry Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Private Corporate Dining Booking"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-black border border-white/10 text-white px-3 py-2.5 focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold">Your Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your requirements, guest count, custom food wishes or queries..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2.5 focus:border-brand focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-brand hover:bg-white hover:text-black text-white text-xs uppercase tracking-widest font-black transition-all cursor-pointer"
                  >
                    Submit Inquiry Form
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Notice for Visitors */}
        <div className="mt-16 bg-neutral-950 border border-white/10 p-8 max-w-3xl mx-auto text-center">
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Notice for Visitors</h4>
          <p className="text-gray-400 text-xs leading-relaxed max-w-xl mx-auto">
            Reservations are highly recommended on Friday through Sunday evenings. Valet parking is free for all dining patrons holding a validated table booking.
          </p>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 8. DYNAMIC CUSTOM PAGE (WEBSITE BUILDER)
// ==========================================
export function DynamicCustomPage({ db, slug, setCurrentPage }: { db: DatabaseState; slug: string; setCurrentPage: (page: string) => void }) {
  const page = (db.customPages || []).find(p => p.slug === slug);

  useEffect(() => {
    if (!page) return;
    
    // Inject Custom CSS
    let styleTag: HTMLStyleElement | null = null;
    if (page.customCss) {
      styleTag = document.createElement('style');
      styleTag.id = `custom-css-${page.id}`;
      styleTag.innerHTML = page.customCss;
      document.head.appendChild(styleTag);
    }

    // Inject Custom JS
    let scriptTag: HTMLScriptElement | null = null;
    if (page.customJs) {
      scriptTag = document.createElement('script');
      scriptTag.id = `custom-js-${page.id}`;
      scriptTag.innerHTML = `try { ${page.customJs} } catch(e) { console.error("Error in custom JS: ", e); }`;
      document.body.appendChild(scriptTag);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      if (styleTag) {
        const tag = document.getElementById(`custom-css-${page.id}`);
        if (tag) tag.remove();
      }
      if (scriptTag) {
        const tag = document.getElementById(`custom-js-${page.id}`);
        if (tag) tag.remove();
      }
    };
  }, [page]);

  if (!page || !page.isActive) {
    return (
      <div className="py-24 bg-black text-center text-gray-400">
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Page Not Found</h2>
        <p className="text-sm mb-6">The requested custom page does not exist or has been disabled.</p>
        <button 
          onClick={() => setCurrentPage('home')}
          className="px-6 py-2.5 bg-brand text-white text-xs font-bold uppercase tracking-widest border border-brand hover:bg-transparent hover:text-brand transition-all cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="py-24 bg-black min-h-screen animate-fade-in relative overflow-hidden">
      {/* Decorative vector overlays */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-10/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-10/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="border border-white/10 bg-neutral-950 p-8 sm:p-12 relative">
          {/* Accent corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand" />

          <div 
            className="prose prose-invert max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </div>
      </div>
    </div>
  );
}
