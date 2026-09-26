import React from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

export interface FilterState {
  category: string;
  fabric: string;
  occasion: string;
  color: string;
  zariType: string;
  minPrice: number;
  maxPrice: number;
  sort: string;
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  categories: Array<{ id: string; name: string; slug: string; itemCount?: number }>;
  totalCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  categories,
  totalCount
}) => {
  const fabrics = ['All Fabrics', 'Pure Mulberry Silk', 'Katan Silk', 'Silk Cotton', 'Organza'];
  const occasions = [
    'All Occasions',
    'Wedding',
    'Reception',
    'Festival',
    'Traditional',
    'Party',
    'Casual',
    'Office'
  ];
  const zariTypes = ['All Zari Types', 'Pure Tested', 'Half-Fine', 'Antique Gold', 'Tested Muga'];

  const colorPalette = [
    { label: 'All', value: 'all', hex: 'transparent' },
    { label: 'Purple', value: 'Purple', hex: '#6A1B9A' },
    { label: 'Red', value: 'Red', hex: '#B71C1C' },
    { label: 'Maroon', value: 'Maroon', hex: '#5A1022' },
    { label: 'Green', value: 'Green', hex: '#1B5E20' },
    { label: 'Blue', value: 'Blue', hex: '#1565C0' },
    { label: 'Yellow', value: 'Yellow', hex: '#FBC02D' },
    { label: 'Pink', value: 'Pink', hex: '#F48FB1' }
  ];

  const sortOptions = [
    { label: 'Featured Heirloom', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Customer Rating', value: 'rating' },
    { label: 'Newest Additions', value: 'newest' }
  ];

  return (
    <div className="bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm p-5 space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2C1B16]/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#5A1022]" />
          <h3 className="font-serif text-lg font-medium text-[#2C1B16]">Filters</h3>
          <span className="text-xs text-[#2C1B16]/50">({totalCount})</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#5A1022] hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-[#2C1B16]/70 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          className="w-full bg-[#FDF9F2] border border-[#2C1B16]/20 rounded p-2 text-xs text-[#2C1B16] focus:outline-none focus:border-[#5A1022]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category List */}
      <div>
        <label className="block text-xs font-semibold text-[#2C1B16]/70 uppercase tracking-wider mb-2.5">
          Category
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => onChange({ ...filters, category: 'all' })}
            className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between ${
              filters.category === 'all'
                ? 'bg-[#5A1022] text-[#FFFDF8] font-medium'
                : 'text-[#2C1B16]/80 hover:bg-[#F8F1E5]'
            }`}
          >
            <span>All Sarees</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, category: cat.slug })}
              className={`w-full text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between ${
                filters.category.toLowerCase() === cat.slug.toLowerCase()
                  ? 'bg-[#5A1022] text-[#FFFDF8] font-medium'
                  : 'text-[#2C1B16]/80 hover:bg-[#F8F1E5]'
              }`}
            >
              <span>{cat.name}</span>
              {cat.itemCount !== undefined && (
                <span className="text-[10px] opacity-75">{cat.itemCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric */}
      <div>
        <label className="block text-xs font-semibold text-[#2C1B16]/70 uppercase tracking-wider mb-2">
          Fabric
        </label>
        <select
          value={filters.fabric}
          onChange={(e) => onChange({ ...filters, fabric: e.target.value })}
          className="w-full bg-[#FDF9F2] border border-[#2C1B16]/20 rounded p-2 text-xs text-[#2C1B16] focus:outline-none focus:border-[#5A1022]"
        >
          {fabrics.map((f) => (
            <option key={f} value={f === 'All Fabrics' ? 'all' : f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Saree Shade / Color Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#2C1B16]/70 uppercase tracking-wider">
            Saree Shade / Color
          </label>
          {filters.color !== 'all' && (
            <button
              onClick={() => onChange({ ...filters, color: 'all' })}
              className="text-[10px] text-[#5A1022] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {colorPalette.map((col) => {
            const isSelected = filters.color.toLowerCase() === col.value.toLowerCase();
            return (
              <button
                key={col.value}
                onClick={() => onChange({ ...filters, color: col.value })}
                title={`Filter by ${col.label}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all border ${
                  isSelected
                    ? 'border-[#5A1022] bg-[#5A1022] text-[#FFFDF8] font-semibold shadow-xs'
                    : 'border-[#2C1B16]/20 bg-[#FDF9F2] text-[#2C1B16]/80 hover:border-[#5A1022]/40'
                }`}
              >
                {col.hex !== 'transparent' ? (
                  <span
                    className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                ) : null}
                <span>{col.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Zari Type */}
      <div>
        <label className="block text-xs font-semibold text-[#2C1B16]/70 uppercase tracking-wider mb-2">
          Zari Authenticity
        </label>
        <select
          value={filters.zariType}
          onChange={(e) => onChange({ ...filters, zariType: e.target.value })}
          className="w-full bg-[#FDF9F2] border border-[#2C1B16]/20 rounded p-2 text-xs text-[#2C1B16] focus:outline-none focus:border-[#5A1022]"
        >
          {zariTypes.map((z) => (
            <option key={z} value={z === 'All Zari Types' ? 'all' : z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      {/* Occasion */}
      <div>
        <label className="block text-xs font-semibold text-[#2C1B16]/70 uppercase tracking-wider mb-2">
          Occasion
        </label>
        <select
          value={filters.occasion}
          onChange={(e) => onChange({ ...filters, occasion: e.target.value })}
          className="w-full bg-[#FDF9F2] border border-[#2C1B16]/20 rounded p-2 text-xs text-[#2C1B16] focus:outline-none focus:border-[#5A1022]"
        >
          {occasions.map((occ) => (
            <option key={occ} value={occ === 'All Occasions' ? 'all' : occ}>
              {occ}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#2C1B16]/70 uppercase tracking-wider">
            Price Range
          </label>
          <span className="text-xs text-[#5A1022] font-semibold">
            Up to ₹{filters.maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="3000"
          max="20000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-[#5A1022] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#2C1B16]/50 mt-1">
          <span>₹3,000</span>
          <span>₹20,000+</span>
        </div>
      </div>
    </div>
  );
};
