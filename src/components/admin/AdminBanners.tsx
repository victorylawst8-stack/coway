import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Banner } from '../../types/database';
import { uploadImageToStorage } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Image as ImageIcon, Upload, Check, X, Sparkles } from 'lucide-react';

export const AdminBanners: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    button_text: 'ดูสินค้าและโปรโมชั่น',
    button_url: '#products',
    badge: 'COWAY SUBSCRIPTION CARE',
    sort_order: 1,
    status: 'active' as 'active' | 'inactive',
  });

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=1200&q=80',
      button_text: 'ดูสินค้าและโปรโมชั่น',
      button_url: '#products',
      badge: 'COWAY SUBSCRIPTION CARE',
      sort_order: banners.length + 1,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Banner) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle,
      image_url: b.image_url,
      button_text: b.button_text,
      button_url: b.button_url,
      badge: b.badge || '',
      sort_order: b.sort_order || 1,
      status: b.status,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToStorage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      showToast('อัปโหลดรูปภาพแบนเนอร์สำเร็จ', 'success');
    } catch (err: any) {
      showToast(err?.message || 'ไม่สามารถอัปโหลดรูปภาพได้', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image_url.trim()) return;

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      image_url: formData.image_url.trim(),
      button_text: formData.button_text.trim(),
      button_url: formData.button_url.trim(),
      badge: formData.badge.trim(),
      sort_order: Number(formData.sort_order),
      status: formData.status,
    };

    if (editingBanner) {
      await updateBanner(editingBanner.id, payload);
    } else {
      await addBanner(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            จัดการแบนเนอร์และภาพสไลด์หน้าแรก (Hero Banners CMS)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            แก้ไขข้อความ Headline สโลแกน รูปภาพ และปุ่มกด CTA สำหรับหน้าแรก
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มแบนเนอร์ใหม่</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map(banner => (
          <div
            key={banner.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    banner.status === 'active'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {banner.status === 'active' ? 'กำลังแสดงผล' : 'ปิดใช้งาน'}
                </span>
                {banner.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-800 shadow">
                    {banner.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{banner.title}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {banner.subtitle}
                </p>
                <div className="mt-3 text-[11px] text-sky-700 font-semibold flex items-center gap-1">
                  <span>ปุ่ม: &quot;{banner.button_text}&quot;</span>
                  <span className="text-slate-400">({banner.button_url})</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">ลำดับที่ {banner.sort_order}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('คุณแน่ใจว่าต้องการลบแบนเนอร์นี้หรือไม่?')) {
                        await deleteBanner(banner.id);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingBanner ? 'แก้ไขข้อมูลแบนเนอร์' : 'เพิ่มแบนเนอร์ใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ข้อความพาดหัวหลัก (Headline Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ดูแลคุณภาพชีวิต ให้ทุกวันเป็นวันที่ดีขึ้น"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ข้อความคำอธิบายรอง (Subtitle)
                </label>
                <textarea
                  rows={2}
                  placeholder="คำอธิบายรายละเอียดโปรโมชั่นหรือจุดเด่น..."
                  value={formData.subtitle}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ป้ายกำกับด้านบน (Badge)
                </label>
                <input
                  type="text"
                  placeholder="COWAY SUBSCRIPTION CARE"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Image Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  รูปภาพแบนเนอร์ (URL หรือ อัปโหลด)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปจากเครื่อง'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ข้อความบนปุ่ม
                  </label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={e => setFormData({ ...formData, button_text: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ลิงก์ปุ่ม (URL / Anchor)
                  </label>
                  <input
                    type="text"
                    value={formData.button_url}
                    onChange={e => setFormData({ ...formData, button_url: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
                >
                  บันทึกแบนเนอร์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
