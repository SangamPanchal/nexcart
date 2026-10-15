# NexCart Frontend (React + TypeScript + Tailwind CSS)

Modern, fast, and responsive e-commerce web application for **NexCart Backend API**.

## 🚀 Features & Endpoints Mapped

1. **Authentication (`/api/auth`)**:
   - `POST /api/auth/register` — User account registration with validation
   - `POST /api/auth/login` — JWT authentication and session persistence
   - `GET /api/auth/test` — Live API diagnostic and health ping

2. **Product Catalog (`/api/products`)**:
   - `GET /api/products` — Product list with search, sorting, and category filters
   - `GET /api/products/{id}` — Product detail modal with quantity selector
   - `POST /api/products` — Admin inventory creation
   - `PUT /api/products/{id}` — Admin product updates
   - `DELETE /api/products/{id}` — Admin product deletion

3. **Cart Management (`/api/cart`)**:
   - `GET /api/cart` — Live user cart fetching
   - `POST /api/cart/add?productId={id}&quantity={qty}` — Add item to cart
   - `PUT /api/cart/update?productId={id}&quantity={qty}` — Adjust item quantity (+ / -)
   - `DELETE /api/cart/remove?productId={id}` — Remove item from cart

4. **Order Processing (`/api/orders`)**:
   - `POST /api/orders/checkout` — Finalize checkout, deduct stock, create order, clear cart
   - `GET /api/orders` — View user's past order history and item breakdown

5. **Stripe Payments (`/api/payment`)**:
   - `POST /api/payment/create-session` — Generates Stripe Checkout session URL and redirects to Stripe

6. **Admin Dashboard (`/api/admin`)**:
   - `GET /api/admin/sales` — Global sales report with customer details, quantities, timestamps, and order statuses

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Development Server
Make sure your Spring Boot backend is running on `http://localhost:8080`.
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.
Vite dev server is preconfigured with a proxy that directs `/api` calls directly to `http://localhost:8080`.

### 3. Build for Production
```bash
npm run build
```
The compiled assets will be in `frontend/dist`.
