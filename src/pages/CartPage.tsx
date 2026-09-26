import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { getCloudinaryUrl } from '../services/cloudinary.js';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalSavings,
    clearCart
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'VIRASAT10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedCoupon('VIRASAT10');
      setCouponDiscount(disc);
      setCouponMessage('10% Heritage discount applied successfully!');
    } else if (code === 'BRIDAL500') {
      const disc = Math.min(500, subtotal);
      setAppliedCoupon('BRIDAL500');
      setCouponDiscount(disc);
      setCouponMessage('₹500 Maiden Drape voucher applied!');
    } else {
      setCouponMessage('Invalid coupon code. Try VIRASAT10 or BRIDAL500.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponMessage('');
    setCouponCode('');
  };

  const finalTotal = Math.max(0, subtotal - couponDiscount);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-24 bg-[#FFFDF8] text-center px-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-[#F8F1E5] rounded-full flex items-center justify-center mx-auto text-[#5A1022]">
            <ShoppingBag size={30} />
          </div>
          <h2 className="font-serif text-3xl text-[#2C1B16]">Your Bag is Empty</h2>
          <p className="text-sm text-[#2C1B16]/60">
            You haven't added any handcrafted sarees yet. Explore our royal Yeola Paithani and Kanchipuram collections.
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#2C1B16]/10">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2C1B16]">
              Your Shopping Bag
            </h1>
            <p className="text-xs text-[#2C1B16]/60 mt-1">
              Review your chosen handwoven sarees before checkout
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-[#2C1B16]/50 hover:text-red-700 underline"
          >
            Empty Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#2C1B16]/10 bg-[#FDF9F2] text-[#2C1B16]/70 uppercase font-semibold text-[11px]">
                    <th className="p-4">Saree</th>
                    <th className="p-4">Shade</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Subtotal</th>
                    <th className="p-4 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C1B16]/5">
                  {cart.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FDF9F2]/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getCloudinaryUrl(item.image, { width: 100, height: 120, crop: 'fill' })}
                            alt={item.name}
                            className="w-14 h-18 object-cover rounded bg-[#F8F1E5] shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <Link
                              to={`/sarees/${item.slug}`}
                              className="font-serif font-medium text-sm text-[#2C1B16] hover:text-[#5A1022]"
                            >
                              {item.name}
                            </Link>
                            <p className="text-[11px] text-[#2C1B16]/60">{item.fabric}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-medium">{item.selectedColor}</td>

                      <td className="p-4 tabular-nums">
                        <span className="font-semibold text-[#2C1B16]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-[10px] text-[#2C1B16]/40 line-through block">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center border border-[#2C1B16]/20 rounded bg-white w-24">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-xs hover:bg-black/5"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-semibold text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-xs hover:bg-black/5"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="p-4 tabular-nums font-serif text-sm font-semibold text-[#5A1022]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-[#2C1B16]/40 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#FDF9F2] border-t border-[#2C1B16]/10 flex items-center justify-between">
              <Link
                to="/sarees"
                className="text-xs text-[#5A1022] hover:underline flex items-center gap-1 font-semibold"
              >
                <ArrowLeft size={13} /> Continue Shopping Sarees
              </Link>
              <div className="text-xs text-[#2C1B16]/70 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#C9A227]" />
                <span>Certified Silk Mark Verification Tag Attached</span>
              </div>
            </div>
          </div>

          {/* Checkout & Bill Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm p-6 space-y-4 shadow-xs">
              <h3 className="font-serif text-lg font-medium text-[#2C1B16] pb-2 border-b border-[#2C1B16]/10">
                Bag Summary
              </h3>

              {/* Coupon input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2C1B16]/70">
                  Promotional Coupon
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag size={14} />
                      <span>{appliedCoupon} (-₹{couponDiscount.toLocaleString('en-IN')})</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-red-700 underline font-semibold">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="VIRASAT10"
                      className="flex-1 px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded text-xs uppercase focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#5A1022] text-[#FFFDF8] text-xs font-semibold rounded hover:bg-[#460b19]"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponMessage && (
                  <p className={`text-[11px] ${appliedCoupon ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-2 text-xs text-[#2C1B16]/80 pt-3 border-t border-[#2C1B16]/10">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Weaver Discount Savings</span>
                    <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Coupon ({appliedCoupon})</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Shipping</span>
                  <span className="text-emerald-800 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#2C1B16]/10 font-serif text-base font-semibold text-[#2C1B16]">
                  <span>Total Amount</span>
                  <span className="text-lg text-[#5A1022]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-[#5A1022] hover:bg-[#460b19] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded shadow-md transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
