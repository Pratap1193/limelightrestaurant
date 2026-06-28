/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Lock, Phone } from 'lucide-react';
import { DatabaseState } from '../types/database';

interface HeaderProps {
  db: DatabaseState;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onBookNow: () => void;
}

export default function Header({ db, currentPage, setCurrentPage, onBookNow }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { websiteSettings, contactSettings } = db;

  const dynamicPages = (db.customPages || [])
    .filter(p => p.isActive)
    .map(p => ({ label: p.title, id: `page-${p.slug}` }));

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About Us', id: 'about' },
    { label: 'Food Menu', id: 'menu' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Events', id: 'events' },
    { label: 'Contact', id: 'contact' },
    ...dynamicPages
  ];

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-2 cursor-pointer group"
            id="header-logo"
          >
            <span className="text-2xl font-black tracking-widest text-brand transition-transform duration-300 group-hover:scale-105">
              {websiteSettings.logo}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center" id="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium tracking-wider uppercase transition-colors duration-200 cursor-pointer ${
                  currentPage === item.id
                    ? 'text-brand font-semibold'
                    : 'text-gray-300 hover:text-brand'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href={`tel:${contactSettings.phone}`} 
              className="flex items-center space-x-1 text-gray-300 hover:text-brand text-sm transition-colors duration-200"
              id="header-phone-link"
            >
              <Phone size={14} className="text-brand" />
              <span>Call Now</span>
            </a>
            
            <button
              id="header-book-btn"
              onClick={onBookNow}
              className="px-5 py-2.5 bg-brand text-white font-semibold text-xs uppercase tracking-wider rounded-none hover:bg-black hover:text-brand border border-brand transition-all duration-300 cursor-pointer glow-btn"
            >
              Book A Table
            </button>

            {/* Admin Quick Lock icon */}
            <button
              id="header-admin-btn"
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
                currentPage === 'admin' ? 'bg-brand text-white' : 'text-gray-400 hover:text-brand hover:bg-white/5'
              }`}
              title="Admin Panel Login"
            >
              <Lock size={16} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              id="header-admin-btn-mobile"
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-full transition-colors duration-200 cursor-pointer ${
                currentPage === 'admin' ? 'bg-brand text-white' : 'text-gray-400 hover:text-brand'
              }`}
            >
              <Lock size={16} />
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-brand hover:bg-white/5 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10" id="mobile-nav-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-mob-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-3 py-3 rounded-none text-base font-medium tracking-wider uppercase transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-brand-10 text-brand border-l-4 border-brand font-semibold'
                    : 'text-gray-300 hover:bg-white/5 hover:text-brand'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 pb-2 border-t border-white/10 px-3 flex flex-col space-y-3">
              <a 
                href={`tel:${contactSettings.phone}`}
                className="flex items-center space-x-2 text-gray-300 hover:text-brand py-2 text-sm"
              >
                <Phone size={16} className="text-brand" />
                <span>Call: {contactSettings.phone}</span>
              </a>
              <button
                id="mobile-book-btn"
                onClick={() => {
                  onBookNow();
                  setIsOpen(false);
                }}
                className="w-full text-center py-3 bg-brand text-white font-semibold text-sm uppercase tracking-wider border border-brand hover:bg-transparent hover:text-brand transition-all duration-300 cursor-pointer"
              >
                Book A Table
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
