# ShopKart: MERN E-Commerce Platform

A full-stack e-commerce app built with MongoDB, Express, React and Node.js. Shoppers can browse, search, add to cart and place orders. Admins manage products and order status.

## Features

- Product catalog with search, category filter, sorting and pagination
- Product detail page and persistent cart (saved in the browser)
- JWT authentication with hashed passwords (bcrypt)
- Checkout with shipping details (cash on delivery)
- Order history for each user
- Admin dashboard: add, edit and delete products; update order status
- Server-side price calculation and stock checks, so totals can't be tampered with from the browser

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, React Router, Vite |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JSON Web Tokens, bcryptjs |

## Project structure

```
ecommerce-mern/
├── client/            React app (Vite)
│   └── src/
│       ├── components/   Navbar, ProductCard
│       ├── context/      Auth and Cart state
│       └── pages/        Home, Product, Cart, Checkout, Orders, Auth, Admin
└── server/            Express API
    ├── config/        MongoDB connection
    ├── middleware/    JWT protect, admin check
    ├── models/        User, Product, Order
    ├── routes/        auth, products, orders
    └── seed.js        Demo data
```

## Getting started

You need Node.js 18+ and a running MongoDB (local or Atlas).

```bash
# 1. Backend
cd server
npm install
cp .env.example .env      # then edit MONGO_URI and JWT_SECRET
npm run seed              # loads demo products and users
npm run dev               # API on http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev               # app on http://localhost:5173
```

Demo accounts created by the seed script:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@shop.com | admin123 |
| User | user@shop.com | user123 |

Change these before deploying anywhere public.

## API reference

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Log in, returns JWT |
| GET | `/api/auth/me` | User | Current user |
| GET | `/api/products` | Public | List with `search`, `category`, `sort`, `page`, `limit` |
| GET | `/api/products/categories` | Public | Distinct categories |
| GET | `/api/products/:id` | Public | Single product |
| POST / PUT / DELETE | `/api/products[/:id]` | Admin | Manage products |
| POST | `/api/orders` | User | Place an order |
| GET | `/api/orders/mine` | User | Your orders |
| GET | `/api/orders` | Admin | All orders |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

## Environment variables (`server/.env`)

| Name | Purpose |
| --- | --- |
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `CLIENT_URL` | Frontend origin allowed by CORS |

## Roadmap

- Online payments (Razorpay or Stripe)
- Product reviews and ratings
- Image upload instead of image URLs
- Order confirmation emails
- Automated tests (Jest and React Testing Library)

## License

MIT
