import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, CreditCard, Tag } from 'lucide-react';
import { Product } from '../types';
import { productAPI, cartAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { getCategoryImage } from './ProductCard';

interface ProductDetailModalProps {
  productId: number | null;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
  onClose,
  onOpenAuth,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyingStripe, setBuyingStripe] = useState(false);

  const { user, refreshCartCount } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setQuantity(1);
    productAPI
      .getById(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        showToast(`Failed to load product details: ${err.message}`, 'error');
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  if (!productId) return null;

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      showToast('Please sign in to add items to your cart', 'info');
      onOpenAuth();
      return;
    }
    if (quantity > product.stockQuantity) {
      showToast(`Only ${product.stockQuantity} items in stock!`, 'error');
      return;
    }

    setAdding(true);
    try {
      await cartAPI.addToCart(product.productId!, quantity);
      await refreshCartCount();
      showToast(`Added ${quantity} × ${product.productName} to cart`, 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Could not add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNowStripe = async () => {
    if (!product) return;
    if (!user) {
      showToast('Please sign in to purchase items', 'info');
      onOpenAuth();
      return;
    }
    if (quantity > product.stockQuantity) {
      showToast(`Only ${product.stockQuantity} items in stock!`, 'error');
      return;
    }

    setBuyingStripe(true);
    try {
      // Add to user cart first so it can be checked out and inventory deducted
      await cartAPI.addToCart(product.productId!, quantity);
      await refreshCartCount();

      const totalAmount = product.productPrice * quantity;
      const description = `${quantity}x ${product.productName}`;
      const checkoutUrl = await paymentAPI.createCheckoutSession(totalAmount, description);

      const cleanUrl = checkoutUrl ? checkoutUrl.trim() : '';
      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        showToast('Redirecting to Stripe Checkout...', 'success');
        window.location.assign(cleanUrl);
      } else {
        throw new Error(cleanUrl || 'Invalid checkout URL');
      }
    } catch (err: any) {
      showToast(err.message || 'Payment initiation failed', 'error');
    } finally {
      setBuyingStripe(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 rounded-full shadow-md backdrop-blur-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !product ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 mt-3 font-medium">Fetching product specifications...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
              <img
                src={getCategoryImage(product.productCategory, product.productId || 1)}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold rounded-full text-slate-800 flex items-center gap-1 shadow-xs">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>{product.productCategory || 'General'}</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
                    Product ID: #{product.productId}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      product.stockQuantity > 0
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {product.productName}
                </h2>

                <p className="text-2xl font-extrabold text-emerald-600 mt-3">
                  ₹{Number(product.productPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>

                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Description
                  </h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {product.productDescription || 'No detailed description available for this item.'}
                  </p>
                </div>
              </div>

              {/* Quantity & CTA */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Select Quantity</span>
                  <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-xl">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-1 rounded-lg text-slate-600 hover:text-slate-900 disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold text-slate-900 w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                      disabled={quantity >= product.stockQuantity}
                      className="p-1 rounded-lg text-slate-600 hover:text-slate-900 disabled:opacity-30"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Primary: Buy Now with Stripe */}
                <button
                  onClick={handleBuyNowStripe}
                  disabled={product.stockQuantity <= 0 || buyingStripe || adding}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
                >
                  {buyingStripe ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-emerald-200" />
                      <span>Buy Now with Stripe • ₹{(product.productPrice * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                {/* Secondary: Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity <= 0 || adding || buyingStripe}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{adding ? 'Adding...' : 'Add to Shopping Cart'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
