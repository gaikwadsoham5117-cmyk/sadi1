import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Product } from '../../server/types.js';
import { getCloudinaryUrl } from '../services/cloudinary.js';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getProducts({ search: query.trim() });
        if (res.success) {
          setResults(res.data.products.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FFFDF8] rounded-xl shadow-2xl border border-[#C9A227]/40 overflow-hidden">
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-[#2C1B16]/10 bg-[#FDF9F2]">
          <Search size={20} className="text-[#5A1022]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Paithani, Kanjivaram, Banarasi, Silk, Organza..."
            className="flex-1 px-3 py-2 bg-transparent text-[#2C1B16] text-base focus:outline-none placeholder:text-[#2C1B16]/40"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#2C1B16]/40 hover:text-[#2C1B16] mr-1"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-[#5A1022] hover:bg-[#5A1022]/10 rounded-md transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="py-8 text-center text-sm text-[#2C1B16]/60">
              Searching traditional sarees...
            </div>
          ) : query && results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-[#2C1B16]/50 uppercase tracking-wider font-semibold">
                Found {results.length} Sarees
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/sarees/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F1E5] transition-colors border border-transparent hover:border-[#C9A227]/30"
                  >
                    <img
                      src={getCloudinaryUrl(product.images[0]?.url, { width: 120, height: 140 })}
                      alt={product.name}
                      className="w-14 h-16 object-cover rounded bg-[#F8F1E5]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#5A1022] font-medium">{product.category}</p>
                      <h4 className="text-sm font-serif font-medium text-[#2C1B16] truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#2C1B16] mt-0.5">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-2 text-center">
                <Link
                  to={`/sarees?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5A1022] hover:underline"
                >
                  View all results for "{query}" <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : query && !loading ? (
            <div className="py-8 text-center text-sm text-[#2C1B16]/60">
              No sarees found matching "{query}". Try "Paithani", "Kanjivaram", or "Bridal".
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div>
                <p className="text-xs text-[#2C1B16]/50 uppercase tracking-wider font-semibold mb-2">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Yeola Paithani', 'Bridal Kanjivaram', 'Banarasi Silk', 'Chanderi Cotton', 'Blush Organza'].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-3 py-1 bg-[#F8F1E5] hover:bg-[#5A1022] hover:text-white text-xs text-[#2C1B16] rounded-md transition-colors"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
