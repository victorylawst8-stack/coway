import React from 'react';
import { useStore } from '../../lib/store';
import { formatLineUrl } from '../../lib/lineHelper';
import {
  Users,
  Briefcase,
  TrendingUp,
  Award,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AgentRecruitmentSectionProps {
  onOpenInquiry: (planType?: 'agent') => void;
}

export const AgentRecruitmentSection: React.FC<AgentRecruitmentSectionProps> = ({ onOpenInquiry }) => {
  const { settings } = useStore();

  const customerLineUrl = formatLineUrl(settings.line_url || settings.line_id, 'https://line.me/ti/p/~cowaypartner');
  const agentLineUrl = formatLineUrl(settings.agent_line_url || settings.agent_line_id || settings.line_id, customerLineUrl);
  const agentLineId = settings.agent_line_id || settings.line_id || '@cowayagent.th';

  return (
    <section id="agent-recruitment" className="py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold tracking-wider uppercase">
              <Users className="w-4 h-4 text-sky-400" />
              <span>COWAY PARTNER RECRUITMENT</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight">
              ร่วมเติบโตไปกับเรา <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">
                เปิดรับสมัครตัวแทนจำหน่าย COWAY
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              โอกาสสร้างรายได้ที่มั่นคงกับแบรนด์เครื่องกรองน้ำและเครื่องฟอกอากาศอันดับ 1 ระบบ Coway Subscription ขายง่าย ลูกค้าตัดสินใจไว ไม่ต้องสต็อกสินค้า มีทีมงานและระบบ Cody ซัพพอร์ตเต็มรูปแบบ
            </p>

            {/* Benefit Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>ค่าตอบแทนสูง:</strong> รับค่าคอมมิชชั่นและโบนัสผลงานต่อเนื่อง</span>
              </div>

              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>ไม่ต้องสต็อกของ:</strong> บริษัทจัดส่งและติดตั้งให้ถึงบ้านลูกค้าทั่วไทย</span>
              </div>

              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>มีสื่อการตลาดพร้อม:</strong> รูปภาพ แคปชั่น และโบร์ชัวร์สำหรับโพสต์ขาย</span>
              </div>

              <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>เทรนนิ่งฟรี:</strong> มีแม่ทีมและผู้เชี่ยวชาญคอยประกบสอนงานตัวต่อตัว</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {/* Main Button: สมัครตัวแทนผ่าน LINE */}
              <a
                href={agentLineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#06C755] hover:bg-[#05b34c] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#06C755]/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>สมัครตัวแทนผ่าน LINE: {agentLineId}</span>
              </a>

              {/* Secondary Button: กรอกข้อมูลสมัครตัวแทน */}
              <button
                onClick={() => onOpenInquiry('agent')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-2xl border border-white/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>ส่งข้อมูลขอรายละเอียดตัวแทน</span>
              </button>
            </div>
          </div>

          {/* Right Card: Quick Application Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block">
                    TEAM PARTNER
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    เริ่มต้นเป็นตัวแทน COWAY วันนี้
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">คุณสมบัติผู้สมัคร:</span>
                  <span className="font-semibold text-white">อายุ 20 ปีขึ้นไป ทั่วประเทศไทย</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">รูปแบบการทำงาน:</span>
                  <span className="font-semibold text-white">Full-time หรือ Part-time ออนไลน์</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">ค่าลงทะเบียน:</span>
                  <span className="font-semibold text-emerald-400">ฟรี ไม่มีค่าแรกเข้า</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">ช่องทางติดต่อรับสมัคร:</span>
                  <span className="font-mono font-bold text-emerald-300">{agentLineId}</span>
                </div>
              </div>

              <a
                href={agentLineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>คลิกแอด LINE เพื่อคุยกับทีมโค้ชตัวแทน</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
