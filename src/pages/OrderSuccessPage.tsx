import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Order } from '../../server/types.js';
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageSquare,
  RefreshCw,
  Clock,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getCloudinaryUrl } from '../services/cloudinary.js';
import { PrintInvoiceModal } from '../components/PrintInvoiceModal.js';
import { openWhatsAppShare } from '../services/receipt.js';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const fetchOrder = useCallback(
    async (isBackground = false) => {
      if (!orderId) return;
      if (!isBackground) setIsRefreshing(true);
      try {
        const res = await api.getOrder(orderId);
        if (res.success && res.data?.order) {
          setOrder(res.data.order);
          setLastRefreshed(new Date());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [orderId]
  );

  useEffect(() => {
    // Fire festive celebratory confetti on first mount
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5A1022', '#C9A227', '#F8F1E5', '#1B5E20']
      });
    } catch (e) {
      console.error(e);
    }

    if (orderId) {
      try {
        const stored = JSON.parse(localStorage.getItem('virasat_recent_orders') || '[]');
        const updated = Array.from(new Set([orderId, ...stored])).slice(0, 8);
        localStorage.setItem('virasat_recent_orders', JSON.stringify(updated));
      } catch (err) {
        // Ignore
      }
    }

    fetchOrder(false);

    // Auto-poll status every 5 seconds so customer sees admin updates live
    const interval = setInterval(() => {
      fetchOrder(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 bg-[#FFFDF8] text-center">
        <div className="w-8 h-8 border-2 border-[#5A1022] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-serif text-lg text-[#2C1B16]">Retrieving Handloom Order Status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen py-24 bg-[#FFFDF8] text-center px-4">
        <h2 className="font-serif text-2xl text-[#2C1B16] mb-3">Order Not Found</h2>
        <p className="text-xs text-[#2C1B16]/60 mb-6">Could not locate order #{orderId}.</p>
        <Link
          to="/sarees"
          className="px-6 py-2.5 bg-[#5A1022] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded"
        >
          Return to Sarees
        </Link>
      </div>
    );
  }

  // Calculate current active step index (1 to 4)
  const getStepProgress = (status: Order['orderStatus']) => {
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

  const activeStep = getStepProgress(order.orderStatus);

  const steps = [
    {
      num: 1,
      title: 'Order Confirmed',
      desc: 'Registered with Weaver Studio',
      time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      time: activeStep >= 3 ? 'Shipped' : 'Awaiting Loom'
    },
    {
      num: 4,
      title: 'Delivered',
      desc: 'Direct to Customer Doorstep',
      time: activeStep >= 4 ? 'Completed' : 'Expected 3-5 Days'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Celebration Header */}
        <div className="bg-[#FDF9F2] border border-[#C9A227]/40 rounded-sm p-6 sm:p-8 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 bg-[#5A1022] text-[#FFFDF8] rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 size={32} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5A1022]">
            Order Confirmed & Payment Verified
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C1B16] font-normal">
            Thank You for Celebrating Handloom Heritage
          </h1>
          <p className="text-xs text-[#2C1B16]/75 max-w-md mx-auto leading-relaxed">
            Your sacred weave has been registered directly with our artisan center. Confirmation & receipt are saved for order <strong>#{order.orderNumber || order.id}</strong>.
          </p>

          {/* Quick Sharing Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <MessageSquare size={14} />
              <span>Share Invoice (PDF / Image) on WhatsApp</span>
            </button>

            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-4 py-2 bg-[#5A1022] hover:bg-[#460b19] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer size={14} />
              <span>Print / View Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Order Tracking Steps */}
        <div className="bg-[#FFFDF8] border-2 border-[#C9A227]/30 rounded-sm p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2C1B16]/10 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#5A1022]" />
                <h3 className="font-serif text-lg font-semibold text-[#2C1B16]">
                  Live Order Fulfillment Steps
                </h3>
              </div>
              <p className="text-[11px] text-[#2C1B16]/60 mt-0.5">
                Current Status: <strong className="text-[#5A1022] uppercase">{order.orderStatus}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#2C1B16]/50">
                Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <button
                onClick={() => fetchOrder(false)}
                className="p-1.5 bg-[#FDF9F2] hover:bg-[#F8F1E5] border border-[#2C1B16]/15 rounded text-[#2C1B16] text-xs flex items-center gap-1 transition-colors"
                title="Refresh Live Status"
              >
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="text-[11px] font-medium hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stepper Graphic */}
          <div className="relative py-2">
            {/* Connecting Line */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-[#2C1B16]/10 -z-0 hidden sm:block">
              <div
                className="h-full bg-[#5A1022] transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, ((activeStep - 1) / 3) * 100))}%`
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2">
              {steps.map((step) => {
                const isPassed = activeStep > step.num;
                const isCurrent = activeStep === step.num;
                const isUpcoming = activeStep < step.num;

                return (
                  <div
                    key={step.num}
                    className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5 p-3 sm:p-0 rounded ${
                      isCurrent
                        ? 'bg-[#5A1022]/5 sm:bg-transparent border sm:border-0 border-[#5A1022]/30'
                        : ''
                    }`}
                  >
                    {/* Circle Indicator */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors z-10 ${
                        isPassed
                          ? 'bg-[#5A1022] text-[#FFFDF8]'
                          : isCurrent
                          ? 'bg-[#C9A227] text-[#2C1B16] ring-4 ring-[#C9A227]/20 shadow-md animate-pulse'
                          : 'bg-[#F8F1E5] text-[#2C1B16]/40 border border-[#2C1B16]/20'
                      }`}
                    >
                      {isPassed ? '✓' : step.num}
                    </div>

                    {/* Step Info */}
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
                      <span
                        className={`inline-block text-[10px] mt-0.5 font-medium ${
                          isCurrent
                            ? 'text-[#5A1022] font-semibold bg-[#5A1022]/10 px-1.5 py-0.2 rounded'
                            : 'text-[#2C1B16]/40'
                        }`}
                      >
                        {step.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Step Detailed Notification */}
          <div className="p-3.5 bg-[#FDF9F2] border-l-4 border-[#5A1022] rounded-r text-xs text-[#2C1B16] space-y-1">
            <div className="font-semibold text-[#5A1022] flex items-center gap-1.5">
              <Clock size={14} />
              <span>
                {activeStep === 1 && 'Order Confirmed - Preparing Pit Loom Dispatch'}
                {activeStep === 2 && 'Step 2 in Progress: Weaver Quality Audit & Silk Mark Verification'}
                {activeStep === 3 && 'Step 3 in Progress: Handed to Insured Air Courier'}
                {activeStep === 4 && 'Step 4 Complete: Parcel Handed Over to Customer'}
                {activeStep === 0 && 'Order Cancelled'}
              </span>
            </div>
            <p className="text-[#2C1B16]/75 text-[11px] leading-relaxed">
              {activeStep === 1 &&
                'Our master weaver center has received your request. The saree is undergoing primary inspection before tagging.'}
              {activeStep === 2 &&
                'Admin updated status to Processing. Our master weaver in Yeola is performing the Silk Mark burn test, selvedge inspection, and protective muslin cloth packaging.'}
              {activeStep === 3 &&
                'Your parcel is in transit with 100% transit insurance. You will receive an SMS when out for delivery.'}
              {activeStep === 4 &&
                'Your authentic saree has been safely delivered. We hope it graces your auspicious celebrations!'}
            </p>
          </div>
        </div>

        {/* Order Details & Items */}
        <div className="bg-[#FFFDF8] border border-[#2C1B16]/10 rounded-sm p-6 space-y-4">
          <h3 className="font-serif text-lg font-medium text-[#2C1B16] pb-2 border-b border-[#2C1B16]/10">
            Draped Sarees in this Order
          </h3>

          <div className="divide-y divide-[#2C1B16]/10">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center gap-4 text-xs">
                <img
                  src={getCloudinaryUrl(item.image, { width: 100, height: 120, crop: 'fill' })}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded bg-[#F8F1E5] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-semibold text-[#2C1B16]">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#2C1B16]/60 mt-0.5">
                    Shade: {item.selectedColor} · Qty: {item.quantity}
                  </p>
                  <p className="font-serif text-sm text-[#5A1022] font-semibold mt-1">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Payment details summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#2C1B16]/10 text-xs">
            <div>
              <p className="text-[#2C1B16]/50 uppercase font-semibold text-[10px]">
                Shipping Address
              </p>
              <p className="font-bold text-sm text-[#2C1B16] mt-1">{order.shippingAddress.fullName}</p>
              <p className="text-[#2C1B16]/75 text-[11px]">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-[#2C1B16]/75 text-[11px]">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-[#2C1B16]/75 text-[11px]">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-[#2C1B16]/75 text-[11px]">Mobile: <strong>{order.shippingAddress.phone}</strong></p>
            </div>

            <div className="space-y-1">
              <p className="text-[#2C1B16]/50 uppercase font-semibold text-[10px]">
                Payment Summary
              </p>
              <div className="flex justify-between text-[11px]">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[11px] text-emerald-800">
                  <span>Discount:</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px]">
                <span>Shipping:</span>
                <span className="text-emerald-800 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-serif text-sm font-semibold text-[#5A1022] pt-1 border-t border-[#2C1B16]/10">
                <span>Total Paid:</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-[#2C1B16]/60 pt-1">
                Payment Method: {order.paymentMethod.toUpperCase()} (Status: {order.paymentStatus.toUpperCase()})
              </p>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer size={15} />
              <span>Print & Share Receipt (PDF)</span>
            </button>
            <Link
              to={`/track?order=${encodeURIComponent(order.orderNumber || order.id)}`}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#F8F1E5] border border-[#2C1B16]/15 hover:bg-[#5A1022] hover:text-white rounded text-xs font-semibold text-[#2C1B16] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Truck size={15} />
              <span>Live Tracking Page</span>
            </Link>
          </div>

          <Link
            to="/sarees"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#5A1022] hover:bg-[#460b19] text-[#FFFDF8] rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Invoice Modal for clean, reliable printing & WhatsApp sharing */}
      <PrintInvoiceModal
        order={order}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
};
