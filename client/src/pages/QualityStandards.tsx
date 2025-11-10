import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, CheckCircle2, Leaf, Package, Scale, Thermometer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const QualityStandards = () => {
  const standards = [
    {
      icon: Leaf,
      title: "Freshness Standards",
      description: "All produce must meet strict freshness criteria",
      criteria: [
        "Harvested within specified timeframes for each product type",
        "No visible signs of decay, mold, or excessive bruising",
        "Proper color, texture, and firmness for the product category",
        "Free from pest damage and disease",
        "Stored at appropriate temperatures before shipping"
      ]
    },
    {
      icon: Scale,
      title: "Grading & Classification",
      description: "Products are graded according to industry standards",
      criteria: [
        "Grade A: Premium quality, uniform size and color",
        "Grade B: Good quality, minor imperfections allowed",
        "Grade C: Fair quality, suitable for processing",
        "Accurate weight measurements and packaging",
        "Clear labeling of grade and classification"
      ]
    },
    {
      icon: Package,
      title: "Packaging Requirements",
      description: "Proper packaging ensures product integrity",
      criteria: [
        "Food-grade, clean packaging materials",
        "Appropriate ventilation for fresh produce",
        "Secure packaging to prevent damage during transit",
        "Clear labeling with product name, grade, weight, and date",
        "Compliance with food safety packaging regulations"
      ]
    },
    {
      icon: Thermometer,
      title: "Storage & Handling",
      description: "Correct storage maintains product quality",
      criteria: [
        "Temperature-controlled storage when required",
        "Protection from direct sunlight and moisture",
        "Clean, pest-free storage facilities",
        "First-in, first-out (FIFO) inventory management",
        "Proper hygiene practices during handling"
      ]
    }
  ];

  const certifications = [
    {
      name: "Organic Certification",
      description: "Products grown without synthetic pesticides or fertilizers",
      benefits: ["Premium pricing", "Access to organic markets", "Environmental sustainability"]
    },
    {
      name: "GlobalG.A.P.",
      description: "Good Agricultural Practices certification",
      benefits: ["International recognition", "Food safety assurance", "Market access"]
    },
    {
      name: "Fair Trade",
      description: "Ethical production and fair pricing standards",
      benefits: ["Fair compensation", "Community development", "Sustainable practices"]
    },
    {
      name: "Quality Verified Badge",
      description: "HarvestDirect's in-house quality verification",
      benefits: ["Increased buyer trust", "Higher visibility", "Premium listings"]
    }
  ];

  const verificationProcess = [
    {
      step: "1",
      title: "Application",
      description: "Submit your quality verification application with farm details and product information"
    },
    {
      step: "2",
      title: "Documentation",
      description: "Provide required certifications, photos, and evidence of quality standards compliance"
    },
    {
      step: "3",
      title: "Inspection",
      description: "Our quality team reviews your submission and may conduct an on-site or virtual inspection"
    },
    {
      step: "4",
      title: "Verification",
      description: "Receive your Quality Verified Badge and enjoy enhanced marketplace visibility"
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
              <Award className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Quality Standards
              </h1>
              <p className="text-xl text-muted-foreground">
                We maintain rigorous quality standards to ensure the best products reach our buyers. 
                Learn what's expected and how to achieve quality verification.
              </p>
            </div>
          </div>
        </section>

        {/* Main Standards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-8">
              {standards.map((standard, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <standard.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{standard.title}</CardTitle>
                        <CardDescription className="text-base">{standard.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {standard.criteria.map((criterion, criterionIndex) => (
                        <li key={criterionIndex} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Recognized Certifications</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Enhance your credibility and market access with these certifications
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {certifications.map((cert, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>{cert.name}</CardTitle>
                      <Badge variant="secondary">Recommended</Badge>
                    </div>
                    <CardDescription>{cert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">Benefits:</p>
                      <ul className="space-y-1">
                        {cert.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Verification Process */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Quality Verification Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get verified and stand out from the crowd with our Quality Verified Badge
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {verificationProcess.map((process, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                      {process.step}
                    </div>
                    <CardTitle className="text-lg">{process.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{process.description}</p>
                  </CardContent>
                  {index < verificationProcess.length - 1 && (
                    <div className="hidden md:block absolute top-1/4 -right-3 w-6 h-0.5 bg-primary/30" />
                  )}
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Apply for Verification
              </a>
            </div>
          </div>
        </section>

        {/* Quality Resources */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Quality Resources</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quality Guidelines PDF</CardTitle>
                    <CardDescription>Comprehensive guide to our quality standards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a href="#" className="text-primary hover:underline">Download Guide →</a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Packaging Best Practices</CardTitle>
                    <CardDescription>Learn proper packaging techniques</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a href="#" className="text-primary hover:underline">View Tutorial →</a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quality Checklist</CardTitle>
                    <CardDescription>Ensure your products meet standards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a href="#" className="text-primary hover:underline">Download Checklist →</a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Training Webinars</CardTitle>
                    <CardDescription>Live sessions on quality management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a href="#" className="text-primary hover:underline">Register Now →</a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QualityStandards;
