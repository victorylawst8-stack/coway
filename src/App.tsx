import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './lib/store';
import { ToastContainer } from './components/common/ToastContainer';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingContactBar } from './components/common/FloatingContactBar';
import { FloatingLineButton } from './components/common/FloatingLineButton';
import { AiChatWidget } from './components/common/AiChatWidget';
import { InquiryModal } from './components/home/InquiryModal';

// Home Page Sections
import { HeroBanner } from './components/home/HeroBanner';
import { CategorySection } from './components/home/CategorySection';
import { FeaturedSection } from './components/home/FeaturedSection';
import { CodyServiceSection } from './components/home/CodyServiceSection';
import { AgentRecruitmentSection } from './components/home/AgentRecruitmentSection';
import { FaqSection } from './components/home/FaqSection';
import { ContactSection } from './components/home/ContactSection';

// Catalog & Detail
import { CatalogPage } from './components/catalog/CatalogPage';
import { ProductDetailPage } from './components/detail/ProductDetailPage';
import { Product } from './types/database';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminBanners } from './components/admin/AdminBanners';
import { AdminInquiries } from './components/admin/AdminInquiries';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminSupabaseSetup } from './components/admin/AdminSupabaseSetup';

function MainApp() {
  const {
    products,
    isAdminLoggedIn,
    openInquiryModal,
    loading
  } = useStore();

  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'detail' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiProductContext, setAiProductContext] = useState<Product | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Handle URL hash changes, browser history, and hidden admin keyboard shortcut
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product/')) {
        const slug = hash.replace('#product/', '');
        const p = products.find(item => item.slug === slug || item.id === slug);
        if (p) {
          setSelectedProduct(p);
          setCurrentView('detail');
        }
      } else if (hash === '#catalog') {
        setCurrentView('catalog');
      } else if (hash === '#admin') {
        setCurrentView('admin');
      } else if (!hash || hash === '#home') {
        setCurrentView('home');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hidden admin shortcut: Alt + A or Ctrl + Shift + A
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        navigateTo('admin');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [products]);

  const navigateTo = (view: string, payload?: any) => {
    if (view === 'detail' && payload) {
      setSelectedProduct(payload);
      setCurrentView('detail');
      window.location.hash = `#product/${payload.slug}`;
    } else if (view === 'catalog') {
      setCurrentView('catalog');
      window.location.hash = '#catalog';
    } else if (view === 'admin') {
      setCurrentView('admin');
      window.location.hash = '#admin';
    } else {
      setCurrentView('home');
      window.location.hash = '#home';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAiChatWithProduct = (product: Product) => {
    setAiProductContext(product);
    setIsAiChatOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-sky-600/30 animate-bounce">
          C
        </div>
        <p className="mt-4 text-xs font-bold text-slate-700 tracking-wider">กำลังโหลดข้อมูล COWAY Partner...</p>
      </div>
    );
  }

  // Admin View
  if (currentView === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onSuccess={() => setAdminTab('dashboard')}
          onBackToStore={() => navigateTo('home')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={tab => {
          setAdminTab(tab);
          setIsAddProductModalOpen(false);
        }}
        onViewStore={() => navigateTo('home')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={tab => setAdminTab(tab)}
            onOpenAddProduct={() => {
              setAdminTab('products');
              setIsAddProductModalOpen(true);
            }}
          />
        )}
        {adminTab === 'products' && (
          <AdminProducts isAddModalOpenInitially={isAddProductModalOpen} />
        )}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'banners' && <AdminBanners />}
        {adminTab === 'inquiries' && <AdminInquiries />}
        {adminTab === 'settings' && <AdminSettings />}
        {adminTab === 'supabase' && <AdminSupabaseSetup />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Inquiry Modal */}
      <InquiryModal />

      {/* Main Navbar */}
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroBanner onNavigate={navigateTo} />
            <CategorySection onNavigate={navigateTo} />
            <FeaturedSection
              onSelectProduct={p => navigateTo('detail', p)}
              onNavigate={navigateTo}
            />
            <CodyServiceSection />
            <AgentRecruitmentSection onOpenInquiry={() => openInquiryModal(null)} />
            <FaqSection />
            <ContactSection />
          </>
        )}

        {currentView === 'catalog' && (
          <CatalogPage
            onSelectProduct={p => navigateTo('detail', p)}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => navigateTo('catalog')}
            onSelectProduct={p => navigateTo('detail', p)}
            onOpenAiChatWithProduct={handleOpenAiChatWithProduct}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Dedicated Floating LINE Button */}
      <FloatingLineButton />

      {/* Floating Bottom Bar on Mobile */}
      <FloatingContactBar
        onOpenAiChat={() => setIsAiChatOpen(true)}
        onOpenInquiry={() => openInquiryModal()}
      />

      {/* Floating AI Chat Assistant */}
      <AiChatWidget
        isOpen={isAiChatOpen}
        onToggle={() => setIsAiChatOpen(!isAiChatOpen)}
        activeProductContext={aiProductContext}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
