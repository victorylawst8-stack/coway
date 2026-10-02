import React from 'react';
import { CODY_SERVICE_STEPS } from '../../lib/defaultData';
import { useStore } from '../../lib/store';
import { ShieldCheck, HeartHandshake, CheckCircle2, Phone, MessageCircle, Calendar, Sparkles } from 'lucide-react';

export const CodyServiceSection: React.FC = () => {
  const { settings, openInquiryModal } = useStore();

  return (
    <section id="cody-service" className="py-16 sm:py-24 bg-white relative overflow-hidden border-b border-slate-100">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-sky-100/60 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-4 h-4 text-sky-600" />
            <span>THE COWAY HEART SERVICE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            ทำไมใครๆ ถึงเลือก COWAY? <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700">
              บริการดูแลใส่ใจด้วยทีม Cody ผู้เชี่ยวชาญ
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
            หมดปัญหาเรื่องลืมเปลี่ยนไส้กรอง หรือกังวลว่าถังน้ำจะสกปรก เพราะเมื่อเป็นสมาชิก Coway Subscription ทีมงานผู้เชี่ยวชาญจะเข้าดูแลทำความสะอาดและเปลี่ยนไส้กรองแท้ฟรีถึงที่บ้านตลอดสัญญา
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {CODY_SERVICE_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-100 hover:border-sky-200 transition-all duration-300 relative group"
            >
              <div className="text-3xl font-black text-sky-200 group-hover:text-sky-500 transition-colors font-mono mb-3">
                {step.step}
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Callout Box: Traditional Purchase vs COWAY Subscription */}
        <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-widest">
                SUBSCRIPTION COMPARISON
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                เครื่องกรองน้ำทั่วไป vs Coway Subscription
              </h3>
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="text-rose-400 font-bold shrink-0">✕ แบบเดิม:</div>
                  <div className="text-slate-300">
                    ต้องซื้อเครื่องราคาแพงเป็นหมื่น ต้องคอยจำวันเปลี่ยนไส้กรองเอง สั่งซื้อไส้กรองไม่ตรงรุ่น เสี่ยงถังเก็บน้ำสะสมแบคทีเรีย และต้องจ่ายค่าช่างซ่อมเองเมื่อเครื่องชำรุด
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-sky-500/20 p-3 rounded-xl border border-sky-400/30">
                  <div className="text-emerald-400 font-bold shrink-0">✓ COWAY:</div>
                  <div className="text-white">
                    ผ่อนเริ่มต้นเพียง 590.-/เดือน ฟรีค่าติดตั้ง ไม่ต้องใช้เงินก้อน เจ้าหน้าที่ Cody โทรนัดหมายเข้าล้างถังทุก 2 เดือน และเปลี่ยนไส้กรองแท้ฟรีทุก 4 เดือน พร้อมรับประกันอะไหล่ฟรี 100%
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 text-center lg:text-right space-y-3">
              <div className="inline-block text-left bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <div className="text-xs text-sky-200">สนใจปรึกษาหรือเช็คพื้นที่บริการ</div>
                <div className="text-lg font-black text-white mt-1">โทร: {settings.phone}</div>
                <div className="text-xs text-emerald-400 font-medium mt-0.5">LINE: {settings.line_id}</div>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => openInquiryModal()}
                    className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    สมัครสมาชิกพร้อมรับของแถม
                  </button>
                  <a
                    href={settings.line_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>สอบถามโปรโมชั่นทาง LINE</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
