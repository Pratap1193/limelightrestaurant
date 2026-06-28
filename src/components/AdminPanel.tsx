import React, { useState, useEffect } from 'react';
import { RestaurantData, MenuItem, MenuCategory, OpeningHour, GalleryImage, SpecialOffer, Review, Reservation } from '../types';
import {
  Lock, KeyRound, Save, Plus, Trash2, Edit2, Check, X, Eye, EyeOff,
  LayoutDashboard, Coffee, Image, Tag, MessageSquare, Sliders, Globe,
  Compass, Clock, Settings, LogOut, Search, Download, AlertCircle, CheckCircle,
  PlusCircle, ToggleLeft, ToggleRight, Phone, Leaf, Calendar
} from 'lucide-react';

interface AdminPanelProps {
  data: RestaurantData;
  onUpdate: (updatedData: RestaurantData) => void;
  isLoggedIn: boolean;
  onLogin: (usernameInput: string, passwordInput: string) => boolean;
  onLogout: () => void;
}

export default function AdminPanel({ data, onUpdate, isLoggedIn, onLogin, onLogout }: AdminPanelProps) {
  // Login Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Configuration check status
  const [configStatus, setConfigStatus] = useState<{
    supabaseConfigured: boolean;
    smtpConfigured: boolean;
  } | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/config-check')
        .then(res => res.json())
        .then(val => setConfigStatus(val))
        .catch(err => console.error('Error checking cloud environment configuration:', err));
    }
  }, [isLoggedIn]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'reservations' | 'menu' | 'gallery' | 'offers' | 'reviews' | 'hero' | 'seo' | 'contact' | 'hours' | 'settings'
  >('dashboard');

  // Success message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter state
  const [menuSearch, setMenuSearch] = useState('');
  const [reservationSearch, setReservationSearch] = useState('');
  const [reviewSearch, setReviewSearch] = useState('');

  // Editing state variables
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Partial<MenuCategory> | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [editingOffer, setEditingOffer] = useState<Partial<SpecialOffer> | null>(null);
  const [isAddingOffer, setIsAddingOffer] = useState(false);

  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);
  const [isAddingReview, setIsAddingReview] = useState(false);

  const [editingGalleryImage, setEditingGalleryImage] = useState<Partial<GalleryImage> | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);

  // Form states for general sections
  const [heroForm, setHeroForm] = useState(data.hero);
  const [aboutForm, setAboutForm] = useState(data.about);
  const [contactForm, setContactForm] = useState(data.contact);
  const [seoForm, setSeoForm] = useState(data.seo);
  const [hoursForm, setHoursForm] = useState<OpeningHour[]>([...data.hours]);

  // Settings States
  const [newAdminUsername, setNewAdminUsername] = useState('admin');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(usernameInput, passwordInput);
    if (success) {
      setLoginError('');
      triggerToast("Access Granted. Welcome to the workspace!");
    } else {
      setLoginError('Invalid username or password. (Hint: admin / password)');
    }
  };

  const handleSaveHero = () => {
    onUpdate({ ...data, hero: heroForm });
    triggerToast("Hero Section updated instantly!");
  };

  const handleSaveAbout = () => {
    onUpdate({ ...data, about: aboutForm });
    triggerToast("About Section story and stats updated!");
  };

  const handleSaveContact = () => {
    onUpdate({ ...data, contact: contactForm });
    triggerToast("Contact coordinates and WhatsApp updated!");
  };

  const handleSaveSEO = () => {
    onUpdate({ ...data, seo: seoForm });
    triggerToast("SEO tags, tracking IDs, and keyword meta applied!");
  };

  const handleSaveHours = () => {
    onUpdate({ ...data, hours: hoursForm });
    triggerToast("Operational weekly opening hours saved!");
  };

  const handleSaveSettings = () => {
    if (newAdminPassword) {
      if (newAdminPassword !== confirmAdminPassword) {
        alert("Passwords do not match!");
        return;
      }
      localStorage.setItem('limelight_admin_username', newAdminUsername);
      localStorage.setItem('limelight_admin_password', newAdminPassword);
      triggerToast("Credentials updated successfully!");
    } else {
      localStorage.setItem('limelight_admin_username', newAdminUsername);
      triggerToast("Username updated successfully!");
    }
    setNewAdminPassword('');
    setConfirmAdminPassword('');
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to restore the default boutique Haridwar data? This overwrites all changes.")) {
      localStorage.removeItem('limelight_restaurant_store_v1');
      window.location.reload();
    }
  };

  // ---------------- MENU ITEM ACTIONS ----------------
  const handleAddNewMenuItem = () => {
    setEditingMenuItem({
      id: `menu-${Date.now()}`,
      name: '',
      price: 15.00,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      categorySlug: data.categories[0]?.slug || 'starters',
      isAvailable: true,
      isVeg: true
    });
    setIsAddingMenuItem(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem({ ...item });
    setIsAddingMenuItem(false);
  };

  const handleSaveMenuItem = () => {
    if (!editingMenuItem?.name?.trim() || !editingMenuItem.price) {
      alert("Name and Price are required!");
      return;
    }

    let updatedList = [...data.menu];
    if (isAddingMenuItem) {
      updatedList.push(editingMenuItem as MenuItem);
    } else {
      updatedList = updatedList.map(m => m.id === editingMenuItem.id ? (editingMenuItem as MenuItem) : m);
    }

    onUpdate({ ...data, menu: updatedList });
    setEditingMenuItem(null);
    triggerToast(isAddingMenuItem ? "Added item to menu!" : "Item updated!");
  };

  const handleDeleteMenuItem = (id: string) => {
    if (window.confirm("Delete this menu item?")) {
      const updatedList = data.menu.filter(m => m.id !== id);
      onUpdate({ ...data, menu: updatedList });
      triggerToast("Item removed.");
    }
  };

  // ---------------- CATEGORY ACTIONS ----------------
  const handleAddNewCategory = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      description: ''
    });
    setIsAddingCategory(true);
  };

  const handleEditCategory = (cat: MenuCategory) => {
    setEditingCategory({ ...cat });
    setIsAddingCategory(false);
  };

  const handleSaveCategory = () => {
    if (!editingCategory?.name?.trim() || !editingCategory.slug?.trim()) {
      alert("Name and Slug are required!");
      return;
    }

    let updatedList = [...data.categories];
    if (isAddingCategory) {
      updatedList.push(editingCategory as MenuCategory);
    } else {
      updatedList = updatedList.map(c => c.id === editingCategory.id ? (editingCategory as MenuCategory) : c);
    }

    onUpdate({ ...data, categories: updatedList });
    setEditingCategory(null);
    triggerToast(isAddingCategory ? "Category created!" : "Category updated!");
  };

  const handleDeleteCategory = (id: string, slug: string) => {
    const hasAssociatedItems = data.menu.some(m => m.categorySlug === slug);
    if (hasAssociatedItems) {
      alert("Cannot delete this category. There are food items associated with this category slug. Please re-assign those dishes first.");
      return;
    }

    if (window.confirm("Delete this category?")) {
      const updatedList = data.categories.filter(c => c.id !== id);
      onUpdate({ ...data, categories: updatedList });
      triggerToast("Category deleted.");
    }
  };

  // ---------------- GALLERY ACTIONS ----------------
  const handleAddNewGalleryImage = () => {
    setEditingGalleryImage({
      id: `gal-${Date.now()}`,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      caption: ''
    });
    setIsAddingGallery(true);
  };

  const handleEditGalleryImage = (img: GalleryImage) => {
    setEditingGalleryImage({ ...img });
    setIsAddingGallery(false);
  };

  const handleSaveGalleryImage = () => {
    if (!editingGalleryImage?.imageUrl?.trim()) {
      alert("Image URL is required!");
      return;
    }

    let updatedList = [...data.gallery];
    if (isAddingGallery) {
      updatedList.push(editingGalleryImage as GalleryImage);
    } else {
      updatedList = updatedList.map(g => g.id === editingGalleryImage.id ? (editingGalleryImage as GalleryImage) : g);
    }

    onUpdate({ ...data, gallery: updatedList });
    setEditingGalleryImage(null);
    triggerToast(isAddingGallery ? "Gallery photo added!" : "Caption updated!");
  };

  const handleDeleteGalleryImage = (id: string) => {
    if (window.confirm("Delete this gallery image?")) {
      const updatedList = data.gallery.filter(g => g.id !== id);
      onUpdate({ ...data, gallery: updatedList });
      triggerToast("Image removed.");
    }
  };

  // ---------------- RESERVATION ACTIONS ----------------
  const handleUpdateReservationStatus = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    const updatedList = data.reservations.map(r => r.id === id ? { ...r, status } : r);
    onUpdate({ ...data, reservations: updatedList });
    triggerToast(`Reservation status marked as ${status}!`);
  };

  const handleDeleteReservation = (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking record?")) {
      const updatedList = data.reservations.filter(r => r.id !== id);
      onUpdate({ ...data, reservations: updatedList });
      triggerToast("Booking record deleted.");
    }
  };

  const handleExportReservations = () => {
    try {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Date', 'Time', 'Guests', 'Status', 'Notes', 'Created At'];
      const rows = data.reservations.map(r => [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        r.email,
        r.phone,
        r.date,
        r.time,
        r.guests,
        r.status,
        `"${(r.notes || '').replace(/"/g, '""')}"`,
        r.createdAt
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `limelight_reservations_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("Exported reservations as CSV!");
    } catch (e) {
      alert("Failed to export reservations.");
    }
  };

  // ---------------- SPECIAL OFFER ACTIONS ----------------
  const handleAddNewOffer = () => {
    setEditingOffer({
      id: `off-${Date.now()}`,
      title: '',
      description: '',
      discountCode: '',
      discountPercent: 10,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
      isAvailable: true,
      badge: 'Limited Offer'
    });
    setIsAddingOffer(true);
  };

  const handleEditOffer = (offer: SpecialOffer) => {
    setEditingOffer({ ...offer });
    setIsAddingOffer(false);
  };

  const handleSaveOffer = () => {
    if (!editingOffer?.title?.trim() || !editingOffer.description?.trim()) {
      alert("Title and Description are required!");
      return;
    }

    let updatedList = [...data.offers];
    if (isAddingOffer) {
      updatedList.push(editingOffer as SpecialOffer);
    } else {
      updatedList = updatedList.map(o => o.id === editingOffer.id ? (editingOffer as SpecialOffer) : o);
    }

    onUpdate({ ...data, offers: updatedList });
    setEditingOffer(null);
    triggerToast(isAddingOffer ? "Special Offer created!" : "Special Offer updated!");
  };

  const handleDeleteOffer = (id: string) => {
    if (window.confirm("Delete this special offer?")) {
      const updatedList = data.offers.filter(o => o.id !== id);
      onUpdate({ ...data, offers: updatedList });
      triggerToast("Offer deleted.");
    }
  };

  // ---------------- REVIEW ACTIONS ----------------
  const handleAddNewReview = () => {
    setEditingReview({
      id: `rev-${Date.now()}`,
      name: '',
      rating: 5,
      comment: '',
      date: new Date().toISOString().split('T')[0],
      avatarUrl: '',
      isApproved: true
    });
    setIsAddingReview(true);
  };

  const handleEditReview = (rev: Review) => {
    setEditingReview({ ...rev });
    setIsAddingReview(false);
  };

  const handleSaveReview = () => {
    if (!editingReview?.name?.trim() || !editingReview.comment?.trim()) {
      alert("Reviewer Name and Comment are required!");
      return;
    }

    let updatedList = [...data.reviews];
    if (isAddingReview) {
      updatedList.push(editingReview as Review);
    } else {
      updatedList = updatedList.map(r => r.id === editingReview.id ? (editingReview as Review) : r);
    }

    onUpdate({ ...data, reviews: updatedList });
    setEditingReview(null);
    triggerToast(isAddingReview ? "Review created!" : "Review updated!");
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm("Delete this review?")) {
      const updatedList = data.reviews.filter(r => r.id !== id);
      onUpdate({ ...data, reviews: updatedList });
      triggerToast("Review removed.");
    }
  };

  const handleToggleReviewApproval = (id: string) => {
    const updatedList = data.reviews.map(r => r.id === id ? { ...r, isApproved: !r.isApproved } : r);
    onUpdate({ ...data, reviews: updatedList });
    triggerToast("Review display status updated!");
  };

  // Filter lists
  const filteredMenuItems = data.menu.filter(m =>
    m.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
    m.description.toLowerCase().includes(menuSearch.toLowerCase()) ||
    m.categorySlug.toLowerCase().includes(menuSearch.toLowerCase())
  );

  const filteredReservations = data.reservations.filter(r =>
    r.name.toLowerCase().includes(reservationSearch.toLowerCase()) ||
    r.email.toLowerCase().includes(reservationSearch.toLowerCase()) ||
    r.phone.toLowerCase().includes(reservationSearch.toLowerCase()) ||
    r.date.toLowerCase().includes(reservationSearch.toLowerCase())
  );

  const filteredReviews = data.reviews.filter(r =>
    r.name.toLowerCase().includes(reviewSearch.toLowerCase()) ||
    r.comment.toLowerCase().includes(reviewSearch.toLowerCase())
  );

  // Stats calculation
  const totalItems = data.menu.length;
  const totalPhotos = data.gallery.length;
  const activeOffers = data.offers.filter(o => o.isAvailable).length;
  const totalBookings = data.reservations.length;
  const pendingBookings = data.reservations.filter(r => r.status === 'pending').length;

  // ------------------ LOGIN PANEL RENDER ------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-pink-50/20 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-100/35 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-md w-full bg-white rounded-3xl border border-pink-100 shadow-2xl overflow-hidden p-8 sm:p-10 relative z-10 animate-in fade-in slide-in-from-bottom duration-300">
          <div className="text-center mb-8 text-left">
            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pink-200">
              <Lock size={30} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 text-center">Limelight Admin Portal</h2>
            <p className="font-sans text-xs text-neutral-500 mt-2 text-center">
              Please authenticate to access the website control panel
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider text-left mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 bg-neutral-50 border border-pink-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white text-neutral-800"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider text-left">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-pink-600 text-xs hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-neutral-50 border border-pink-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white text-neutral-800"
              />
            </div>

            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium text-left">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl shadow-md shadow-pink-500/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
            >
              <KeyRound size={16} />
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-pink-50 text-center">
            <span className="inline-block bg-pink-50 text-pink-700 font-sans font-medium text-[11px] uppercase tracking-wider px-3 py-1 rounded-full">
              Demo Credentials
            </span>
            <p className="text-neutral-500 text-xs mt-2.5">
              Username: <code className="bg-pink-50 px-1.5 py-0.5 rounded text-pink-600 font-semibold">admin</code> &nbsp;&nbsp; 
              Password: <code className="bg-pink-50 px-1.5 py-0.5 rounded text-pink-600 font-semibold">password</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ MAIN ADMIN DASHBOARD WORKSPACE ------------------
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-neutral-800 flex items-center gap-2.5 text-sm animate-in fade-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION tabs */}
          <div className="lg:col-span-3 mb-6 lg:mb-0">
            <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 shadow-sm space-y-6 lg:sticky lg:top-24 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white font-bold font-serif">
                  L
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-neutral-950">Limelight Admin</h2>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block font-semibold uppercase tracking-wider">
                    ● Workspace Active
                  </span>
                </div>
              </div>

              <div className="h-[1px] bg-neutral-100"></div>

              {/* List of tabs */}
              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'reservations', label: `Reservations (${pendingBookings})`, icon: Calendar },
                  { id: 'menu', label: 'Menu & Categories', icon: Coffee },
                  { id: 'gallery', label: 'Gallery Photos', icon: Image },
                  { id: 'offers', label: 'Promo Offers', icon: Tag },
                  { id: 'reviews', label: 'Customer Reviews', icon: MessageSquare },
                  { id: 'hero', label: 'Homepage Banners', icon: Sliders },
                  { id: 'seo', label: 'SEO Config', icon: Globe },
                  { id: 'contact', label: 'Contact Details', icon: Compass },
                  { id: 'hours', label: 'Opening Hours', icon: Clock },
                  { id: 'settings', label: 'Settings & Security', icon: Settings }
                ].map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setEditingMenuItem(null);
                        setEditingCategory(null);
                        setEditingOffer(null);
                        setEditingReview(null);
                        setEditingGalleryImage(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-pink-600 text-white shadow-md shadow-pink-600/10'
                          : 'text-neutral-600 hover:bg-pink-50 hover:text-pink-600'
                      }`}
                    >
                      <IconComp size={15} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="h-[1px] bg-neutral-100"></div>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <LogOut size={15} />
                <span>Logout Session</span>
              </button>
            </div>
          </div>

          {/* MAIN CONFIGURATION WORKSPACE */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 sm:p-8 shadow-sm text-left">
              
              {/* ENVIRONMENT VARIABLE CONFIGURATION ALERTS (ONLY INSIDE ADMIN PANEL) */}
              {configStatus && (!configStatus.supabaseConfigured || !configStatus.smtpConfigured) && (
                <div className="mb-8 p-6 bg-amber-50/70 rounded-2xl border border-amber-200 text-amber-850 flex flex-col md:flex-row items-start gap-4 animate-in fade-in duration-200">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-600 shrink-0">
                    <AlertCircle size={22} className="stroke-[2.5]" />
                  </div>
                  <div className="text-xs space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-amber-900 font-bold text-sm">⚠️ Backend Not Configured</strong>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-sans text-[10px] font-semibold uppercase tracking-wider">Offline Fallback Active</span>
                    </div>
                    <p className="leading-relaxed text-neutral-600">
                      The reservation system is operating in a secure, local-storage fallback mode because some cloud environment variables are missing. You can add these keys to your platform dashboard (e.g. Netlify, Vercel, or Cloud Run) at any time to enable real-time cloud data storage and email dispatch without rewriting any code.
                    </p>
                    <div className="font-sans font-medium text-neutral-700">
                      Missing components:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 font-mono text-[10.5px] text-amber-900">
                      {!configStatus.supabaseConfigured && (
                        <li>
                          <strong>Supabase Cloud DB</strong>: Add <code className="bg-amber-100/85 px-1 py-0.5 rounded text-amber-950 font-semibold">SUPABASE_URL</code> and <code className="bg-amber-100/85 px-1 py-0.5 rounded text-amber-950 font-semibold">SUPABASE_ANON_KEY</code>. Bookings are stored locally in the browser.
                        </li>
                      )}
                      {!configStatus.smtpConfigured && (
                        <li>
                          <strong>SMTP Mail Server</strong>: Add <code className="bg-amber-100/85 px-1 py-0.5 rounded text-amber-950 font-semibold">SMTP_HOST</code>, <code className="bg-amber-100/85 px-1 py-0.5 rounded text-amber-950 font-semibold">SMTP_USER</code>, and <code className="bg-amber-100/85 px-1 py-0.5 rounded text-amber-950 font-semibold">SMTP_PASS</code>. Notifications are falling back to user alerts.
                        </li>
                      )}
                    </ul>
                    <p className="text-[10.5px] text-neutral-500 pt-1">
                      Tip: Navigate to the <strong className="text-neutral-700 font-semibold">Settings & Security</strong> tab below to view the setup guide and check configuration statuses.
                    </p>
                  </div>
                </div>
              )}
              
              {/* TAB 1: DASHBOARD METRICS */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-neutral-900">Boutique Executive Dashboard</h3>
                    <p className="text-neutral-500 text-sm mt-1">Real-time indicators, operational stats, and rapid review metrics</p>
                  </div>
                  <div className="h-[1px] bg-neutral-100"></div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-50 border border-neutral-200/40 p-6 rounded-2xl">
                      <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Total Dishes</span>
                      <span className="block font-serif text-3xl font-extrabold text-neutral-900 mt-2">{totalItems}</span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200/40 p-6 rounded-2xl">
                      <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Gallery Assets</span>
                      <span className="block font-serif text-3xl font-extrabold text-neutral-900 mt-2">{totalPhotos}</span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200/40 p-6 rounded-2xl">
                      <span className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Active Offers</span>
                      <span className="block font-serif text-3xl font-extrabold text-neutral-900 mt-2">{activeOffers}</span>
                    </div>
                    <div className="bg-pink-50/60 border border-pink-100/60 p-6 rounded-2xl">
                      <span className="block text-[10px] font-semibold text-pink-700 uppercase tracking-widest">Pending Bookings</span>
                      <span className="block font-serif text-3xl font-extrabold text-pink-600 mt-2">{pendingBookings}</span>
                    </div>
                  </div>

                  {/* Recent Bookings inside Dashboard */}
                  <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/50">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-serif text-lg font-bold text-neutral-900">Recent Online Bookings</h4>
                      <button 
                        onClick={() => setActiveTab('reservations')}
                        className="text-pink-600 hover:text-pink-700 text-xs font-semibold cursor-pointer"
                      >
                        Manage All
                      </button>
                    </div>

                    {data.reservations.length > 0 ? (
                      <div className="space-y-3">
                        {data.reservations.slice(-3).map(res => (
                          <div key={res.id} className="bg-white p-4 rounded-xl border border-neutral-200/40 flex justify-between items-center">
                            <div>
                              <span className="font-sans font-semibold text-sm text-neutral-900">{res.name}</span>
                              <span className="text-neutral-500 text-xs block mt-0.5">{res.guests} Guests • {res.date} at {res.time}</span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              res.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                              res.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {res.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-400 text-xs py-4 text-center">No online reservations received yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: RESERVATIONS MODULE */}
              {activeTab === 'reservations' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-neutral-900">Table Reservations Desk</h3>
                      <p className="text-neutral-500 text-sm">Review, verify, and confirm guest dining inquiries</p>
                    </div>
                    <button
                      onClick={handleExportReservations}
                      className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      <Download size={14} />
                      Export Bookings CSV
                    </button>
                  </div>

                  {/* Backend Status indicator for reservations */}
                  {configStatus && (
                    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                      configStatus.supabaseConfigured 
                        ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' 
                        : 'bg-amber-50/50 border-amber-100 text-amber-800'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${configStatus.supabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                        <span>
                          <strong>Database Sync Status:</strong> {configStatus.supabaseConfigured ? 'Cloud Sync Enabled' : 'Backend not configured (Running in local browser fallback)'}
                        </span>
                      </div>
                      {!configStatus.supabaseConfigured && (
                        <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded font-medium text-amber-900">
                          Cloud Database Features Disabled
                        </span>
                      )}
                    </div>
                  )}

                  <div className="h-[1px] bg-neutral-100"></div>

                  {/* Search Bar */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search bookings by name, phone, date..."
                      value={reservationSearch}
                      onChange={(e) => setReservationSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800 bg-white"
                    />
                  </div>

                  {/* Bookings List */}
                  {filteredReservations.length > 0 ? (
                    <div className="space-y-4">
                      {filteredReservations.map((res) => (
                        <div
                          key={res.id}
                          className={`p-6 rounded-2xl border transition-all ${
                            res.status === 'confirmed' ? 'bg-green-50/20 border-green-200/50' :
                            res.status === 'cancelled' ? 'bg-rose-50/10 border-rose-200/50' :
                            'bg-amber-50/30 border-amber-200'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <h4 className="font-sans font-bold text-neutral-900 text-base">{res.name}</h4>
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                                  res.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                  res.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {res.status}
                                </span>
                              </div>
                              <p className="font-mono text-xs text-neutral-500 mt-1.5 leading-relaxed">
                                Date: <strong className="text-neutral-900">{res.date}</strong> &nbsp;|&nbsp; 
                                Time: <strong className="text-neutral-900">{res.time}</strong> &nbsp;|&nbsp; 
                                Guests: <strong className="text-neutral-900">{res.guests}</strong>
                              </p>
                              <p className="font-sans text-xs text-neutral-600 mt-1 leading-relaxed">
                                Contact: {res.phone} &nbsp;•&nbsp; {res.email}
                              </p>
                              {res.notes && (
                                <p className="mt-3 text-xs bg-white/60 p-2.5 border border-neutral-100 rounded-lg italic text-neutral-500 max-w-2xl">
                                  Notes: "{res.notes}"
                                </p>
                              )}
                            </div>

                            {/* Booking Action Triggers */}
                            <div className="flex flex-wrap gap-2 items-center self-start">
                              {res.status !== 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-[10px] uppercase tracking-wider cursor-pointer"
                                >
                                  Confirm
                                </button>
                              )}
                              {res.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-[10px] uppercase tracking-wider cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReservation(res.id)}
                                className="p-1.5 bg-white border border-neutral-200 hover:border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 rounded-2xl text-neutral-400 text-sm">
                      No matching reservations found.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MENU & CATEGORY MANAGEMENT */}
              {activeTab === 'menu' && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-neutral-900">Restaurant Menu & Categories</h3>
                      <p className="text-neutral-500 text-sm mt-1">Manage custom menu groups and full item details</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddNewCategory}
                        className="flex items-center gap-1 px-3.5 py-2.5 border border-pink-200 text-pink-600 hover:bg-pink-50 font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        <PlusCircle size={14} />
                        New Category
                      </button>
                      <button
                        onClick={handleAddNewMenuItem}
                        className="flex items-center gap-1 px-3.5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                        New Dish
                      </button>
                    </div>
                  </div>
                  <div className="h-[1px] bg-neutral-100"></div>

                  {/* 1. EDITING CATEGORY FORM IF ACTIVE */}
                  {editingCategory && (
                    <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif font-bold text-base text-neutral-900">
                          {isAddingCategory ? 'Create New Category' : `Edit Category: ${editingCategory.name}`}
                        </h4>
                        <button onClick={() => setEditingCategory(null)} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-200 cursor-pointer">
                          <X size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Category Title</label>
                          <input
                            type="text"
                            value={editingCategory.name || ''}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            placeholder="e.g. Traditional Curries"
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Slug (Unique URL identifier)</label>
                          <input
                            type="text"
                            value={editingCategory.slug || ''}
                            onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            placeholder="e.g. traditional-curries"
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Description (Optional)</label>
                          <input
                            type="text"
                            value={editingCategory.description || ''}
                            onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                            placeholder="Brief category tag line..."
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveCategory}
                          className="flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                        >
                          <Check size={14} /> Save Category
                        </button>
                        <button onClick={() => setEditingCategory(null)} className="px-4 py-2 border border-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-100 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. EDITING MENU ITEM FORM IF ACTIVE */}
                  {editingMenuItem && (
                    <div className="bg-pink-50/20 border border-pink-100 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif font-bold text-base text-neutral-900">
                          {isAddingMenuItem ? 'Add Gourmet Dish' : `Edit: ${editingMenuItem.name}`}
                        </h4>
                        <button onClick={() => setEditingMenuItem(null)} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-200 cursor-pointer">
                          <X size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Dish Name</label>
                          <input
                            type="text"
                            value={editingMenuItem.name || ''}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Price (₹ INR)</label>
                          <input
                            type="number"
                            step="1"
                            value={editingMenuItem.price !== undefined ? editingMenuItem.price : ''}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Category</label>
                          <select
                            value={editingMenuItem.categorySlug || 'starters'}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, categorySlug: e.target.value })}
                            className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          >
                            {data.categories.map(c => (
                              <option key={c.id} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Diet Indicator</label>
                            <select
                              value={editingMenuItem.isVeg ? 'veg' : 'non-veg'}
                              onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isVeg: e.target.value === 'veg' })}
                              className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-none text-neutral-800"
                            >
                              <option value="veg">🟢 Vegetarian (Veg)</option>
                              <option value="non-veg">🔴 Non-Vegetarian</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Availability</label>
                            <select
                              value={editingMenuItem.isAvailable ? 'in' : 'out'}
                              onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isAvailable: e.target.value === 'in' })}
                              className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-none text-neutral-800"
                            >
                              <option value="in">In Stock</option>
                              <option value="out">Sold Out</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Image URL</label>
                          <input
                            type="text"
                            value={editingMenuItem.imageUrl || ''}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, imageUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                          {editingMenuItem.imageUrl && (
                            <img src={editingMenuItem.imageUrl} alt="preview" className="w-24 h-16 object-cover rounded-lg border mt-2" onError={(e) => (e.target as any).style.display='none'} />
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Description</label>
                          <textarea
                            value={editingMenuItem.description || ''}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          ></textarea>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveMenuItem}
                          className="flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                        >
                          <Check size={14} /> Save Dish
                        </button>
                        <button onClick={() => setEditingMenuItem(null)} className="px-4 py-2 border border-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-100 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CATEGORIES OVERVIEW GRID */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-lg font-bold text-neutral-900">Available Menu Categories</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {data.categories.map(c => (
                        <div key={c.id} className="bg-neutral-50 p-4 border border-neutral-200 rounded-2xl flex justify-between items-start">
                          <div>
                            <span className="block font-sans font-bold text-sm text-neutral-900">{c.name}</span>
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mt-1">Slug: {c.slug}</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => handleEditCategory(c)} className="p-1 hover:text-pink-600 rounded cursor-pointer" title="Edit Category"><Edit2 size={12} /></button>
                            <button onClick={() => handleDeleteCategory(c.id, c.slug)} className="p-1 hover:text-rose-600 rounded cursor-pointer" title="Delete Category"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DISHES LIST */}
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <h4 className="font-serif text-lg font-bold text-neutral-900">Dishes Catalog ({totalItems})</h4>
                      <input
                        type="text"
                        placeholder="Search catalog..."
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        className="px-3.5 py-1.5 border border-neutral-200 rounded-xl text-xs bg-neutral-50 focus:outline-none"
                      />
                    </div>

                    <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-[10px] font-bold uppercase tracking-wider">
                            <th className="px-6 py-3">Dish Info</th>
                            <th className="px-6 py-3">Category Slug</th>
                            <th className="px-6 py-3">Diet Type</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-neutral-800 text-xs">
                          {filteredMenuItems.map(m => (
                            <tr key={m.id} className="hover:bg-neutral-50/50">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <img src={m.imageUrl} alt={m.name} className="w-10 h-10 rounded-lg object-cover border" onError={(e) => (e.target as any).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=60&q=80"} />
                                <div>
                                  <span className="block font-sans font-bold text-neutral-900">{m.name}</span>
                                  <span className="text-neutral-400 text-[10px] line-clamp-1 max-w-xs">{m.description}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono font-medium">{m.categorySlug}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  m.isVeg ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                                }`}>
                                  {m.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono font-semibold text-pink-600">₹{Number(m.price).toLocaleString('en-IN')}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  m.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {m.isAvailable ? 'Active' : 'Sold Out'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right space-x-1.5">
                                <button onClick={() => handleEditMenuItem(m)} className="p-1 hover:text-pink-600 rounded cursor-pointer inline-flex"><Edit2 size={13} /></button>
                                <button onClick={() => handleDeleteMenuItem(m.id)} className="p-1 hover:text-rose-600 rounded cursor-pointer inline-flex"><Trash2 size={13} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PHOTO GALLERY CONFIG */}
              {activeTab === 'gallery' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-neutral-900">Boutique Photo Gallery</h3>
                      <p className="text-neutral-500 text-sm">Add, remove, or modify public photo assets and captions</p>
                    </div>
                    <button
                      onClick={handleAddNewGalleryImage}
                      className="flex items-center gap-1 px-3.5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      <Plus size={14} /> Add Gallery Image
                    </button>
                  </div>
                  <div className="h-[1px] bg-neutral-100"></div>

                  {/* GALLERY EDIT FORM IF ACTIVE */}
                  {editingGalleryImage && (
                    <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif font-bold text-sm text-neutral-900">
                          {isAddingGallery ? 'Add Image to Gallery' : 'Edit Caption Description'}
                        </h4>
                        <button onClick={() => setEditingGalleryImage(null)} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-200 cursor-pointer">
                          <X size={15} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Image URL</label>
                          <input
                            type="text"
                            value={editingGalleryImage.imageUrl || ''}
                            onChange={(e) => setEditingGalleryImage({ ...editingGalleryImage, imageUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Caption Details</label>
                          <input
                            type="text"
                            value={editingGalleryImage.caption || ''}
                            onChange={(e) => setEditingGalleryImage({ ...editingGalleryImage, caption: e.target.value })}
                            placeholder="Briefly describe what this photo represents..."
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveGalleryImage}
                          className="flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                        >
                          <Check size={14} /> Save Asset
                        </button>
                        <button onClick={() => setEditingGalleryImage(null)} className="px-4 py-2 border border-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-100 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* GALLERY IMAGES ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.gallery.map(img => (
                      <div key={img.id} className="border border-neutral-200 rounded-2xl overflow-hidden group bg-neutral-50 relative">
                        <img src={img.imageUrl} alt="gallery-item" className="w-full h-44 object-cover" onError={(e) => (e.target as any).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80"} />
                        <div className="p-4 bg-white border-t flex flex-col justify-between h-24">
                          <p className="text-neutral-600 text-xs line-clamp-2 leading-relaxed italic">"{img.caption || 'No Caption Provided'}"</p>
                          <div className="flex gap-2 justify-end mt-2">
                            <button onClick={() => handleEditGalleryImage(img)} className="p-1 hover:text-pink-600 rounded text-neutral-400 cursor-pointer" title="Edit Caption"><Edit2 size={13} /></button>
                            <button onClick={() => handleDeleteGalleryImage(img.id)} className="p-1 hover:text-rose-600 rounded text-neutral-400 cursor-pointer" title="Delete Photo"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: OFFERS CONFIG */}
              {activeTab === 'offers' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-neutral-900">Special Promo Offers</h3>
                      <p className="text-neutral-500 text-sm">Add or edit promo discounts and seasonal banners</p>
                    </div>
                    <button
                      onClick={handleAddNewOffer}
                      className="flex items-center gap-1 px-3.5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      <Plus size={14} /> Add Promo Offer
                    </button>
                  </div>
                  <div className="h-[1px] bg-neutral-100"></div>

                  {/* OFFERS EDIT FORM IF ACTIVE */}
                  {editingOffer && (
                    <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif font-bold text-sm text-neutral-900">
                          {isAddingOffer ? 'Add Promo Offer' : 'Edit Promo Offer'}
                        </h4>
                        <button onClick={() => setEditingOffer(null)} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-200 cursor-pointer">
                          <X size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Offer Title</label>
                          <input
                            type="text"
                            value={editingOffer.title || ''}
                            onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Coupon Code</label>
                          <input
                            type="text"
                            value={editingOffer.discountCode || ''}
                            onChange={(e) => setEditingOffer({ ...editingOffer, discountCode: e.target.value.toUpperCase() })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Discount Percent (%)</label>
                          <input
                            type="number"
                            value={editingOffer.discountPercent || ''}
                            onChange={(e) => setEditingOffer({ ...editingOffer, discountPercent: parseInt(e.target.value, 10) || 0 })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Badge Slogan</label>
                          <input
                            type="text"
                            value={editingOffer.badge || ''}
                            onChange={(e) => setEditingOffer({ ...editingOffer, badge: e.target.value })}
                            placeholder="e.g. Family Special"
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Background Image URL</label>
                          <input
                            type="text"
                            value={editingOffer.imageUrl || ''}
                            onChange={(e) => setEditingOffer({ ...editingOffer, imageUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Availability Status</label>
                          <select
                            value={editingOffer.isAvailable ? 'available' : 'unavailable'}
                            onChange={(e) => setEditingOffer({ ...editingOffer, isAvailable: e.target.value === 'available' })}
                            className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          >
                            <option value="available">Active / Displaying</option>
                            <option value="unavailable">Paused / Disabled</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Offer Slogan Description</label>
                          <textarea
                            value={editingOffer.description || ''}
                            onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          ></textarea>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveOffer}
                          className="flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                        >
                          <Check size={14} /> Save Promo
                        </button>
                        <button onClick={() => setEditingOffer(null)} className="px-4 py-2 border border-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-100 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ACTIVE OFFERS GRID */}
                  <div className="space-y-4">
                    {data.offers.map(off => (
                      <div key={off.id} className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start">
                        <div className="flex gap-4 items-center">
                          <img src={off.imageUrl} alt="promo-thumbnail" className="w-16 h-16 rounded-xl object-cover border" onError={(e) => (e.target as any).src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=100&q=80"} />
                          <div>
                            <span className="block font-sans font-bold text-neutral-900 text-base">{off.title}</span>
                            <span className="block text-neutral-500 text-xs mt-1 max-w-lg">{off.description}</span>
                            <p className="mt-2 text-xs font-mono">
                              Code: <strong className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded border border-pink-100">{off.discountCode || 'NONE'}</strong> &nbsp;|&nbsp; 
                              Percent: <strong className="text-neutral-800">{off.discountPercent || 0}%</strong> &nbsp;|&nbsp; 
                              Badge: <strong className="text-neutral-500 font-medium">{off.badge || 'N/A'}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0 self-start sm:self-center">
                          <button onClick={() => handleEditOffer(off)} className="p-2 border border-neutral-200 hover:border-pink-300 text-neutral-600 hover:bg-pink-50 rounded-lg cursor-pointer"><Edit2 size={13} /></button>
                          <button onClick={() => handleDeleteOffer(off.id)} className="p-2 border border-neutral-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: CUSTOMER REVIEWS MODERATION */}
              {activeTab === 'reviews' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-neutral-900">Customer Testimonials Moderation</h3>
                      <p className="text-neutral-500 text-sm">Add custom feedback, edit remarks, or toggle public layout display permissions</p>
                    </div>
                    <button
                      onClick={handleAddNewReview}
                      className="flex items-center gap-1 px-3.5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      <Plus size={14} /> Add Review
                    </button>
                  </div>
                  <div className="h-[1px] bg-neutral-100"></div>

                  {/* REVIEWS EDIT FORM IF ACTIVE */}
                  {editingReview && (
                    <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-serif font-bold text-sm text-neutral-900">
                          {isAddingReview ? 'Write Guest Review' : 'Edit Testimonial'}
                        </h4>
                        <button onClick={() => setEditingReview(null)} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-200 cursor-pointer">
                          <X size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Reviewer Name</label>
                          <input
                            type="text"
                            value={editingReview.name || ''}
                            onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Star Rating (1 to 5)</label>
                          <select
                            value={editingReview.rating || 5}
                            onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value, 10) || 5 })}
                            className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          >
                            {[5, 4, 3, 2, 1].map(star => (
                              <option key={star} value={star}>{star} Stars</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Review Date</label>
                          <input
                            type="date"
                            value={editingReview.date || ''}
                            onChange={(e) => setEditingReview({ ...editingReview, date: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Avatar / Portrait URL</label>
                          <input
                            type="text"
                            value={editingReview.avatarUrl || ''}
                            onChange={(e) => setEditingReview({ ...editingReview, avatarUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Approval Status</label>
                          <select
                            value={editingReview.isApproved ? 'yes' : 'no'}
                            onChange={(e) => setEditingReview({ ...editingReview, isApproved: e.target.value === 'yes' })}
                            className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          >
                            <option value="yes">Approved / Visible on Website</option>
                            <option value="no">Pending Approval / Hidden</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Comment</label>
                          <textarea
                            value={editingReview.comment || ''}
                            onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          ></textarea>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveReview}
                          className="flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                        >
                          <Check size={14} /> Save Feedback
                        </button>
                        <button onClick={() => setEditingReview(null)} className="px-4 py-2 border border-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-100 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SEARCH REVIEWS INPUT */}
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={15} />
                    <input
                      type="text"
                      placeholder="Search feedback..."
                      value={reviewSearch}
                      onChange={(e) => setReviewSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-xl text-xs bg-neutral-50 focus:outline-none text-neutral-800"
                    />
                  </div>

                  {/* REVIEWS GRID */}
                  <div className="space-y-4">
                    {filteredReviews.map(rev => (
                      <div key={rev.id} className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex gap-3 items-start">
                          <img src={rev.avatarUrl} alt="portrait" className="w-10 h-10 rounded-full object-cover border shrink-0" onError={(e) => (e.target as any).src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&q=80"} />
                          <div>
                            <span className="block font-sans font-bold text-neutral-900 text-sm">{rev.name}</span>
                            <span className="text-neutral-400 text-[10px] font-mono">{rev.date} &nbsp;|&nbsp; {rev.rating} Stars</span>
                            <p className="text-neutral-600 text-xs mt-2 italic leading-relaxed">"{rev.comment}"</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                          <button
                            onClick={() => handleToggleReviewApproval(rev.id)}
                            className={`px-3 py-1.5 font-semibold text-[9px] uppercase tracking-wider rounded-lg border cursor-pointer ${
                              rev.isApproved ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            {rev.isApproved ? 'Visible' : 'Hidden'}
                          </button>
                          <button onClick={() => handleEditReview(rev)} className="p-2 border border-neutral-200 hover:border-pink-300 text-neutral-500 hover:bg-pink-50 rounded-lg cursor-pointer"><Edit2 size={12} /></button>
                          <button onClick={() => handleDeleteReview(rev.id)} className="p-2 border border-neutral-200 hover:border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: HERO CONFIGURATION */}
              {activeTab === 'hero' && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div className="border-b pb-4">
                    <h3 className="font-serif text-2xl font-bold text-neutral-900">Homepage Banners</h3>
                    <p className="text-neutral-500 text-sm mt-1">Configure primary screen typography, cover assets, story points, and CTAs</p>
                  </div>

                  {/* A. Hero Banner config */}
                  <div className="space-y-4">
                    <h4 className="font-serif text-lg font-bold text-neutral-900">Primary Hero Screen</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Hero Screen Header Title</label>
                        <input
                          type="text"
                          value={heroForm.title}
                          onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Hero Screen Subtitle</label>
                        <textarea
                          value={heroForm.subtitle}
                          onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Hero Banner Image Background URL</label>
                        <input
                          type="text"
                          value={heroForm.imageUrl}
                          onChange={(e) => setHeroForm({ ...heroForm, imageUrl: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">CTA 1 Button Label (Book Table)</label>
                          <input
                            type="text"
                            value={heroForm.ctaText}
                            onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">CTA 2 Button Label (View Menu)</label>
                          <input
                            type="text"
                            value={heroForm.ctaTextSecondary || 'View Menu'}
                            onChange={(e) => setHeroForm({ ...heroForm, ctaTextSecondary: e.target.value })}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveHero}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      <Save size={14} /> Save Hero Config
                    </button>
                  </div>

                  <div className="h-[1px] bg-neutral-100"></div>

                  {/* B. About story config */}
                  <div className="space-y-4 pt-4">
                    <h4 className="font-serif text-lg font-bold text-neutral-900">About Story Block</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">About Section Header</label>
                        <input
                          type="text"
                          value={aboutForm.title}
                          onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">About Section Subtitle</label>
                        <input
                          type="text"
                          value={aboutForm.subtitle}
                          onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">About Section Image Cover URL</label>
                        <input
                          type="text"
                          value={aboutForm.imageUrl}
                          onChange={(e) => setAboutForm({ ...aboutForm, imageUrl: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Culinary Story Text</label>
                        <textarea
                          value={aboutForm.story}
                          onChange={(e) => setAboutForm({ ...aboutForm, story: e.target.value })}
                          rows={5}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800 text-left"
                        ></textarea>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveAbout}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      <Save size={14} /> Save About Story
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 8: SEO METADATA CONFIG */}
              {activeTab === 'seo' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-neutral-900">Advanced SEO Optimization</h3>
                    <p className="text-neutral-500 text-sm mt-1">Configure search terms, descriptions, social crawl tags, and tracking metrics</p>
                  </div>
                  <div className="h-[1px] bg-neutral-100"></div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Meta Title</label>
                      <input
                        type="text"
                        value={seoForm.metaTitle}
                        onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Meta Description (150-160 characters recommended)</label>
                      <textarea
                        value={seoForm.metaDescription}
                        onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Meta Keywords (Comma separated)</label>
                      <input
                        type="text"
                        value={seoForm.metaKeywords}
                        onChange={(e) => setSeoForm({ ...seoForm, metaKeywords: e.target.value })}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Canonical URL</label>
                      <input
                        type="text"
                        value={seoForm.canonicalUrl || 'https://limelight-restaurant.netlify.app'}
                        onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Google Analytics Measure ID</label>
                        <input
                          type="text"
                          value={seoForm.googleAnalyticsId || ''}
                          onChange={(e) => setSeoForm({ ...seoForm, googleAnalyticsId: e.target.value })}
                          placeholder="G-XXXXXXXXXX"
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Google Search Console Verification Code</label>
                        <input
                          type="text"
                          value={seoForm.googleSearchConsoleId || ''}
                          onChange={(e) => setSeoForm({ ...seoForm, googleSearchConsoleId: e.target.value })}
                          placeholder="google-site-verification=..."
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSEO}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      <Save size={14} /> Apply SEO Parameters
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 9: CONTACT INFRASTRUCTURE */}
              {activeTab === 'contact' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-neutral-900">Communication Coordinates</h3>
                    <p className="text-neutral-500 text-sm mt-1">Configure direct dial numbers, WhatsApp gateways, map links, and locations</p>
                  </div>
                  <div className="h-[1px] bg-neutral-100"></div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Boutique Phone Number</label>
                        <input
                          type="text"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Boutique WhatsApp Number (With Country Code)</label>
                        <input
                          type="text"
                          value={contactForm.whatsappNumber || '918979345678'}
                          onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                          placeholder="918979345678"
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Support Email Address</label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Physical Address Location</label>
                        <input
                          type="text"
                          value={contactForm.address}
                          onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Facebook Profile</label>
                        <input
                          type="text"
                          value={contactForm.facebookUrl}
                          onChange={(e) => setContactForm({ ...contactForm, facebookUrl: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Instagram Profile</label>
                        <input
                          type="text"
                          value={contactForm.instagramUrl}
                          onChange={(e) => setContactForm({ ...contactForm, instagramUrl: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Twitter Profile</label>
                        <input
                          type="text"
                          value={contactForm.twitterUrl}
                          onChange={(e) => setContactForm({ ...contactForm, twitterUrl: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Google Maps iFrame Embed Source URL</label>
                      <input
                        type="text"
                        value={contactForm.mapEmbedUrl}
                        onChange={(e) => setContactForm({ ...contactForm, mapEmbedUrl: e.target.value })}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800 font-mono text-xs"
                      />
                    </div>

                    <button
                      onClick={handleSaveContact}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      <Save size={14} /> Save Contact Coordinates
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 10: OPENING HOURS */}
              {activeTab === 'hours' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-neutral-900">Weekly Opening Hours</h3>
                    <p className="text-neutral-500 text-sm mt-1">Specify timing grids for all seven operational days</p>
                  </div>
                  <div className="h-[1px] bg-neutral-100"></div>

                  <div className="space-y-4">
                    {hoursForm.map((item, index) => (
                      <div key={item.day} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-neutral-50 border rounded-2xl gap-4">
                        <span className="font-sans font-bold text-sm text-neutral-800 sm:w-28 text-left">{item.day}</span>
                        
                        <div className="flex flex-1 items-center gap-4 w-full">
                          <input
                            type="text"
                            value={item.hours}
                            disabled={item.isClosed}
                            onChange={(e) => {
                              const updated = [...hoursForm];
                              updated[index].hours = e.target.value;
                              setHoursForm(updated);
                            }}
                            className="flex-1 px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400"
                          />

                          <label className="flex items-center gap-2 shrink-0 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isClosed}
                              onChange={(e) => {
                                const updated = [...hoursForm];
                                updated[index].isClosed = e.target.checked;
                                setHoursForm(updated);
                              }}
                              className="accent-pink-600 rounded"
                            />
                            <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Closed</span>
                          </label>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleSaveHours}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      <Save size={14} /> Apply Operational Hours
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 11: SETTINGS & PASSWORD CREDENTIALS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-neutral-900">Security Credentials & Integrations</h3>
                    <p className="text-neutral-500 text-sm mt-1">Manage cloud configuration settings, administrative passwords, and factory presets.</p>
                  </div>
                  <div className="h-[1px] bg-neutral-100"></div>

                  {/* Cloud Integrations Status Section */}
                  <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl space-y-4 text-left">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="font-serif text-base font-bold text-neutral-950">Cloud Integrations & Environment Variables</h4>
                      <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full ${
                        configStatus?.supabaseConfigured && configStatus?.smtpConfigured
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {configStatus?.supabaseConfigured && configStatus?.smtpConfigured ? 'Fully Connected' : 'Partial / Fallback Mode'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      This application does not require database or mail variables to build or deploy. It starts up successfully with a secure, local-storage offline fallback. You can input the following credentials inside your Netlify or deployment platform settings under <strong className="text-neutral-900 font-semibold">Environment variables</strong> at any time to activate premium real-time cloud features instantly without changing any code:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Supabase Box */}
                      <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                          <span className="font-serif text-xs font-bold text-neutral-900">1. Supabase Cloud Database</span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold ${configStatus?.supabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${configStatus?.supabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                            {configStatus?.supabaseConfigured ? 'Configured' : 'Offline Mode'}
                          </span>
                        </div>
                        <ul className="space-y-2.5 text-[11px] text-neutral-600 font-sans">
                          <li className="flex flex-col gap-0.5">
                            <span className="font-mono text-[10px] text-pink-600 font-semibold">SUPABASE_URL</span>
                            <span className="text-neutral-500 text-[10px]">Your API endpoint URL for database access (e.g., https://abc.supabase.co)</span>
                          </li>
                          <li className="flex flex-col gap-0.5">
                            <span className="font-mono text-[10px] text-pink-600 font-semibold">SUPABASE_ANON_KEY</span>
                            <span className="text-neutral-500 text-[10px]">Your public API key authorizing safe client data operations.</span>
                          </li>
                        </ul>
                      </div>

                      {/* SMTP Mail Box */}
                      <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                          <span className="font-serif text-xs font-bold text-neutral-900">2. SMTP Email Transporter</span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold ${configStatus?.smtpConfigured ? 'text-emerald-600' : 'text-amber-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${configStatus?.smtpConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                            {configStatus?.smtpConfigured ? 'Configured' : 'Offline Mode'}
                          </span>
                        </div>
                        <ul className="space-y-2.5 text-[11px] text-neutral-600 font-sans">
                          <li className="flex flex-col gap-0.5">
                            <span className="font-mono text-[10px] text-pink-600 font-semibold">SMTP_HOST / SMTP_PORT</span>
                            <span className="text-neutral-500 text-[10px]">The mail server host address (e.g. smtp.gmail.com) and connection port (e.g. 587).</span>
                          </li>
                          <li className="flex flex-col gap-0.5">
                            <span className="font-mono text-[10px] text-pink-600 font-semibold">SMTP_USER / SMTP_PASS</span>
                            <span className="text-neutral-500 text-[10px]">The username (sender email) and security password used to dispatch emails.</span>
                          </li>
                          <li className="flex flex-col gap-0.5">
                            <span className="font-mono text-[10px] text-pink-600 font-semibold">SMTP_FROM</span>
                            <span className="text-neutral-500 text-[10px]">Optional sender display name. Defaults to Limelight Table Desk.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-2xl space-y-4">
                      <h4 className="font-serif text-base font-bold text-neutral-950">Update Admin Auth Profile</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Admin Username</label>
                          <input
                            type="text"
                            value={newAdminUsername}
                            onChange={(e) => setNewAdminUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-500 mb-1.5">New Password</label>
                          <input
                            type="password"
                            placeholder="Leave blank to keep existing password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                          />
                        </div>
                        {newAdminPassword && (
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Confirm New Password</label>
                            <input
                              type="password"
                              placeholder="Type new password again"
                              value={confirmAdminPassword}
                              onChange={(e) => setConfirmAdminPassword(e.target.value)}
                              className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-neutral-800"
                            />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleSaveSettings}
                        className="flex items-center gap-1.5 px-4.5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                      >
                        <Save size={14} /> Update Credentials
                      </button>
                    </div>

                    <div className="bg-rose-50/40 border border-rose-200/50 p-6 rounded-2xl space-y-3">
                      <h4 className="font-serif text-base font-bold text-rose-800">Dangerous Administrative Settings</h4>
                      <p className="text-rose-700/80 text-xs leading-relaxed max-w-2xl">
                        Performing a factory reset will clear your browser’s localStorage cache, wiping out all custom dishes, uploaded images, reviews, and bookings you added, resetting them back to the original Limelight Restaurant Haridwar values.
                      </p>
                      <button
                        onClick={handleResetData}
                        className="flex items-center gap-1.5 px-4.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer mt-2"
                      >
                        Restore Factory Defaults
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
