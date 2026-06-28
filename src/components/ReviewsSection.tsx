import React from 'react';
import { Review } from '../types';
import { Star, MessageSquareQuote, Calendar } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  // Only show approved reviews
  const approvedReviews = reviews.filter(r => r.isApproved);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < rating ? 'text-pink-500 fill-pink-500' : 'text-neutral-300'
        }`}
      />
    ));
  };

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  if (approvedReviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      {/* Visual background enhancements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-pink-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 font-sans font-medium text-xs tracking-wider uppercase mb-3">
            <MessageSquareQuote size={12} />
            Guest Testimonials
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-glow">
            What Our Guests Say
          </h2>
          <div className="w-12 h-1 bg-pink-500 mx-auto rounded-full mb-4"></div>
          <p className="font-sans text-neutral-400 text-sm sm:text-base font-light">
            We are honored to be Haridwar's highly rated fine dining destination, beloved by families and tourists alike.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {approvedReviews.map((review) => (
            <div
              key={review.id}
              className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-pink-500/30 transition-all duration-300 relative group"
            >
              {/* Decorative quotation icon */}
              <div className="absolute top-6 right-8 text-neutral-800 group-hover:text-pink-500/10 transition-colors pointer-events-none">
                <MessageSquareQuote size={52} />
              </div>

              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-6">
                  {renderStars(review.rating)}
                </div>

                <p className="font-sans text-neutral-300 text-sm leading-relaxed font-light mb-8 italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Reviewer Meta */}
              <div className="flex items-center gap-3 border-t border-neutral-800/60 pt-6">
                <img
                  src={review.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-pink-500/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80";
                  }}
                />
                <div className="text-left">
                  <h4 className="font-serif text-sm font-semibold text-white">{review.name}</h4>
                  <div className="flex items-center gap-1 text-neutral-500 text-[10px] uppercase font-mono tracking-widest mt-0.5">
                    <Calendar size={10} />
                    <span>{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
