import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { Product, Category } from '../../server/types.js';
import { ProductGrid } from '../components/ProductGrid.js';
import { ProductFilters, FilterState } from '../components/ProductFilters.js';
import { SlidersHorizontal, X } from 'lucide-react';

export const SareesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || 'all',
    fabric: searchParams.get('fabric') || 'all',
    occasion: searchParams.get('occasion') || 'all',
    color: searchParams.get('color') || 'all',
    zariType: searchParams.get('zariType') || 'all',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 20000,
    sort: searchParams.get('sort') || 'featured',
    inStockOnly: searchParams.get('inStock') === 'true'
  });

  // Keep filters in sync when URL parameters change
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || 'all',
      fabric: searchParams.get('fabric') || 'all',
      occasion: searchParams.get('occasion') || 'all',
      color: searchParams.get('color') || 'all',
      zariType: searchParams.get('zariType') || 'all',
      minPrice: Number(searchParams.get('minPrice')) || 0,
      maxPrice: Number(searchParams.get('maxPrice')) || 20000,
      sort: searchParams.get('sort') || 'featured',
      inStockOnly: searchParams.get('inStock') === 'true'
    });
  }, [searchParams]);

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever filters or search query change
  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          category: filters.category !== 'all' ? filters.category : undefined,
          search: searchQuery || undefined,
          fabric: filters.fabric !== 'all' ? filters.fabric : undefined,
          occasion: filters.occasion !== 'all' ? filters.occasion : undefined,
          color: filters.color !== 'all' ? filters.color : undefined,
          zariType: filters.zariType !== 'all' ? filters.zariType : undefined,
          maxPrice: filters.maxPrice < 20000 ? filters.maxPrice : undefined,
          sort: filters.sort,
          featured: searchParams.get('featured') === 'true' ? true : undefined,
          newArrival: searchParams.get('newArrival') === 'true' ? true : undefined,
          bestSeller: searchParams.get('bestSeller') === 'true' ? true : undefined
        };

        const res = await api.getProducts(params);
        if (res.success) {
          let list = res.data.products;
          if (filters.inStockOnly) {
            list = list.filter(p => p.stock > 0);
          }
          setProducts(list);
        }
      } catch (err) {
        console.error('Error fetching sarees', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [filters, searchQuery, searchParams]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      fabric: 'all',
      occasion: 'all',
      color: 'all',
      zariType: 'all',
      minPrice: 0,
      maxPrice: 20000,
      sort: 'featured',
      inStockOnly: false
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5A1022] mb-1">
            Certified Handloom
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2C1B16] font-normal">
            {filters.occasion !== 'all'
              ? `${filters.occasion} Collection Sarees`
              : filters.category !== 'all'
              ? `${filters.category} Sarees`
              : searchQuery
              ? `Results for "${searchQuery}"`
              : 'All Handcrafted Sarees'}
          </h1>
          <div className="w-16 h-0.5 bg-[#C9A227] mx-auto mt-3 mb-3" />
          <p className="text-sm text-[#2C1B16]/70 font-light">
            Every weave is hand-inspected for silk purity, tested zari authenticity, and flawless finish.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-[#2C1B16]/10">
          <span className="text-xs font-medium text-[#2C1B16]/70">
            {products.length} Sarees available
          </span>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5A1022] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded"
          >
            <SlidersHorizontal size={14} /> Filter & Sort
          </button>
        </div>

        {/* Active Filters Bar */}
        {(filters.category !== 'all' ||
          filters.fabric !== 'all' ||
          filters.occasion !== 'all' ||
          filters.color !== 'all' ||
          filters.zariType !== 'all' ||
          searchQuery ||
          filters.maxPrice < 20000) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#FDF9F2] border border-[#2C1B16]/10 rounded-sm">
            <span className="text-xs text-[#2C1B16]/60 font-medium mr-1">Active Filters:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs text-[#2C1B16]">
                Query: "{searchQuery}"
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('search');
                    setSearchParams(next);
                  }}
                  className="hover:text-red-700"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.color !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs text-[#2C1B16]">
                Shade: {filters.color}
                <button
                  onClick={() => setFilters({ ...filters, color: 'all' })}
                  className="hover:text-red-700"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.zariType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs text-[#2C1B16]">
                Zari: {filters.zariType}
                <button
                  onClick={() => setFilters({ ...filters, zariType: 'all' })}
                  className="hover:text-red-700"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs text-[#2C1B16]">
                Category: {filters.category}
                <button
                  onClick={() => setFilters({ ...filters, category: 'all' })}
                  className="hover:text-red-700"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.occasion !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs text-[#2C1B16]">
                Occasion: {filters.occasion}
                <button
                  onClick={() => {
                    setFilters({ ...filters, occasion: 'all' });
                    const next = new URLSearchParams(searchParams);
                    next.delete('occasion');
                    setSearchParams(next);
                  }}
                  className="hover:text-red-700"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.fabric !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs text-[#2C1B16]">
                Fabric: {filters.fabric}
                <button
                  onClick={() => setFilters({ ...filters, fabric: 'all' })}
                  className="hover:text-red-700"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.maxPrice < 20000 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs text-[#2C1B16]">
                Max: ₹{filters.maxPrice.toLocaleString('en-IN')}
                <button
                  onClick={() => setFilters({ ...filters, maxPrice: 20000 })}
                  className="hover:text-red-700"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs text-[#5A1022] hover:underline font-semibold ml-auto"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              categories={categories}
              totalCount={products.length}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              loading={loading}
              onClearFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative w-full max-w-xs bg-[#FFFDF8] h-full shadow-2xl overflow-y-auto p-5 z-10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2C1B16]/10">
                  <h3 className="font-serif text-lg font-medium text-[#2C1B16]">
                    Filter Sarees
                  </h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
                <ProductFilters
                  filters={filters}
                  onChange={setFilters}
                  onReset={handleResetFilters}
                  categories={categories}
                  totalCount={products.length}
                />
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#5A1022] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded mt-4"
              >
                Apply & View ({products.length} Sarees)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
