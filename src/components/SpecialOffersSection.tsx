import React, { useState } from 'react';
import { SpecialOffer } from '../types';
import { Tag, Copy, Check, Percent, Gift } from 'lucide-react';

interface SpecialOffersSectionProps {
  offers: SpecialOffer[];
}

export default function SpecialOffersSection({ offers }: SpecialOffersSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeOffers = offers.filter(o => o.isAvailable);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  if (activeOffers.length === 0) return null;

  return (
    <section id="offers" className="py-24 bg-white relative overflow-hidden">
      {/* Curved background line decoration */}
      <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-100 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 font-sans font-medium text-xs tracking-wider uppercase mb-3">
            <Gift size={12} className="animate-bounce" />
            Special Culinary Offers
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Exclusive Deals & Offers
          </h2>
          <div className="w-12 h-1 bg-pink-600 mx-auto rounded-full mb-4"></div>
          <p className="font-sans text-neutral-600 text-sm sm:text-base font-light">
            Indulge in our exquisite gourmet menus with these hand-selected premium benefits for you and your family.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-neutral-50 rounded-3xl border border-pink-100/50 shadow-md overflow-hidden hover:shadow-xl hover:border-pink-200/80 transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Image side */}
              <div className="sm:w-2/5 relative h-48 sm:h-auto min-h-[180px]">
                <img
                  src={offer.imageUrl || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80"}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {offer.badge && (
                  <span className="absolute top-4 left-4 bg-pink-600 text-white font-sans text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                    {offer.badge}
                  </span>
                )}
                {offer.discountPercent && (
                  <div className="absolute bottom-4 right-4 bg-neutral-900/90 text-white backdrop-blur-sm p-2 rounded-xl flex items-center gap-1 border border-white/10">
                    <Percent size={14} className="text-pink-400" />
                    <span className="font-sans font-extrabold text-sm leading-none">{offer.discountPercent}% Off</span>
                  </div>
                )}
              </div>

              {/* Text side */}
              <div className="sm:w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">
                    {offer.title}
                  </h3>
                  <p className="font-sans text-neutral-600 text-sm leading-relaxed font-light mb-6">
                    {offer.description}
                  </p>
                </div>

                {offer.discountCode && (
                  <div className="flex items-center justify-between p-3.5 bg-pink-50/50 rounded-2xl border border-pink-100">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-pink-600" />
                      <div className="text-left">
                        <span className="block font-mono text-[9px] font-semibold text-neutral-400 uppercase tracking-widest leading-none mb-1">Coupon Code</span>
                        <span className="font-mono text-sm font-bold text-neutral-800 tracking-wider select-all">{offer.discountCode}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode(offer.discountCode!, offer.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        copiedId === offer.id
                          ? 'bg-green-50 border-green-200 text-green-600'
                          : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50'
                      }`}
                      title="Copy Code"
                    >
                      {copiedId === offer.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
