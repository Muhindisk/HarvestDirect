import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, ShoppingBag, Heart, Clock, Search, LogOut, ShoppingCart } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const DashboardBuyer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'buyer') {
      navigate('/dashboard/farmer');
      return;
    }
    
    setUser(parsedUser);
    
    // Get cart count
    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('cart-updated', updateCartCount);
    
    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, [navigate]);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
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
      title: 'Active Orders',
      value: '3',
      icon: <ShoppingBag className="h-6 w-6 text-green-600" />,
      description: 'In progress',
    },
    {
      title: 'Pending Deliveries',
      value: '2',
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      description: 'Awaiting delivery',
    },
    {
      title: 'Saved Farmers',
      value: '5',
      icon: <Heart className="h-6 w-6 text-red-600" />,
      description: 'Your favorites',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">HarvestDirect</h1>
                <p className="text-sm text-gray-600">Buyer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="relative flex items-center space-x-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden md:inline">Cart</span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
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
            Discover fresh produce directly from local farmers.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                {stat.icon}
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
            <CardDescription>Browse and order fresh produce</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                className="bg-green-600 hover:bg-green-700 h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/products')}
              >
                <Search className="h-6 w-6" />
                <span>Browse Products</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                <ShoppingBag className="h-6 w-6" />
                <span>My Orders</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                <Heart className="h-6 w-6" />
                <span>Saved Farmers</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => navigate('/farmers')}
              >
                <Leaf className="h-6 w-6" />
                <span>Find Farmers</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track your purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No orders yet</p>
              <p className="text-sm">Start shopping for fresh produce from local farmers</p>
              <Button 
                className="mt-4 bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/products')}
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardBuyer;
