import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    loadCart();
    // Listen for updates
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  };

  const removeItem = (productId: string) => {
    const updated = cart.filter(c => c.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
    setCart(updated);
    toast({ title: 'Removed', description: 'Item removed from cart.' });
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    const updated = cart.map(item => item.productId === productId ? { ...item, quantity: qty } : item);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
    setCart(updated);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({ title: 'Cart empty', description: 'Add items before checking out.', variant: 'destructive' });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Placeholder: here you would call your real orders API.
      // Example: await api.orders.create({ items: cart, deliveryAddress: '...' })
      // For now we'll just clear the cart locally and show success.

      // OPTIONAL: Try API integration if available
      // await Promise.all(cart.map(item => api.orders.create({ productId: item.productId, quantity: item.quantity, deliveryAddress: 'To be provided' })));

      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
      setCart([]);

      toast({ title: 'Order placed', description: 'Your order was placed successfully.' });
      navigate('/dashboard/buyer');
    } catch (err) {
      console.error(err);
      toast({ title: 'Checkout failed', description: 'Something went wrong during checkout.', variant: 'destructive' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {cart.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No items in cart</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Browse products and add them to your cart.</p>
              <div className="mt-4">
                <Button onClick={() => navigate('/products')}>Browse Products</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {cart.map(item => (
                <Card key={item.productId} className="mb-4">
                  <CardContent className="flex items-center space-x-4">
                    <img src={item.image || ''} alt={item.name} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">KSh {item.price}</div>
                        </div>
                        <div>
                          <label htmlFor={`qty-${item.productId}`} className="sr-only">Quantity for {item.name}</label>
                          <input
                            id={`qty-${item.productId}`}
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value || '1'))}
                            className="w-20 p-2 border rounded"
                            aria-label={`Quantity for ${item.name}`}
                            title={`Quantity for ${item.name}`}
                          />
                        </div>
                      </div>
                      <div className="mt-2">
                        <Button variant="outline" onClick={() => removeItem(item.productId)}>Remove</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div>Subtotal</div>
                    <div>KSh {getTotal().toFixed(2)}</div>
                  </div>

                  <div className="mt-4">
                    <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                      {isCheckingOut ? 'Placing order...' : 'Checkout'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
