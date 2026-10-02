import React from 'react';
import { useStore } from '../../lib/store';
import { Droplets, Wind, BedDouble, Sparkles, ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onNavigate }) => {
  const { categories, products, setActiveCategorySlug } = useStore();

  const activeCategories = categories.filter(c => c.status === 'active');

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Wind':
        return <Wind className="w-5 h-5 text-sky-500" />;
      case 'BedDouble':
        return <BedDouble className="w-5 h-5 text-indigo-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Droplets':
      default:
        return <Droplets className="w-5 h-5 text-sky-500" />;
    }
  };

  const handleCategoryClick = (slug: string) => {
    setActiveCategorySlug(slug);
    onNavigate('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-sky-600 tracking-wider uppercase">
              CATEGORIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              หมวดหมู่ผลิตภัณฑ์ COWAY
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              เลือกชมสินค้าตามหมวดหมู่ พร้อมบริการดูแลสุขภาพครอบคลุมทุกมุมบ้าน
            </p>
          </div>

          <button
            onClick={() => {
              setActiveCategorySlug('all');
              onNavigate('catalog');
            }}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 shrink-0 group"
          >
            <span>ดูสินค้าทั้งหมด</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {activeCategories.map(cat => {
            const count = products.filter(p => p.category_id === cat.id && p.status === 'active').length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group text-left p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-sky-50 shadow-sm border border-slate-100 flex items-center justify-center mb-4 transition-colors">
                    {getCategoryIcon(cat.icon)}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-sky-600 transition-colors border-t border-slate-200/60 mt-4">
                  <span>{count} รายการ</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
