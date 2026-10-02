import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { formatLineUrl } from '../../lib/lineHelper';
import { Save, Phone, MessageCircle, Mail, MapPin, ShieldCheck, AlertCircle, Briefcase, ExternalLink, Sparkles } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast } = useStore();

  const [formData, setFormData] = useState({
    site_name: settings.site_name,
    dealer_name: settings.dealer_name,
    dealer_code: settings.dealer_code,
    phone: settings.phone,
    line_id: settings.line_id,
    line_url: settings.line_url,
    agent_line_url: settings.agent_line_url || '',
    agent_line_id: settings.agent_line_id || '',
    email: settings.email,
    facebook_url: settings.facebook_url || '',
    instagram_url: settings.instagram_url || '',
    working_hours: settings.working_hours,
    footer_text: settings.footer_text,
    dealer_disclaimer: settings.dealer_disclaimer,
    announcement: settings.announcement || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      showToast('บันทึกการตั้งค่าเว็บไซต์เรียบร้อยแล้ว ข้อมูลหน้าเว็บอัปเดตทันที', 'success');
    } catch (err: any) {
      showToast(err?.message || 'ไม่สามารถบันทึกข้อมูลได้', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            ตั้งค่าข้อมูลร้านค้า & ช่องทางติดต่อ (CMS Settings)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            แก้ไขหมายเลขโทรศัพท์ LINE OA ข้อความแถบประกาศ และข้อความชี้แจงตัวแทนจำหน่าย
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Channels (Crucial) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-4 h-4 text-sky-600" />
            <span>ช่องทางการติดต่อด่วน (Floating Contact & Navbar)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หมายเลขโทรศัพท์สายด่วน (โทรทันทีแบบ tel:)
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
                placeholder="082-456-7890"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                ปุ่มโทรศัพท์บนเว็บไซต์และ Floating Bar จะโทรออกไปยังเบอร์นี้โดยตรง
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                LINE ID (สำหรับแสดงผล)
              </label>
              <input
                type="text"
                required
                value={formData.line_id}
                onChange={e => setFormData({ ...formData, line_id: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
                placeholder="@cowaycare.th"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ลิงก์ LINE Official Account URL (กดแล้วเปิดแอพ LINE ทันที)
            </label>
            <input
              type="url"
              required
              value={formData.line_url}
              onChange={e => setFormData({ ...formData, line_url: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono"
              placeholder="https://line.me/ti/p/~cowaypartner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                อีเมลติดต่อ
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                placeholder="contact@cowaycare-thailand.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เวลาทำการ
              </label>
              <input
                type="text"
                value={formData.working_hours}
                onChange={e => setFormData({ ...formData, working_hours: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                placeholder="ทุกวัน 08:30 - 20:00 น."
              />
            </div>
          </div>
        </div>

        {/* Agent Recruitment Channel Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>ช่องทางรับสมัครตัวแทนจำหน่าย COWAY (Agent Recruitment Settings)</span>
            </h3>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
              ปุ่มสมัครตัวแทนส่วนบนเว็บ
            </span>
          </div>

          <p className="text-xs text-slate-500">
            ระบบจะนำ LINE ID และลิงก์นี้ไปแสดงที่ <strong>ปุ่มสมัครตัวแทน COWAY เด่นชัดที่ส่วนบนของเว็บไซต์</strong>, แถบประกาศ, แถบเมนูด้านข้าง และปุ่มลอยตัว LINE ทันที
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                LINE ID สำหรับรับสมัครตัวแทน (เช่น topsalecoway1919 หรือ @cowayagent)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.agent_line_id}
                  onChange={e => {
                    const newId = e.target.value;
                    const autoUrl = formatLineUrl(newId, '');
                    setFormData({
                      ...formData,
                      agent_line_id: newId,
                      agent_line_url: formData.agent_line_url && !formData.agent_line_url.includes('ti/p') ? formData.agent_line_url : autoUrl
                    });
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-semibold"
                  placeholder="topsalecoway1919 หรือ @cowayagent"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                สามารถกรอกเป็น LINE ID ธรรมดา หรือพิมพ์ @ นำหน้าได้
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ลิงก์ LINE URL สำหรับปุ่มสมัครตัวแทน (กดแล้วเปิดแชท LINE)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.agent_line_url}
                  onChange={e => setFormData({ ...formData, agent_line_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                  placeholder="https://line.me/ti/p/~topsalecoway1919"
                />
                <button
                  type="button"
                  onClick={() => {
                    const generated = formatLineUrl(formData.agent_line_id || formData.line_id);
                    setFormData({ ...formData, agent_line_url: generated });
                    showToast('สร้างลิงก์ LINE อัตโนมัติจาก ID แล้ว', 'info');
                  }}
                  className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold whitespace-nowrap"
                  title="สร้างลิงก์อัตโนมัติจาก LINE ID"
                >
                  สร้างลิงก์
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                หากเว้นว่างไว้ ระบบจะสร้างลิงก์เปิดแชทจาก LINE ID ให้โดยอัตโนมัติ
              </span>
            </div>
          </div>

          {/* Live Preview of button target */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-amber-800 font-bold">ตัวอย่างลิงก์ที่จะเปิดเมื่อผู้ใช้กดปุ่ม:</span>
              <code className="text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px]">
                {formatLineUrl(formData.agent_line_url || formData.agent_line_id || formData.line_id)}
              </code>
            </div>

            <a
              href={formatLineUrl(formData.agent_line_url || formData.agent_line_id || formData.line_id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-xs hover:scale-102 transition-all"
            >
              <span>ทดสอบเปิดลิงก์</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Announcement Bar & Dealer Branding */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>ข้อมูลตัวแทนจำหน่าย & แถบประกาศหัวเว็บ</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ข้อความแถบประกาศหัวเว็บ (Top Announcement Bar)
            </label>
            <input
              type="text"
              value={formData.announcement}
              onChange={e => setFormData({ ...formData, announcement: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
              placeholder="🎉 โปรโมชั่นพิเศษ: ฟรีค่าติดตั้ง 2,000.- และฟรีบริการ Cody ล้างถังตลอดสัญญา!"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อร้านค้า / ตัวแทนจำหน่าย
              </label>
              <input
                type="text"
                value={formData.site_name}
                onChange={e => setFormData({ ...formData, site_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสตัวแทนจำหน่าย (Dealer Code)
              </label>
              <input
                type="text"
                value={formData.dealer_code}
                onChange={e => setFormData({ ...formData, dealer_code: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ข้อความท้ายเว็บ (Footer Text)
            </label>
            <textarea
              rows={2}
              value={formData.footer_text}
              onChange={e => setFormData({ ...formData, footer_text: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ข้อความชี้แจงความเป็นตัวแทนจำหน่าย (Dealer Disclaimer)
            </label>
            <textarea
              rows={3}
              value={formData.dealer_disclaimer}
              onChange={e => setFormData({ ...formData, dealer_disclaimer: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 resize-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              แสดงในส่วนท้ายของเว็บไซต์ เพื่อความโปร่งใสและถูกต้องตามข้อกำหนดการเป็นตัวแทนจำหน่าย
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-sky-600/25 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการตั้งค่าทั้งหมด'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
