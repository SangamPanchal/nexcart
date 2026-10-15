import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './pages/CatalogPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminPage } from './pages/AdminPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { Product, OrderDTO } from './types';
import { Server, ShieldAlert } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { orderAPI } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'admin' | 'order-success'>('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDTO | null>(null);
  const [isStripeReturn, setIsStripeReturn] = useState(false);
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false);

  const { user, refreshCartCount } = useAuth();

  // Detect Stripe redirect: http://localhost:5173/?payment=success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setIsStripeReturn(true);
      setActiveTab('order-success');
      // Clean up URL without page refresh
      window.history.replaceState({}, document.title, window.location.pathname);

      // Finalize the order through backend checkout so inventory is deducted and order is saved
      const finalizeStripeOrder = async () => {
        setIsFinalizingOrder(true);
        try {
          const order = await orderAPI.checkout();
          setConfirmedOrder(order);
          await refreshCartCount();
        } catch (err: any) {
          console.error('Order checkout post-Stripe error:', err);
        } finally {
          setIsFinalizingOrder(false);
        }
      };

      finalizeStripeOrder();
    }
  }, []);

  const handleViewDetails = (product: Product) => {
    if (product.productId) {
      setSelectedProductId(product.productId);
    }
  };

  const handleOrderSuccess = (order: OrderDTO) => {
    setConfirmedOrder(order);
    setIsStripeReturn(false);
    setActiveTab('order-success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top sticky navigation bar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeTab={activeTab === 'order-success' ? 'orders' : activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'catalog' && (
          <CatalogPage
            onViewDetails={handleViewDetails}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAdmin={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersPage
            onGoToShop={() => setActiveTab('catalog')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'order-success' && (
          <OrderSuccessPage
            order={confirmedOrder}
            isStripePayment={isStripeReturn}
            isLoading={isFinalizingOrder}
            onContinueShopping={() => setActiveTab('catalog')}
            onViewOrders={() => setActiveTab('orders')}
          />
        )}

        {activeTab === 'admin' && (
          user?.isAdmin ? (
            <AdminPage />
          ) : (
            <div className="py-20 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
              <p className="text-sm text-slate-500">
                The Admin Dashboard is only accessible to users with the <code className="font-mono text-purple-700 bg-purple-50 px-1 py-0.5 rounded">ROLE_ADMIN</code> authority.
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Return to Product Catalog
              </button>
            </div>
          )
        )}
      </main>

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOrderSuccess={handleOrderSuccess}
      />

      <ProductDetailModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">NexCart</span>
            <span>• Fullstack E-Commerce Experience</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Server className="w-3.5 h-3.5" />
              <span>Spring Boot API on :8080</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
