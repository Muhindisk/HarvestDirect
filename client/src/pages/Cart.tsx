import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface DeliveryAddress {
  county: string;
  subCounty: string;
  details: string;
  phone: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [orderTotalAmount, setOrderTotalAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mpesa-stk' | 'card'>('wallet');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    county: '',
    subCounty: '',
    details: '',
    phone: '',
  });

  useEffect(() => {
    loadCart();
    loadWalletBalance();
    // Listen for updates
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  };

  const loadWalletBalance = async () => {
    try {
      const response = await apiClient.get('/wallet/balance');
      setWalletBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Failed to load wallet balance:', error);
    }
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

    // Show delivery address dialog
    setShowCheckoutDialog(true);
  };

  const proceedToPayment = async () => {
    if (!deliveryAddress.county || !deliveryAddress.details || !deliveryAddress.phone) {
      toast({ title: 'Missing information', description: 'Please fill in all delivery details.', variant: 'destructive' });
      return;
    }

    setIsCheckingOut(true);
    setShowCheckoutDialog(false);

    try {
      // Create orders for each cart item
      const orderPromises = cart.map(async (item) => {
        const response = await apiClient.post('/orders', {
          productId: item.productId,
          quantity: item.quantity,
          deliveryAddress,
        });
        console.log('Order created:', response.data);
        return response.data.order;
      });

      const orders = await Promise.all(orderPromises);
      console.log('All orders created:', orders);

      // For simplicity, we'll process payment for the first order
      // In production, you might want to batch all orders or handle them separately
      if (orders.length > 0 && orders[0]?._id) {
        setCurrentOrderId(orders[0]._id);
        // Store the total amount
        setOrderTotalAmount(orders[0].totalAmount || getTotal());
        setShowPaymentDialog(true);
        
        // Note: Cart will only be cleared after successful payment

        toast({ 
          title: 'Orders created', 
          description: 'Please complete payment within 30 minutes to confirm your order.',
          duration: 5000,
        });
      } else {
        throw new Error('No valid orders created');
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      toast({ 
        title: 'Order creation failed', 
        description: err.response?.data?.message || err.message || 'Something went wrong.', 
        variant: 'destructive' 
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handlePayment = async () => {
    if (!currentOrderId) {
      toast({ title: 'Error', description: 'No order ID found', variant: 'destructive' });
      return;
    }

    setIsCheckingOut(true);

    try {
      console.log('Initiating payment for order:', currentOrderId);
      const response = await apiClient.post('/payments/initiate', {
        orderId: currentOrderId,
        paymentMethod,
      });

      console.log('Payment response:', response.data);
      const { data, paymentMethod: method } = response.data;

      if (method === 'wallet') {
        // Wallet payment completed immediately
        // Clear cart now that payment is successful
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
        setCart([]);

        toast({ 
          title: 'Payment successful', 
          description: 'Order paid successfully from your wallet.',
        });

        setShowPaymentDialog(false);
        navigate('/dashboard/buyer');
      } else if (method === 'mpesa-stk') {
        // M-Pesa STK Push initiated
        // Clear cart optimistically (user has initiated payment)
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
        setCart([]);

        toast({ 
          title: 'Payment initiated', 
          description: 'Please check your phone and enter your M-Pesa PIN to complete payment.',
          duration: 10000,
        });

        // Poll for payment status or redirect to order page
        setTimeout(() => {
          setShowPaymentDialog(false);
          navigate('/dashboard/buyer');
        }, 3000);
      } else if (method === 'card') {
        // Redirect to IntaSend payment page
        if (data.url) {
          // Clear cart before redirecting (user will complete payment on IntaSend page)
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('cart-updated'));
          window.location.href = data.url;
        } else {
          toast({ 
            title: 'Error', 
            description: 'No payment URL received', 
            variant: 'destructive' 
          });
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast({ 
        title: 'Payment initiation failed', 
        description: err.response?.data?.message || err.message || 'Something went wrong.', 
        variant: 'destructive' 
      });
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

        {/* Checkout Dialog - Delivery Address */}
        <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delivery Information</DialogTitle>
              <DialogDescription>Please provide your delivery address</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  placeholder="e.g., Nairobi"
                  value={deliveryAddress.county}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, county: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subCounty">Sub-County (Optional)</Label>
                <Input
                  id="subCounty"
                  placeholder="e.g., Westlands"
                  value={deliveryAddress.subCounty}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, subCounty: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="details">Detailed Address</Label>
                <Input
                  id="details"
                  placeholder="Street, building, apartment number"
                  value={deliveryAddress.details}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, details: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="254712345678"
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowCheckoutDialog(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={proceedToPayment} disabled={isCheckingOut} className="flex-1">
                  {isCheckingOut ? 'Processing...' : 'Continue to Payment'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose Payment Method</DialogTitle>
              <DialogDescription>Select how you would like to pay</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                    Pay from Wallet
                    <p className="text-sm text-muted-foreground">
                      Available balance: KSh {walletBalance.toFixed(2)}
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mpesa-stk" id="mpesa" />
                  <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                    M-Pesa STK Push
                    <p className="text-sm text-muted-foreground">Pay directly from your M-Pesa account</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    Card Payment
                    <p className="text-sm text-muted-foreground">Pay using Visa, Mastercard, or other cards</p>
                  </Label>
                </div>
              </RadioGroup>

              <div className="bg-muted p-3 rounded">
                <div className="flex justify-between text-sm mb-2">
                  <span>Total Amount:</span>
                  <span className="font-bold">KSh {orderTotalAmount.toFixed(2)}</span>
                </div>
                {paymentMethod === 'wallet' && walletBalance < orderTotalAmount && (
                  <p className="text-sm text-destructive">
                    Insufficient wallet balance. Please top up your wallet or choose another payment method.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setShowPaymentDialog(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handlePayment} 
                  disabled={isCheckingOut || (paymentMethod === 'wallet' && walletBalance < orderTotalAmount)} 
                  className="flex-1"
                >
                  {isCheckingOut ? 'Processing...' : 'Pay Now'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Cart;
