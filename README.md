# 🌾 HarvestDirect

A modern agricultural marketplace platform connecting farmers directly with buyers, eliminating middlemen and ensuring fair prices for fresh, quality produce.

## 🚀 Live Deployment

- **Frontend (Client)**: [https://harvest-direct-seven.vercel.app](https://harvest-direct-seven.vercel.app)
- **Backend (API)**: [https://harvestdirect-7wh7.onrender.com](https://harvestdirect-7wh7.onrender.com)
- **API Health Check**: [https://harvestdirect-7wh7.onrender.com/health](https://harvestdirect-7wh7.onrender.com/health)

## ✨ Key Features

- 🛒 **Direct Marketplace** - Browse and purchase fresh produce directly from farmers
- 👨‍🌾 **Farmer Dashboard** - Manage products, orders, and earnings
- 🛍️ **Buyer Dashboard** - Track orders, manage cart, and wallet
- 💳 **Secure Payments** - M-Pesa integration with escrow protection
- 🔐 **JWT Authentication** - Secure user sessions with role-based access
- 💼 **Wallet System** - Internal balance management for seamless transactions
- 📱 **Responsive Design** - Mobile-first, works perfectly on all devices
- 🎨 **Modern UI/UX** - Polished interface with smooth animations
- 🖼️ **Image Management** - Upload product and profile images

## 🏗️ Architecture

This is a full-stack monorepo application with:

- **Client**: React + TypeScript + Vite (deployed on Vercel)
- **Server**: Node.js + Express + TypeScript + MongoDB (deployed on Render)

```
HarvestDirect/
├── client/          # Frontend React application
├── server/          # Backend Express API
└── render.yaml      # Deployment configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn
- IntaSend account (for M-Pesa payments)
- ImgBB API key (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/Muhindisk/HarvestDirect.git
cd HarvestDirect
```

### 2. Setup Backend (Server)

```bash
cd server
npm install

# Create .env file
cp .env.example .env
```

Update `server/.env` with your credentials:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/harvestdirect
JWT_SECRET=your_jwt_secret_key_here
INTASEND_PUBLIC_KEY=your_intasend_public_key
INTASEND_SECRET_KEY=your_intasend_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000

### 3. Setup Frontend (Client)

```bash
cd ../client
npm install
```

Create `client/.env`:
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=HarvestDirect
VITE_APP_URL=http://localhost:5173
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

Start the client:
```bash
npm run dev
```

Client will run on http://localhost:5173

## 📁 Project Structure

### Frontend (client/)
```
client/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Shadcn UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/          # Route pages
│   │   ├── Index.tsx
│   │   ├── Products.tsx
│   │   ├── DashboardFarmer.tsx
│   │   ├── DashboardBuyer.tsx
│   │   ├── Login.tsx
│   │   └── ...
│   ├── lib/            # Utilities and API client
│   ├── hooks/          # Custom React hooks
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
└── vite.config.ts
```

### Backend (server/)
```
server/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth, validation, error handling
│   ├── models/         # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Escrow.ts
│   │   └── Wallet.ts
│   ├── routes/         # API routes
│   ├── services/       # Business logic (payments, wallet)
│   └── index.ts
├── uploads/            # Local file storage
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Browse all products
- `POST /api/products` - Create product (Farmer)
- `PUT /api/products/:id` - Update product (Farmer)
- `DELETE /api/products/:id` - Delete product (Farmer)

### Orders
- `POST /api/orders` - Place order (Buyer)
- `GET /api/orders` - Get user orders
- `PUT /api/orders/:id/status` - Update order status

### Payments & Wallet
- `POST /api/payments/initiate` - M-Pesa payment
- `POST /api/payments/release-escrow/:orderId` - Release funds
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/withdraw` - Withdraw to M-Pesa

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `DELETE /api/cart/clear` - Clear cart

Full API documentation: See [Server README](./Server%20README.md)

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **IntaSend** - M-Pesa payments
- **Bcrypt** - Password hashing
- **Helmet** - Security
- **Morgan** - Logging

## 🎯 User Roles

### Farmers 👨‍🌾
- Add and manage agricultural products
- View and fulfill orders
- Track earnings and wallet balance
- Withdraw funds to M-Pesa
- Upload product images

### Buyers 🛍️
- Browse fresh produce from local farmers
- Add items to cart
- Place orders with secure payment
- Track order status
- Manage wallet deposits

### Admin 🛡️
- Monitor platform statistics
- Manage users and products
- Handle disputes
- Release escrow payments

## 💳 Payment Flow

1. Buyer initiates payment via M-Pesa
2. Funds held in escrow
3. Farmer ships the order
4. Buyer confirms delivery
5. Escrow funds released to farmer's wallet
6. Farmer can withdraw to M-Pesa

## 🚀 Deployment

### Frontend (Vercel)

The client is automatically deployed to Vercel on every push to `main` branch.

**Environment Variables (Vercel Dashboard)**:
- `VITE_API_URL` - https://harvestdirect-7wh7.onrender.com/api

### Backend (Render)

The server is automatically deployed to Render using `render.yaml`.

**Environment Variables (Render Dashboard)**:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `INTASEND_PUBLIC_KEY` - IntaSend public key
- `INTASEND_SECRET_KEY` - IntaSend secret key
- `CLIENT_URL` - https://harvest-direct-seven.vercel.app
- `NODE_ENV` - production

## 🛠️ Development Scripts

### Client
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

### Server
```bash
npm run dev      # Start dev server with nodemon
npm run build    # Compile TypeScript
npm start        # Run production server
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Stephen Muhindi**
- Email: stephenmuhindi903@gmail.com
- GitHub: [@Muhindisk](https://github.com/Muhindisk)

## 🐛 Bug Reports & Issues

Please use [GitHub Issues](https://github.com/Muhindisk/HarvestDirect/issues) to report bugs or request features.

## 📧 Support

For questions or support, contact: stephenmuhindi903@gmail.com

---

Made with ❤️ for Kenyan farmers and agriculture
