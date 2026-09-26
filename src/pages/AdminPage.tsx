import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Product, Order } from '../../server/types.js';
import { AdminSidebar } from '../components/AdminSidebar.js';
import { AdminTable } from '../components/AdminTable.js';
import { AdminProductForm } from '../components/AdminProductForm.js';
import { PrintInvoiceModal } from '../components/PrintInvoiceModal.js';
import { openWhatsAppShare, generateStatusUpdateMessage, getOrderTrackingUrl } from '../services/receipt.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  Boxes,
  CheckCircle,
  Clock,
  Truck,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Printer,
  MessageSquare,
  ExternalLink,
  X,
  Settings,
  Save,
  PhoneCall
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'analytics' | 'products' | 'orders' | 'inventory' | 'settings'>('analytics');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Store Settings state
  const { settings, updateSettings, refreshSettings } = useSettings();
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      const ok = await updateSettings(settingsForm);
      if (ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 4000);
      }
    } finally {
      setSettingsSaving(false);
    }
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [lastStatusChange, setLastStatusChange] = useState<{ order: Order; status: string } | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prodsRes, ordsRes, analyticsRes] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getAnalytics()
      ]);

      if (prodsRes.success) setProducts(prodsRes.data.products);
      if (ordsRes.success) setOrders(ordsRes.data.orders);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update
      const res = await api.updateProduct(editingProduct.id, productData);
      if (res.success && res.data?.product) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data.product : p));
      }
    } else {
      // Create
      const res = await api.createProduct(productData);
      if (res.success && res.data?.product) {
        setProducts(prev => [res.data.product, ...prev]);
      }
    }
    // Refresh analytics
    const aRes = await api.getAnalytics();
    if (aRes.success) setAnalytics(aRes.data);
  };

  const handleDeleteProduct = async (id: string) => {
    const res = await api.deleteProduct(id);
    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      const aRes = await api.getAnalytics();
      if (aRes.success) setAnalytics(aRes.data);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const res = await api.updateOrderStatus(orderId, status);
    if (res.success && res.data?.order) {
      const updatedOrder = res.data.order;
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      setLastStatusChange({ order: updatedOrder, status });
      const aRes = await api.getAnalytics();
      if (aRes.success) setAnalytics(aRes.data);
    }
  };

  const handleRestock = async (productId: string, additionalStock = 10) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newStock = prod.stock + additionalStock;
    const res = await api.updateProduct(productId, {
      stock: newStock,
      availability: newStock > 4 ? 'In Stock' : 'Low Stock'
    });
    if (res.success && res.data?.product) {
      setProducts(prev => prev.map(p => p.id === productId ? res.data.product : p));
      const aRes = await api.getAnalytics();
      if (aRes.success) setAnalytics(aRes.data);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF8]">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenNewProductModal={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#2C1B16]/10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1022]">
              Store Administration
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C1B16]">
              {currentTab === 'analytics' && 'Executive Analytics & User Transactions'}
              {currentTab === 'products' && 'Saree Catalog Management'}
              {currentTab === 'orders' && 'Customer Orders & Fulfillment'}
              {currentTab === 'inventory' && 'Inventory Health & Stock Management'}
              {currentTab === 'settings' && 'Store Configuration & WhatsApp Number'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2 border border-[#2C1B16]/20 rounded text-[#2C1B16] hover:bg-[#F8F1E5] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-[#5A1022] hover:bg-[#460b19] text-[#FFFDF8] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus size={14} /> Add Saree
            </button>
          </div>
        </div>

        {/* TAB 1: Comprehensive Analytics */}
        {currentTab === 'analytics' && analytics && (
          <div className="space-y-8">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 bg-white border border-[#2C1B16]/10 rounded-sm shadow-xs">
                <div className="flex items-center justify-between text-[#2C1B16]/60 text-xs mb-2">
                  <span className="font-medium uppercase tracking-wider">Total Sales Revenue</span>
                  <div className="p-2 bg-[#5A1022]/10 text-[#5A1022] rounded">
                    <DollarSign size={16} />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#5A1022] tabular-nums">
                  ₹{analytics.totalRevenue.toLocaleString('en-IN')}
                </h3>
                <p className="text-[11px] text-emerald-800 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp size={12} /> 100% Verified Paid Orders
                </p>
              </div>

              <div className="p-5 bg-white border border-[#2C1B16]/10 rounded-sm shadow-xs">
                <div className="flex items-center justify-between text-[#2C1B16]/60 text-xs mb-2">
                  <span className="font-medium uppercase tracking-wider">Total Orders</span>
                  <div className="p-2 bg-[#C9A227]/10 text-[#C9A227] rounded">
                    <ShoppingBag size={16} />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2C1B16] tabular-nums">
                  {analytics.totalOrders} Transactions
                </h3>
                <p className="text-[11px] text-[#2C1B16]/60 mt-1">
                  {analytics.paidOrders} Completed / 0 Chargebacks
                </p>
              </div>

              <div className="p-5 bg-white border border-[#2C1B16]/10 rounded-sm shadow-xs">
                <div className="flex items-center justify-between text-[#2C1B16]/60 text-xs mb-2">
                  <span className="font-medium uppercase tracking-wider">Average Order Value (AOV)</span>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2C1B16] tabular-nums">
                  ₹{analytics.averageOrderValue.toLocaleString('en-IN')}
                </h3>
                <p className="text-[11px] text-[#2C1B16]/60 mt-1">
                  High-intent luxury saree drapes
                </p>
              </div>

              <div className="p-5 bg-white border border-[#2C1B16]/10 rounded-sm shadow-xs">
                <div className="flex items-center justify-between text-[#2C1B16]/60 text-xs mb-2">
                  <span className="font-medium uppercase tracking-wider">Active Inventory Health</span>
                  <div className="p-2 bg-amber-50 text-amber-700 rounded">
                    <Boxes size={16} />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2C1B16] tabular-nums">
                  {analytics.inventory.totalInventoryItems} Units
                </h3>
                <p className="text-[11px] text-amber-700 font-medium mt-1">
                  {analytics.inventory.lowStockCount} SKUs Low in Stock
                </p>
              </div>
            </div>

            {/* Category Revenue Breakdown & Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Performance */}
              <div className="bg-white border border-[#2C1B16]/10 rounded-sm p-6 shadow-xs">
                <h3 className="font-serif text-lg font-medium text-[#2C1B16] pb-3 border-b border-[#2C1B16]/10 mb-4">
                  Loom Revenue Contribution by Category
                </h3>

                <div className="space-y-4">
                  {Object.entries(analytics.categoryRevenue).map(([cat, data]: [string, any]) => (
                    <div key={cat} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span>{cat} Sarees</span>
                        <span className="tabular-nums font-semibold text-[#5A1022]">
                          ₹{data.revenue.toLocaleString('en-IN')} ({data.count} sold)
                        </span>
                      </div>
                      <div className="w-full bg-[#F8F1E5] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#5A1022] h-full rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((data.revenue / (analytics.totalRevenue || 1)) * 100)
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="bg-white border border-[#2C1B16]/10 rounded-sm p-6 shadow-xs">
                <h3 className="font-serif text-lg font-medium text-[#2C1B16] pb-3 border-b border-[#2C1B16]/10 mb-4">
                  Fulfillment Status Pipeline
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analytics.statusCounts).map(([status, count]: [string, any]) => (
                    <div key={status} className="p-3 bg-[#FDF9F2] border border-[#2C1B16]/10 rounded">
                      <span className="text-[11px] text-[#2C1B16]/60 uppercase font-semibold block">
                        {status}
                      </span>
                      <span className="font-serif text-2xl font-bold text-[#2C1B16] tabular-nums mt-1 block">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inventory Alerts Table */}
            <div className="bg-white border border-[#2C1B16]/10 rounded-sm p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#2C1B16]/10 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-600" />
                  <h3 className="font-serif text-lg font-medium text-[#2C1B16]">
                    Low Stock Attention Warnings (&le; 5 units)
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentTab('inventory')}
                  className="text-xs text-[#5A1022] hover:underline font-semibold"
                >
                  Manage All Inventory &rarr;
                </button>
              </div>

              {analytics.inventory.lowStockItems.length === 0 ? (
                <p className="text-xs text-[#2C1B16]/60">All saree collections are well-stocked.</p>
              ) : (
                <div className="divide-y divide-[#2C1B16]/10 text-xs">
                  {analytics.inventory.lowStockItems.map((item: any) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-serif font-medium text-[#2C1B16]">{item.name}</span>
                        <span className="text-[11px] text-[#2C1B16]/50 ml-2">({item.category})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-700 font-semibold tabular-nums">
                          Only {item.stock} left
                        </span>
                        <button
                          onClick={() => handleRestock(item.id, 10)}
                          className="px-2.5 py-1 bg-[#5A1022] text-[#FFFDF8] rounded text-[11px] font-semibold hover:bg-[#460b19]"
                        >
                          +10 Restock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Saree Catalog Table */}
        {currentTab === 'products' && (
          <div className="space-y-4">
            <AdminTable
              products={products}
              onEdit={(prod) => {
                setEditingProduct(prod);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteProduct}
            />
          </div>
        )}

        {/* TAB 3: Customer Orders Management */}
        {currentTab === 'orders' && (
          <div className="space-y-4">
            {lastStatusChange && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-sm text-xs text-emerald-950 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm animate-in fade-in">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-700" />
                    <span className="font-bold text-sm">
                      Order #{lastStatusChange.order.orderNumber} status changed to "{lastStatusChange.status}"!
                    </span>
                  </div>
                  <p className="text-emerald-800 text-[11px]">
                    Customer live tracking is automatically updated. You can notify the customer directly on WhatsApp or preview what the customer sees.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const msg = generateStatusUpdateMessage(
                        lastStatusChange.order,
                        lastStatusChange.status,
                        getOrderTrackingUrl(lastStatusChange.order)
                      );
                      openWhatsAppShare(lastStatusChange.order, undefined, true, msg);
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageSquare size={13} />
                    <span>Send "{lastStatusChange.status}" WhatsApp to Customer</span>
                  </button>

                  <a
                    href={`/track?order=${encodeURIComponent(lastStatusChange.order.orderNumber || lastStatusChange.order.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#5A1022] hover:bg-[#460b19] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <ExternalLink size={13} />
                    <span>View Customer Tracking Page</span>
                  </a>

                  <button
                    onClick={() => setLastStatusChange(null)}
                    className="p-1.5 text-emerald-800 hover:text-emerald-950 rounded hover:bg-emerald-100"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border border-[#2C1B16]/10 rounded-sm shadow-xs overflow-hidden">
              <div className="p-4 bg-[#FDF9F2] border-b border-[#2C1B16]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-serif text-base font-semibold text-[#2C1B16]">
                    Customer Orders Log ({orders.length})
                  </h3>
                  <p className="text-[11px] text-[#2C1B16]/60">
                    Update status (Processing, Shipped, Delivered) to advance the customer's live tracking progress in real-time
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#2C1B16]/10 bg-[#F8F1E5]/60 text-[#2C1B16]/70 uppercase font-semibold text-[11px]">
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer & Mobile</th>
                      <th className="p-3.5">Items Draped</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Live Status</th>
                      <th className="p-3.5 text-right">Actions & WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C1B16]/5 text-[#2C1B16]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FDF9F2]/60 transition-colors">
                        <td className="p-3.5 font-mono font-medium text-[#5A1022]">
                          <a
                            href={`/track?order=${encodeURIComponent(ord.orderNumber || ord.id)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1"
                            title="Click to view customer live tracking"
                          >
                            <span>{ord.orderNumber || ord.id}</span>
                            <ExternalLink size={10} className="opacity-50" />
                          </a>
                        </td>

                        <td className="p-3.5">
                          <div className="font-medium text-[#2C1B16]">{ord.shippingAddress.fullName}</div>
                          <div className="text-[11px] text-[#2C1B16]/70">
                            {ord.shippingAddress.phone} · {ord.shippingAddress.city}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="max-w-xs truncate">
                            {ord.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                          </div>
                        </td>

                        <td className="p-3.5 tabular-nums font-semibold text-[#2C1B16]">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              ord.paymentStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {ord.paymentMethod.toUpperCase()} · {ord.paymentStatus}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className={`border rounded px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : ord.orderStatus === 'Processing'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : ord.orderStatus === 'Pending'
                                ? 'bg-orange-50 text-orange-800 border-orange-300'
                                : 'bg-white text-[#2C1B16] border-[#2C1B16]/20'
                            }`}
                          >
                            <option value="Pending">0. Pending</option>
                            <option value="Order Placed">1. Order Placed</option>
                            <option value="Confirmed">1. Confirmed</option>
                            <option value="Processing">2. Processing (Loom Audit)</option>
                            <option value="Shipped">3. Shipped (In Transit)</option>
                            <option value="Delivered">4. Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                const msg = generateStatusUpdateMessage(ord, ord.orderStatus, getOrderTrackingUrl(ord));
                                openWhatsAppShare(ord, undefined, true, msg);
                              }}
                              className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors shadow-xs"
                              title="Send current status update & live link to Customer on WhatsApp"
                            >
                              <MessageSquare size={13} />
                              <span className="hidden xl:inline">WhatsApp Status</span>
                            </button>

                            <button
                              onClick={() => setInvoiceOrder(ord)}
                              className="p-1.5 bg-[#5A1022] hover:bg-[#460b19] text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors shadow-xs"
                              title="View, Print & Download PDF / Image Receipt"
                            >
                              <Printer size={13} />
                              <span className="hidden xl:inline">Receipt</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Inventory Health */}
        {currentTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#2C1B16]/10 rounded-sm p-6 shadow-xs">
              <h3 className="font-serif text-lg font-semibold text-[#2C1B16] mb-2">
                Inventory SKU Stock Control
              </h3>
              <p className="text-xs text-[#2C1B16]/60 mb-6">
                Adjust stock levels, set low-stock thresholds, and maintain inventory balance across all saree looms.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#2C1B16]/10 bg-[#F8F1E5]/60 text-[#2C1B16]/70 uppercase font-semibold text-[11px]">
                      <th className="p-3">Saree Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Unit Price</th>
                      <th className="p-3">Current Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C1B16]/5">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#FDF9F2]/50">
                        <td className="p-3 font-serif font-medium text-sm text-[#2C1B16]">
                          {prod.name}
                        </td>
                        <td className="p-3">{prod.category}</td>
                        <td className="p-3 tabular-nums font-medium">₹{prod.price.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-semibold tabular-nums">{prod.stock}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              prod.stock === 0
                                ? 'bg-red-100 text-red-800'
                                : prod.stock <= 5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {prod.availability}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => handleRestock(prod.id, 5)}
                              className="px-2 py-1 bg-white border border-[#2C1B16]/20 rounded text-[11px] hover:bg-[#F8F1E5]"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleRestock(prod.id, 10)}
                              className="px-2 py-1 bg-[#5A1022] text-[#FFFDF8] rounded text-[11px] hover:bg-[#460b19]"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Store Settings & WhatsApp Number */}
        {currentTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white border border-[#2C1B16]/10 rounded-sm p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#5A1022]">
                  Store Settings
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#2C1B16]">
                  Store & WhatsApp Concierge Configuration
                </h3>
                <p className="text-xs text-[#2C1B16]/65 mt-1 leading-relaxed">
                  Configure your store contact information and primary WhatsApp number. When updated, customer-facing buttons (announcement concierge, inquiries, support links, invoice sharing) automatically use this WhatsApp number.
                </p>
              </div>

              {settingsSaved && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle size={16} className="text-emerald-700" />
                  <span>Store settings updated successfully! Customer-facing WhatsApp and contact links are now synced.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                {/* Primary WhatsApp Number */}
                <div className="p-4 bg-[#FDF9F2] border border-[#C9A227]/40 rounded-sm space-y-2">
                  <label className="block font-bold text-xs text-[#5A1022] uppercase tracking-wider">
                    Store WhatsApp Number (with Country Code)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2 bg-white border border-[#2C1B16]/20 rounded text-xs font-bold text-[#5A1022]">
                      WhatsApp
                    </span>
                    <input
                      type="text"
                      required
                      value={settingsForm.adminWhatsAppNumber || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminWhatsAppNumber: e.target.value })}
                      placeholder="e.g. 919356951406"
                      className="flex-1 px-3 py-2 bg-white border border-[#2C1B16]/20 rounded text-xs font-mono font-semibold focus:outline-none focus:border-[#5A1022]"
                    />
                  </div>
                  <p className="text-[11px] text-[#2C1B16]/60 leading-normal">
                    Enter digits with country code (e.g. <code>919356951406</code> for India). Customer inquiry clicks and receipt WhatsApp shares will route to this number.
                  </p>
                </div>

                {/* Store Display Phone & Helpline */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/80">
                    Store Helpline Phone (Display Format)
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.storePhone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storePhone: e.target.value })}
                    placeholder="e.g. +91 93569 51406"
                    className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                  />
                </div>

                {/* Store Name */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/80">
                    Store / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.storeName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    placeholder="Virasat Silk & Sarees"
                    className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                  />
                </div>

                {/* Support Email */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/80">
                    Support / Order Notification Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settingsForm.storeEmail || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeEmail: e.target.value })}
                    placeholder="orders@virasatsarees.com"
                    className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                  />
                </div>

                {/* Store Address */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1 text-[11px] text-[#2C1B16]/80">
                    Showroom Address
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={settingsForm.storeAddress || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
                    placeholder="Showroom No. 12, Mahadwar Road, Rajarampuri, Kolhapur, Maharashtra 416012"
                    className="w-full px-3 py-2 bg-[#FDF9F2] border border-[#2C1B16]/20 rounded focus:outline-none focus:border-[#5A1022]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="px-6 py-2.5 bg-[#5A1022] hover:bg-[#460b19] disabled:opacity-50 text-[#FFFDF8] rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Save size={15} />
                    <span>{settingsSaving ? 'Saving Changes...' : 'Save Settings'}</span>
                  </button>

                  <a
                    href={`https://wa.me/${(settingsForm.adminWhatsAppNumber || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1.5"
                  >
                    <PhoneCall size={14} />
                    <span>Test WhatsApp Link &rarr;</span>
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Admin Product Form Modal */}
      <AdminProductForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      {/* Tax Invoice Modal for Print and WhatsApp */}
      {invoiceOrder && (
        <PrintInvoiceModal
          order={invoiceOrder}
          isOpen={Boolean(invoiceOrder)}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
