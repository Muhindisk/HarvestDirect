# HarvestDirect Server

Backend API for HarvestDirect - Agricultural Marketplace Platform

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (Farmers, Buyers, Admin)
- 🌾 Product Management
- 📦 Order Processing
- 💰 Escrow Payment System
- 💳 M-Pesa & Intasend Payment Integration
- 🖼️ Image Upload (Cloudinary)
- 🛡️ Security (Helmet, Rate Limiting)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Run development server:
```bash
npm run dev
```

The server will run on http://localhost:5000

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Farmer only)
- `PUT /api/products/:id` - Update product (Farmer only)
- `DELETE /api/products/:id` - Delete product (Farmer only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/mpesa/callback` - M-Pesa callback
- `GET /api/payments/verify/:transactionId` - Verify payment

### Escrow
- `POST /api/escrow/:orderId/release` - Release escrow funds
- `POST /api/escrow/:orderId/dispute` - Dispute escrow
- `GET /api/escrow/:orderId` - Get escrow status

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.ts        # App entry point
├── .env.example        # Environment variables template
├── package.json
└── tsconfig.json
```

## Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Helmet** - Security headers
- **Morgan** - HTTP logging

## License

MIT
