import { Button } from "@/components/ui/button";
import { Leaf, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'buyer';
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Products", href: "/products", isRoute: true },
    { label: "How It Works", href: "#how-it-works" },
    { label: "For Farmers", href: "#farmers" },
    { label: "For Buyers", href: "#buyers" },
    { label: "About", href: "#about" }
  ];

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    
    // Listen for custom event when user logs in/out in same tab
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    // Dispatch custom event for other components
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleDashboard = () => {
    if (currentUser?.role === 'farmer') {
      navigate('/dashboard/farmer');
    } else if (currentUser?.role === 'buyer') {
      navigate('/dashboard/buyer');
    }
    setIsMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isRoute?: boolean) => {
    e.preventDefault();
    
    // If it's a route (not an anchor), navigate directly
    if (isRoute) {
      navigate(href);
      setIsMenuOpen(false);
      return;
    }
    
    // If not on home page, navigate to home first then scroll
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
            <div className="bg-gradient-to-br from-primary to-primary-600 p-2 rounded-lg shadow-sm">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              HarvestDirect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.isRoute)}
                className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={handleDashboard}
                >
                  <User className="h-4 w-4 mr-2" />
                  {currentUser.name}
                </Button>
                <Button 
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary-light text-primary-foreground"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.isRoute)}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2 cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                {currentUser ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={handleDashboard}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {currentUser.name}
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                    >
                      Login
                    </Button>
                    <Button 
                      className="bg-primary hover:bg-primary-light text-primary-foreground"
                      onClick={() => { navigate('/register'); setIsMenuOpen(false); }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;