import React, { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { formatLineUrl } from '../../lib/lineHelper';
import { Sparkles, ShieldCheck, Droplets, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, Phone, Briefcase, MessageCircle } from 'lucide-react';

interface HeroBannerProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate }) => {
  const { banners, settings, openInquiryModal } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);

  const activeBanners = banners.filter(b => b.status === 'active');
  const activeBanner = activeBanners[currentIdx] || banners[0];

  const agentLineUrl = formatLineUrl(settings.agent_line_url || settings.agent_line_id || settings.line_id, 'https://line.me/ti/p/~cowayagent');
  const agentLineId = settings.agent_line_id || settings.line_id || '@cowayagent.th';

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/* Decorative gradient blur backdrop */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-sky-200 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
              <span className="text-xs font-semibold text-sky-900 tracking-wide">
                {activeBanner?.badge || 'COWAY AUTHORIZED PARTNER'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {activeBanner?.title || 'ดูแลคุณภาพชีวิต ให้ทุกวันเป็นวันที่ดีขึ้น'}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
              {activeBanner?.subtitle ||
                'สัมผัสประสบการณ์น้ำดื่มสะอาดบริสุทธิ์และอากาศบริสุทธิ์ ด้วยระบบ Coway Subscription ผ่อนสบาย เริ่มต้นเพียง 590.-/เดือน พร้อมบริการ Cody Heart Service ดูแลฟรีตลอดอายุสัญญา'}
            </p>

            {/* Key Trust Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>ฟรีค่าติดตั้ง 2,000.-</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Cody ล้างถังฟรีทุก 2 ด.</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>เปลี่ยนไส้กรองฟรีทุก 4 ด.</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="px-6 py-3.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-sky-600/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>ดูสินค้าและโปรโมชั่น</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openInquiryModal()}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-full border border-slate-200 shadow-sm transition-all hover:border-slate-300 active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>ขอคำปรึกษาเลือกรุ่น</span>
              </button>

              <a
                href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
                className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900 px-4 py-3"
              >
                <Phone className="w-4 h-4" />
                <span>โทร {settings.phone}</span>
              </a>
            </div>

            {/* Prominent Coway Agent Recruitment Banner inside Top Viewport */}
            <div className="pt-1">
              <div className="inline-flex flex-wrap items-center gap-2.5 p-2 sm:p-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 text-slate-800 text-xs shadow-sm">
                <span className="flex items-center gap-1.5 font-extrabold text-amber-900">
                  <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>เปิดรับสมัครตัวแทนจำหน่าย COWAY</span>
                </span>
                <span className="hidden sm:inline text-slate-500">•</span>
                <span className="text-[11px] text-slate-600 hidden sm:inline">ไม่ต้องสต็อกสินค้า รายได้ดี</span>
                <a
                  href={agentLineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1 rounded-full text-[11px] shadow-sm hover:scale-105 active:scale-95 transition-all ml-auto"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>สมัครผ่าน LINE</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Image Banner Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Product Hero Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-square">
                <img
                  src={activeBanner?.image_url || 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80'}
                  alt={activeBanner?.title || 'COWAY Promotion'}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Glassmorphic floating card */}
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-sky-600 tracking-wider">
                        COWAY SUBSCRIPTION
                      </span>
                      <div className="text-xs font-bold text-slate-900">
                        เริ่มต้นเพียง 590.- / เดือน
                      </div>
                    </div>
                    <button
                      onClick={() => openInquiryModal()}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold rounded-lg shadow-sm"
                    >
                      รับสิทธิ์เลย
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider pagination dots */}
              {activeBanners.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {activeBanners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === currentIdx ? 'w-6 bg-sky-600' : 'w-2 bg-slate-300'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
