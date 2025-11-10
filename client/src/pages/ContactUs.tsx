import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ContactUs = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      info: "stephenmuhindi903@gmail.com",
      description: "We'll respond within 24 hours",
      action: "mailto:stephenmuhindi903@gmail.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+254 111 460 424",
      description: "Mon-Fri, 8AM-6PM EAT",
      action: "tel:+254111460424"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "Nairobi, Kenya",
      description: "By appointment only",
      action: "#"
    },
    {
      icon: Clock,
      title: "Business Hours",
      info: "Mon-Fri: 8AM-6PM",
      description: "Saturday: 9AM-2PM",
      action: "#"
    }
  ];

  const departments = [
    {
      name: "General Support",
      email: "support@harvestdirect.com",
      description: "Account issues, platform questions"
    },
    {
      name: "Sales & Partnerships",
      email: "sales@harvestdirect.com",
      description: "Enterprise plans, bulk orders"
    },
    {
      name: "Technical Support",
      email: "tech@harvestdirect.com",
      description: "Technical issues, bugs"
    },
    {
      name: "Quality & Safety",
      email: "quality@harvestdirect.com",
      description: "Report quality issues or safety concerns"
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
              <MessageSquare className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <method.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={method.action} 
                      className="font-semibold text-primary hover:underline block mb-2"
                    >
                      {method.info}
                    </a>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Departments */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Doe" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+254 700 000 000" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                            <SelectItem value="quality">Quality Issue</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us how we can help you..." 
                          rows={6}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Departments */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Departments</CardTitle>
                    <CardDescription>Reach the right team directly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {departments.map((dept, index) => (
                      <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                        <h4 className="font-semibold mb-1">{dept.name}</h4>
                        <a href={`mailto:${dept.email}`} className="text-sm text-primary hover:underline block mb-1">
                          {dept.email}
                        </a>
                        <p className="text-xs text-muted-foreground">{dept.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Help</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <a href="/help" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                      <div className="font-semibold text-sm">Help Center</div>
                      <div className="text-xs text-muted-foreground">Browse FAQs and guides</div>
                    </a>
                    <a href="/safety" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                      <div className="font-semibold text-sm">Safety Guidelines</div>
                      <div className="text-xs text-muted-foreground">Learn about staying safe</div>
                    </a>
                    <a href="/quality" className="block p-3 rounded-lg border hover:bg-accent transition-colors">
                      <div className="font-semibold text-sm">Quality Standards</div>
                      <div className="text-xs text-muted-foreground">View our quality criteria</div>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section (Placeholder) */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Our Location</CardTitle>
                  <CardDescription>Visit us at our office in Nairobi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted h-96 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Map integration coming soon</p>
                      <p className="text-sm text-muted-foreground mt-2">Nairobi, Kenya</p>
                    </div>
                  </div>
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

export default ContactUs;
