import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../server/types.js';
import { getCloudinaryUrl } from '../services/cloudinary.js';

interface CategorySectionProps {
  categories: Category[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <section className="py-16 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5A1022] mb-1.5">
            Curated Looms
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1B16] font-normal">
            Shop by Saree Collection
          </h2>
          <div className="w-16 h-0.5 bg-[#C9A227] mx-auto mt-3 mb-3" />
          <p className="text-sm text-[#2C1B16]/70 font-light">
            Explore authentic handlooms, pure mulberry silks, and delicate gossamer weaves curated for bridal ceremonies and grand celebrations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/sarees?category=${encodeURIComponent(cat.slug)}`}
              className="group flex flex-col items-center text-center"
            >
              {/* Circular / Arch Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-[#F8F1E5] border border-[#2C1B16]/10 group-hover:border-[#C9A227] transition-all duration-300 shadow-xs group-hover:shadow-md">
                <img
                  src={getCloudinaryUrl(cat.image?.url, { width: 400, height: 500, crop: 'fill' })}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end justify-center p-3">
                  <span className="text-[11px] font-semibold text-[#FFFDF8] uppercase tracking-wider bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded">
                    {cat.itemCount || 18}+ Designs
                  </span>
                </div>
              </div>

              {/* Title & Arrow */}
              <div className="mt-3">
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#2C1B16] group-hover:text-[#5A1022] transition-colors flex items-center justify-center gap-1">
                  <span>{cat.name}</span>
                </h3>
                <span className="text-xs text-[#5A1022] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 font-medium mt-0.5">
                  Explore <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
