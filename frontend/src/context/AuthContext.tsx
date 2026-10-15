import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, cartAPI } from '../services/api';
import { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<string>;
  logout: () => void;
  cartCount: number;
  refreshCartCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string): { sub?: string; roles?: string[] } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  const initUserFromToken = async (token: string, usernameFallback: string) => {
    let roles: string[] = [];
    const payload = parseJwt(token);
    if (payload && Array.isArray(payload.roles)) {
      roles = payload.roles;
    }

    let username = payload?.sub || usernameFallback;
    let email: string | undefined;

    // Verify / fetch from backend /me endpoint if available
    try {
      const me = await authAPI.getMe();
      if (me && me.roles) {
        roles = me.roles;
        username = me.username;
        email = me.email;
      }
    } catch {
      // Fallback to token payload
    }

    const isAdmin = roles.some((r) => r === 'ROLE_ADMIN' || r === 'ADMIN');

    setUser({
      username,
      email,
      token,
      roles,
      isAdmin,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('nexcart_token');
    const username = localStorage.getItem('nexcart_username');
    if (token && username) {
      initUserFromToken(token, username);
      refreshCartCount();
    }
  }, []);

  const refreshCartCount = async () => {
    const token = localStorage.getItem('nexcart_token');
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const cart = await cartAPI.getCart();
      const count = cart.cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
      setCartCount(count);
    } catch {
      // Cart empty or unauthorized
    }
  };

  const login = async (username: string, password: string) => {
    const token = await authAPI.login(username, password);
    localStorage.setItem('nexcart_token', token);
    localStorage.setItem('nexcart_username', username);

    await initUserFromToken(token, username);
    await refreshCartCount();
  };

  const register = async (username: string, password: string, email: string) => {
    return await authAPI.register(username, password, email);
  };

  const logout = () => {
    localStorage.removeItem('nexcart_token');
    localStorage.removeItem('nexcart_username');
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        cartCount,
        refreshCartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
