import React from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { getCloudinaryUrl } from '../services/cloudinary.js';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalSavings,
    itemCount
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FFFDF8] h-full shadow-2xl flex flex-col justify-between z-10">
        {/* Header */}
        <div className="p-5 border-b border-[#2C1B16]/10 flex items-center justify-between bg-[#FDF9F2]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#5A1022]" />
            <h2 className="font-serif text-xl font-semibold text-[#2C1B16]">
              Shopping Bag ({itemCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#2C1B16]/60 hover:text-[#2C1B16] rounded-full hover:bg-black/5"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#5A1022]/5 px-5 py-2.5 border-b border-[#5A1022]/10 text-xs">
          <p className="text-[#5A1022] font-medium flex items-center gap-1.5">
            <span className="text-[#C9A227]">✦</span>
            Congratulations! You have unlocked Free Insured Express Delivery
          </p>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag size={40} className="mx-auto text-[#2C1B16]/20" />
              <p className="font-serif text-lg text-[#2C1B16]">Your bag is empty</p>
              <p className="text-xs text-[#2C1B16]/60">Explore our handwoven Paithani & pure silk sarees</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-3 px-5 py-2 bg-[#5A1022] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded"
              >
                Browse Sarees
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 pb-4 border-b border-[#2C1B16]/10"
              >
                <img
                  src={getCloudinaryUrl(item.image, { width: 140, height: 180, crop: 'fill' })}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded bg-[#F8F1E5] shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/sarees/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-serif text-sm font-medium text-[#2C1B16] hover:text-[#5A1022] line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#2C1B16]/40 hover:text-red-700 p-0.5"
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <p className="text-xs text-[#2C1B16]/60 mt-0.5">
                      Shade: <strong>{item.selectedColor}</strong> · {item.fabric}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#2C1B16]/20 rounded bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-[#2C1B16] hover:bg-black/5"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-[#2C1B16] hover:bg-black/5"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-serif text-sm font-semibold text-[#5A1022]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      {item.originalPrice > item.price && (
                        <p className="text-[10px] text-[#2C1B16]/40 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#2C1B16]/10 bg-[#FDF9F2] space-y-3">
            <div className="space-y-1.5 text-xs text-[#2C1B16]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2C1B16]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Special Savings</span>
                  <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-800 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2C1B16]/10 text-sm font-serif font-semibold text-[#2C1B16]">
                <span>Total Amount</span>
                <span className="text-base text-[#5A1022]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#5A1022] hover:bg-[#460b19] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
                className="w-full py-2 bg-transparent hover:bg-black/5 text-[#2C1B16] text-xs font-medium rounded transition-colors text-center"
              >
                View Full Bag & Apply Coupons
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#2C1B16]/60 pt-1">
              <ShieldCheck size={13} className="text-[#C9A227]" />
              100% Handloom Certified Guarantee · Direct Weaver Heritage
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
