import React, { useState, useEffect } from 'react';
import { Product, CloudinaryImage, ProductColor } from '../../server/types.js';
import { X, Upload, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api.js';

interface AdminProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  product?: Product | null;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  isOpen,
  onClose,
  onSave,
  product
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    category: 'Paithani',
    price: 8499,
    originalPrice: 10999,
    stock: 10,
    fabric: '100% Pure Mulberry Silk',
    sareeLength: '6.3 meters with blouse piece',
    blouseIncluded: true,
    blouseType: 'Unstitched matching silk with zari border',
    careInstructions: 'Dry clean only. Store in clean muslin cloth.',
    work: 'Handwoven Peacock Pallu & Gold Buttis',
    zariType: 'Pure Tested Muga Gold Zari',
    occasion: 'Bridal, Wedding Reception',
    description: '',
    featured: false,
    bestSeller: false,
    newArrival: true,
    colors: [
      { name: 'Purple', value: '#6A1B9A', image: '' }
    ],
    images: []
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        slug: '',
        category: 'Paithani',
        price: 8499,
        originalPrice: 10999,
        stock: 10,
        fabric: '100% Pure Mulberry Silk',
        sareeLength: '6.3 meters with blouse piece',
        blouseIncluded: true,
        blouseType: 'Unstitched matching silk with zari border',
        careInstructions: 'Dry clean only. Store in clean muslin cloth.',
        work: 'Handwoven Peacock Pallu & Gold Buttis',
        zariType: 'Pure Tested Muga Gold Zari',
        occasion: 'Bridal, Wedding Reception',
        description: '',
        featured: false,
        bestSeller: false,
        newArrival: true,
        colors: [
          { name: 'Purple', value: '#6A1B9A', image: '' }
        ],
        images: [
          {
            url: 'https://res.cloudinary.com/qudcaa6j/image/upload/v1790405329/virasat_sarees/purple_paithani.jpg',
            publicId: 'virasat_sarees/purple_paithani'
          }
        ]
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        const res = await api.uploadImage(base64);
        if (res.success && res.data?.url) {
          const newImg: CloudinaryImage = {
            url: res.data.url,
            publicId: res.data.publicId
          };
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), newImg]
          }));
        }
      } catch (err) {
        console.error('Image upload failed', err);
        alert('Failed to upload image to Cloudinary.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const newImg: CloudinaryImage = {
      url: imageUrlInput.trim(),
      publicId: `virasat_sarees/${Date.now()}`
    };
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), newImg]
    }));
    setImageUrlInput('');
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const standardOccasions = [
    'Wedding',
    'Reception',
    'Festival',
    'Traditional',
    'Party',
    'Casual',
    'Office'
  ];

  const toggleOccasion = (occ: string) => {
    const current = (formData.occasion || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    let updated: string[];
    if (current.some(c => c.toLowerCase() === occ.toLowerCase())) {
      updated = current.filter(c => c.toLowerCase() !== occ.toLowerCase());
    } else {
      updated = [...current, occ];
    }
    setFormData({ ...formData, occasion: updated.join(', ') });
  };

  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...(prev.colors || []),
        { name: 'Red', value: '#B71C1C', image: prev.images?.[0]?.url || '', stock: 5, inStock: true }
      ]
    }));
  };

  const removeColor = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors?.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in Saree Name, Price, and Category');
      return;
    }
    setSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to save saree.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF8] border border-[#2C1B16]/20 rounded-md shadow-2xl w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#2C1B16]/10 flex items-center justify-between bg-[#FDF9F2]">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#C9A227]" />
            <h3 className="font-serif text-lg font-semibold text-[#2C1B16]">
              {product ? 'Edit Saree in Catalog' : 'Add New Handcrafted Saree'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#2C1B16]/50 hover:text-[#2C1B16] rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#2C1B16]">
          {/* Saree Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold text-[#5A1022] pb-1 border-b border-[#5A1022]/20">
              Basic Saree Identification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Saree Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Yeola Paithani Saree"
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Category *
                </label>
                <select
                  value={formData.category || 'Paithani'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                >
                  <option value="Paithani">Paithani</option>
                  <option value="Silk">Silk</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Designer">Designer</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Festive">Festive</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Original Price / MRP (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.originalPrice || ''}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Inventory Stock Count *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock || 0}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Fabric Type
                </label>
                <input
                  type="text"
                  value={formData.fabric || ''}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  placeholder="e.g. 100% Pure Mulberry Silk"
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                />
              </div>
            </div>
          </div>

          {/* Saree Weaving & Occasion Specs */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold text-[#5A1022] pb-1 border-b border-[#5A1022]/20">
              Weaving Specifications
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Zari Thread Type
                </label>
                <input
                  type="text"
                  value={formData.zariType || ''}
                  onChange={(e) => setFormData({ ...formData, zariType: e.target.value })}
                  placeholder="e.g. Tested Pure Gold Zari"
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Pallu & Border Work
                </label>
                <input
                  type="text"
                  value={formData.work || ''}
                  onChange={(e) => setFormData({ ...formData, work: e.target.value })}
                  placeholder="e.g. Meenakari Peacock & Kaldar Butti"
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Occasion Celebrations
                </label>
                {/* Quick Select Occasion Chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {standardOccasions.map((occ) => {
                    const isSelected = (formData.occasion || '')
                      .toLowerCase()
                      .includes(occ.toLowerCase());
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => toggleOccasion(occ)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#5A1022] text-[#FFFDF8] font-semibold shadow-xs'
                            : 'bg-[#F8F1E5] text-[#2C1B16]/70 hover:bg-[#ebdcc4] border border-[#2C1B16]/15'
                        }`}
                      >
                        {isSelected ? `✓ ${occ}` : `+ ${occ}`}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={formData.occasion || ''}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  placeholder="e.g. Wedding, Reception, Festival"
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022] text-xs"
                />
                <p className="text-[10px] text-[#2C1B16]/50 mt-1">
                  Click chips to toggle or type custom occasions separated by commas.
                </p>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                  Saree Length & Blouse
                </label>
                <input
                  type="text"
                  value={formData.sareeLength || ''}
                  onChange={(e) => setFormData({ ...formData, sareeLength: e.target.value })}
                  placeholder="6.3 meters with 0.8m blouse"
                  className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/70">
                Detailed Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the loom craft, pallu, softness and weave heritage..."
                className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
              />
            </div>
          </div>

          {/* Cloudinary Images */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#5A1022] pb-1 border-b border-[#5A1022]/20">
              Cloudinary Product Images
            </h4>

            {/* Existing images list */}
            <div className="flex flex-wrap gap-3">
              {formData.images?.map((img, idx) => (
                <div key={idx} className="relative w-20 h-24 rounded border border-[#2C1B16]/20 overflow-hidden group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Upload or Add Image URL */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-[#5A1022] text-[#FFFDF8] rounded cursor-pointer hover:bg-[#460b19] transition-colors">
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    <span>Upload to Cloudinary</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              <div className="flex flex-1 gap-2">
                <input
                  type="url"
                  placeholder="Or paste Cloudinary / image URL"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-[#2C1B16] text-[#FFFDF8] rounded hover:bg-black transition-colors"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>

          {/* Color Variations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#5A1022]/20">
              <h4 className="font-serif text-sm font-semibold text-[#5A1022]">
                Color Shades & Swatches
              </h4>
              <button
                type="button"
                onClick={handleAddColor}
                className="text-xs text-[#5A1022] hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus size={13} /> Add Color
              </button>
            </div>

            <div className="space-y-2">
              {formData.colors?.map((c, idx) => {
                const isOutOfStock = c.inStock === false || (c.stock !== undefined && c.stock <= 0);
                return (
                  <div key={idx} className="p-2.5 bg-[#FDF9F2] border border-[#2C1B16]/15 rounded flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                    {/* Color Swatch & Name */}
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={c.value}
                        onChange={(e) => {
                          const updated = [...(formData.colors || [])];
                          updated[idx].value = e.target.value;
                          setFormData({ ...formData, colors: updated });
                        }}
                        className="w-7 h-7 rounded border border-[#2C1B16]/20 cursor-pointer p-0.5 shrink-0"
                      />
                      <input
                        type="text"
                        value={c.name}
                        placeholder="Color Name (e.g. Purple)"
                        onChange={(e) => {
                          const updated = [...(formData.colors || [])];
                          updated[idx].name = e.target.value;
                          setFormData({ ...formData, colors: updated });
                        }}
                        className="w-28 px-2 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs font-medium"
                      />
                    </div>

                    {/* Stock Input */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="text-[10px] uppercase font-bold text-[#2C1B16]/60">Stock:</label>
                      <input
                        type="number"
                        min="0"
                        value={c.stock !== undefined ? c.stock : 5}
                        placeholder="5"
                        onChange={(e) => {
                          const val = Math.max(0, parseInt(e.target.value) || 0);
                          const updated = [...(formData.colors || [])];
                          updated[idx].stock = val;
                          updated[idx].inStock = val > 0;
                          setFormData({ ...formData, colors: updated });
                        }}
                        className="w-16 px-2 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs text-center font-bold"
                      />
                    </div>

                    {/* Availability Status Badge & Toggle */}
                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={!isOutOfStock}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const updated = [...(formData.colors || [])];
                          updated[idx].inStock = checked;
                          if (!checked) {
                            updated[idx].stock = 0;
                          } else if (!updated[idx].stock || updated[idx].stock <= 0) {
                            updated[idx].stock = 5;
                          }
                          setFormData({ ...formData, colors: updated });
                        }}
                        className="accent-[#5A1022] w-3.5 h-3.5"
                      />
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          !isOutOfStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </label>

                    {/* Image URL */}
                    <input
                      type="text"
                      value={c.image || ''}
                      placeholder="Associated Image URL (optional)"
                      onChange={(e) => {
                        const updated = [...(formData.colors || [])];
                        updated[idx].image = e.target.value;
                        setFormData({ ...formData, colors: updated });
                      }}
                      className="flex-1 px-2 py-1 bg-white border border-[#2C1B16]/20 rounded text-xs truncate"
                    />

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeColor(idx)}
                      className="p-1 text-red-600 hover:text-red-800 self-end sm:self-center shrink-0"
                      title="Remove shade"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feature Badges & Flags */}
          <div className="space-y-2 pt-2 border-t border-[#2C1B16]/10">
            <h4 className="font-serif text-sm font-semibold text-[#5A1022]">
              Storefront Display Badges
            </h4>
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="accent-[#5A1022]"
                />
                <span className="text-xs font-medium">Heirloom / Featured</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.bestSeller)}
                  onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                  className="accent-[#5A1022]"
                />
                <span className="text-xs font-medium">Best Seller</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(formData.newArrival)}
                  onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                  className="accent-[#5A1022]"
                />
                <span className="text-xs font-medium">New Arrival</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2C1B16]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#2C1B16]/20 rounded text-xs font-semibold hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#5A1022] hover:bg-[#460b19] disabled:opacity-75 text-[#FFFDF8] rounded text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors flex items-center gap-1.5"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>{product ? 'Update Saree' : 'Publish Saree to Store'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
