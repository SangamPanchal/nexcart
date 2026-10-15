import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  DollarSign,
  Users,
} from 'lucide-react';
import { AdminSalesDTO, Product } from '../types';
import { adminAPI, productAPI, paymentAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'products' | 'payment-test'>('sales');
  const [sales, setSales] = useState<AdminSalesDTO[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    stockQuantity: '',
    productCategory: '',
  });

  // Stripe Payment Tester state
  const [testAmount, setTestAmount] = useState('500');
  const [testDesc, setTestDesc] = useState('Test Product Payment');
  const [stripeUrl, setStripeUrl] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  // Auth test state
  const [authTestOutput, setAuthTestOutput] = useState<string | null>(null);

  const { user, isAdminMode, setIsAdminMode } = useAuth();
  const { showToast } = useToast();

  const fetchSales = async () => {
    setSalesLoading(true);
    try {
      const data = await adminAPI.getSalesDashboard();
      setSales(data);
    } catch (err: any) {
      showToast(`Failed to load sales: ${err.message}`, 'error');
    } finally {
      setSalesLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err: any) {
      showToast(`Failed to load products: ${err.message}`, 'error');
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sales') {
      fetchSales();
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      productName: '',
      productDescription: '',
      productPrice: '',
      stockQuantity: '',
      productCategory: '',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      productName: p.productName,
      productDescription: p.productDescription,
      productPrice: p.productPrice.toString(),
      stockQuantity: p.stockQuantity.toString(),
      productCategory: p.productCategory,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        productPrice: parseFloat(formData.productPrice) || 0,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        productCategory: formData.productCategory,
      };

      if (editingProduct && editingProduct.productId) {
        await productAPI.update(editingProduct.productId, payload);
        showToast(`Product "${payload.productName}" updated!`, 'success');
      } else {
        await productAPI.create(payload);
        showToast(`Product "${payload.productName}" created!`, 'success');
      }
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.delete(id);
      showToast('Product deleted successfully', 'success');
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleCreateStripeSession = async () => {
    setStripeLoading(true);
    setStripeUrl(null);
    try {
      const url = await paymentAPI.createCheckoutSession(
        parseFloat(testAmount) || 100,
        testDesc || 'Test Order'
      );
      setStripeUrl(url);
      showToast('Stripe Checkout session URL generated!', 'success');
    } catch (err: any) {
      showToast(`Stripe error: ${err.message}`, 'error');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleTestAuth = async () => {
    try {
      const res = await authAPI.testAuth();
      setAuthTestOutput(res);
      showToast(`Auth /test response: ${res}`, 'info');
    } catch (err: any) {
      setAuthTestOutput(`Error: ${err.message}`);
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Admin Notice & Role Switcher */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">Spring Security: ROLE_ADMIN</span>
          </div>
          <h1 className="text-2xl font-bold mt-1">NexCart Management & Analytics</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage product inventory, track customer sales transactions, and test Stripe payment gateways.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isAdminMode
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isAdminMode ? 'Admin Permissions: Enabled' : 'Enable Admin Mode'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'sales'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sales Dashboard (/api/admin/sales)</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Inventory (/api/products)</span>
        </button>

        <button
          onClick={() => setActiveTab('payment-test')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'payment-test'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Stripe & API Diagnostic</span>
        </button>
      </div>

      {/* TAB 1: SALES DASHBOARD */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Global Customer Sales Report</h2>
            <button
              onClick={fetchSales}
              disabled={salesLoading}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${salesLoading ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Refresh Sales</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Transaction Records
              </span>
              <p className="text-2xl font-black text-slate-900 mt-2">{sales.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Items Sold
              </span>
              <p className="text-2xl font-black text-emerald-600 mt-2">
                {sales.reduce((acc, curr) => acc + (curr.quantity || 0), 0)}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Endpoint Status
              </span>
              <p className="text-sm font-bold text-slate-800 mt-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>GET /api/admin/sales Active</span>
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {salesLoading ? (
              <div className="py-16 text-center">
                <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 mt-2">Loading sales data...</p>
              </div>
            ) : sales.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No orders have been recorded in the system yet. Place an order in the catalog to populate this dashboard!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Product Purchased</th>
                      <th className="py-3.5 px-4 text-center">Quantity</th>
                      <th className="py-3.5 px-4">Order Date</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sales.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{item.username}</td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                          {item.userEmail || '—'}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{item.productName}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(item.orderDate).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            {item.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT INVENTORY MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Manage Product Inventory</h2>
              <p className="text-xs text-slate-500">
                Create (POST), edit (PUT), and delete (DELETE) products in real-time.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {productsLoading ? (
              <div className="py-16 text-center">
                <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 mt-2">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No products found. Click "Add New Product" to add your first product!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">ID</th>
                      <th className="py-3.5 px-4">Product Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (₹)</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.productId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{p.productId}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{p.productName}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {p.productCategory || 'General'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          ₹{Number(p.productPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              p.stockQuantity > 5
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.stockQuantity > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.stockQuantity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.productId!)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STRIPE & API DIAGNOSTICS */}
      {activeTab === 'payment-test' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stripe Session Generator */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Stripe Payment Sandbox</h3>
                <p className="text-xs text-slate-500">Test POST /api/payment/create-session</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount in INR (₹)
                </label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={testDesc}
                  onChange={(e) => setTestDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button
                onClick={handleCreateStripeSession}
                disabled={stripeLoading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {stripeLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Generate Stripe Checkout Session</span>
                  </>
                )}
              </button>

              {stripeUrl && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Stripe Checkout URL:
                  </span>
                  <p className="text-xs font-mono text-emerald-700 break-all select-all">{stripeUrl}</p>
                  {stripeUrl.startsWith('http') && (
                    <a
                      href={stripeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                    >
                      <span>Open Stripe Checkout</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Spring Boot API Diagnostic */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">API Health & Auth Ping</h3>
                <p className="text-xs text-slate-500">Test GET /api/auth/test</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Verify that the Spring Boot backend server is reachable on port 8080 and that your JWT authorization headers are working properly.
            </p>

            <button
              onClick={handleTestAuth}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              Ping /api/auth/test
            </button>

            {authTestOutput && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                Output: <span className="text-emerald-700 font-bold">{authTestOutput}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. Wireless Noise Canceling Headphones"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.productCategory}
                  onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                  placeholder="e.g. Electronics, Clothing, Home, Books"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.productPrice}
                    onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
                    placeholder="e.g. 1999.00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  placeholder="Detailed product features, specifications, etc."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
