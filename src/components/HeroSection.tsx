import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, ShieldCheck, HeartHandshake, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCloudinaryUrl } from '../services/cloudinary.js';

interface HeroSlide {
  id: string;
  name: string;
  category: string;
  price: number;
  slug: string;
  image: string;
  fallbackImage: string;
  highlight: string;
  zari: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'paithani',
    name: 'Royal Yeola Paithani Saree',
    category: 'Paithani Silk',
    price: 8499,
    slug: 'royal-yeola-paithani-saree',
    image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg',
    fallbackImage: 'https://sarees-website-two.vercel.app/images/sarees/purple_paithani.jpg',
    highlight: 'Royal Aubergine Purple with Handwoven Mor Pallu',
    zari: 'Tested 24K Gold Electroplated Zari'
  },
  {
    id: 'kanjivaram',
    name: 'Kanchipuram Bridal Silk Saree',
    category: 'Bridal Kanjivaram',
    price: 12999,
    slug: 'kanchipuram-bridal-silk-saree',
    image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg',
    fallbackImage: 'https://sarees-website-two.vercel.app/images/sarees/red_kanjivaram.jpg',
    highlight: 'Auspicious Crimson Red with Mayil Temple Borders',
    zari: 'Heavy Pure Brocade Gold Weft'
  },
  {
    id: 'banarasi',
    name: 'Varanasi Katan Silk Banarasi',
    category: 'Banarasi Brocade',
    price: 9999,
    slug: 'varanasi-katan-silk-banarasi-saree',
    image: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/green_banarasi.jpg',
    fallbackImage: 'https://sarees-website-two.vercel.app/images/sarees/green_banarasi.jpg',
    highlight: 'Emerald Forest Green with Jaal Mughal Floral Butis',
    zari: 'Intricate Kadwa Gold Weave'
  }
];

export const HeroSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSlide = HERO_SLIDES[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F1E5]/70 via-[#FFFDF8] to-[#FFFDF8] py-8 lg:py-12 border-b border-[#2C1B16]/10">
      {/* Decorative ambient subtle motifs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#5A1022]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Editorial Zone (Headline, Subtext, and Action Buttons) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 text-left order-1">
            {/* Editorial Kicker */}
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-[#5A1022] bg-[#5A1022]/10 border border-[#5A1022]/15 px-3 py-1.5 rounded-full">
                <Sparkles size={13} className="text-[#C9A227]" />
                <span>Certified Handloom & Silk Mark Organization</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#2C1B16] font-normal leading-[1.12] tracking-tight">
              Elegance Woven in <br />
              <span className="italic font-serif text-[#5A1022]">Every Single Thread</span>
            </h1>

            {/* Narrative Subtext */}
            <p className="text-sm sm:text-base text-[#2C1B16]/80 max-w-xl font-light leading-relaxed">
              Discover timeless sarees crafted with generational tradition and exquisite detail.
              From authentic Yeola Paithani to regal Kanchipuram mulberry silks, each drape is a certified heirloom woven with pure devotion.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/sarees"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#5A1022] hover:bg-[#460b19] text-[#FFFDF8] text-xs font-semibold uppercase tracking-widest rounded shadow-sm hover:shadow transition-all"
              >
                <span>Explore All Sarees</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to={`/sarees/${activeSlide.slug}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-[#2C1B16]/20 hover:border-[#5A1022] text-[#2C1B16] hover:text-[#5A1022] text-xs font-semibold uppercase tracking-widest rounded transition-colors shadow-xs"
              >
                <Eye size={14} />
                <span>View {activeSlide.category}</span>
              </Link>
            </div>

            {/* Interactive Flagship Looms Swatches */}
            <div className="pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#2C1B16]/60 mb-2">
                Featured Flagship Looms:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all border ${
                      activeIdx === idx
                        ? 'bg-[#5A1022] text-white border-[#5A1022] shadow-sm font-semibold'
                        : 'bg-white text-[#2C1B16]/80 hover:text-[#5A1022] border-[#2C1B16]/15 hover:bg-[#FDF9F2]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activeIdx === idx ? 'bg-[#C9A227]' : 'bg-[#C9A227]/60'
                      }`}
                    />
                    <span className="font-serif">{slide.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Authenticity Trust Credentials */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#2C1B16]/10 text-xs text-[#2C1B16]/75">
              <div className="flex items-center gap-2">
                <Award size={17} className="text-[#C9A227] shrink-0" />
                <span className="text-[11px] sm:text-xs">100% Pure Silk Mark</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#C9A227] shrink-0" />
                <span className="text-[11px] sm:text-xs">Yeola Artisan Looms</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake size={17} className="text-[#C9A227] shrink-0" />
                <span className="text-[11px] sm:text-xs">10,000+ Happy Brides</span>
              </div>
            </div>
          </div>

          {/* Right Visual Anchor - Saree Showcase Image Appears After Text */}
          <div className="lg:col-span-5 order-2 flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-none">
              {/* Outer Refined Gold Frame Container */}
              <div className="p-2 sm:p-2.5 rounded-sm bg-gradient-to-b from-[#C9A227]/25 via-[#C9A227]/10 to-[#5A1022]/15 border border-[#C9A227]/40 shadow-xl">
                <div className="relative rounded-sm overflow-hidden bg-[#FAF7F0] border border-[#2C1B16]/10 group">
                  {/* Saree Image Container with Balanced Height */}
                  <div className="relative w-full h-[380px] sm:h-[420px] lg:h-[450px] overflow-hidden bg-[#F8F1E5]">
                    <img
                      key={activeSlide.image}
                      src={getCloudinaryUrl(activeSlide.image, { width: 900, height: 1100, crop: 'fill' })}
                      alt={activeSlide.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = activeSlide.fallbackImage;
                      }}
                    />

                    {/* Certified Silk Mark Floating Ribbon */}
                    <div className="absolute top-3 left-3 bg-[#5A1022]/90 backdrop-blur-xs text-[#FFFDF8] px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-[#C9A227]/40">
                      <Sparkles size={12} className="text-[#C9A227]" />
                      <span>Silk Mark Certified</span>
                    </div>

                    {/* Slider Navigation Arrows */}
                    <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handlePrev}
                        className="p-2 rounded-full bg-white/90 text-[#2C1B16] hover:bg-[#5A1022] hover:text-white transition-colors pointer-events-auto shadow-md"
                        aria-label="Previous saree"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="p-2 rounded-full bg-white/90 text-[#2C1B16] hover:bg-[#5A1022] hover:text-white transition-colors pointer-events-auto shadow-md"
                        aria-label="Next saree"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Integrated Compact Showcase Strip */}
                  <div className="p-3.5 sm:p-4 bg-[#FFFDF8] border-t border-[#2C1B16]/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-[#5A1022] uppercase tracking-wider">
                        ✦ {activeSlide.category}
                      </span>
                      <span className="text-[11px] text-[#2C1B16]/65 font-medium truncate max-w-[200px]">
                        {activeSlide.zari}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-[#2C1B16] leading-tight">
                          {activeSlide.name}
                        </h3>
                        <span className="font-serif text-lg font-bold text-[#5A1022]">
                          ₹{activeSlide.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <Link
                        to={`/sarees/${activeSlide.slug}`}
                        className="px-3.5 py-1.5 bg-[#5A1022] hover:bg-[#460b19] text-[#FFFDF8] rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <span>View Saree</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
