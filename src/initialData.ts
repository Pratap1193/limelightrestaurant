import { RestaurantData } from './types';

export const initialRestaurantData: RestaurantData = {
  hero: {
    title: "Limelight Restaurant",
    subtitle: "Experience luxury fine dining in Haridwar with exquisite multi-cuisine delicacies, elegant pink-infused interiors, and royal hospitality.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85",
    ctaText: "Book a Table",
    ctaTextSecondary: "View Menu"
  },
  about: {
    title: "A Culinary Legacy of Elegance",
    subtitle: "The Premier Fine Dining & Family Restaurant in Haridwar",
    story: "Nestled in the historic city of Haridwar, Limelight Restaurant combines classical luxury with modern multi-cuisine gastronomy. Set within a premium pink-accented architectural jewel, our venue is designed to celebrate life's finest moments. From local organic farm-to-table ingredients to artisanal beverages, every sensory detail has been curated by our culinary maestros to offer families and gourmands an unforgettable epicurean sanctuary.",
    features: [
      "100% Chef-crafted signature recipe catalog",
      "Sophisticated, family-friendly ambient dining",
      "Private dining chambers for intimate celebrations",
      "Organic ingredients sourced from local foothills"
    ],
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    stats: [
      { label: "Master Chefs", value: "5+" },
      { label: "Delighted Guests", value: "15K+" },
      { label: "Signature Dishes", value: "40+" },
      { label: "Years of Heritage", value: "8+" }
    ]
  },
  whyChooseUs: [
    {
      id: "wcu-1",
      title: "Royal Luxury Ambiance",
      description: "Our signature high-contrast pink-infused lighting and velvet luxury seating offer a visually stunning ambiance perfect for family gatherings or cozy date nights.",
      iconName: "Sparkles"
    },
    {
      id: "wcu-2",
      title: "Pristine Hygiene & Quality",
      description: "We maintain a flawless five-star safety standard, utilizing premium, non-toxic cooking mediums, purified water, and clean open kitchens.",
      iconName: "ShieldCheck"
    },
    {
      id: "wcu-3",
      title: "Exquisite Signature Cocktails",
      description: "Our non-alcoholic rose quartz mocktails and custom craft elixirs are globally renowned for their sensory presentation and delicate taste profiles.",
      iconName: "GlassWater"
    },
    {
      id: "wcu-4",
      title: "Haridwar's Finest Multi-Cuisine",
      description: "Our menu spans rich North Indian gravies, custom European fusion pastas, artisanal sourdough pizzas, and delicate baked desserts.",
      iconName: "Utensils"
    }
  ],
  categories: [
    { id: "cat-1", name: "Starters & Platters", slug: "starters", description: "Sensory appetisers to begin your culinary voyage" },
    { id: "cat-2", name: "Exquisite Mains", slug: "mains", description: "Royal main course platters and rich aromatic specialties" },
    { id: "cat-3", name: "Premium Desserts", slug: "desserts", description: "Artisanal sweet endings handcrafted by our pastry chefs" },
    { id: "cat-4", name: "Beverages & Mocktails", slug: "drinks", description: "Infused sodas, botanicals, and glowing signature refreshers" }
  ],
  menu: [
    {
      id: "menu-1",
      name: "Truffle Burrata & Fuchsia Beet",
      price: 499,
      description: "Creamy Italian burrata, heirloom cherry tomatoes, white truffle oil glaze, and fuchsia beet purée served with toasted sourdough.",
      imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
      categorySlug: "starters",
      isAvailable: true,
      isVeg: true
    },
    {
      id: "menu-2",
      name: "Stuffed Malai Paneer Tikka",
      price: 399,
      description: "Organic cottage cheese chunks stuffed with a delicate mint-pistachio paste, slow-roasted in clay tandoor with saffron butter.",
      imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
      categorySlug: "starters",
      isAvailable: true,
      isVeg: true
    },
    {
      id: "menu-3",
      name: "Crispy Lotus Root Honey Chilli",
      price: 349,
      description: "Slices of premium lotus root tossed in spicy wild mountain honey, Szechuan peppers, roasted sesame seeds, and spring scallions.",
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
      categorySlug: "starters",
      isAvailable: true,
      isVeg: true
    },
    {
      id: "menu-4",
      name: "Limelight Shahi Royal Thali",
      price: 1199,
      description: "A majestic family platter comprising Shahi Paneer, Dal Makhani, Pomegranate Raita, Saffron Pulao, Butter Naan, and Gulab Jamun.",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
      categorySlug: "mains",
      isAvailable: true,
      isVeg: true
    },
    {
      id: "menu-5",
      name: "Pink Vodka Penne Rigate",
      price: 549,
      description: "Handcrafted penne pasta tossed in a rich, slow-simmered pink tomato-cream reduction, garden herbs, and toasted pine nuts.",
      imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
      categorySlug: "mains",
      isAvailable: true,
      isVeg: true
    },
    {
      id: "menu-6",
      name: "Smoked Butter Tofu Masala",
      price: 499,
      description: "Premium silken tofu char-grilled and simmered in an aromatic velvety cashew cream tomato gravy, laced with dry fenugreek leaves.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      categorySlug: "mains",
      isAvailable: true,
      isVeg: true
    },
    {
      id: "menu-7",
      name: "Molten Ruby Chocolate Fondant",
      price: 349,
      description: "Authentic Belgian ruby chocolate fondant with a warm molten core, served with fresh raspberry reduction and Madagascar vanilla bean gelato.",
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
      categorySlug: "desserts",
      isAvailable: true,
      isVeg: true
    },
    {
      id: "menu-8",
      name: "Hibiscus Rose Panna Cotta",
      price: 299,
      description: "Silky vanilla panna cotta infused with organic local rose water, glazed with sweet hibiscus syrup, and edible silver leaf.",
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
      categorySlug: "desserts",
      isAvailable: true,
      isVeg: true
    },
    {
      id: "menu-9",
      name: "The Rose Quartz Cooler",
      price: 249,
      description: "Distilled botanical non-alcoholic rose water, squeezed pink grapefruits, fresh mint springs, elderflower tonic, and sparkling sugar crystals.",
      imageUrl: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80",
      categorySlug: "drinks",
      isAvailable: true,
      isVeg: true
    },
    {
      id: "menu-10",
      name: "Royal Saffron Lassi",
      price: 199,
      description: "Thick, hand-churned cold yogurt sweetened with Kashmiri saffron strands, chopped almonds, pistachios, and organic rose honey drizzle.",
      imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
      categorySlug: "drinks",
      isAvailable: true,
      isVeg: true
    }
  ],
  gallery: [
    {
      id: "gal-1",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      caption: "Our main royal dining salon featuring exquisite pink lighting aesthetics."
    },
    {
      id: "gal-2",
      imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80",
      caption: "Our master chef performing delicate plating on signature appetizers."
    },
    {
      id: "gal-3",
      imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
      caption: "Intimate seating areas ideal for families, social dinners, and celebrations."
    },
    {
      id: "gal-4",
      imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
      caption: "Premium bar area hosting custom non-alcoholic mocktail and beverage mixology."
    }
  ],
  offers: [
    {
      id: "off-1",
      title: "Royal Family Feast Deal",
      description: "Enjoy a luxurious 15% discount on all family bills over ₹2,999. Perfect for family reunions or celebrations.",
      discountCode: "FAMILY15",
      discountPercent: 15,
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
      isAvailable: true,
      badge: "Family Special"
    },
    {
      id: "off-2",
      title: "Weekday Velvet Luncheon",
      description: "Savor a complimentary signature dessert with any gourmet main course ordered from Monday to Thursday (12 PM - 4 PM).",
      discountCode: "VELVETLUNCH",
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
      isAvailable: true,
      badge: "Limited Offer"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      name: "Ananya Sharma",
      rating: 5,
      comment: "Absolutely the best family restaurant in Haridwar! The pink interior is so beautiful and elegant. The Malai Paneer Tikka was incredibly soft, and the service was genuinely royal.",
      date: "2026-06-15",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      isApproved: true
    },
    {
      id: "rev-2",
      name: "Rohan Mehra",
      rating: 5,
      comment: "A magnificent fine dining experience in Haridwar. Highly recommended for couples and families alike. The Truffle Burrata and Rose Cooler mocktail were spectacular and perfectly presented.",
      date: "2026-06-22",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      isApproved: true
    },
    {
      id: "rev-3",
      name: "Dr. Sandeep Gupta",
      rating: 5,
      comment: "Top class hygiene and phenomenal tastes. We organized my daughter's birthday dinner here, and every single guest was mesmerized by the beautiful rose-pink decor and delicious Shahi Royal Thali.",
      date: "2026-06-26",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      isApproved: true
    }
  ],
  reservations: [
    {
      id: "res-1",
      name: "Kabir Khanna",
      email: "kabir.khanna@example.com",
      phone: "+91 98765 43210",
      date: "2026-06-29",
      time: "07:30 PM",
      guests: 4,
      notes: "A family get-together. Need a quiet table near the center lounge please.",
      status: "confirmed",
      createdAt: "2026-06-27T14:15:00.000Z"
    },
    {
      id: "res-2",
      name: "Pooja Malhotra",
      email: "pooja.m@example.com",
      phone: "+91 88888 77777",
      date: "2026-06-30",
      time: "08:00 PM",
      guests: 2,
      notes: "Celebrating our wedding anniversary. Requesting a corner table with beautiful pink glow setup.",
      status: "pending",
      createdAt: "2026-06-27T18:42:00.000Z"
    }
  ],
  contact: {
    phone: "+91 89793 45678",
    address: "Haridwar Bypass Road, Opp. Luxury Shanti Vatika, Haridwar, Uttarakhand 249408",
    email: "reservations@limelight-haridwar.com",
    facebookUrl: "https://facebook.com/limelight.haridwar",
    instagramUrl: "https://instagram.com/limelight.haridwar",
    twitterUrl: "https://twitter.com/limelight_hw",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m18!1m2!1s0x3909470eb8ee53c9%3A0x8227ec86e109d443!2sHaridwar%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1719234567890!5m2!1sen!2sin",
    whatsappNumber: "918979345678"
  },
  seo: {
    metaTitle: "Limelight Restaurant Haridwar | Best Fine Dining & Family Restaurant",
    metaDescription: "Welcome to Limelight Restaurant, Haridwar's premier multi-cuisine fine dining and family restaurant. Experience magnificent ambiance, signature veg platters, and stellar hospitality.",
    metaKeywords: "Best Restaurant in Haridwar, Family Restaurant Haridwar, Fine Dining Haridwar, Limelight Restaurant Haridwar, Haridwar dinner buffet, luxury food Haridwar",
    canonicalUrl: "https://limelight-restaurant.netlify.app",
    googleAnalyticsId: "G-XXXXXXXXXX",
    googleSearchConsoleId: "google-console-id-verification"
  },
  hours: [
    { day: "Monday", hours: "11:30 AM - 11:00 PM", isClosed: false },
    { day: "Tuesday", hours: "11:30 AM - 11:00 PM", isClosed: false },
    { day: "Wednesday", hours: "11:30 AM - 11:00 PM", isClosed: false },
    { day: "Thursday", hours: "11:30 AM - 11:00 PM", isClosed: false },
    { day: "Friday", hours: "11:30 AM - 11:30 PM", isClosed: false },
    { day: "Saturday", hours: "11:30 AM - 11:30 PM", isClosed: false },
    { day: "Sunday", hours: "11:30 AM - 11:30 PM", isClosed: false }
  ],
  supabase: {
    supabaseUrl: "",
    supabaseAnonKey: "",
    isConnected: false
  }
};
