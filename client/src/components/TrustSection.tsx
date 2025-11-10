import { Card, CardContent } from "@/components/ui/card";
import { Shield, CreditCard, Clock, Award } from "lucide-react";
import freshProduceImage from "@/assets/fresh-products.jpg";

const TrustSection = () => {
  const trustFeatures = [
    {
      icon: <Shield className="h-8 w-8 text-success" />,
      title: "Secure Escrow",
      description: "Payments held safely until delivery is confirmed, protecting both farmers and buyers."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-success" />,
      title: "Multiple Payment Options",
      description: "Pay with M-Pesa, bank cards, or bank transfers through our Intasend integration."
    },
    {
      icon: <Clock className="h-8 w-8 text-success" />,
      title: "Fast Payouts",
      description: "Farmers receive payments within 24-48 hours, with instant payout options available."
    },
    {
      icon: <Award className="h-8 w-8 text-success" />,
      title: "Quality Guarantee",
      description: "Verified farmer profiles and quality ratings ensure you get the best produce."
    }
  ];

  return (
    <section className="py-20 bg-success/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built on
              <span className="text-success block">Trust & Security</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Our platform is designed with security at its core, ensuring safe transactions 
              and reliable service for all users in the agricultural marketplace.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {trustFeatures.map((feature, index) => (
                <Card key={index} className="border-success/20 hover:border-success/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-success/10 p-3 rounded-full flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-success" />
                <span className="font-semibold text-success">Powered by Intasend</span>
              </div>
              <p className="text-muted-foreground">
                Our payment infrastructure is powered by Intasend, Kenya's leading payment platform, 
                ensuring PCI DSS compliance and fraud protection for all transactions.
              </p>
            </div>
          </div>

          <div className="relative">
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <img 
                  src={freshProduceImage} 
                  alt="Fresh organic produce" 
                  className="w-full h-96 object-cover"
                />
              </CardContent>
            </Card>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-8 -left-8 bg-background p-6 rounded-lg shadow-lg border border-border">
              <div className="text-3xl font-bold text-success mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime Reliability</div>
            </div>
            
            <div className="absolute -top-8 -right-8 bg-background p-6 rounded-lg shadow-lg border border-border">
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;