import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Package, ShoppingCart, DollarSign, Plus, LogOut } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const DashboardFarmer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [productCount, setProductCount] = useState(0);

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
  }, [navigate]);

  const fetchProductCount = async () => {
    try {
      const response = await apiClient.get('/products/my-products');
      setProductCount(response.data.products?.length || 0);
    } catch (error) {
      console.error('Error fetching product count:', error);
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
      icon: <Package className="h-6 w-6 text-blue-600" />,
      description: 'Active listings',
    },
    {
      title: 'Pending Orders',
      value: '8',
      icon: <ShoppingCart className="h-6 w-6 text-blue-600" />,
      description: 'Awaiting fulfillment',
    },
    {
      title: 'Total Revenue',
      value: 'KSh 45,000',
      icon: <DollarSign className="h-6 w-6 text-blue-600" />,
      description: 'This month',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">HarvestDirect</h1>
                <p className="text-sm text-gray-600">Farmer Dashboard</p>
              </div>
            </div>
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
              <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
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
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No orders yet</p>
              <p className="text-sm">Orders from buyers will appear here</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardFarmer;
