import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/orders/${id}`);
        if (res.data && res.data.order) {
          setOrder(res.data.order);
          setErrorMessage(null);
        } else {
          setOrder(null);
          setErrorMessage(res.data?.message || 'Order not found');
        }
      } catch (err) {
        console.error('Failed to load order', err);
        const msg = (err as any)?.response?.data?.message || (err as any)?.message || 'Failed to fetch order';
        setErrorMessage(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-8">Loading order...</div>;
  if (!order) {
    return (
      <div className="p-8">
        <div className="mb-4 text-red-600">{errorMessage || 'Order not found'}</div>
        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
      </div>
    );
  }

  const product = order.product || {};
  const farmer = order.farmer || {};
  const buyer = order.buyer || {};

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (e) {
      return null;
    }
  })();

  const isBuyer = currentUser && currentUser.role === 'buyer';
  const isOrderBuyer = isBuyer && order.buyer && ((order.buyer._id || order.buyer) === (currentUser._id || currentUser.id));

  const canCancel = ['pending', 'confirmed'].includes(order.status) && isOrderBuyer;

  const handleCancel = async () => {
    if (!canCancel) return;
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setIsCancelling(true);
    try {
      const res = await apiClient.post(`/orders/${order._id}/cancel`, { reason: 'Cancelled by buyer' });
      const updated = res.data.order || res.data;
      setOrder(updated);
      toast({ title: 'Order cancelled', description: 'Your order has been cancelled.' });
    } catch (err: any) {
      console.error('Cancel order error:', err);
      toast({ title: 'Cancellation failed', description: err?.message || err?.response?.data?.message || 'Could not cancel order', variant: 'destructive' });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleContactFarmer = () => {
    if (farmer.email) {
      window.location.href = `mailto:${farmer.email}`;
      return;
    }
    if (farmer.phone) {
      // sanitize phone number for tel: link
      const tel = farmer.phone.replace(/[\s\-()+]/g, '');
      window.location.href = `tel:${tel}`;
      return;
    }
    toast({ title: 'No contact info', description: 'This farmer has no contact information available.' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber || order._id}</h1>
            <p className="text-sm text-muted-foreground">Placed: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <Button variant="outline" onClick={() => navigate('/orders')}>Back to Orders</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Product</CardTitle>
                <CardDescription>Item ordered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img src={product.images?.[0] || ''} alt={product.name} className="w-28 h-28 object-cover rounded" />
                  <div>
                    <div className="font-medium text-lg">{product.name}</div>
                    <div className="text-sm text-muted-foreground">KSh {product.price} • {product.unit}</div>
                    <div className="text-sm mt-2">Quantity: {order.quantity}</div>
                    <div className="text-sm">Total: KSh {order.totalAmount?.toFixed?.(2) ?? order.totalAmount}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
                <CardDescription>Where the order will be delivered</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <div>{order.deliveryAddress?.county}, {order.deliveryAddress?.subCounty}</div>
                  <div className="text-sm text-muted-foreground">{order.deliveryAddress?.details}</div>
                  <div className="text-sm text-muted-foreground">Phone: {order.deliveryAddress?.phone}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Buyer notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{order.notes || '—'}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>Status: <strong>{order.status}</strong></div>
                  <div>Payment Status: <strong>{order.paymentStatus}</strong></div>
                  <div>Placed: {new Date(order.createdAt).toLocaleString()}</div>
                  <div>Order ID: {order._id}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seller</CardTitle>
                <CardDescription>Farmer details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">{farmer.name}</div>
                  <div className="text-sm text-muted-foreground">Phone: {farmer.phone || '—'}</div>
                  <div>
                    <Button variant="ghost" onClick={() => navigate(`/farmers/${farmer._id}`)}>View Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
