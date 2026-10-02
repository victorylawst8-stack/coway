import React, { useState } from 'react';
import { Product } from '../../types/database';
import { useStore } from '../../lib/store';
import { ProductCard } from '../home/ProductCard';
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Bot,
  Sparkles,
  Share2,
  Calendar,
  Layers,
  HeartHandshake,
  Check
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenAiChatWithProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onSelectProduct,
  onOpenAiChatWithProduct,
}) => {
  const { products, categories, settings, openInquiryModal, showToast } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<'subscription' | 'outright'>('subscription');
  const [activeImage, setActiveImage] = useState(product.main_image);

  const category = categories.find(c => c.id === product.category_id);

  // Gallery images (main image + any mock alternates)
  const images = [
    product.main_image,
    'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
  ];

  // Related products from same category
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.status === 'active' && p.category_id === product.category_id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.short_description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('คัดลอกลิงก์สินค้าเรียบร้อยแล้ว', 'success');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={onBack} className="hover:text-sky-600 transition-colors">
            หน้าแรก
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="hover:text-sky-600 cursor-pointer" onClick={onBack}>
            {category?.name || 'สินค้า'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Overview Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Preview Container */}
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner group">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge Overlay */}
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xl bg-sky-600 text-white shadow-md">
                    {product.badge}
                  </span>
                )}

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-sky-600 shadow-md transition-all active:scale-95"
                  title="แชร์สินค้านี้"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img
                        ? 'border-sky-600 shadow-md scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Details & Pricing */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                    {category?.name || 'COWAY PRODUCT'}
                  </span>
                  {product.sku && (
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60">
                      รหัสรุ่น: {product.sku}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  {product.short_description}
                </p>
              </div>

              {/* Subscription vs Outright Plan Selector Box */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    เลือกรูปแบบการเป็นเจ้าของ
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ฟรีค่าติดตั้ง 2,000.-
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Subscription Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('subscription')}
                    className={`p-4 rounded-xl text-left border-2 transition-all relative ${
                      selectedPlan === 'subscription'
                        ? 'border-sky-600 bg-white shadow-md'
                        : 'border-slate-200 bg-white/50 hover:bg-white text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-sky-900">ระบบสมาชิกรายเดือน</span>
                      {selectedPlan === 'subscription' && (
                        <Check className="w-4 h-4 text-sky-600" />
                      )}
                    </div>
                    <div className="text-xl font-black text-sky-600">
                      {product.monthly_price ? `${product.monthly_price.toLocaleString()}.-` : 'สอบถาม'}
                      <span className="text-xs font-normal text-slate-500"> /เดือน</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      รวมบริการ Cody ล้างถังทุก 2 ด. + ไส้กรองทุก 4 ด. ฟรี
                    </p>
                  </button>

                  {/* Outright Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('outright')}
                    className={`p-4 rounded-xl text-left border-2 transition-all relative ${
                      selectedPlan === 'outright'
                        ? 'border-sky-600 bg-white shadow-md'
                        : 'border-slate-200 bg-white/50 hover:bg-white text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">ซื้อขาด (Outright)</span>
                      {selectedPlan === 'outright' && (
                        <Check className="w-4 h-4 text-sky-600" />
                      )}
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      ฿{product.sale_price ? product.sale_price.toLocaleString() : product.price.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      เครื่องใหม่มือหนึ่ง พร้อมประกันตัวเครื่อง 1 ปี
                    </p>
                  </button>
                </div>
              </div>

              {/* Highlights Checklist */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    จุดเด่นและความคุ้มค่า
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {product.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Contact Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                {/* Primary CTA: Book / Inquire */}
                <button
                  onClick={() => openInquiryModal(product)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>สมัครสมาชิกหรือขอรับสิทธิ์โปรโมชั่นรุ่นนี้</span>
                </button>

                {/* Secondary Quick Contact Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <a
                    href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
                    className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-sky-600" />
                    <span>โทรสอบถาม</span>
                  </a>

                  <a
                    href={settings.line_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>แอด LINE รับโปร</span>
                  </a>

                  <button
                    onClick={() => onOpenAiChatWithProduct(product)}
                    className="py-3 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Bot className="w-4 h-4 text-sky-600" />
                    <span>ถามผู้ช่วย AI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Detailed Info Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Detailed Description */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              รายละเอียดผลิตภัณฑ์
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-4">
              {product.description}
            </div>

            {/* Cody Care Commitment Box */}
            <div className="mt-8 p-5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-4">
              <HeartHandshake className="w-6 h-6 text-sky-600 shrink-0 mt-1" />
              <div className="text-xs space-y-1">
                <h5 className="font-bold text-sky-900">สิทธิพิเศษบริการ Cody Heart Service สำหรับรุ่นนี้</h5>
                <p className="text-slate-600 leading-relaxed">
                  เมื่อสมัครแพ็กเกจ Coway Subscription จะได้รับสิทธิ์ตรวจเช็ค ล้างทำความสะอาดถังน้ำทุก 2 เดือน และเปลี่ยนไส้กรองแท้ฟรีทุก 4 เดือนตลอดสัญญา พร้อมบริการซ่อมฟรีโดยไม่มีค่าใช้จ่ายแอบแฝง
                </p>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              ข้อมูลจำเพาะ (Specifications)
            </h3>

            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <div className="divide-y divide-slate-100">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="py-2.5 flex items-start justify-between text-xs gap-3">
                    <span className="font-medium text-slate-500 shrink-0">{key}</span>
                    <span className="font-semibold text-slate-900 text-right">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">ไม่มีข้อมูลจำเพาะเพิ่มเติม</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">สินค้าอื่นในหมวดเดียวกัน</h3>
                <p className="text-xs text-slate-500">เปรียบเทียบรุ่นใกล้เคียงเพื่อเลือกสิ่งที่ตรงใจที่สุด</p>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-semibold text-sky-600 hover:underline"
              >
                ดูทั้งหมดในหมวดหมู่นี้
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map(rel => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
