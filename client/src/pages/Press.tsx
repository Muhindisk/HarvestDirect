import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Newspaper, Download, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Press = () => {
  const pressReleases = [
    {
      date: "October 15, 2025",
      title: "HarvestDirect Secures $5M Series A to Expand Across East Africa",
      excerpt: "Leading agricultural marketplace platform announces major funding round to scale operations and reach more farmers.",
      category: "Funding",
      link: "#"
    },
    {
      date: "September 20, 2025",
      title: "HarvestDirect Partners with Kenya Agricultural Research Institute",
      excerpt: "Strategic partnership aims to improve crop quality and farming practices through technology and research.",
      category: "Partnership",
      link: "#"
    },
    {
      date: "August 10, 2025",
      title: "Platform Reaches 10,000 Active Farmers Milestone",
      excerpt: "HarvestDirect celebrates major growth milestone as more farmers embrace direct-to-buyer marketplace model.",
      category: "Milestone",
      link: "#"
    },
    {
      date: "July 5, 2025",
      title: "New Mobile App Launched for iOS and Android",
      excerpt: "Farmers and buyers can now manage their business on the go with new mobile applications.",
      category: "Product",
      link: "#"
    },
    {
      date: "June 18, 2025",
      title: "HarvestDirect Wins Best AgriTech Startup Award",
      excerpt: "Platform recognized for innovation in connecting farmers with markets and improving agricultural trade.",
      category: "Award",
      link: "#"
    }
  ];

  const mediaKit = [
    {
      title: "Company Logo",
      description: "Official HarvestDirect logos in various formats",
      fileType: "PNG, SVG, PDF"
    },
    {
      title: "Brand Guidelines",
      description: "Colors, typography, and usage guidelines",
      fileType: "PDF"
    },
    {
      title: "Press Photos",
      description: "High-resolution images of our team and platform",
      fileType: "JPG"
    },
    {
      title: "Company Fact Sheet",
      description: "Key facts, figures, and company information",
      fileType: "PDF"
    }
  ];

  const coverage = [
    {
      outlet: "TechCrunch",
      title: "How HarvestDirect is Transforming Agriculture in Kenya",
      date: "September 2025",
      link: "#"
    },
    {
      outlet: "Bloomberg",
      title: "AgriTech Startups Revolutionize Farm-to-Market Supply Chains",
      date: "August 2025",
      link: "#"
    },
    {
      outlet: "The East African",
      title: "Digital Platforms Give Farmers Direct Access to Buyers",
      date: "July 2025",
      link: "#"
    },
    {
      outlet: "Forbes Africa",
      title: "Meet the Startups Making Agriculture More Profitable",
      date: "June 2025",
      link: "#"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Farmers" },
    { number: "5,000+", label: "Registered Buyers" },
    { number: "$2M+", label: "Monthly Transactions" },
    { number: "95%", label: "User Satisfaction" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Newspaper className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Press & Media
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Latest news, press releases, and media resources about HarvestDirect
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12">Press Releases</h2>
              
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
                        <Badge variant="secondary">{release.category}</Badge>
                        <span className="text-sm text-muted-foreground">{release.date}</span>
                      </div>
                      <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                      <CardDescription className="text-base">{release.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="p-0 h-auto">
                        Read Full Release <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Media Coverage */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-12">In the News</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {coverage.map((article, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="font-semibold text-primary mb-2">{article.outlet}</div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription>{article.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="p-0 h-auto">
                        Read Article <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Media Kit */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Media Kit</h2>
                <p className="text-muted-foreground">
                  Download our brand assets and company information
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mediaKit.map((item, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{item.fileType}</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button size="lg" variant="outline">
                  <Download className="h-5 w-5 mr-2" />
                  Download Complete Media Kit
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-2xl">Press Inquiries</CardTitle>
                  <CardDescription className="text-base">
                    For press inquiries, interviews, or more information, please contact our media team
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <p className="font-semibold mb-1">Media Relations</p>
                    <a href="mailto:press@harvestdirect.com" className="text-primary hover:underline">
                      press@harvestdirect.com
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">General Inquiries</p>
                    <a href="mailto:stephenmuhindi903@gmail.com" className="text-primary hover:underline">
                      stephenmuhindi903@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Phone</p>
                    <a href="tel:+254111460424" className="text-primary hover:underline">
                      +254 111 460 424
                    </a>
                  </div>
                  <Button className="mt-4">
                    Contact Press Team
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Press;
