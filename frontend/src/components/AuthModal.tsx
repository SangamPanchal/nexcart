import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { authAPI } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const { login, register } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTestResult(null);

    try {
      if (isRegister) {
        if (!email) {
          showToast('Email is required for registration', 'error');
          setLoading(false);
          return;
        }
        const message = await register(username, password, email);
        if (message.toLowerCase().includes('error')) {
          showToast(message, 'error');
        } else {
          showToast(message || 'Registration successful! Please sign in.', 'success');
          setIsRegister(false);
          setPassword('');
        }
      } else {
        await login(username, password);
        showToast(`Welcome back, ${username}!`, 'success');
        onClose();
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAuth = async () => {
    try {
      const res = await authAPI.testAuth();
      setTestResult(res);
      showToast(`Auth Test Response: "${res}"`, 'info');
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`);
      showToast(`Auth test error: ${err.message}`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isRegister ? 'Create an Account' : 'Welcome to NexCart'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRegister
                ? 'Join to access orders, cart, and checkouts'
                : 'Sign in to access your cart and place orders'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
          <button
            onClick={() => {
              setIsRegister(false);
              setShowPassword(false);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isRegister
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setShowPassword(false);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isRegister
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required={isRegister}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 focus:outline-none"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide password</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show password</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In to NexCart'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Diagnostics / Test Endpoint / Quick Fill */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span>Quick test endpoint: <code className="text-emerald-700 font-mono">/api/auth/test</code></span>
            <button
              onClick={handleTestAuth}
              type="button"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium underline"
            >
              Ping /test
            </button>
          </div>
          {testResult && (
            <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-700">
              Response: {testResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
