import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Phone, MessageCircle, MapPin, Clock, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, createInquiry, showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [line, setLine] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    await createInquiry({
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_line: line.trim() || undefined,
      plan_type: 'consult',
      product_name: 'ติดต่อสอบถามทั่วไปจากหน้าเว็บ',
      message: message.trim() || undefined,
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setName('');
    setPhone('');
    setLine('');
    setMessage('');
  };

  return (
    <section id="contact-section" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Contact details & Dealer credentials */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 tracking-wider uppercase">
                CONTACT & INQUIRY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
                พร้อมให้คำปรึกษาและ <br />
                ดูแลสุขภาพของคุณทุกวัน
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                ไม่แน่ใจว่าบ้านหรือคอนโดของคุณเหมาะกับรุ่นไหน? ต้องการเช็คโปรโมชั่นล่าสุด หรือเช็คพื้นที่บริการติดตั้งฟรี ติดต่อทีมงานผู้เชี่ยวชาญ COWAY ได้ทันทีครับ
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
                className="p-5 rounded-2xl bg-sky-50/60 hover:bg-sky-100/60 border border-sky-100 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">โทรปรึกษาสายด่วน</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{settings.phone}</div>
                  <div className="text-[10px] text-sky-700 mt-1">บริการทุกวัน 08:30 - 20:00 น.</div>
                </div>
              </a>

              <a
                href={settings.line_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-100 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">LINE Official</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{settings.line_id}</div>
                  <div className="text-[10px] text-emerald-700 mt-1">คลิกเพื่อรับสิทธิ์โปรโมชั่น</div>
                </div>
              </a>
            </div>

            {/* Dealer credentials box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>ตัวแทนจำหน่ายที่ได้รับอนุญาตอย่างถูกต้อง ({settings.dealer_code})</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                เอกสารการสมัครและการติดตั้งทุกรายการดำเนินการผ่านระบบมาตรฐานความปลอดภัยของ บมจ. โคเวย์ (ประเทศไทย) โดยตรง ปลอดภัย มั่นใจได้ 100%
              </p>
            </div>
          </div>

          {/* Right Column: Callback Request Form */}
          <div className="lg:col-span-6">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm relative">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                ให้เจ้าหน้าที่ติดต่อกลับเพื่อรับโปรพิเศษ
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                กรอกเบอร์โทรศัพท์เพื่อให้เจ้าหน้าที่โทรแนะนำโปรโมชั่นและของสมนาคุณประจำเดือน
              </p>

              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">รับข้อมูลเรียบร้อยแล้ว</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    เจ้าหน้าที่ COWAY จะรีบติดต่อกลับเพื่อให้คำปรึกษาและมอบสิทธิพิเศษแก่ท่านครับ
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-sky-600 hover:underline pt-2"
                  >
                    ส่งข้อมูลเพิ่มเติม
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ชื่อของคุณ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น คุณกานต์ หรือ วีรชัย"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="08X-XXX-XXXX"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        LINE ID (ถ้าสะดวก)
                      </label>
                      <input
                        type="text"
                        placeholder="สำหรับส่งใบเสนอราคา"
                        value={line}
                        onChange={e => setLine(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      สินค้าหรือคำถามที่สนใจ
                    </label>
                    <textarea
                      rows={2}
                      placeholder="เช่น สอบถามรุ่น Villaem II หรือเครื่องฟอกอากาศ Storm..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-sky-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งคำขอรับคำปรึกษาและโปรโมชั่น'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
