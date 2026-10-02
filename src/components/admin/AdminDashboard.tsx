import React from 'react';
import { useStore } from '../../lib/store';
import {
  Package,
  Layers,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenAddProduct,
}) => {
  const { products, categories, inquiries, banners, settings } = useStore();

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const promoProducts = products.filter(p => p.is_promotion).length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Alert / Greeting */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>รหัสตัวแทน: {settings.dealer_code}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            ยินดีต้อนรับสู่ระบบจัดการร้านค้า COWAY
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
            จัดการแคตตาล็อกสินค้า โปรโมชั่น รายชื่อผู้สนใจสมัครสมาชิก และการตั้งค่าเว็บไซต์ได้แบบเรียลไทม์
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddProduct}
            className="px-5 py-3 rounded-2xl bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มสินค้าใหม่</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              สินค้าทั้งหมด
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalProducts}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{activeProducts} รายการ</span> เปิดขายอยู่
          </div>
        </div>

        {/* Card 2: Categories */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              หมวดหมู่สินค้า
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{categories.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            เครื่องกรองน้ำ, ฟอกอากาศ, ที่นอน ฯลฯ
          </div>
        </div>

        {/* Card 3: Promotions */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              สินค้าโปรโมชั่น
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{promoProducts}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            แคมเปญพิเศษและส่วนลด
          </div>
        </div>

        {/* Card 4: Leads / Inquiries */}
        <div
          onClick={() => onNavigateTab('inquiries')}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              รายการติดต่อลูกค้า
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{inquiries.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {newInquiries > 0 ? `รอดำเนินการ ${newInquiries} รายการ` : 'ติดต่อครบแล้ว'}
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Inquiries Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                รายการลูกค้าติดต่อล่าสุด (Recent Leads)
              </h3>
              <p className="text-xs text-slate-500">
                ลูกค้าที่กรอกแบบฟอร์มขอรับคำปรึกษาและโปรโมชั่น
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('inquiries')}
              className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {inquiries.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {inquiries.slice(0, 5).map(inq => (
                <div key={inq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{inq.customer_name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inq.status === 'new'
                            ? 'bg-rose-100 text-rose-700'
                            : inq.status === 'contacted'
                            ? 'bg-sky-100 text-sky-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {inq.status === 'new' ? 'ใหม่' : inq.status === 'contacted' ? 'ติดต่อแล้ว' : 'ปิดการขาย'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{inq.customer_phone}</span>
                      {inq.product_name && (
                        <>
                          <span>·</span>
                          <span className="text-sky-700 truncate max-w-xs">{inq.product_name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${inq.customer_phone.replace(/[^0-9]/g, '')}`}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>โทร</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-400">
              ยังไม่มีรายการติดต่อเข้ามาใหม่
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">ทางลัดการจัดการ (Quick Shortcuts)</h3>

            <div className="space-y-2">
              <button
                onClick={onOpenAddProduct}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-slate-100 transition-all flex items-center justify-between text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-sky-600" />
                  <span>เพิ่มสินค้าชิ้นใหม่</span>
                </div>
                <span>+</span>
              </button>

              <button
                onClick={() => onNavigateTab('banners')}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-slate-100 transition-all flex items-center justify-between text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>เปลี่ยนข้อความ Hero Banner</span>
                </div>
                <span>→</span>
              </button>

              <button
                onClick={() => onNavigateTab('settings')}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-slate-100 transition-all flex items-center justify-between text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>เปลี่ยนเบอร์โทร & LINE ID</span>
                </div>
                <span>→</span>
              </button>

              <button
                onClick={() => onNavigateTab('supabase')}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:border-sky-200 border border-slate-100 transition-all flex items-center justify-between text-xs font-semibold text-slate-700"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>ดูโค้ด SQL Migration & Supabase</span>
                </div>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
