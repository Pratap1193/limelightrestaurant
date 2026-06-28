import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowLeft, LogOut, Phone } from 'lucide-react';

interface NavbarProps {
  isAdminView: boolean;
  setIsAdminView: (isAdmin: boolean) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  phone: string;
}

export default function Navbar({
  isAdminView,
  setIsAdminView,
  isLoggedIn,
  onLogout,
  phone,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToHome = () => {
    setIsMobileMenuOpen(false);
    if (isAdminView) {
      // Go back to website view
      window.history.pushState({}, '', '/');
      setIsAdminView(false);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (isAdminView) {
      window.history.pushState({}, '', '/');
      setIsAdminView(false);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isAdminView
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-pink-100 py-3'
          : 'bg-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Brand Logo */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={navigateToHome}
          >
            <span
              className={`font-serif text-2xl font-bold tracking-tight transition-colors duration-300 ${
                isScrolled || isAdminView ? 'text-pink-600' : 'text-pink-400 group-hover:text-pink-300'
              }`}
            >
              Lime<span className={isScrolled || isAdminView ? 'text-neutral-900' : 'text-white'}>light</span>
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 ml-1 animate-pulse"></span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdminView ? (
              <>
                <button
                  onClick={navigateToHome}
                  className={`font-sans font-medium text-sm hover:text-pink-500 transition-colors duration-200 cursor-pointer ${
                    isScrolled ? 'text-neutral-700' : 'text-white/90'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className={`font-sans font-medium text-sm hover:text-pink-500 transition-colors duration-200 cursor-pointer ${
                    isScrolled ? 'text-neutral-700' : 'text-white/90'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('menu')}
                  className={`font-sans font-medium text-sm hover:text-pink-500 transition-colors duration-200 cursor-pointer ${
                    isScrolled ? 'text-neutral-700' : 'text-white/90'
                  }`}
                >
                  Menu
                </button>
                <button
                  onClick={() => scrollToSection('gallery')}
                  className={`font-sans font-medium text-sm hover:text-pink-500 transition-colors duration-200 cursor-pointer ${
                    isScrolled ? 'text-neutral-700' : 'text-white/90'
                  }`}
                >
                  Gallery
                </button>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className={`font-sans font-medium text-sm hover:text-pink-500 transition-colors duration-200 cursor-pointer ${
                    isScrolled ? 'text-neutral-700' : 'text-white/90'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className={`font-sans font-medium text-sm hover:text-pink-500 transition-colors duration-200 cursor-pointer ${
                    isScrolled ? 'text-neutral-700' : 'text-white/90'
                  }`}
                >
                  Contact
                </button>

                {/* Quick Call Button */}
                <a
                  href={`tel:${phone}`}
                  className={`flex items-center gap-1.5 px-4.5 py-2 rounded-full font-sans font-semibold text-xs tracking-wide uppercase transition-all duration-300 ${
                    isScrolled
                      ? 'bg-pink-600 text-white hover:bg-pink-700 shadow-sm shadow-pink-500/20'
                      : 'bg-white text-pink-600 hover:bg-pink-50 shadow-sm'
                  }`}
                >
                  <Phone size={13} />
                  Call Now
                </a>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Secure Administrative Area
                </span>
                
                <button
                  onClick={navigateToHome}
                  className="flex items-center gap-1.5 text-neutral-600 hover:text-pink-600 font-sans font-medium text-sm transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Back to Website
                </button>

                {isLoggedIn && (
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-medium text-xs border border-rose-200/50 transition-all cursor-pointer"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {isAdminView && isLoggedIn && (
              <button
                onClick={onLogout}
                className="p-2 text-rose-600 hover:text-rose-700 cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md focus:outline-none cursor-pointer ${
                isScrolled || isAdminView ? 'text-neutral-800' : 'text-white'
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-pink-100 animate-in fade-in slide-in-from-top duration-200 shadow-lg">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-center">
            {!isAdminView ? (
              <>
                <button
                  onClick={navigateToHome}
                  className="block w-full px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="block w-full px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('menu')}
                  className="block w-full px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  Menu
                </button>
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="block w-full px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  Gallery
                </button>
                <button
                  onClick={() => scrollToSection('reviews')}
                  className="block w-full px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  Reviews
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block w-full px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  Contact
                </button>

                <a
                  href={`tel:${phone}`}
                  className="mx-auto my-3 flex items-center justify-center gap-2 w-11/12 px-4 py-2.5 rounded-full bg-pink-600 text-white font-medium text-sm shadow"
                >
                  <Phone size={16} />
                  Call Reservations
                </a>
              </>
            ) : (
              <div className="space-y-2 py-4">
                <button
                  onClick={navigateToHome}
                  className="flex items-center justify-center gap-1.5 w-11/12 mx-auto px-4 py-2.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-sm font-medium transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Website
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
