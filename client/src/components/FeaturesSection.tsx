import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Truck, 
  DollarSign, 
  Eye, 
  MessageCircle, 
  BarChart3, 
  Shield,
  Clock,
  MapPin
} from "lucide-react";

const FeaturesSection = () => {
  const farmerFeatures = [
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Maximize Your Profits",
      description: "Cut out middlemen and earn up to 40% more on your harvest with transparent, fair pricing."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Market Insights",
      description: "Real-time market demand and pricing analytics to help you make informed decisions."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Direct Communication",
      description: "Build lasting relationships with buyers through our integrated messaging system."
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Integrated Logistics",
      description: "One-click delivery booking with our trusted logistics partners for seamless fulfillment."
    }
  ];

  const buyerFeatures = [
    {
      icon: <Eye className="h-8 w-8 text-secondary" />,
      title: "Full Transparency",
      description: "Know exactly where your food comes from with detailed farm profiles and growing practices."
    },
    {
      icon: <Clock className="h-8 w-8 text-secondary" />,
      title: "Fresh Guarantee",
      description: "Get the freshest produce delivered directly from farms with harvest date tracking."
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: "Secure Payments",
      description: "Protected transactions with escrow services and multiple payment options including M-Pesa."
    },
    {
      icon: <MapPin className="h-8 w-8 text-secondary" />,
      title: "Local Sourcing",
      description: "Support local farmers while getting competitive prices on quality produce."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Benefits for Everyone
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform creates value for both farmers and buyers, 
            building a more efficient and equitable food system.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Farmers Section */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-primary mb-4">For Farmers</h3>
              <p className="text-muted-foreground">
                Grow your income and reach more customers
              </p>
            </div>
            
            <div className="grid gap-6">
              {farmerFeatures.map((feature, index) => (
                <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Buyers Section */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-tertiary mb-4">For Buyers</h3>
              <p className="text-muted-foreground">
                Fresh produce at fair prices with full traceability
              </p>
            </div>
            
            <div className="grid gap-6">
              {buyerFeatures.map((feature, index) => (
                <Card key={index} className="border-secondary/20 hover:border-secondary/40 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-secondary/10 p-3 rounded-full">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;