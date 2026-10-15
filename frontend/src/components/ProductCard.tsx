import React from 'react';
import { Plus, ShoppingCart, Eye, Package } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { cartAPI } from '../services/api';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onOpenAuth: () => void;
}

export const getCategoryImage = (category: string = '', id: number = 1): string => {
  const cat = category.toLowerCase();
  if (cat.includes('elect') || cat.includes('tech') || cat.includes('phone') || cat.includes('gadget')) {
    return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80`;
  }
  if (cat.includes('cloth') || cat.includes('wear') || cat.includes('fashion') || cat.includes('shirt')) {
    return `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80`;
  }
  if (cat.includes('book') || cat.includes('read')) {
    return `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80`;
  }
  if (cat.includes('home') || cat.includes('furn') || cat.includes('decor')) {
    return `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80`;
  }
  if (cat.includes('shoe') || cat.includes('sneaker')) {
    return `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80`;
  }
  const defaultImages = [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
  ];
  return defaultImages[id % defaultImages.length];
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onOpenAuth,
}) => {
  const { user, refreshCartCount } = useAuth();
  const { showToast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to add items to your cart', 'info');
      onOpenAuth();
      return;
    }

    if (product.stockQuantity <= 0) {
      showToast('This product is out of stock', 'error');
      return;
    }

    try {
      await cartAPI.addToCart(product.productId!, 1);
      await refreshCartCount();
      showToast(`Added ${product.productName} to cart!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add item to cart', 'error');
    }
  };

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Banner */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={getCategoryImage(product.productCategory, product.productId || 1)}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold rounded-full shadow-xs uppercase tracking-wider">
          {product.productCategory || 'General'}
        </span>

        {/* Stock Status Badge */}
        <span
          className={`absolute top-3 right-3 px-2 py-1 text-[11px] font-semibold rounded-full shadow-xs ${
            isOutOfStock
              ? 'bg-rose-500 text-white'
              : product.stockQuantity < 5
              ? 'bg-amber-500 text-white'
              : 'bg-emerald-500 text-white'
          }`}
        >
          {isOutOfStock ? 'Out of stock' : `${product.stockQuantity} in stock`}
        </span>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-2.5 bg-white text-slate-800 rounded-full shadow-lg hover:scale-110 transition-transform"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 text-base group-hover:text-emerald-600 transition-colors line-clamp-1">
            {product.productName}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.productDescription || 'No description provided.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{Number(product.productPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md hover:shadow-emerald-600/20 active:scale-95'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
