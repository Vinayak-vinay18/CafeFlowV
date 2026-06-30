# ☕ CafeFlow — Smart Cafe Billing & Management System

A full-stack cafe billing and management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- JWT-secured admin login with a "forgot password" flow
- Dashboard with revenue/order graphs and recent orders
- Menu management (CRUD, search, filter, sort) pre-seeded with realistic cafe items
- POS billing screen with cart, customer selection, GST + discount calculation, and bill generation
- Customer management with profiles and purchase history
- Order management with status updates and a printable invoice (PDF via browser print)
- Sales analytics: daily/weekly/monthly revenue, most/least sold items, top customers, CSV export
- Settings page for cafe name, GST %, logo, and dark mode
- Fully responsive, orange-and-white themed UI with smooth Framer Motion animations

## Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, React Router, Axios, Framer Motion, Recharts, React Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt password hashing

## Project Structure

```
cafeflow/
├── backend/
│   ├── controllers/   # Route logic (auth, customers, menu, orders, dashboard, settings)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── middleware/     # Auth + error handling
│   ├── config/         # DB connection
│   ├── seed/            # Seeds default admin + menu items
│   └── server.js
└── client/
    └── src/
        ├── components/  # layout, common, menu, customers, orders, billing
        ├── pages/        # Login, Dashboard, MenuManagement, POSBilling, etc.
        ├── context/      # AuthContext, CafeContext (cart, theme, settings)
        ├── services/     # Axios API wrappers
        └── hooks/
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

### 1. Backend

```bash
cd backend
cp .env.example .env      # edit MONGO_URI / JWT_SECRET / ADMIN_EMAIL / ADMIN_PASSWORD as needed
npm install
npm run seed               # creates default admin + seeds menu items
npm run dev                 # starts the API on http://localhost:5000
```

Default admin login (from `.env.example`):
- **Email:** admin@cafeflow.com
- **Password:** Admin@123

### 2. Frontend

```bash
cd client
cp .env.example .env       # ensure VITE_API_URL points to your backend, e.g. http://localhost:5000/api
npm install
npm run dev                  # starts Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` and log in with the admin credentials above.

### 3. Production Build

```bash
cd client
npm run build               # outputs static files to client/dist
```

Serve `client/dist` with any static host, and deploy `backend/` (with `NODE_ENV=production`) to your Node hosting of choice. Remember to set a strong `JWT_SECRET` and restrict/disable the `/api/auth/register` route in production.

## Notes

- Menu item images use emoji placeholders by default; you can paste an image URL in the menu item form to use real photos.
- Invoices are generated as a printable in-app page — use the browser's "Print / Download PDF" button to save as PDF.
- GST percentage is configurable from Settings and is applied automatically during billing.
