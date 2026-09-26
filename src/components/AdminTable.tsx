import React, { useState } from 'react';
import { Product } from '../../server/types.js';
import { Edit2, Trash2, Search, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCloudinaryUrl } from '../services/cloudinary.js';

interface AdminTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  products,
  onEdit,
  onDelete
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.fabric.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#2C1B16]/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FDF9F2]">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2C1B16]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sarees by name or fabric..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#2C1B16]/20 rounded text-xs focus:outline-none focus:border-[#5A1022]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-[#2C1B16]/70 whitespace-nowrap">Filter Loom:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-[#2C1B16]/20 rounded px-2.5 py-1.5 text-xs text-[#2C1B16] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Paithani">Paithani</option>
            <option value="Silk">Silk</option>
            <option value="Cotton">Cotton</option>
            <option value="Designer">Designer</option>
            <option value="Traditional">Traditional</option>
            <option value="Festive">Festive</option>
          </select>
          <span className="text-xs text-[#2C1B16]/60 ml-2">
            Showing {filtered.length} of {products.length}
          </span>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#2C1B16]/10 bg-[#F8F1E5]/60 text-[#2C1B16]/70 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Saree</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price / MRP</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Badges</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C1B16]/5 text-[#2C1B16]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#2C1B16]/50">
                  No sarees found matching your criteria.
                </td>
              </tr>
            ) : (
              filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#FDF9F2] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getCloudinaryUrl(prod.images[0]?.url, { width: 80, height: 100, crop: 'fill' })}
                        alt={prod.name}
                        className="w-10 h-12 object-cover rounded bg-[#F8F1E5] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 max-w-xs">
                        <Link
                          to={`/sarees/${prod.slug}`}
                          target="_blank"
                          className="font-serif font-medium text-sm text-[#2C1B16] hover:text-[#5A1022] line-clamp-1 inline-flex items-center gap-1"
                        >
                          {prod.name} <ExternalLink size={11} className="opacity-50" />
                        </Link>
                        <p className="text-[11px] text-[#2C1B16]/60 truncate">{prod.fabric}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{prod.category}</td>
                  <td className="py-3 px-4 tabular-nums">
                    <div className="font-semibold text-[#5A1022]">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </div>
                    {prod.originalPrice > prod.price && (
                      <div className="text-[10px] text-[#2C1B16]/40 line-through">
                        ₹{prod.originalPrice.toLocaleString('en-IN')}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 tabular-nums">
                      {prod.stock <= 5 && prod.stock > 0 && (
                        <AlertTriangle size={13} className="text-amber-600" />
                      )}
                      <span
                        className={`font-semibold ${
                          prod.stock === 0
                            ? 'text-red-700'
                            : prod.stock <= 5
                            ? 'text-amber-700'
                            : 'text-emerald-800'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </div>
                    <span className="text-[10px] text-[#2C1B16]/50 block">
                      {prod.availability}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {prod.featured && (
                        <span className="bg-[#5A1022]/10 text-[#5A1022] px-1.5 py-0.5 rounded font-medium">
                          Heirloom
                        </span>
                      )}
                      {prod.bestSeller && (
                        <span className="bg-[#C9A227]/20 text-[#2C1B16] px-1.5 py-0.5 rounded font-medium">
                          Best Seller
                        </span>
                      )}
                      {prod.newArrival && (
                        <span className="bg-[#2C1B16]/10 text-[#2C1B16] px-1.5 py-0.5 rounded font-medium">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onEdit(prod)}
                        className="p-1.5 text-[#2C1B16]/70 hover:text-[#5A1022] hover:bg-black/5 rounded transition-colors"
                        title="Edit Saree"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove "${prod.name}" from the catalog?`)) {
                            onDelete(prod.id);
                          }
                        }}
                        className="p-1.5 text-[#2C1B16]/70 hover:text-red-700 hover:bg-black/5 rounded transition-colors"
                        title="Delete Saree"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
