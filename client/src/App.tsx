import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import HelpCenter from "./pages/HelpCenter";
import SafetyGuidelines from "./pages/SafetyGuidelines";
import QualityStandards from "./pages/QualityStandards";
import ContactUs from "./pages/ContactUs";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Blog from "./pages/Blog";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import DataProtection from "./pages/DataProtection";
import DashboardFarmer from "./pages/DashboardFarmer";
import DashboardBuyer from "./pages/DashboardBuyer";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import AddProduct from "./pages/AddProduct";
import RevenueAnalysis from "./pages/RevenueAnalysis";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Farmers from "./pages/Farmers";
import UserProfile from "./pages/UserProfile";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/safety" element={<SafetyGuidelines />} />
          <Route path="/quality" element={<QualityStandards />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/data-protection" element={<DataProtection />} />
          <Route path="/dashboard/farmer" element={<DashboardFarmer />} />
          <Route path="/dashboard/buyer" element={<DashboardBuyer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/farmers/:id" element={<UserProfile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/my-products" element={<MyProducts />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/revenue" element={<RevenueAnalysis />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
