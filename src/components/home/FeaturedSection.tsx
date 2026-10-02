import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Product } from '../../types/database';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedSectionProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, payload?: any) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  onSelectProduct,
  onNavigate,
}) => {
  const { products, categories, setActiveCategorySlug } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'water' | 'air' | 'promo' | 'featured'>('all');

  const filteredProducts = products.filter(p => {
    if (p.status !== 'active') return false;
    if (activeTab === 'promo') return p.is_promotion;
    if (activeTab === 'featured') return p.is_featured;
    if (activeTab === 'water') {
      const waterCat = categories.find(c => c.slug === 'water-purifiers');
      return p.category_id === waterCat?.id;
    }
    if (activeTab === 'air') {
      const airCat = categories.find(c => c.slug === 'air-purifiers');
      return p.category_id === airCat?.id;
    }
    return true;
  });

  return (
    <section id="products" className="py-14 sm:py-20 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>COWAY BEST SELECTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              สินค้ายอดนิยม & โปรโมชั่นประจำเดือน
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              สมัครสมาชิกวันนี้ รับฟรีค่าติดตั้ง 2,000.- พร้อมบริการ Cody Heart Service ดูแลตลอดอายุสัญญา
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none p-1 bg-white rounded-xl border border-slate-200/80 shadow-sm shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setActiveTab('water')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'water'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              เครื่องกรองน้ำ
            </button>
            <button
              onClick={() => setActiveTab('air')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'air'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              เครื่องฟอกอากาศ
            </button>
            <button
              onClick={() => setActiveTab('promo')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'promo'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              โปรโมชั่นเด่น
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'featured'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              สินค้าแนะนำ
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
            <p className="text-sm font-semibold text-slate-700">ไม่มีสินค้าในหมวดหมู่นี้ขณะนี้</p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-3 text-xs font-bold text-sky-600 hover:underline"
            >
              ดูสินค้าทั้งหมด
            </button>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              setActiveCategorySlug('all');
              onNavigate('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <span>เปิดดูแคตตาล็อกสินค้าทั้งหมด ({products.length} รายการ)</span>
            <ArrowRight className="w-4 h-4 text-sky-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
