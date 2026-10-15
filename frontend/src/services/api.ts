import { Product, Cart, OrderDTO, AdminSalesDTO } from '../types';

const BASE_URL = '/api';

function getAuthHeaders(isJson = true): Record<string, string> {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('nexcart_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let errorMessage = text;
    try {
      const json = JSON.parse(text);
      errorMessage = json.message || json.error || text;
    } catch {
      // Keep plain text
    }
    throw new Error(errorMessage || `Request failed with status ${res.status}`);
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.text() as unknown as T;
}

// ================= AUTH API =================
export const authAPI = {
  async login(username: string, password: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse<string>(res);
  },

  async register(username: string, password: string, email: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    });
    return handleResponse<string>(res);
  },

  async getMe(): Promise<{ username: string; email: string; roles: string[] }> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return handleResponse<{ username: string; email: string; roles: string[] }>(res);
  },

  async testAuth(): Promise<string> {
    const res = await fetch(`${BASE_URL}/auth/test`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return handleResponse<string>(res);
  },
};

// ================= PRODUCT API =================
export const productAPI = {
  async getAll(): Promise<Product[]> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'GET',
    });
    return handleResponse<Product[]>(res);
  },

  async getById(id: number): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'GET',
    });
    return handleResponse<Product>(res);
  },

  async create(product: Omit<Product, 'productId'>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(res);
  },

  async update(id: number, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(res);
  },

  async delete(id: number): Promise<string> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    return handleResponse<string>(res);
  },
};

// ================= CART API =================
export const cartAPI = {
  async getCart(): Promise<Cart> {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return handleResponse<Cart>(res);
  },

  async addToCart(productId: number, quantity: number): Promise<Cart> {
    const res = await fetch(
      `${BASE_URL}/cart/add?productId=${productId}&quantity=${quantity}`,
      {
        method: 'POST',
        headers: getAuthHeaders(false),
      }
    );
    return handleResponse<Cart>(res);
  },

  async updateQuantity(productId: number, quantity: number): Promise<Cart> {
    const res = await fetch(
      `${BASE_URL}/cart/update?productId=${productId}&quantity=${quantity}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(false),
      }
    );
    return handleResponse<Cart>(res);
  },

  async removeFromCart(productId: number): Promise<Cart> {
    const res = await fetch(`${BASE_URL}/cart/remove?productId=${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(false),
    });
    return handleResponse<Cart>(res);
  },
};

// ================= ORDER API =================
export const orderAPI = {
  async checkout(): Promise<OrderDTO> {
    const res = await fetch(`${BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: getAuthHeaders(false),
    });
    return handleResponse<OrderDTO>(res);
  },

  async getMyOrders(): Promise<OrderDTO[]> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return handleResponse<OrderDTO[]>(res);
  },
};

// ================= PAYMENT (STRIPE) API =================
export const paymentAPI = {
  async createCheckoutSession(amount: number, description: string): Promise<string> {
    const params = new URLSearchParams({
      amount: amount.toString(),
      description,
    });
    const res = await fetch(`${BASE_URL}/payment/create-session?${params.toString()}`, {
      method: 'POST',
      headers: getAuthHeaders(false),
    });
    return handleResponse<string>(res);
  },
};

// ================= ADMIN API =================
export const adminAPI = {
  async getSalesDashboard(): Promise<AdminSalesDTO[]> {
    const res = await fetch(`${BASE_URL}/admin/sales`, {
      method: 'GET',
      headers: getAuthHeaders(false),
    });
    return handleResponse<AdminSalesDTO[]>(res);
  },
};
