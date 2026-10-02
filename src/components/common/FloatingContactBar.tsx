import React from 'react';
import { useStore } from '../../lib/store';
import { Phone, MessageCircle, Bot, Sparkles } from 'lucide-react';

interface FloatingContactBarProps {
  onOpenAiChat: () => void;
  onOpenInquiry: () => void;
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({ onOpenAiChat, onOpenInquiry }) => {
  const { settings } = useStore();

  const cleanPhone = settings.phone ? settings.phone.replace(/[^0-9]/g, '') : '';

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-2.5 px-3 md:hidden">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Call Button */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors active:scale-95"
        >
          <Phone className="w-5 h-5 text-sky-600 mb-0.5" />
          <span className="text-[11px] font-bold">โทรหาเรา</span>
        </a>

        {/* LINE Button */}
        <a
          href={settings.line_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm active:scale-95"
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold">แอด LINE</span>
        </a>

        {/* AI Chat Button */}
        <button
          onClick={onOpenAiChat}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white transition-all shadow-sm active:scale-95 relative"
        >
          <span className="absolute -top-1 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <Bot className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold">ปรึกษา AI</span>
        </button>

        {/* Book / Free Consultation Form */}
        <button
          onClick={onOpenInquiry}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 transition-colors active:scale-95"
        >
          <Sparkles className="w-5 h-5 text-amber-600 mb-0.5" />
          <span className="text-[11px] font-bold">รับโปรพิเศษ</span>
        </button>
      </div>
    </div>
  );
};
