import React from 'react';
import { ShoppingBag, ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  activeTab: 'catalog' | 'orders' | 'admin';
  setActiveTab: (tab: 'catalog' | 'orders' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenAuth,
  activeTab,
  setActiveTab,
}) => {
  const { user, logout, cartCount } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  NexCart
                </span>
                <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full uppercase tracking-wider">
                  Store
                </span>
              </div>
            </button>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'catalog'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                My Orders
              </button>

              {/* Admin Tab - ONLY visible to verified admins */}
              {user?.isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === 'admin'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Admin Dashboard</span>
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors focus:outline-none"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full text-white font-semibold flex items-center justify-center text-xs uppercase shadow-sm ${
                    user.isAdmin ? 'bg-purple-600' : 'bg-emerald-600'
                  }`}>
                    {user.username.substring(0, 2)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{user.username}</p>
                    <p className="text-[10px] font-bold leading-tight mt-0.5">
                      {user.isAdmin ? (
                        <span className="text-purple-600">ADMIN</span>
                      ) : (
                        <span className="text-slate-400">CUSTOMER</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all hover:shadow"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'catalog' ? 'text-emerald-700 font-bold' : 'text-slate-600'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1 text-xs font-medium rounded ${
              activeTab === 'orders' ? 'text-emerald-700 font-bold' : 'text-slate-600'
            }`}
          >
            Orders
          </button>
          {user?.isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1 text-xs font-bold rounded ${
                activeTab === 'admin' ? 'text-purple-700 bg-purple-50' : 'text-purple-600'
              }`}
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
