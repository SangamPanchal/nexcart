import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, ShieldCheck, ExternalLink } from 'lucide-react';
import { Cart, OrderDTO } from '../types';
import { cartAPI, orderAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { getCategoryImage } from './ProductCard';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onOrderSuccess: (order: OrderDTO) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onOrderSuccess,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const { user, refreshCartCount } = useAuth();
  const { showToast } = useToast();

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (err: any) {
      showToast(`Error fetching cart: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setRedirectUrl(null);
      fetchCart();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleUpdateQuantity = async (productId: number, newQty: number) => {
    setActionLoading(true);
    try {
      const updatedCart = await cartAPI.updateQuantity(productId, newQty);
      setCart(updatedCart);
      await refreshCartCount();
    } catch (err: any) {
      showToast(err.message || 'Failed to update quantity', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    setActionLoading(true);
    try {
      const updatedCart = await cartAPI.removeFromCart(productId);
      setCart(updatedCart);
      await refreshCartCount();
      showToast('Item removed from cart', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove item', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStripePayment = async () => {
    if (!cart || cart.cartItems.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }

    setStripeLoading(true);
    setRedirectUrl(null);
    try {
      const totalAmount = Number(cart.totalPrice);
      const description = `NexCart Order - ${cart.cartItems.length} items`;
      const checkoutUrl = await paymentAPI.createCheckoutSession(totalAmount, description);

      const cleanUrl = checkoutUrl ? checkoutUrl.trim() : '';

      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        showToast('Redirecting to Stripe Payment Gateway...', 'success');
        setRedirectUrl(cleanUrl);
        // Direct navigation to Stripe
        window.location.assign(cleanUrl);
      } else {
        throw new Error(cleanUrl || 'Invalid Stripe URL returned from server');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to initiate Stripe session', 'error');
    } finally {
      setStripeLoading(false);
    }
  };

  const handleDirectCheckout = async () => {
    if (!cart || cart.cartItems.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }

    setCheckoutLoading(true);
    try {
      const order = await orderAPI.checkout();
      showToast(`Order #${order.orderId} placed successfully!`, 'success');
      await refreshCartCount();
      setCart(null);
      onClose();
      onOrderSuccess(order);
    } catch (err: any) {
      showToast(err.message || 'Checkout failed', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Shopping Cart</h2>
                <p className="text-xs text-slate-500">
                  {cart?.cartItems?.length || 0} item{cart?.cartItems?.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!user ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-800">You are not logged in</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Please sign in to your account to view your cart and proceed to checkout.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  Sign In Now
                </button>
              </div>
            ) : loading ? (
              <div className="h-full flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 mt-3">Loading cart items...</p>
              </div>
            ) : !cart || cart.cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <img
                    src={getCategoryImage(item.product.productCategory, item.product.productId || 1)}
                    alt={item.product.productName}
                    className="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {item.product.productName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          ₹{Number(item.product.productPrice).toLocaleString('en-IN')} each
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product.productId!)}
                        disabled={actionLoading}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product.productId!, item.quantity - 1)
                          }
                          disabled={actionLoading}
                          className="text-slate-500 hover:text-slate-800 p-0.5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product.productId!, item.quantity + 1)
                          }
                          disabled={actionLoading}
                          className="text-slate-500 hover:text-slate-800 p-0.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-slate-900">
                        ₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Totals & Actions */}
          {user && cart && cart.cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{Number(cart.totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    ₹{Number(cart.totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Primary: Stripe Checkout Action */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleStripePayment}
                  disabled={stripeLoading || checkoutLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
                >
                  {stripeLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Connecting to Stripe...</span>
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-emerald-200" />
                      <span>Proceed to Payment (Stripe Checkout)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {redirectUrl && (
                  <a
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors"
                  >
                    <span>Click here if not redirected automatically</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Secondary Option: Direct Place Order */}
                <button
                  onClick={handleDirectCheckout}
                  disabled={checkoutLoading || stripeLoading}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-1.5"
                >
                  {checkoutLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>Or Place Order Directly (Cash on Delivery)</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-bit encrypted Stripe checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
