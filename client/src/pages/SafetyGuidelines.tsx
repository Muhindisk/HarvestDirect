import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SafetyGuidelines = () => {
  const guidelines = [
    {
      icon: Shield,
      title: "Use Escrow Protection",
      description: "Always use our escrow system for payments. Never send money directly to sellers or buyers outside the platform.",
      tips: [
        "All payments are held securely until delivery is confirmed",
        "Funds are only released when both parties are satisfied",
        "Report any requests for off-platform payments immediately"
      ]
    },
    {
      icon: UserCheck,
      title: "Verify User Identity",
      description: "Check user profiles, ratings, and verification badges before engaging in transactions.",
      tips: [
        "Look for the verified badge on user profiles",
        "Check seller/buyer ratings and reviews",
        "Be cautious with new accounts with no transaction history",
        "Ask for additional verification for large orders"
      ]
    },
    {
      icon: Eye,
      title: "Inspect Products Carefully",
      description: "Always inspect products upon delivery before confirming receipt.",
      tips: [
        "Check quantity, quality, and condition match the listing",
        "Take photos/videos during unboxing for evidence",
        "Report discrepancies immediately through the platform",
        "Don't confirm receipt until you're fully satisfied"
      ]
    },
    {
      icon: Lock,
      title: "Protect Your Information",
      description: "Keep your personal and financial information secure.",
      tips: [
        "Never share passwords or OTPs with anyone",
        "Use strong, unique passwords for your account",
        "Enable two-factor authentication",
        "Be wary of phishing emails or messages",
        "Only communicate through our platform messaging"
      ]
    }
  ];

  const redFlags = [
    "Requests to complete transactions outside the platform",
    "Unusually low prices that seem too good to be true",
    "Pressure to make quick decisions without proper inspection",
    "Requests for personal banking information",
    "Poor communication or evasive answers to questions",
    "Unwillingness to provide additional product information or photos",
    "Payment requests via untraceable methods"
  ];

  const bestPractices = [
    {
      title: "For Farmers/Sellers",
      items: [
        "Provide accurate, detailed product descriptions and photos",
        "Set realistic prices based on market rates",
        "Package products securely to prevent damage",
        "Ship within the promised timeframe",
        "Respond promptly to buyer inquiries",
        "Maintain proper documentation of your products"
      ]
    },
    {
      title: "For Buyers",
      items: [
        "Research market prices before making purchases",
        "Ask questions about product specifications",
        "Request additional photos if needed",
        "Read seller reviews and ratings carefully",
        "Start with smaller orders when trying new sellers",
        "Keep all communication on the platform"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Safety Guidelines
              </h1>
              <p className="text-xl text-muted-foreground">
                Your safety is our priority. Follow these guidelines to ensure secure and successful transactions on HarvestDirect.
              </p>
            </div>
          </div>
        </section>

        {/* Main Guidelines */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-8">
              {guidelines.map((guideline, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <guideline.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{guideline.title}</CardTitle>
                        <p className="text-muted-foreground">{guideline.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guideline.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Red Flags */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Alert variant="destructive" className="mb-8">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-lg font-semibold">Warning Signs</AlertTitle>
                <AlertDescription>
                  Be cautious if you encounter any of these red flags
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle>Common Scam Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Best Practices</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {bestPractices.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Report Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Report Suspicious Activity</h2>
              <p className="text-muted-foreground mb-8">
                If you encounter any suspicious behavior or potential scams, report it immediately to our safety team. We investigate all reports and take appropriate action to protect our community.
              </p>
              <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Report an Issue
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SafetyGuidelines;