import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  PlusCircle,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

interface AdminSidebarProps {
  currentTab: 'analytics' | 'products' | 'orders' | 'inventory' | 'settings';
  onTabChange: (tab: 'analytics' | 'products' | 'orders' | 'inventory' | 'settings') => void;
  onOpenNewProductModal: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenNewProductModal
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'analytics', label: 'Analytics & Revenue', icon: LayoutDashboard },
    { id: 'products', label: 'Saree Catalog', icon: Package },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory Health', icon: Boxes },
    { id: 'settings', label: 'Store & WhatsApp', icon: Settings }
  ] as const;

  return (
    <aside className="w-64 bg-[#241511] text-[#F8F1E5] flex flex-col justify-between shrink-0 min-h-screen border-r border-[#C9A227]/30">
      <div>
        {/* Brand header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#C9A227]" />
            <h2 className="font-serif text-lg font-bold text-[#FFFDF8] tracking-wide">
              Virasat Admin
            </h2>
          </div>
          <p className="text-[11px] text-[#F8F1E5]/60 mt-1 truncate">
            {user?.email || 'admin@virasatsarees.com'}
          </p>
        </div>

        {/* Action Button: Add New Saree */}
        <div className="p-4">
          <button
            onClick={onOpenNewProductModal}
            className="w-full py-2.5 px-3 bg-[#5A1022] hover:bg-[#72152c] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 border border-[#C9A227]/40 shadow-sm transition-colors"
          >
            <PlusCircle size={15} />
            <span>Add New Saree</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#5A1022] text-[#FFFDF8] font-semibold'
                    : 'text-[#F8F1E5]/70 hover:bg-white/5 hover:text-[#FFFDF8]'
                }`}
              >
                <Icon size={16} className={active ? 'text-[#C9A227]' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-[#F8F1E5]/70 hover:text-white rounded hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Storefront
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 rounded hover:bg-white/5 transition-colors"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};
