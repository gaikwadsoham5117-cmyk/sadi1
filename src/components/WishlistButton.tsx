import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext.js';
import { Product } from '../../server/types.js';

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: number;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  className = '',
  size = 18
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`p-2 rounded-full transition-all duration-200 ${
        active
          ? 'bg-[#5A1022] text-[#FFFDF8] shadow-md'
          : 'bg-white/90 text-[#2C1B16]/70 hover:text-[#5A1022] hover:bg-white shadow-sm'
      } ${className}`}
    >
      <Heart
        size={size}
        className={`transition-transform duration-200 ${active ? 'fill-current scale-110' : ''}`}
      />
    </button>
  );
};
