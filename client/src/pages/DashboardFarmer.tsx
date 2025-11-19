import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Package, ShoppingCart, DollarSign, Plus, LogOut, User, Settings } from 'lucide-react';
import { apiClient, api } from '@/lib/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface OrderItem {
  _id: string;
  product?: any;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const DashboardFarmer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'farmer') {
      navigate('/dashboard/buyer');
      return;
    }
    
    setUser(parsedUser);
    fetchProductCount();
    fetchRecentOrders();
    fetchWalletBalance();
  }, [navigate]);

  const fetchProductCount = async () => {
    try {
      const response = await apiClient.get('/products/my-products');
      setProductCount(response.data.products?.length || 0);
    } catch (error) {
      console.error('Error fetching product count:', error);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      setWalletLoading(true);
      const res = await api.wallet.getBalance();
      setWalletBalance(res.data.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance(null);
    } finally {
      setWalletLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      setRecentLoading(true);
      // Fetch latest 5 orders for this farmer (server will filter by authenticated farmer)
      const res = await api.orders.getAll({ page: 1, limit: 5, sort: 'desc' });
      setRecentOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    } finally {
      setRecentLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: 'Total Products',
      value: productCount.toString(),
      icon: <Package className="h-6 w-6" />,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      description: 'Active listings',
    },
    {
      title: 'Pending Orders',
      value: '8',
      icon: <ShoppingCart className="h-6 w-6" />,
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      description: 'Awaiting fulfillment',
    },
    {
      title: 'Wallet Balance',
      value: walletLoading ? 'Loading...' : walletBalance !== null ? `KSh ${walletBalance.toLocaleString()}` : '—',
      icon: <DollarSign className="h-6 w-6" />,
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      description: 'Available funds',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-primary-600 p-2 rounded-lg shadow-sm">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">HarvestDirect</h1>
                <p className="text-sm text-gray-600">Farmer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer">
                    <Avatar>
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your farm today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.iconBg} p-2 rounded-lg`}>
                  <div className={stat.iconColor}>{stat.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your farm operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/products/add')}
              >
                <Plus className="h-6 w-6" />
                <span>Add New Product</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/products/my-products')}
              >
                <Package className="h-6 w-6" />
                <span>View Products</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/orders')}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Manage Orders</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/revenue')}
              >
                <DollarSign className="h-6 w-6" />
                <span>View Revenue</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLoading ? (
              <p>Loading recent orders...</p>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No orders yet</p>
                <p className="text-sm">Orders from buyers will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((o) => (
                  <div key={o._id} className="flex items-center justify-between border rounded p-3">
                    <div>
                      <div className="font-medium">{o.product?.name || 'Product'}</div>
                      <div className="text-sm text-muted-foreground">Qty: {o.quantity} • KSh {o.totalAmount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Placed: {new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-sm bg-muted">{o.status}</span>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/orders/${o._id}`)}>View</Button>
                    </div>
                  </div>
                ))}
                <div className="text-right">
                  <Button variant="ghost" onClick={() => navigate('/orders')}>View all orders</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardFarmer;
