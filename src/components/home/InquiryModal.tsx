import React, { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { X, CheckCircle2, ShieldCheck, Sparkles, Send, Phone, MessageCircle } from 'lucide-react';

export const InquiryModal: React.FC = () => {
  const {
    inquiryModalOpen,
    closeInquiryModal,
    selectedProductForInquiry,
    createInquiry,
    settings,
    products,
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [line, setLine] = useState('');
  const [productId, setProductId] = useState('');
  const [planType, setPlanType] = useState<'subscription' | 'outright' | 'consult' | 'agent'>('subscription');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedProductForInquiry) {
      setProductId(selectedProductForInquiry.id);
    } else {
      setProductId(products[0]?.id || '');
    }
    setSubmitted(false);
  }, [selectedProductForInquiry, products, inquiryModalOpen]);

  if (!inquiryModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const chosenProduct = products.find(p => p.id === productId);

    await createInquiry({
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_line: line.trim() || undefined,
      product_id: productId || undefined,
      product_name: chosenProduct?.name || 'ขอคำปรึกษาทั่วไป',
      plan_type: planType,
      message: message.trim() || undefined,
    });

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    closeInquiryModal();
    setSubmitted(false);
    setName('');
    setPhone('');
    setLine('');
    setMessage('');
  };

  const selectedProduct = products.find(p => p.id === productId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 to-blue-700 text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-sky-100">
              Special Campaign
            </span>
          </div>
          <h3 className="text-xl font-bold leading-snug">
            {submitted ? 'ขอบคุณที่ให้ความไว้วางใจ' : 'รับสิทธิ์โปรโมชั่นและปรึกษาผู้เชี่ยวชาญ'}
          </h3>
          <p className="text-xs text-sky-100 mt-1">
            {submitted
              ? 'เจ้าหน้าที่ Cody Specialist จะติดต่อกลับตามหมายเลขที่ระบุไว้ครับ'
              : 'ฟรีค่าติดตั้ง 2,000.- พร้อมรับของสมนาคุณประจำเดือนเมื่อสมัครผ่านเว็บไซต์นี้'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">ส่งข้อมูลเรียบร้อยแล้ว</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                ทางทีมงานตัวแทนจำหน่าย COWAY ได้รับข้อมูลของท่านแล้ว และจะติดต่อกลับโดยเร็วที่สุดเพื่อแนะนำโปรโมชั่นและสิทธิพิเศษครับ
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={settings.line_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>แอด LINE เพื่อรับโปรทันที</span>
                </a>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto text-xs font-semibold px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product preview if selected */}
              {selectedProduct && (
                <div className="flex items-center gap-3 p-3 bg-sky-50/70 rounded-2xl border border-sky-100">
                  <img
                    src={selectedProduct.main_image}
                    alt={selectedProduct.name}
                    className="w-14 h-14 object-cover rounded-xl bg-white shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-sky-700">รุ่นที่สนใจ:</span>
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {selectedProduct.name}
                    </h5>
                    <div className="text-[11px] text-slate-600">
                      ผ่อนเริ่มต้น{' '}
                      <span className="font-bold text-sky-600">
                        {selectedProduct.monthly_price.toLocaleString()}
                      </span>{' '}
                      บ./เดือน
                    </div>
                  </div>
                </div>
              )}

              {/* Product Select if not preselected */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เลือกสินค้าที่ต้องการสอบถาม
                </label>
                <select
                  value={productId}
                  onChange={e => setProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 bg-white"
                >
                  <option value="">-- ขอคำปรึกษาเลือกรุ่นที่เหมาะสม --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.monthly_price ? `${p.monthly_price.toLocaleString()} บ./ด.` : ''})
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  รูปแบบที่สนใจ
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlanType('subscription')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-all ${
                      planType === 'subscription'
                        ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-sm font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    รายเดือน
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanType('outright')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-all ${
                      planType === 'outright'
                        ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-sm font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ซื้อขาด
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanType('consult')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-all ${
                      planType === 'consult'
                        ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-sm font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ขอคำแนะนำ
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanType('agent')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-all ${
                      planType === 'agent'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    สมัครตัวแทน
                  </button>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คุณสมชาย หรือ นันทิยา"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Phone and LINE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="081-234-5678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LINE ID (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    placeholder="เพื่อให้ส่งสลิปโปรโมชั่น"
                    value={line}
                    onChange={e => setLine(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Message Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ข้อความเพิ่มเติม (เช่น พักอาศัยคอนโดกี่คน หรือมีสัตว์เลี้ยง)
                </label>
                <textarea
                  rows={2}
                  placeholder="ระบุข้อความหรือคำถามที่ต้องการทราบ..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>ข้อมูลของท่านจะถูกเก็บเป็นความลับเพื่อใช้ติดต่อให้คำปรึกษาเท่านั้น</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 active:scale-98 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งข้อมูลเพื่อรับโปรโมชั่น'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
