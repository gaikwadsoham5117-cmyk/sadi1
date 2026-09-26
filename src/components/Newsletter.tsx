import React, { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="bg-[#2C1B16] text-[#F8F1E5] py-14 px-4 border-t border-[#C9A227]/30">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#C9A227] uppercase tracking-widest font-semibold bg-white/5 px-3 py-1 rounded">
          <Sparkles size={13} /> The Royal Weavers Circle
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#FFFDF8]">
          Join the Virasat Heritage Connoisseurs
        </h2>

        <p className="text-sm text-[#F8F1E5]/80 max-w-xl mx-auto font-light leading-relaxed">
          Be the first to preview new loom launches from Yeola, receive private wedding trousseau consultations, and enjoy ₹500 off your maiden drape with code <strong className="text-[#C9A227]">BRIDAL500</strong>.
        </p>

        {submitted ? (
          <div className="bg-[#5A1022] text-[#FFFDF8] p-4 rounded-md inline-flex items-center gap-2 text-sm shadow-md animate-in fade-in">
            <Check size={18} className="text-[#C9A227]" />
            <span>Welcome to Virasat! Use coupon <strong>BRIDAL500</strong> at checkout for ₹500 off.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F8F1E5]/40" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded text-sm text-[#FFFDF8] placeholder:text-[#F8F1E5]/40 focus:outline-none focus:border-[#C9A227]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#5A1022] hover:bg-[#72152c] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded border border-[#C9A227]/40 shadow-sm transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-[11px] text-[#F8F1E5]/50 pt-1">
          We honor your privacy. Unsubscribe at any time with a single click.
        </p>
      </div>
    </section>
  );
};
