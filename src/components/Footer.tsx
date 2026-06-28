/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter, MessageSquare } from 'lucide-react';
import { DatabaseState } from '../types/database';
import { submitToNetlify, sendFormEmail } from '../utils/netlify';

interface FooterProps {
  db: DatabaseState;
  setCurrentPage: (page: string) => void;
  onBookNow: () => void;
  setDb?: (state: DatabaseState) => void;
}

export default function Footer({ db, setCurrentPage, onBookNow, setDb }: FooterProps) {
  const { websiteSettings, contactSettings, socialMediaSettings } = db;

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    const emailVal = emailInput?.value?.trim();
    if (!emailVal) return;

    // Check if duplicate
    const exists = db.subscribers?.some(s => s.email.toLowerCase() === emailVal.toLowerCase());
    if (exists) {
      alert("You are already subscribed to the Spotlight Club!");
      form.reset();
      return;
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      email: emailVal,
      createdAt: new Date().toISOString()
    };

    const nextSubs = [...(db.subscribers || []), newSub];
    if (setDb) {
      setDb({ ...db, subscribers: nextSubs });
    }

    const payload = { email: emailVal };

    // 1. Submit to Netlify Forms via standard helper
    submitToNetlify('newsletter', payload);

    // 2. Dispatch custom HTML newsletter emails
    sendFormEmail('newsletter', payload, db.contactSettings);

    alert("Incredible! You have successfully subscribed to the Spotlight Club. Stay tuned for secret invites!");
    form.reset();
  };

  const quickLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About Us', id: 'about' },
    { label: 'Food Menu', id: 'menu' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Events', id: 'events' },
    { label: 'Contact Us', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    setCurrentPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-gray-300 border-t border-white/10 pt-16 pb-24 md:pb-16 relative" id="website-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Subscription Banner */}
        <div className="border-b border-white/5 pb-10 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-left">
            <h4 className="text-white font-black uppercase text-sm tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-brand rounded-none inline-block animate-pulse"></span>
              <span>Join The Spotlight Club</span>
            </h4>
            <p className="text-gray-400 text-xs font-light">Subscribe to receive exclusive candlelight invitations, seasonal menu updates, and secret chef tastings.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto max-w-md shrink-0 gap-2" name="newsletter" data-netlify="true" data-netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="newsletter" />
            <div className="hidden"><input name="bot-field" /></div>
            <input
              type="email"
              required
              placeholder="Enter email for secret invites"
              className="bg-neutral-900 border border-white/10 text-white px-4 py-3 text-xs focus:outline-none focus:border-brand flex-grow placeholder:text-gray-600 rounded-none font-mono"
            />
            <button type="submit" className="px-5 py-3 bg-brand hover:bg-white hover:text-black text-white text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer">
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand Intro */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-widest text-brand uppercase">
              {websiteSettings.logo}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Step into the limelight of gourmet perfection. Experiencing fine culinary art infused with high-end pink-themed luxury and unforgettable ambiance.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 pt-2">
              {socialMediaSettings.facebook && (
                <a 
                  href={socialMediaSettings.facebook} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-all duration-300"
                  id="social-fb"
                >
                  <Facebook size={16} />
                </a>
              )}
              {socialMediaSettings.instagram && (
                <a 
                  href={socialMediaSettings.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-all duration-300"
                  id="social-ig"
                >
                  <Instagram size={16} />
                </a>
              )}
              {socialMediaSettings.youtube && (
                <a 
                  href={socialMediaSettings.youtube} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-all duration-300"
                  id="social-yt"
                >
                  <Youtube size={16} />
                </a>
              )}
              {socialMediaSettings.twitter && (
                <a 
                  href={socialMediaSettings.twitter} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-all duration-300"
                  id="social-tw"
                >
                  <Twitter size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 border-l-2 border-brand pl-3">
              Quick Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className="hover:text-brand transition-colors duration-200 cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Timing info */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 border-l-2 border-brand pl-3">
              Working Hours
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <Clock size={16} className="text-brand mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-200">Our Timings</p>
                  <p className="text-gray-400 mt-1">{contactSettings.workingHours}</p>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={onBookNow}
                  className="px-4 py-2 text-xs font-semibold tracking-widest uppercase border border-brand bg-brand-10 text-brand hover:bg-brand hover:text-white transition-all duration-300"
                >
                  Schedule Reservation
                </button>
              </div>
            </div>
          </div>

          {/* Column 4: Contact info */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 border-l-2 border-brand pl-3">
              Reach Us
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-brand mt-0.5 shrink-0" />
                <span className="text-gray-400">{contactSettings.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-brand shrink-0" />
                <a href={`tel:${contactSettings.phone}`} className="hover:text-brand text-gray-400 transition-colors duration-200">
                  {contactSettings.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-brand shrink-0" />
                <a href={`mailto:${contactSettings.email}`} className="hover:text-brand text-gray-400 transition-colors duration-200 break-all">
                  {contactSettings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div className="border-t border-white/10 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p className="text-center md:text-left mb-4 md:mb-0 max-w-2xl leading-relaxed">
            {websiteSettings.footerText}
          </p>
          <div className="flex space-x-6">
            <button onClick={() => handleLinkClick('admin')} className="hover:text-brand transition-colors">Admin Area</button>
            <span>•</span>
            <button onClick={() => handleLinkClick('contact')} className="hover:text-brand transition-colors">Find Us</button>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BUTTONS */}
      
      {/* 1. Floating WhatsApp Button - pulsing glowing pink style */}
      <a
        href={`https://wa.me/${contactSettings.whatsapp.replace(/[^0-9]/g, '')}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer group hover:rotate-6"
        id="floating-whatsapp"
        title="Chat on WhatsApp"
        style={{ boxShadow: '0 0 20px rgba(37, 211, 102, 0.5)' }}
      >
        <MessageSquare size={24} className="fill-white/10 group-hover:scale-105" />
        <span className="absolute right-14 bg-black/90 text-white text-[10px] font-bold py-1.5 px-3 uppercase tracking-wider rounded border border-white/10 whitespace-nowrap scale-0 group-hover:scale-100 transition-transform origin-right duration-200 hidden sm:block">
          WhatsApp Chat
        </span>
      </a>

      {/* 2. Floating Call Now Button - visible on mobile screen only */}
      <a
        href={`tel:${contactSettings.phone}`}
        className="fixed bottom-6 left-6 z-50 md:hidden bg-brand text-white p-4 rounded-full shadow-2xl hover:scale-110 flex items-center justify-center cursor-pointer group active:scale-95"
        id="floating-call-now"
        title="Call Limelight"
        style={{ boxShadow: '0 0 20px rgba(255, 20, 147, 0.5)' }}
      >
        <Phone size={24} className="fill-white/10" />
      </a>
    </footer>
  );
}
