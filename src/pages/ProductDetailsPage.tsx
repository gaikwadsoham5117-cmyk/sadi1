import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { Product } from '../../server/types.js';
import { ImageGallery } from '../components/ImageGallery.js';
import { WishlistButton } from '../components/WishlistButton.js';
import { useCart } from '../context/CartContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  Sparkles,
  Phone,
  ShoppingBag,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { whatsappNumber } = useSettings();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  // New review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      window.scrollTo(0, 0);

      try {
        const res = await api.getProduct(slug);
        if (res.success && res.data?.product) {
          const prod = res.data.product;
          setProduct(prod);
          const firstAvailable = prod.colors?.find(
            (c) => c.inStock !== false && (c.stock === undefined || c.stock > 0)
          );
          setSelectedColor(firstAvailable?.name || prod.colors?.[0]?.name || 'Standard');

          // Fetch related products in the same category
          const relatedRes = await api.getProducts({ category: prod.category });
          if (relatedRes.success) {
            setRelatedProducts(
              relatedRes.data.products.filter(p => p.id !== prod.id).slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error('Error loading product details', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 bg-[#FFFDF8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#5A1022] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-lg text-[#2C1B16]">Unfolding Handloom Saree Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-20 bg-[#FFFDF8] text-center">
        <h2 className="font-serif text-3xl text-[#2C1B16] mb-3">Saree Not Found</h2>
        <p className="text-sm text-[#2C1B16]/60 mb-6">The requested saree drape might have been moved or archived.</p>
        <Link
          to="/sarees"
          className="px-6 py-2.5 bg-[#5A1022] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded"
        >
          Return to Saree Collection
        </Link>
      </div>
    );
  }

  const isColorAvailable = (c: any) => {
    if (!product || product.stock <= 0 || product.availability === 'Out of Stock') return false;
    if (c.inStock === false) return false;
    if (c.stock !== undefined && c.stock <= 0) return false;
    return true;
  };

  const selectedColorObj = product?.colors?.find(
    (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
  );
  const isCurrentColorAvailable = selectedColorObj
    ? isColorAvailable(selectedColorObj)
    : Boolean(product && product.stock > 0 && product.availability !== 'Out of Stock');
  const canOrder = Boolean(product && product.stock > 0 && product.availability !== 'Out of Stock' && isCurrentColorAvailable);

  const handleAddToCart = () => {
    if (!canOrder || !product) return;
    addToCart(product, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!canOrder || !product) return;
    addToCart(product, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setDeliveryResult('Please enter a valid 6-digit postal PIN code.');
      return;
    }
    const days = pincode.startsWith('41') ? '2-3 Days (Maharashtra Express)' : '3-5 Days';
    setDeliveryResult(`Insured Express Delivery available to PIN ${pincode} within ${days}. Cash on Delivery eligible.`);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev = {
      id: 'rev-' + Date.now(),
      userName: reviewName,
      rating: reviewRating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      comment: reviewComment,
      verifiedPurchase: true,
      location: 'India'
    };

    setProduct((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        reviews: [newRev, ...(prev.reviews || [])],
        reviewsCount: (prev.reviewsCount || 0) + 1
      };
    });

    setReviewSubmitted(true);
    setReviewName('');
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#2C1B16]/60">
          <Link to="/" className="hover:text-[#5A1022]">Home</Link>
          <span>/</span>
          <Link to="/sarees" className="hover:text-[#5A1022]">Sarees</Link>
          <span>/</span>
          <Link to={`/sarees?category=${encodeURIComponent(product.category)}`} className="hover:text-[#5A1022]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#2C1B16] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero: Gallery + Buy Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery
              images={product.images}
              productName={product.name}
              selectedColorImage={
                product.colors?.find(
                  (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
                )?.image
              }
            />
          </div>

          {/* Right Column: Saree Details & Buy Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Badges */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1022]">
                  {product.category} Collection
                </span>
                <div className="flex items-center gap-1.5">
                  <WishlistButton product={product} size={18} />
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2C1B16] font-normal leading-tight">
                {product.name}
              </h1>

              {/* Rating & Review summary */}
              <div className="flex items-center gap-2 mt-2 text-xs text-[#2C1B16]/80">
                <div className="flex text-[#C9A227]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= Math.floor(product.rating) ? 'fill-current' : 'opacity-40'}
                    />
                  ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-[#2C1B16]/40">·</span>
                <span className="text-[#5A1022] hover:underline cursor-pointer">
                  {product.reviewsCount} Customer Reviews
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="p-4 bg-[#FDF9F2] border border-[#2C1B16]/10 rounded-sm">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-semibold text-[#5A1022]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-[#2C1B16]/40 line-through">
                    MRP: ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercentage ? (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {product.discountPercentage}% OFF
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-[#2C1B16]/60 mt-1">
                Inclusive of all taxes & handloom duties. Free Insured Shipping Across India.
              </p>
            </div>

            {/* Color Shade Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#2C1B16]/80 uppercase tracking-wider">
                    Select Shade: <span className="font-serif text-sm font-normal text-[#5A1022] capitalize ml-1">{selectedColor}</span>
                  </label>
                  {selectedColorObj && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isCurrentColorAvailable
                          ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                          : 'text-red-700 bg-red-50 border border-red-200'
                      }`}
                    >
                      {isCurrentColorAvailable ? '✓ Available' : '✕ Out of Stock'}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c) => {
                    const available = isColorAvailable(c);
                    const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();

                    return (
                      <button
                        key={c.name}
                        type="button"
                        disabled={!available}
                        onClick={() => {
                          if (available) {
                            setSelectedColor(c.name);
                          }
                        }}
                        title={
                          available
                            ? `${c.name} (In Stock)`
                            : `${c.name} (Out of Stock / Not Available)`
                        }
                        className={`relative flex items-center gap-2 px-3 py-1.5 rounded border text-xs transition-all ${
                          !available
                            ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-300 text-gray-400 line-through'
                            : isSelected
                            ? 'border-[#5A1022] bg-[#5A1022]/10 font-semibold ring-1 ring-[#5A1022]'
                            : 'border-[#2C1B16]/20 bg-white hover:border-[#2C1B16]/40 text-[#2C1B16]'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 ${
                            !available ? 'grayscale opacity-60' : ''
                          }`}
                          style={{ backgroundColor: c.value }}
                        />
                        <span>{c.name}</span>
                        {!available && (
                          <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1 py-0.2 rounded uppercase not-italic no-underline ml-1">
                            Not Available
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Saree Specs Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs text-[#2C1B16]/80 py-2 border-y border-[#2C1B16]/10">
              <div>
                <span className="text-[#2C1B16]/50 block text-[10px] uppercase">Fabric</span>
                <span className="font-medium">{product.fabric}</span>
              </div>
              <div>
                <span className="text-[#2C1B16]/50 block text-[10px] uppercase">Zari Quality</span>
                <span className="font-medium">{product.zariType}</span>
              </div>
              <div>
                <span className="text-[#2C1B16]/50 block text-[10px] uppercase">Length</span>
                <span className="font-medium">{product.sareeLength}</span>
              </div>
              <div>
                <span className="text-[#2C1B16]/50 block text-[10px] uppercase">Blouse Piece</span>
                <span className="font-medium">{product.blouseIncluded ? 'Included (Unstitched)' : 'Not Included'}</span>
              </div>
            </div>

            {/* Quantity Stepper & Stock */}
            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2C1B16]/80">
                Quantity:
              </label>
              <div className="flex items-center border border-[#2C1B16]/20 rounded bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-black/5 text-sm"
                  disabled={!canOrder}
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-semibold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-black/5 text-sm"
                  disabled={!canOrder}
                >
                  +
                </button>
              </div>

              <span className={`text-xs font-medium ${!canOrder ? 'text-red-700' : product.stock <= 4 ? 'text-amber-700' : 'text-emerald-800'}`}>
                {!canOrder
                  ? 'Currently Out of Stock'
                  : product.stock <= 4
                  ? `Only ${product.stock} drapes remaining!`
                  : 'In Stock & Ready to Ship'}
              </span>
            </div>

            {/* Action Buttons: Add to Bag + Buy Now */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canOrder}
                className="w-full py-3.5 bg-[#5A1022] hover:bg-[#460b19] disabled:opacity-50 disabled:cursor-not-allowed text-[#FFFDF8] text-xs font-semibold uppercase tracking-widest rounded shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>
                  {!canOrder
                    ? (!isCurrentColorAvailable ? 'Selected Shade Out of Stock' : 'Out of Stock')
                    : 'Add to Shopping Bag'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!canOrder}
                className="w-full py-3.5 bg-[#2C1B16] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-[#FFFDF8] text-xs font-semibold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2"
              >
                <span>Instant Buy Now</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Pincode Estimator */}
            <div className="p-4 bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2C1B16]">
                <Truck size={15} className="text-[#5A1022]" /> Check Delivery by Pincode
              </div>
              <form onSubmit={handleCheckDelivery} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode (e.g. 416012)"
                  className="flex-1 px-3 py-1.5 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded text-xs focus:outline-none focus:border-[#5A1022]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2C1B16] text-[#FFFDF8] text-xs font-semibold rounded hover:bg-black transition-colors"
                >
                  Check
                </button>
              </form>
              {deliveryResult && (
                <p className="text-xs text-[#5A1022] mt-1 font-medium">{deliveryResult}</p>
              )}
            </div>

            {/* Direct WhatsApp Concierge Inquiry */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Namaste Virasat Sarees, I have an inquiry about "${product.name}" (Selected Shade: ${selectedColor}). Can you assist me?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs group"
            >
              <MessageCircle size={15} className="text-emerald-700 group-hover:scale-110 transition-transform" />
              <span>Inquire About This Weave on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Detailed Tabs: Weave Details, Care Guide, Shipping & Returns */}
        <div className="pt-8 border-t border-[#2C1B16]/10">
          <div className="flex border-b border-[#2C1B16]/10 gap-8">
            {[
              { id: 'details', label: 'Loom & Weave Details' },
              { id: 'care', label: 'Silk Care Instructions' },
              { id: 'shipping', label: 'Shipping & Authentic Guarantee' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#5A1022] font-semibold'
                    : 'text-[#2C1B16]/60 hover:text-[#2C1B16]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A227]" />
                )}
              </button>
            ))}
          </div>

          <div className="py-6 text-sm text-[#2C1B16]/80 font-light leading-relaxed">
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-3xl">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-[#FDF9F2] rounded border border-[#2C1B16]/10">
                    <strong className="block text-xs uppercase text-[#5A1022] font-semibold">Pallu Motif Work</strong>
                    <span className="text-xs">{product.work}</span>
                  </div>
                  <div className="p-3 bg-[#FDF9F2] rounded border border-[#2C1B16]/10">
                    <strong className="block text-xs uppercase text-[#5A1022] font-semibold">Occasion Suitability</strong>
                    <span className="text-xs">{product.occasion}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-3 max-w-3xl">
                <p>
                  Authentic mulberry silk and tested gold zari require tender preservation to last for generations:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Dry Clean Exclusively:</strong> Never immerse pure silk sarees in harsh chemical detergents or boiling water.</li>
                  <li><strong>Preservation:</strong> Wrap in clean, unbleached white muslin (mul-mul) cloth. Avoid plastic bags that trap humidity.</li>
                  <li><strong>Storage & Aeration:</strong> Unfold and air your saree in a shaded, well-ventilated space once every 6 months to preserve zari creases.</li>
                  <li><strong>Ironing:</strong> Always iron on the reverse side using medium-low heat or a protective press cloth.</li>
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 max-w-3xl">
                <p>
                  Every Virasat saree is accompanied by a certified Silk Mark authentication tag:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Insured Shipping:</strong> Dispatched in tamper-proof waterproof packaging with 100% transit insurance.</li>
                  <li><strong>Hassle-Free Returns:</strong> 7-day exchange window if the weave doesn't meet your utmost expectations.</li>
                  <li><strong>Direct From Looms:</strong> Certified authentic provenance from Yeola, Paithan, Varanasi, and Kanchipuram.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="pt-8 border-t border-[#2C1B16]/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl text-[#2C1B16]">
                Customer Reviews ({product.reviewsCount})
              </h3>
              <p className="text-xs text-[#2C1B16]/60 mt-0.5">
                Authentic testimonials from brides and saree patrons
              </p>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('review-form');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 border border-[#5A1022] text-[#5A1022] hover:bg-[#5A1022] hover:text-white rounded text-xs font-semibold transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Existing reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews?.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-[#FDF9F2] border border-[#2C1B16]/10 rounded-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-semibold text-sm text-[#2C1B16]">
                    {r.userName}
                  </span>
                  <span className="text-[11px] text-[#2C1B16]/50">{r.date}</span>
                </div>
                <div className="flex text-[#C9A227]">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#2C1B16]/80 font-light leading-relaxed">
                  "{r.comment}"
                </p>
                {r.verifiedPurchase && (
                  <span className="text-[10px] text-emerald-800 font-medium inline-block">
                    ✓ Verified Handloom Purchase
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div id="review-form" className="p-6 bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm max-w-xl">
            <h4 className="font-serif text-lg font-medium text-[#2C1B16] mb-3">
              Share Your Saree Experience
            </h4>
            {reviewSubmitted ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200">
                Thank you! Your review has been added to this saree.
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#2C1B16]/70 uppercase font-semibold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Anjali Sharma"
                    className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#2C1B16]/70 uppercase font-semibold mb-1">
                    Rating *
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none"
                  >
                    <option value={5}>5 Stars - Pure Heirloom Perfection</option>
                    <option value={4}>4 Stars - Splendid Craftsmanship</option>
                    <option value={3}>3 Stars - Good Silk Quality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#2C1B16]/70 uppercase font-semibold mb-1">
                    Review Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe the fabric feel, drape weight, zari shine, and event compliments..."
                    className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5A1022] text-[#FFFDF8] uppercase font-semibold tracking-wider rounded hover:bg-[#460b19] transition-colors"
                >
                  Post Review
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Related Sarees Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-[#2C1B16]/10">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C1B16] mb-6">
              You May Also Admire
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
