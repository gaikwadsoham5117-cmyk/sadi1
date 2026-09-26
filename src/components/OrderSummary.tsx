import React from 'react';
import { CartItem } from '../context/CartContext.js';
import { getCloudinaryUrl } from '../services/cloudinary.js';
import { ShieldCheck, Tag } from 'lucide-react';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  appliedCoupon?: string;
  onApplyCoupon?: (code: string) => void;
  onRemoveCoupon?: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  discount,
  shipping,
  total,
  couponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}) => {
  const [inputCode, setInputCode] = React.useState('');

  return (
    <div className="bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm p-6 space-y-6 shadow-xs">
      <h3 className="font-serif text-xl font-medium text-[#2C1B16] pb-3 border-b border-[#2C1B16]/10">
        Order Summary ({items.length} {items.length === 1 ? 'Saree' : 'Sarees'})
      </h3>

      {/* Item List Preview */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 text-xs">
            <img
              src={getCloudinaryUrl(item.image, { width: 100, height: 120, crop: 'fill' })}
              alt={item.name}
              className="w-14 h-16 object-cover rounded bg-[#F8F1E5] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-medium text-[#2C1B16] truncate">
                {item.name}
              </h4>
              <p className="text-[#2C1B16]/60 text-[11px] mt-0.5">
                Shade: {item.selectedColor} · Qty: {item.quantity}
              </p>
              <p className="font-serif text-[#5A1022] font-semibold mt-1">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Area */}
      {onApplyCoupon && (
        <div className="pt-2 border-t border-[#2C1B16]/10">
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
              <div className="flex items-center gap-1.5 font-medium">
                <Tag size={14} />
                <span>Coupon <strong>{appliedCoupon}</strong> Applied!</span>
              </div>
              {onRemoveCoupon && (
                <button
                  type="button"
                  onClick={onRemoveCoupon}
                  className="text-red-700 hover:underline font-semibold"
                >
                  Remove
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. VIRASAT10)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded text-xs uppercase focus:outline-none focus:border-[#5A1022]"
                />
                <button
                  type="button"
                  onClick={() => onApplyCoupon(inputCode)}
                  className="px-4 py-2 bg-[#5A1022] text-[#FFFDF8] text-xs font-semibold rounded hover:bg-[#460b19] transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-[#2C1B16]/60">
                Try <strong>VIRASAT10</strong> for 10% off or <strong>BRIDAL500</strong> for ₹500 off
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bill Breakdown */}
      <div className="space-y-2 text-xs text-[#2C1B16]/80 pt-2 border-t border-[#2C1B16]/10">
        <div className="flex justify-between">
          <span>Bag Subtotal</span>
          <span className="font-medium text-[#2C1B16]">
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-800 font-medium">
            <span>Special Promotional Discount</span>
            <span>-₹{discount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Insured Transit & Delivery</span>
          <span className="text-emerald-800 font-semibold">FREE</span>
        </div>
        <div className="flex justify-between">
          <span>GST / Handloom Cess</span>
          <span className="text-[#2C1B16]/60">Included</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-[#2C1B16]/10 text-sm font-serif font-semibold text-[#2C1B16]">
          <span>Payable Amount</span>
          <span className="text-lg text-[#5A1022]">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="p-3 bg-[#FDF9F2] border border-[#C9A227]/30 rounded text-[11px] text-[#2C1B16]/70 flex items-start gap-2">
        <ShieldCheck size={16} className="text-[#C9A227] shrink-0 mt-0.5" />
        <span>All sarees are certified with pure Silk Mark and securely insured against transit damage.</span>
      </div>
    </div>
  );
};
