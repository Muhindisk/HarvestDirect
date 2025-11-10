import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, ShoppingCart, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import farmerImage from "@/assets/farmer-digital.jpg";
import restaurantImage from "@/assets/restaurant-sourcing.jpg";

const HowItWorksSection = () => {
  const navigate = useNavigate();
  const farmerSteps = [
    {
      icon: <UserPlus className="h-12 w-12 text-primary" />,
      title: "Create Your Profile",
      description: "Sign up and showcase your farm, products, and certifications to build trust with buyers."
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-primary" />,
      title: "List Your Produce",
      description: "Upload photos, set prices, and specify quantities and harvest dates for your products."
    },
    {
      icon: <Truck className="h-12 w-12 text-primary" />,
      title: "Fulfill Orders",
      description: "Receive orders, communicate with buyers, and use our logistics partners for delivery."
    }
  ];

  const buyerSteps = [
    {
      icon: <ShoppingCart className="h-12 w-12 text-secondary" />,
      title: "Browse & Compare",
      description: "Search for specific products, compare prices, and view detailed farm profiles."
    },
    {
      icon: <UserPlus className="h-12 w-12 text-secondary" />,
      title: "Place Your Order",
      description: "Select quantities, choose delivery options, and pay securely through our platform."
    },
    {
      icon: <Truck className="h-12 w-12 text-secondary" />,
      title: "Receive Fresh Produce",
      description: "Get your order delivered fresh from the farm with full traceability and quality guarantee."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simple steps to connect farmers and buyers for a more efficient food supply chain
          </p>
        </div>

        {/* Farmers Flow */}
        <div id="farmers" className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-8">For Farmers</h3>
              <div className="space-y-8">
                {farmerSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="bg-primary/10 p-4 rounded-full flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-2">
                        {index + 1}. {step.title}
                      </h4>
                      <p className="text-muted-foreground text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                className="mt-8 bg-primary hover:bg-primary-light text-primary-foreground px-8 py-3"
                onClick={() => navigate('/register?role=farmer')}
              >
                Join as Farmer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative">
              <Card className="overflow-hidden border-primary/20">
                <CardContent className="p-0">
                  <img 
                    src={farmerImage} 
                    alt="Farmer using digital platform" 
                    className="w-full h-96 object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Buyers Flow */}
        <div id="buyers">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <Card className="overflow-hidden border-secondary/20">
                <CardContent className="p-0">
                  <img 
                    src={restaurantImage} 
                    alt="Restaurant chef with fresh produce" 
                    className="w-full h-96 object-cover"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl font-bold text-tertiary mb-8">For Buyers</h3>
              <div className="space-y-8">
                {buyerSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="bg-secondary/10 p-4 rounded-full flex-shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-2">
                        {index + 1}. {step.title}
                      </h4>
                      <p className="text-muted-foreground text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                className="mt-8 bg-secondary hover:bg-secondary-light text-secondary-foreground px-8 py-3"
                onClick={() => navigate('/register?role=buyer')}
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;