import { Order } from '../../server/types.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { api } from './api.js';

export function getOrderTrackingUrl(order: Order): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/track?order=${encodeURIComponent(order.orderNumber || order.id)}`;
}

export function generateWhatsAppMessage(order: Order, trackUrl?: string, customHeader?: string): string {
  const appUrl = trackUrl || getOrderTrackingUrl(order);
  const header = customHeader || '👑 *VIRASAT SILK & SAREES - TAX INVOICE* 👑';

  return `${header}
Namaste *${order.shippingAddress.fullName}* ji!

Your official Tax Invoice & Authenticity Certificate for Order *#${order.orderNumber || order.id}* is generated.

📄 *View & Download Invoice (PDF / JPG / PNG):*
🔗 ${appUrl}

*Total Paid:* ₹${order.total.toLocaleString('en-IN')} (${order.paymentMethod.toUpperCase()})
✨ *Silk Mark Certified 100% Pure Mulberry Silk & Tested Gold Zari*
📍 Showroom: Rajarampuri, Kolhapur | WhatsApp: +91 93569 51406`;
}

export function generateStatusUpdateMessage(order: Order, status: string, trackUrl?: string): string {
  const appUrl = trackUrl || getOrderTrackingUrl(order);

  let statusDescription = '';
  if (status === 'Processing') {
    statusDescription =
      'Our master weaver center in Yeola has begun Weaver Loom Audit, Silk Mark fiber burn testing, and pure zari electroplate inspection.';
  } else if (status === 'Shipped') {
    statusDescription =
      'Your authentic drape has been packed in protective cotton muslin and handed over to our Insured Air Express courier partner.';
  } else if (status === 'Delivered') {
    statusDescription =
      'Your order has been safely handed over at your doorstep! We hope this heirloom brings eternal grace to your celebrations.';
  } else if (status === 'Confirmed') {
    statusDescription =
      'Your order and payment have been verified and queued for handloom artisan fulfillment.';
  } else {
    statusDescription = `Your order status has been updated to ${status}.`;
  }

  return `👑 *VIRASAT SILK & SAREES - ORDER STATUS UPDATE* 👑
-------------------------------------
Namaste *${order.shippingAddress.fullName}* ji!

Your handloom saree order *#${order.orderNumber || order.id}* has been updated to:
⭐ *STATUS: ${status.toUpperCase()}* ⭐

*What happens now:*
${statusDescription}

*Live Tracking & Step Progress:*
Click below to view the interactive 4-stage tracking progress & download your official tax invoice:
🔗 ${appUrl}

*Order Items:*
${order.items.map((i) => `• ${i.name} (x${i.quantity})`).join('\n')}

📍 *Virasat Flagship Showroom:* Mahadwar Road, Rajarampuri, Kolhapur
📞 *Support Helpline:* +91 93569 51406
Thank you for supporting handloom weaving artisans! 🌸`;
}

export function openWhatsAppShare(
  order: Order,
  trackUrl?: string,
  directToCustomer = true,
  customMessage?: string
) {
  const message = customMessage || generateWhatsAppMessage(order, trackUrl);
  const encoded = encodeURIComponent(message);

  let phone = '';
  if (directToCustomer && order.shippingAddress.phone) {
    phone = order.shippingAddress.phone.replace(/[^0-9]/g, '');
    if (phone.length === 10) {
      phone = '91' + phone;
    }
  }

  const url = phone
    ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;

  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Capture receipt DOM element as high-resolution canvas
 */
export async function captureReceiptCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  return await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#FFFDF8',
    logging: false
  });
}

/**
 * Copy image directly to system clipboard (PNG blob)
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 1.0));
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        return true;
      }
    }
  } catch (err) {
    console.warn('Clipboard write image not supported or permitted', err);
  }
  return false;
}

/**
 * Download Receipt as PDF
 */
export async function downloadReceiptPdf(order: Order, element: HTMLElement): Promise<{ filename: string; blob: Blob }> {
  const canvas = await captureReceiptCanvas(element);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  const filename = `Virasat_Invoice_${order.orderNumber || order.id}.pdf`;
  pdf.save(filename);

  const blob = pdf.output('blob');
  return { filename, blob };
}

/**
 * Download Receipt as PNG or JPEG image
 */
export async function downloadReceiptImage(
  order: Order,
  element: HTMLElement,
  format: 'png' | 'jpeg' = 'jpeg'
): Promise<{ dataUrl: string; blob: Blob; filename: string }> {
  const canvas = await captureReceiptCanvas(element);
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), mimeType, 0.95);
  });

  const filename = `Virasat_Receipt_${order.orderNumber || order.id}.${format === 'png' ? 'png' : 'jpg'}`;

  // Trigger browser download
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();

  return { dataUrl, blob, filename };
}

export interface ShareReceiptResult {
  sharedViaNative: boolean;
  copiedToClipboard: boolean;
  downloaded: boolean;
  imageUrl?: string;
  format: 'jpeg' | 'png' | 'pdf';
}

/**
 * Share receipt directly via device native share or WhatsApp Web
 * 1. Attaches the actual image/PDF file directly if Web Share API with files is supported (mobile Android/iOS)
 * 2. Downloads the file to the user's device
 * 3. Copies the image to the clipboard (so user can simply paste Ctrl+V in WhatsApp Web)
 * 4. Uploads to Cloudinary for permanent image preview URL
 * 5. Opens WhatsApp with customer phone and direct links
 */
export async function shareReceiptDirectly(
  order: Order,
  element: HTMLElement,
  format: 'jpeg' | 'png' | 'pdf' = 'jpeg'
): Promise<ShareReceiptResult> {
  const orderNum = order.orderNumber || order.id;
  const canvas = await captureReceiptCanvas(element);
  const trackUrl = getOrderTrackingUrl(order);

  // Copy to clipboard first so user can simply paste into WhatsApp
  let copiedToClipboard = false;
  try {
    copiedToClipboard = await copyCanvasToClipboard(canvas);
  } catch (e) {
    // Ignore clipboard errors
  }

  // 1. Prepare file and trigger local download
  let fileToShare: File | null = null;
  let downloaded = false;

  if (format === 'pdf') {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output('blob');
    const filename = `Virasat_Invoice_${orderNum}.pdf`;
    fileToShare = new File([pdfBlob], filename, { type: 'application/pdf' });
    
    // Trigger download
    pdf.save(filename);
    downloaded = true;
  } else {
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const ext = format === 'png' ? 'png' : 'jpg';
    const filename = `Virasat_Receipt_${orderNum}.${ext}`;
    const imageBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), mime, 0.95);
    });
    fileToShare = new File([imageBlob], filename, { type: mime });

    // Trigger download
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL(mime, 0.95);
    link.click();
    downloaded = true;
  }

  // 2. Upload to Cloudinary in background for permanent public viewable image link
  let uploadedUrl = '';
  try {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const uploadRes = await api.uploadImage(dataUrl);
    if (uploadRes.success && uploadRes.data?.url) {
      uploadedUrl = uploadRes.data.url;
    }
  } catch (err) {
    console.warn('Could not upload receipt to Cloudinary, continuing', err);
  }

  // 3. Check if Web Share API with files is supported (Android Chrome, iOS Safari, etc.)
  if (
    fileToShare &&
    typeof navigator !== 'undefined' &&
    'canShare' in navigator &&
    navigator.canShare({ files: [fileToShare] })
  ) {
    try {
      await navigator.share({
        files: [fileToShare],
        title: `Tax Invoice #${orderNum} - Virasat Silk & Sarees`,
        text: `👑 Virasat Silk & Sarees Official Receipt #${orderNum} for ${order.shippingAddress.fullName}.\nTrack live fulfillment: ${trackUrl}`
      });
      return {
        sharedViaNative: true,
        copiedToClipboard,
        downloaded,
        imageUrl: uploadedUrl,
        format
      };
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return {
          sharedViaNative: true,
          copiedToClipboard,
          downloaded,
          imageUrl: uploadedUrl,
          format
        };
      }
      console.warn('Native share failed, continuing with WhatsApp Web fallback', e);
    }
  }

  // 4. WhatsApp Web fallback with formatted message and direct Cloudinary image view
  const mediaMessage = `👑 *VIRASAT SILK & SAREES - OFFICIAL TAX INVOICE* 👑
-------------------------------------
*Order Number:* ${orderNum}
*Customer:* ${order.shippingAddress.fullName}
*Current Live Status:* *${order.orderStatus.toUpperCase()}*

📄 *Direct High-Resolution ${format.toUpperCase()} Receipt:*
${uploadedUrl ? `🖼️ ${uploadedUrl}\n` : ''}
🔗 *Live 4-Stage Handloom Order Tracking:*
${trackUrl}

*Total Paid:* ₹${order.total.toLocaleString('en-IN')} (${order.paymentMethod.toUpperCase()} - ${order.paymentStatus.toUpperCase()})
-------------------------------------
✨ Certified Handloom & Silk Mark Organization
📞 Support & Concierge: +91 93569 51406`;

  openWhatsAppShare(order, trackUrl, true, mediaMessage);

  return {
    sharedViaNative: false,
    copiedToClipboard,
    downloaded,
    imageUrl: uploadedUrl,
    format
  };
}

/**
 * Generates the complete receipt as a PDF and shares it to the customer via WhatsApp.
 * Strictly adheres to requirement:
 * - Receipt shared as a PDF (not plain text)
 * - Contains complete store, order, customer, product variant, and pricing details
 * - Uses Web Share API to attach the PDF file directly to WhatsApp on mobile
 * - Saves the PDF and opens customer's WhatsApp chat on desktop
 */
export async function shareReceiptPdfToWhatsApp(
  order: Order,
  element: HTMLElement
): Promise<{ sharedViaNative: boolean; filename: string; downloaded: boolean }> {
  const orderNum = order.orderNumber || order.id;
  const canvas = await captureReceiptCanvas(element);
  const trackUrl = getOrderTrackingUrl(order);

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfWidth, pdfHeight);

  const filename = `Virasat_Invoice_${orderNum}.pdf`;
  const pdfBlob = pdf.output('blob');
  const fileToShare = new File([pdfBlob], filename, { type: 'application/pdf' });

  // Save the PDF locally for the user
  pdf.save(filename);

  // Check if Web Share API with files is supported (mobile Android Chrome, iOS Safari, etc.)
  if (
    typeof navigator !== 'undefined' &&
    'canShare' in navigator &&
    navigator.canShare({ files: [fileToShare] })
  ) {
    try {
      await navigator.share({
        files: [fileToShare],
        title: `Official Tax Invoice PDF #${orderNum}`,
        text: `Namaste ${order.shippingAddress.fullName} ji! Here is your official Tax Invoice PDF for Order #${orderNum} from Virasat Silk & Sarees.`
      });
      return { sharedViaNative: true, filename, downloaded: true };
    } catch (e: any) {
      if (e.name === 'AbortError') {
        return { sharedViaNative: true, filename, downloaded: true };
      }
      console.warn('Native PDF share aborted, continuing with WhatsApp Web fallback', e);
    }
  }

  // Desktop or non-native fallback: Open customer's WhatsApp with clear invoice PDF notice
  const pdfNotice = `👑 *VIRASAT SILK & SAREES - OFFICIAL TAX INVOICE (PDF)* 👑
-------------------------------------
Namaste *${order.shippingAddress.fullName}* ji!

Your official Tax Invoice & Authenticity Certificate PDF for Order *#${orderNum}* has been generated:
📄 *Document:* ${filename}
💰 *Total Paid:* ₹${order.total.toLocaleString('en-IN')} (${order.paymentMethod.toUpperCase()})
⭐ *Live Status:* ${order.orderStatus.toUpperCase()}

Please find the attached PDF invoice document.
🔗 Track Live Order: ${trackUrl}
-------------------------------------
✨ Certified 100% Pure Mulberry Silk & Tested Gold Zari
📍 Virasat Silk & Sarees Flagship Showroom`;

  openWhatsAppShare(order, trackUrl, true, pdfNotice);
  return { sharedViaNative: false, filename, downloaded: true };
}

/**
 * Reliable Hidden Iframe Print implementation.
 * Fixes "print receipt not working" inside iframes and sandboxed environments!
 */
export function printReceiptViaIframe(order: Order): boolean {
  try {
    const printHtml = generatePrintableReceiptHtml(order);

    // Remove any existing frame
    const existing = document.getElementById('virasat-print-frame');
    if (existing) {
      existing.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'virasat-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      window.print();
      return false;
    }

    doc.open();
    doc.write(printHtml);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          iframe.remove();
        }, 3000);
      } catch (err) {
        console.error('Iframe print error', err);
        window.print();
      }
    }, 450);

    return true;
  } catch (error) {
    console.error('Print receipt failed', error);
    window.print();
    return false;
  }
}

export function generatePrintableReceiptHtml(order: Order): string {
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px 8px; font-weight: 500;">
        ${item.name}
        <div style="font-size: 11px; color: #666;">Shade: ${item.selectedColor || 'Standard'}</div>
      </td>
      <td style="padding: 10px 8px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 8px; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
      <td style="padding: 10px 8px; text-align: right; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${order.orderNumber || order.id} - Virasat Silk & Sarees</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #2C1B16;
            margin: 0;
            padding: 20px;
            background: #fff;
          }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            border: 1px solid #C9A227;
            padding: 28px;
            background: #FFFDF8;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #5A1022;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .brand-title {
            font-family: Georgia, serif;
            font-size: 24px;
            color: #5A1022;
            margin: 0;
            font-weight: bold;
          }
          .brand-subtitle {
            font-size: 10px;
            color: #777;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 3px;
          }
          .invoice-title {
            text-align: right;
          }
          .invoice-title h2 {
            margin: 0;
            color: #2C1B16;
            font-size: 18px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
            font-size: 12px;
            line-height: 1.5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 20px;
          }
          th {
            background: #F8F1E5;
            color: #5A1022;
            padding: 8px;
            text-align: left;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
          }
          .totals {
            margin-left: auto;
            width: 270px;
            font-size: 12px;
            line-height: 1.7;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
          }
          .grand-total {
            border-top: 2px solid #5A1022;
            margin-top: 6px;
            padding-top: 6px;
            font-size: 15px;
            font-weight: bold;
            color: #5A1022;
          }
          .footer {
            margin-top: 28px;
            padding-top: 14px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 11px;
            color: #777;
          }
          .status-badge {
            display: inline-block;
            background: #5A1022;
            color: #fff;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
          }
          @media print {
            body { padding: 0; background: #fff; }
            .invoice-box { border: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <h1 class="brand-title">Virasat Silk & Sarees</h1>
              <div class="brand-subtitle">Certified Handloom & Silk Mark Organization of India</div>
              <div style="font-size: 11px; color: #555; margin-top: 4px;">
                Showroom No. 12, Mahadwar Road, Rajarampuri, Kolhapur, Maharashtra 416012<br>
                GSTIN: 27AABCV8912P1Z4 | Contact: +91 93569 51406
              </div>
            </div>
            <div class="invoice-title">
              <h2>OFFICIAL TAX INVOICE</h2>
              <div style="font-size: 12px; margin-top: 4px;">
                <strong>Invoice #:</strong> ${order.orderNumber || order.id}<br>
                <strong>Date:</strong> ${dateStr}<br>
                <div style="margin-top: 6px;">
                  <span class="status-badge">${order.orderStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid">
            <div>
              <strong style="color: #5A1022; text-transform: uppercase;">Billed & Delivered To:</strong><br>
              <strong>${order.shippingAddress.fullName}</strong><br>
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br>
              Mobile: <strong>${order.shippingAddress.phone}</strong><br>
              Email: ${order.shippingAddress.email}
            </div>
            <div>
              <strong style="color: #5A1022; text-transform: uppercase;">Payment Details:</strong><br>
              <strong>Method:</strong> ${order.paymentMethod.toUpperCase()}<br>
              <strong>Status:</strong> ${order.paymentStatus.toUpperCase()}<br>
              ${order.razorpayPaymentId ? `<strong>Razorpay ID:</strong> ${order.razorpayPaymentId}<br>` : ''}
              ${order.razorpayOrderId ? `<strong>Order ID:</strong> ${order.razorpayOrderId}<br>` : ''}
              <strong>Transit:</strong> Insured Handloom Express (Complimentary)
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Saree & Specifications</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Bag Subtotal:</span>
              <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            ${
              order.discount > 0
                ? `<div class="totals-row" style="color: #1b5e20;">
                    <span>Promotional Discount:</span>
                    <span>-₹${order.discount.toLocaleString('en-IN')}</span>
                   </div>`
                : ''
            }
            <div class="totals-row">
              <span>Insured Transit Courier:</span>
              <span style="font-weight: bold; color: #1b5e20;">FREE</span>
            </div>
            <div class="totals-row">
              <span>Taxes (GST 5% included):</span>
              <span>₹${Math.round(order.total * 0.05).toLocaleString('en-IN')}</span>
            </div>
            <div class="totals-row grand-total">
              <span>Total Paid:</span>
              <span>₹${order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="footer">
            <p><strong>Authenticity Guarantee & Care:</strong></p>
            <p>Certified pure mulberry silk and tested gold zari. Dry clean only. Wrapped in pure cotton muslin.</p>
            <p>© ${new Date().getFullYear()} Virasat Silk & Sarees. Flagship Showroom, Kolhapur.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
