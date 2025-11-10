import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Heart, TrendingUp, Users, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Careers = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs"
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Professional development budget, mentorship programs, and career advancement paths"
    },
    {
      icon: Users,
      title: "Great Team Culture",
      description: "Collaborative environment, team events, and inclusive workplace policies"
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Flexible working hours, remote work options, and generous paid time off"
    }
  ];

  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Nairobi, Kenya",
      type: "Full-time",
      description: "Build scalable features for our agricultural marketplace platform using React, Node.js, and PostgreSQL."
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Nairobi, Kenya",
      type: "Full-time",
      description: "Drive product strategy and roadmap for features that connect farmers with buyers across East Africa."
    },
    {
      title: "Agricultural Specialist",
      department: "Operations",
      location: "Multiple Locations",
      type: "Full-time",
      description: "Work with farmers to ensure quality standards, provide training, and facilitate marketplace success."
    },
    {
      title: "Customer Success Manager",
      department: "Support",
      location: "Nairobi, Kenya",
      type: "Full-time",
      description: "Help farmers and buyers succeed on the platform through onboarding, training, and ongoing support."
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Nairobi, Kenya / Remote",
      type: "Full-time",
      description: "Develop and execute marketing strategies to grow our user base and brand awareness."
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Nairobi, Kenya / Remote",
      type: "Full-time",
      description: "Analyze marketplace data to drive insights and improve platform performance and user experience."
    }
  ];

  const values = [
    {
      title: "Farmer First",
      description: "We put farmers at the heart of everything we do, ensuring they get fair prices and market access."
    },
    {
      title: "Transparency",
      description: "We believe in open, honest communication and building trust through transparency."
    },
    {
      title: "Innovation",
      description: "We constantly seek new ways to improve agriculture and connect supply with demand."
    },
    {
      title: "Sustainability",
      description: "We're committed to sustainable practices that benefit both people and the planet."
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
              <Briefcase className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Join Our Mission
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Help us transform agriculture and create a more equitable food system. 
                We're looking for passionate people to join our team.
              </p>
              <Button size="lg" className="text-lg px-8">
                View Open Positions
              </Button>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Join HarvestDirect?</h2>
              <p className="text-muted-foreground">
                We're building something meaningful, and we want you to be part of it
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <benefit.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground">
                These principles guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <p className="text-muted-foreground">
                Find your next opportunity and make an impact
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {openPositions.map((position, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                        <CardDescription className="text-base">{position.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="self-start">{position.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{position.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{position.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full md:w-auto">
                      Apply Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Hiring Process</h2>
              <p className="text-muted-foreground">
                We believe in a fair, transparent hiring process
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { step: "1", title: "Apply", description: "Submit your application and resume" },
                { step: "2", title: "Review", description: "We review your application within 1 week" },
                { step: "3", title: "Interview", description: "Meet the team through video or in-person interviews" },
                { step: "4", title: "Offer", description: "Receive an offer and join the team!" }
              ].map((process, index) => (
                <Card key={index} className="text-center relative">
                  <CardHeader>
                    <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {process.step}
                    </div>
                    <CardTitle className="text-lg">{process.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{process.description}</p>
                  </CardContent>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/4 -right-3 w-6 h-0.5 bg-primary/30" />
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Don't See the Right Role?</h2>
              <p className="text-muted-foreground mb-8">
                We're always looking for talented people to join our team. 
                Send us your resume and let us know how you'd like to contribute.
              </p>
              <Button size="lg">
                Send General Application
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;
