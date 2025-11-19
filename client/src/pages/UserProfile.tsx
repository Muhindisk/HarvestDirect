import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PublicUser {
  _id: string;
  name: string;
  role: string;
  profileImage?: string;
  location?: {
    county?: string;
    subCounty?: string;
  };
  rating?: number;
  totalSales?: number;
  totalPurchases?: number;
  verified?: boolean;
}

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [products, setProducts] = useState<Array<{
    _id: string;
    name: string;
    price: number;
    unit: string;
  }>>([]);
  const [orders, setOrders] = useState<Array<{
    _id: string;
    product?: { name: string };
    quantity: number;
    totalAmount: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/users/${id}`);
        setUser(res.data.user || null);
        setProducts(res.data.products || []);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Failed to load user profile', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-8">Loading profile...</div>;
  if (!user) return <div className="p-8">User not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.role === 'farmer' ? 'Farmer' : 'Buyer'}</p>
            </div>
          </div>
          <div>
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>Public profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>Role: <strong>{user.role}</strong></div>
                  {user.location && (
                    <div>Location: {user.location.county}{user.location.subCounty ? ', ' + user.location.subCounty : ''}</div>
                  )}
                  {user.rating !== undefined && <div>Rating: {user.rating}</div>}
                </div>
              </CardContent>
            </Card>

            {user.role === 'farmer' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>Products offered by this farmer</CardDescription>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No products found</div>
                  ) : (
                    <div className="space-y-4">
                      {products.map(p => (
                        <div key={p._id} className="flex items-center justify-between border rounded p-3">
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-sm text-muted-foreground">KSh {p.price} • {p.unit}</div>
                          </div>
                          <div>
                            <Button onClick={() => navigate(`/products/${p._id}`)}>View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Recent purchases by this buyer</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No orders found</div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(o => (
                        <div key={o._id} className="flex items-center justify-between border rounded p-3">
                          <div>
                            <div className="font-medium">{o.product?.name || 'Product'}</div>
                            <div className="text-sm text-muted-foreground">Qty: {o.quantity} • KSh {o.totalAmount?.toFixed?.(2) ?? o.totalAmount}</div>
                          </div>
                          <div>
                            <Button onClick={() => navigate(`/orders/${o._id}`)}>View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
                <CardDescription>Quick stats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.totalSales !== undefined && <div>Total Sales: KSh {user.totalSales}</div>}
                  {user.totalPurchases !== undefined && <div>Total Purchases: KSh {user.totalPurchases}</div>}
                  <div>Verified: {user.verified ? 'Yes' : 'No'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
