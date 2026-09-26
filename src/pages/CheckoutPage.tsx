import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { CheckoutForm } from '../components/CheckoutForm.js';
import { OrderSummary } from '../components/OrderSummary.js';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal } = useCart();
  const navigate = useNavigate();

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-24 bg-[#FFFDF8] text-center px-4">
        <h2 className="font-serif text-2xl text-[#2C1B16] mb-3">Your Bag is Empty</h2>
        <p className="text-xs text-[#2C1B16]/60 mb-6">Please add at least one saree to proceed with checkout.</p>
        <Link
          to="/sarees"
          className="px-6 py-2.5 bg-[#5A1022] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded"
        >
          Browse Sarees
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'VIRASAT10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedCoupon('VIRASAT10');
      setCouponDiscount(disc);
    } else if (clean === 'BRIDAL500') {
      const disc = Math.min(500, subtotal);
      setAppliedCoupon('BRIDAL500');
      setCouponDiscount(disc);
    } else {
      alert('Invalid coupon. Try VIRASAT10 or BRIDAL500.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const shipping = 0;
  const total = Math.max(0, subtotal - couponDiscount + shipping);

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2C1B16]/10">
          <Link
            to="/cart"
            className="text-xs text-[#5A1022] hover:underline flex items-center gap-1 font-medium"
          >
            <ArrowLeft size={14} /> Return to Shopping Bag
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#2C1B16]/70">
            <Lock size={14} className="text-[#C9A227]" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>

        <div className="text-left">
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C1B16]">
            Secure Order Checkout
          </h1>
          <p className="text-xs text-[#2C1B16]/60 mt-1">
            Complete your delivery details for prompt handloom fulfillment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Customer Address & Payment Selection */}
          <div className="lg:col-span-7">
            <CheckoutForm
              total={total}
              subtotal={subtotal}
              discount={couponDiscount}
              shipping={shipping}
            />
          </div>

          {/* Right: Order Summary Preview */}
          <div className="lg:col-span-5 sticky top-24">
            <OrderSummary
              items={cart}
              subtotal={subtotal}
              discount={couponDiscount}
              shipping={shipping}
              total={total}
              appliedCoupon={appliedCoupon || undefined}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
