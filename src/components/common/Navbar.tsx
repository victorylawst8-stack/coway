import React, { useState, useRef } from 'react';
import { useStore } from '../../lib/store';
import { formatLineUrl } from '../../lib/lineHelper';
import {
  Phone,
  MessageCircle,
  Search,
  ShieldCheck,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Briefcase,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { settings, categories, searchQuery, setSearchQuery, setActiveCategorySlug, isAdminLoggedIn, logoutAdmin } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Touch timer for hidden admin access on mobile/tablets
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const customerLineUrl = formatLineUrl(settings.line_url || settings.line_id, 'https://line.me/ti/p/~cowaypartner');
  const agentLineUrl = formatLineUrl(settings.agent_line_url || settings.agent_line_id || settings.line_id, customerLineUrl);
  const agentLineId = settings.agent_line_id || settings.line_id || '@cowayagent.th';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'catalog') {
      onNavigate('catalog');
    }
  };

  const selectCategory = (slug: string) => {
    setActiveCategorySlug(slug);
    setIsCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    onNavigate('catalog');
  };

  // Secret admin trigger: 5 rapid clicks on logo
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    if (newCount >= 5) {
      setLogoClickCount(0);
      onNavigate('admin');
    } else {
      setLogoClickCount(newCount);
      setTimeout(() => setLogoClickCount(0), 3000);
    }
  };

  // Secret admin trigger for mobile: long press for 1.2s on logo
  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      onNavigate('admin');
    }, 1200);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* 1. Top Announcement Bar - Highlights Coway Agent Recruitment & Hotline */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 text-white text-xs py-2 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate flex-1 min-w-0">
            <span className="bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold border border-sky-400/30 shrink-0">
              COWAY PARTNER
            </span>
            <span className="truncate text-slate-300 hidden md:inline text-xs">
              {settings.announcement || 'ติดตั้งฟรีทั่วไทย และดูแลด้วย Cody Heart Service ฟรีตลอดสัญญา'}
            </span>

            {/* Prominent Recruitment Highlight Link in Top Bar */}
            <a
              href={agentLineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-black shadow-md shadow-amber-500/30 transition-all shrink-0 hover:scale-105 active:scale-95 border border-amber-200"
              title={`สมัครตัวแทน COWAY ผ่าน LINE: ${agentLineId}`}
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-950" />
              <span>เปิดรับตัวแทนจำหน่ายทั่วประเทศ</span>
              <span className="bg-black/20 text-slate-950 text-[10px] px-1.5 rounded-full font-extrabold hidden sm:inline">
                คลิก
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-5 shrink-0 text-slate-300 text-xs">
            <a
              href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-sky-300" />
              <span>สายด่วน: {settings.phone}</span>
            </a>
            <a
              href={customerLineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>LINE: {settings.line_id}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          {/* Brand Logo (with secret hidden admin trigger: 5 rapid clicks or 1.2s long press) */}
          <div
            onClick={() => {
              if (currentView !== 'home') onNavigate('home');
              handleLogoClick();
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex items-center gap-2.5 sm:gap-3 text-left group select-none cursor-pointer"
            title="COWAY Partner Thailand"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-600/25 group-hover:scale-105 transition-transform shrink-0">
              <span className="text-xl font-black tracking-tighter">C</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-wider text-slate-900 group-hover:text-sky-700 transition-colors font-['Plus_Jakarta_Sans',sans-serif]">
                  COWAY
                </span>
                <span className="text-[11px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded border border-sky-200">
                  PARTNER
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                ร้านค้าตัวแทนจำหน่าย & Cody Care
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-sky-600 transition-colors py-2 ${
                currentView === 'home' ? 'text-sky-600 font-bold border-b-2 border-sky-600' : ''
              }`}
            >
              หน้าแรก
            </button>

            <button
              onClick={() => {
                setActiveCategorySlug('all');
                onNavigate('catalog');
              }}
              className={`hover:text-sky-600 transition-colors py-2 ${
                currentView === 'catalog' ? 'text-sky-600 font-bold border-b-2 border-sky-600' : ''
              }`}
            >
              สินค้าทั้งหมด
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                className="flex items-center gap-1 hover:text-sky-600 transition-colors py-2"
              >
                <span>หมวดหมู่สินค้า</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => selectCategory('all')}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center justify-between"
                  >
                    <span>ดูทุกหมวดหมู่</span>
                    <span className="text-slate-400">→</span>
                  </button>
                  <div className="h-px bg-slate-100 my-1" />
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.slug)}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-colors flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('cody-service')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-sky-600 transition-colors py-2 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>บริการ Cody Care</span>
            </button>

            <button
              onClick={() => {
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-sky-600 transition-colors py-2"
            >
              ติดต่อเรา
            </button>
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-xs"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหา เช่น Villaem, Storm, น้ำแข็ง..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-slate-400"
            />
          </form>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* PROMINENT "สมัครตัวแทน COWAY" BUTTON IN TOP HEADER (Requirement #4) */}
            <a
              href={agentLineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-extrabold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-300/40 shrink-0"
              title={`สมัครตัวแทน COWAY ผ่าน LINE: ${agentLineId}`}
            >
              <span className="p-1 rounded-full bg-white/20">
                <Briefcase className="w-3.5 h-3.5 text-white" />
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-extrabold tracking-wide">สมัครตัวแทน COWAY</span>
                <span className="hidden sm:inline text-[9px] text-amber-100 font-medium">
                  LINE: {agentLineId}
                </span>
              </div>
              <span className="hidden md:inline-flex bg-white/25 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                เปิดรับ
              </span>
            </a>

            {/* Quick Customer Line Button */}
            <a
              href={customerLineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold px-3.5 sm:px-4 py-2.5 rounded-full shadow-sm shadow-[#06C755]/20 transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>แอด LINE รับโปร</span>
            </a>

            {/* Discreet Admin Session Badge ONLY if authenticated */}
            {isAdminLoggedIn && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-full border bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100 transition-all shadow-sm"
                  title="ระบบหลังบ้าน (เข้าสู่ระบบแล้ว)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span className="hidden sm:inline">แดชบอร์ด</span>
                </button>
                <button
                  onClick={() => logoutAdmin()}
                  className="text-[11px] text-slate-500 hover:text-rose-600 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
                  title="ออกจากระบบ Admin"
                >
                  ออก
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          {/* Highlighted Agent Recruitment Card in Mobile Drawer */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-white" />
                <span className="font-extrabold text-xs tracking-wide">ร่วมงานกับเรา (สมัครตัวแทน COWAY)</span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">รับทั่วไทย</span>
            </div>
            <p className="text-[11px] text-amber-100 mb-2.5">
              ไม่ต้องสต็อกสินค้า คอมมิชชั่นสูง มีระบบเทรนนิ่งฟรีตลอดการทำงาน
            </p>
            <a
              href={agentLineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-white text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#06C755]" />
              <span>แอด LINE สมัครตัวแทน: {agentLineId}</span>
            </a>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาชื่อรุ่นหรือฟังก์ชัน..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-sky-500"
            />
          </form>

          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-1.5 pt-1">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg"
            >
              หน้าแรก
            </button>
            <button
              onClick={() => {
                setActiveCategorySlug('all');
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg"
            >
              สินค้าทั้งหมด
            </button>

            {/* Categories in Mobile */}
            <div className="px-3 py-1">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider">หมวดหมู่สินค้า</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.slug)}
                    className="text-left p-2.5 bg-slate-50 hover:bg-sky-50 hover:text-sky-600 rounded-lg text-xs font-medium text-slate-700 transition-colors border border-slate-100"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('cody-service')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>บริการ Cody Heart Service</span>
            </button>

            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg"
            >
              ติดต่อเรา
            </button>

            {isAdminLoggedIn && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>เข้าสู่แดชบอร์ดหลังบ้าน (Admin)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
