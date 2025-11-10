import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, BookOpen, MessageCircle, Shield, Package, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpCenter = () => {
  const categories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using HarvestDirect",
      articles: 5
    },
    {
      icon: Package,
      title: "Managing Products",
      description: "How to list and manage your products",
      articles: 8
    },
    {
      icon: CreditCard,
      title: "Payments & Escrow",
      description: "Understanding our payment system",
      articles: 6
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Stay safe on the platform",
      articles: 4
    },
    {
      icon: MessageCircle,
      title: "Communication",
      description: "Tips for effective buyer-seller communication",
      articles: 3
    }
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click on the 'Sign Up' button in the top right corner. Choose whether you're a farmer or buyer, fill in your details, and verify your email address. It's that simple!"
    },
    {
      question: "How does the escrow system work?",
      answer: "When a buyer places an order, the payment is held securely in escrow. Once you confirm shipment and the buyer receives the goods in good condition, the payment is released to you. This protects both parties in the transaction."
    },
    {
      question: "What are the commission rates?",
      answer: "Commission rates depend on your subscription plan: Free (5%), Professional (3%), and Enterprise (2%). All commissions are only charged on successful sales."
    },
    {
      question: "How long does it take to receive payment?",
      answer: "Once the buyer confirms receipt and quality of goods, payments are typically processed within 2-3 business days to your registered account."
    },
    {
      question: "Can I sell internationally?",
      answer: "Currently, HarvestDirect focuses on domestic markets. However, we're working on expanding to international shipping for select products. Contact our enterprise team for more information."
    },
    {
      question: "What if there's a dispute?",
      answer: "If there's a dispute, our support team mediates between buyer and seller. The escrow system ensures funds are protected during the resolution process. Most disputes are resolved within 5-7 business days."
    },
    {
      question: "How do I verify product quality?",
      answer: "Farmers can upload detailed photos and descriptions. Professional and Enterprise members receive a Quality Verification Badge after passing our standards check. Buyers can also request samples for large orders."
    },
    {
      question: "Is there a mobile app?",
      answer: "Yes! Our mobile app is available for both iOS and Android. Download it from the App Store or Google Play to manage your account on the go."
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                How can we help you?
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Search our knowledge base or browse categories below
              </p>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search for help articles..." 
                  className="pl-12 py-6 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{category.articles} articles</span>
                    </div>
                    <CardTitle className="mt-4">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-background border rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Still need help?</h2>
              <p className="text-muted-foreground mb-8">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Contact Support
                </a>
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 border border-input rounded-lg hover:bg-accent transition-colors">
                  Community Forum
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;