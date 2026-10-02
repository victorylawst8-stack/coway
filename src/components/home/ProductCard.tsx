import React from 'react';
import { Product } from '../../types/database';
import { useStore } from '../../lib/store';
import { Check, Sparkles, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { openInquiryModal, categories } = useStore();

  const category = categories.find(c => c.id === product.category_id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image & Badges */}
      <div
        onClick={() => onSelect(product)}
        className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer"
      >
        <img
          src={product.main_image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-sky-600 text-white shadow-md shadow-sky-600/20">
              {product.badge}
            </span>
          )}
          {product.is_promotion && !product.badge && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-amber-500 text-white shadow-md">
              โปรโมชั่นพิเศษ
            </span>
          )}
        </div>

        {/* SKU indicator */}
        {product.sku && (
          <span className="absolute top-2.5 right-2.5 text-[10px] font-mono bg-white/80 backdrop-blur-sm text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/50">
            {product.sku}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category tag */}
          <div className="text-[11px] font-semibold text-sky-600 uppercase tracking-wide mb-1">
            {category?.name || 'COWAY PRODUCT'}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelect(product)}
            className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed min-h-[32px]">
            {product.short_description || product.description}
          </p>

          {/* Top highlight points */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="mt-3 space-y-1">
              {product.highlights.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & CTA Section */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          {/* Subscription Fee Box */}
          <div className="bg-sky-50/70 rounded-xl p-2.5 mb-3 border border-sky-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-sky-700 block leading-tight">
                ผ่อนรายเดือน (Cody Care ฟรี)
              </span>
              <div className="text-sm sm:text-base font-black text-sky-900 leading-tight">
                {product.monthly_price ? `${product.monthly_price.toLocaleString()}.-` : 'สอบถามโปร'}
                <span className="text-[11px] font-medium text-slate-500"> /ด.</span>
              </div>
            </div>
            {product.price > 0 && (
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block leading-tight">ราคาซื้อขาด</span>
                <span className="text-xs font-semibold text-slate-600">
                  ฿{product.sale_price ? product.sale_price.toLocaleString() : product.price.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(product)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <span>รายละเอียด</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => openInquiryModal(product)}
              className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1"
            >
              <span>รับโปรโมชั่น</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
