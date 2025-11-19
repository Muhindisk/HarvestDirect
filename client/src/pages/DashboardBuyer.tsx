import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ShoppingBag, Heart, Clock, Search, LogOut, ShoppingCart, Wallet, ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  category: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

const DashboardBuyer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showTransactionsDialog, setShowTransactionsDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
    
    // Load wallet balance
    loadWalletBalance();
    
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

  const loadWalletBalance = async () => {
    try {
      const response = await apiClient.get('/wallet/balance');
      setWalletBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Failed to load wallet balance:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await apiClient.get('/wallet/transactions');
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast({ title: 'Error', description: 'Failed to load transactions', variant: 'destructive' });
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    if (!phoneNumber) {
      toast({ title: 'Error', description: 'Please enter your phone number', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiClient.post('/wallet/deposit', {
        amount: parseFloat(depositAmount),
        phoneNumber,
      });

      toast({ 
        title: 'Deposit initiated', 
        description: 'Please check your phone and enter your M-Pesa PIN to complete the deposit.',
        duration: 8000,
      });

      setShowDepositDialog(false);
      setDepositAmount('');
      setPhoneNumber('');

      // Refresh balance after a delay
      setTimeout(() => loadWalletBalance(), 5000);
    } catch (error: any) {
      console.error('Deposit error:', error);
      toast({ 
        title: 'Deposit failed', 
        description: error.response?.data?.message || 'Failed to initiate deposit', 
        variant: 'destructive' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid amount', variant: 'destructive' });
      return;
    }
    if (parseFloat(withdrawAmount) > walletBalance) {
      toast({ title: 'Error', description: 'Insufficient balance', variant: 'destructive' });
      return;
    }
    if (!phoneNumber) {
      toast({ title: 'Error', description: 'Please enter your phone number', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await apiClient.post('/wallet/withdraw', {
        amount: parseFloat(withdrawAmount),
        phoneNumber,
      });

      toast({ 
        title: 'Withdrawal initiated', 
        description: 'Your withdrawal request is being processed. You will receive M-Pesa shortly.',
        duration: 8000,
      });

      setShowWithdrawDialog(false);
      setWithdrawAmount('');
      setPhoneNumber('');

      // Refresh balance
      loadWalletBalance();
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast({ 
        title: 'Withdrawal failed', 
        description: error.response?.data?.message || 'Failed to initiate withdrawal', 
        variant: 'destructive' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewTransactions = () => {
    loadTransactions();
    setShowTransactionsDialog(true);
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
      title: 'Wallet Balance',
      value: `KSh ${walletBalance.toFixed(2)}`,
      icon: <Wallet className="h-6 w-6 text-blue-600" />,
      description: 'Available funds',
      action: () => setShowDepositDialog(true),
    },
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
            <Card 
              key={index} 
              className={stat.action ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
              onClick={stat.action}
            >
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

        {/* Wallet Management Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Wallet Management</span>
            </CardTitle>
            <CardDescription>Manage your wallet and view transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setShowDepositDialog(true)}
              >
                <ArrowDownToLine className="h-6 w-6" />
                <span>Deposit Funds</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                onClick={() => setShowWithdrawDialog(true)}
              >
                <ArrowUpFromLine className="h-6 w-6" />
                <span>Withdraw Funds</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={handleViewTransactions}
              >
                <History className="h-6 w-6" />
                <span>View Transactions</span>
              </Button>
            </div>
          </CardContent>
        </Card>

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

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
            <DialogDescription>Add money to your wallet via M-Pesa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deposit-amount">Amount (KSh)</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="deposit-phone">M-Pesa Phone Number</Label>
              <Input
                id="deposit-phone"
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Format: 254XXXXXXXXX</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                You will receive an M-Pesa STK push on your phone. Enter your PIN to complete the deposit.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowDepositDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleDeposit} disabled={isProcessing} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {isProcessing ? 'Processing...' : 'Deposit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>Transfer money from your wallet to M-Pesa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">Available Balance: <span className="font-bold">KSh {walletBalance.toFixed(2)}</span></p>
            </div>
            <div>
              <Label htmlFor="withdraw-amount">Amount (KSh)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="1"
                max={walletBalance}
              />
            </div>
            <div>
              <Label htmlFor="withdraw-phone">M-Pesa Phone Number</Label>
              <Input
                id="withdraw-phone"
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Format: 254XXXXXXXXX</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-orange-800">
                Funds will be sent to your M-Pesa account within a few minutes.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowWithdrawDialog(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleWithdraw} disabled={isProcessing} className="flex-1 bg-orange-600 hover:bg-orange-700">
                {isProcessing ? 'Processing...' : 'Withdraw'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transactions Dialog */}
      <Dialog open={showTransactionsDialog} onOpenChange={setShowTransactionsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>Your recent wallet transactions</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No transactions yet</p>
              </div>
            ) : (
              transactions.map((txn) => (
                <div key={txn._id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={txn.type === 'credit' ? 'default' : 'destructive'}>
                          {txn.type === 'credit' ? '+ ' : '- '}KSh {txn.amount.toFixed(2)}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {txn.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{txn.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Balance: KSh {txn.balanceBefore.toFixed(2)} → KSh {txn.balanceAfter.toFixed(2)}</span>
                        <span>{new Date(txn.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardBuyer;
