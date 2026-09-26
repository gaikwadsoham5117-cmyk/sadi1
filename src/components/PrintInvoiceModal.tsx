import React, { useRef, useState } from 'react';
import { Order } from '../../server/types.js';
import {
  X,
  Printer,
  Download,
  FileText,
  Loader2,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import {
  downloadReceiptPdf,
  shareReceiptPdfToWhatsApp,
  printReceiptViaIframe
} from '../services/receipt.js';
import { useSettings } from '../context/SettingsContext.js';

interface PrintInvoiceModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const { settings, formattedWhatsApp } = useSettings();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    subText?: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const invoiceDomRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // 1. Simple, direct Print option
  const handlePrint = () => {
    setStatusMessage({
      text: 'Opening print dialog...',
      type: 'info'
    });
    const success = printReceiptViaIframe(order);
    if (success) {
      setTimeout(() => setStatusMessage(null), 2500);
    } else {
      setStatusMessage({
        text: 'Print dialog opened.',
        type: 'info'
      });
    }
  };

  // 2. Download Official PDF Document
  const handleDownloadPdf = async () => {
    if (!invoiceDomRef.current) return;
    setIsProcessing(true);
    setStatusMessage({
      text: 'Generating High-Resolution PDF Receipt...',
      type: 'info'
    });
    try {
      const res = await downloadReceiptPdf(order, invoiceDomRef.current);
      setStatusMessage({
        text: `PDF Downloaded: ${res.filename}`,
        subText: 'Official document saved to your Downloads folder.',
        type: 'success'
      });
      setTimeout(() => setStatusMessage(null), 4500);
    } catch (e: any) {
      console.error(e);
      setStatusMessage({
        text: 'Could not generate PDF. Opening print dialog...',
        type: 'error'
      });
      handlePrint();
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Share Receipt PDF via WhatsApp (Not as text, but as PDF file document)
  const handleSharePdfToWhatsApp = async () => {
    if (!invoiceDomRef.current) return;
    setIsProcessing(true);
    setStatusMessage({
      text: 'Generating and attaching Receipt PDF for WhatsApp...',
      type: 'info'
    });

    try {
      const result = await shareReceiptPdfToWhatsApp(order, invoiceDomRef.current);

      if (result.sharedViaNative) {
        setStatusMessage({
          text: 'Receipt PDF shared via WhatsApp!',
          subText: 'Official PDF document attached directly in WhatsApp.',
          type: 'success'
        });
      } else {
        // Desktop / Web WhatsApp fallback
        setStatusMessage({
          text: `✅ ${result.filename} generated & downloaded!`,
          subText: 'WhatsApp chat opened for customer. Attach the downloaded PDF document in chat.',
          type: 'success'
        });
      }
      setTimeout(() => setStatusMessage(null), 6000);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        text: 'Error generating PDF for WhatsApp sharing.',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFDF8] border-2 border-[#C9A227] rounded-sm shadow-2xl w-full max-w-3xl my-6 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-[#2C1B16]/10 flex items-center justify-between bg-[#FDF9F2] print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#5A1022]">
              Tax Invoice & Authenticity Certificate
            </span>
            <span className="font-mono text-xs bg-[#5A1022]/10 text-[#5A1022] px-2 py-0.5 rounded font-semibold">
              #{order.orderNumber || order.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#2C1B16]/50 hover:text-[#2C1B16] rounded-full hover:bg-black/5 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Clean, Focused Action Toolbar: PDF WhatsApp Share, Download PDF, and Print */}
        <div className="bg-[#F8F1E5] px-4 py-3 border-b border-[#2C1B16]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs print:hidden shrink-0">
          <div className="flex items-center gap-1.5 text-[#5A1022] font-semibold text-[11px] uppercase tracking-wider">
            <span>Invoice Actions:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Share Receipt PDF on WhatsApp */}
            <button
              onClick={handleSharePdfToWhatsApp}
              disabled={isProcessing}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Generate PDF and share directly to customer on WhatsApp"
            >
              <MessageSquare size={14} />
              <span>Share Receipt PDF (WhatsApp)</span>
            </button>

            {/* Download Official PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isProcessing}
              className="px-3 py-1.5 bg-[#5A1022] hover:bg-[#460b19] disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Download official PDF receipt file"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            {/* Simple Print Option */}
            <button
              onClick={handlePrint}
              disabled={isProcessing}
              className="px-3 py-1.5 bg-white border border-[#2C1B16]/20 hover:bg-[#FDF9F2] text-[#2C1B16] rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Print receipt directly"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Live Status Toast Banner */}
        {statusMessage && (
          <div
            className={`px-4 py-2.5 text-xs flex items-center justify-between border-b transition-all print:hidden ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-red-50 text-red-950 border-red-300'
                : 'bg-[#5A1022] text-[#FFFDF8] border-[#5A1022]'
            }`}
          >
            <div className="flex items-center gap-2">
              {isProcessing ? (
                <Loader2 size={14} className="animate-spin shrink-0 text-[#C9A227]" />
              ) : statusMessage.type === 'success' ? (
                <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
              ) : null}
              <div>
                <p className="font-semibold">{statusMessage.text}</p>
                {statusMessage.subText && (
                  <p className="text-[11px] opacity-90">{statusMessage.subText}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="p-1 opacity-70 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Printable/Capturable Invoice Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF7F0]/50">
          <div
            id="printable-receipt"
            ref={invoiceDomRef}
            className="p-6 sm:p-8 bg-[#FFFDF8] border border-[#C9A227]/50 rounded-sm space-y-6 text-xs text-[#2C1B16] shadow-md max-w-2xl mx-auto"
          >
            {/* Brand Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start pb-5 border-b-2 border-[#5A1022] gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#5A1022]">
                  {settings.storeName}
                </h2>
                <p className="text-[10px] text-[#2C1B16]/60 uppercase tracking-widest mt-0.5">
                  Certified Handloom & Silk Mark Organization of India
                </p>
                <p className="text-[11px] text-[#2C1B16]/75 mt-1.5 leading-relaxed">
                  {settings.storeAddress}<br />
                  GSTIN: 27AABCV8912P1Z4 | Contact: {formattedWhatsApp}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="font-serif text-lg font-bold text-[#2C1B16] uppercase block">
                  Official Tax Invoice
                </span>
                <p className="font-mono text-xs font-semibold text-[#5A1022] mt-0.5">
                  #{order.orderNumber || order.id}
                </p>
                <p className="text-[11px] text-[#2C1B16]/60 mt-0.5">Date: {dateStr}</p>
                <div className="mt-2">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-800 text-white'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-800 text-white'
                        : order.orderStatus === 'Processing'
                        ? 'bg-amber-800 text-white'
                        : 'bg-[#5A1022] text-[#FFFDF8]'
                    }`}
                  >
                    STATUS: {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer & Payment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-5 border-b border-[#2C1B16]/10 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A1022] mb-1">
                  Billed & Delivered To:
                </p>
                <p className="font-bold text-sm text-[#2C1B16]">{order.shippingAddress.fullName}</p>
                <p className="text-[#2C1B16]/80 mt-0.5">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-[#2C1B16]/80">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-[#2C1B16]/80">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="text-[#2C1B16]/80 mt-1">
                  Customer Mobile: <strong>{order.shippingAddress.phone}</strong>
                </p>
                <p className="text-[#2C1B16]/80">Email: {order.shippingAddress.email}</p>
              </div>

              <div className="sm:text-right space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A1022] mb-1">
                  Payment & Dispatch Details:
                </p>
                <p>
                  Payment Method: <strong>{order.paymentMethod.toUpperCase()}</strong>
                </p>
                <p>
                  Payment Status:{' '}
                  <strong className={order.paymentStatus === 'paid' ? 'text-emerald-800' : 'text-amber-800'}>
                    {order.paymentStatus.toUpperCase()}
                  </strong>
                </p>
                {order.razorpayPaymentId && (
                  <p className="font-mono text-[11px] text-[#2C1B16]/70">
                    Razorpay ID: {order.razorpayPaymentId}
                  </p>
                )}
                {order.razorpayOrderId && (
                  <p className="font-mono text-[11px] text-[#2C1B16]/70">
                    Order ID: {order.razorpayOrderId}
                  </p>
                )}
                <p className="text-[#2C1B16]/60">Transit: Insured Courier (Complimentary)</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#2C1B16]/10 bg-[#F8F1E5] text-[#5A1022] uppercase font-semibold text-[11px]">
                    <th className="py-2.5 px-3">Saree & Weave</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Rate</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C1B16]/10">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3">
                        <div className="font-serif font-medium text-[#2C1B16] text-sm">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#2C1B16]/60">
                          Selected Shade: {item.selectedColor || 'Standard'}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold">{item.quantity}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-[#2C1B16]/10 flex flex-col items-end text-xs space-y-1">
              <div className="w-64 flex justify-between">
                <span>Bag Subtotal:</span>
                <span className="font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="w-64 flex justify-between text-emerald-800">
                  <span>Promotional Discount:</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="w-64 flex justify-between">
                <span>Insured Handloom Transit:</span>
                <span className="text-emerald-800 font-semibold">FREE</span>
              </div>
              <div className="w-64 flex justify-between text-[#2C1B16]/60">
                <span>GST 5% Included:</span>
                <span>₹{Math.round(order.total * 0.05).toLocaleString('en-IN')}</span>
              </div>
              <div className="w-64 flex justify-between pt-2 border-t-2 border-[#5A1022] font-serif text-base font-bold text-[#5A1022]">
                <span>Total Paid:</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Silk Mark Promise */}
            <div className="p-3 bg-[#FDF9F2] border border-[#C9A227]/30 rounded text-[11px] text-[#2C1B16]/75">
              <p className="font-semibold text-[#5A1022] mb-0.5">Silk Mark Authenticity Promise:</p>
              <p>
                This saree is hand-inspected for 100% pure silk fiber and tested gold zari. Dry clean only. Preserve wrapped in breathable pure cotton muslin.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-3 sm:p-4 bg-[#FDF9F2] border-t border-[#2C1B16]/10 flex items-center justify-between text-xs print:hidden shrink-0">
          <p className="text-[11px] text-[#2C1B16]/60">
            Certified Tax Invoice & Certificate of Authenticity · Silk Mark Protected
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#2C1B16]/20 rounded text-[#2C1B16] hover:bg-black/5 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
