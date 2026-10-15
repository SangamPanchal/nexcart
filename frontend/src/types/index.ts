export interface Product {
  productId?: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  stockQuantity: number;
  productCategory: string;
}

export interface CartItem {
  cartItemId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  cartId: number;
  cartItems: CartItem[];
  totalPrice: number;
}

export interface OrderItemDTO {
  productId: number;
  productName: string;
  quantity: number;
  itemPrice: number;
}

export interface OrderDTO {
  orderId: number;
  orderDate: string;
  orderTotal: number;
  orderStatus: string;
  items: OrderItemDTO[];
}

export interface AdminSalesDTO {
  username: string;
  productName: string;
  quantity: number;
  orderDate: string;
  orderStatus: string;
  userEmail: string;
}

export interface AuthUser {
  username: string;
  email?: string;
  token: string;
  roles?: string[];
  isAdmin: boolean;
}
