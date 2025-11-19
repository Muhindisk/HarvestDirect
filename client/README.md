# HarvestDirect Client

Frontend application for HarvestDirect - A modern agricultural marketplace connecting farmers directly with buyers.

## 🌾 Features

- 🛒 **Marketplace**: Browse and purchase fresh produce directly from farmers
- 👨‍🌾 **Farmer Dashboard**: Manage products, orders, and wallet
- 🛍️ **Buyer Dashboard**: Track orders, manage cart, and wallet
- 💳 **Secure Payments**: M-Pesa integration with escrow protection
- 📱 **Responsive Design**: Mobile-first, works on all devices
- 🎨 **Modern UI/UX**: Polished interface with smooth animations
- 🔐 **Authentication**: Secure JWT-based auth system
- 👤 **User Profiles**: Upload profile images, manage settings

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Muhindisk/HarvestDirect.git
cd HarvestDirect/client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   │   ├── ui/        # Shadcn UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and API client
│   ├── pages/         # Route pages
│   │   ├── Index.tsx
│   │   ├── Products.tsx
│   │   ├── DashboardFarmer.tsx
│   │   ├── DashboardBuyer.tsx
│   │   └── ...
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── index.html
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

## 🎨 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Hooks + LocalStorage
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## 🎯 Key Pages

### Public Pages
- `/` - Landing page with hero section
- `/products` - Browse all products
- `/login` - User login
- `/register` - User registration

### Authenticated Pages
- `/dashboard/farmer` - Farmer dashboard
- `/dashboard/buyer` - Buyer dashboard
- `/profile` - User profile management
- `/settings` - Account settings
- `/cart` - Shopping cart
- `/orders` - Order history

## 🎨 Design System

### Colors
- **Primary**: Green (#22c55e) - Agriculture, growth
- **Secondary**: Yellow (#facc15) - Sunshine, harvest
- **Success**: Green - Completed actions
- **Warning**: Yellow - Pending states
- **Destructive**: Red - Errors, delete actions

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, tight letter-spacing
- **Body**: Regular, optimized line-height

### Components
All UI components use Shadcn UI with custom theming:
- Buttons with gradient backgrounds and hover effects
- Cards with subtle shadows and hover lifts
- Inputs with enhanced focus states
- Smooth transitions (200ms duration)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

## 🌐 Environment Variables

```bash
VITE_API_URL=http://localhost:5000/api  # Backend API URL
```

## 📱 Features Breakdown

### For Farmers
- Add and manage products
- View and manage orders
- Track wallet balance and transactions
- Release escrow payments
- Upload product images

### For Buyers
- Browse fresh produce
- Add items to cart
- Place orders with escrow protection
- Track order status
- Manage wallet and deposits

### Common Features
- Profile image upload (ImgBB integration)
- Notification preferences
- Security settings
- Language and region preferences

## 🎯 Performance Optimizations

- Lazy loading images
- Code splitting by route
- Optimized animations (GPU-accelerated)
- Efficient re-renders with React.memo
- Service worker for caching (PWA-ready)

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.

## 🐛 Bug Reports

Please use GitHub Issues to report bugs.

## 📧 Contact

For questions or support, contact: stephenmuhindi903@gmail.com

