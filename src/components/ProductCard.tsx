import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../server/types.js';
import { WishlistButton } from './WishlistButton.js';
import { useCart } from '../context/CartContext.js';
import { getCloudinaryUrl } from '../services/cloudinary.js';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || ''
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Active image based on selected color or first image
  const currentColorObj = product.colors?.find(c => c.name === selectedColor);
  const activeImage = currentColorObj?.image || product.images?.[0]?.url;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="group relative flex flex-col bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm overflow-hidden hover:border-[#C9A227]/60 hover:shadow-lg transition-all duration-300">
      {/* Image Area */}
      <Link
        to={`/sarees/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-[#F8F1E5]"
      >
        <img
          src={getCloudinaryUrl(activeImage, { width: 600, height: 800, quality: 'auto', crop: 'fill' })}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Status markers - Quiet inline tags, not giant candy pills */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.featured && (
            <span className="bg-[#5A1022] text-[#FFFDF8] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
              Heirloom
            </span>
          )}
          {product.newArrival && (
            <span className="bg-[#2C1B16] text-[#FFFDF8] text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
              New Drape
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton product={product} size={16} />
        </div>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`w-full py-2 px-3 text-xs font-semibold rounded uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              addedAnimation
                ? 'bg-emerald-700 text-white'
                : 'bg-[#FFFDF8] text-[#2C1B16] hover:bg-[#5A1022] hover:text-[#FFFDF8]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check size={14} /> Added to Bag
              </>
            ) : product.stock === 0 ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag size={14} /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Metadata: Category & Fabric - Unboxed clean text */}
          <div className="flex items-center gap-1.5 text-xs text-[#2C1B16]/60 mb-1">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.fabric}</span>
          </div>

          {/* Saree Title */}
          <Link to={`/sarees/${product.slug}`}>
            <h3 className="font-serif text-base sm:text-lg font-medium text-[#2C1B16] group-hover:text-[#5A1022] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 py-0.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(c.name);
                }}
                title={c.name}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedColor === c.name
                    ? 'scale-125 border-[#2C1B16] ring-1 ring-[#C9A227]'
                    : 'border-black/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
            <span className="text-[10px] text-[#2C1B16]/50 ml-1">
              {product.colors.length} shades
            </span>
          </div>
        )}

        {/* Pricing & Rating Row */}
        <div className="flex items-baseline justify-between pt-1 border-t border-[#2C1B16]/5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-semibold text-[#5A1022]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#2C1B16]/40 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.discountPercentage ? (
              <span className="text-[11px] font-medium text-emerald-800">
                {product.discountPercentage}% OFF
              </span>
            ) : null}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-[#2C1B16]/75">
            <Star size={12} className="fill-[#C9A227] text-[#C9A227]" />
            <span className="font-medium">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
