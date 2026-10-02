import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Product } from '../../types/database';
import { uploadImageToStorage } from '../../lib/supabase';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface AdminProductsProps {
  isAddModalOpenInitially?: boolean;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ isAddModalOpenInitially }) => {
  const { products, categories, addProduct, updateProduct, deleteProduct, toggleProductStatus, showToast } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(isAddModalOpenInitially || false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category_id: '',
    short_description: '',
    description: '',
    monthly_price: 790,
    price: 39900,
    sale_price: 36900,
    main_image: '',
    badge: '',
    is_featured: false,
    is_promotion: false,
    status: 'active' as 'active' | 'inactive',
    sort_order: 1,
    highlights: ['', '', ''],
    specifications: [
      { key: 'ระบบการกรอง', value: 'RO 6 ขั้นตอน' },
      { key: 'ความจุถังน้ำ', value: '5.8 ลิตร' },
      { key: 'อุณหภูมิน้ำ', value: '3 อุณหภูมิ (ร้อน/เย็น/ธรรมดา)' },
    ],
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  // Open Modal for Create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: '',
      category_id: categories[0]?.id || '',
      short_description: '',
      description: '',
      monthly_price: 690,
      price: 39900,
      sale_price: 36900,
      main_image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
      badge: 'สินค้าใหม่',
      is_featured: false,
      is_promotion: false,
      status: 'active',
      sort_order: products.length + 1,
      highlights: ['ฟรีบริการ Cody ล้างถังทุก 2 เดือน', 'ฟรีเปลี่ยนไส้กรองแท้ทุก 4 เดือน', 'ติดตั้งฟรีทั่วประเทศ'],
      specifications: [
        { key: 'ระบบการกรอง', value: 'RO Membrane' },
        { key: 'ความจุถัง', value: '5.0 ลิตร' },
      ],
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    const specsArray = product.specifications
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      : [];

    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku || '',
      category_id: product.category_id,
      short_description: product.short_description || '',
      description: product.description || '',
      monthly_price: product.monthly_price || 0,
      price: product.price || 0,
      sale_price: product.sale_price || 0,
      main_image: product.main_image,
      badge: product.badge || '',
      is_featured: product.is_featured,
      is_promotion: product.is_promotion,
      status: product.status,
      sort_order: product.sort_order || 1,
      highlights: product.highlights && product.highlights.length > 0 ? product.highlights : ['', '', ''],
      specifications: specsArray.length > 0 ? specsArray : [{ key: '', value: '' }],
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug && editingProduct ? prev.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `coway-${Date.now()}`
    }));
  };

  // Handle Image File Upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const publicUrl = await uploadImageToStorage(file);
      setFormData(prev => ({ ...prev, main_image: publicUrl }));
      showToast('อัปโหลดรูปภาพสินค้าสำเร็จ', 'success');
    } catch (err: any) {
      showToast(err?.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Submit (Save)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.main_image.trim()) {
      showToast('กรุณากรอกชื่อสินค้าและรูปภาพหลัก', 'error');
      return;
    }

    // Convert specs array back to Record
    const specsRecord: Record<string, string> = {};
    formData.specifications.forEach(item => {
      if (item.key.trim() && item.value.trim()) {
        specsRecord[item.key.trim()] = item.value.trim();
      }
    });

    // Filter valid highlights
    const validHighlights = formData.highlights.filter(h => h.trim().length > 0);

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || `product-${Date.now()}`,
      sku: formData.sku.trim(),
      category_id: formData.category_id || categories[0]?.id || 'cat-water',
      short_description: formData.short_description.trim(),
      description: formData.description.trim(),
      monthly_price: Number(formData.monthly_price),
      price: Number(formData.price),
      sale_price: formData.sale_price ? Number(formData.sale_price) : null,
      main_image: formData.main_image.trim(),
      status: formData.status,
      is_featured: formData.is_featured,
      is_promotion: formData.is_promotion,
      badge: formData.badge.trim() || undefined,
      sort_order: Number(formData.sort_order),
      specifications: specsRecord,
      highlights: validHighlights,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }

    setIsModalOpen(false);
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Actions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            จัดการรายการสินค้า (Products Management)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เพิ่ม แก้ไข ราคา ผ่อนรายเดือน รูปภาพ สเปก และเปิด/ปิดสถานะสินค้า
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มสินค้าใหม่</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาชื่อรุ่น รหัส หรือ SKU..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-slate-500 shrink-0">หมวดหมู่:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-sky-500"
          >
            <option value="all">ทุกหมวดหมู่ ({products.length})</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">รูปภาพ</th>
                <th className="py-3.5 px-4">ชื่อสินค้า / รหัส SKU</th>
                <th className="py-3.5 px-4">หมวดหมู่</th>
                <th className="py-3.5 px-4">ผ่อนรายเดือน</th>
                <th className="py-3.5 px-4">ราคาซื้อขาด</th>
                <th className="py-3.5 px-4">ป้ายกำกับ</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(prod => {
                const cat = categories.find(c => c.id === prod.category_id);

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Image */}
                    <td className="py-3 px-4">
                      <img
                        src={prod.main_image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                      />
                    </td>

                    {/* Name & SKU */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{prod.sku || prod.slug}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-600">{cat?.name || '-'}</span>
                    </td>

                    {/* Monthly Price */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-sky-600">
                        {prod.monthly_price ? `${prod.monthly_price.toLocaleString()}.-/ด.` : '-'}
                      </span>
                    </td>

                    {/* Outright Price */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700">
                        ฿{prod.price ? prod.price.toLocaleString() : '-'}
                      </span>
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4">
                      {prod.badge ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800">
                          {prod.badge}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleProductStatus(prod.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          prod.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="คลิกเพื่อสลับสถานะ"
                      >
                        {prod.status === 'active' ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>เปิดขาย</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-slate-400" />
                            <span>ปิดการขาย</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setIsDeletingId(prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="ลบสินค้า"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              ไม่พบรายการสินค้าที่ค้นหา
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">ยืนยันการลบสินค้า?</h3>
              <p className="text-xs text-slate-500 mt-1">
                เมื่อลบแล้ว ข้อมูลสินค้าและรูปภาพจะถูกนำออกจากระบบทันที
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={async () => {
                  await deleteProduct(isDeletingId);
                  setIsDeletingId(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                ยืนยันการลบ
              </button>
              <button
                onClick={() => setIsDeletingId(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingProduct ? `แก้ไขสินค้า: ${editingProduct.name}` : 'เพิ่มสินค้าใหม่ลงในระบบ'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  ข้อมูลจะถูกบันทึกและแสดงผลบนหน้าเว็บไซต์ทันที
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                  1. ข้อมูลพื้นฐานสินค้า
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ชื่อสินค้า <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น COWAY Villaem II (CHP-18AR)"
                      value={formData.name}
                      onChange={e => handleNameChange(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      หมวดหมู่ <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 bg-white"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      รหัสรุ่น / SKU
                    </label>
                    <input
                      type="text"
                      placeholder="CHP-18AR"
                      value={formData.sku}
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Slug URL
                    </label>
                    <input
                      type="text"
                      placeholder="coway-villaem-2"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ป้ายกำกับ (Badge)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ขายดีอันดับ 1 หรือ โปรโมชั่น"
                      value={formData.badge}
                      onChange={e => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Subscription */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                  2. การตั้งราคาและแพ็กเกจ (Pricing)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100">
                    <label className="block text-xs font-bold text-sky-900 mb-1">
                      ราคาผ่อน/เดือน (Subscription) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="790"
                      value={formData.monthly_price}
                      onChange={e => setFormData({ ...formData, monthly_price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 bg-white"
                    />
                    <span className="text-[10px] text-sky-700 mt-1 block">บาท / เดือน (รวมบริการ Cody)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ราคาซื้อขาด (Outright Price)
                    </label>
                    <input
                      type="number"
                      placeholder="49900"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ราคาพิเศษซื้อขาด (Sale Price)
                    </label>
                    <input
                      type="number"
                      placeholder="45900"
                      value={formData.sale_price || ''}
                      onChange={e => setFormData({ ...formData, sale_price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_promotion}
                      onChange={e => setFormData({ ...formData, is_promotion: e.target.checked })}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span>ตั้งเป็นสินค้าโปรโมชั่น</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span>แสดงในสินค้าแนะนำ</span>
                  </label>
                </div>
              </div>

              {/* Image Upload & Management */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                  3. จัดการรูปภาพสินค้า (Supabase Storage)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center relative">
                      {formData.main_image ? (
                        <img
                          src={formData.main_image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      )}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
                          กำลังอัปโหลด...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-8 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL รูปภาพหลัก
                      </label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.main_image}
                        onChange={e => setFormData({ ...formData, main_image: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        หรืออัปโหลดรูปภาพใหม่ (JPG, PNG, WEBP &le; 5MB)
                      </label>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>เลือกไฟล์รูปภาพเพื่ออัปโหลด</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1">
                  4. รายละเอียดและจุดเด่น
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    คำอธิบายสั้น (Short Description)
                  </label>
                  <input
                    type="text"
                    placeholder="ถังน้ำใหญ่ 11.3 ลิตร น้ำ 4 อุณหภูมิ ร้อน-เย็น-ธรรมดา-อุ่น..."
                    value={formData.short_description}
                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    รายละเอียดแบบเต็ม (Full Description)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="ระบุรายละเอียด ฟังก์ชันการใช้งาน ระบบความปลอดภัย..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Highlights List */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    จุดเด่นสินค้า (Highlights แสดงเป็นเครื่องหมายถูก)
                  </label>
                  <div className="space-y-2">
                    {formData.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`จุดเด่นข้อที่ ${idx + 1}`}
                          value={item}
                          onChange={e => {
                            const newHighlights = [...formData.highlights];
                            newHighlights[idx] = e.target.value;
                            setFormData({ ...formData, highlights: newHighlights });
                          }}
                          className="flex-1 px-3.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                        />
                        {formData.highlights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                highlights: formData.highlights.filter((_, i) => i !== idx),
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, highlights: [...formData.highlights, ''] })}
                      className="text-xs font-bold text-sky-600 hover:underline pt-1"
                    >
                      + เพิ่มข้อความจุดเด่น
                    </button>
                  </div>
                </div>

                {/* Specifications Key-Value List */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ข้อมูลจำเพาะ (Specifications)
                  </label>
                  <div className="space-y-2">
                    {formData.specifications.map((spec, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <input
                          type="text"
                          placeholder="เช่น ความจุถังน้ำ"
                          value={spec.key}
                          onChange={e => {
                            const newSpecs = [...formData.specifications];
                            newSpecs[idx].key = e.target.value;
                            setFormData({ ...formData, specifications: newSpecs });
                          }}
                          className="col-span-5 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                        />
                        <input
                          type="text"
                          placeholder="เช่น 11.3 ลิตร"
                          value={spec.value}
                          onChange={e => {
                            const newSpecs = [...formData.specifications];
                            newSpecs[idx].value = e.target.value;
                            setFormData({ ...formData, specifications: newSpecs });
                          }}
                          className="col-span-6 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              specifications: formData.specifications.filter((_, i) => i !== idx),
                            });
                          }}
                          className="col-span-1 p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          specifications: [...formData.specifications, { key: '', value: '' }],
                        })
                      }
                      className="text-xs font-bold text-sky-600 hover:underline pt-1"
                    >
                      + เพิ่มข้อมูลจำเพาะ (Specification)
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all active:scale-95"
                >
                  {editingProduct ? 'บันทึกการแก้ไข' : 'บันทึกสินค้าใหม่'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
