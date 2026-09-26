import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, User, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useAuth } from '../context/AuthContext.js';
import { SearchBar } from './SearchBar.js';
import { MobileMenu } from './MobileMenu.js';

export const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isOccasionMenuOpen, setIsOccasionMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const categoryTimeoutRef = useRef<any>(null);
  const occasionTimeoutRef = useRef<any>(null);

  const sareeCategories = [
    { name: 'All Sarees Collection', path: '/sarees', description: 'Explore full authentic handloom catalog' },
    { name: 'Yeola Paithani', path: '/sarees?category=Paithani', description: 'Certified peacock pallu & pure gold tissue zari' },
    { name: 'Kanchipuram Silk', path: '/sarees?category=Silk', description: 'Heavy 3-ply temple korvai interlocking borders' },
    { name: 'Banarasi Brocade', path: '/sarees?category=Banarasi', description: 'Varanasi kadwa weave & colorful meenakari resham' },
    { name: 'Chanderi & Cotton', path: '/sarees?category=Cotton', description: 'Lightweight gossamer silk warps & ashrafi buttis' },
    { name: 'Traditional Heritage', path: '/sarees?category=Traditional', description: 'Auspicious bridal silks with royal court motifs' },
    { name: 'Designer & Festive', path: '/sarees?category=Designer', description: 'Pure silk organza, cutwork borders & scalloped edges' }
  ];

  const occasionList = [
    { name: 'Wedding', path: '/sarees?occasion=Wedding', badge: 'Bridal' },
    { name: 'Reception', path: '/sarees?occasion=Reception', badge: 'Evening' },
    { name: 'Festival', path: '/sarees?occasion=Festival', badge: 'Pooja' },
    { name: 'Traditional', path: '/sarees?occasion=Traditional', badge: 'Heirloom' },
    { name: 'Party', path: '/sarees?occasion=Party', badge: 'Glamour' },
    { name: 'Casual', path: '/sarees?occasion=Casual', badge: 'Day Wear' },
    { name: 'Office', path: '/sarees?occasion=Office', badge: 'Formal' }
  ];

  // Close menus on route change
  useEffect(() => {
    setIsCategoryMenuOpen(false);
    setIsOccasionMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#2C1B16]/10 shadow-xs transition-shadow duration-200">
        {/* Main Brand & Action Tier */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Royal Brand Identity */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#2C1B16] hover:text-[#5A1022] hover:bg-[#F8F1E5] rounded transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu size={22} />
              </button>

              <Link to="/" className="flex items-center gap-3 group">
                {/* Royal Emblem Seal */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#5A1022] via-[#460b19] to-[#2e050f] border-2 border-[#C9A227] flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                  <span className="font-serif text-xl font-bold text-[#C9A227] tracking-wider">
                    V
                  </span>
                </div>

                {/* Typography Wordmark */}
                <div className="flex flex-col text-left">
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.14em] text-[#5A1022] leading-none">
                    VIRASAT
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C9A227] uppercase">
                      SILK & SAREES
                    </span>
                    <span className="text-[9px] text-[#2C1B16]/40">·</span>
                    <span className="hidden sm:inline text-[9px] font-medium tracking-[0.18em] text-[#2C1B16]/60 uppercase">
                      ESTD 1984
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Middle: Luxury Instant Search Affordance */}
            <div className="hidden md:flex flex-1 max-w-xs mx-4">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-[#F8F1E5]/70 hover:bg-[#F8F1E5] border border-[#2C1B16]/15 hover:border-[#5A1022]/40 rounded-full text-xs text-[#2C1B16]/65 transition-all shadow-2xs group"
              >
                <Search size={14} className="text-[#5A1022] group-hover:scale-110 transition-transform" />
                <span className="truncate">Search Paithani, Kanjivaram, Zari...</span>
              </button>
            </div>

            {/* Right: Actions & Shopping Bag */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 text-[#2C1B16]/80 hover:text-[#5A1022] hover:bg-[#F8F1E5] rounded-full transition-colors"
                aria-label="Search sarees"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 text-[#2C1B16]/80 hover:text-[#5A1022] hover:bg-[#F8F1E5] rounded-full transition-colors"
                aria-label="Wishlist"
                title="Your Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#5A1022] text-[#FFFDF8] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account / Admin Badge */}
              <Link
                to={isAdmin ? '/admin' : (user ? '/account' : '/login')}
                className="hidden sm:flex items-center gap-1.5 p-2 text-[#2C1B16]/80 hover:text-[#5A1022] hover:bg-[#F8F1E5] rounded-full transition-colors"
                aria-label="User account"
                title={isAdmin ? 'Showroom Administration' : (user ? 'My Profile' : 'Sign In')}
              >
                {isAdmin ? (
                  <div className="flex items-center gap-1 text-[#5A1022] bg-[#5A1022]/10 px-2 py-1 rounded text-xs font-semibold">
                    <ShieldCheck size={16} />
                    <span>Admin</span>
                  </div>
                ) : (
                  <User size={20} />
                )}
              </Link>

              {/* Royal Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 py-2 px-3.5 bg-gradient-to-r from-[#5A1022] to-[#420B17] hover:from-[#460b19] hover:to-[#330711] text-[#FFFDF8] rounded-sm transition-all shadow-sm hover:shadow group ml-1"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={17} className="text-amber-200 group-hover:scale-105 transition-transform" />
                <span className="text-xs font-semibold tracking-wider uppercase">Bag</span>
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-[#C9A227] text-[#2C1B16] text-[11px] font-black rounded-full shadow-2xs">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Structured Navigation Menu (Desktop) */}
        <div className="hidden lg:block border-t border-[#2C1B16]/10 bg-[#FFFDF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between py-2 text-xs font-medium tracking-wider uppercase">
              <div className="flex items-center gap-8">
                {/* 1. Home */}
                <Link
                  to="/"
                  className={`py-1 transition-colors hover:text-[#5A1022] ${
                    location.pathname === '/' ? 'text-[#5A1022] font-bold' : 'text-[#2C1B16]/80'
                  }`}
                >
                  Home
                </Link>

                {/* 2. Categories Dropdown Menu */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
                    setIsCategoryMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    categoryTimeoutRef.current = setTimeout(() => setIsCategoryMenuOpen(false), 200);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                    className={`py-1 flex items-center gap-1 transition-colors hover:text-[#5A1022] ${
                      location.pathname.startsWith('/sarees') && !location.search.includes('occasion=')
                        ? 'text-[#5A1022] font-bold'
                        : 'text-[#2C1B16]/80'
                    }`}
                  >
                    <span>Categories</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180 text-[#5A1022]' : ''}`} />
                  </button>

                  {/* Categories Flyout Menu */}
                  {isCategoryMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-80 bg-[#FFFDF8] border border-[#C9A227]/40 shadow-xl rounded-sm p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 normal-case">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#5A1022] pb-2 border-b border-[#2C1B16]/10 mb-2 flex items-center justify-between">
                        <span>Curated Saree Categories</span>
                        <Link to="/sarees" className="text-[#C9A227] hover:underline font-semibold">
                          View All &rarr;
                        </Link>
                      </div>

                      <div className="space-y-1">
                        {sareeCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={cat.path}
                            className="block p-2 rounded hover:bg-[#F8F1E5] transition-colors group"
                          >
                            <div className="font-serif text-sm font-semibold text-[#2C1B16] group-hover:text-[#5A1022] flex items-center justify-between">
                              <span>{cat.name}</span>
                              <span className="text-[10px] text-[#C9A227] opacity-0 group-hover:opacity-100 transition-opacity">
                                Explore
                              </span>
                            </div>
                            <p className="text-[11px] text-[#2C1B16]/60 leading-tight mt-0.5">
                              {cat.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Occasion Navigation Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (occasionTimeoutRef.current) clearTimeout(occasionTimeoutRef.current);
                    setIsOccasionMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    occasionTimeoutRef.current = setTimeout(() => setIsOccasionMenuOpen(false), 200);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsOccasionMenuOpen(!isOccasionMenuOpen)}
                    className={`py-1 flex items-center gap-1 transition-colors hover:text-[#5A1022] ${
                      location.search.includes('occasion=') ? 'text-[#5A1022] font-bold' : 'text-[#2C1B16]/80'
                    }`}
                  >
                    <span>Occasions</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isOccasionMenuOpen ? 'rotate-180 text-[#5A1022]' : ''}`} />
                  </button>

                  {/* Occasion Flyout Menu */}
                  {isOccasionMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-[#FFFDF8] border border-[#C9A227]/40 shadow-xl rounded-sm p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 normal-case">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#5A1022] pb-2 border-b border-[#2C1B16]/10 mb-2">
                        Shop By Celebration
                      </div>

                      <div className="grid grid-cols-1 gap-1">
                        {occasionList.map((occ) => (
                          <Link
                            key={occ.name}
                            to={occ.path}
                            className="flex items-center justify-between p-2 rounded hover:bg-[#F8F1E5] transition-colors group"
                          >
                            <span className="font-serif text-sm font-medium text-[#2C1B16] group-hover:text-[#5A1022]">
                              {occ.name}
                            </span>
                            <span className="text-[10px] font-semibold text-[#5A1022] bg-[#5A1022]/10 px-2 py-0.5 rounded">
                              {occ.badge}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. New Arrivals */}
                <Link
                  to="/sarees?newArrival=true"
                  className={`py-1 transition-colors hover:text-[#5A1022] flex items-center gap-1.5 ${
                    location.search.includes('newArrival=true') ? 'text-[#5A1022] font-bold' : 'text-[#2C1B16]/80'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                  <span>New Arrivals</span>
                </Link>

                {/* 5. Our Heritage */}
                <Link
                  to="/about"
                  className={`py-1 transition-colors hover:text-[#5A1022] ${
                    location.pathname === '/about' ? 'text-[#5A1022] font-bold' : 'text-[#2C1B16]/80'
                  }`}
                >
                  Our Heritage
                </Link>

                {/* 6. Track Order */}
                <Link
                  to="/track"
                  className={`py-1 transition-colors hover:text-[#5A1022] ${
                    location.pathname === '/track' ? 'text-[#5A1022] font-bold' : 'text-[#2C1B16]/80'
                  }`}
                >
                  Track Order
                </Link>
              </div>

              {/* Silk Mark Organization Micro-Badge */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#5A1022] font-semibold bg-[#F8F1E5] px-2.5 py-0.5 rounded border border-[#C9A227]/40 tracking-normal capitalize">
                <Sparkles size={11} className="text-[#C9A227]" />
                <span>Silk Mark Certified 100% Pure Silk</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
