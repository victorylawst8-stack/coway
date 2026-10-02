import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product, Category, Banner, SiteSettings, Inquiry } from '../types/database';
import {
  DEFAULT_PRODUCTS,
  DEFAULT_CATEGORIES,
  DEFAULT_BANNERS,
  DEFAULT_SITE_SETTINGS
} from './defaultData';
import { getSupabase, isSupabaseConfigured } from './supabase';

interface StoreContextType {
  // Data
  products: Product[];
  categories: Category[];
  banners: Banner[];
  settings: SiteSettings;
  inquiries: Inquiry[];
  loading: boolean;
  isSupabaseLive: boolean;

  // Product Operations
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleProductStatus: (id: string) => Promise<boolean>;

  // Category Operations
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;

  // Banner Operations
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<Banner>;
  updateBanner: (id: string, updates: Partial<Banner>) => Promise<Banner>;
  deleteBanner: (id: string) => Promise<boolean>;

  // Settings
  updateSettings: (updates: Partial<SiteSettings>) => Promise<SiteSettings>;

  // Inquiries
  createInquiry: (inquiry: Omit<Inquiry, 'id' | 'created_at' | 'status'>) => Promise<boolean>;
  updateInquiryStatus: (id: string, status: 'new' | 'contacted' | 'closed') => Promise<boolean>;
  deleteInquiry: (id: string) => Promise<boolean>;

  // Admin Auth
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  loginAdmin: (email?: string, password?: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;

  // Modal & Contact Helpers
  inquiryModalOpen: boolean;
  selectedProductForInquiry: Product | null;
  openInquiryModal: (product?: Product | null) => void;
  closeInquiryModal: () => void;

  // Search & Navigation
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategorySlug: string;
  setActiveCategorySlug: (slug: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Notifications
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'coway_store_products',
  CATEGORIES: 'coway_store_categories',
  BANNERS: 'coway_store_banners',
  SETTINGS: 'coway_store_settings',
  INQUIRIES: 'coway_store_inquiries',
  ADMIN_SESSION: 'coway_admin_session',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategorySlug, setActiveCategorySlug] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Inquiry modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedProductForInquiry, setSelectedProductForInquiry] = useState<Product | null>(null);

  // Admin Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Toast handler
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const event = new CustomEvent('coway_toast', { detail: { message, type } });
    window.dispatchEvent(event);
  }, []);

  // Initialize data from Supabase or LocalStorage/Defaults
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const sb = getSupabase();

      if (sb && isSupabaseConfigured) {
        try {
          // Fetch from Supabase
          const [prodRes, catRes, banRes, setRes, inqRes] = await Promise.all([
            sb.from('products').select('*').order('sort_order', { ascending: true }),
            sb.from('categories').select('*').order('sort_order', { ascending: true }),
            sb.from('banners').select('*').order('sort_order', { ascending: true }),
            sb.from('site_settings').select('*').single(),
            sb.from('inquiries').select('*').order('created_at', { ascending: false }),
          ]);

          let hasValidData = false;

          if (prodRes.data && prodRes.data.length > 0) {
            setProducts(prodRes.data as Product[]);
            hasValidData = true;
          }
          if (catRes.data && catRes.data.length > 0) {
            setCategories(catRes.data as Category[]);
            hasValidData = true;
          }
          if (banRes.data && banRes.data.length > 0) {
            setBanners(banRes.data as Banner[]);
            hasValidData = true;
          }
          if (setRes.data) {
            setSettings(setRes.data as SiteSettings);
            hasValidData = true;
          }
          if (inqRes.data) {
            setInquiries(inqRes.data as Inquiry[]);
          }

          if (hasValidData) {
            setIsSupabaseLive(true);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Could not query Supabase tables, falling back to local store:', err);
        }
      }

      // Fallback: Read from LocalStorage or Default Mock
      const storedProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      const storedCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      const storedBans = localStorage.getItem(STORAGE_KEYS.BANNERS);
      const storedSets = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const storedInqs = localStorage.getItem(STORAGE_KEYS.INQUIRIES);

      setProducts(storedProds ? JSON.parse(storedProds) : DEFAULT_PRODUCTS);
      setCategories(storedCats ? JSON.parse(storedCats) : DEFAULT_CATEGORIES);
      setBanners(storedBans ? JSON.parse(storedBans) : DEFAULT_BANNERS);
      setSettings(storedSets ? JSON.parse(storedSets) : DEFAULT_SITE_SETTINGS);
      setInquiries(storedInqs ? JSON.parse(storedInqs) : []);

      // For security, remove any previously stored admin credentials
      try {
        localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      } catch (e) {}

      setLoading(false);
    }

    loadData();
  }, []);

  // Save to LocalStorage whenever state changes for resilience
  useEffect(() => {
    if (!loading && products.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }, [products, loading]);

  useEffect(() => {
    if (!loading && categories.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
  }, [categories, loading]);

  useEffect(() => {
    if (!loading && banners.length > 0) {
      localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
    }
  }, [banners, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  }, [settings, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    }
  }, [inquiries, loading]);

  // Product Actions
  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const sb = getSupabase();
    if (sb && isSupabaseLive) {
      try {
        const { error } = await sb.from('products').insert([newProduct]);
        if (error) console.error('Supabase addProduct error:', error);
      } catch (e) {
        console.error('Supabase addProduct exception:', e);
      }
    }

    setProducts(prev => [newProduct, ...prev]);
    showToast(`เพิ่มสินค้า "${newProduct.name}" เรียบร้อยแล้ว`, 'success');
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    const updatedDate = new Date().toISOString();
    const sb = getSupabase();

    if (sb && isSupabaseLive) {
      try {
        const { error } = await sb.from('products').update({ ...updates, updated_at: updatedDate }).eq('id', id);
        if (error) console.error('Supabase updateProduct error:', error);
      } catch (e) {
        console.error('Supabase updateProduct exception:', e);
      }
    }

    let updatedProd: Product | null = null;
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          updatedProd = { ...p, ...updates, updated_at: updatedDate };
          return updatedProd;
        }
        return p;
      })
    );

    showToast('บันทึกการแก้ไขสินค้าสำเร็จ', 'success');
    return updatedProd!;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const sb = getSupabase();
    if (sb && isSupabaseLive) {
      try {
        await sb.from('products').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteProduct exception:', e);
      }
    }

    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('ลบสินค้าออกจากระบบเรียบร้อย', 'info');
    return true;
  };

  const toggleProductStatus = async (id: string): Promise<boolean> => {
    const target = products.find(p => p.id === id);
    if (!target) return false;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    await updateProduct(id, { status: newStatus });
    return true;
  };

  // Category Actions
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<Category> => {
    const newCategory: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };

    const sb = getSupabase();
    if (sb && isSupabaseLive) {
      try {
        await sb.from('categories').insert([newCategory]);
      } catch (e) {
        console.error('Supabase addCategory exception:', e);
      }
    }

    setCategories(prev => [...prev, newCategory]);
    showToast(`เพิ่มหมวดหมู่ "${newCategory.name}" สำเร็จ`, 'success');
    return newCategory;
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
    const sb = getSupabase();
    if (sb && isSupabaseLive) {
      try {
        await sb.from('categories').update(updates).eq('id', id);
      } catch (e) {
        console.error('Supabase updateCategory exception:', e);
      }
    }

    let updatedCat: Category | null = null;
    setCategories(prev =>
      prev.map(c => {
        if (c.id === id) {
          updatedCat = { ...c, ...updates };
          return updatedCat;
        }
        return c;
      })
    );

    showToast('บันทึกหมวดหมู่เรียบร้อย', 'success');
    return updatedCat!;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    const sb = getSupabase();
    if (sb && isSupabaseLive) {
      try {
        await sb.from('categories').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteCategory exception:', e);
      }
    }

    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('ลบหมวดหมู่เรียบร้อย', 'info');
    return true;
  };

  // Banner Actions
  const addBanner = async (bannerData: Omit<Banner, 'id'>): Promise<Banner> => {
    const newBanner: Banner = {
      ...bannerData,
      id: `ban-${Date.now()}`,
    };

    const sb = getSupabase();
    if (sb && isSupabaseLive) {
      try {
        await sb.from('banners').insert([newBanner]);
      } catch (e) {
        console.error('Supabase addBanner exception:', e);
      }
    }

    setBanners(prev => [...prev, newBanner]);
    showToast('เพิ่มแบนเนอร์สำเร็จ', 'success');
    return newBanner;
  };

  const updateBanner = async (id: string, updates: Partial<Banner>): Promise<Banner> => {
    const sb = getSupabase();
    if (sb && isSupabaseLive) {
      try {
        await sb.from('banners').update(updates).eq('id', id);
      } catch (e) {
        console.error('Supabase updateBanner exception:', e);
      }
    }

    let updatedBanner: Banner | null = null;
    setBanners(prev =>
      prev.map(b => {
        if (b.id === id) {
          updatedBanner = { ...b, ...updates };
          return updatedBanner;
        }
        return b;
      })
    );

    showToast('บันทึกแบนเนอร์เรียบร้อย', 'success');
    return updatedBanner!;
  };

  const deleteBanner = async (id: string): Promise<boolean> => {
    const sb = getSupabase();
    if (sb && isSupabaseLive) {
      try {
        await sb.from('banners').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteBanner exception:', e);
      }
    }

    setBanners(prev => prev.filter(b => b.id !== id));
    showToast('ลบแบนเนอร์เรียบร้อย', 'info');
    return true;
  };

  // Site Settings
  const updateSettings = async (updates: Partial<SiteSettings>): Promise<SiteSettings> => {
    const updated = { ...settings, ...updates };
    const sb = getSupabase();
    if (sb && isSupabaseLive) {
      try {
        await sb.from('site_settings').upsert([updated]);
      } catch (e) {
        console.error('Supabase updateSettings exception:', e);
      }
    }

    setSettings(updated);
    showToast('บันทึกการตั้งค่าเว็บไซต์เรียบร้อย', 'success');
    return updated;
  };

  // Inquiries / Leads
  const createInquiry = async (inquiryData: Omit<Inquiry, 'id' | 'created_at' | 'status'>): Promise<boolean> => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from('inquiries').insert([newInquiry]);
      } catch (e) {
        console.error('Supabase createInquiry exception:', e);
      }
    }

    setInquiries(prev => [newInquiry, ...prev]);
    showToast('ส่งข้อมูลติดต่อเรียบร้อยแล้ว ทีมงานจะติดต่อกลับอย่างเร็วที่สุดครับ', 'success');
    return true;
  };

  const updateInquiryStatus = async (id: string, status: 'new' | 'contacted' | 'closed'): Promise<boolean> => {
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from('inquiries').update({ status }).eq('id', id);
      } catch (e) {
        console.error('Supabase updateInquiry exception:', e);
      }
    }

    setInquiries(prev => prev.map(inq => (inq.id === id ? { ...inq, status } : inq)));
    showToast('อัปเดตสถานะการติดต่อแล้ว', 'success');
    return true;
  };

  const deleteInquiry = async (id: string): Promise<boolean> => {
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.from('inquiries').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteInquiry exception:', e);
      }
    }

    setInquiries(prev => prev.filter(inq => inq.id !== id));
    showToast('ลบรายการติดต่อแล้ว', 'info');
    return true;
  };

  // Admin Auth - Strict credentials topsalecoway1919 / Alishalalita19 with no persistent storage
  const loginAdmin = async (username?: string, password?: string): Promise<boolean> => {
    const validUsername = 'topsalecoway1919';
    const validPassword = 'Alishalalita19';

    const cleanUser = (username || '').trim();
    const cleanPass = password || '';

    // Check direct required credentials
    if (
      (cleanUser === validUsername || cleanUser.toLowerCase() === validUsername.toLowerCase() || cleanUser.toLowerCase() === `${validUsername}@coway.local`) &&
      cleanPass === validPassword
    ) {
      setIsAdminLoggedIn(true);
      setAdminEmail(validUsername);
      showToast('เข้าสู่ระบบผู้ดูแลระบบ (Admin) สำเร็จ', 'success');
      return true;
    }

    // Try Supabase Auth if credentials match
    const sb = getSupabase();
    if (sb && cleanUser && cleanPass) {
      try {
        const { data, error } = await sb.auth.signInWithPassword({ email: cleanUser, password: cleanPass });
        if (!error && data?.user) {
          setIsAdminLoggedIn(true);
          setAdminEmail(data.user.email || cleanUser);
          showToast(`ยินดีต้อนรับ ผู้ดูแลระบบ (${data.user.email})`, 'success');
          return true;
        }
      } catch (err) {
        console.warn('Supabase auth attempt:', err);
      }
    }

    showToast('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'error');
    return false;
  };

  const logoutAdmin = async () => {
    const sb = getSupabase();
    if (sb) {
      try {
        await sb.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error:', e);
      }
    }

    setIsAdminLoggedIn(false);
    setAdminEmail(null);
    showToast('ออกจากระบบหลังบ้านเรียบร้อย', 'info');
  };

  // Inquiry Modal helpers
  const openInquiryModal = (product?: Product | null) => {
    setSelectedProductForInquiry(product || null);
    setInquiryModalOpen(true);
  };

  const closeInquiryModal = () => {
    setInquiryModalOpen(false);
    setSelectedProductForInquiry(null);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        banners,
        settings,
        inquiries,
        loading,
        isSupabaseLive,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        updateSettings,
        createInquiry,
        updateInquiryStatus,
        deleteInquiry,
        isAdminLoggedIn,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        inquiryModalOpen,
        selectedProductForInquiry,
        openInquiryModal,
        closeInquiryModal,
        searchQuery,
        setSearchQuery,
        activeCategorySlug,
        setActiveCategorySlug,
        sortBy,
        setSortBy,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
