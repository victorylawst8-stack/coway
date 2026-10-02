import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../lib/store';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Phone,
  MessageCircle,
  Minimize2,
  RefreshCw,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ChatMessage } from '../../types/database';

interface AiChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  activeProductContext?: any;
}

const QUICK_PROMPTS = [
  'แนะนำเครื่องกรองน้ำสำหรับคอนโด 1-2 คน',
  'Villaem II กับ Neo Plus แตกต่างกันอย่างไร?',
  'บริการ Cody Heart Service ดูแลฟรีจริงไหม?',
  'อยากได้รุ่นทำน้ำแข็งในตัว มีรุ่นไหนบ้าง?'
];

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({
  isOpen,
  onToggle,
  activeProductContext,
}) => {
  const { settings, openInquiryModal } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `สวัสดีครับ 👋 ผมเป็นผู้ช่วย AI ประจำร้านตัวแทนจำหน่าย COWAY ยินดีให้คำปรึกษาและแนะนำเครื่องกรองน้ำ เครื่องฟอกอากาศ หรือบริการ Coway Subscription ที่เหมาะสมกับคุณที่สุดครับ มีข้อสงสัยหรืออยากให้แนะนำรุ่นไหน สอบถามได้เลยครับ!`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
          productContext: activeProductContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'ขออภัยครับ ขณะนี้ระบบมีปัญหาชั่วคราว สามารถติดต่อสอบถามเจ้าหน้าที่ผ่านทาง LINE ได้ทันทีครับ',
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('AI Chat failed, using smart fallback answer:', err);
      // Smart offline fallback
      let fallbackText = 'ขอบคุณที่สอบถามครับ! ทางเรายินดีให้คำปรึกษาและแจ้งโปรโมชั่นพิเศษประจำเดือน สามารถโทรสายด่วน หรือกดแอด LINE เพื่อคุยกับผู้เชี่ยวชาญ COWAY ได้ทันทีครับ';
      
      const lower = text.toLowerCase();
      if (lower.includes('ราคา') || lower.includes('ผ่อน')) {
        fallbackText = 'เครื่องกรองน้ำ COWAY เริ่มต้นผ่อนเพียง 590 - 790 บาท/เดือน ฟรีค่าติดตั้ง และฟรีบริการ Cody ล้างถังทุก 2 เดือน เปลี่ยนไส้กรองทุก 4 เดือนตลอดสัญญาเลยครับ! แนะนำแอด LINE เพื่อรับโปรโมชั่นล่าสุดได้เลยครับ';
      } else if (lower.includes('cody') || lower.includes('บริการ')) {
        fallbackText = 'บริการ Cody Heart Service เข้าล้างทำความสะอาดถังน้ำทุก 2 เดือน และเปลี่ยนไส้กรองฟรีทุก 4 เดือน ไม่มีค่าใช้จ่ายแอบแฝงใดๆ เลยครับตลอดอายุสัญญา สบายใจได้ 100%';
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'สวัสดีครับ เริ่มต้นสนทนาใหม่ได้เลยครับ มีเรื่องไหนให้ผมช่วยแนะนำเกี่ยวกับ COWAY เพิ่มเติมไหมครับ?',
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Desktop Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        {!isOpen && (
          <button
            onClick={onToggle}
            className="group flex items-center gap-3 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-sky-600/30 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Open COWAY AI Chat"
          >
            <div className="relative">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold leading-tight flex items-center gap-1">
                <span>ผู้ช่วย AI COWAY</span>
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
              <div className="text-[10px] text-sky-100">สอบถามรุ่น & โปรโมชั่น</div>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>ผู้ช่วย AI - COWAY Partner</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[11px] text-sky-100 flex items-center gap-1">
                  <span>แนะนำรุ่นและโปรโมชั่นทันใจ</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="p-1.5 rounded-lg text-sky-100 hover:text-white hover:bg-white/10 transition-colors"
                title="เริ่มการสนทนาใหม่"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-sky-100 hover:text-white hover:bg-white/10 transition-colors"
                title="ปิดหน้าต่าง"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Contact Banner inside Chat */}
          <div className="bg-sky-50 px-3.5 py-2 border-b border-sky-100 flex items-center justify-between text-xs text-sky-900">
            <span className="text-[11px] font-medium text-slate-600">ต้องการคุยกับเจ้าหน้าที่:</span>
            <div className="flex items-center gap-2">
              <a
                href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-white px-2 py-0.5 rounded border border-sky-200"
              >
                <Phone className="w-3 h-3 text-sky-600" />
                <span>โทร</span>
              </a>
              <a
                href={settings.line_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>LINE</span>
              </a>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map(msg => {
              const isAi = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                      isAi
                        ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                        : 'bg-sky-600 text-white rounded-tr-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isAi ? 'text-slate-400' : 'text-sky-200'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs pl-2">
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white px-3 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 pt-2 bg-white border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-[11px]">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 rounded-full transition-colors shrink-0 border border-slate-200/60"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="พิมพ์คำถาม เช่น แนะนำรุ่นสำหรับ 4 คน..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white transition-all shrink-0 active:scale-95 shadow-sm shadow-sky-600/20"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
