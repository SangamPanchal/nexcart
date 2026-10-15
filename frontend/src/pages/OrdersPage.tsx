import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, ChevronRight, ShoppingBag, RefreshCw } from 'lucide-react';
import { OrderDTO } from '../types';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

interface OrdersPageProps {
  onGoToShop: () => void;
  onOpenAuth: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onGoToShop, onOpenAuth }) => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await orderAPI.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      showToast(`Failed to load orders: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to view your orders</h2>
        <p className="text-sm text-slate-500 mt-2">
          Your past orders, invoices, and delivery status are associated with your account.
        </p>
        <button
          onClick={onOpenAuth}
          className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying all finalized orders placed by <span className="font-semibold text-slate-800">{user.username}</span>
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Fetching orders from NexCart API...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No orders placed yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add products to your cart and complete checkout to see them here!
            </p>
          </div>
          <button
            onClick={onGoToShop}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Order Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    #{order.orderId}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Order #{order.orderId}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(order.orderDate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {order.orderStatus}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Total Paid</span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{Number(order.orderTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[11px]">
                        {item.quantity}×
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{item.productName}</p>
                        <p className="text-[11px] text-slate-400">Product ID: #{item.productId}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{Number(item.itemPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
