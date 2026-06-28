import React from 'react';
import { ContactInfo, OpeningHour } from '../types';
import { Phone, MapPin, Mail, Clock, Facebook, Instagram, Twitter, Compass } from 'lucide-react';

interface ContactSectionProps {
  contact: ContactInfo;
  hours: OpeningHour[];
}

export default function ContactSection({ contact, hours }: ContactSectionProps) {
  // Determine if the restaurant is currently open (simple helper)
  const getCurrentStatus = (): { status: 'open' | 'closed'; message: string } => {
    try {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDate = new Date();
      const currentDayName = days[currentDate.getDay()];
      
      const todayHours = hours.find(h => h.day.toLowerCase() === currentDayName.toLowerCase());
      
      if (!todayHours || todayHours.isClosed) {
        return { status: 'closed', message: `Closed today (${currentDayName})` };
      }

      // Parse hours e.g., "4:00 PM - 10:00 PM"
      const hoursStr = todayHours.hours;
      const parts = hoursStr.split('-');
      if (parts.length !== 2) {
        return { status: 'open', message: `Open today: ${hoursStr}` };
      }

      const parseTime = (timeStr: string): number => {
        const cleaned = timeStr.trim().toUpperCase();
        const isPM = cleaned.includes('PM');
        const isAM = cleaned.includes('AM');
        let [time, modifier] = cleaned.split(/\s+/);
        if (!modifier) {
          modifier = isPM ? 'PM' : 'AM';
        }
        
        let [hoursPart, minutesPart] = time.replace(/[APM]/g, '').trim().split(':');
        let hrs = parseInt(hoursPart, 10);
        const mins = minutesPart ? parseInt(minutesPart, 10) : 0;
        
        if (modifier === 'PM' && hrs < 12) hrs += 12;
        if (modifier === 'AM' && hrs === 12) hrs = 0;
        
        return hrs * 60 + mins;
      };

      const nowMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
      const startMinutes = parseTime(parts[0]);
      const endMinutes = parseTime(parts[1]);

      // If closing time is past midnight (e.g., 3:00 PM - 2:00 AM)
      if (endMinutes < startMinutes) {
        if (nowMinutes >= startMinutes || nowMinutes < endMinutes) {
          return { status: 'open', message: `Open until ${parts[1].trim()}` };
        }
      } else {
        if (nowMinutes >= startMinutes && nowMinutes < endMinutes) {
          return { status: 'open', message: `Open until ${parts[1].trim()}` };
        }
      }

      return { status: 'closed', message: `Closed now (Opens tomorrow)` };
    } catch (e) {
      // Best effort fallback
      return { status: 'open', message: 'Open today' };
    }
  };

  const statusInfo = getCurrentStatus();

  return (
    <section id="contact" className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      {/* Decorative vector background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-pink-950/40 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-pink-600/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 font-sans font-medium text-xs tracking-wider uppercase mb-3">
            <Compass size={12} />
            Find Us & Hours
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-glow">
            Hours & Contact Info
          </h2>
          <div className="w-12 h-1 bg-pink-500 mx-auto rounded-full mb-4"></div>
          <p className="font-sans text-neutral-400 text-sm sm:text-base font-light">
            Whether booking an intimate date night or dropping in for an artisan martini, we look forward to hosting you.
          </p>
        </div>

        {/* Dynamic Open/Closed Status Banner */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
            statusInfo.status === 'open' 
              ? 'bg-green-500/5 border-green-500/20 text-green-300' 
              : 'bg-pink-500/5 border-pink-500/20 text-pink-300'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`relative flex h-3.5 w-3.5`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  statusInfo.status === 'open' ? 'bg-green-400' : 'bg-pink-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                  statusInfo.status === 'open' ? 'bg-green-500' : 'bg-pink-500'
                }`}></span>
              </span>
              <div>
                <h4 className="font-sans font-bold uppercase tracking-widest text-xs">Current Status</h4>
                <p className="font-sans text-sm font-medium mt-0.5 text-white">{statusInfo.message}</p>
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              *Hours may vary on holidays. Reservations recommended.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Column 1: Opening Hours */}
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20">
                <Clock size={20} />
              </div>
              <h3 className="font-serif text-xl font-bold tracking-tight text-white">
                Weekly Opening Hours
              </h3>
            </div>

            <div className="space-y-4">
              {hours.map((item) => (
                <div
                  key={item.day}
                  className="flex justify-between items-center py-3 border-b border-neutral-800/50 last:border-0"
                >
                  <span className="font-sans font-medium text-neutral-300 text-sm sm:text-base">
                    {item.day}
                  </span>
                  {item.isClosed ? (
                    <span className="font-mono text-xs text-pink-500 uppercase tracking-widest bg-pink-950/40 px-3 py-1 rounded-full border border-pink-900/40">
                      Closed Today
                    </span>
                  ) : (
                    <span className="font-mono text-sm text-neutral-100">
                      {item.hours}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Contact Details & Map */}
          <div className="space-y-10">
            {/* Contact details cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone Card */}
              <a
                href={`tel:${contact.phone}`}
                className="block p-6 bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800/80 rounded-2xl transition-all duration-300 group"
              >
                <div className="text-pink-500 group-hover:text-pink-400 transition-colors mb-4">
                  <Phone size={24} />
                </div>
                <h4 className="font-serif text-sm font-semibold text-white mb-1">Call Reservations</h4>
                <p className="font-sans text-neutral-400 text-xs sm:text-sm tracking-wide">{contact.phone}</p>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${contact.email}`}
                className="block p-6 bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800/80 rounded-2xl transition-all duration-300 group"
              >
                <div className="text-pink-500 group-hover:text-pink-400 transition-colors mb-4">
                  <Mail size={24} />
                </div>
                <h4 className="font-serif text-sm font-semibold text-white mb-1">Email Inquiry</h4>
                <p className="font-sans text-neutral-400 text-xs sm:text-sm break-all">{contact.email}</p>
              </a>

              {/* Address Card (full width) */}
              <div className="sm:col-span-2 p-6 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl flex items-start gap-4">
                <div className="text-pink-500 mt-1">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white mb-1">Location Address</h4>
                  <p className="font-sans text-neutral-400 text-xs sm:text-sm tracking-wide leading-relaxed">
                    {contact.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons Panel */}
            <div className="flex justify-center sm:justify-start items-center gap-4">
              <span className="font-sans text-xs uppercase text-neutral-500 tracking-widest mr-2">Follow Us</span>
              {contact.facebookUrl && (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900 border border-neutral-800 hover:border-pink-500/50 hover:text-pink-400 text-neutral-400 rounded-full transition-all"
                  title="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
              {contact.instagramUrl && (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900 border border-neutral-800 hover:border-pink-500/50 hover:text-pink-400 text-neutral-400 rounded-full transition-all"
                  title="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {contact.twitterUrl && (
                <a
                  href={contact.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-neutral-900 border border-neutral-800 hover:border-pink-500/50 hover:text-pink-400 text-neutral-400 rounded-full transition-all"
                  title="Twitter"
                >
                  <Twitter size={18} />
                </a>
              )}
            </div>

            {/* Map Frame */}
            {contact.mapEmbedUrl ? (
              <div className="w-full h-64 rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl">
                <iframe
                  src={contact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(300deg) contrast(1.1)' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  title="Limelight Location Map"
                ></iframe>
              </div>
            ) : (
              <div className="w-full h-64 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                <MapPin size={32} className="text-pink-500 mb-2 animate-bounce" />
                <p className="font-sans text-sm font-semibold text-white mb-1">Interactive Map Available</p>
                <p className="font-sans text-xs">Specify a valid Google Maps embed URL in the Admin Panel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
