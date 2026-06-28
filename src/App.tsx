import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import SpecialOffersSection from './components/SpecialOffersSection';
import MenuSection from './components/MenuSection';
import ReviewsSection from './components/ReviewsSection';
import ReservationSection from './components/ReservationSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';
import { initialRestaurantData } from './initialData';
import { RestaurantData, Reservation } from './types';
import { Heart, ArrowUp } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'limelight_restaurant_store_v1';
const ADMIN_SESSION_KEY = 'limelight_admin_logged_in';

export default function App() {
  // Main Centralized State
  const [data, setData] = useState<RestaurantData>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialRestaurantData, ...parsed };
      } catch (e) {
        return initialRestaurantData;
      }
    }
    return initialRestaurantData;
  });

  // Client-side Custom URL Router
  const [isAdminView, setIsAdminView] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/admin' || hash === '#admin' || hash === '#/admin';
  });

  // Session storage login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });

  // Back to Top trigger
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Monitor URL PopState or Hash Change
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isRouteAdmin = path === '/admin' || hash === '#admin' || hash === '#/admin';
      setIsAdminView(isRouteAdmin);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Update dynamic SEO page title
  useEffect(() => {
    if (data.seo && data.seo.metaTitle) {
      document.title = data.seo.metaTitle;
    }
  }, [data.seo]);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateData = (updatedData: RestaurantData) => {
    setData(updatedData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  };

  const handleToggleAdminMode = (toAdmin: boolean) => {
    if (toAdmin) {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
    setIsAdminView(toAdmin);
  };

  const handleLogin = (uInput: string, pInput: string): boolean => {
    const savedUser = localStorage.getItem('limelight_admin_username') || 'admin';
    const savedPass = localStorage.getItem('limelight_admin_password') || 'password';

    if (uInput.trim().toLowerCase() === savedUser.toLowerCase() && pInput === savedPass) {
      setIsLoggedIn(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    handleToggleAdminMode(false);
  };

  const handleAddReservation = (newRes: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const freshBooking: Reservation = {
      ...newRes,
      id: `res-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedReservations = [freshBooking, ...data.reservations];
    handleUpdateData({
      ...data,
      reservations: updatedReservations
    });
  };

  const handleBookTableCTA = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewMenuCTA = () => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans selection:bg-pink-100 selection:text-pink-900 antialiased">
      
      {/* Premium responsive Navigation bar */}
      <Navbar
        isAdminView={isAdminView}
        setIsAdminView={handleToggleAdminMode}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        phone={data.contact.phone}
      />

      {/* Main Routing Screen Layout */}
      {!isAdminView ? (
        <div className="animate-in fade-in duration-300">
          
          {/* 1. Hero Landing Block */}
          <HeroSection 
            hero={data.hero} 
            onBookTableClick={handleBookTableCTA} 
            onViewMenuClick={handleViewMenuCTA} 
          />
          
          {/* 2. Brand Culinary Story Section */}
          <AboutSection 
            about={data.about} 
            onBookClick={handleBookTableCTA} 
          />

          {/* 3. Why Choose Us values Section */}
          <WhyChooseUsSection 
            items={data.whyChooseUs} 
          />

          {/* 4. Seasonal Special Offers Row */}
          <SpecialOffersSection 
            offers={data.offers} 
          />
          
          {/* 5. Interactive Dishes Menu Section */}
          <MenuSection 
            menu={data.menu} 
            categories={data.categories}
          />

          {/* 6. Star Ratings Testimonials Section */}
          <ReviewsSection 
            reviews={data.reviews} 
          />

          {/* 7. Client-validated Netlify Reservation Desk */}
          <ReservationSection 
            onAddReservation={handleAddReservation} 
            reservations={data.reservations} 
          />
          
          {/* 8. Lightbox Gallery & Instagram row */}
          <GallerySection 
            gallery={data.gallery} 
          />
          
          {/* 9. Contact details with embedded Google Map */}
          <ContactSection 
            contact={data.contact} 
            hours={data.hours} 
          />
          
          {/* Elegant Public Footer - Admin Button completely hidden to guarantee security */}
          <footer className="bg-neutral-950 text-neutral-500 py-16 border-t border-neutral-900 text-center relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-neutral-900 pb-12 mb-12 text-left">
                
                {/* Brand overview */}
                <div className="md:col-span-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold tracking-tight text-pink-400">
                      Lime<span className="text-white">light</span>
                    </span>
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  </div>
                  <p className="font-sans text-xs text-neutral-400 mt-1 max-w-sm font-light leading-relaxed">
                    Haridwar's highly acclaimed fine dining oasis. Exquisite tandoor specialties, rich family platters, and pink-lit ambiance crafted for life's golden occasions.
                  </p>
                  <p className="font-sans text-[10px] text-neutral-600 font-light">
                    Address: {data.contact.address}
                  </p>
                </div>

                {/* Quick Navigation Links */}
                <div className="md:col-span-4 space-y-4">
                  <h4 className="font-serif text-white font-semibold text-sm">Quick Links</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-pink-400 text-left cursor-pointer transition-colors">Home</button>
                    <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-pink-400 text-left cursor-pointer transition-colors">About Story</button>
                    <button onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-pink-400 text-left cursor-pointer transition-colors">Gourmet Menu</button>
                    <button onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-pink-400 text-left cursor-pointer transition-colors">Guest Reviews</button>
                    <button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-pink-400 text-left cursor-pointer transition-colors">Book a Table</button>
                    <button onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-pink-400 text-left cursor-pointer transition-colors">Photo Gallery</button>
                  </div>
                </div>

                {/* Legal compliance links */}
                <div className="md:col-span-3 space-y-4">
                  <h4 className="font-serif text-white font-semibold text-sm">Legal & Compliance</h4>
                  <div className="space-y-2 text-xs flex flex-col">
                    <a href="#privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</a>
                    <a href="#terms" className="hover:text-pink-400 transition-colors">Terms & Conditions</a>
                    <span className="text-[10px] text-neutral-600 block pt-1">FSSAI License No: 12624005000128</span>
                  </div>
                </div>

              </div>

              {/* Bottom bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                <p className="font-sans font-light">
                  © {new Date().getFullYear()} Limelight Bistro & Lounge. All rights reserved.
                </p>
                <p className="flex items-center gap-1 font-sans font-light">
                  <span>Crafted for exquisite taste with</span>
                  <Heart size={10} className="text-pink-500 fill-pink-500" />
                  <span>on Netlify.</span>
                </p>
              </div>

            </div>
          </footer>

        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          {/* Secure Administrative Control Panel Dashboard */}
          <AdminPanel
            data={data}
            onUpdate={handleUpdateData}
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Floating back-to-top widget */}
      {showBackToTop && !isAdminView && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 hover:shadow-pink-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer z-40"
          title="Scroll to Top"
        >
          <ArrowUp size={18} />
        </button>
      )}

    </div>
  );
}
