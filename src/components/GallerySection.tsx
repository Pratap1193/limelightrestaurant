import React, { useState } from 'react';
import { GalleryImage } from '../types';
import { Camera, X, ChevronLeft, ChevronRight, Instagram, Heart, MessageCircle } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryImage[];
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Simulated Instagram posts with luxury styling
  const instagramPosts = [
    {
      id: "insta-1",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      caption: "An unforgettable family evening. Savoring the Royal Shahi Thali in our custom glowing pink seating booths.",
      likes: "1,248",
      comments: "42",
      hashtag: "#HaridwarFineDining"
    },
    {
      id: "insta-2",
      imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
      caption: "Plated to perfection. Our signature Truffle Burrata and Ruby Chocolate fondant is currently trending.",
      likes: "932",
      comments: "18",
      hashtag: "#LimelightSignature"
    },
    {
      id: "insta-3",
      imageUrl: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80",
      caption: "Sip in style. Indulge in the sparkling Rose Quartz botanical cooler mocktail, custom crafted for wellness.",
      likes: "1,540",
      comments: "56",
      hashtag: "#RoseQuartzCooler"
    },
    {
      id: "insta-4",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      caption: "Step inside Uttarakhand's most photogenic luxury family salon. Ambiance curated for golden memories.",
      likes: "2,056",
      comments: "84",
      hashtag: "#LimelightAmbiance"
    }
  ];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % gallery.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + gallery.length) % gallery.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-sans font-medium text-xs tracking-wider uppercase mb-3">
            <Camera size={12} />
            Atmosphere & Details
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Our Gallery
          </h2>
          <div className="w-12 h-1 bg-pink-500 mx-auto rounded-full mb-4"></div>
          <p className="font-sans text-neutral-600 text-sm sm:text-base font-light">
            A visual journey inside the pink-lit architecture of Limelight, capturing moments of elegance, velvet comfort, and culinary arts.
          </p>
        </div>

        {/* Gallery Grid */}
        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {gallery.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(index)}
                className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <img
                  src={image.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"}
                  alt={image.caption || "Limelight Gallery"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {/* Elegant overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-950/80 via-pink-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                  <p className="font-sans font-semibold text-white text-sm tracking-wide translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {image.caption || "View Atmosphere"}
                  </p>
                  <span className="font-mono text-pink-300 text-[10px] uppercase tracking-widest mt-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    Click to Enlarge
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-pink-50/20 rounded-3xl border border-pink-100/30 p-8 mb-24">
            <p className="text-neutral-500 text-lg mb-2">No gallery images</p>
            <p className="text-neutral-400 text-sm max-w-md mx-auto">
              Gallery is currently empty. Head over to the Admin Panel to upload or add new images.
            </p>
          </div>
        )}

        {/* INSTAGRAM GALLERY BLOCK */}
        <div className="pt-16 border-t border-pink-100/50">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-600 font-sans font-medium text-xs tracking-wider uppercase mb-3">
              <Instagram size={12} />
              Instagram Moments
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              Follow Our Story
            </h3>
            <p className="font-sans text-neutral-500 text-xs sm:text-sm mt-2 font-light">
              Join our online family of 15k+ luxury diners. Capture your tables with hashtag <strong className="text-pink-600">#LimelightHaridwar</strong>.
            </p>
          </div>

          {/* Insta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href="https://instagram.com/limelight.haridwar"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-pink-50"
              >
                <img
                  src={post.imageUrl}
                  alt="Limelight Instagram Post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Simulated Instagram Interface Layer on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-left">
                  <div className="flex items-center gap-2 text-white/90">
                    <Instagram size={16} />
                    <span className="font-sans text-xs font-semibold">@limelight.haridwar</span>
                  </div>

                  <div>
                    <p className="font-sans text-white text-xs leading-relaxed line-clamp-3 mb-3">
                      {post.caption}
                    </p>
                    <span className="font-sans text-pink-400 text-xs font-medium block mb-4">
                      {post.hashtag}
                    </span>

                    <div className="flex items-center gap-4 text-white/90 border-t border-white/10 pt-3">
                      <div className="flex items-center gap-1 text-xs">
                        <Heart size={14} className="fill-pink-500 stroke-pink-500" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <MessageCircle size={14} />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://instagram.com/limelight.haridwar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-pink-200 hover:border-pink-500 text-pink-600 hover:bg-pink-50 font-sans font-semibold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
            >
              <Instagram size={14} />
              Follow @limelight.haridwar
            </a>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-sm flex flex-col justify-center items-center p-4 animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50 animate-in fade-in zoom-in"
          >
            <X size={24} />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={showPrev}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            title="Previous Image"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={showNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            title="Next Image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Lightbox Content */}
          <div className="max-w-4xl w-full flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative max-h-[75vh] max-w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img
                src={gallery[selectedImageIndex].imageUrl}
                alt={gallery[selectedImageIndex].caption}
                className="max-h-[75vh] max-w-full object-contain mx-auto"
              />
            </div>
            
            {/* Caption & Counter */}
            {gallery[selectedImageIndex].caption && (
              <div className="text-center max-w-2xl px-4">
                <p className="text-white font-sans text-base font-light tracking-wide text-glow">
                  {gallery[selectedImageIndex].caption}
                </p>
                <span className="inline-block mt-2 font-mono text-[11px] text-pink-400 uppercase tracking-widest bg-pink-950/50 px-3 py-1 rounded-full">
                  Image {selectedImageIndex + 1} of {gallery.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
