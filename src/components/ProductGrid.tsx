import React from 'react';
import { Product } from '../../server/types.js';
import { ProductCard } from './ProductCard.js';
import { Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onClearFilters?: () => void;
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  onClearFilters,
  title,
  subtitle
}) => {
  if (loading) {
    return (
      <div>
        {title && (
          <div className="mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1B16]">{title}</h2>
            {subtitle && <p className="text-sm text-[#2C1B16]/60 mt-1">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse flex flex-col bg-white border border-[#2C1B16]/10 rounded-sm">
              <div className="aspect-[3/4] bg-[#F8F1E5]" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-1/3 bg-[#F8F1E5] rounded" />
                <div className="h-5 w-3/4 bg-[#F8F1E5] rounded" />
                <div className="h-4 w-1/2 bg-[#F8F1E5] rounded pt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-[#FDF9F2] border border-[#2C1B16]/10 rounded-sm p-8">
        <Sparkles size={32} className="mx-auto text-[#C9A227] mb-3" />
        <h3 className="font-serif text-xl font-medium text-[#2C1B16]">
          No Sarees Found
        </h3>
        <p className="text-sm text-[#2C1B16]/60 max-w-md mx-auto mt-1 mb-5">
          We couldn't find any sarees matching your selected filters. Try choosing a different fabric, color, or price range.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-5 py-2.5 bg-[#5A1022] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#460b19] transition-colors"
          >
            Reset All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1B16]">{title}</h2>
          {subtitle && <p className="text-sm text-[#2C1B16]/60 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
