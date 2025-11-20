import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-farmers.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Farmers harvesting fresh produce" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-gray-900/20"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-background leading-tight mb-6">
            Farm Fresh,
            <span className="text-secondary block">Direct to You</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-background/90 mb-12 leading-relaxed">
            HarvestDirect connects farmers directly with buyers, eliminating middlemen 
            and ensuring fair prices for fresh, quality produce.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg shadow-primary-lg"
              onClick={() => navigate('/products')}
            >
              Start Buying
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-background text-background hover:bg-background hover:text-foreground px-8 py-4 text-lg backdrop-blur-sm"
              onClick={() => navigate('/register?role=farmer')}
            >
              Join as Farmer
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary/20 p-3 rounded-full">
                <Users className="h-6 w-6 text-background" />
              </div>
              <div>
                <div className="text-2xl font-bold text-background">500+</div>
                <div className="text-background/80">Active Farmers</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-secondary/20 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-background" />
              </div>
              <div>
                <div className="text-2xl font-bold text-background">40%</div>
                <div className="text-background/80">Higher Farmer Income</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-secondary/20 p-3 rounded-full">
                <Shield className="h-6 w-6 text-background" />
              </div>
              <div>
                <div className="text-2xl font-bold text-background">100%</div>
                <div className="text-background/80">Secure Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;