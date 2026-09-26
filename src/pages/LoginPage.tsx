import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Lock, Mail, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, loginAsDemoAdmin, loginAsDemoCustomer, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/sarees');
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    loginAsDemoAdmin();
    navigate('/admin');
  };

  const handleDemoCustomer = () => {
    loginAsDemoCustomer();
    navigate('/sarees');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="font-serif text-2xl sm:text-3xl font-semibold text-[#5A1022] tracking-tight inline-block"
          >
            Virasat Silk & Sarees
          </Link>
          <p className="text-xs text-[#2C1B16]/60">
            {isRegister ? 'Join the Virasat Heritage Patron Circle' : 'Sign in to access your trousseau and orders'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#2C1B16]/70 uppercase font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C1B16]/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@virasatsarees.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#2C1B16]/70 uppercase font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C1B16]/40" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#5A1022] hover:bg-[#460b19] disabled:opacity-50 text-[#FFFDF8] font-semibold uppercase tracking-wider rounded transition-colors shadow-sm"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[#5A1022] hover:underline font-medium"
          >
            {isRegister
              ? 'Already registered? Sign in here'
              : 'New to Virasat? Create an account'}
          </button>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="pt-6 border-t border-[#2C1B16]/10 space-y-2.5">
          <p className="text-[11px] text-[#2C1B16]/50 uppercase tracking-wider font-semibold text-center">
            Instant Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="py-2 px-2.5 bg-[#2C1B16] hover:bg-black text-[#FFFDF8] rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck size={14} className="text-[#C9A227]" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="py-2 px-2.5 bg-white border border-[#2C1B16]/20 hover:bg-[#FDF9F2] text-[#2C1B16] rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck size={14} className="text-[#5A1022]" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
