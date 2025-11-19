import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { ShoppingBag } from 'lucide-react';

interface OrderItem {
  _id: string;
  product: any;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.orders.getAll();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // derive filter from query params
  const filter = searchParams.get('filter');
  const activeStatuses = ['pending', 'confirmed', 'in-transit'];
  const filteredOrders = orders.filter(o => {
    if (!filter) return true;
    if (filter === 'active') return activeStatuses.includes(o.status);
    return o.status === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-sm text-muted-foreground">View and track your orders</p>
            </div>
          </div>
          <div>
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>All orders placed by you</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No orders found</p>
                <p className="text-sm">Your recent purchases will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((o) => (
                  <div key={o._id} className="border rounded p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{o.product?.name || 'Product'}</div>
                      <div className="text-sm text-muted-foreground">Qty: {o.quantity} • KSh {o.totalAmount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Placed: {new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full text-sm bg-muted">{o.status}</span>
                      <Button variant="outline" onClick={() => navigate(`/orders/${o._id}`)}>View</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyOrders;
