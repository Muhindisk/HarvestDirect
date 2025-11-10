import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Scale className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Last Updated: October 23, 2025
              </p>
              <p className="text-muted-foreground">
                Please read these terms carefully before using HarvestDirect
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>1. Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    By accessing and using HarvestDirect ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <p>
                    HarvestDirect provides an online marketplace platform connecting farmers and agricultural producers with buyers. These Terms of Service govern your use of our platform, services, and features.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>2. Account Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>2.1 Eligibility:</strong> You must be at least 18 years old and legally capable of entering into binding contracts to use HarvestDirect.
                  </p>
                  <p>
                    <strong>2.2 Account Information:</strong> You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                  </p>
                  <p>
                    <strong>2.3 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                  <p>
                    <strong>2.4 Account Types:</strong> Users may register as either Farmers/Sellers or Buyers. You must select the appropriate account type for your intended use.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>3. User Responsibilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>3.1 Farmers/Sellers agree to:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate descriptions and images of products</li>
                    <li>Maintain quality standards as advertised</li>
                    <li>Fulfill orders in a timely manner</li>
                    <li>Comply with all applicable agricultural and food safety regulations</li>
                    <li>Package products appropriately for transportation</li>
                  </ul>
                  <p>
                    <strong>3.2 Buyers agree to:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Pay for orders as agreed</li>
                    <li>Inspect products upon delivery</li>
                    <li>Report quality issues within the specified timeframe</li>
                    <li>Treat sellers with respect and professionalism</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>4. Transactions and Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>4.1 Escrow System:</strong> All payments are processed through our secure escrow system. Funds are held until the buyer confirms receipt and satisfaction with the products.
                  </p>
                  <p>
                    <strong>4.2 Commission Fees:</strong> HarvestDirect charges a commission on successful transactions based on your subscription plan (5% for Free, 3% for Professional, 2% for Enterprise).
                  </p>
                  <p>
                    <strong>4.3 Payment Processing:</strong> Payments are processed through third-party payment providers. You agree to comply with their terms and conditions.
                  </p>
                  <p>
                    <strong>4.4 Refunds:</strong> Refunds are handled on a case-by-case basis in accordance with our dispute resolution process.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>5. Product Listings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>5.1 Accuracy:</strong> Sellers must ensure all product information is accurate, including descriptions, quantities, quality grades, and prices.
                  </p>
                  <p>
                    <strong>5.2 Prohibited Items:</strong> Users may not list illegal products, contaminated items, or products that violate health and safety regulations.
                  </p>
                  <p>
                    <strong>5.3 Quality Standards:</strong> Products must meet the quality standards described in the listing and comply with our Quality Standards guidelines.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>6. Dispute Resolution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>6.1 Mediation:</strong> In case of disputes, HarvestDirect will mediate between parties to reach a fair resolution.
                  </p>
                  <p>
                    <strong>6.2 Evidence:</strong> Users are encouraged to document transactions, communications, and product conditions to support dispute claims.
                  </p>
                  <p>
                    <strong>6.3 Final Decision:</strong> HarvestDirect reserves the right to make final decisions in dispute cases based on available evidence and our policies.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>7. Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    All content on HarvestDirect, including text, graphics, logos, images, and software, is the property of HarvestDirect or its licensors and is protected by copyright and other intellectual property laws.
                  </p>
                  <p>
                    Users retain ownership of content they upload but grant HarvestDirect a license to use, display, and distribute such content on the platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>8. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    HarvestDirect acts as a marketplace platform connecting buyers and sellers. We are not responsible for the quality, safety, or legality of products listed, the accuracy of listings, or the ability of sellers to complete transactions.
                  </p>
                  <p>
                    To the maximum extent permitted by law, HarvestDirect shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>9. Termination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We reserve the right to suspend or terminate your account if you violate these Terms of Service or engage in fraudulent, abusive, or illegal activities.
                  </p>
                  <p>
                    Upon termination, your right to use the platform will immediately cease, and we may delete your account information.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>10. Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    HarvestDirect reserves the right to modify these Terms of Service at any time. We will notify users of significant changes via email or platform notifications.
                  </p>
                  <p>
                    Your continued use of the platform after changes are posted constitutes acceptance of the modified terms.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>11. Governing Law</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    These Terms of Service shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>12. Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <ul className="list-none space-y-2">
                    <li><strong>Email:</strong> legal@harvestdirect.com</li>
                    <li><strong>Phone:</strong> +254 111 460 424</li>
                    <li><strong>Address:</strong> Nairobi, Kenya</li>
                  </ul>
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

export default TermsOfService;
