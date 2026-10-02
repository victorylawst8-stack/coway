import React from 'react';
import { useStore } from '../../lib/store';
import { formatLineUrl } from '../../lib/lineHelper';
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, CheckCircle2, HeartHandshake, Briefcase } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, categories, setActiveCategorySlug } = useStore();

  const customerLineUrl = formatLineUrl(settings.line_url || settings.line_id, 'https://line.me/ti/p/~cowaypartner');
  const agentLineUrl = formatLineUrl(settings.agent_line_url || settings.agent_line_id || settings.line_id, customerLineUrl);
  const agentLineId = settings.agent_line_id || settings.line_id || '@cowayagent.th';

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-28 sm:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Partner Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20">
                C
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                  COWAY
                </span>
                <span className="ml-2 text-[10px] font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-400/30">
                  PARTNER
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.footer_text || 'ดูแลคุณภาพชีวิต ให้ทุกวันเป็นวันที่ดีขึ้น ด้วยนวัตกรรมน้ำดื่มสะอาดและอากาศบริสุทธิ์จาก COWAY'}
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>ตัวแทนจำหน่ายมาตรฐาน {settings.dealer_code}</span>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider mb-4">
              หมวดหมู่สินค้า
            </h4>
            <ul className="space-y-2.5 text-xs">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setActiveCategorySlug(cat.slug);
                      onNavigate('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-sky-500">›</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('agent-recruitment')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-emerald-400 text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
                >
                  <span>›</span>
                  <span>ร่วมงานกับเรา (สมัครตัวแทนจำหน่าย)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategorySlug('all');
                    onNavigate('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-sky-400 transition-colors flex items-center gap-1.5 text-sky-400 font-medium"
                >
                  <span className="text-sky-400">›</span>
                  <span>ดูสินค้าทั้งหมด</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Cody Service Trust Pillars */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider mb-4">
              บริการ Cody Heart Service
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>ทำความสะอาดฆ่าเชื้อถังน้ำฟรีทุก 2 เดือน</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>เปลี่ยนไส้กรองแท้ฟรีทุก 4 เดือนตลอดสัญญา</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>ฟรีค่าติดตั้ง ค่าจัดส่ง และค่าบริการซ่อมบำรุง</span>
              </li>
              <li className="flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>ทีมช่างและ Cody ดูแลครอบคลุม 77 จังหวัด</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider mb-4">
              ติดต่อและสอบถามโปรโมชั่น
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-900/60 border border-sky-700/50 flex items-center justify-center text-sky-300 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">เบอร์โทรศัพท์สายด่วน</div>
                  <div className="font-semibold text-white">{settings.phone}</div>
                </div>
              </a>

              <a
                href={customerLineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">LINE Official Account</div>
                  <div className="font-semibold text-emerald-400">{settings.line_id}</div>
                </div>
              </a>

              {settings.email && (
                <div className="flex items-center gap-2.5 text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">อีเมลสอบถาม</div>
                    <div className="text-slate-300">{settings.email}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5 text-slate-400 pt-1">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>เวลาทำการ: {settings.working_hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mb-8 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-medium text-slate-300 mb-1">ข้อความชี้แจงความเป็นตัวแทนจำหน่าย (Authorized Dealer Notice):</p>
          <p>
            {settings.dealer_disclaimer ||
              'เว็บไซต์นี้จัดทำขึ้นโดยตัวแทนจำหน่ายอิสระที่ได้รับการแต่งตั้งอย่างถูกต้องจาก COWAY เพื่อเผยแพร่ข้อมูลสินค้า แคมเปญโปรโมชั่น และอำนวยความสะดวกในการสมัครแพ็กเกจบริการ Coway Subscription และ Cody Service เท่านั้น ไม่ใช่เว็บไซต์หลักของสำนักงานใหญ่ บมจ. โคเวย์ (ประเทศไทย)'}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="flex items-center gap-1.5 select-none" onDoubleClick={() => onNavigate('admin')}>
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-500 hover:text-slate-400 p-0.5 rounded cursor-default select-none transition-colors"
              title="COWAY Partner"
              aria-label="Portal access"
            >
              ©
            </button>
            <span>{new Date().getFullYear()} COWAY Partner Thailand. All rights reserved.</span>
            <button
              onClick={() => onNavigate('admin')}
              className="opacity-0 hover:opacity-40 transition-opacity p-0.5 cursor-pointer ml-1 text-slate-600"
              title="Admin"
              aria-label="Admin Access"
            >
              <ShieldCheck className="w-3 h-3 inline" />
            </button>
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span>มาตรฐานสุขอนามัยระดับสากล</span>
            <span>·</span>
            <span>บริการด้วยใจ ใส่ใจสุขภาพคุณ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
