import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/HeroSection.js';
import { CategorySection } from '../components/CategorySection.js';
import { OccasionSection } from '../components/OccasionSection.js';
import { ProductGrid } from '../components/ProductGrid.js';
import { ReviewSection } from '../components/ReviewSection.js';
import { Newsletter } from '../components/Newsletter.js';
import { api } from '../services/api.js';
import { Product, Category } from '../../server/types.js';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import { getCloudinaryUrl } from '../services/cloudinary.js';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts()
        ]);

        if (catRes.success) {
          setCategories(catRes.data.categories);
        }

        if (prodRes.success) {
          const prods = prodRes.data.products;
          setFeaturedProducts(prods.filter(p => p.featured));
          setNewArrivals(prods.filter(p => p.newArrival));
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Grid */}
      <CategorySection categories={categories} />

      {/* Occasion Section */}
      <OccasionSection />

      {/* Featured Heirloom Collection */}
      <section className="py-16 bg-[#FFFDF8] border-t border-[#2C1B16]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#5A1022] mb-1">
                Master Weaver Curations
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1B16] font-normal">
                Featured Heirloom Sarees
              </h2>
              <div className="w-16 h-0.5 bg-[#C9A227] mt-3" />
            </div>
            <Link
              to="/sarees?featured=true"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1022] hover:text-[#460b19] uppercase tracking-wider group"
            >
              <span>View All Heirlooms</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts.slice(0, 4)} loading={loading} />
        </div>
      </section>

      {/* Heritage Craft Story Spotlight */}
      <section className="py-16 bg-[#F8F1E5] border-y border-[#2C1B16]/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-xl border-2 border-[#C9A227]/40 bg-[#FFFDF8]">
                <img
                  src={getCloudinaryUrl(
                    'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405339/virasat_sarees/red_kanjivaram.jpg',
                    { width: 700, height: 900, crop: 'fill' }
                  )}
                  alt="Traditional Handloom Weaver Loom"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-[#FFFDF8]">
                  <p className="font-serif text-lg font-normal">Yeola & Kanchipuram Weaving Clusters</p>
                  <p className="text-xs text-white/80 font-light mt-0.5">Over 300 master artisan families</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#5A1022] font-semibold uppercase tracking-widest">
                <Sparkles size={14} className="text-[#C9A227]" />
                <span>The Sacred Thread of Generation</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1B16] font-normal leading-tight">
                Authentic Handloom Preservation Since Inception
              </h2>

              <p className="text-sm text-[#2C1B16]/80 font-light leading-relaxed">
                In an era dominated by rapid synthetic powerlooms, Virasat Silk & Sarees remains dedicated to the slow, sacred art of handloom weaving. Each authentic Paithani saree takes between 25 to 180 days of patient craftsmanship on pit looms in Yeola, where pure silk threads are interlaced with certified tested gold zari.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-[#2C1B16]/80">
                <div className="p-3 bg-white/70 border border-[#2C1B16]/10 rounded-sm">
                  <h4 className="font-serif text-sm font-semibold text-[#5A1022] mb-1">
                    Tested Pure Gold Zari
                  </h4>
                  <p className="text-[11px] text-[#2C1B16]/70 leading-normal">
                    Real silver threads coated with pure gold, verified for lasting heirlooms that retain their luster for decades.
                  </p>
                </div>

                <div className="p-3 bg-white/70 border border-[#2C1B16]/10 rounded-sm">
                  <h4 className="font-serif text-sm font-semibold text-[#5A1022] mb-1">
                    Fair Weaver Remuneration
                  </h4>
                  <p className="text-[11px] text-[#2C1B16]/70 leading-normal">
                    Direct collaboration with artisan cooperatives without middlemen, ensuring dignified livelihoods for handloom families.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#5A1022] hover:bg-[#460b19] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-sm"
                >
                  <span>Read Our Loom Story</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#5A1022] mb-1">
                Fresh Off The Pit Looms
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1B16] font-normal">
                New Festive Additions
              </h2>
              <div className="w-16 h-0.5 bg-[#C9A227] mt-3" />
            </div>
            <Link
              to="/sarees?newArrival=true"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1022] hover:text-[#460b19] uppercase tracking-wider group"
            >
              <span>Explore All New Drapes</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <ProductGrid products={newArrivals.slice(0, 4)} loading={loading} />
        </div>
      </section>

      {/* Reviews & Social Proof */}
      <ReviewSection />

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};
