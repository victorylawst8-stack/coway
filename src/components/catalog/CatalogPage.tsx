import React, { useState, useMemo } from 'react';
import { useStore } from '../../lib/store';
import { Product } from '../../types/database';
import { ProductCard } from '../home/ProductCard';
import { Search, Filter, SlidersHorizontal, Sparkles, X, ChevronRight, Check } from 'lucide-react';

interface CatalogPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectProduct, onNavigate }) => {
  const {
    products,
    categories,
    searchQuery,
    setSearchQuery,
    activeCategorySlug,
    setActiveCategorySlug,
    sortBy,
    setSortBy,
  } = useStore();

  const [filterPromotionOnly, setFilterPromotionOnly] = useState(false);
  const [filterFeaturedOnly, setFilterFeaturedOnly] = useState(false);
  const [maxMonthlyPrice, setMaxMonthlyPrice] = useState<number>(2000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Active check
        if (product.status !== 'active') return false;

        // Category filter
        if (activeCategorySlug !== 'all') {
          const category = categories.find(c => c.slug === activeCategorySlug);
          if (category && product.category_id !== category.id) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchSku = product.sku?.toLowerCase().includes(q);
          const matchDesc = product.short_description?.toLowerCase().includes(q) || product.description?.toLowerCase().includes(q);
          const matchBadge = product.badge?.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchDesc && !matchBadge) return false;
        }

        // Promotion only
        if (filterPromotionOnly && !product.is_promotion) return false;

        // Featured only
        if (filterFeaturedOnly && !product.is_featured) return false;

        // Monthly price ceiling
        if (product.monthly_price && product.monthly_price > maxMonthlyPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.monthly_price || 0) - (b.monthly_price || 0);
        if (sortBy === 'price-desc') return (b.monthly_price || 0) - (a.monthly_price || 0);
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'bestseller') {
          const aBest = a.badge?.includes('ขายดี') ? 1 : 0;
          const bBest = b.badge?.includes('ขายดี') ? 1 : 0;
          return bBest - aBest;
        }
        // Default sort_order
        return a.sort_order - b.sort_order;
      });
  }, [
    products,
    categories,
    activeCategorySlug,
    searchQuery,
    filterPromotionOnly,
    filterFeaturedOnly,
    maxMonthlyPrice,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategorySlug('all');
    setFilterPromotionOnly(false);
    setFilterFeaturedOnly(false);
    setMaxMonthlyPrice(2000);
    setSortBy('featured');
  };

  const activeCategory = categories.find(c => c.slug === activeCategorySlug);

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-sky-600 transition-colors">
            หน้าแรก
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">
            {activeCategory ? activeCategory.name : 'สินค้าทั้งหมด'}
          </span>
        </div>

        {/* Page Title & Search Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {activeCategory ? activeCategory.name : 'แคตตาล็อกสินค้า COWAY ทั้งหมด'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {activeCategory
                  ? activeCategory.description
                  : 'เลือกชมเครื่องกรองน้ำ เครื่องฟอกอากาศ และที่นอน พร้อมบริการ Cody Heart Service ครบวงจร'}
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="ค้นหาชื่อรุ่น รหัส หรือคุณสมบัติ..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-sky-600" />
                <span>ตัวกรองสินค้า</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-[11px] text-sky-600 hover:underline font-semibold"
              >
                ล้างทั้งหมด
              </button>
            </div>

            {/* Categories Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                หมวดหมู่
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveCategorySlug('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    activeCategorySlug === 'all'
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>ทุกหมวดหมู่</span>
                  <span className="text-[10px] text-slate-400">({products.filter(p => p.status === 'active').length})</span>
                </button>

                {categories.map(cat => {
                  const count = products.filter(p => p.category_id === cat.id && p.status === 'active').length;
                  const isSelected = activeCategorySlug === cat.slug;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategorySlug(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-sky-50 text-sky-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Badges & Special Filters */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                เงื่อนไขพิเศษ
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterPromotionOnly}
                  onChange={e => setFilterPromotionOnly(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span>เฉพาะสินค้าโปรโมชั่น</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filterFeaturedOnly}
                  onChange={e => setFilterFeaturedOnly(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span>เฉพาะสินค้าแนะนำ</span>
              </label>
            </div>

            {/* Monthly Budget Range */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider">งบประมาณรายเดือน</span>
                <span className="text-sky-600 font-bold">ไม่เกิน {maxMonthlyPrice.toLocaleString()}.-</span>
              </div>
              <input
                type="range"
                min="400"
                max="2000"
                step="50"
                value={maxMonthlyPrice}
                onChange={e => setMaxMonthlyPrice(Number(e.target.value))}
                className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>400.-</span>
                <span>2,000.-/ด.</span>
              </div>
            </div>
          </div>

          {/* Main Products Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Filter & Sort Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                พบสินค้าทั้งหมด <span className="font-bold text-slate-900">{filteredProducts.length}</span> รายการ
                {searchQuery && (
                  <span>
                    {' '}สำหรับคำค้นหา &quot;<span className="text-sky-600 font-semibold">{searchQuery}</span>&quot;
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>ตัวกรอง</span>
                </button>

                {/* Sort Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 shrink-0">เรียงตาม:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500"
                  >
                    <option value="featured">สินค้าแนะนำ / ลำดับแนะนำ</option>
                    <option value="price-asc">ราคาผ่อน: ต่ำ → สูง</option>
                    <option value="price-desc">ราคาผ่อน: สูง → ต่ำ</option>
                    <option value="bestseller">สินค้าขายดีอันดับ 1</option>
                    <option value="newest">สินค้ามาใหม่ล่าสุด</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilterOpen && (
              <div className="lg:hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">ตัวกรองหมวดหมู่</span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-xs text-sky-600 font-semibold"
                  >
                    เสร็จสิ้น
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveCategorySlug('all')}
                    className={`p-2 rounded-lg text-xs font-medium text-left ${
                      activeCategorySlug === 'all' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ทุกหมวดหมู่
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategorySlug(cat.slug)}
                      className={`p-2 rounded-lg text-xs font-medium text-left truncate ${
                        activeCategorySlug === cat.slug ? 'bg-sky-600 text-white font-bold' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูรายการสินค้าทั้งหมดของ COWAY
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-5 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
