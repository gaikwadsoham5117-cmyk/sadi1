import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Order } from '../../server/types.js';
import {
  Search,
  Truck,
  Clock,
  CheckCircle2,
  MessageSquare,
  Printer,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  FileText
} from 'lucide-react';
import { getCloudinaryUrl } from '../services/cloudinary.js';
import { openWhatsAppShare, getOrderTrackingUrl, printReceiptViaIframe } from '../services/receipt.js';
import { PrintInvoiceModal } from '../components/PrintInvoiceModal.js';

export const TrackOrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('order') || searchParams.get('id');

  const initialQuery = orderId || queryParam || '';
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [recentOrders, setRecentOrders] = useState<string[]>([]);

  // Load recent local orders
  useEffect(() => {
    try {
      const stored = localStorage.getItem('virasat_recent_orders');
      if (stored) {
        setRecentOrders(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const fetchOrderByQuery = useCallback(async (query: string, isSilent = false) => {
    if (!query.trim()) return;
    if (!isSilent) setLoading(true);
    else setIsRefreshing(true);
    setSearched(true);

    try {
      // 1. Direct fetch by ID
      const direct = await api.getOrder(query.trim());
      if (direct.success && direct.data?.order) {
        setOrder(direct.data.order);
        setLastUpdated(new Date());
        return;
      }

      // 2. Search all orders by orderNumber, phone, or email
      const allRes = await api.getOrders();
      if (allRes.success) {
        const found = allRes.data.orders.find(
          (o) =>
            o.id.toLowerCase() === query.trim().toLowerCase() ||
            o.orderNumber.toLowerCase() === query.trim().toLowerCase() ||
            o.shippingAddress.phone.replace(/[^0-9]/g, '').includes(query.trim().replace(/[^0-9]/g, '')) ||
            o.shippingAddress.email.toLowerCase() === query.trim().toLowerCase()
        );
        setOrder(found || null);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error(err);
      if (!isSilent) setOrder(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load if query is in URL
  useEffect(() => {
    const target = orderId || queryParam;
    if (target) {
      setSearchInput(target);
      fetchOrderByQuery(target);
    }
  }, [orderId, queryParam, fetchOrderByQuery]);

  // Live auto-polling every 4 seconds when order is loaded
  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      fetchOrderByQuery(order.orderNumber || order.id, true);
    }, 4000);

    return () => clearInterval(interval);
  }, [order?.id, order?.orderNumber, fetchOrderByQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderByQuery(searchInput);
  };

  const getStepProgress = (status?: Order['orderStatus']) => {
    switch (status) {
      case 'Order Placed':
      case 'Confirmed':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const activeStep = getStepProgress(order?.orderStatus);

  const steps = [
    {
      num: 1,
      title: 'Order Confirmed',
      desc: 'Registered with Weaver Studio',
      time: order ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    },
    {
      num: 2,
      title: 'Loom Processing',
      desc: 'Silk Mark & Zari Audit',
      time: activeStep >= 2 ? 'In Progress' : 'Pending'
    },
    {
      num: 3,
      title: 'Dispatched',
      desc: 'Insured Air Express Courier',
      time: activeStep >= 3 ? 'In Transit' : 'Awaiting Loom'
    },
    {
      num: 4,
      title: 'Delivered',
      desc: 'Safely Handed to Customer',
      time: activeStep >= 4 ? 'Completed' : 'Expected 3-5 Days'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#5A1022] font-semibold uppercase tracking-widest bg-[#5A1022]/10 px-3 py-1 rounded">
            <Sparkles size={13} className="text-[#C9A227]" /> Live Handloom Tracking
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C1B16] font-normal">
            Track Saree Order Progress
          </h1>
          <p className="text-xs text-[#2C1B16]/65 max-w-md mx-auto leading-relaxed">
            Enter your Order Number (e.g. <strong>VIR-2026-8941</strong>) or registered phone number to view live fulfillment updates.
          </p>
        </div>

        {/* Search Bar */}
        <div className="space-y-3 max-w-lg mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2C1B16]/40" />
              <input
                type="text"
                required
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order Number or 10-digit Mobile..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded text-xs text-[#2C1B16] focus:outline-none focus:border-[#5A1022] shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#5A1022] hover:bg-[#460b19] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors whitespace-nowrap shadow-sm"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Recent Orders Pills */}
          {recentOrders.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#2C1B16]/70">
              <span className="text-[11px] text-[#2C1B16]/50">Your Recent Orders:</span>
              {recentOrders.slice(0, 3).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setSearchInput(num);
                    fetchOrderByQuery(num);
                  }}
                  className="px-2 py-0.5 bg-[#F8F1E5] hover:bg-[#5A1022] hover:text-white rounded border border-[#2C1B16]/15 font-mono text-[11px] transition-colors"
                >
                  #{num}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {order ? (
          <div className="bg-[#FFFDF8] border-2 border-[#C9A227]/40 rounded-sm p-6 sm:p-8 space-y-6 shadow-md animate-in fade-in">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2C1B16]/10 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#5A1022] bg-[#5A1022]/10 px-2.5 py-0.5 rounded">
                    #{order.orderNumber || order.id}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : order.orderStatus === 'Processing'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-[#5A1022] text-[#FFFDF8]'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-[#2C1B16]/60 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchOrderByQuery(order.orderNumber || order.id, false)}
                  className="p-2 bg-[#FDF9F2] hover:bg-[#F8F1E5] border border-[#2C1B16]/15 rounded text-[#2C1B16] text-xs flex items-center gap-1 transition-colors"
                  title="Refresh Live Status"
                >
                  <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#5A1022]' : ''} />
                  <span className="text-[11px] font-medium hidden sm:inline">Live Refresh</span>
                </button>

                <button
                  onClick={() => printReceiptViaIframe(order)}
                  className="p-2 bg-[#FDF9F2] hover:bg-[#F8F1E5] border border-[#2C1B16]/15 rounded text-[#2C1B16] text-xs flex items-center gap-1 transition-colors"
                  title="Print official receipt"
                >
                  <Printer size={13} />
                  <span className="text-[11px] font-medium hidden sm:inline">Print</span>
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>Share Image / PDF Receipt</span>
                </button>
              </div>
            </div>

            {/* Stepper Graphic */}
            <div className="relative py-2">
              {/* Connecting Line */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-[#2C1B16]/10 -z-0 hidden sm:block">
                <div
                  className="h-full bg-[#5A1022] transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((activeStep - 1) / 3) * 100))}%`
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
                {steps.map((step) => {
                  const isPassed = activeStep > step.num;
                  const isCurrent = activeStep === step.num;

                  return (
                    <div
                      key={step.num}
                      className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5 p-3 sm:p-0 rounded transition-all ${
                        isCurrent
                          ? 'bg-[#5A1022]/5 sm:bg-transparent border sm:border-0 border-[#5A1022]/30'
                          : ''
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          isPassed
                            ? 'bg-[#5A1022] text-[#FFFDF8]'
                            : isCurrent
                            ? 'bg-[#C9A227] text-[#2C1B16] ring-4 ring-[#C9A227]/30 shadow-md scale-110'
                            : 'bg-[#F8F1E5] text-[#2C1B16]/40 border border-[#2C1B16]/20'
                        }`}
                      >
                        {isPassed ? '✓' : step.num}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-xs font-semibold ${
                            isCurrent
                              ? 'text-[#5A1022] font-bold'
                              : isPassed
                              ? 'text-[#2C1B16]'
                              : 'text-[#2C1B16]/40'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-[11px] text-[#2C1B16]/60 leading-tight">
                          {step.desc}
                        </p>
                        {isCurrent && (
                          <span className="inline-block text-[10px] mt-0.5 font-bold text-[#5A1022] bg-[#5A1022]/10 px-2 py-0.5 rounded">
                            CURRENT STAGE
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Stage Explanation Banner */}
            <div className="p-4 bg-[#FDF9F2] border-l-4 border-[#5A1022] rounded-r text-xs space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-[#5A1022] font-serif text-sm flex items-center gap-1.5">
                  <Clock size={15} />
                  <span>
                    {activeStep === 1 && 'Step 1: Order Confirmed & Queued at Handloom Loom'}
                    {activeStep === 2 && 'Step 2: Loom Processing (Silk Mark & Zari Audit)'}
                    {activeStep === 3 && 'Step 3: Dispatched via Insured Air Express'}
                    {activeStep === 4 && 'Step 4: Delivered to Customer Doorstep'}
                    {activeStep === 0 && 'Order Cancelled'}
                  </span>
                </strong>
                <span className="text-[10px] text-[#2C1B16]/50">
                  Live sync {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <p className="text-[#2C1B16]/80 text-xs leading-relaxed pt-1">
                {activeStep === 1 &&
                  'Your order has been officially received. Our artisan coordinators in Yeola are preparing your saree batch.'}
                {activeStep === 2 &&
                  'The admin has marked your order as Processing. Master weavers are inspecting the pure silk weave density, testing gold zari threads, and wrapping the saree in protective cotton muslin.'}
                {activeStep === 3 &&
                  'Your saree is on its way with Insured Air Courier. Safe transit guaranteed.'}
                {activeStep === 4 &&
                  'Your handloom saree has been delivered! We hope it brings auspicious blessings to your celebrations.'}
              </p>
            </div>

            {/* Draped items list */}
            <div className="divide-y divide-[#2C1B16]/10 pt-2 border-t border-[#2C1B16]/10">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={getCloudinaryUrl(item.image, { width: 90, height: 110, crop: 'fill' })}
                      alt={item.name}
                      className="w-14 h-16 object-cover rounded bg-[#F8F1E5]"
                    />
                    <div>
                      <h4 className="font-serif font-semibold text-sm text-[#2C1B16]">{item.name}</h4>
                      <p className="text-[11px] text-[#2C1B16]/60">Shade: {item.selectedColor} · Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-sm text-[#5A1022]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery address & totals */}
            <div className="p-4 bg-[#FFFDF8] border border-[#2C1B16]/10 rounded text-xs text-[#2C1B16]/80 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A1022]">Delivered To:</p>
                <p className="font-bold text-sm text-[#2C1B16] mt-0.5">{order.shippingAddress.fullName}</p>
                <p className="text-[#2C1B16]/75 text-xs">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-[#2C1B16]/75 text-xs">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-[#2C1B16]/75 text-xs">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-[#2C1B16]/75 text-xs mt-1">Mobile: <strong>{order.shippingAddress.phone}</strong></p>
              </div>

              <div className="sm:text-right space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A1022]">Payment:</p>
                <p className="font-serif text-lg font-bold text-[#5A1022]">
                  ₹{order.total.toLocaleString('en-IN')}
                </p>
                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-[10px] uppercase">
                  {order.paymentMethod.toUpperCase()} · {order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2.5 bg-[#5A1022] hover:bg-[#460b19] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <FileText size={15} />
                <span>View & Download Official PDF / Image Receipt</span>
              </button>

              <button
                onClick={() => openWhatsAppShare(order)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <MessageSquare size={15} />
                <span>Share Live Tracking on WhatsApp</span>
              </button>
            </div>
          </div>
        ) : searched && !loading ? (
          <div className="p-8 text-center bg-[#FDF9F2] border border-[#2C1B16]/10 rounded-sm space-y-3">
            <h3 className="font-serif text-lg text-[#2C1B16]">No Order Found for "{searchInput}"</h3>
            <p className="text-xs text-[#2C1B16]/60 max-w-sm mx-auto">
              Please check your Order Number (e.g. <strong>VIR-2026-8941</strong>) or 10-digit mobile number.
            </p>
            <div className="pt-1">
              <Link
                to="/sarees"
                className="inline-block px-4 py-2 bg-[#5A1022] text-white rounded text-xs font-semibold"
              >
                Browse Sarees
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {/* Invoice Modal for clean PDF / Image download & WhatsApp sharing */}
      {order && (
        <PrintInvoiceModal
          order={order}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
