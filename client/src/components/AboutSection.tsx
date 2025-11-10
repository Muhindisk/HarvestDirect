import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  Heart, 
  Users, 
  Leaf,
  Award,
  TrendingUp,
  Globe,
  Handshake
} from "lucide-react";

const AboutSection = () => {
  const navigate = useNavigate();
  
  const values = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Empowering Farmers",
      description: "We believe farmers deserve fair compensation and direct market access for their hard work."
    },
    {
      icon: <Leaf className="h-8 w-8 text-success" />,
      title: "Sustainability First",
      description: "Supporting sustainable farming practices and reducing food waste through efficient supply chains."
    },
    {
      icon: <Handshake className="h-8 w-8 text-secondary" />,
      title: "Building Trust",
      description: "Creating transparent relationships between farmers and buyers through verified profiles and secure transactions."
    },
    {
      icon: <Globe className="h-8 w-8 text-tertiary" />,
      title: "Community Impact",
      description: "Strengthening local food systems and supporting rural communities across Kenya and beyond."
    }
  ];

  const stats = [
    { number: "500+", label: "Active Farmers", icon: <Users className="h-6 w-6" /> },
    { number: "2000+", label: "Orders Completed", icon: <Award className="h-6 w-6" /> },
    { number: "40%", label: "Increase in Farmer Income", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "15+", label: "Counties Served", icon: <Globe className="h-6 w-6" /> }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About HarvestDirect
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We're on a mission to revolutionize Kenya's agricultural supply chain by connecting 
            farmers directly with buyers, creating a more transparent, efficient, and equitable 
            food system for everyone.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To eliminate inefficiencies in the agricultural supply chain by providing a 
                digital platform that enables direct trade between farmers and buyers, ensuring 
                fair prices, quality produce, and sustainable livelihoods.
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-secondary/10 p-3 rounded-full mr-4">
                  <Leaf className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                A future where every farmer has direct access to fair markets and every buyer 
                can source fresh, traceable produce while supporting sustainable agriculture 
                and rural communities across Africa.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Our Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-muted hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <div className="bg-muted/50 p-4 rounded-full w-fit mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h4 className="font-semibold text-foreground mb-3">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-primary/5 rounded-2xl p-8 mb-20">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Impact So Far</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                  <div className="text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Join the Agricultural Revolution
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking to maximize your income or a buyer seeking fresh, 
            quality produce, HarvestDirect is here to transform how you do business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-light text-primary-foreground px-8 py-4"
              onClick={() => navigate('/register?role=farmer')}
            >
              Join as Farmer
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4"
              onClick={() => navigate('/register?role=buyer')}
            >
              Start Buying
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;