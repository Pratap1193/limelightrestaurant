export interface HeroContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaTextSecondary: string;
}

export interface AboutSection {
  title: string;
  subtitle: string;
  story: string;
  features: string[];
  imageUrl: string;
  stats: { label: string; value: string }[];
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // lucide icon name
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categorySlug: string; // matches the slug of MenuCategory
  isAvailable: boolean;
  isVeg: boolean; // Veg vs Non-Veg
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discountCode?: string;
  discountPercent?: number;
  imageUrl: string;
  isAvailable: boolean;
  badge?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  avatarUrl?: string;
  isApproved: boolean;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ContactInfo {
  phone: string;
  address: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  mapEmbedUrl: string;
  whatsappNumber: string; // for click to whatsapp
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
}

export interface OpeningHour {
  day: string;
  hours: string;
  isClosed: boolean;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConnected: boolean;
}

export interface RestaurantData {
  hero: HeroContent;
  about: AboutSection;
  whyChooseUs: WhyChooseUsItem[];
  categories: MenuCategory[];
  menu: MenuItem[];
  gallery: GalleryImage[];
  offers: SpecialOffer[];
  reviews: Review[];
  reservations: Reservation[];
  contact: ContactInfo;
  seo: SEOSettings;
  hours: OpeningHour[];
  supabase: SupabaseConfig;
}
