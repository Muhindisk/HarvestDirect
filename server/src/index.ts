// Load environment variables only in non-Vercel environment
if (process.env.VERCEL !== '1') {
  require('dotenv').config();
}

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import escrowRoutes from './routes/escrow.routes';
import cartRoutes from './routes/cart.routes';
import reviewRoutes from './routes/review.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';
import walletRoutes from './routes/wallet.routes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to Database only if not in serverless environment
if (process.env.VERCEL !== '1') {
  connectDB();
}

// Trust proxy (important for rate limiting behind reverse proxies like Nginx)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, allow Vercel domains and configured CLIENT_URL
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins: (string | RegExp)[] = [
        process.env.CLIENT_URL || '',
        /\.vercel\.app$/,  // Any Vercel deployment
        /^https:\/\/.*\.vercel\.app$/,
      ];
      
      const isAllowed = allowedOrigins.some(pattern => {
        if (!pattern) return false;
        if (typeof pattern === 'string') return pattern === origin;
        return pattern.test(origin);
      });
      
      callback(null, isAllowed);
    } else {
      // In development, allow localhost
      const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'];
      callback(null, allowedOrigins.includes(origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // Cache preflight requests for 10 minutes
};

app.use(cors(corsOptions));

// Compression middleware (compress responses)
app.use(compression());

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Debug middleware - log all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// Database connection middleware for serverless
if (process.env.VERCEL === '1') {
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error('Database connection failed:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Database connection failed' 
      });
    }
  });
}

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check (no rate limit)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'HarvestDirect API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HarvestDirect API - Agricultural Marketplace',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments',
      escrow: '/api/escrow',
      cart: '/api/cart',
      reviews: '/api/reviews',
      upload: '/api/upload',
      admin: '/api/admin',
      wallet: '/api/wallet'
    },
    documentation: 'https://github.com/Muhindisk/HarvestDirect'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Favicon handler to reduce noise in logs
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 404 Handler
app.use('*', (req, res) => {
  console.log('⚠️ 404 - Route not found:', {
    method: req.method,
    path: req.originalUrl,
    baseUrl: req.baseUrl,
    headers: req.headers,
  });
  
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: {
      root: '/',
      health: '/health',
      auth: '/api/auth/login, /api/auth/register',
      products: '/api/products',
      users: '/api/users',
      cart: '/api/cart',
      orders: '/api/orders',
      payments: '/api/payments',
    }
  });
});
  });
});

// Error Handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Only start server if not in serverless environment (Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌾 HarvestDirect API - Agricultural Marketplace`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'http://localhost:8080'}`);
  });
}

export default app;
