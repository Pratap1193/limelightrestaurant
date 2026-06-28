/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, Settings, Phone, Calendar, Utensils, Image as ImageIcon, Sparkles, MessageSquare, 
  Shield, Key, Lock, LogOut, Check, X, Search, Trash2, Edit3, Plus, Download, Upload, 
  Users, Save, AlertTriangle, FileText, CheckCircle2, RefreshCw, BarChart2, Eye, Activity,
  Folder, Star, BookOpen, Percent, Bell
} from 'lucide-react';
import { DatabaseState, MenuItem, MenuCategoryItem, Booking, GalleryFolder, GalleryImage, RestaurantEvent, CustomerReview, SEOSettings, SocialMediaSettings, WebsiteSettings, ContactSettings, AdminUser, MenuCategory, BookingStatus, ReviewStatus, AdminRole, CustomPage, BlogPost, SpecialOffer, NotificationSettings, ActivityLog, TwoFactorSettings } from '../types/database';

interface AdminPanelProps {
  db: DatabaseState;
  setDb: (state: DatabaseState) => void;
  onResetDB: () => void;
  setCurrentPage: (page: string) => void;
}

// Helper to format currency based on currency settings
function formatPrice(price: number, websiteSettings: any) {
  const symbol = websiteSettings?.currencySymbol || '₹';
  const position = websiteSettings?.currencyPosition || 'before';
  const formattedPrice = Number.isInteger(price) ? price : price.toFixed(2);
  
  if (position === 'after') {
    return `${formattedPrice}${symbol}`;
  }
  return `${symbol}${formattedPrice}`;
}

export default function AdminPanel({ db, setDb, onResetDB, setCurrentPage }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeModule, setActiveModule] = useState<'dashboard' | 'settings' | 'contact' | 'reservations' | 'menu' | 'gallery' | 'events' | 'reviews' | 'seo' | 'social' | 'users' | 'backup' | 'pages' | 'blogs' | 'offers' | 'notifications' | 'security'>('dashboard');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForgotHint, setShowForgotHint] = useState(false);

  // Form states
  const [editingMenuItem, setEditingMenuItem] = useState<Partial<MenuItem> | null>(null);
  const [menuSubTab, setMenuSubTab] = useState<'dishes' | 'categories'>('dishes');
  const [editingMenuCategory, setEditingMenuCategory] = useState<Partial<MenuCategoryItem> | null>(null);
  const [settingsTab, setSettingsTab] = useState<'general' | 'currency'>('general');
  const [contactSubTab, setContactSubTab] = useState<'settings' | 'inquiries' | 'subscribers'>('settings');
  const [bulkMultiplier, setBulkMultiplier] = useState<string>('1.0');
  const [quickPrices, setQuickPrices] = useState<Record<string, number>>({});
  const [editingEvent, setEditingEvent] = useState<Partial<RestaurantEvent> | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [newImageFile, setNewImageFile] = useState<string | null>(null);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageFolder, setNewImageFolder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | 'All'>('All');
  const [reviewFilter, setReviewFilter] = useState<ReviewStatus | 'All'>('All');
  
  // User Management State
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('Editor');

  // Advanced Booking Config States
  const [bookingSubTab, setBookingSubTab] = useState<'list' | 'calendar' | 'config'>('list');
  const [selectedAdminDate, setSelectedAdminDate] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');
  
  // Calendar Navigation in Admin Panel
  const [adminCalYear, setAdminCalYear] = useState(() => new Date().getFullYear());
  const [adminCalMonth, setAdminCalMonth] = useState(() => new Date().getMonth());

  // Website Page Builder state
  const [editingPage, setEditingPage] = useState<Partial<CustomPage> | null>(null);

  // Blog states
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);

  // Offer states
  const [editingOffer, setEditingOffer] = useState<Partial<SpecialOffer> | null>(null);

  // Notification bindings
  const [notifEmailEnabled, setNotifEmailEnabled] = useState(db.notificationSettings?.emailEnabled ?? true);
  const [notifEmailAddress, setNotifEmailAddress] = useState(db.notificationSettings?.emailAddress ?? 'manager@limelightrestaurant.com');
  const [notifWhatsappEnabled, setNotifWhatsappEnabled] = useState(db.notificationSettings?.whatsappEnabled ?? true);
  const [notifWhatsappNumber, setNotifWhatsappNumber] = useState(db.notificationSettings?.whatsappNumber ?? '+15559876543');
  const [notifSmsEnabled, setNotifSmsEnabled] = useState(db.notificationSettings?.smsEnabled ?? false);
  const [notifSmsNumber, setNotifSmsNumber] = useState(db.notificationSettings?.smsNumber ?? '');
  const [notifPushEnabled, setNotifPushEnabled] = useState(db.notificationSettings?.pushEnabled ?? true);

  // Security variables
  const [security2FaEnabled, setSecurity2FaEnabled] = useState(db.twoFactorSettings?.isEnabled ?? false);
  const [securitySecretCode, setSecuritySecretCode] = useState(db.twoFactorSettings?.secretCode ?? 'LIME-7890');

  // Synchronize dynamic elements on database update
  useEffect(() => {
    if (db.notificationSettings) {
      setNotifEmailEnabled(db.notificationSettings.emailEnabled);
      setNotifEmailAddress(db.notificationSettings.emailAddress);
      setNotifWhatsappEnabled(db.notificationSettings.whatsappEnabled);
      setNotifWhatsappNumber(db.notificationSettings.whatsappNumber);
      setNotifSmsEnabled(db.notificationSettings.smsEnabled);
      setNotifSmsNumber(db.notificationSettings.smsNumber);
      setNotifPushEnabled(db.notificationSettings.pushEnabled);
    }
    if (db.twoFactorSettings) {
      setSecurity2FaEnabled(db.twoFactorSettings.isEnabled);
      setSecuritySecretCode(db.twoFactorSettings.secretCode || 'LIME-7890');
    }
  }, [db]);

  // Synchronize menuItems prices to quickPrices state
  useEffect(() => {
    if (db.menuItems) {
      const priceMap: Record<string, number> = {};
      db.menuItems.forEach((item) => {
        priceMap[item.id] = item.price;
      });
      setQuickPrices(priceMap);
    }
  }, [db.menuItems]);

  // Trigger base64 upload on menu/gallery images
  const menuImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  const eventImageInputRef = useRef<HTMLInputElement>(null);

  // CSV exporting/reports helper
  const downloadCSV = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Convert File to Base64 String
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle Admin Auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = db.adminUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setIsAuthenticated(true);
      setCurrentUser(foundUser);
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid administrator credentials. Please check details.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const updateDB = (updatedFields: Partial<DatabaseState>) => {
    const nextState = { ...db, ...updatedFields };
    setDb(nextState);
  };

  // ==========================================
  // RESERVATION ACTIONS
  // ==========================================
  const handleBookingStatus = (id: string, newStatus: BookingStatus) => {
    const nextBookings = db.bookings.map(b => b.id === id ? { ...b, status: newStatus, isUnread: false } : b);
    updateDB({ bookings: nextBookings });
  };

  const handleBookingDelete = (id: string) => {
    const nextBookings = db.bookings.filter(b => b.id !== id);
    updateDB({ bookings: nextBookings });
  };

  const handleBookingExport = () => {
    let csv = 'ID,Guest Name,Mobile,Email,Guests,Date,Time,Occasion,Special Request,Status,Created At\n';
    db.bookings.forEach((b) => {
      csv += `"${b.id}","${b.guestName}","${b.mobileNumber}","${b.email}",${b.guestsCount},"${b.date}","${b.time}","${b.occasion}","${b.specialRequest.replace(/"/g, '""')}","${b.status}","${b.createdAt}"\n`;
    });
    downloadCSV(csv, `Limelight_Reservations_Report_${Date.now()}.csv`);
  };

  // ==========================================
  // CURRENCY & PRICING ACTIONS
  // ==========================================
  const handleBulkPriceMultiplier = (factor: number, roundToInteger: boolean = true) => {
    if (isNaN(factor) || factor <= 0) {
      alert('Please enter a valid multiplier factor greater than 0.');
      return;
    }

    const updatedMenuItems = db.menuItems.map((item) => {
      let newPrice = item.price * factor;
      if (roundToInteger) {
        newPrice = Math.round(newPrice);
      } else {
        newPrice = Number(newPrice.toFixed(2));
      }
      return {
        ...item,
        price: newPrice,
      };
    });

    updateDB({ menuItems: updatedMenuItems });
    alert(`Successfully adjusted all ${db.menuItems.length} menu items by a multiplier factor of ${factor}!`);
  };

  const handleSaveQuickPrices = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMenuItems = db.menuItems.map((item) => {
      const customPrice = quickPrices[item.id];
      return {
        ...item,
        price: customPrice !== undefined ? Number(customPrice) : item.price,
      };
    });

    updateDB({ menuItems: updatedMenuItems });
    alert('All menu item prices updated successfully!');
  };

  // ==========================================
  // MENU ACTIONS
  // ==========================================
  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem) return;

    let updatedMenuItems: MenuItem[];
    if (editingMenuItem.id) {
      // Edit mode
      updatedMenuItems = db.menuItems.map(m => m.id === editingMenuItem.id ? {
        ...m,
        ...editingMenuItem,
        price: Number(editingMenuItem.price) || 0,
        displayOrder: Number(editingMenuItem.displayOrder) || 1,
        isVeg: editingMenuItem.isVeg !== false,
      } as MenuItem : m);
    } else {
      // Add mode
      const newItem: MenuItem = {
        id: `menu-${Date.now()}`,
        name: editingMenuItem.name || 'Unnamed Dish',
        category: editingMenuItem.category || 'Starters',
        description: editingMenuItem.description || '',
        price: Number(editingMenuItem.price) || 0,
        imageUrl: editingMenuItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isChefSpecial: !!editingMenuItem.isChefSpecial,
        isAvailable: editingMenuItem.isAvailable !== false,
        isVeg: editingMenuItem.isVeg !== false,
        displayOrder: Number(editingMenuItem.displayOrder) || 1,
        subcategory: editingMenuItem.subcategory,
        spicyLevel: editingMenuItem.spicyLevel,
        prepTime: editingMenuItem.prepTime,
        tags: editingMenuItem.tags,
        discountPrice: editingMenuItem.discountPrice,
        additionalImages: editingMenuItem.additionalImages
      };
      updatedMenuItems = [...db.menuItems, newItem];
    }

    updateDB({ menuItems: updatedMenuItems });
    setEditingMenuItem(null);
  };

  const handleDeleteMenuItem = (id: string) => {
    const nextItems = db.menuItems.filter(m => m.id !== id);
    updateDB({ menuItems: nextItems });
  };

  const handleSaveMenuCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuCategory) return;

    const categories = db.menuCategories || [];
    let updatedCategories: MenuCategoryItem[];

    if (editingMenuCategory.id) {
      // Edit mode
      const oldCat = categories.find(c => c.id === editingMenuCategory.id);
      const newName = editingMenuCategory.name || 'Unnamed Category';
      updatedCategories = categories.map(c => c.id === editingMenuCategory.id ? {
        ...c,
        ...editingMenuCategory,
        name: newName,
        displayOrder: Number(editingMenuCategory.displayOrder) || 1
      } as MenuCategoryItem : c);

      if (oldCat && oldCat.name !== newName) {
        const updatedMenuItems = db.menuItems.map(item => {
          if (item.category === oldCat.name) {
            return { ...item, category: newName };
          }
          return item;
        });
        updateDB({ menuCategories: updatedCategories, menuItems: updatedMenuItems });
      } else {
        updateDB({ menuCategories: updatedCategories });
      }
    } else {
      // Add mode
      const newCat: MenuCategoryItem = {
        id: `cat-${Date.now()}`,
        name: editingMenuCategory.name || 'Unnamed Category',
        displayOrder: Number(editingMenuCategory.displayOrder) || (categories.length + 1)
      };
      updatedCategories = [...categories, newCat];
      updateDB({ menuCategories: updatedCategories });
    }

    setEditingMenuCategory(null);
  };

  const handleDeleteMenuCategory = (id: string) => {
    const categories = db.menuCategories || [];
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete) return;

    const nextCategories = categories.filter(c => c.id !== id);
    const firstRemainingCat = nextCategories[0]?.name || 'Starters';
    const nextMenuItems = db.menuItems.map(item => {
      if (item.category === catToDelete.name) {
        return { ...item, category: firstRemainingCat };
      }
      return item;
    });

    updateDB({ menuCategories: nextCategories, menuItems: nextMenuItems });
  };

  const handleMenuImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingMenuItem) {
      const base64 = await convertToBase64(e.target.files[0]);
      setEditingMenuItem({ ...editingMenuItem, imageUrl: base64 });
    }
  };

  // ==========================================
  // GALLERY ACTIONS
  // ==========================================
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const folder: GalleryFolder = {
      id: `fold-${Date.now()}`,
      name: newFolderName.trim()
    };
    updateDB({ galleryFolders: [...db.galleryFolders, folder] });
    setNewFolderName('');
  };

  const handleRenameFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFolderId || !editingFolderName.trim()) return;
    const nextFolders = db.galleryFolders.map(f => f.id === editingFolderId ? { ...f, name: editingFolderName.trim() } : f);
    updateDB({ galleryFolders: nextFolders });
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  const handleDeleteFolder = (id: string) => {
    const nextFolders = db.galleryFolders.filter(f => f.id !== id);
    // Also remove photos or untag folder
    const nextImages = db.galleryImages.filter(img => img.folderId !== id);
    updateDB({ galleryFolders: nextFolders, galleryImages: nextImages });
  };

  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageFile || !newImageTitle.trim() || !newImageFolder) return;

    const img: GalleryImage = {
      id: `img-${Date.now()}`,
      folderId: newImageFolder,
      imageUrl: newImageFile,
      title: newImageTitle.trim(),
      createdAt: new Date().toISOString()
    };

    updateDB({ galleryImages: [...db.galleryImages, img] });
    setNewImageFile(null);
    setNewImageTitle('');
    setNewImageFolder('');
    if (galleryImageInputRef.current) galleryImageInputRef.current.value = '';
  };

  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const b64 = await convertToBase64(e.target.files[0]);
      setNewImageFile(b64);
    }
  };

  const handleDeleteGalleryImage = (id: string) => {
    const nextImages = db.galleryImages.filter(img => img.id !== id);
    updateDB({ galleryImages: nextImages });
  };

  const handleMoveGalleryImage = (imgId: string, destFolderId: string) => {
    const nextImages = db.galleryImages.map(img => img.id === imgId ? { ...img, folderId: destFolderId } : img);
    updateDB({ galleryImages: nextImages });
  };

  // ==========================================
  // EVENT ACTIONS
  // ==========================================
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    let nextEvents: RestaurantEvent[];
    if (editingEvent.id) {
      nextEvents = db.events.map(ev => ev.id === editingEvent.id ? (editingEvent as RestaurantEvent) : ev);
    } else {
      const newEv: RestaurantEvent = {
        id: `event-${Date.now()}`,
        title: editingEvent.title || 'Untitled Event',
        description: editingEvent.description || '',
        imageUrl: editingEvent.imageUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        date: editingEvent.date || 'To Be Announced',
        time: editingEvent.time || 'TBD'
      };
      nextEvents = [...db.events, newEv];
    }
    updateDB({ events: nextEvents });
    setEditingEvent(null);
  };

  const handleEventImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingEvent) {
      const base64 = await convertToBase64(e.target.files[0]);
      setEditingEvent({ ...editingEvent, imageUrl: base64 });
    }
  };

  const handleDeleteEvent = (id: string) => {
    const nextEvents = db.events.filter(e => e.id !== id);
    updateDB({ events: nextEvents });
  };

  // ==========================================
  // REVIEW ACTIONS
  // ==========================================
  const handleReviewStatus = (id: string, newStatus: ReviewStatus) => {
    const nextReviews = db.reviews.map(r => r.id === id ? { ...r, status: newStatus } : r);
    updateDB({ reviews: nextReviews });
  };

  const handleDeleteReview = (id: string) => {
    const nextReviews = db.reviews.filter(r => r.id !== id);
    updateDB({ reviews: nextReviews });
  };

  // ==========================================
  // BACKUP SYSTEM FUNCTIONS
  // ==========================================
  const handleDownloadBackup = () => {
    const backupStr = JSON.stringify(db, null, 2);
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Limelight_Restaurant_DB_Backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.websiteSettings && parsed.menuItems && parsed.bookings) {
            setDb(parsed);
            alert('Database restoration complete! The website state has been successfully rolled back.');
            window.location.reload();
          } else {
            alert('Invalid backup schema. Properties missing.');
          }
        } catch (err) {
          alert('Failed to parse database file. Ensure it is a valid backup JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  // ==========================================
  // USER MANAGEMENT ACTIONS
  // ==========================================
  const handleCreateAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserUsername.trim() || !newUserPassword.trim()) return;

    const newUser: AdminUser = {
      id: `admin-${Date.now()}`,
      username: newUserUsername.trim(),
      password: newUserPassword.trim(),
      role: newUserRole,
      permissions: newUserRole === 'Super Admin' ? ['ALL'] : newUserRole === 'Manager' ? ['RESERVATIONS', 'MENU', 'GALLERY'] : ['MENU', 'GALLERY']
    };

    updateDB({ adminUsers: [...db.adminUsers, newUser] });
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserRole('Editor');
  };

  const handleDeleteAdminUser = (id: string) => {
    if (db.adminUsers.length <= 1) {
      alert('Cannot delete the last remaining administrator account.');
      return;
    }
    const nextUsers = db.adminUsers.filter(u => u.id !== id);
    updateDB({ adminUsers: nextUsers });
  };

  // ==========================================
  // CUSTOM PAGE BUILDER ACTIONS
  // ==========================================
  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    let updatedPages = [...(db.customPages || [])];
    if (editingPage.id) {
      updatedPages = updatedPages.map(p => p.id === editingPage.id ? {
        ...p,
        ...editingPage,
        title: editingPage.title || 'Untitled Page',
        slug: editingPage.slug || 'untitled-page',
        content: editingPage.content || '',
        customCss: editingPage.customCss || '',
        customJs: editingPage.customJs || '',
        isActive: editingPage.isActive !== false,
        displayOrder: Number(editingPage.displayOrder) || 1
      } as CustomPage : p);
    } else {
      const newPage: CustomPage = {
        id: `page-${Date.now()}`,
        title: editingPage.title || 'New Page',
        slug: editingPage.slug || 'new-page',
        content: editingPage.content || '<p>Content goes here...</p>',
        customCss: editingPage.customCss || '',
        customJs: editingPage.customJs || '',
        isActive: editingPage.isActive !== false,
        displayOrder: Number(editingPage.displayOrder) || 1
      };
      updatedPages.push(newPage);
    }

    updateDB({ customPages: updatedPages });
    setEditingPage(null);
  };

  const handleDeletePage = (id: string) => {
    if (confirm('Are you absolutely sure you want to delete this custom page? This removes it from the front navigation.')) {
      updateDB({ customPages: (db.customPages || []).filter(p => p.id !== id) });
    }
  };

  const handleDuplicatePage = (page: CustomPage) => {
    const duplicated: CustomPage = {
      ...page,
      id: `page-${Date.now()}`,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      displayOrder: (page.displayOrder || 1) + 1
    };
    updateDB({ customPages: [...(db.customPages || []), duplicated] });
  };

  // ==========================================
  // BLOG MANAGER ACTIONS
  // ==========================================
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    let updatedBlogs = [...(db.blogs || [])];
    if (editingBlog.id) {
      updatedBlogs = updatedBlogs.map(b => b.id === editingBlog.id ? {
        ...b,
        ...editingBlog,
        title: editingBlog.title || 'Untitled Article',
        content: editingBlog.content || '',
        imageUrl: editingBlog.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        category: editingBlog.category || 'General',
        isPublished: editingBlog.isPublished !== false
      } as BlogPost : b);
    } else {
      const newBlog: BlogPost = {
        id: `blog-${Date.now()}`,
        title: editingBlog.title || 'New Article',
        content: editingBlog.content || '',
        imageUrl: editingBlog.imageUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        category: editingBlog.category || 'Gastronomy',
        createdAt: new Date().toISOString(),
        isPublished: editingBlog.isPublished !== false
      };
      updatedBlogs.push(newBlog);
    }

    updateDB({ blogs: updatedBlogs });
    setEditingBlog(null);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      updateDB({ blogs: (db.blogs || []).filter(b => b.id !== id) });
    }
  };

  // ==========================================
  // SPECIAL OFFER ACTIONS
  // ==========================================
  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    let updatedOffers = [...(db.offers || [])];
    if (editingOffer.id) {
      updatedOffers = updatedOffers.map(o => o.id === editingOffer.id ? {
        ...o,
        ...editingOffer,
        title: editingOffer.title || 'Untitled Promotion',
        description: editingOffer.description || '',
        discountPercentage: Number(editingOffer.discountPercentage) || 0,
        promoCode: editingOffer.promoCode || '',
        expiryDate: editingOffer.expiryDate || '',
        isActive: editingOffer.isActive !== false
      } as SpecialOffer : o);
    } else {
      const newOffer: SpecialOffer = {
        id: `offer-${Date.now()}`,
        title: editingOffer.title || 'New Promotion',
        description: editingOffer.description || '',
        discountPercentage: Number(editingOffer.discountPercentage) || 0,
        promoCode: editingOffer.promoCode || '',
        expiryDate: editingOffer.expiryDate || '',
        isActive: editingOffer.isActive !== false
      };
      updatedOffers.push(newOffer);
    }

    updateDB({ offers: updatedOffers });
    setEditingOffer(null);
  };

  const handleDeleteOffer = (id: string) => {
    if (confirm('Are you sure you want to remove this promotion?')) {
      updateDB({ offers: (db.offers || []).filter(o => o.id !== id) });
    }
  };

  // ==========================================
  // NOTIFICATION & TELEMETRY ACTIONS
  // ==========================================
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    // Create activity log
    const logId = 'log-' + Date.now();
    const newLog: ActivityLog = {
      id: logId,
      action: 'Notification parameters synchronized successfully',
      username: currentUser?.username || 'admin',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    updateDB({
      notificationSettings: {
        emailEnabled: notifEmailEnabled,
        emailAddress: notifEmailAddress,
        whatsappEnabled: notifWhatsappEnabled,
        whatsappNumber: notifWhatsappNumber,
        smsEnabled: notifSmsEnabled,
        smsNumber: notifSmsNumber,
        pushEnabled: notifPushEnabled
      },
      activityLogs: [newLog, ...(db.activityLogs || [])]
    });
    alert('Notification settings and contact alert bindings synchronized successfully!');
  };

  // ==========================================
  // SECURITY & CREDENTIAL ACTIONS
  // ==========================================
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    const logId = 'log-' + Date.now();
    const newLog: ActivityLog = {
      id: logId,
      action: `Security parameters modified. 2FA: ${security2FaEnabled ? 'ON' : 'OFF'}`,
      username: currentUser?.username || 'admin',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    updateDB({
      twoFactorSettings: {
        isEnabled: security2FaEnabled,
        secretCode: securitySecretCode
      },
      activityLogs: [newLog, ...(db.activityLogs || [])]
    });
    alert('Security systems and two-factor code synchronized successfully!');
  };

  const handleClearActivityLogs = () => {
    if (confirm('Are you sure you want to clear system telemetry log history?')) {
      updateDB({ activityLogs: [] });
    }
  };

  // Read-only filter sets
  const unreadBookingsCount = db.bookings.filter(b => b.isUnread).length;

  if (!isAuthenticated) {
    return (
      <div className="py-20 bg-neutral-950 text-white min-h-[75vh] flex items-center justify-center p-4 fade-in-up" id="admin-login-screen">
        <div className="bg-black/90 p-8 border border-white/10 w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black uppercase text-brand tracking-widest">{db.websiteSettings.logo}</h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest">Administrator Portal Login</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" id="admin-auth-form">
            <div className="space-y-1.5">
              <label htmlFor="login-username" className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Username</label>
              <input
                type="text"
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter admin username"
                className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Password</label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                className="w-full bg-neutral-900 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand rounded-none"
              />
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="w-full py-4 bg-brand text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
            >
              Authenticate System
            </button>
          </form>

          <div className="text-center border-t border-white/5 pt-4">
            <button
              onClick={() => setShowForgotHint(!showForgotHint)}
              className="text-[10px] text-gray-500 hover:text-brand uppercase tracking-wider cursor-pointer"
            >
              Forgot Credentials?
            </button>
            {showForgotHint && (
              <p className="text-xs text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/20 p-2 mt-2 leading-relaxed font-mono">
                Hint: Standard development logins are:<br />
                <strong>Username:</strong> admin <br />
                <strong>Password:</strong> admin
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0b0b] min-h-[85vh] text-gray-300 flex flex-col md:flex-row border-t border-white/10" id="admin-dashboard-container">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-black border-r border-white/10 flex flex-col shrink-0">
        {/* Profile Card */}
        <div className="p-6 border-b border-white/10 flex items-center space-x-3 bg-neutral-950">
          <div className="w-10 h-10 bg-brand text-white font-black rounded-none flex items-center justify-center uppercase">
            {currentUser?.username.substring(0, 2)}
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">{currentUser?.username}</h4>
            <span className="text-brand text-[9px] uppercase font-bold tracking-widest">{currentUser?.role}</span>
          </div>
        </div>

        {/* Modules List */}
        <nav className="p-4 flex-1 space-y-1 overflow-y-auto" id="admin-sidebar-nav">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={16} /> },
            { id: 'reservations', label: `Reservations`, icon: <Calendar size={16} />, badge: unreadBookingsCount },
            { id: 'menu', label: 'Food Menu', icon: <Utensils size={16} /> },
            { id: 'pages', label: 'Website Pages', icon: <FileText size={16} /> },
            { id: 'blogs', label: 'Blog Manager', icon: <BookOpen size={16} /> },
            { id: 'offers', label: 'Special Offers', icon: <Percent size={16} /> },
            { id: 'gallery', label: 'Gallery Folders', icon: <ImageIcon size={16} /> },
            { id: 'events', label: 'Events', icon: <Sparkles size={16} /> },
            { id: 'reviews', label: 'Customer Reviews', icon: <MessageSquare size={16} /> },
            { id: 'settings', label: 'Website Settings', icon: <Settings size={16} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
            { id: 'contact', label: 'Contact Details', icon: <Phone size={16} /> },
            { id: 'seo', label: 'SEO Config', icon: <FileText size={16} /> },
            { id: 'social', label: 'Social Channels', icon: <Users size={16} /> },
            { id: 'users', label: 'Admin Users', icon: <Shield size={16} /> },
            { id: 'security', label: 'Security & Logs', icon: <Lock size={16} /> },
            { id: 'backup', label: 'Backup System', icon: <Database size={16} /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id as any);
                setSearchQuery('');
              }}
              className={`w-full text-left px-3.5 py-3 text-xs uppercase font-bold tracking-wider rounded-none flex items-center justify-between transition-colors cursor-pointer ${
                activeModule === item.id 
                  ? 'bg-brand text-white font-bold' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-brand'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-1.5 py-0.5 bg-red-600 text-white rounded-full text-[9px] font-black tracking-normal">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Quick Back & Logout button */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-neutral-950">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full text-center py-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            ← View Front Site
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-center py-2 text-[10px] uppercase font-bold tracking-widest bg-red-950/20 text-red-400 hover:bg-red-950 hover:text-white border border-red-500/10 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <LogOut size={12} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE AREA */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto" id="admin-workspace">
        
        {/* Header Indicator */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {activeModule === 'dashboard' ? 'Metrics Overview' : activeModule.replace(/^[a-z]/, L => L.toUpperCase())}
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">
              Admin Area / {activeModule}
            </p>
          </div>

          {activeModule === 'reservations' && (
            <button
              onClick={handleBookingExport}
              className="px-4 py-2 bg-brand text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-white hover:text-black transition-colors"
            >
              <Download size={14} />
              <span>Export Bookings CSV</span>
            </button>
          )}
        </div>

        {/* ==========================================
            MODULE: DASHBOARD OVERVIEW
            ========================================== */}
        {activeModule === 'dashboard' && (
          <div className="space-y-10" id="admin-module-dashboard">
            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Bookings', value: db.bookings.length, icon: <Calendar size={24} className="text-brand" />, sub: `${db.bookings.filter(b => b.status === 'Pending').length} Pending` },
                { label: 'Menu Dishes', value: db.menuItems.length, icon: <Utensils size={24} className="text-brand" />, sub: `${db.menuItems.filter(m => m.isChefSpecial).length} Specials` },
                { label: 'Gallery Images', value: db.galleryImages.length, icon: <ImageIcon size={24} className="text-brand" />, sub: `${db.galleryFolders.length} Folders` },
                { label: 'Live Visitors', value: db.visitorsCount, icon: <Activity size={24} className="text-brand" />, sub: 'Direct Analytics Counter' }
              ].map((card, idx) => (
                <div key={idx} className="bg-black border border-white/10 p-6 flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">{card.label}</span>
                    <h3 className="text-3xl font-black text-white">{card.value}</h3>
                    <span className="text-brand text-xs font-semibold block">{card.sub}</span>
                  </div>
                  <div className="p-3 bg-brand-10 border border-brand/10">
                    {card.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Responsive SVG Analytic Graph Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart 1: Visitors trend */}
              <div className="bg-black p-6 border border-white/10 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider">Weekly Visitors analytics</h4>
                  <span className="text-brand text-xs font-mono">Real-time counts</span>
                </div>
                <div className="h-64 w-full flex flex-col justify-between">
                  {/* SVG Line & Area chart */}
                  <svg viewBox="0 0 500 200" className="w-full h-48 overflow-visible">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF1493" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#FF1493" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="10" y1="20" x2="490" y2="20" stroke="#222" strokeWidth="1" />
                    <line x1="10" y1="70" x2="490" y2="70" stroke="#222" strokeWidth="1" />
                    <line x1="10" y1="120" x2="490" y2="120" stroke="#222" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="10" y1="170" x2="490" y2="170" stroke="#333" strokeWidth="1.5" />
                    {/* Graph Area */}
                    <path
                      d="M 10 170 L 10 140 L 90 130 L 170 150 L 250 110 L 330 90 L 410 40 L 490 25 L 490 170 Z"
                      fill="url(#chartGrad)"
                    />
                    {/* Graph Line */}
                    <path
                      d="M 10 140 L 90 130 L 170 150 L 250 110 L 330 90 L 410 40 L 490 25"
                      fill="none"
                      stroke="#FF1493"
                      strokeWidth="3.5"
                    />
                    {/* Graph Dots */}
                    <circle cx="10" cy="140" r="4.5" fill="#fff" stroke="#FF1493" strokeWidth="2" />
                    <circle cx="90" cy="130" r="4.5" fill="#fff" stroke="#FF1493" strokeWidth="2" />
                    <circle cx="170" cy="150" r="4.5" fill="#fff" stroke="#FF1493" strokeWidth="2" />
                    <circle cx="250" cy="110" r="4.5" fill="#fff" stroke="#FF1493" strokeWidth="2" />
                    <circle cx="330" cy="90" r="4.5" fill="#fff" stroke="#FF1493" strokeWidth="2" />
                    <circle cx="410" cy="40" r="4.5" fill="#fff" stroke="#FF1493" strokeWidth="2" />
                    <circle cx="490" cy="25" r="5" fill="#FF1493" />
                  </svg>
                  {/* Chart Labels */}
                  <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 px-2">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

              {/* Chart 2: Reservations performance */}
              <div className="bg-black p-6 border border-white/10 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider">Booking Performance logs</h4>
                  <span className="text-emerald-500 text-xs font-mono">100% capacity</span>
                </div>
                <div className="h-64 w-full flex flex-col justify-between">
                  {/* SVG Bar Chart representing bookings categories */}
                  <svg viewBox="0 0 500 200" className="w-full h-48 overflow-visible">
                    {/* Bars */}
                    {/* Bar 1: Pending */}
                    <rect x="50" y="80" width="45" height="90" fill="#EAB308" opacity="0.85" />
                    <text x="72.5" y="70" textAnchor="middle" fill="#EAB308" fontSize="10" fontWeight="bold">
                      {db.bookings.filter(b => b.status === 'Pending').length}
                    </text>
                    {/* Bar 2: Approved */}
                    <rect x="175" y="40" width="45" height="130" fill="#3B82F6" opacity="0.85" />
                    <text x="197.5" y="30" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="bold">
                      {db.bookings.filter(b => b.status === 'Approved').length}
                    </text>
                    {/* Bar 3: Rejected */}
                    <rect x="300" y="145" width="45" height="25" fill="#EF4444" opacity="0.85" />
                    <text x="322.5" y="135" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">
                      {db.bookings.filter(b => b.status === 'Rejected').length}
                    </text>
                    {/* Bar 4: Completed */}
                    <rect x="425" y="120" width="45" height="50" fill="#10B981" opacity="0.85" />
                    <text x="447.5" y="110" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold">
                      {db.bookings.filter(b => b.status === 'Completed').length}
                    </text>
                    
                    {/* Ground line */}
                    <line x1="10" y1="170" x2="490" y2="170" stroke="#333" strokeWidth="1.5" />
                  </svg>
                  {/* Chart Labels */}
                  <div className="flex justify-around text-[10px] uppercase font-bold text-gray-500">
                    <span className="w-1/4 text-center">Pending</span>
                    <span className="w-1/4 text-center">Approved</span>
                    <span className="w-1/4 text-center">Rejected</span>
                    <span className="w-1/4 text-center">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Recent Bookings list */}
            <div className="bg-black border border-white/10 p-6 space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-white/5">
                Outstanding Reservation Requests
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 uppercase tracking-widest font-black h-8">
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Guest</th>
                      <th className="pb-3">Guests</th>
                      <th className="pb-3">Date / Time</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.bookings.filter(b => b.status === 'Pending').map((booking) => (
                      <tr key={booking.id} className="border-b border-white/5 h-12">
                        <td className="font-mono text-brand font-bold">{booking.id}</td>
                        <td>
                          <p className="text-white font-bold">{booking.guestName}</p>
                          <p className="text-gray-500 text-[10px]">{booking.email}</p>
                        </td>
                        <td className="font-semibold text-white">{booking.guestsCount} Pax</td>
                        <td>{booking.date} @ {booking.time}</td>
                        <td className="text-right">
                          <div className="flex justify-end space-x-1">
                            <button
                              onClick={() => handleBookingStatus(booking.id, 'Approved')}
                              className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded border border-emerald-500/10"
                              title="Approve Table"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleBookingStatus(booking.id, 'Rejected')}
                              className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded border border-red-500/10"
                              title="Reject Table"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {db.bookings.filter(b => b.status === 'Pending').length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-gray-500 italic">No pending reservation requests in the queue.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            MODULE: RESERVATION MANAGEMENT
            ========================================== */}
        {activeModule === 'reservations' && (
          <div className="space-y-6" id="admin-module-reservations">
            {/* Sub Tab Navigation */}
            <div className="flex flex-wrap border border-white/10 bg-neutral-950 p-1 mb-6 rounded-none">
              <button
                onClick={() => setBookingSubTab('list')}
                className={`flex-grow sm:flex-1 min-w-[120px] py-3 text-[11px] uppercase font-bold tracking-wider text-center transition-all cursor-pointer ${
                  bookingSubTab === 'list'
                    ? 'bg-brand text-white font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Bookings List ({db.bookings.length})
              </button>
              <button
                onClick={() => setBookingSubTab('calendar')}
                className={`flex-grow sm:flex-1 min-w-[120px] py-3 text-[11px] uppercase font-bold tracking-wider text-center transition-all cursor-pointer ${
                  bookingSubTab === 'calendar'
                    ? 'bg-brand text-white font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Interactive Calendar
              </button>
              <button
                onClick={() => setBookingSubTab('config')}
                className={`flex-grow sm:flex-1 min-w-[120px] py-3 text-[11px] uppercase font-bold tracking-wider text-center transition-all cursor-pointer ${
                  bookingSubTab === 'config'
                    ? 'bg-brand text-white font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Time Slots & Date Blocks
              </button>
            </div>

            {/* SUB-TAB 1: BOOKINGS LIST */}
            {bookingSubTab === 'list' && (
              <div className="space-y-6">
                {/* Filter and search bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search guest, email, mobile..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-white pl-9 pr-3 py-2.5 text-xs rounded-none focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto">
                    {(['All', 'Pending', 'Approved', 'Rejected', 'Completed'] as const).map((stat) => (
                      <button
                        key={stat}
                        onClick={() => setBookingFilter(stat)}
                        className={`px-3 py-2 text-[10px] uppercase font-bold tracking-wider border rounded-none whitespace-nowrap cursor-pointer ${
                          bookingFilter === stat
                            ? 'bg-brand text-white border-brand'
                            : 'bg-neutral-900 text-gray-400 border-white/10 hover:border-brand'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List Table */}
                <div className="bg-black border border-white/10 p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-500 uppercase tracking-widest font-black h-8 font-mono">
                          <th className="pb-3">Reference</th>
                          <th className="pb-3">Guest Detail</th>
                          <th className="pb-3">Date & Time</th>
                          <th className="pb-3">Occasion & Note</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {db.bookings
                          .filter(b => {
                            const matchesFilter = bookingFilter === 'All' || b.status === bookingFilter;
                            const matchesSearch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                  b.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                  b.mobileNumber.includes(searchQuery);
                            return matchesFilter && matchesSearch;
                          })
                          .map((b) => (
                            <tr key={b.id} className="border-b border-white/5 h-16 hover:bg-white/1 font-light">
                              <td className="font-mono text-brand font-bold">{b.id}</td>
                              <td>
                                <p className="text-white font-bold">{b.guestName} ({b.guestsCount} Pax)</p>
                                <p className="text-gray-400 text-[10px]">{b.email} | {b.mobileNumber}</p>
                              </td>
                              <td>{b.date} @ {b.time}</td>
                              <td>
                                <p className="font-bold text-gray-300">{b.occasion}</p>
                                <p className="text-gray-500 text-[10px] line-clamp-1 max-w-xs">{b.specialRequest || 'No special requests'}</p>
                              </td>
                              <td>
                                <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                  b.status === 'Approved' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' :
                                  b.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                  b.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  'bg-red-600/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="text-right">
                                <div className="flex justify-end space-x-1">
                                  {b.status === 'Pending' && (
                                    <>
                                      <button
                                        onClick={() => handleBookingStatus(b.id, 'Approved')}
                                        className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded border border-emerald-500/10 cursor-pointer"
                                        title="Approve"
                                      >
                                        <Check size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleBookingStatus(b.id, 'Rejected')}
                                        className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded border border-red-500/10 cursor-pointer"
                                        title="Reject"
                                      >
                                        <X size={14} />
                                      </button>
                                    </>
                                  )}
                                  {b.status === 'Approved' && (
                                    <button
                                      onClick={() => handleBookingStatus(b.id, 'Completed')}
                                      className="p-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded border border-emerald-500/10 cursor-pointer"
                                      title="Mark Completed"
                                    >
                                      <CheckCircle2 size={14} />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleBookingDelete(b.id)}
                                    className="p-1.5 bg-neutral-900 hover:bg-red-600 hover:text-white rounded border border-white/10 cursor-pointer"
                                    title="Delete Booking"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        {db.bookings.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-gray-500">No bookings matching filter setup.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: INTERACTIVE CALENDAR DASHBOARD */}
            {bookingSubTab === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Interactive Calendar Selector */}
                <div className="lg:col-span-5 bg-neutral-950 border border-white/10 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <h3 className="text-white font-bold uppercase text-xs tracking-widest">Select Date</h3>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          if (adminCalMonth === 0) {
                            setAdminCalMonth(11);
                            setAdminCalYear(adminCalYear - 1);
                          } else {
                            setAdminCalMonth(adminCalMonth - 1);
                          }
                        }}
                        className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white border border-white/10 cursor-pointer"
                      >
                        &larr;
                      </button>
                      <span className="text-xs uppercase font-black text-brand tracking-widest px-2">
                        {[
                          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                        ][adminCalMonth]} {adminCalYear}
                      </span>
                      <button
                        onClick={() => {
                          if (adminCalMonth === 11) {
                            setAdminCalMonth(0);
                            setAdminCalYear(adminCalYear + 1);
                          } else {
                            setAdminCalMonth(adminCalMonth + 1);
                          }
                        }}
                        className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white border border-white/10 cursor-pointer"
                      >
                        &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-gray-500 tracking-wider mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="py-1">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const daysInMonth = new Date(adminCalYear, adminCalMonth + 1, 0).getDate();
                      const firstDayIdx = new Date(adminCalYear, adminCalMonth, 1).getDay();
                      const cells = [];
                      
                      for (let i = 0; i < firstDayIdx; i++) {
                        cells.push(<div key={`empty-${i}`} className="aspect-square" />);
                      }
                      
                      for (let d = 1; d <= daysInMonth; d++) {
                        const dateStr = `${adminCalYear}-${String(adminCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const isSelected = selectedAdminDate === dateStr;
                        const isDateBlocked = db.blockedDates?.some(b => b.date === dateStr);
                        const bookingsOnDate = db.bookings?.filter(b => b.date === dateStr && b.status !== 'Rejected') || [];
                        const pendingBookingsCount = bookingsOnDate.filter(b => b.status === 'Pending').length;
                        
                        let dayBg = 'bg-neutral-900/40 text-gray-400 border border-white/5 hover:border-brand/40';
                        if (isSelected) {
                          dayBg = 'bg-brand text-white border border-brand font-bold scale-105';
                        } else if (isDateBlocked) {
                          dayBg = 'bg-red-950/40 text-red-400 border border-red-500/20 line-through';
                        } else if (bookingsOnDate.length > 0) {
                          dayBg = 'bg-neutral-900 text-white border border-brand/20';
                        }

                        cells.push(
                          <button
                            key={`day-${d}`}
                            onClick={() => setSelectedAdminDate(dateStr)}
                            className={`aspect-square p-1 flex flex-col justify-between items-center relative transition-all duration-200 group cursor-pointer ${dayBg}`}
                          >
                            <span className="text-xs">{d}</span>
                            
                            {/* Visual Dots for bookings */}
                            {!isSelected && bookingsOnDate.length > 0 && (
                              <div className="flex space-x-0.5 justify-center mt-1">
                                {pendingBookingsCount > 0 ? (
                                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" title={`${pendingBookingsCount} Pending`} />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title={`${bookingsOnDate.length} Booked`} />
                                )}
                              </div>
                            )}

                            {isDateBlocked && !isSelected && (
                              <span className="absolute bottom-0 right-0 text-[7px] text-red-500 font-bold px-0.5 uppercase tracking-tighter">
                                Block
                              </span>
                            )}
                          </button>
                        );
                      }
                      return cells;
                    })()}
                  </div>

                  <div className="pt-3 border-t border-white/5 text-[10px] text-gray-500 flex flex-wrap gap-x-4 gap-y-2 justify-center">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 bg-brand inline-block rounded-none" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 bg-red-950/40 border border-red-500/20 inline-block rounded-none" />
                      <span>Blocked Date</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 bg-neutral-900 border border-brand/20 inline-block rounded-none" />
                      <span>Has Bookings</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Time Slot status on Selected Date */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-neutral-950 border border-white/10 p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
                      <div>
                        <h4 className="text-white font-bold uppercase text-xs tracking-widest">
                          Slots for {selectedAdminDate}
                        </h4>
                        <p className="text-gray-500 text-[10px] font-mono mt-0.5">
                          Status dashboard for selected date
                        </p>
                      </div>

                      {/* Block/Unblock toggle shortcut */}
                      {(() => {
                        const blockedDay = db.blockedDates?.find(b => b.date === selectedAdminDate);
                        if (blockedDay) {
                          return (
                            <button
                              onClick={() => {
                                const nextBlocks = db.blockedDates.filter(b => b.date !== selectedAdminDate);
                                updateDB({ blockedDates: nextBlocks });
                              }}
                              className="px-3 py-1.5 bg-red-500 hover:bg-white hover:text-black text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Unblock Entire Date
                            </button>
                          );
                        } else {
                          return (
                            <button
                              onClick={() => {
                                const reason = prompt("Enter a reason for blocking this date:", "Closed for Private Corporate Gala");
                                if (reason !== null) {
                                  const newBlock = {
                                    id: `block-${Date.now()}`,
                                    date: selectedAdminDate,
                                    reason: reason || 'Blocked by administrator'
                                  };
                                  updateDB({ blockedDates: [...db.blockedDates, newBlock] });
                                }
                              }}
                              className="px-3 py-1.5 bg-neutral-900 hover:bg-red-600 hover:text-white border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Block Entire Date
                            </button>
                          );
                        }
                      })()}
                    </div>

                    {/* Date Block Warning */}
                    {(() => {
                      const block = db.blockedDates?.find(b => b.date === selectedAdminDate);
                      if (block) {
                        return (
                          <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-400 rounded-none space-y-1">
                            <h5 className="font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5">
                              <AlertTriangle size={14} />
                              <span>This Date is Blocked</span>
                            </h5>
                            <p className="text-[11px] text-gray-300 font-light font-mono">Reason: {block.reason || 'Blocked by management.'}</p>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Interactive Slots list */}
                    <div className="space-y-3">
                      {db.bookingTimeSlots.map((slot) => {
                        // Determine current slot status for this selected date
                        const isSlotBlockedGlobally = slot.isBlocked;
                        const isDateBlocked = db.blockedDates?.some(b => b.date === selectedAdminDate);
                        const bookingOnSlot = db.bookings?.find(b => b.date === selectedAdminDate && b.time === slot.time && b.status !== 'Rejected');
                        
                        let status: 'Available' | 'Booked' | 'Blocked' = 'Available';
                        if (isSlotBlockedGlobally || isDateBlocked) {
                          status = 'Blocked';
                        } else if (bookingOnSlot) {
                          status = 'Booked';
                        }

                        return (
                          <div
                            key={slot.id}
                            className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none transition-all ${
                              status === 'Available' ? 'bg-neutral-900/30 border-white/5 hover:border-emerald-500/20' :
                              status === 'Booked' ? 'bg-neutral-900 border-yellow-500/10' :
                              'bg-red-950/5 border-red-500/10 opacity-75'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="px-3 py-1.5 bg-black border border-white/10 font-mono text-brand font-black text-xs">
                                {slot.time}
                              </div>
                              <div>
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                                  status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  status === 'Booked' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                  'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                  {status}
                                </span>
                              </div>
                            </div>

                            {/* Details or Quick Actions */}
                            <div className="flex-1 text-left sm:text-right">
                              {status === 'Available' && (
                                <p className="text-gray-500 text-[10px] uppercase tracking-wide">Available for online reservation</p>
                              )}
                              {status === 'Blocked' && (
                                <p className="text-red-400 text-[10px] font-light">
                                  {isSlotBlockedGlobally ? 'Globally Blocked' : 'Blocked by Date Policy'}
                                </p>
                              )}
                              {status === 'Booked' && bookingOnSlot && (
                                <div className="text-xs">
                                  <p className="text-white font-bold uppercase">{bookingOnSlot.guestName} ({bookingOnSlot.guestsCount} Pax)</p>
                                  <p className="text-[10px] text-gray-400">
                                    Ref: <span className="font-mono text-brand font-bold select-all">{bookingOnSlot.id}</span>
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Actions on this slot */}
                            <div className="flex justify-end space-x-1.5">
                              {status === 'Booked' && bookingOnSlot && (
                                <div className="flex space-x-1">
                                  {bookingOnSlot.status === 'Pending' && (
                                    <>
                                      <button
                                        onClick={() => handleBookingStatus(bookingOnSlot.id, 'Approved')}
                                        className="p-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 rounded cursor-pointer"
                                        title="Approve Reservation"
                                      >
                                        <Check size={12} />
                                      </button>
                                      <button
                                        onClick={() => handleBookingStatus(bookingOnSlot.id, 'Rejected')}
                                        className="p-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/10 rounded cursor-pointer"
                                        title="Reject Reservation"
                                      >
                                        <X size={12} />
                                      </button>
                                    </>
                                  )}
                                  {bookingOnSlot.status === 'Approved' && (
                                    <button
                                      onClick={() => handleBookingStatus(bookingOnSlot.id, 'Completed')}
                                      className="p-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 rounded cursor-pointer"
                                      title="Mark Completed"
                                    >
                                      <CheckCircle2 size={12} />
                                    </button>
                                  )}
                                </div>
                              )}
                              {status === 'Available' && (
                                <button
                                  onClick={() => {
                                    const guestName = prompt("Enter offline Walk-in Guest Name:");
                                    if (!guestName) return;
                                    const guestPhone = prompt("Enter Contact Number:", "+91 ");
                                    const pax = prompt("Enter Guests Count (pax):", "4");
                                    const bId = `book-${Date.now()}`;
                                    const newBk: Booking = {
                                      id: bId,
                                      guestName: guestName,
                                      mobileNumber: guestPhone || 'N/A',
                                      email: 'walkin@limelight.com',
                                      guestsCount: Number(pax) || 2,
                                      date: selectedAdminDate,
                                      time: slot.time,
                                      occasion: 'Walk-in',
                                      specialRequest: 'Created manually by Administrator',
                                      status: 'Approved',
                                      createdAt: new Date().toISOString(),
                                      isUnread: false
                                    };
                                    updateDB({ bookings: [...db.bookings, newBk] });
                                  }}
                                  className="px-2 py-1 bg-neutral-900 border border-white/10 hover:bg-brand text-gray-300 hover:text-white text-[9px] font-bold uppercase tracking-wider rounded-none cursor-pointer"
                                >
                                  + Walk-in
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: CONFIGURATION (SLOTS & BLOCKS) */}
            {bookingSubTab === 'config' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Predefined Booking Time Slots */}
                <div className="bg-neutral-950 border border-white/10 p-6 space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h4 className="text-white font-bold uppercase text-xs tracking-widest">Global Time Slots</h4>
                    <p className="text-gray-500 text-[10px] mt-0.5">Predefined daily slots for reservations</p>
                  </div>

                  {/* Add Slot Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newSlotTime.trim()) return;
                      const nextSlots = [
                        ...db.bookingTimeSlots,
                        { id: `slot-${Date.now()}`, time: newSlotTime.trim(), isBlocked: false }
                      ];
                      updateDB({ bookingTimeSlots: nextSlots });
                      setNewSlotTime('');
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="E.g. 05:00 PM, 11:30 AM"
                      value={newSlotTime}
                      onChange={(e) => setNewSlotTime(e.target.value)}
                      required
                      className="flex-grow bg-neutral-900 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-brand rounded-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand text-white text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all cursor-pointer"
                    >
                      Add Slot
                    </button>
                  </form>

                  {/* Slots List */}
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {db.bookingTimeSlots.map((slot) => (
                      <div key={slot.id} className="p-3 bg-neutral-900 border border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-xs text-brand font-black">{slot.time}</span>
                          <span className={`px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest ${
                            slot.isBlocked ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'
                          }`}>
                            {slot.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Block/Unblock toggle */}
                          <button
                            onClick={() => {
                              const nextSlots = db.bookingTimeSlots.map(s => s.id === slot.id ? { ...s, isBlocked: !s.isBlocked } : s);
                              updateDB({ bookingTimeSlots: nextSlots });
                            }}
                            className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                              slot.isBlocked 
                                ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/10 hover:bg-emerald-500 hover:text-white'
                                : 'bg-red-950/20 text-red-400 border-red-500/10 hover:bg-red-600 hover:text-white'
                            }`}
                          >
                            {slot.isBlocked ? 'Unblock' : 'Block'}
                          </button>

                          {/* Delete Slot */}
                          <button
                            onClick={() => {
                              const nextSlots = db.bookingTimeSlots.filter(s => s.id !== slot.id);
                              updateDB({ bookingTimeSlots: nextSlots });
                            }}
                            className="p-1 hover:bg-red-600 hover:text-white text-gray-500 border border-transparent rounded cursor-pointer"
                            title="Delete Slot"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blocked Dates List & Manager */}
                <div className="bg-neutral-950 border border-white/10 p-6 space-y-6">
                  <div className="border-b border-white/5 pb-3">
                    <h4 className="text-white font-bold uppercase text-xs tracking-widest">Blocked Dates Management</h4>
                    <p className="text-gray-500 text-[10px] mt-0.5">Define holidays or full closed days</p>
                  </div>

                  {/* Add Block Date Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newBlockedDate) return;
                      const nextBlocks = [
                        ...db.blockedDates,
                        {
                          id: `block-${Date.now()}`,
                          date: newBlockedDate,
                          reason: newBlockedReason.trim() || 'Closed by management'
                        }
                      ];
                      updateDB({ blockedDates: nextBlocks });
                      setNewBlockedDate('');
                      setNewBlockedReason('');
                    }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Date *</label>
                        <input
                          type="date"
                          required
                          value={newBlockedDate}
                          onChange={(e) => setNewBlockedDate(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-brand rounded-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Reason</label>
                        <input
                          type="text"
                          placeholder="e.g. Festival / Renovations"
                          value={newBlockedReason}
                          onChange={(e) => setNewBlockedReason(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-brand rounded-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-brand text-white text-xs font-black uppercase tracking-wider hover:bg-white hover:text-black transition-all cursor-pointer"
                    >
                      Block This Date
                    </button>
                  </form>

                  {/* Blocked Dates list */}
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                    {db.blockedDates.map((block) => (
                      <div key={block.id} className="p-3 bg-neutral-900 border border-white/5 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-mono text-xs text-white font-bold">{block.date}</p>
                          <p className="text-gray-500 text-[10px] font-mono">{block.reason || 'Closed'}</p>
                        </div>
                        <button
                          onClick={() => {
                            const nextBlocks = db.blockedDates.filter(b => b.id !== block.id);
                            updateDB({ blockedDates: nextBlocks });
                          }}
                          className="px-2 py-1 bg-red-950/30 text-red-400 hover:bg-red-600 hover:text-white text-[8px] font-bold uppercase tracking-wider transition-all border border-red-500/10 cursor-pointer"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                    {db.blockedDates.length === 0 && (
                      <p className="text-center py-6 text-xs text-gray-500 uppercase tracking-wider">No blocked dates registered.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            MODULE: MENU MANAGEMENT
            ========================================== */}
        {activeModule === 'menu' && (
          <div className="space-y-6" id="admin-module-menu">
            
            {/* Inner Sub Tabs for Dishes & Categories */}
            <div className="flex border-b border-white/10 gap-6 pb-2">
              <button
                onClick={() => setMenuSubTab('dishes')}
                className={`pb-2.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  menuSubTab === 'dishes'
                    ? 'border-brand text-brand font-black'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Manage Dishes
              </button>
              <button
                onClick={() => setMenuSubTab('categories')}
                className={`pb-2.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  menuSubTab === 'categories'
                    ? 'border-brand text-brand font-black'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Manage Categories
              </button>
            </div>

            {menuSubTab === 'dishes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search dishes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-white pl-9 pr-3 py-2.5 text-xs rounded-none focus:outline-none focus:border-brand"
                    />
                  </div>
                  
                  <button
                    id="add-menu-item-btn"
                    onClick={() => setEditingMenuItem({
                      name: '',
                      category: (db.menuCategories && db.menuCategories[0]?.name) || 'Starters',
                      description: '',
                      price: 250.00,
                      imageUrl: '',
                      isChefSpecial: false,
                      isAvailable: true,
                      isVeg: true,
                      displayOrder: 1
                    })}
                    className="px-4 py-2.5 bg-brand text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Food Item</span>
                  </button>
                </div>

                {/* Dishes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[...db.menuItems]
                    .sort((a, b) => {
                      const orderA = a.displayOrder ?? 999;
                      const orderB = b.displayOrder ?? 999;
                      if (orderA !== orderB) return orderA - orderB;
                      return a.name.localeCompare(b.name);
                    })
                    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => (
                      <div key={item.id} className="bg-black border border-white/10 p-5 flex flex-col justify-between relative">
                        <div className="space-y-4">
                          <div className="h-44 bg-neutral-900 border border-white/5 relative">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            {item.isChefSpecial && (
                              <span className="absolute top-2 left-2 bg-brand text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                Special
                              </span>
                            )}
                            {!item.isAvailable && (
                              <span className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                                Sold Out
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-start gap-1">
                              <div className="flex items-center space-x-1.5">
                                <div className={`w-3 h-3 border flex items-center justify-center shrink-0 ${item.isVeg !== false ? 'border-green-600' : 'border-red-600'}`}>
                                  <div className={`w-1 rounded-full h-1 ${item.isVeg !== false ? 'bg-green-600' : 'bg-red-600'}`} />
                                </div>
                                <h4 className="text-white font-bold uppercase text-sm line-clamp-1">{item.name}</h4>
                              </div>
                              <span className="text-brand font-black text-sm shrink-0">{formatPrice(item.price, db.websiteSettings)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] uppercase text-gray-500 font-bold tracking-widest">{item.category}</span>
                              <span className="text-[9px] font-mono text-gray-500 font-bold">Order: {item.displayOrder || 1}</span>
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed font-light">{item.description}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 mt-4 border-t border-white/5 justify-end">
                          <button
                            onClick={() => setEditingMenuItem(item)}
                            className="px-2.5 py-1.5 bg-neutral-900 hover:bg-brand text-white border border-white/10 text-[10px] uppercase font-bold flex items-center space-x-1"
                          >
                            <Edit3 size={10} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="px-2.5 py-1.5 bg-red-950/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/10 text-[10px] uppercase font-bold flex items-center space-x-1"
                          >
                            <Trash2 size={10} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {menuSubTab === 'categories' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h4 className="text-white text-sm font-black uppercase tracking-wider">Dynamic Menu Categories</h4>
                  <button
                    onClick={() => setEditingMenuCategory({
                      name: '',
                      displayOrder: ((db.menuCategories || []).length + 1)
                    })}
                    className="px-4 py-2 bg-brand text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add New Category</span>
                  </button>
                </div>

                <div className="bg-neutral-950 border border-white/10 p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                          <th className="py-3 px-4">Category Name</th>
                          <th className="py-3 px-4">Display Order</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[...(db.menuCategories || [])]
                          .sort((a, b) => a.displayOrder - b.displayOrder)
                          .map((cat) => (
                            <tr key={cat.id} className="hover:bg-white/5 text-white">
                              <td className="py-3.5 px-4 font-bold">{cat.name}</td>
                              <td className="py-3.5 px-4 font-mono">{cat.displayOrder}</td>
                              <td className="py-3.5 px-4 text-right space-x-2">
                                <button
                                  onClick={() => setEditingMenuCategory(cat)}
                                  className="px-2.5 py-1.5 bg-neutral-900 border border-white/5 hover:border-brand hover:text-brand text-[9px] uppercase font-bold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete "${cat.name}"? All existing dishes under this category will automatically be transferred to the first remaining category so they are not orphaned.`)) {
                                      handleDeleteMenuCategory(cat.id);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 bg-red-950/20 text-red-400 border border-red-500/10 hover:bg-red-600 hover:text-white text-[9px] uppercase font-bold"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        {(db.menuCategories || []).length === 0 && (
                          <tr>
                            <td colSpan={3} className="text-center py-8 text-gray-500 uppercase tracking-wider">
                              No categories registered. Click Add New Category above to start.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Editing/Creating menu item Modal popup */}
            {editingMenuItem && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-neutral-950 border border-white/15 w-full max-w-lg p-8 relative space-y-6 max-h-[90vh] overflow-y-auto">
                  <button onClick={() => setEditingMenuItem(null)} className="absolute top-4 right-4 text-gray-400 hover:text-brand">
                    <X size={20} />
                  </button>
                  <h3 className="text-xl font-black uppercase text-white tracking-wide border-b border-white/10 pb-2">
                    {editingMenuItem.id ? 'Edit Menu Item' : 'Create Menu Item'}
                  </h3>

                  <form onSubmit={handleSaveMenuItem} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-wider font-semibold block">Dish Name</label>
                      <input
                        type="text"
                        required
                        value={editingMenuItem.name || ''}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-gray-400 uppercase tracking-wider font-semibold block">Category</label>
                        <select
                          value={editingMenuItem.category || 'Starters'}
                          onChange={(e) => setEditingMenuItem({ ...editingMenuItem, category: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                        >
                          {(db.menuCategories || []).map((cat) => (
                            <option key={cat.id} value={cat.name} className="bg-neutral-950">{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-400 uppercase tracking-wider font-semibold block">Price (₹ INR)</label>
                        <input
                          type="number"
                          step="1"
                          required
                          value={editingMenuItem.price || 0}
                          onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: Number(e.target.value) })}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-gray-400 uppercase tracking-wider font-semibold block">Food Type</label>
                        <select
                          value={editingMenuItem.isVeg !== false ? 'Veg' : 'Non-Veg'}
                          onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isVeg: e.target.value === 'Veg' })}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                        >
                          <option value="Veg" className="bg-neutral-950">Veg (Vegetarian)</option>
                          <option value="Non-Veg" className="bg-neutral-950">Non-Veg (Non-Vegetarian)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-400 uppercase tracking-wider font-semibold block">Display Order</label>
                        <input
                          type="number"
                          required
                          value={editingMenuItem.displayOrder || 1}
                          onChange={(e) => setEditingMenuItem({ ...editingMenuItem, displayOrder: Number(e.target.value) })}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-wider font-semibold block">Description</label>
                      <textarea
                        rows={2}
                        value={editingMenuItem.description || ''}
                        onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none resize-none animate-fade-in"
                      />
                    </div>

                    {/* Advanced Dynamic Fields (Future-Proof Menu System) */}
                    <div className="border border-white/5 bg-white/[0.02] p-4 space-y-4">
                      <h4 className="text-xs font-black uppercase text-brand tracking-widest border-b border-white/5 pb-1">Advanced Gastronomy Fields</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-gray-400 uppercase tracking-wider font-semibold block text-[10px]">Subcategory</label>
                          <input
                            type="text"
                            placeholder="e.g. Clay Oven, Shakes, Spicy"
                            value={editingMenuItem.subcategory || ''}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, subcategory: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand rounded-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-gray-400 uppercase tracking-wider font-semibold block text-[10px]">Offer / Discount Price (₹ INR)</label>
                          <input
                            type="number"
                            step="1"
                            placeholder="Leave empty or 0 if no offer"
                            value={editingMenuItem.discountPrice || ''}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, discountPrice: Number(e.target.value) || undefined })}
                            className="w-full bg-neutral-900 border border-white/10 text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand rounded-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-gray-400 uppercase tracking-wider font-semibold block text-[10px]">Spicy Level</label>
                          <select
                            value={editingMenuItem.spicyLevel || 0}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, spicyLevel: Number(e.target.value) })}
                            className="w-full bg-neutral-900 border border-white/10 text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand rounded-none cursor-pointer"
                          >
                            <option value={0} className="bg-neutral-950">0 - Not Spicy</option>
                            <option value={1} className="bg-neutral-950">1 - Mild (🌶️)</option>
                            <option value={2} className="bg-neutral-950">2 - Medium (🌶️🌶️)</option>
                            <option value={3} className="bg-neutral-950">3 - Extra Hot (🌶️🌶️🌶️)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-gray-400 uppercase tracking-wider font-semibold block text-[10px]">Prep Time</label>
                          <input
                            type="text"
                            placeholder="e.g. 15-20 mins"
                            value={editingMenuItem.prepTime || ''}
                            onChange={(e) => setEditingMenuItem({ ...editingMenuItem, prepTime: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand rounded-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-400 uppercase tracking-wider font-semibold block text-[10px]">Tags / Attributes (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Gluten-Free, Vegan, Nuts-Free, Chef Pick"
                          value={editingMenuItem.tags ? editingMenuItem.tags.join(', ') : ''}
                          onChange={(e) => setEditingMenuItem({ 
                            ...editingMenuItem, 
                            tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                          })}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand rounded-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-400 uppercase tracking-wider font-semibold block text-[10px]">Multi-Image Gallery (one URL per line)</label>
                        <textarea
                          rows={2}
                          placeholder="Paste additional image URLs, each on a new line"
                          value={editingMenuItem.additionalImages ? editingMenuItem.additionalImages.join('\n') : ''}
                          onChange={(e) => setEditingMenuItem({ 
                            ...editingMenuItem, 
                            additionalImages: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) 
                          })}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-brand rounded-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Image uploads base64 */}
                    <div className="space-y-2">
                      <label className="text-gray-400 uppercase tracking-wider font-semibold block">Dish Image</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          placeholder="Image URL or Base64 String"
                          value={editingMenuItem.imageUrl || ''}
                          onChange={(e) => setEditingMenuItem({ ...editingMenuItem, imageUrl: e.target.value })}
                          className="flex-1 bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                        />
                        <button
                          type="button"
                          onClick={() => menuImageInputRef.current?.click()}
                          className="px-3 py-2 bg-neutral-900 border border-white/10 hover:border-brand hover:text-brand text-gray-300 tracking-wider font-bold shrink-0"
                        >
                          Upload File
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          ref={menuImageInputRef}
                          onChange={handleMenuImageFile}
                          className="hidden"
                        />
                      </div>
                      {editingMenuItem.imageUrl && (
                        <img src={editingMenuItem.imageUrl} alt="Preview" className="h-16 w-16 object-cover border border-white/10 mt-2 animate-fade-in" />
                      )}
                    </div>

                    <div className="flex space-x-6 pt-2">
                      <label className="flex items-center space-x-2 text-white font-bold uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!editingMenuItem.isChefSpecial}
                          onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isChefSpecial: e.target.checked })}
                          className="accent-[#FF1493]"
                        />
                        <span>Chef Special</span>
                      </label>

                      <label className="flex items-center space-x-2 text-white font-bold uppercase cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingMenuItem.isAvailable !== false}
                          onChange={(e) => setEditingMenuItem({ ...editingMenuItem, isAvailable: e.target.checked })}
                          className="accent-[#FF1493]"
                        />
                        <span>Is Available</span>
                      </label>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-colors"
                      >
                        Commit Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMenuItem(null)}
                        className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-gray-400 uppercase tracking-widest"
                      >
                        Discard
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Editing/Creating menu Category Modal popup */}
            {editingMenuCategory && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-neutral-950 border border-white/15 w-full max-w-sm p-8 relative space-y-6">
                  <button onClick={() => setEditingMenuCategory(null)} className="absolute top-4 right-4 text-gray-400 hover:text-brand">
                    <X size={20} />
                  </button>
                  <h3 className="text-lg font-black uppercase text-white tracking-wide border-b border-white/10 pb-2">
                    {editingMenuCategory.id ? 'Edit Category' : 'Create Category'}
                  </h3>

                  <form onSubmit={handleSaveMenuCategory} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-wider font-semibold block">Category Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Starters, Chef Specials"
                        value={editingMenuCategory.name || ''}
                        onChange={(e) => setEditingMenuCategory({ ...editingMenuCategory, name: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-wider font-semibold block">Display Order (Sorting)</label>
                      <input
                        type="number"
                        required
                        value={editingMenuCategory.displayOrder || 1}
                        onChange={(e) => setEditingMenuCategory({ ...editingMenuCategory, displayOrder: Number(e.target.value) })}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-colors"
                      >
                        Save Category
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMenuCategory(null)}
                        className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-gray-400 uppercase tracking-widest"
                      >
                        Discard
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==========================================
            MODULE: GALLERY MANAGEMENT
            // Create folder, rename folder, upload base64 images
            ========================================== */}
        {activeModule === 'gallery' && (
          <div className="space-y-10" id="admin-module-gallery">
            
            {/* Folder creation box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-950 p-6 border border-white/10">
              <form onSubmit={handleCreateFolder} className="space-y-3">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Create Gallery Folder</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g., Special Interiors, Wine Cellar"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    required
                    className="flex-1 bg-neutral-900 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-brand"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-brand text-white text-xs uppercase font-bold tracking-wider"
                  >
                    Add Folder
                  </button>
                </div>
              </form>

              {/* Rename folders panel */}
              {editingFolderId ? (
                <form onSubmit={handleRenameFolder} className="space-y-3">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider">Rename Selected Folder</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      required
                      className="flex-1 bg-neutral-900 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-brand"
                    />
                    <button
                      type="submit"
                      className="px-4 bg-emerald-600 text-white text-xs uppercase font-bold tracking-wider"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFolderId(null)}
                      className="px-3 bg-neutral-900 text-gray-400 text-xs uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center text-xs text-gray-500 italic">
                  Select a folder from the list below to rename or delete folder structures.
                </div>
              )}
            </div>

            {/* Folder Directories list */}
            <div className="bg-black p-6 border border-white/10 space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-white/5">
                Directories structure
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {db.galleryFolders.map((f) => (
                  <div key={f.id} className="p-4 bg-neutral-950 border border-white/5 flex items-center justify-between group">
                    <div className="flex items-center space-x-2.5">
                      <Folder size={16} className="text-brand shrink-0" />
                      <div>
                        <p className="text-white font-bold text-xs">{f.name}</p>
                        <span className="text-[10px] text-gray-500">
                          {db.galleryImages.filter(img => img.folderId === f.id).length} Photos
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingFolderId(f.id);
                          setEditingFolderName(f.name);
                        }}
                        className="p-1 hover:text-brand"
                        title="Rename folder"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteFolder(f.id)}
                        className="p-1 hover:text-red-500"
                        title="Delete Folder & Photos"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload Form */}
            <form onSubmit={handleGalleryUpload} className="bg-neutral-950 p-6 border border-white/10 space-y-4 text-xs">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider">Upload New Image</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold">Image Title</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Private Party Hall Setup"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold">Target Folder</label>
                  <select
                    required
                    value={newImageFolder}
                    onChange={(e) => setNewImageFolder(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand"
                  >
                    <option value="" className="bg-neutral-950">-- Select Folder --</option>
                    {db.galleryFolders.map(folder => (
                      <option key={folder.id} value={folder.id} className="bg-neutral-950">{folder.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => galleryImageInputRef.current?.click()}
                    className="w-full py-2 bg-neutral-900 border border-white/10 hover:border-brand hover:text-brand text-gray-300 tracking-wider font-bold h-10"
                  >
                    Select File (JPG, PNG)
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={galleryImageInputRef}
                    onChange={handleGalleryFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {newImageFile && (
                <div className="space-y-2">
                  <p className="text-gray-500 text-[10px]">Image ready to commit:</p>
                  <img src={newImageFile} alt="Chosen file preview" className="h-32 w-48 object-cover border border-white/10" />
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black"
                    >
                      Publish Image to Folder
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Gallery Images database viewer with folder change */}
            <div className="bg-black p-6 border border-white/10 space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-white/5">
                Active Photos in Gallery Database
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {db.galleryImages.map((img) => (
                  <div key={img.id} className="bg-neutral-950 border border-white/5 p-3 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-36 bg-neutral-900 border border-white/5">
                        <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-white font-bold text-xs uppercase line-clamp-1">{img.title}</p>
                      
                      {/* Quick Move Selector */}
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase text-gray-500 block font-bold">Move to Folder:</span>
                        <select
                          value={img.folderId}
                          onChange={(e) => handleMoveGalleryImage(img.id, e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 text-gray-400 text-[10px] focus:outline-none"
                        >
                          {db.galleryFolders.map(folder => (
                            <option key={folder.id} value={folder.id} className="bg-neutral-950">{folder.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => handleDeleteGalleryImage(img.id)}
                        className="p-1 text-red-500 hover:text-white hover:bg-red-600 rounded"
                        title="Delete Image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            MODULE: EVENTS MANAGEMENT
            ========================================== */}
        {activeModule === 'events' && (
          <div className="space-y-6" id="admin-module-events">
            <div className="flex justify-end">
              <button
                onClick={() => setEditingEvent({
                  title: '',
                  description: '',
                  imageUrl: '',
                  date: '',
                  time: ''
                })}
                className="px-4 py-2 bg-brand text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-white hover:text-black cursor-pointer"
              >
                <Plus size={14} />
                <span>Create Event Slot</span>
              </button>
            </div>

            {editingEvent && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-neutral-950 border border-white/15 w-full max-w-lg p-8 relative space-y-5">
                  <button onClick={() => setEditingEvent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-brand">
                    <X size={20} />
                  </button>
                  <h3 className="text-xl font-black uppercase text-white tracking-wide border-b border-white/10 pb-2">
                    {editingEvent.id ? 'Edit Event Slot' : 'Create Event Slot'}
                  </h3>

                  <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-widest font-bold">Event Title</label>
                      <input
                        type="text"
                        required
                        value={editingEvent.title || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-gray-400 uppercase tracking-widest font-bold">Occurs Date</label>
                        <input
                          type="text"
                          placeholder="E.g., Every Saturday"
                          required
                          value={editingEvent.date || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-gray-400 uppercase tracking-widest font-bold">Time Window</label>
                        <input
                          type="text"
                          placeholder="E.g., 09 PM - 02 AM"
                          required
                          value={editingEvent.time || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-widest font-bold">Event Summary Description</label>
                      <textarea
                        rows={3}
                        required
                        value={editingEvent.description || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-400 uppercase tracking-widest font-bold">Banner Photo</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          placeholder="Image URL or upload"
                          value={editingEvent.imageUrl || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                          className="flex-1 bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => eventImageInputRef.current?.click()}
                          className="px-3 h-9 bg-neutral-900 border border-white/10 text-gray-300"
                        >
                          Select File
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          ref={eventImageInputRef}
                          onChange={handleEventImageFile}
                          className="hidden"
                        />
                      </div>
                      {editingEvent.imageUrl && (
                        <img src={editingEvent.imageUrl} alt="preview" className="h-16 w-32 object-cover border border-white/10 mt-2" />
                      )}
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-brand text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                      >
                        Commit Event Slot
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEvent(null)}
                        className="px-4 py-3 bg-neutral-900 text-gray-400 uppercase"
                      >
                        Discard
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* Events Grid list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {db.events.map((ev) => (
                <div key={ev.id} className="bg-black border border-white/10 p-5 flex flex-col md:flex-row gap-5 items-start">
                  <img src={ev.imageUrl} alt={ev.title} className="w-full md:w-40 h-40 object-cover border border-white/5 shrink-0" />
                  <div className="flex-1 space-y-2 flex flex-col justify-between h-40">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-brand uppercase tracking-widest">{ev.date} @ {ev.time}</span>
                      <h4 className="text-white font-bold uppercase text-sm line-clamp-1">{ev.title}</h4>
                      <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed font-light">{ev.description}</p>
                    </div>
                    <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                      <button
                        onClick={() => setEditingEvent(ev)}
                        className="px-2 py-1 bg-neutral-900 text-[10px] uppercase font-bold border border-white/10 hover:border-brand hover:text-brand"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="px-2 py-1 bg-red-950/20 text-red-400 text-[10px] uppercase font-bold border border-red-500/10 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==========================================
            MODULE: CUSTOMER REVIEWS
            ========================================== */}
        {activeModule === 'reviews' && (
          <div className="space-y-6" id="admin-module-reviews">
            <div className="flex justify-end space-x-1">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((rStat) => (
                <button
                  key={rStat}
                  onClick={() => setReviewFilter(rStat)}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider border rounded-none whitespace-nowrap cursor-pointer ${
                    reviewFilter === rStat
                      ? 'bg-brand text-white border-brand'
                      : 'bg-neutral-900 text-gray-400 border-white/10 hover:border-brand'
                  }`}
                >
                  {rStat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {db.reviews
                .filter(r => reviewFilter === 'All' || r.status === reviewFilter)
                .map((r) => (
                  <div key={r.id} className="bg-black p-6 border border-white/10 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold uppercase text-xs">{r.guestName}</span>
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                          r.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                          r.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25' :
                          'bg-red-500/10 text-red-400 border-red-500/25'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < r.rating ? 'fill-brand text-brand' : 'text-gray-700'} />
                        ))}
                      </div>

                      <p className="text-gray-300 text-xs italic leading-relaxed">
                        "{r.reviewText}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex justify-end gap-2">
                      {r.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleReviewStatus(r.id, 'Approved')}
                            className="px-2 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 text-[10px] uppercase font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewStatus(r.id, 'Rejected')}
                            className="px-2 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/10 text-[10px] uppercase font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {r.status === 'Approved' && (
                        <button
                          onClick={() => handleReviewStatus(r.id, 'Rejected')}
                          className="px-2 py-1.5 bg-red-950/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/10 text-[10px] uppercase font-bold"
                        >
                          Revoke
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="px-2 py-1.5 bg-neutral-900 hover:bg-red-600 hover:text-white text-[10px] uppercase font-bold text-gray-400 border border-white/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ==========================================
            MODULE: WEBSITE & CURRENCY SETTINGS
            ========================================== */}
        {activeModule === 'settings' && (
          <div className="space-y-6 max-w-3xl" id="admin-settings-container">
            {/* Settings inner tabs */}
            <div className="flex border-b border-white/10 gap-6 pb-2">
              <button
                type="button"
                onClick={() => setSettingsTab('general')}
                className={`pb-2.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  settingsTab === 'general'
                    ? 'border-brand text-brand font-black'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                General Settings
              </button>
              <button
                type="button"
                onClick={() => setSettingsTab('currency')}
                className={`pb-2.5 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                  settingsTab === 'currency'
                    ? 'border-brand text-brand font-black'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Currency & Pricing Settings
              </button>
            </div>

            {settingsTab === 'general' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('General settings updated successfully!');
                }}
                className="bg-neutral-950 p-8 border border-white/10 space-y-6"
              >
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Restaurant Name</label>
                    <input
                      type="text"
                      required
                      value={db.websiteSettings.restaurantName}
                      onChange={(e) => updateDB({ websiteSettings: { ...db.websiteSettings, restaurantName: e.target.value } })}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>

                  {/* Logo text */}
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Logo Headline Text</label>
                    <input
                      type="text"
                      required
                      value={db.websiteSettings.logo}
                      onChange={(e) => updateDB({ websiteSettings: { ...db.websiteSettings, logo: e.target.value } })}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none focus:border-brand rounded-none"
                    />
                  </div>

                  {/* Theme color custom hex */}
                  <div className="space-y-2">
                    <label className="text-gray-400 uppercase tracking-widest font-bold block">Theme Color Scheme</label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="color"
                        value={db.websiteSettings.themeColor}
                        onChange={(e) => updateDB({ websiteSettings: { ...db.websiteSettings, themeColor: e.target.value } })}
                        className="w-12 h-10 border border-white/15 bg-neutral-900 p-1 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={db.websiteSettings.themeColor}
                        onChange={(e) => updateDB({ websiteSettings: { ...db.websiteSettings, themeColor: e.target.value } })}
                        className="flex-1 bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none font-mono"
                      />
                    </div>
                    <p className="text-gray-500 text-[10px]">Changes are reflected live in all public views immediately!</p>
                  </div>

                  {/* Footer text */}
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Footer copyright notes</label>
                    <textarea
                      rows={3}
                      required
                      value={db.websiteSettings.footerText}
                      onChange={(e) => updateDB({ websiteSettings: { ...db.websiteSettings, footerText: e.target.value } })}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none focus:border-brand rounded-none resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-colors"
                >
                  Commit General Settings
                </button>
              </form>
            )}

            {settingsTab === 'currency' && (
              <div className="space-y-8 animate-fade-in">
                {/* 1. Core Currency Configuration */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Currency configurations saved successfully!');
                  }}
                  className="bg-neutral-950 p-8 border border-white/10 space-y-6"
                >
                  <h3 className="text-white text-sm font-black uppercase tracking-wider border-b border-white/10 pb-2">
                    Currency Formatting Controls
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Default Currency Select */}
                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-widest font-bold block">Default Currency</label>
                      <select
                        value={db.websiteSettings.currencyCode || 'INR'}
                        onChange={(e) => {
                          const val = e.target.value;
                          let symbol = '₹';
                          let pos: 'before' | 'after' = 'before';
                          
                          if (val === 'INR') { symbol = '₹'; pos = 'before'; }
                          else if (val === 'USD') { symbol = '$'; pos = 'before'; }
                          else if (val === 'EUR') { symbol = '€'; pos = 'before'; }
                          else if (val === 'GBP') { symbol = '£'; pos = 'before'; }
                          else if (val === 'AED') { symbol = 'د.إ'; pos = 'after'; }
                          else if (val === 'CAD') { symbol = '$'; pos = 'before'; }
                          else if (val === 'AUD') { symbol = '$'; pos = 'before'; }

                          updateDB({
                            websiteSettings: {
                              ...db.websiteSettings,
                              currencyCode: val,
                              currencySymbol: symbol,
                              currencyPosition: pos
                            }
                          });
                        }}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none focus:border-brand rounded-none cursor-pointer"
                      >
                        <option value="INR">₹ Indian Rupee (INR)</option>
                        <option value="USD">$ US Dollar (USD)</option>
                        <option value="EUR">€ Euro (EUR)</option>
                        <option value="GBP">£ British Pound (GBP)</option>
                        <option value="AED">د.إ UAE Dirham (AED)</option>
                        <option value="CAD">$ Canadian Dollar (CAD)</option>
                        <option value="AUD">$ Australian Dollar (AUD)</option>
                      </select>
                    </div>

                    {/* Currency Symbol Override */}
                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-widest font-bold block">Currency Symbol</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹, $, Rs."
                        value={db.websiteSettings.currencySymbol}
                        onChange={(e) => updateDB({ websiteSettings: { ...db.websiteSettings, currencySymbol: e.target.value } })}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none focus:border-brand rounded-none"
                      />
                    </div>

                    {/* Symbol Position */}
                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-widest font-bold block">Symbol Position</label>
                      <select
                        value={db.websiteSettings.currencyPosition || 'before'}
                        onChange={(e) => updateDB({ websiteSettings: { ...db.websiteSettings, currencyPosition: e.target.value as 'before' | 'after' } })}
                        className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none focus:border-brand rounded-none cursor-pointer"
                      >
                        <option value="before">Before Price (e.g. {db.websiteSettings.currencySymbol}350)</option>
                        <option value="after">After Price (e.g. 350{db.websiteSettings.currencySymbol})</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-gray-500 text-[10px]">
                    Updating these configurations will instantly format all price elements across the public menus, chef specials, and headers.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Save Currency Formats
                  </button>
                </form>

                {/* 2. Bulk Price Adjustments Multiplier */}
                <div className="bg-neutral-950 p-8 border border-white/10 space-y-4">
                  <h3 className="text-white text-sm font-black uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-1.5 text-brand">
                    <Sparkles size={16} />
                    <span>Bulk Price Adjustment & Multipliers</span>
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Instantly multiply or adjust all dish prices in the menu database by a custom scale factor. Useful for currency conversions (e.g., converting USD dishes to INR) or flat rate adjustments.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-2">
                    <div className="space-y-1.5">
                      <label className="text-gray-400 uppercase tracking-widest font-bold block">Multiplier Scale Factor</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.0001"
                          min="0.0001"
                          value={bulkMultiplier}
                          onChange={(e) => setBulkMultiplier(e.target.value)}
                          className="flex-1 bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-brand rounded-none text-sm font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`This will multiply all existing menu item prices by ${bulkMultiplier} and round to the nearest whole integer. Are you sure?`)) {
                              handleBulkPriceMultiplier(Number(bulkMultiplier), true);
                            }
                          }}
                          className="px-4 py-2 bg-brand text-white uppercase font-black tracking-widest text-[10px] hover:bg-white hover:text-black cursor-pointer"
                        >
                          Scale & Round (Integer)
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`This will multiply all existing menu item prices by ${bulkMultiplier} and keep two decimal places. Are you sure?`)) {
                            handleBulkPriceMultiplier(Number(bulkMultiplier), false);
                          }
                        }}
                        className="w-full py-2.5 bg-neutral-900 border border-white/10 text-white uppercase font-black tracking-widest text-[10px] hover:bg-brand cursor-pointer"
                      >
                        Scale with Decimals
                      </button>
                    </div>
                  </div>

                  <div className="bg-neutral-900/50 p-3 border border-white/5 space-y-1 text-gray-500 text-[10px]">
                    <span className="font-bold text-gray-400 block uppercase">Quick Shortcuts:</span>
                    <div>• Enter <span className="text-brand font-bold font-mono">1.10</span> to apply a 10% inflation price hike.</div>
                    <div>• Enter <span className="text-brand font-bold font-mono">0.90</span> to apply a 10% flat menu discount.</div>
                    <div>• Enter <span className="text-brand font-bold font-mono">83.00</span> to upscale dollar-based prices to Rupee equivalents.</div>
                  </div>
                </div>

                {/* 3. Direct Menu Items Price Quick-Edit Table */}
                <form onSubmit={handleSaveQuickPrices} className="bg-neutral-950 p-8 border border-white/10 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h3 className="text-white text-sm font-black uppercase tracking-wider">
                      Quick Manual Price Sheet
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">Total: {db.menuItems.length} Dishes</span>
                  </div>
                  
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Directly update prices of any or all menu items instantly in this manual spreadsheet. Click "Save Pricing Sheet Changes" below when finished.
                  </p>

                  <div className="max-h-96 overflow-y-auto border border-white/10 bg-black divide-y divide-white/5">
                    {db.menuItems.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-white/5 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-white font-bold block">{item.name}</span>
                          <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs font-mono">{db.websiteSettings.currencySymbol}</span>
                          <input
                            type="number"
                            required
                            min="0"
                            step="1"
                            value={quickPrices[item.id] !== undefined ? quickPrices[item.id] : item.price}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setQuickPrices({
                                ...quickPrices,
                                [item.id]: val
                              });
                            }}
                            className="w-24 bg-neutral-900 border border-white/10 text-white px-2 py-1.5 text-right font-mono focus:outline-none focus:border-brand"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    Save Pricing Sheet Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            MODULE: CONTACT MANAGEMENT (INTEGRATED)
            ========================================== */}
        {activeModule === 'contact' && (
          <div className="space-y-6" id="admin-module-contact">
            {/* Sub Tab Navigation */}
            <div className="flex flex-wrap border border-white/10 bg-neutral-950 p-1 mb-6 rounded-none">
              <button
                type="button"
                onClick={() => setContactSubTab('settings')}
                className={`flex-grow sm:flex-1 min-w-[120px] py-3 text-[11px] uppercase font-bold tracking-wider text-center transition-all cursor-pointer ${
                  contactSubTab === 'settings'
                    ? 'bg-brand text-white font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Lounge Contacts Settings
              </button>
              <button
                type="button"
                onClick={() => { setContactSubTab('inquiries'); setSearchQuery(''); }}
                className={`flex-grow sm:flex-1 min-w-[120px] py-3 text-[11px] uppercase font-bold tracking-wider text-center transition-all cursor-pointer ${
                  contactSubTab === 'inquiries'
                    ? 'bg-brand text-white font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Inquiries Messages ({(db.inquiries || []).length})
              </button>
              <button
                type="button"
                onClick={() => { setContactSubTab('subscribers'); setSearchQuery(''); }}
                className={`flex-grow sm:flex-1 min-w-[120px] py-3 text-[11px] uppercase font-bold tracking-wider text-center transition-all cursor-pointer ${
                  contactSubTab === 'subscribers'
                    ? 'bg-brand text-white font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Spotlight Club Subscribers ({(db.subscribers || []).length})
              </button>
            </div>

            {/* SUB-TAB 1: LOUNGE CONTACTS FORM */}
            {contactSubTab === 'settings' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Contact information committed!');
                }}
                className="bg-black p-8 border border-white/10 space-y-6 text-xs max-w-2xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={db.contactSettings.phone}
                      onChange={(e) => updateDB({ contactSettings: { ...db.contactSettings, phone: e.target.value } })}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Mobile Desk</label>
                    <input
                      type="text"
                      required
                      value={db.contactSettings.mobile}
                      onChange={(e) => updateDB({ contactSettings: { ...db.contactSettings, mobile: e.target.value } })}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">WhatsApp Direct Link Handler</label>
                    <input
                      type="text"
                      required
                      value={db.contactSettings.whatsapp}
                      onChange={(e) => updateDB({ contactSettings: { ...db.contactSettings, whatsapp: e.target.value } })}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-widest font-bold">Email ID</label>
                    <input
                      type="email"
                      required
                      value={db.contactSettings.email}
                      onChange={(e) => updateDB({ contactSettings: { ...db.contactSettings, email: e.target.value } })}
                      className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold">Lounge Address</label>
                  <input
                    type="text"
                    required
                    value={db.contactSettings.address}
                    onChange={(e) => updateDB({ contactSettings: { ...db.contactSettings, address: e.target.value } })}
                    className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold">Working Hours details</label>
                  <input
                    type="text"
                    required
                    value={db.contactSettings.workingHours}
                    onChange={(e) => updateDB({ contactSettings: { ...db.contactSettings, workingHours: e.target.value } })}
                    className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  Commit Contact Details
                </button>
              </form>
            )}

            {/* SUB-TAB 2: CONTACT INQUIRIES */}
            {contactSubTab === 'inquiries' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search inquiries name, subject, message..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-white pl-9 pr-3 py-2.5 text-xs rounded-none focus:outline-none focus:border-brand"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const headers = ["ID", "Name", "Email", "Mobile", "Subject", "Message", "Date"];
                      const rows = (db.inquiries || []).map(inq => [
                        inq.id,
                        `"${inq.name.replace(/"/g, '""')}"`,
                        inq.email,
                        inq.mobileNumber,
                        `"${inq.subject.replace(/"/g, '""')}"`,
                        `"${inq.message.replace(/"/g, '""')}"`,
                        inq.createdAt
                      ]);
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "contact_inquiries_report.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 border border-white/10 hover:border-brand hover:text-brand text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer rounded-none"
                  >
                    <Download size={14} />
                    <span>Export CSV Report</span>
                  </button>
                </div>

                {/* Inquiries table list */}
                <div className="border border-white/10 bg-black overflow-x-auto rounded-none text-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-950 border-b border-white/10 text-gray-400 font-extrabold uppercase tracking-wider">
                        <th className="p-4 text-[10px]">Status</th>
                        <th className="p-4 text-[10px]">Guest / Contact</th>
                        <th className="p-4 text-[10px]">Inquiry particulars</th>
                        <th className="p-4 text-[10px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(db.inquiries || [])
                        .filter(inq => {
                          if (!searchQuery) return true;
                          const q = searchQuery.toLowerCase();
                          return (
                            inq.name.toLowerCase().includes(q) ||
                            inq.email.toLowerCase().includes(q) ||
                            inq.subject.toLowerCase().includes(q) ||
                            inq.message.toLowerCase().includes(q)
                          );
                        })
                        .map((inq) => (
                          <tr key={inq.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-4">
                              <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                inq.isUnread ? 'bg-red-950 text-red-400 border border-red-500/20' : 'bg-neutral-900 text-gray-500 border border-white/10'
                              }`}>
                                {inq.isUnread ? 'Unread' : 'Replied'}
                              </span>
                            </td>
                            <td className="p-4 space-y-1.5">
                              <div className="text-white font-bold">{inq.name}</div>
                              <div className="text-gray-400 font-mono text-[10px]">{inq.email}</div>
                              <div className="text-gray-500 font-mono text-[10px]">{inq.mobileNumber}</div>
                            </td>
                            <td className="p-4 space-y-2 max-w-md">
                              <div className="text-brand font-bold uppercase text-[10px] tracking-wide">{inq.subject}</div>
                              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed italic">"{inq.message}"</p>
                              <div className="text-gray-500 font-mono text-[9px]">Received: {new Date(inq.createdAt).toLocaleString()}</div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (db.inquiries || []).map(item => 
                                      item.id === inq.id ? { ...item, isUnread: !item.isUnread } : item
                                    );
                                    updateDB({ inquiries: updated });
                                  }}
                                  title={inq.isUnread ? 'Mark as Read/Replied' : 'Mark as Unread'}
                                  className="p-1.5 bg-neutral-900 border border-white/10 hover:border-brand hover:text-brand text-gray-400 transition-all cursor-pointer"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to permanently delete this contact inquiry?")) {
                                      const updated = (db.inquiries || []).filter(item => item.id !== inq.id);
                                      updateDB({ inquiries: updated });
                                    }
                                  }}
                                  title="Delete Inquiry"
                                  className="p-1.5 bg-neutral-900 border border-white/10 hover:border-red-500 hover:text-red-500 text-gray-400 transition-all cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {(db.inquiries || []).length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-12 text-center text-gray-500 uppercase tracking-widest font-mono">
                            No form inquiries registered.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: NEWSLETTER SUBSCRIBERS */}
            {contactSubTab === 'subscribers' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search subscriber email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 text-white pl-9 pr-3 py-2.5 text-xs rounded-none focus:outline-none focus:border-brand"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const headers = ["ID", "Email Address", "Subscription Date"];
                      const rows = (db.subscribers || []).map(sub => [
                        sub.id,
                        sub.email,
                        sub.createdAt
                      ]);
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "newsletter_subscribers_list.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 border border-white/10 hover:border-brand hover:text-brand text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer rounded-none"
                  >
                    <Download size={14} />
                    <span>Export CSV List</span>
                  </button>
                </div>

                {/* Subscribers table list */}
                <div className="border border-white/10 bg-black overflow-x-auto rounded-none max-w-2xl text-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-950 border-b border-white/10 text-gray-400 font-extrabold uppercase tracking-wider">
                        <th className="p-4 text-[10px]">Email Address</th>
                        <th className="p-4 text-[10px]">Subscription Timestamp</th>
                        <th className="p-4 text-[10px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(db.subscribers || [])
                        .filter(sub => {
                          if (!searchQuery) return true;
                          return sub.email.toLowerCase().includes(searchQuery.toLowerCase());
                        })
                        .map((sub) => (
                          <tr key={sub.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-4 text-white font-mono font-bold">{sub.email}</td>
                            <td className="p-4 text-gray-400 font-mono text-[10px]">
                              {new Date(sub.createdAt).toLocaleString()}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm("Are you sure you want to permanently unsubscribe this user?")) {
                                    const updated = (db.subscribers || []).filter(item => item.id !== sub.id);
                                    updateDB({ subscribers: updated });
                                  }
                                }}
                                title="Unsubscribe"
                                className="p-1.5 bg-neutral-900 border border-white/10 hover:border-red-500 hover:text-red-500 text-gray-400 transition-all cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      {(db.subscribers || []).length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-12 text-center text-gray-500 uppercase tracking-widest font-mono">
                            No subscribers registered.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            MODULE: SEO CONFIGURATION
            ========================================== */}
        {activeModule === 'seo' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('SEO meta tags committed. Head metadata will inject sitemaps properly.');
            }}
            className="bg-black p-8 border border-white/10 space-y-6 text-xs max-w-2xl"
          >
            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase tracking-widest font-bold">Meta Title Tag</label>
              <input
                type="text"
                required
                value={db.seoSettings.metaTitle}
                onChange={(e) => updateDB({ seoSettings: { ...db.seoSettings, metaTitle: e.target.value } })}
                className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase tracking-widest font-bold">Meta Description</label>
              <textarea
                rows={3}
                required
                value={db.seoSettings.metaDescription}
                onChange={(e) => updateDB({ seoSettings: { ...db.seoSettings, metaDescription: e.target.value } })}
                className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase tracking-widest font-bold">Meta Keywords</label>
              <input
                type="text"
                required
                value={db.seoSettings.metaKeywords}
                onChange={(e) => updateDB({ seoSettings: { ...db.seoSettings, metaKeywords: e.target.value } })}
                className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 uppercase tracking-widest font-bold">Schema Markup JSON-LD</label>
              <textarea
                rows={5}
                required
                value={db.seoSettings.schemaMarkup}
                onChange={(e) => updateDB({ seoSettings: { ...db.seoSettings, schemaMarkup: e.target.value } })}
                className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none font-mono resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-widest font-bold">robots.txt config</label>
                <textarea
                  rows={4}
                  value={db.seoSettings.robotsTxt}
                  onChange={(e) => updateDB({ seoSettings: { ...db.seoSettings, robotsTxt: e.target.value } })}
                  className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none font-mono resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-widest font-bold">XML Sitemap Structure</label>
                <textarea
                  rows={4}
                  value={db.seoSettings.sitemap}
                  onChange={(e) => updateDB({ seoSettings: { ...db.seoSettings, sitemap: e.target.value } })}
                  className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none font-mono resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black"
            >
              Commit SEO configurations
            </button>
          </form>
        )}

        {/* ==========================================
            MODULE: SOCIAL MEDIA LINKS
            ========================================== */}
        {activeModule === 'social' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Social media anchors committed successfully!');
            }}
            className="bg-black p-8 border border-white/10 space-y-6 text-xs max-w-2xl"
          >
            {['facebook', 'instagram', 'youtube', 'twitter', 'whatsapp'].map((scKey) => {
              const k = scKey as keyof SocialMediaSettings;
              return (
                <div key={k} className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold capitalize">{k} Address URL</label>
                  <input
                    type="text"
                    value={db.socialMediaSettings[k] || ''}
                    onChange={(e) => updateDB({ socialMediaSettings: { ...db.socialMediaSettings, [k]: e.target.value } })}
                    className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2.5 focus:outline-none focus:border-brand rounded-none"
                    placeholder={`https://${k}.com/...`}
                  />
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full py-4 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black"
            >
              Commit Social Anchors
            </button>
          </form>
        )}

        {/* ==========================================
            MODULE: USER MANAGEMENT
            ========================================== */}
        {activeModule === 'users' && (
          <div className="space-y-10" id="admin-module-users">
            
            {/* Create new Admin form */}
            <form onSubmit={handleCreateAdminUser} className="bg-neutral-950 p-6 border border-white/10 text-xs space-y-4 max-w-xl">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider">Deploy New Administrator account</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter unique username"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-widest font-bold">Password</label>
                  <input
                    type="text"
                    required
                    placeholder="Secure password string"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase tracking-widest font-bold">Admin Role Type</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as AdminRole)}
                  className="w-full bg-neutral-900 border border-white/10 text-white px-3 py-2 focus:outline-none"
                >
                  <option value="Super Admin" className="bg-neutral-950">Super Admin (All permissions)</option>
                  <option value="Manager" className="bg-neutral-950">Manager (Menu, Reservation, Gallery permissions)</option>
                  <option value="Editor" className="bg-neutral-950">Editor (Menu & Gallery modification permissions)</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black"
              >
                Provision Account
              </button>
            </form>

            {/* List of active administrators */}
            <div className="bg-black p-6 border border-white/10 space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-white/5">
                Active System Administrators
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 uppercase tracking-widest font-black h-8">
                      <th className="pb-3">Username</th>
                      <th className="pb-3">Assigned Role</th>
                      <th className="pb-3">Access Token / Password</th>
                      <th className="pb-3">Permissions Scope</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {db.adminUsers.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 h-12">
                        <td className="font-bold text-white">{u.username}</td>
                        <td>
                          <span className="text-brand font-bold uppercase text-[10px] tracking-widest">{u.role}</span>
                        </td>
                        <td className="font-mono text-gray-400 select-all">{u.password}</td>
                        <td className="text-gray-500 font-mono text-[10px]">
                          {u.permissions.join(', ')}
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => handleDeleteAdminUser(u.id)}
                            className="p-1.5 hover:text-red-500"
                            title="De-provision account"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            MODULE: BACKUP & RESTORATION
            ========================================== */}
        {activeModule === 'backup' && (
          <div className="space-y-8 text-xs max-w-2xl" id="admin-module-backup">
            
            {/* Download backup */}
            <div className="bg-black p-6 border border-white/10 space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider">Export Database System</h3>
              <p className="text-gray-400 leading-relaxed">
                Save the complete system database state (menus, bookings, settings, directories) as a lightweight JSON file. You can download this file locally for safety, and restore it at any point.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="px-6 py-3.5 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black flex items-center space-x-2"
              >
                <Download size={14} />
                <span>Download Database Backup (.json)</span>
              </button>
            </div>

            {/* Upload/Restore backup */}
            <div className="bg-black p-6 border border-white/10 space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
                <AlertTriangle size={14} />
                <span>Restore Database Backup</span>
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Upload a previously saved Limelight Restaurant database JSON backup. <strong className="text-red-500 uppercase text-[10px] block mt-1">WARNING: This operation is destructive and completely replaces current reservation state, settings, reviews, and gallery structures!</strong>
              </p>
              <div className="flex items-center gap-4">
                <label className="px-6 py-3 bg-neutral-950 border border-white/15 hover:border-brand hover:text-brand text-white font-bold uppercase tracking-wider cursor-pointer">
                  <span>Choose Backup File (.json)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Wipe / Factory Reset Database */}
            <div className="bg-black/50 p-6 border border-red-500/20 space-y-4">
              <h3 className="text-red-500 font-bold text-xs uppercase tracking-wider">Emergency Factory Reset</h3>
              <p className="text-gray-400">
                Wipe all localized state and restore the system to default pre-seeded pristine database state. All custom folders, menu entries, and live bookings are deleted immediately.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to trigger a factory reset? This will wipe all bookings and customizations!')) {
                    onResetDB();
                    alert('System reset completed. Preseeded menu items reloaded.');
                    window.location.reload();
                  }
                }}
                className="px-6 py-3 bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20 uppercase font-bold tracking-wider"
              >
                Restore Factory Presets
              </button>
            </div>

          </div>
        )}

        {/* ==========================================
            MODULE: WEBSITE PAGES (activeModule === 'pages')
            ========================================== */}
        {activeModule === 'pages' && (
          <div className="space-y-6" id="admin-module-pages">
            {editingPage ? (
              <form onSubmit={handleSavePage} className="bg-black p-8 border border-white/10 space-y-6 max-w-4xl text-xs">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                    {editingPage.id ? 'Edit Custom Web Page' : 'Create Custom Web Page'}
                  </h3>
                  <p className="text-gray-400 mt-1">Design a brand new responsive page. Changes are visible in the front site navbar immediately.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Page Title</label>
                    <input
                      type="text"
                      required
                      value={editingPage.title || ''}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setEditingPage({ ...editingPage, title, slug });
                      }}
                      placeholder="e.g. Premium Catering"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Relative URL Slug</label>
                    <input
                      type="text"
                      required
                      value={editingPage.slug || ''}
                      onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                      placeholder="e.g. premium-catering"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Display Order (Navbar Weight)</label>
                    <input
                      type="number"
                      required
                      value={editingPage.displayOrder || 1}
                      onChange={(e) => setEditingPage({ ...editingPage, displayOrder: parseInt(e.target.value) || 1 })}
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Status Visibility</label>
                    <select
                      value={editingPage.isActive ? 'true' : 'false'}
                      onChange={(e) => setEditingPage({ ...editingPage, isActive: e.target.value === 'true' })}
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                    >
                      <option value="true">Active & Visible in Navbar</option>
                      <option value="false">Disabled / Hidden Draft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider block">Page Content (HTML Layout Supported)</label>
                  <p className="text-[10px] text-gray-500 mb-1">Construct grid panels or text blocks using premium Tailwind CSS class attributes (e.g., text-white, grid grid-cols-1, border border-white/10).</p>
                  <textarea
                    rows={12}
                    value={editingPage.content || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                    placeholder="<h2 class='text-white text-3xl font-black mb-4'>Catering Excellence</h2><p class='text-gray-300'>Details go here...</p>"
                    className="w-full bg-neutral-900 border border-white/10 p-4 text-white focus:border-brand outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Page Custom CSS Rules (Optional)</label>
                    <textarea
                      rows={4}
                      value={editingPage.customCss || ''}
                      onChange={(e) => setEditingPage({ ...editingPage, customCss: e.target.value })}
                      placeholder="/* Custom CSS */"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Page Custom JavaScript (Optional)</label>
                    <textarea
                      rows={4}
                      value={editingPage.customJs || ''}
                      onChange={(e) => setEditingPage({ ...editingPage, customJs: e.target.value })}
                      placeholder="console.log('Premium dynamic custom page initialised!');"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingPage(null)}
                    className="px-5 py-2.5 bg-neutral-900 border border-white/10 text-gray-400 hover:text-white uppercase font-bold tracking-widest transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Save Custom Page
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-black p-4 border border-white/10">
                  <div className="text-xs">
                    <h3 className="text-white font-bold uppercase tracking-wider">Dynamic Pages Builder</h3>
                    <p className="text-gray-500 mt-1">Complete layout control of customizable website sub-views.</p>
                  </div>
                  <button
                    onClick={() => setEditingPage({ title: '', slug: '', content: '', isActive: true, displayOrder: (db.customPages?.length || 0) + 1, customCss: '', customJs: '' })}
                    className="px-5 py-2.5 bg-brand text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center space-x-2"
                  >
                    <Plus size={14} />
                    <span>Create Custom Page</span>
                  </button>
                </div>

                <div className="bg-black border border-white/10 overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-500 uppercase tracking-widest font-black h-12 bg-neutral-950 px-6">
                        <th className="pl-6 py-3">Page Name</th>
                        <th className="py-3">URL Route Slug</th>
                        <th className="py-3">Navbar Weight</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right pr-6">Management Scope</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(db.customPages || []).map((page) => (
                        <tr key={page.id} className="border-b border-white/5 h-14 hover:bg-white/[0.01]">
                          <td className="pl-6 py-3 font-bold text-white flex items-center space-x-2">
                            <FileText size={14} className="text-brand-10" />
                            <span>{page.title}</span>
                          </td>
                          <td className="py-3 font-mono text-gray-400">/page/{page.slug}</td>
                          <td className="py-3">{page.displayOrder}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 uppercase text-[9px] font-black tracking-wider ${page.isActive ? 'bg-green-950 text-green-400 border border-green-500/10' : 'bg-red-950 text-red-400 border border-red-500/10'}`}>
                              {page.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-3 text-right pr-6 space-x-2">
                            <button
                              onClick={() => {
                                setCurrentPage(`page-${page.slug}`);
                                window.scrollTo(0, 0);
                              }}
                              className="p-1.5 hover:text-brand text-gray-400 transition-colors"
                              title="Live Front Preview"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleDuplicatePage(page)}
                              className="p-1.5 hover:text-white text-gray-400 transition-colors"
                              title="Duplicate Page"
                            >
                              <ImageIcon size={14} />
                            </button>
                            <button
                              onClick={() => setEditingPage(page)}
                              className="p-1.5 hover:text-green-400 text-gray-400 transition-colors"
                              title="Edit Content"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeletePage(page.id)}
                              className="p-1.5 hover:text-red-500 text-gray-400 transition-colors"
                              title="Delete Page"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(db.customPages || []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-500 uppercase tracking-widest font-black">
                            No custom pages built yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            MODULE: BLOG MANAGER (activeModule === 'blogs')
            ========================================== */}
        {activeModule === 'blogs' && (
          <div className="space-y-6" id="admin-module-blogs">
            {editingBlog ? (
              <form onSubmit={handleSaveBlog} className="bg-black p-8 border border-white/10 space-y-6 max-w-3xl text-xs">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                    {editingBlog.id ? 'Edit Blog Article' : 'Write New Gastronomy Article'}
                  </h3>
                  <p className="text-gray-400 mt-1">Publish news, chef masterclasses, and gourmet kitchen secrets to the frontend.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider block">Article Title</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.title || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    placeholder="e.g. Secret Mortar Spices: The Fine Royal Blend"
                    className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Gourmet Category</label>
                    <input
                      type="text"
                      required
                      value={editingBlog.category || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      placeholder="e.g. Culinary Art"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Publication State</label>
                    <select
                      value={editingBlog.isPublished ? 'true' : 'false'}
                      onChange={(e) => setEditingBlog({ ...editingBlog, isPublished: e.target.value === 'true' })}
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                    >
                      <option value="true">Published & Live</option>
                      <option value="false">Draft Mode (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider block">Header Banner Image URL</label>
                  <input
                    type="text"
                    required
                    value={editingBlog.imageUrl || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider block">Article Markdown / Text Content</label>
                  <textarea
                    rows={8}
                    required
                    value={editingBlog.content || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    placeholder="Start drafting the blog story details here..."
                    className="w-full bg-neutral-900 border border-white/10 p-4 text-white focus:border-brand outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingBlog(null)}
                    className="px-5 py-2.5 bg-neutral-900 border border-white/10 text-gray-400 hover:text-white uppercase font-bold tracking-widest transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Publish Article
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-black p-4 border border-white/10">
                  <div className="text-xs">
                    <h3 className="text-white font-bold uppercase tracking-wider">Limelight Blog Stories</h3>
                    <p className="text-gray-500 mt-1">Announcements, gourmet recipes, and news stories for the front visitors.</p>
                  </div>
                  <button
                    onClick={() => setEditingBlog({ title: '', category: 'Gastronomy', content: '', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', isPublished: true })}
                    className="px-5 py-2.5 bg-brand text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center space-x-2"
                  >
                    <Plus size={14} />
                    <span>Write Article</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(db.blogs || []).map((blog) => (
                    <div key={blog.id} className="bg-black border border-white/10 text-xs flex flex-col group relative">
                      <div className="aspect-video w-full overflow-hidden bg-neutral-900 relative">
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 border border-brand/20 text-brand text-[9px] uppercase font-bold tracking-widest">
                          {blog.category}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-gray-500 font-mono block">
                            {new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </span>
                          <h4 className="text-white font-bold text-sm tracking-wide leading-snug uppercase group-hover:text-brand transition-colors line-clamp-2">
                            {blog.title}
                          </h4>
                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                            {blog.content}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-auto">
                          <span className={`px-2 py-0.5 uppercase text-[8px] font-black tracking-wider ${blog.isPublished ? 'bg-green-950 text-green-400 border border-green-500/10' : 'bg-neutral-900 text-gray-500 border border-white/5'}`}>
                            {blog.isPublished ? 'Live' : 'Draft'}
                          </span>
                          <div className="flex space-x-1.5">
                            <button
                              onClick={() => setEditingBlog(blog)}
                              className="p-1.5 hover:text-brand text-gray-400 transition-colors"
                              title="Edit Story"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="p-1.5 hover:text-red-500 text-gray-400 transition-colors"
                              title="Delete Story"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(db.blogs || []).length === 0 && (
                    <div className="col-span-full bg-black border border-white/10 p-12 text-center text-gray-500 uppercase tracking-widest font-black">
                      No blogs created yet. Click Write Article to begin.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            MODULE: SPECIAL OFFERS (activeModule === 'offers')
            ========================================== */}
        {activeModule === 'offers' && (
          <div className="space-y-6" id="admin-module-offers">
            {editingOffer ? (
              <form onSubmit={handleSaveOffer} className="bg-black p-8 border border-white/10 space-y-6 max-w-2xl text-xs">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                    {editingOffer.id ? 'Edit Promotional Offer' : 'Launch New Campaign'}
                  </h3>
                  <p className="text-gray-400 mt-1">Publish coupon codes, seasonal discounts, and special offers with automatic expiration.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider block">Offer Title</label>
                  <input
                    type="text"
                    required
                    value={editingOffer.title || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                    placeholder="e.g. Exclusive Diwali Royal Platter Discount"
                    className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 font-bold uppercase tracking-wider block">Description</label>
                  <input
                    type="text"
                    required
                    value={editingOffer.description || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                    placeholder="e.g. Unlock 20% on reservations and gourmet platters."
                    className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Discount Percentage (%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={editingOffer.discountPercentage || 0}
                      onChange={(e) => setEditingOffer({ ...editingOffer, discountPercentage: parseInt(e.target.value) || 0 })}
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Coupon Promo Code</label>
                    <input
                      type="text"
                      required
                      value={editingOffer.promoCode || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, promoCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. FESTIVE20"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none font-mono tracking-widest uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Expiry Date</label>
                    <input
                      type="date"
                      required
                      value={editingOffer.expiryDate || ''}
                      onChange={(e) => setEditingOffer({ ...editingOffer, expiryDate: e.target.value })}
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase tracking-wider block">Campaign Status</label>
                    <select
                      value={editingOffer.isActive ? 'true' : 'false'}
                      onChange={(e) => setEditingOffer({ ...editingOffer, isActive: e.target.value === 'true' })}
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                    >
                      <option value="true">Active & Live</option>
                      <option value="false">Deactivated (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingOffer(null)}
                    className="px-5 py-2.5 bg-neutral-950 border border-white/10 text-gray-400 hover:text-white uppercase font-bold tracking-widest transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Save Campaign
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-black p-4 border border-white/10">
                  <div className="text-xs">
                    <h3 className="text-white font-bold uppercase tracking-wider">Discount Campaigns</h3>
                    <p className="text-gray-500 mt-1">Configure active promo codes and discounts to drive table reservations.</p>
                  </div>
                  <button
                    onClick={() => setEditingOffer({ title: '', description: '', discountPercentage: 10, promoCode: 'FESTIVE10', expiryDate: '2026-12-31', isActive: true })}
                    className="px-5 py-2.5 bg-brand text-white text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center space-x-2"
                  >
                    <Plus size={14} />
                    <span>New Campaign</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(db.offers || []).map((offer) => (
                    <div key={offer.id} className="bg-black border border-white/10 p-6 flex flex-col justify-between space-y-4 relative">
                      {/* Brand accents */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand" />

                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5">
                          <span className="text-brand font-mono font-black text-xs tracking-wider uppercase block">
                            Code: {offer.promoCode}
                          </span>
                          <h4 className="text-white font-bold text-sm uppercase tracking-wide">
                            {offer.title}
                          </h4>
                          <p className="text-gray-400 text-xs leading-relaxed">
                            {offer.description}
                          </p>
                        </div>
                        {offer.discountPercentage > 0 && (
                          <div className="px-3.5 py-2.5 bg-brand text-white font-black text-sm tracking-tighter shrink-0 border border-brand-10">
                            -{offer.discountPercentage}%
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-white/5 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-gray-500 block uppercase text-[8px] font-bold tracking-widest">Expires on</span>
                          <span className="text-gray-300 font-mono font-bold text-[10px]">{offer.expiryDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 uppercase text-[8px] font-black tracking-wider ${offer.isActive ? 'bg-green-950 text-green-400 border border-green-500/10' : 'bg-red-950 text-red-400 border border-red-500/10'}`}>
                            {offer.isActive ? 'Active' : 'Expired'}
                          </span>
                          <button
                            onClick={() => setEditingOffer(offer)}
                            className="p-1 hover:text-green-400 text-gray-400"
                            title="Edit Promotion"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="p-1 hover:text-red-500 text-gray-400"
                            title="Remove Promotion"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(db.offers || []).length === 0 && (
                    <div className="col-span-full bg-black border border-white/10 p-12 text-center text-gray-500 uppercase tracking-widest font-black">
                      No promotions created yet. Click New Campaign to begin.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            MODULE: NOTIFICATIONS (activeModule === 'notifications')
            ========================================== */}
        {activeModule === 'notifications' && (
          <form onSubmit={handleSaveNotifications} className="space-y-6 max-w-2xl" id="admin-module-notifications">
            <div className="bg-black p-6 border border-white/10 space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2">
                <Bell size={14} className="text-brand-10" />
                <span>Synchronized Gateways & Booking Notifications</span>
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Configure real-time hooks to alert managers and customers instantly when table reservations are submitted, modified, or canceled.
              </p>
            </div>

            <div className="bg-black p-6 border border-white/10 space-y-6 text-xs">
              
              {/* Email Gateway */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-white font-bold uppercase tracking-wider">Email Booking Notifications</h4>
                    <p className="text-gray-500 text-[10px]">Send structured booking breakdowns to management instantly.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifEmailEnabled(!notifEmailEnabled)}
                    className={`px-3 py-1 text-[9px] uppercase font-black tracking-widest border transition-all ${notifEmailEnabled ? 'bg-green-950 text-green-400 border-green-500/20' : 'bg-neutral-900 text-gray-500 border-white/5'}`}
                  >
                    {notifEmailEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {notifEmailEnabled && (
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase text-[10px]">Manager Notification Email Address</label>
                    <input
                      type="email"
                      required
                      value={notifEmailAddress}
                      onChange={(e) => setNotifEmailAddress(e.target.value)}
                      placeholder="manager@limelightrestaurant.com"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              {/* WhatsApp Gateway */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-white font-bold uppercase tracking-wider">WhatsApp Alert Service</h4>
                    <p className="text-gray-500 text-[10px]">Send WhatsApp text confirmations to customers with reservation tokens.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifWhatsappEnabled(!notifWhatsappEnabled)}
                    className={`px-3 py-1 text-[9px] uppercase font-black tracking-widest border transition-all ${notifWhatsappEnabled ? 'bg-green-950 text-green-400 border-green-500/20' : 'bg-neutral-900 text-gray-500 border-white/5'}`}
                  >
                    {notifWhatsappEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {notifWhatsappEnabled && (
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase text-[10px]">Admin Emergency WhatsApp Contact Phone Number</label>
                    <input
                      type="text"
                      required
                      value={notifWhatsappNumber}
                      onChange={(e) => setNotifWhatsappNumber(e.target.value)}
                      placeholder="+15559876543"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              {/* SMS Gateway */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-white font-bold uppercase tracking-wider">Traditional Carrier SMS Gateway (Optional)</h4>
                    <p className="text-gray-500 text-[10px]">Deliver text messages over cellular networks for offline confirmations.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifSmsEnabled(!notifSmsEnabled)}
                    className={`px-3 py-1 text-[9px] uppercase font-black tracking-widest border transition-all ${notifSmsEnabled ? 'bg-green-950 text-green-400 border-green-500/20' : 'bg-neutral-900 text-gray-500 border-white/5'}`}
                  >
                    {notifSmsEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {notifSmsEnabled && (
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase text-[10px]">SMS Gateway Provider Outbox Number</label>
                    <input
                      type="text"
                      required
                      value={notifSmsNumber}
                      onChange={(e) => setNotifSmsNumber(e.target.value)}
                      placeholder="+15551112222"
                      className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Browser Push alerts */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-white font-bold uppercase tracking-wider">Real-time Browser Push Notifications</h4>
                    <p className="text-gray-500 text-[10px]">Trigger instant push sound alerts on management dashboards when bookings land.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifPushEnabled(!notifPushEnabled)}
                    className={`px-3 py-1 text-[9px] uppercase font-black tracking-widest border transition-all ${notifPushEnabled ? 'bg-green-950 text-green-400 border-green-500/20' : 'bg-neutral-900 text-gray-500 border-white/5'}`}
                  >
                    {notifPushEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Save Gateway Rules
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ==========================================
            MODULE: SECURITY & ACTION LOGS (activeModule === 'security')
            ========================================== */}
        {activeModule === 'security' && (
          <div className="space-y-8 text-xs max-w-4xl" id="admin-module-security">
            
            {/* 2FA Access lock */}
            <form onSubmit={handleSaveSecurity} className="bg-black p-6 border border-white/10 space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2">
                <Lock size={14} className="text-brand-10" />
                <span>Multi-Factor Security Guard (MFA)</span>
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Enforce additional validation verification rules during administrator logins to guarantee session safety.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1.5">
                  <label className="text-gray-500 uppercase font-bold tracking-wider text-[10px] block">Two-Factor Auth Enforcement</label>
                  <select
                    value={security2FaEnabled ? 'true' : 'false'}
                    onChange={(e) => setSecurity2FaEnabled(e.target.value === 'true')}
                    className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none"
                  >
                    <option value="false">Standard Single Factor Authentication</option>
                    <option value="true">Enforce Two-Factor Security Guard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 uppercase font-bold tracking-wider text-[10px] block">Global MFA Backup Recovery Secret Token</label>
                  <input
                    type="text"
                    required
                    value={securitySecretCode}
                    onChange={(e) => setSecuritySecretCode(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 p-3 text-white focus:border-brand outline-none font-mono tracking-widest"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand text-white uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Save Security Policy
                </button>
              </div>
            </form>

            {/* Audit Logs */}
            <div className="bg-black p-6 border border-white/10 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2">
                  <Activity size={14} className="text-brand-10" />
                  <span>Audited System Activity Log History</span>
                </h3>
                <button
                  onClick={handleClearActivityLogs}
                  className="text-[10px] uppercase font-black text-red-500 hover:text-red-400 tracking-wider cursor-pointer"
                >
                  Wipe Audit Trail
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-500 uppercase tracking-widest font-black h-10 bg-neutral-950 px-4">
                      <th className="pl-4 py-2">Timestamp (UTC)</th>
                      <th className="py-2">System Security Event Description</th>
                      <th className="py-2">Authorized ID</th>
                      <th className="py-2 pr-4 text-right">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(db.activityLogs || []).map((log) => (
                      <tr key={log.id} className="border-b border-white/5 h-12 hover:bg-white/[0.01]">
                        <td className="pl-4 py-2 font-mono text-gray-400">
                          {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                        </td>
                        <td className="py-2 font-bold text-white">{log.action}</td>
                        <td className="py-2 font-mono text-brand font-bold text-[10px] uppercase">
                          {log.username}
                        </td>
                        <td className="py-2 pr-4 text-right font-mono text-gray-500">
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))}
                    {(db.activityLogs || []).length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500 uppercase tracking-widest font-black">
                          No audited security events reported.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
