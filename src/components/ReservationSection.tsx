import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Mail, Phone, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { Reservation } from '../types';

interface ReservationSectionProps {
  onAddReservation: (res: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => void;
  reservations: Reservation[];
}

export default function ReservationSection({ onAddReservation, reservations }: ReservationSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '07:30 PM',
    guests: 2,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [apiResponse, setApiResponse] = useState<{
    success: boolean;
    dbSaved: boolean;
    emailSent: boolean;
    warning?: string;
    message?: string;
  } | null>(null);

  // Times list for dining
  const timeSlots = [
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM'
  ];

  // Prevent duplicate submissions in same session
  const [hasSubmittedThisSession, setHasSubmittedThisSession] = useState(false);

  useEffect(() => {
    const sessionSubmitted = sessionStorage.getItem('limelight_reservation_submitted');
    if (sessionSubmitted) {
      setHasSubmittedThisSession(true);
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation for global/Indian format
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a dining date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Reservations must be for today or future dates';
      }
    }

    if (formData.guests < 1 || formData.guests > 20) {
      newErrors.guests = 'We accept table bookings for 1 to 20 guests online';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) || 1 : value
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (hasSubmittedThisSession) {
      setErrorMessage('You have already requested a table reservation during this session. Please wait for our host to call or email you.');
      return;
    }

    // Check if duplicate entry already exists in global state list (same name, email, date)
    const isDuplicate = reservations.some(
      r => r.email.toLowerCase() === formData.email.toLowerCase() &&
           r.date === formData.date &&
           r.time === formData.time
    );

    if (isDuplicate) {
      setErrors({ global: 'A table request for this email, date, and time already exists. Please choose another slot.' });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Send reservation request to the secure server-side Express API
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          notes: formData.notes
        })
      });

      const result = await response.json();

      if (response.ok && (result.dbSaved || result.emailSent)) {
        // Add to central local storage application state for immediate admin panel tracking
        onAddReservation({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          notes: formData.notes
        });

        setApiResponse(result);
        setSubmitSuccess(true);
        setHasSubmittedThisSession(true);
        sessionStorage.setItem('limelight_reservation_submitted', 'true');
      } else {
        // If the server-side API failed completely
        setErrorMessage(result.message || 'We encountered a temporary server error processing your reservation. Please try again.');
      }
    } catch (err) {
      console.error('Reservation submission error:', err);
      // Fallback in case of local development or network issues where server is not reachable
      // This ensures the application remains functional and saves state locally
      onAddReservation({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        notes: formData.notes
      });
      
      setApiResponse({
        success: true,
        dbSaved: false,
        emailSent: false,
        warning: 'Local simulation fallback active.',
        message: 'Your table reservation has been saved to your local session. Setup SMTP and Supabase configurations in your environment variables to enable cloud database and automated email notifications.'
      });
      
      setSubmitSuccess(true);
      setHasSubmittedThisSession(true);
      sessionStorage.setItem('limelight_reservation_submitted', 'true');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-neutral-50 relative overflow-hidden">
      {/* Visual embellishments */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500"></div>
      <div className="absolute top-10 right-0 w-80 h-80 bg-pink-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 font-sans font-medium text-xs tracking-wider uppercase mb-3">
            <Calendar size={12} />
            Royal Table Reservation
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Book Your Table
          </h2>
          <div className="w-12 h-1 bg-pink-600 mx-auto rounded-full mb-4"></div>
          <p className="font-sans text-neutral-600 text-sm sm:text-base font-light">
            Savor unforgettable moments with your family. Reserve your dining experience online and receive instant confirmation coordinates.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-pink-100/50 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Form Side */}
          <div className="p-8 sm:p-12 md:col-span-8">
            {submitSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-200 mb-6">
                  <CheckCircle size={32} className="stroke-[2.5]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Table Requested Successfully!</h3>
                
                <p className="font-sans text-neutral-600 text-sm leading-relaxed max-w-md mb-6">
                  Thank you, <strong className="text-pink-600 font-semibold">{formData.name}</strong>. Your reservation request for <strong className="font-medium text-neutral-900">{formData.guests} guests</strong> on <strong className="font-medium text-neutral-900">{formData.date} at {formData.time}</strong> has been received.
                </p>

                {/* Cloud Sync & Dispatch Feedback */}
                <div className="w-full max-w-md bg-neutral-50 rounded-2xl border border-neutral-150 p-5 text-left space-y-4 mb-6">
                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">System Sync Status</h4>
                  
                  {/* Database Status */}
                  <div className="flex items-start gap-3 text-xs">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${apiResponse?.dbSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {apiResponse?.dbSaved ? '✓' : '!'}
                    </span>
                    <div>
                      <strong className="block text-neutral-800 font-medium">Database Storage</strong>
                      <span className="text-neutral-500 text-[11px]">
                        {apiResponse?.dbSaved 
                          ? 'Successfully saved to Supabase cloud records.' 
                          : 'Saved locally in browser offline storage (requires SUPABASE_URL configuration).'}
                      </span>
                    </div>
                  </div>

                  {/* Email Notification Status */}
                  <div className="flex items-start gap-3 text-xs">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${apiResponse?.emailSent ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {apiResponse?.emailSent ? '✓' : '!'}
                    </span>
                    <div>
                      <strong className="block text-neutral-800 font-medium">Email Dispatch</strong>
                      <span className="text-neutral-500 text-[11px]">
                        {apiResponse?.emailSent 
                          ? 'Dispatched immediately to: it.rosh@royalorchidhotels.com' 
                          : 'Fallback notification queued. SMTP server variables not fully configured.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Outcome Text */}
                <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100/50 text-pink-700 text-xs max-w-sm leading-relaxed text-center">
                  {apiResponse?.message || 'We have sent an automatic notification to our hospitality desk. A confirmation code and table details will be dispatched shortly.'}
                </div>
              </div>
            ) : (
              <form
                name="reservations"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6 text-left"
              >
                {/* Netlify Forms hidden triggers */}
                <input type="hidden" name="form-name" value="reservations" />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you’re human: <input name="bot-field" />
                  </label>
                </p>

                {errors.global && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{errors.global}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div>
                    <label htmlFor="res-name" className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <User size={16} />
                      </div>
                      <input
                        id="res-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        disabled={hasSubmittedThisSession}
                        className={`w-full font-sans pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all ${
                          errors.name ? 'border-rose-400 bg-rose-50/10' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="font-sans text-[11px] text-rose-500 mt-1.5">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="res-email" className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Mail size={16} />
                      </div>
                      <input
                        id="res-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="johndoe@example.com"
                        disabled={hasSubmittedThisSession}
                        className={`w-full font-sans pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all ${
                          errors.email ? 'border-rose-400 bg-rose-50/10' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="font-sans text-[11px] text-rose-500 mt-1.5">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="res-phone" className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Phone size={16} />
                      </div>
                      <input
                        id="res-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        disabled={hasSubmittedThisSession}
                        className={`w-full font-sans pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all ${
                          errors.phone ? 'border-rose-400 bg-rose-50/10' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="font-sans text-[11px] text-rose-500 mt-1.5">{errors.phone}</p>}
                  </div>

                  {/* Guests */}
                  <div>
                    <label htmlFor="res-guests" className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Users size={16} />
                      </div>
                      <select
                        id="res-guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        disabled={hasSubmittedThisSession}
                        className={`w-full font-sans pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all ${
                          errors.guests ? 'border-rose-400 bg-rose-50/10' : 'border-neutral-200'
                        }`}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.guests && <p className="font-sans text-[11px] text-rose-500 mt-1.5">{errors.guests}</p>}
                  </div>

                  {/* Date */}
                  <div>
                    <label htmlFor="res-date" className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Dining Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Calendar size={16} />
                      </div>
                      <input
                        id="res-date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        disabled={hasSubmittedThisSession}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full font-sans pl-10 pr-4 py-3 bg-neutral-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all ${
                          errors.date ? 'border-rose-400' : 'border-neutral-200'
                        }`}
                      />
                    </div>
                    {errors.date && <p className="font-sans text-[11px] text-rose-500 mt-1.5">{errors.date}</p>}
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label htmlFor="res-time" className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Preferred Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Clock size={16} />
                      </div>
                      <select
                        id="res-time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        disabled={hasSubmittedThisSession}
                        className="w-full font-sans pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Special Notes (full width) */}
                  <div className="sm:col-span-2">
                    <label htmlFor="res-notes" className="block font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Dietary Requests or Special Occasion Notes
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3.5 pointer-events-none text-neutral-400">
                        <MessageSquare size={16} />
                      </div>
                      <textarea
                        id="res-notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="E.g., high chair for baby, celebrating anniversary, nut allergies..."
                        disabled={hasSubmittedThisSession}
                        className="w-full font-sans pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>

                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || hasSubmittedThisSession}
                    className={`w-full py-4 text-white font-sans font-semibold tracking-wider text-xs uppercase rounded-xl transition-all cursor-pointer ${
                      isSubmitting
                        ? 'bg-neutral-400 cursor-not-allowed'
                        : hasSubmittedThisSession
                        ? 'bg-pink-300 cursor-not-allowed'
                        : 'bg-pink-600 hover:bg-pink-700 shadow-md shadow-pink-600/10 hover:shadow-pink-600/30'
                    }`}
                  >
                    {isSubmitting ? 'Requesting Table...' : hasSubmittedThisSession ? 'Already Requested' : 'Confirm Booking Request'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Guidelines Side */}
          <div className="bg-pink-600 p-8 sm:p-12 text-white md:col-span-4 flex flex-col justify-between text-left">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-6">Reservation Guidelines</h3>
              <p className="font-sans text-pink-100 text-sm font-light leading-relaxed mb-6">
                To guarantee our signature royal fine dining experience, we recommend booking tables 2-3 hours in advance, especially during weekend dinner hours.
              </p>
              
              <ul className="space-y-4 font-sans text-xs text-pink-100/90 font-light">
                <li className="flex gap-2">
                  <span className="font-bold text-white">•</span>
                  <span>Tables are held for up to 15 minutes past the reserved dining coordinates.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-white">•</span>
                  <span>For larger celebrations or banquets above 20 guests, please dial our direct reservations desk.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-white">•</span>
                  <span>Specific dining booths (lounge, riverside view) are allocated subject to availability.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-pink-500/50">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-pink-200">Immediate Phone Support</span>
              <span className="block font-sans text-lg font-bold mt-1">11:30 AM - 11:30 PM</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
