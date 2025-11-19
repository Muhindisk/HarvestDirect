# HarvestDirect Server

Backend API for HarvestDirect - Agricultural Marketplace Platform

## 🌾 Features

- 🔐 **JWT Authentication & Authorization** - Secure user sessions
- 👥 **User Management** - Farmers, Buyers, and Admin roles
- 🌾 **Product Management** - CRUD operations for agricultural products
- 📦 **Order Processing** - Complete order lifecycle management
- 💰 **Escrow Payment System** - Secure fund holding and release
- 💳 **M-Pesa Integration** - IntaSend payment gateway
- 💼 **Wallet System** - Internal balance management for farmers
- 🗼️ **Image Upload** - Product and profile image handling (ImgBB)
- 🛡️ **Security** - Helmet, rate limiting, input validation
- 📊 **Analytics** - Order statistics and revenue tracking

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn
- IntaSend account (for payments)
- ImgBB API key (for image uploads)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Muhindisk/HarvestDirect.git
cd HarvestDirect/server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/harvestdirect
JWT_SECRET=your_jwt_secret_key
INTASEND_PUBLIC_KEY=your_intasend_public_key
INTASEND_SECRET_KEY=your_intasend_secret_key
IMGBB_API_KEY=your_imgbb_api_key
NODE_ENV=development
```

5. Run development server:
```bash
npm run dev
```

The server will run on http://localhost:5000

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/         # Database configuration
│   │   └── database.ts
│   ├── controllers/    # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── cart.controller.ts
│   │   └── ...
│   ├── middleware/     # Custom middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── upload.ts
│   ├── models/         # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Escrow.ts
│   │   ├── Wallet.ts
│   │   └── ...
│   ├── routes/         # API routes
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── wallet.routes.ts
│   │   └── ...
│   ├── services/       # Business logic
│   │   ├── intasend.service.ts
│   │   └── wallet.service.ts
│   └── index.ts        # App entry point
├── uploads/            # Local file storage
├── .env.example        # Environment template
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (farmer/buyer)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current authenticated user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/my-products` - Get farmer's products
- `POST /api/products` - Create product (Farmer only)
- `PUT /api/products/:id` - Update product (Farmer only)
- `DELETE /api/products/:id` - Delete product (Farmer only)

### Orders
- `POST /api/orders` - Create order (Buyer only)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/stats/summary` - Get order statistics
- `PUT /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/initiate` - Initiate M-Pesa payment
- `POST /api/payments/mpesa/callback` - M-Pesa STK callback
- `POST /api/payments/release-escrow/:orderId` - Release escrow funds
- `GET /api/payments/verify/:transactionId` - Verify payment status

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `GET /api/wallet/transactions` - Get transaction history
- `POST /api/wallet/deposit` - Deposit funds via M-Pesa
- `POST /api/wallet/withdraw` - Withdraw funds to M-Pesa

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Upload
- `POST /api/upload/product` - Upload product images (multipart/form-data)
- `POST /api/upload/profile` - Upload profile image to ImgBB

### Admin (Admin only)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/products` - All products with moderation
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/users/:id` - Update user status

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Headers Required
```bash
Authorization: Bearer <your_jwt_token>
```

### User Roles
- `buyer` - Can browse, purchase, and manage orders
- `farmer` - Can create products, manage inventory, receive payments
- `admin` - Full system access and moderation

## 💳 Payment Flow

1. **Buyer initiates payment** → `POST /api/payments/initiate`
2. **M-Pesa STK push** sent to buyer's phone
3. **Buyer enters PIN** on phone
4. **Callback received** → `POST /api/payments/mpesa/callback`
5. **Funds held in escrow** → Order status: `paid`
6. **Farmer fulfills order** → Order status: `shipped`
7. **Buyer confirms delivery** → Order status: `delivered`
8. **Admin releases escrow** → `POST /api/payments/release-escrow/:orderId`
9. **Farmer's wallet credited** → Funds available for withdrawal

## 📊 Database Models

### User
- name, email, password (hashed)
- role: farmer | buyer | admin
- phone, location, profileImage
- mpesaNumber, bankDetails (for farmers)

### Product
- name, description, category
- price, quantity, unit
- images[], farmer (ref: User)
- createdAt, updatedAt

### Order
- buyer (ref: User)
- items: [{ product, quantity, price }]
- totalAmount, status
- paymentStatus, deliveryAddress
- createdAt, updatedAt

### Escrow
- order (ref: Order)
- amount, status: held | released | disputed
- intasendTransactionId
- releasedAt, releasedBy

### Wallet
- user (ref: User)
- balance
- transactions: [{ type, amount, description }]

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🛠️ Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **IntaSend** - Payment gateway
- **ImgBB** - Image hosting
- **Helmet** - Security headers
- **Morgan** - HTTP logging

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.

## 🐛 Bug Reports

Please use GitHub Issues to report bugs.

## 📧 Contact

For questions or support, contact: stephenmuhindi903@gmail.com

