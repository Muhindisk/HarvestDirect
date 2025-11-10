import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const RevenueAnalysis = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [timeRange, setTimeRange] = useState('month');

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
  }, [navigate]);

  if (!user) {
    return null;
  }

  // Sample data for monthly revenue
  const monthlyData = [
    { month: 'Jan', revenue: 12000, orders: 45 },
    { month: 'Feb', revenue: 15000, orders: 52 },
    { month: 'Mar', revenue: 18000, orders: 61 },
    { month: 'Apr', revenue: 22000, orders: 68 },
    { month: 'May', revenue: 28000, orders: 75 },
    { month: 'Jun', revenue: 32000, orders: 82 },
    { month: 'Jul', revenue: 35000, orders: 89 },
    { month: 'Aug', revenue: 38000, orders: 95 },
    { month: 'Sep', revenue: 42000, orders: 102 },
    { month: 'Oct', revenue: 45000, orders: 108 },
    { month: 'Nov', revenue: 48000, orders: 115 },
  ];

  // Sample data for weekly revenue
  const weeklyData = [
    { week: 'Week 1', revenue: 8500, orders: 28 },
    { week: 'Week 2', revenue: 11200, orders: 35 },
    { week: 'Week 3', revenue: 13800, orders: 42 },
    { week: 'Week 4', revenue: 14500, orders: 38 },
  ];

  // Sample data for daily revenue (last 7 days)
  const dailyData = [
    { day: 'Mon', revenue: 1800, orders: 6 },
    { day: 'Tue', revenue: 2200, orders: 8 },
    { day: 'Wed', revenue: 1900, orders: 7 },
    { day: 'Thu', revenue: 2500, orders: 9 },
    { day: 'Fri', revenue: 2800, orders: 10 },
    { day: 'Sat', revenue: 3200, orders: 12 },
    { day: 'Sun', revenue: 2400, orders: 8 },
  ];

  const getChartData = () => {
    switch (timeRange) {
      case 'week':
        return weeklyData;
      case 'day':
        return dailyData;
      default:
        return monthlyData;
    }
  };

  const getXAxisKey = () => {
    switch (timeRange) {
      case 'week':
        return 'week';
      case 'day':
        return 'day';
      default:
        return 'month';
    }
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: 'KSh 48,000',
      change: '+12.5%',
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      changePositive: true,
    },
    {
      title: 'Average Order Value',
      value: 'KSh 417',
      change: '+8.2%',
      icon: <TrendingUp className="h-6 w-6 text-blue-600" />,
      changePositive: true,
    },
    {
      title: 'Total Orders',
      value: '115',
      change: '+6.5%',
      icon: <Calendar className="h-6 w-6 text-purple-600" />,
      changePositive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard/farmer')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Revenue Analysis</h1>
          <p className="text-gray-600">Track your earnings and sales performance</p>
        </div>

        {/* Stats Cards */}
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
                <p
                  className={`text-xs mt-1 flex items-center ${
                    stat.changePositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Chart */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Track your revenue over time</CardDescription>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Last 7 Days</SelectItem>
                  <SelectItem value="week">Last 4 Weeks</SelectItem>
                  <SelectItem value="month">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={getXAxisKey()} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name="Revenue (KSh)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Distribution</CardTitle>
            <CardDescription>Number of orders by period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={getXAxisKey()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#16a34a" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueAnalysis;
