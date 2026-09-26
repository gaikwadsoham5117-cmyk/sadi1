import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.js';
import { useCart } from '../context/CartContext.js';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { getCloudinaryUrl } from '../services/cloudinary.js';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen py-24 bg-[#FFFDF8] text-center px-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-[#F8F1E5] rounded-full flex items-center justify-center mx-auto text-[#5A1022]">
            <Heart size={30} />
          </div>
          <h2 className="font-serif text-3xl text-[#2C1B16]">Your Wishlist is Empty</h2>
          <p className="text-sm text-[#2C1B16]/60">
            Save your favorite Paithani, Kanjivaram, and Banarasi drapes to easily find them later.
          </p>
          <Link
            to="/sarees"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5A1022] hover:bg-[#460b19] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded transition-colors"
          >
            <span>Explore All Sarees</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C1B16]">
            My Saved Heirlooms ({wishlist.length})
          </h1>
          <p className="text-xs text-[#2C1B16]/60 mt-1">
            Handpicked sarees awaiting your bridal and celebratory occasions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm overflow-hidden flex flex-col justify-between group shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[3/4] bg-[#F8F1E5] overflow-hidden">
                <Link to={`/sarees/${product.slug}`}>
                  <img
                    src={getCloudinaryUrl(product.images[0]?.url, { width: 500, height: 666, crop: 'fill' })}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-[#2C1B16]/70 hover:text-red-700 shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-[#5A1022] font-medium">{product.category}</p>
                <Link to={`/sarees/${product.slug}`}>
                  <h3 className="font-serif text-base font-medium text-[#2C1B16] hover:text-[#5A1022] line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="font-serif text-lg font-semibold text-[#5A1022]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-[#2C1B16]/40 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product, product.colors?.[0]?.name, 1)}
                  className="w-full mt-2 py-2 px-3 bg-[#5A1022] hover:bg-[#460b19] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag size={14} /> Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
