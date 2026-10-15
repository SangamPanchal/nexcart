import React from 'react';
import {
  CheckCircle2,
  Package,
  Calendar,
  CreditCard,
  Truck,
  ArrowRight,
  ShoppingBag,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { OrderDTO } from '../types';

interface OrderSuccessPageProps {
  order: OrderDTO | null;
  isStripePayment?: boolean;
  isLoading?: boolean;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  isStripePayment = false,
  isLoading = false,
  onContinueShopping,
  onViewOrders,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = order?.orderDate
    ? new Date(order.orderDate).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Confirming Your Order...</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Stripe payment was authorized! Finalizing your order, deducting inventory, and clearing your cart...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-fade-in print:py-0 print:px-0">
      {/* Celebration Header Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 space-y-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-xl animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Your purchase has been received and confirmed. We have initiated dispatch preparation for your items.
          </p>

          {order && (
            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-xl font-mono text-sm tracking-wider font-bold">
                Order Reference: #{order.orderId}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Order Status & Delivery Info Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Payment Status</p>
            <p className="text-sm font-extrabold text-slate-900">
              {isStripePayment ? 'Stripe Paid & Confirmed' : 'Paid & Processed'}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Placed On</p>
            <p className="text-sm font-extrabold text-slate-900">{formattedDate}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Delivery</p>
            <p className="text-sm font-extrabold text-slate-900">2 - 4 Business Days</p>
          </div>
        </div>
      </div>

      {/* Items Breakdown Card */}
      {order && order.items && order.items.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Order Items</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {order.items.length} item{order.items.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                    {item.quantity}×
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.productName}</h3>
                    <p className="text-xs text-slate-400">Product ID: #{item.productId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900">
                    ₹{Number(item.itemPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="bg-slate-50/70 p-6 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span>₹{Number(order.orderTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Standard Shipping</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total Paid</span>
              <span className="text-emerald-600 text-xl font-black">
                ₹{Number(order.orderTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 print:hidden">
        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center gap-2 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <button
          onClick={onViewOrders}
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md text-xs flex items-center justify-center gap-2 transition-all"
        >
          <span>View Order History</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>
      </div>

      <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 print:hidden">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>A receipt and tracking updates have been recorded for your account.</span>
      </div>
    </div>
  );
};
