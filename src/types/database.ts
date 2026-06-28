/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WebsiteSettings {
  restaurantName: string;
  logo: string;
  favicon: string;
  bannerImages: string[];
  themeColor: string; // Hex code, e.g. "#FF1493"
  footerText: string;
  currencySymbol: string;
  currencyCode?: string; // e.g. "INR", "USD" etc.
  currencyPosition?: 'before' | 'after'; // e.g. 'before' or 'after'
}

export interface ContactSettings {
  phone: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: string;
}

export type MenuCategory = string;

export interface MenuCategoryItem {
  id: string;
  name: string;
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  imageUrl: string;
  isChefSpecial: boolean;
  isAvailable: boolean;
  isVeg?: boolean;
  displayOrder?: number;
  // Advanced Future-Proof Fields
  subcategory?: string;
  spicyLevel?: number; // 0 = Not Spicy, 1 = Mild, 2 = Medium, 3 = Hot / Extra Spicy
  prepTime?: string; // e.g., "15-20 mins"
  tags?: string[]; // e.g. ["Gluten-Free", "Nuts-Free", "Signature"]
  discountPrice?: number; // Offer/Discount Price
  additionalImages?: string[]; // Multiple images support
}

export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface Booking {
  id: string;
  guestName: string;
  mobileNumber: string;
  email: string;
  guestsCount: number;
  date: string;
  time: string;
  occasion: string;
  specialRequest: string;
  status: BookingStatus;
  createdAt: string;
  isUnread: boolean; // For admin notifications
}

export interface GalleryFolder {
  id: string;
  name: string;
}

export interface GalleryImage {
  id: string;
  folderId: string;
  imageUrl: string;
  title: string;
  createdAt: string;
}

export interface RestaurantEvent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  time: string;
}

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export interface CustomerReview {
  id: string;
  guestName: string;
  reviewText: string;
  rating: number; // 1 to 5
  status: ReviewStatus;
  createdAt: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTags: string; // JSON or raw string of Open Graph tags
  schemaMarkup: string; // JSON schema structure
  sitemap: string; // XML simulation text
  robotsTxt: string; // robots.txt text
  canonicalUrl: string;
  googleAnalyticsCode: string;
  searchConsoleCode: string;
}

export interface SocialMediaSettings {
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  whatsapp: string;
}

export type AdminRole = 'Super Admin' | 'Admin' | 'Manager' | 'Editor' | 'Staff';

export interface AdminUser {
  id: string;
  username: string;
  password?: string; // Kept optional on reads/transfers for security, but stored in mock db
  role: AdminRole;
  permissions: string[];
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML / Rich text content
  isActive: boolean;
  displayOrder: number;
  customCss?: string;
  customJs?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  isPublished: boolean;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  promoCode?: string;
  imageUrl?: string;
  expiryDate?: string;
  isActive: boolean;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  emailAddress: string;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  smsEnabled: boolean;
  smsNumber: string;
  pushEnabled: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  username: string;
  timestamp: string;
  ipAddress?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  subject: string;
  message: string;
  createdAt: string;
  isUnread: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface TwoFactorSettings {
  isEnabled: boolean;
  secretCode?: string;
}

export interface BookingTimeSlot {
  id: string;
  time: string;
  isBlocked: boolean;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
}

export interface DatabaseState {
  websiteSettings: WebsiteSettings;
  contactSettings: ContactSettings;
  menuItems: MenuItem[];
  menuCategories: MenuCategoryItem[];
  bookings: Booking[];
  galleryFolders: GalleryFolder[];
  galleryImages: GalleryImage[];
  events: RestaurantEvent[];
  reviews: CustomerReview[];
  seoSettings: SEOSettings;
  socialMediaSettings: SocialMediaSettings;
  adminUsers: AdminUser[];
  bookingTimeSlots: BookingTimeSlot[];
  blockedDates: BlockedDate[];
  visitorsCount: number;
  customPages?: CustomPage[];
  blogs?: BlogPost[];
  offers?: SpecialOffer[];
  notificationSettings?: NotificationSettings;
  activityLogs?: ActivityLog[];
  twoFactorSettings?: TwoFactorSettings;
  inquiries?: ContactInquiry[];
  subscribers?: NewsletterSubscriber[];
  blockedSlotsByDate?: string[];
  maxBookingsPerSlot?: number;
}
