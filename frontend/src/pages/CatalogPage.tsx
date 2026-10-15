import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, RefreshCw, Sparkles, PlusCircle } from 'lucide-react';
import { Product } from '../types';
import { productAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

interface CatalogPageProps {
  onViewDetails: (product: Product) => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  onViewDetails,
  onOpenAuth,
  onOpenAdmin,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [seeding, setSeeding] = useState(false);

  const { showToast } = useToast();
  const { user } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err: any) {
      showToast(`Failed to load products: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.productCategory) {
        set.add(p.productCategory);
      }
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          (p.productCategory && p.productCategory.toLowerCase() === selectedCategory.toLowerCase());
        const matchesSearch =
          p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.productDescription && p.productDescription.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.productPrice - b.productPrice;
        if (sortBy === 'price-desc') return b.productPrice - a.productPrice;
        if (sortBy === 'name') return a.productName.localeCompare(b.productName);
        return (b.productId || 0) - (a.productId || 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Sample seeder function if database is empty (Admin only)
  const handleSeedProducts = async () => {
    setSeeding(true);
    const demoItems: Omit<Product, 'productId'>[] = [
      {
        productName: 'Sony WH-1000XM5 Wireless Headphones',
        productDescription: 'Industry leading noise canceling headphones with dual processors and 8 microphones.',
        productPrice: 26990,
        stockQuantity: 15,
        productCategory: 'Electronics',
      },
      {
        productName: 'Apple iPhone 15 Pro (128GB)',
        productDescription: 'Forged in titanium, feature the groundbreaking A17 Pro chip and customizable Action button.',
        productPrice: 129900,
        stockQuantity: 10,
        productCategory: 'Electronics',
      },
      {
        productName: 'Minimalist Oxford Cotton Shirt',
        productDescription: 'Breathable 100% organic cotton slim-fit casual shirt suitable for all seasons.',
        productPrice: 1899,
        stockQuantity: 40,
        productCategory: 'Clothing',
      },
      {
        productName: 'Ergonomic Mesh Office Chair',
        productDescription: 'Adjustable lumbar support, 3D armrests, and high-density breathable foam cushioning.',
        productPrice: 9499,
        stockQuantity: 8,
        productCategory: 'Home',
      },
      {
        productName: 'Atomic Habits by James Clear',
        productDescription: 'An easy and proven way to build good habits and break bad ones. Hardcover edition.',
        productPrice: 599,
        stockQuantity: 50,
        productCategory: 'Books',
      },
      {
        productName: 'Nike Air Zoom Pegasus 40',
        productDescription: 'Responsive road running shoes designed for energizing miles with dual Zoom Air units.',
        productPrice: 10495,
        stockQuantity: 20,
        productCategory: 'Clothing',
      },
    ];

    try {
      for (const item of demoItems) {
        await productAPI.create(item);
      }
      showToast('Successfully seeded demo products!', 'success');
      await fetchProducts();
    } catch (err: any) {
      showToast(`Failed to seed: ${err.message}`, 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connected to Spring Boot 3 & PostgreSQL</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Quality Products, Instant Delivery.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Browse our curated collection with real-time stock sync, secure cart management, and Stripe payments.
          </p>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-medium text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured / Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>

          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500 mt-4">Loading NexCart catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Products Available</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              Your database currently doesn't have any products, or your search filter didn't match any items.
            </p>
          </div>
          {user?.isAdmin ? (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleSeedProducts}
                disabled={seeding}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{seeding ? 'Adding Demo Products...' : 'Seed Demo Products'}</span>
              </button>
              <button
                onClick={onOpenAdmin}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Open Admin Dashboard
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Please check back soon or log in as an administrator to populate inventory.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onViewDetails={onViewDetails}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      )}
    </div>
  );
};
