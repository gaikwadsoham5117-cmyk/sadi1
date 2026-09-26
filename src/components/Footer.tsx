import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';

export const Footer: React.FC = () => {
  const { settings, whatsappNumber, formattedWhatsApp } = useSettings();
  return (
    <footer className="bg-[#241511] text-[#F8F1E5] pt-16 pb-8 border-t border-[#C9A227]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Story */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-semibold text-[#FFFDF8] tracking-wide">
              Virasat Silk & Sarees
            </h3>
            <p className="text-xs text-[#F8F1E5]/75 font-light leading-relaxed">
              Dedicated to preserving the sacred art of traditional Indian handloom weaving. From Yeola Paithani to Kanchipuram mulberry silks, each saree is a certified heirloom woven with pure devotion.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-[#C9A227]">
              <ShieldCheck size={16} />
              <span>Silk Mark Organization Certified</span>
            </div>
          </div>

          {/* Quick Collection Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FFFDF8] tracking-wider uppercase">
              Saree Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#F8F1E5]/80 font-light">
              <li>
                <Link to="/sarees?category=Paithani" className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9A227]">›</span> Yeola Paithani Sarees
                </Link>
              </li>
              <li>
                <Link to="/sarees?category=Silk" className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9A227]">›</span> Kanchipuram Bridal Pattu
                </Link>
              </li>
              <li>
                <Link to="/sarees?category=Silk" className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9A227]">›</span> Varanasi Katan Banarasi
                </Link>
              </li>
              <li>
                <Link to="/sarees?category=Cotton" className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9A227]">›</span> Chanderi & Maheshwari Cotton
                </Link>
              </li>
              <li>
                <Link to="/sarees?category=Designer" className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9A227]">›</span> Organza & Scalloped Sarees
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Trousseau */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FFFDF8] tracking-wider uppercase">
              Experience & Trust
            </h4>
            <ul className="space-y-2 text-xs text-[#F8F1E5]/80 font-light">
              <li>
                <Link to="/track" className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5 font-medium text-[#C9A227]">
                  <span className="text-[#C9A227]">›</span> Track Saree Order Live
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9A227]">›</span> About Our Weavers
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C9A227]">›</span> WhatsApp Concierge Helpline
                </a>
              </li>
              <li>
                <Link to="/sarees" className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9A227]">›</span> Silk Saree Care Guide
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#C9A227] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9A227]">›</span> Staff & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact Info */}
          <div className="space-y-3 text-xs text-[#F8F1E5]/80 font-light">
            <h4 className="font-serif text-base font-semibold text-[#FFFDF8] tracking-wider uppercase">
              Flagship Showroom
            </h4>
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-[#C9A227] shrink-0 mt-0.5" />
              <span>{settings.storeAddress}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={16} className="text-[#C9A227] shrink-0" />
              <span>{formattedWhatsApp} · {settings.storePhone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-[#C9A227] shrink-0" />
              <span>{settings.storeEmail}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="text-[#C9A227] shrink-0" />
              <span>Open all 7 days: 10:00 AM – 9:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F8F1E5]/60 gap-3">
          <p>© {new Date().getFullYear()} Virasat Silk & Sarees. All Rights Reserved. Crafted with reverence for Indian heritage.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#C9A227]">Terms of Heritage</Link>
            <span>·</span>
            <Link to="/about" className="hover:text-[#C9A227]">Privacy Policy</Link>
            <span>·</span>
            <Link to="/admin" className="hover:text-[#C9A227]">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
