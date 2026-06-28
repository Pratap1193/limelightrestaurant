/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatabaseState, MenuItem, MenuCategoryItem, Booking, GalleryFolder, GalleryImage, RestaurantEvent, CustomerReview, SEOSettings, SocialMediaSettings, WebsiteSettings, ContactSettings, AdminUser } from '../types/database';

const LOCAL_STORAGE_KEY = 'limelight_restaurant_db';

// Pre-seeded high quality mock images from Unsplash
const SEED_IMAGES = {
  hero1: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
  hero2: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
  hero3: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80',
  
  starter: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  soup: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
  indian: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
  chinese: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  continental: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  maincourse: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
  dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
  beverage: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',

  dj_night: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  live_music: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
  birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
  corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
  private_event: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80',

  interior1: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  interior2: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
  interior3: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'
};

const DEFAULT_SEED_DATA: DatabaseState = {
  websiteSettings: {
    restaurantName: 'Limelight Restaurant',
    logo: '✨ LIMELIGHT',
    favicon: '✨',
    bannerImages: [SEED_IMAGES.hero1, SEED_IMAGES.hero2, SEED_IMAGES.hero3],
    themeColor: '#FF1493',
    footerText: '© 2026 Limelight Restaurant. All rights reserved. Crafting culinary experiences for connoisseurs of taste.',
    currencySymbol: '₹',
    currencyCode: 'INR',
    currencyPosition: 'before'
  },
  contactSettings: {
    phone: '+1 (555) 123-4567',
    mobile: '+1 (555) 987-6543',
    whatsapp: '+15559876543',
    email: 'info@limelightrestaurant.com',
    address: '456 Luxury Avenue, Suite 100, Gourmet District, NY 10013',
    workingHours: 'Mon - Sun: 11:00 AM - 11:00 PM'
  },
  menuCategories: [
    { id: 'cat-1', name: 'Starters', displayOrder: 1 },
    { id: 'cat-2', name: 'Soups', displayOrder: 2 },
    { id: 'cat-3', name: 'Indian Cuisine', displayOrder: 3 },
    { id: 'cat-4', name: 'Chinese Cuisine', displayOrder: 4 },
    { id: 'cat-5', name: 'Continental', displayOrder: 5 },
    { id: 'cat-6', name: 'Main Course', displayOrder: 6 },
    { id: 'cat-7', name: 'Desserts', displayOrder: 7 },
    { id: 'cat-8', name: 'Beverages', displayOrder: 8 }
  ],
  menuItems: [
    // Starters
    {
      id: 'menu-1',
      name: 'Paneer Tikka',
      category: 'Starters',
      description: 'Cottage cheese chunks marinated in spiced yogurt and grilled in a traditional tandoor.',
      price: 350.00,
      imageUrl: SEED_IMAGES.starter,
      isChefSpecial: true,
      isAvailable: true,
      isVeg: true,
      displayOrder: 1
    },
    {
      id: 'menu-2',
      name: 'Crispy Chili Babycorn',
      category: 'Starters',
      description: 'Tender babycorn tossed in a tangy schezwan glaze with peppers and spring onions.',
      price: 290.00,
      imageUrl: SEED_IMAGES.starter,
      isChefSpecial: false,
      isAvailable: true,
      isVeg: true,
      displayOrder: 2
    },
    // Soups
    {
      id: 'menu-3',
      name: 'Pink Tomato & Basil Shurpa',
      category: 'Soups',
      description: 'Velvety roasted heirloom tomato soup infused with basil oil, pink salt, and microgreens.',
      price: 220.00,
      imageUrl: SEED_IMAGES.soup,
      isChefSpecial: true,
      isAvailable: true,
      isVeg: true,
      displayOrder: 1
    },
    {
      id: 'menu-4',
      name: 'Classic Hot & Sour Veg Soup',
      category: 'Soups',
      description: 'A spicy and tangy broth packed with fresh shiitake mushrooms, bamboo shoots, and tofu.',
      price: 180.00,
      imageUrl: SEED_IMAGES.soup,
      isChefSpecial: false,
      isAvailable: true,
      isVeg: true,
      displayOrder: 2
    },
    // Indian Cuisine
    {
      id: 'menu-5',
      name: 'Butter Chicken',
      category: 'Indian Cuisine',
      description: 'Tandoori chicken pieces simmered in a rich, creamy tomato gravy topped with real butter.',
      price: 650.00,
      imageUrl: SEED_IMAGES.indian,
      isChefSpecial: true,
      isAvailable: true,
      isVeg: false,
      displayOrder: 1
    },
    {
      id: 'menu-6',
      name: 'Dal Makhani Bukhara',
      category: 'Indian Cuisine',
      description: 'Black lentils slow-cooked for 24 hours over charcoal with spices, butter, and heavy cream.',
      price: 420.00,
      imageUrl: SEED_IMAGES.indian,
      isChefSpecial: false,
      isAvailable: true,
      isVeg: true,
      displayOrder: 2
    },
    // Chinese Cuisine
    {
      id: 'menu-7',
      name: 'Diced Chili Chicken Gravy',
      category: 'Chinese Cuisine',
      description: 'Succulent chicken chunks cooked with dark soy, fresh chilies, green bell peppers, and garlic.',
      price: 520.00,
      imageUrl: SEED_IMAGES.chinese,
      isChefSpecial: false,
      isAvailable: true,
      isVeg: false,
      displayOrder: 1
    },
    {
      id: 'menu-8',
      name: 'Limelight Veg Hakka Noodles',
      category: 'Chinese Cuisine',
      description: 'Wok-tossed noodles with shredded bell peppers, cabbage, carrots, and a hint of sesame oil.',
      price: 320.00,
      imageUrl: SEED_IMAGES.chinese,
      isChefSpecial: false,
      isAvailable: true,
      isVeg: true,
      displayOrder: 2
    },
    // Continental
    {
      id: 'menu-9',
      name: 'Grilled Salmon with Lemon Butter',
      category: 'Continental',
      description: 'Pan-roasted Norwegian salmon served on a bed of mashed potatoes and charred asparagus with emulsion.',
      price: 890.00,
      imageUrl: SEED_IMAGES.continental,
      isChefSpecial: true,
      isAvailable: true,
      isVeg: false,
      displayOrder: 1
    },
    {
      id: 'menu-10',
      name: 'Limelight Pink Sauce Pasta',
      category: 'Continental',
      description: 'Penne pasta cooked in a harmonious blend of tomato marinara and creamy Alfredo, garnished with parmesan.',
      price: 450.00,
      imageUrl: SEED_IMAGES.continental,
      isChefSpecial: false,
      isAvailable: true,
      isVeg: true,
      displayOrder: 2
    },
    // Main Course
    {
      id: 'menu-11',
      name: 'Veg Biryani',
      category: 'Main Course',
      description: 'Fragrant basmati rice layered with garden vegetables, saffron, and aromatic spices cooked under dum.',
      price: 450.00,
      imageUrl: SEED_IMAGES.maincourse,
      isChefSpecial: false,
      isAvailable: true,
      isVeg: true,
      displayOrder: 1
    },
    {
      id: 'menu-12',
      name: 'Chef Specialty Paneer Lababdar',
      category: 'Main Course',
      description: 'Cottage cheese cubes folded into a luxurious gravy of onions, tomatoes, cashews, and grated paneer.',
      price: 440.00,
      imageUrl: SEED_IMAGES.maincourse,
      isChefSpecial: true,
      isAvailable: true,
      isVeg: true,
      displayOrder: 2
    },
    // Desserts
    {
      id: 'menu-13',
      name: 'Pink Velvet Mousse Cake',
      category: 'Desserts',
      description: 'Light, fluffy pink-tinted white chocolate mousse layered with velvet cake crumble and gold flakes.',
      price: 280.00,
      imageUrl: SEED_IMAGES.dessert,
      isChefSpecial: true,
      isAvailable: true,
      isVeg: true,
      displayOrder: 1
    },
    {
      id: 'menu-14',
      name: 'Sizzling Brownie with Vanilla Ice Cream',
      category: 'Desserts',
      description: 'Warm fudge brownie served on a sizzling hot iron plate with hot fudge and premium vanilla gelato.',
      price: 320.00,
      imageUrl: SEED_IMAGES.dessert,
      isChefSpecial: false,
      isAvailable: true,
      isVeg: true,
      displayOrder: 2
    },
    // Beverages
    {
      id: 'menu-15',
      name: 'Limelight Signature Pink Mojito',
      category: 'Beverages',
      description: 'Refreshing blend of wild raspberries, freshly squeezed lime, mint leaves, and sparkling club soda.',
      price: 240.00,
      imageUrl: SEED_IMAGES.beverage,
      isChefSpecial: true,
      isAvailable: true,
      isVeg: true,
      displayOrder: 1
    },
    {
      id: 'menu-16',
      name: 'Fresh Crimson Watermelon Cooler',
      category: 'Beverages',
      description: 'Fresh watermelon juice muddled with black salt, lemon, and sweet basil seeds.',
      price: 180.00,
      imageUrl: SEED_IMAGES.beverage,
      isChefSpecial: false,
      isAvailable: true,
      isVeg: true,
      displayOrder: 2
    }
  ],
  bookings: [
    {
      id: 'book-1',
      guestName: 'Richard Hendrick',
      mobileNumber: '+1 (555) 234-5678',
      email: 'richard@piedpiper.com',
      guestsCount: 4,
      date: '2026-07-04',
      time: '19:30',
      occasion: 'Anniversary',
      specialRequest: 'Prefer a booth in the corner, and a surprise dessert for my wife.',
      status: 'Approved',
      createdAt: '2026-06-25T14:32:00Z',
      isUnread: false
    },
    {
      id: 'book-2',
      guestName: 'Erlich Bachman',
      mobileNumber: '+1 (555) 876-5432',
      email: 'bachmanity@aviato.com',
      guestsCount: 8,
      date: '2026-07-10',
      time: '20:00',
      occasion: 'Birthday Party',
      specialRequest: 'Need the premium lounge table with extra pink mojitos on arrival.',
      status: 'Pending',
      createdAt: '2026-06-26T08:15:00Z',
      isUnread: true
    },
    {
      id: 'book-3',
      guestName: 'Monica Hall',
      mobileNumber: '+1 (555) 432-1098',
      email: 'monica@raviga.com',
      guestsCount: 2,
      date: '2026-06-28',
      time: '13:00',
      occasion: 'Corporate Lunch',
      specialRequest: 'Quiet table for a fast business discussion.',
      status: 'Pending',
      createdAt: '2026-06-26T09:40:00Z',
      isUnread: true
    }
  ],
  galleryFolders: [
    { id: 'fold-1', name: 'Restaurant Interior' },
    { id: 'fold-2', name: 'Food Gallery' },
    { id: 'fold-3', name: 'Events Gallery' },
    { id: 'fold-4', name: 'Party Gallery' },
    { id: 'fold-5', name: 'Special Events' }
  ],
  galleryImages: [
    {
      id: 'img-1',
      folderId: 'fold-1',
      imageUrl: SEED_IMAGES.interior1,
      title: 'Our Premium Dining Salon',
      createdAt: '2026-06-01T10:00:00Z'
    },
    {
      id: 'img-2',
      folderId: 'fold-1',
      imageUrl: SEED_IMAGES.interior2,
      title: 'Limelight Bar & Lounge',
      createdAt: '2026-06-01T10:05:00Z'
    },
    {
      id: 'img-3',
      folderId: 'fold-1',
      imageUrl: SEED_IMAGES.interior3,
      title: 'Cozy Private Dining Table',
      createdAt: '2026-06-01T10:10:00Z'
    },
    {
      id: 'img-4',
      folderId: 'fold-2',
      imageUrl: SEED_IMAGES.starter,
      title: 'Appetizers Platter',
      createdAt: '2026-06-02T12:00:00Z'
    },
    {
      id: 'img-5',
      folderId: 'fold-2',
      imageUrl: SEED_IMAGES.continental,
      title: 'Norwegian Grilled Salmon',
      createdAt: '2026-06-02T12:15:00Z'
    },
    {
      id: 'img-6',
      folderId: 'fold-2',
      imageUrl: SEED_IMAGES.dessert,
      title: 'Fudge Brownie Sizzler',
      createdAt: '2026-06-02T12:20:00Z'
    },
    {
      id: 'img-7',
      folderId: 'fold-3',
      imageUrl: SEED_IMAGES.live_music,
      title: 'Acoustic Jazz Duo Performance',
      createdAt: '2026-06-03T20:00:00Z'
    },
    {
      id: 'img-8',
      folderId: 'fold-4',
      imageUrl: SEED_IMAGES.dj_night,
      title: 'High-energy DJ Dance Floor',
      createdAt: '2026-06-04T22:30:00Z'
    }
  ],
  events: [
    {
      id: 'event-1',
      title: 'Weekly Saturday DJ Night',
      description: 'Step into the spotlight and dance your worries away with our international live guest DJs. Customized ultraviolet lighting, premium high-octane cocktails, and electric party energy.',
      imageUrl: SEED_IMAGES.dj_night,
      date: 'Every Saturday',
      time: '09:00 PM - 02:00 AM'
    },
    {
      id: 'event-2',
      title: 'Friday Night Acoustic & Jazz Sessions',
      description: 'Wind down your hectic work week with soothing acoustic soul tunes and classic jazz standards performed live by local and national acoustic bands, perfect for date nights.',
      imageUrl: SEED_IMAGES.live_music,
      date: 'Every Friday',
      time: '07:30 PM - 10:30 PM'
    },
    {
      id: 'event-3',
      title: 'Bespoke Birthday Party Bookings',
      description: 'Celebrate your special day with our unique pink theme setups! Includes tailor-made chef menus, dynamic visual light backdrops, floral and balloon design setups, and direct audio-visual hosting support.',
      imageUrl: SEED_IMAGES.birthday,
      date: 'By Reservation',
      time: 'Custom Slots Available'
    },
    {
      id: 'event-4',
      title: 'Elite Corporate Events & Conferences',
      description: 'Elevate your brand or pitch meetings with high-definition presentation screens, modular seating setups, high-speed Wi-Fi, and personalized catering tailored to impress key clients.',
      imageUrl: SEED_IMAGES.corporate,
      date: 'By Reservation',
      time: 'All Day Slots'
    },
    {
      id: 'event-5',
      title: 'Exclusive Lounge Private Socials',
      description: 'Rent our signature Private Dining Lounge for intimate wedding parties, engagement celebrations, reunions, or wine tastings. Fully staffed with dedicated VIP service teams.',
      imageUrl: SEED_IMAGES.private_event,
      date: 'By Reservation',
      time: 'Evening Sessions'
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      guestName: 'Jessica Sterling',
      reviewText: 'Limelight is simply outstanding. The pink ambiance is so luxury, chic, and photogenic. The Beetroot Tikki and Pink Mojito are absolute crowd-pleasers. Service is top-tier!',
      rating: 5,
      status: 'Approved',
      createdAt: '2026-06-24T18:30:00Z'
    },
    {
      id: 'rev-2',
      guestName: 'Chef Michael Thorne',
      reviewText: 'As a fellow culinary professional, I am rarely impressed, but the Norwegian Grilled Salmon was cooked to sheer perfection. The lemon butter sauce was silky and highly balanced.',
      rating: 5,
      status: 'Approved',
      createdAt: '2026-06-25T11:45:00Z'
    },
    {
      id: 'rev-3',
      guestName: 'Alexander Drake',
      reviewText: 'Great spot for corporate lunches or intimate dates. The Butter Chicken has that rich charcoal smokiness which is highly authentic. Definitely recommending to my peers.',
      rating: 4,
      status: 'Approved',
      createdAt: '2026-06-25T20:10:00Z'
    },
    {
      id: 'rev-4',
      guestName: 'Rachel Green',
      reviewText: 'Loved the DJ night! The music was superb and the cocktails keep pouring. A little bit loud if you are trying to talk, but perfect if you want to party hard. 10/10!',
      rating: 5,
      status: 'Pending',
      createdAt: '2026-06-26T01:20:00Z'
    }
  ],
  seoSettings: {
    metaTitle: 'Limelight Restaurant - Premium Luxury Fine Dining & Cocktail Lounge',
    metaDescription: 'Experience the heights of luxury gastronomy at Limelight Restaurant. Offering masterfully crafted Indian, Continental, and Chinese cuisine with premium pink theme aesthetics and custom events.',
    metaKeywords: 'Limelight Restaurant, luxury restaurant, fine dining, pink theme, best indian cuisine, continental grill, reservation, DJ night, cocktail bar, party hall',
    ogTags: '<meta property="og:title" content="Limelight Restaurant" />\n<meta property="og:description" content="Gourmet Dining in a Luxury Pink Theme Lounge." />\n<meta property="og:image" content="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" />\n<meta property="og:type" content="restaurant" />',
    schemaMarkup: '{\n  "@context": "https://schema.org",\n  "@type": "Restaurant",\n  "name": "Limelight Restaurant",\n  "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",\n  "address": {\n    "@type": "PostalAddress",\n    "streetAddress": "456 Luxury Avenue",\n    "addressLocality": "Gourmet District",\n    "addressRegion": "NY",\n    "postalCode": "10013"\n  },\n  "telephone": "+1-555-123-4567"\n}',
    robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin',
    sitemap: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://limelightrestaurant.com/</loc><priority>1.0</priority></url>\n  <url><loc>https://limelightrestaurant.com/menu</loc><priority>0.8</priority></url>\n</urlset>',
    canonicalUrl: 'https://limelightrestaurant.com/',
    googleAnalyticsCode: "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-XYZ123456');",
    searchConsoleCode: '<meta name="google-site-verification" content="limelight-site-verification-id-6789" />'
  },
  socialMediaSettings: {
    facebook: 'https://facebook.com/limelightrestaurant',
    instagram: 'https://instagram.com/limelightrestaurant',
    youtube: 'https://youtube.com/c/limelightrestaurant',
    twitter: 'https://twitter.com/limelightrest',
    whatsapp: 'https://wa.me/15559876543'
  },
  adminUsers: [
    {
      id: 'admin-1',
      username: 'admin',
      password: 'admin', // Kept simple as requested for admin login demonstration
      role: 'Super Admin',
      permissions: ['ALL']
    },
    {
      id: 'admin-2',
      username: 'manager',
      password: 'managerpassword',
      role: 'Manager',
      permissions: ['RESERVATIONS', 'MENU', 'GALLERY']
    }
  ],
  bookingTimeSlots: [
    { id: 'slot-1', time: '12:00 PM', isBlocked: false },
    { id: 'slot-2', time: '12:30 PM', isBlocked: false },
    { id: 'slot-3', time: '01:00 PM', isBlocked: false },
    { id: 'slot-4', time: '01:30 PM', isBlocked: false },
    { id: 'slot-5', time: '02:00 PM', isBlocked: false },
    { id: 'slot-6', time: '02:30 PM', isBlocked: false },
    { id: 'slot-7', time: '07:00 PM', isBlocked: false },
    { id: 'slot-8', time: '07:30 PM', isBlocked: false },
    { id: 'slot-9', time: '08:00 PM', isBlocked: false },
    { id: 'slot-10', time: '08:30 PM', isBlocked: false },
    { id: 'slot-11', time: '09:00 PM', isBlocked: false },
    { id: 'slot-12', time: '09:30 PM', isBlocked: false },
    { id: 'slot-13', time: '10:00 PM', isBlocked: false }
  ],
  blockedDates: [
    { id: 'block-1', date: '2026-07-04', reason: 'Independence Day Private Event' }
  ],
  visitorsCount: 1424,
  customPages: [
    {
      id: 'page-1',
      title: 'Our Journey',
      slug: 'our-journey',
      content: '<h2 class="text-white text-3xl font-black mb-4 uppercase tracking-widest text-brand">A Legacy of Taste & Grandeur</h2><p class="text-gray-300 text-sm leading-relaxed mb-6">Since our inception in 2012, Limelight has stood at the crossroads of theatrical elegance and premium culinary creation. We strive to present dishes that represent more than simple cooking; they are expressions of culture, stories of heritage, and moments of visual marvel.</p><div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8"><div class="border border-white/10 p-5 bg-white/[0.02]"><h4 class="text-white font-bold uppercase tracking-widest text-sm mb-2">Our Culinary Mission</h4><p class="text-gray-400 text-xs leading-relaxed">To blend heritage Indian spice blends with progressive cooking styles, delivering plate presentations that rival modern high-art galleries.</p></div><div class="border border-white/10 p-5 bg-white/[0.02]"><h4 class="text-white font-bold uppercase tracking-widest text-sm mb-2">Authentic Ingredients</h4><p class="text-gray-400 text-xs leading-relaxed">Sourcing high-aromatic spices directly from organic estates across India, hand-ground to retain natural therapeutic oils.</p></div></div><p class="text-gray-300 text-sm leading-relaxed">Under the orchestration of our culinary director, every service at Limelight becomes a shared journey. We invite you to experience the harmony of ambient strings, beautiful pastel design, and sensory gastronomy.</p>',
      isActive: true,
      displayOrder: 1
    }
  ],
  blogs: [
    {
      id: 'blog-1',
      title: 'The Alchemy of Royal Spices: From Estate to Table',
      content: 'True Indian gastronomy begins in the spice soils. In this piece, we explore the science behind cold-grinding whole seeds. Unlike high-speed commercial mills which heat spice oils and dry out aromatics, our chefs use traditional manual stone mortars. This guarantees that your tandoori items retain their natural sweetness and therapeutic qualities.',
      imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
      category: 'Gastronomy Secrets',
      createdAt: '2026-06-25T14:30:00Z',
      isPublished: true
    },
    {
      id: 'blog-2',
      title: 'Visual Plating: Designing Sensory Experiences on Black Ceramics',
      content: 'We eat with our eyes first. Our plate structures utilize negative space, organic microgreens, and signature saffron streaks to establish contrast. Discover how our chefs treat black slate stone platters as physical canvases to construct dishes that look as spectacular as they taste.',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      category: 'Culinary Art',
      createdAt: '2026-06-20T10:15:00Z',
      isPublished: true
    }
  ],
  offers: [
    {
      id: 'offer-1',
      title: 'Monsoon Feast & Platter Special',
      description: 'Unlock a flat 15% discount on all premium tandoori platters and signature chef special grills.',
      discountPercentage: 15,
      promoCode: 'RAINY15',
      expiryDate: '2026-08-31',
      isActive: true
    },
    {
      id: 'offer-2',
      title: 'Midweek Candlelight Romance',
      description: 'Receive a complimentary chocolate-lava soufflé and two premium mocktails with any dinner table booking on Wednesdays.',
      discountPercentage: 0,
      promoCode: 'CANDLE',
      expiryDate: '2026-12-31',
      isActive: true
    }
  ],
  notificationSettings: {
    emailEnabled: true,
    emailAddress: 'manager@limelightrestaurant.com',
    whatsappEnabled: true,
    whatsappNumber: '+15559876543',
    smsEnabled: false,
    smsNumber: '',
    pushEnabled: true
  },
  activityLogs: [
    {
      id: 'log-1',
      action: 'Super Admin Login Successful',
      username: 'admin',
      timestamp: '2026-06-26T04:30:00Z',
      ipAddress: '192.168.1.1'
    }
  ],
  twoFactorSettings: {
    isEnabled: false,
    secretCode: 'LIME-7890'
  },
  inquiries: [
    {
      id: 'inq-1',
      name: 'Sarah Connor',
      email: 'sarah.connor@cyberdyne.com',
      mobileNumber: '+1 (555) 901-2345',
      subject: 'Corporate Gala Booking Query',
      message: 'We are looking to host an exclusive private event for our tech executives in late July. Can you accommodate a custom menu with matching wines?',
      createdAt: '2026-06-25T11:00:00Z',
      isUnread: true
    },
    {
      id: 'inq-2',
      name: 'Bruce Wayne',
      email: 'bruce@waynecorp.com',
      mobileNumber: '+1 (555) 321-4567',
      subject: 'Private Party Space Hire',
      message: 'Interested in reserving the entire private lounge on a Wednesday evening. Do you offer custom tandoori catering for 30 guests?',
      createdAt: '2026-06-26T03:45:00Z',
      isUnread: true
    }
  ],
  subscribers: [
    {
      id: 'sub-1',
      email: 'tony@starkindustries.com',
      createdAt: '2026-06-24T09:12:00Z'
    },
    {
      id: 'sub-2',
      email: 'steve.rogers@avengers.org',
      createdAt: '2026-06-25T15:30:00Z'
    }
  ]
};

// Mapping for pre-seeded USD prices to realistic INR rates
const INR_PRICE_MAP: Record<string, number> = {
  'menu-1': 350.00,
  'menu-2': 290.00,
  'menu-3': 220.00,
  'menu-4': 180.00,
  'menu-5': 650.00,
  'menu-6': 420.00,
  'menu-7': 520.00,
  'menu-8': 320.00,
  'menu-9': 890.00,
  'menu-10': 450.00,
  'menu-11': 380.00,
  'menu-12': 440.00,
  'menu-13': 280.00,
  'menu-14': 320.00,
  'menu-15': 240.00,
  'menu-16': 180.00
};

export const getDB = (): DatabaseState => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
    return DEFAULT_SEED_DATA;
  }
  try {
    const parsed = JSON.parse(data);
    // Safety check for properties
    if (!parsed.websiteSettings || !parsed.menuItems || !parsed.bookings) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
      return DEFAULT_SEED_DATA;
    }

    // Ensure currency settings are backfilled and all initial item prices are converted to INR
    if (!parsed.websiteSettings.currencyCode) {
      parsed.websiteSettings.currencyCode = 'INR';
      parsed.websiteSettings.currencySymbol = '₹';
      parsed.websiteSettings.currencyPosition = 'before';
      parsed.menuItems = parsed.menuItems.map((item: any) => {
        const inrPrice = INR_PRICE_MAP[item.id] || (item.price < 100 ? Math.round(item.price * 25) : item.price);
        return {
          ...item,
          price: inrPrice
        };
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }

    // Backfill menuCategories
    if (!parsed.menuCategories) {
      parsed.menuCategories = [...DEFAULT_SEED_DATA.menuCategories];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }

    // Backfill missing fields (isVeg, displayOrder) on existing items
    let hasUpdatedItems = false;
    parsed.menuItems = parsed.menuItems.map((item: any) => {
      let isItemChanged = false;
      if (item.isVeg === undefined) {
        const nameLower = item.name.toLowerCase();
        const descLower = item.description.toLowerCase();
        const isNonVeg = nameLower.includes('chicken') || nameLower.includes('salmon') || nameLower.includes('fish') || nameLower.includes('mutton') || descLower.includes('chicken') || descLower.includes('salmon');
        item.isVeg = !isNonVeg;
        isItemChanged = true;
      }
      if (item.displayOrder === undefined) {
        item.displayOrder = 1;
        isItemChanged = true;
      }
      if (isItemChanged) {
        hasUpdatedItems = true;
      }
      return item;
    });
    if (hasUpdatedItems) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }

    // Backfill bookingTimeSlots and blockedDates if not present
    if (!parsed.bookingTimeSlots) {
      parsed.bookingTimeSlots = [...DEFAULT_SEED_DATA.bookingTimeSlots];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    if (!parsed.blockedDates) {
      parsed.blockedDates = [...DEFAULT_SEED_DATA.blockedDates];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }

    // Backfill dynamic multi-module collections for Master Super Admin Control
    if (!parsed.customPages) {
      parsed.customPages = [...(DEFAULT_SEED_DATA.customPages || [])];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    if (!parsed.blogs) {
      parsed.blogs = [...(DEFAULT_SEED_DATA.blogs || [])];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    if (!parsed.offers) {
      parsed.offers = [...(DEFAULT_SEED_DATA.offers || [])];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    if (!parsed.notificationSettings) {
      parsed.notificationSettings = { ...(DEFAULT_SEED_DATA.notificationSettings || {
        emailEnabled: true,
        emailAddress: 'manager@limelightrestaurant.com',
        whatsappEnabled: true,
        whatsappNumber: '+15559876543',
        smsEnabled: false,
        smsNumber: '',
        pushEnabled: true
      }) };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    if (!parsed.activityLogs) {
      parsed.activityLogs = [...(DEFAULT_SEED_DATA.activityLogs || [])];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    if (!parsed.twoFactorSettings) {
      parsed.twoFactorSettings = { ...(DEFAULT_SEED_DATA.twoFactorSettings || { isEnabled: false }) };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    if (!parsed.inquiries) {
      parsed.inquiries = [...(DEFAULT_SEED_DATA.inquiries || [])];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }
    if (!parsed.subscribers) {
      parsed.subscribers = [...(DEFAULT_SEED_DATA.subscribers || [])];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch (e) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
    return DEFAULT_SEED_DATA;
  }
};

export const saveDB = (state: DatabaseState): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

export const resetDB = (): DatabaseState => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_DATA));
  return DEFAULT_SEED_DATA;
};

// Increment visitor count on load
export const incrementVisitors = (): number => {
  const db = getDB();
  db.visitorsCount = (db.visitorsCount || 1420) + 1;
  saveDB(db);
  return db.visitorsCount;
};
