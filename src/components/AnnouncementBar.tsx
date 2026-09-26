import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Phone, ShieldCheck, Truck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';

export const AnnouncementBar: React.FC = () => {
  const { whatsappNumber, formattedWhatsApp } = useSettings();

  return (
    <div className="bg-[#420B17] text-[#FAF6EF] text-[11px] py-2 px-4 border-b border-[#C9A227]/40 tracking-wider">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Silk Mark Guarantee */}
        <div className="flex items-center gap-2">
          <span className="text-[#C9A227]">👑</span>
          <span className="font-medium tracking-wide text-amber-100">
            Silk Mark Certified Pure Handloom Sarees · Direct Artisan Cooperative
          </span>
        </div>

        {/* Right: Customer Services & Trust */}
        <div className="flex items-center gap-4 text-[11px] text-[#FAF6EF]/90">
          <div className="hidden lg:flex items-center gap-1.5">
            <Truck size={12} className="text-[#C9A227]" />
            <span>Complimentary Insured Shipping Across India</span>
          </div>
          <span className="hidden lg:inline text-[#C9A227]/50">|</span>
          <Link
            to="/track"
            className="hidden sm:inline hover:text-[#C9A227] transition-colors"
          >
            Track Order
          </Link>
          <span className="hidden sm:inline text-[#C9A227]/50">|</span>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Namaste%20Virasat%20Sarees,%20I%20have%20an%20inquiry%20regarding%20handloom%20sarees`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-200 hover:text-white font-medium transition-colors"
          >
            <Phone size={11} className="text-emerald-400" />
            <span>Showroom Concierge: {formattedWhatsApp}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
