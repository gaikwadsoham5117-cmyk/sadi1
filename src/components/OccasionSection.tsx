import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getCloudinaryUrl } from '../services/cloudinary.js';

interface OccasionCard {
  title: string;
  query: string;
  subtitle: string;
  image: string;
  tag: string;
}

export const OccasionSection: React.FC = () => {
  const occasions: OccasionCard[] = [
    {
      title: 'Grand Weddings',
      query: 'Wedding',
      subtitle: 'Muhurtham & Bridal Kanjivaram',
      image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405341/virasat_sarees/maroon_bridal.jpg',
      tag: 'Bridal'
    },
    {
      title: 'Reception & Sangeet',
      query: 'Reception',
      subtitle: 'Shimmering Brocades & Cocktails',
      image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg',
      tag: 'Glamour'
    },
    {
      title: 'Festivals & Poojas',
      query: 'Festival',
      subtitle: 'Diwali, Dussehra & Haldi Celebrations',
      image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405343/virasat_sarees/yellow_festive.jpg',
      tag: 'Auspicious'
    },
    {
      title: 'Traditional Heirloom',
      query: 'Traditional',
      subtitle: 'Pure Yeola Paithani & Tested Zari',
      image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg',
      tag: 'Timeless'
    },
    {
      title: 'Party & Evening Soirée',
      query: 'Party',
      subtitle: 'Modern Organza & Royal Blue Katan',
      image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405340/virasat_sarees/blue_silk.jpg',
      tag: 'Contemporary'
    },
    {
      title: 'Casual Handloom',
      query: 'Casual',
      subtitle: 'Breathable Chanderi & Soft Silks',
      image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405342/virasat_sarees/pink_designer.jpg',
      tag: 'Comfort'
    },
    {
      title: 'Office & Formal Weaves',
      query: 'Office',
      subtitle: 'Understated Elegance & Pure Cotton',
      image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/green_banarasi.jpg',
      tag: 'Formal'
    }
  ];

  return (
    <section className="py-16 bg-[#FDF9F2] border-t border-[#2C1B16]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#5A1022] mb-1">
              <Sparkles size={13} className="text-[#C9A227]" />
              <span>Curated by Celebration</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1B16] font-normal">
              Shop by Sacred Occasion
            </h2>
            <div className="w-16 h-0.5 bg-[#C9A227] mt-3" />
          </div>
          <Link
            to="/sarees"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1022] hover:text-[#460b19] uppercase tracking-wider group"
          >
            <span>Explore All Drapes</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Occasions Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {occasions.map((occ) => (
            <Link
              key={occ.title}
              to={`/sarees?occasion=${encodeURIComponent(occ.query)}`}
              className="group relative rounded-sm overflow-hidden border border-[#2C1B16]/15 hover:border-[#C9A227] bg-[#FFFDF8] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F8F1E5]">
                <img
                  src={getCloudinaryUrl(occ.image, { width: 450, height: 550, crop: 'fill' })}
                  alt={occ.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-bold text-[#FFFDF8] bg-[#5A1022] px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    {occ.tag}
                  </span>
                </div>

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-[#FFFDF8]">
                  <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight group-hover:text-amber-200 transition-colors">
                    {occ.title}
                  </h3>
                  <p className="text-[11px] text-white/80 font-light mt-0.5 truncate">
                    {occ.subtitle}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#C9A227] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Sarees</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
