import React from 'react';
import { useStore } from '../../lib/store';
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  Settings,
  MessageSquare,
  Database,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onViewStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onViewStore,
  children,
}) => {
  const { adminEmail, logoutAdmin, isSupabaseLive, inquiries } = useStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  const menuItems = [
    { id: 'dashboard', label: 'ภาพรวมระบบ (Overview)', icon: LayoutDashboard },
    { id: 'products', label: 'จัดการสินค้า (Products)', icon: Package },
    { id: 'categories', label: 'จัดการหมวดหมู่ (Categories)', icon: Layers },
    { id: 'banners', label: 'จัดการแบนเนอร์ (Banners)', icon: ImageIcon },
    {
      id: 'inquiries',
      label: 'รายการติดต่อลูกค้า (Leads)',
      icon: MessageSquare,
      badge: newInquiriesCount > 0 ? newInquiriesCount : undefined,
    },
    { id: 'settings', label: 'ข้อมูลร้าน & ช่องทางติดต่อ', icon: Settings },
    { id: 'supabase', label: 'Supabase & SQL Setup', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 font-bold text-sm">
          <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-xs font-black">
            C
          </div>
          <span>COWAY Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewStore}
            className="p-2 rounded-lg bg-white/10 text-xs font-semibold flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>หน้าร้าน</span>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between pt-2 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-lg">
                C
              </div>
              <div>
                <div className="font-black text-white text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  COWAY CARE
                </div>
                <div className="text-[10px] text-sky-400 font-semibold">ADMIN MANAGEMENT</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Live Status Indicator */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Database Engine:</span>
              <span
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSupabaseLive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSupabaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                {isSupabaseLive ? 'Supabase Live' : 'Active (Local Sync)'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              {isSupabaseLive
                ? 'เชื่อมต่อ Supabase Database & Storage สมบูรณ์'
                : 'ทำงานผ่าน Local Cache พร้อมส่งออก SQL'}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onViewStore}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>ดูหน้าเว็บไซต์ร้านค้า</span>
          </button>

          <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-400">
            <span className="truncate max-w-[140px]">{adminEmail || 'admin@cowaycare.th'}</span>
            <button
              onClick={logoutAdmin}
              className="text-rose-400 hover:text-rose-300 font-semibold transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออก</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Desktop Top Bar */}
        <div className="hidden md:flex bg-white px-8 py-4 border-b border-slate-200 justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {menuItems.find(m => m.id === currentTab)?.label || 'ระบบหลังบ้าน'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onViewStore}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ดูหน้าร้าน (Live Store)</span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
