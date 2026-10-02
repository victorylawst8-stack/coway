import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { formatLineUrl } from '../../lib/lineHelper';
import { MessageCircle, Briefcase, Copy, Check, ChevronUp, Sparkles, X } from 'lucide-react';

export const FloatingLineButton: React.FC = () => {
  const { settings, showToast } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const customerLineUrl = formatLineUrl(settings.line_url || settings.line_id, 'https://line.me/ti/p/~cowaypartner');
  const agentLineUrl = formatLineUrl(settings.agent_line_url || settings.agent_line_id || settings.line_id, customerLineUrl);

  const handleCopyLineId = (e: React.MouseEvent, idToCopy: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(idToCopy);
    setCopied(true);
    showToast(`คัดลอก LINE ID: ${idToCopy} เรียบร้อยแล้ว`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-20 md:bottom-24 right-4 sm:right-6 z-40 flex flex-col items-end select-none">
      {/* Popover Menu when toggled */}
      {showMenu && (
        <div className="mb-3 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 space-y-2.5 animate-in slide-in-from-bottom-3 duration-200 text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06C755] animate-pulse"></span>
              <span className="text-xs font-bold text-slate-900">ติดต่อผ่าน LINE Official</span>
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Option 1: Customer Consultation */}
          <a
            href={customerLineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/60 transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#06C755] text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="text-left truncate">
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                  สอบถามโปรโมชั่น / สั่งซื้อ
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  ID: {settings.line_id || '@cowaycare.th'}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => handleCopyLineId(e, settings.line_id || '@cowaycare.th')}
              title="คัดลอก LINE ID"
              className="p-1.5 rounded-lg hover:bg-emerald-200 text-slate-500 hover:text-emerald-900 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </a>

          {/* Option 2: Coway Agent Recruitment */}
          <a
            href={agentLineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/70 transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="text-left truncate">
                <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900 flex items-center gap-1">
                  <span>สมัครตัวแทนจำหน่าย</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded font-bold">เปิดรับ</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  ID: {settings.agent_line_id || settings.line_id}
                </div>
              </div>
            </div>
            <span className="text-xs text-amber-700 font-bold pr-1">→</span>
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2 group">
        {/* Desktop Tooltip Badge */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-lg border border-slate-200/80 hover:bg-slate-50 group-hover:scale-105 transition-all cursor-pointer"
        >
          <span className="text-[#06C755] font-extrabold text-sm">LINE</span>
          <span className="text-slate-600">แอดไลน์รับโปร / สมัครตัวแทน</span>
          <span className="w-2 h-2 rounded-full bg-[#06C755] animate-ping" />
        </button>

        {/* Main Floating Circle Button */}
        <div className="relative">
          {/* Pulsing Aura */}
          <span className="absolute -inset-1 rounded-full bg-[#06C755] opacity-40 animate-ping pointer-events-none" />

          <a
            href={customerLineUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              // If user clicks on mobile or wants quick options, toggle menu with right click or menu icon
            }}
            className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white shadow-xl shadow-[#06C755]/35 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Add LINE Official Account"
            title={`แอด LINE: ${settings.line_id}`}
          >
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-[#06C755]" />
          </a>

          {/* Quick Options Chevron Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
            title="ตัวเลือก LINE"
            aria-label="Toggle options"
          >
            <ChevronUp className={`w-3 h-3 transition-transform ${showMenu ? 'rotate-180 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
