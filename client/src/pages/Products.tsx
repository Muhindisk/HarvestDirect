import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, ShoppingCart, MapPin, Star, Leaf, LogOut, Home } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  images?: string[];
  farmer?: {
    _id: string;
    name: string;
    location?: string;
    rating?: number;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer';
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const categories = [
    "All Categories",
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy",
    "Eggs",
    "Herbs",
    "Organic",
  ];

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Get initial cart count
    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('cart-updated', updateCartCount);
    
    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'all') params.category = selectedCategory.toLowerCase();
      if (sortBy) params.sort = sortBy;

      const response = await apiClient.get('/products', { params });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive',
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const params = new URLSearchParams(searchParams);
    if (value !== 'all') {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  const handleAddToCart = (productId: string) => {
    // Check if user is logged in
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Check if user is a buyer
    if (currentUser.role !== 'buyer') {
      toast({
        title: "Access Denied",
        description: "Only buyers can add items to cart.",
        variant: "destructive",
      });
      return;
    }

    // Find the product
    const product = products.find(p => p._id === productId);
    if (!product) return;

    // Get current cart
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      // Increase quantity
      existingItem.quantity += 1;
    } else {
      // Add new item
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0],
      });
    }
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch event to update cart count
    window.dispatchEvent(new Event('cart-updated'));
    
    // Update local count
    updateCartCount();

    // Add to cart logic here
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  const handleDashboard = () => {
    if (currentUser?.role === 'farmer') {
      navigate('/dashboard/farmer');
    } else if (currentUser?.role === 'buyer') {
      navigate('/dashboard/buyer');
    }
  };

  return (
    <div className={`min-h-screen ${currentUser ? 'bg-gradient-to-br from-green-50 to-emerald-100' : 'bg-background'}`}>
      {currentUser ? (
        // Simple header for logged-in users
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">HarvestDirect</h1>
                  <p className="text-sm text-gray-600">Browse Products</p>
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
                  onClick={handleDashboard}
                  className="hidden md:flex items-center space-x-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
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
      ) : (
        // Home navbar for non-logged-in users
        <Navbar />
      )}
      
      {/* Hero Section */}
      <section className={`${currentUser ? 'bg-white' : 'bg-primary/10'} pt-24 pb-12`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Fresh Farm Products
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Browse our selection of fresh, quality produce directly from local farmers
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="eggs">Eggs</SelectItem>
                  <SelectItem value="herbs">Herbs</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-48 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card 
                  key={product._id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewProduct(product._id)}
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                      <Badge className={`absolute top-2 right-2 ${currentUser ? 'bg-green-600' : 'bg-primary'}`}>
                        {product.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="mb-2">{product.name}</CardTitle>
                    <CardDescription className="mb-4 line-clamp-2">
                      {product.description}
                    </CardDescription>
                    
                    {product.farmer && (
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {product.farmer.name} • {product.farmer.location}
                      </div>
                    )}
                    
                    {product.farmer?.rating && (
                      <div className="flex items-center text-sm mb-3">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{product.farmer.rating}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-2xl font-bold ${currentUser ? 'text-green-600' : 'text-primary'}`}>
                          ${product.price}
                        </span>
                        <span className="text-muted-foreground">/{product.unit}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.quantity} {product.unit} available
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className={`w-full ${currentUser ? 'bg-green-600 hover:bg-green-700' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product._id);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {!currentUser && <Footer />}
    </div>
  );
};

export default Products;
