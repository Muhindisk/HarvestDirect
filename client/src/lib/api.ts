import axios from 'axios';

// Types for API requests
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'buyer';
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  profileImage?: string;
  location?: {
    county?: string;
    subCounty?: string;
  };
  mpesaNumber?: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
}

interface ProductData {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  images?: string[];
}

interface OrderData {
  productId: string;
  quantity: number;
  deliveryAddress: string;
  notes?: string;
}

interface PaymentData {
  orderId: string;
  amount: number;
  method: 'mpesa' | 'card' | 'bank_transfer';
  phoneNumber?: string;
}

interface DisputeData {
  reason: string;
  description: string;
  evidence?: string[];
}

interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// API base URL - automatically uses environment variable or defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/sessions
});

// Request interceptor - add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden
          console.error('Access denied');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 429:
          // Too many requests
          console.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Server error
          console.error('Server error. Please try again later.');
          break;
      }
      
      return Promise.reject(data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error. Please check your connection.');
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    register: (data: RegisterData) => apiClient.post('/auth/register', data),
    login: (data: LoginData) => apiClient.post('/auth/login', data),
    getMe: () => apiClient.get('/auth/me'),
    logout: () => apiClient.post('/auth/logout'),
  },
  
  // User endpoints
  users: {
    getProfile: (id: string) => apiClient.get(`/users/${id}`),
    updateProfile: (id: string, data: UpdateProfileData) => apiClient.put(`/users/${id}`, data),
    deleteAccount: (id: string) => apiClient.delete(`/users/${id}`),
    getMyProfile: () => apiClient.get('/users/profile'),
    updateMyProfile: (data: UpdateProfileData) => apiClient.put('/users/profile', data),
  },
  
  // Product endpoints
  products: {
    getAll: (params?: QueryParams) => apiClient.get('/products', { params }),
    getById: (id: string) => apiClient.get(`/products/${id}`),
    create: (data: ProductData) => apiClient.post('/products', data),
    update: (id: string, data: Partial<ProductData>) => apiClient.put(`/products/${id}`, data),
    delete: (id: string) => apiClient.delete(`/products/${id}`),
    search: (query: string) => apiClient.get(`/products/search?q=${query}`),
  },
  
  // Order endpoints
  orders: {
    getAll: (params?: QueryParams) => apiClient.get('/orders', { params }),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
    create: (data: OrderData) => apiClient.post('/orders', data),
    update: (id: string, data: Partial<OrderData>) => apiClient.put(`/orders/${id}`, data),
    cancel: (id: string) => apiClient.post(`/orders/${id}/cancel`),
  },

  // Wallet endpoints
  wallet: {
    getBalance: () => apiClient.get('/wallet/balance'),
    getWallet: () => apiClient.get('/wallet'),
    getTransactions: (params?: QueryParams) => apiClient.get('/wallet/transactions', { params }),
    deposit: (data: { amount: number; paymentMethod?: string }) => apiClient.post('/wallet/deposit', data),
    withdraw: (data: { amount: number; account: string; accountName: string }) => apiClient.post('/wallet/withdraw', data),
  },
  
  // Payment endpoints
  payments: {
    initiate: (data: PaymentData) => apiClient.post('/payments/initiate', data),
    verify: (transactionId: string) => apiClient.get(`/payments/verify/${transactionId}`),
    getHistory: () => apiClient.get('/payments/history'),
  },
  
  // Escrow endpoints
  escrow: {
    getById: (id: string) => apiClient.get(`/escrow/${id}`),
    release: (id: string) => apiClient.post(`/escrow/${id}/release`),
    dispute: (id: string, data: DisputeData) => apiClient.post(`/escrow/${id}/dispute`, data),
  },
  
  // Upload endpoints
  upload: {
    profileImage: (formData: FormData) => apiClient.post('/upload/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    productImages: (formData: FormData) => apiClient.post('/upload/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  },
};

export default apiClient;
