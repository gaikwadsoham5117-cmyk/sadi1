import React from 'react';
import { Award, ShieldCheck, HeartHandshake, MapPin, Sparkles } from 'lucide-react';
import { getCloudinaryUrl } from '../services/cloudinary.js';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#5A1022] font-semibold uppercase tracking-widest bg-[#5A1022]/10 px-3 py-1 rounded">
            <Sparkles size={13} className="text-[#C9A227]" /> The Story of Virasat
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2C1B16] font-normal leading-tight">
            Preserving The Sacred Art of Indian Handloom Weaving
          </h1>
          <div className="w-16 h-0.5 bg-[#C9A227] mx-auto" />
          <p className="text-base text-[#2C1B16]/80 font-light leading-relaxed">
            Founded with deep reverence for India's textile heritage, Virasat bridges the generational pit looms of master weavers with connoisseurs of authentic ethnic luxury worldwide.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-lg border border-[#2C1B16]/10 bg-[#F8F1E5]">
            <img
              src={getCloudinaryUrl('https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg', { width: 700, height: 900, crop: 'fill' })}
              alt="Yeola Paithani Handloom"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-5 text-sm text-[#2C1B16]/85 font-light leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C1B16]">
              From the Pit Looms of Yeola to Bridal Heirlooms
            </h2>
            <p>
              In our fast-paced world of synthetic materials and mechanical powerlooms, an authentic Paithani saree is a spiritual endeavor. Each meter is woven patiently by hand, thread by thread, passing shuttles through pure mulberry silk warps to manifest kaleidoscopic peacock (mor) pallus and kaldar vines.
            </p>
            <p>
              We collaborate directly with over 300 traditional weaving families across Yeola, Paithan, Kanchipuram, and Varanasi. By eliminating intermediate traders, every rupee invested honors the weaver's dedication while ensuring the customer receives an uncontaminated, certified pure heirloom.
            </p>
            <div className="p-4 bg-[#FDF9F2] border-l-2 border-[#5A1022] rounded-r text-xs space-y-1">
              <strong className="block text-[#5A1022]">The Virasat Guarantee</strong>
              <span>Every drape undergoes a mandatory 4-point purity audit: fiber burn test, tested gold zari assay, selvedge tension inspection, and colorfastness certification.</span>
            </div>
          </div>
        </div>

        {/* Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-[#FDF9F2] border border-[#2C1B16]/10 rounded-sm space-y-2 text-center">
            <Award size={28} className="mx-auto text-[#C9A227]" />
            <h3 className="font-serif text-lg font-semibold text-[#2C1B16]">Silk Mark Certified</h3>
            <p className="text-xs text-[#2C1B16]/70 leading-relaxed">
              Every pure silk saree bears the official Silk Mark Organization of India certification label ensuring 100% natural mulberry silk.
            </p>
          </div>

          <div className="p-6 bg-[#FDF9F2] border border-[#2C1B16]/10 rounded-sm space-y-2 text-center">
            <ShieldCheck size={28} className="mx-auto text-[#C9A227]" />
            <h3 className="font-serif text-lg font-semibold text-[#2C1B16]">Tested Pure Zari</h3>
            <p className="text-xs text-[#2C1B16]/70 leading-relaxed">
              We exclusively employ certified tested zari threads containing authentic silver and gold electroplating that will never oxidize into blackness.
            </p>
          </div>

          <div className="p-6 bg-[#FDF9F2] border border-[#2C1B16]/10 rounded-sm space-y-2 text-center">
            <HeartHandshake size={28} className="mx-auto text-[#C9A227]" />
            <h3 className="font-serif text-lg font-semibold text-[#2C1B16]">Artisan Fair Value</h3>
            <p className="text-xs text-[#2C1B16]/70 leading-relaxed">
              We guarantee transparent fair wages to weaver cooperatives, sustaining heritage pit looms for future generations of craftspeople.
            </p>
          </div>
        </div>

        {/* Flagship Showroom */}
        <div className="bg-[#241511] text-[#F8F1E5] p-8 sm:p-10 rounded-sm border border-[#C9A227]/40 space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FFFDF8]">
            Visit Our Flagship Kolhapur Showroom
          </h2>
          <p className="text-xs text-[#F8F1E5]/80 font-light max-w-2xl leading-relaxed">
            Experience our full bridal trousseau collection in person. Touch the pure silks, inspect the antique zari pallus under natural daylight, and consult with our master saree draper.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 text-xs text-[#C9A227]">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Showroom No. 12, Mahadwar Road, Near Mahalakshmi Temple, Rajarampuri, Kolhapur</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Open 7 Days: 10:00 AM – 9:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
