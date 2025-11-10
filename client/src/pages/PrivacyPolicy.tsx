import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
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
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Last Updated: October 23, 2025
              </p>
              <p className="text-muted-foreground">
                Your privacy is important to us. Learn how we collect, use, and protect your information.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>1. Introduction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    HarvestDirect ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                  </p>
                  <p>
                    By using HarvestDirect, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>2. Information We Collect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>2.1 Personal Information:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name and contact information (email, phone number, address)</li>
                    <li>Account credentials (username and password)</li>
                    <li>Payment information (processed by third-party payment providers)</li>
                    <li>Business information (farm details, business registration)</li>
                    <li>Identification documents for verification purposes</li>
                  </ul>
                  <p>
                    <strong>2.2 Transaction Information:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Product listings and descriptions</li>
                    <li>Order history and transaction details</li>
                    <li>Communication between buyers and sellers</li>
                    <li>Reviews and ratings</li>
                  </ul>
                  <p>
                    <strong>2.3 Technical Information:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Usage data and analytics</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>3. How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We use the information we collect for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Platform Operation:</strong> To provide, maintain, and improve our services</li>
                    <li><strong>Transaction Processing:</strong> To facilitate transactions between buyers and sellers</li>
                    <li><strong>Communication:</strong> To send notifications, updates, and respond to inquiries</li>
                    <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
                    <li><strong>Verification:</strong> To verify user identity and maintain platform integrity</li>
                    <li><strong>Analytics:</strong> To analyze usage patterns and improve user experience</li>
                    <li><strong>Marketing:</strong> To send promotional materials (with your consent)</li>
                    <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>4. Information Sharing and Disclosure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    <strong>4.1 With Other Users:</strong> We share necessary information with buyers and sellers to facilitate transactions (e.g., contact details for delivery).
                  </p>
                  <p>
                    <strong>4.2 With Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf (payment processing, analytics, customer support).
                  </p>
                  <p>
                    <strong>4.3 For Legal Reasons:</strong> We may disclose information if required by law or in response to legal requests.
                  </p>
                  <p>
                    <strong>4.4 Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user information may be transferred.
                  </p>
                  <p>
                    <strong>4.5 With Your Consent:</strong> We may share information for other purposes with your explicit consent.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>5. Data Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <p>
                    Security measures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of sensitive data in transit and at rest</li>
                    <li>Secure authentication and access controls</li>
                    <li>Regular security audits and assessments</li>
                    <li>Employee training on data protection</li>
                    <li>Incident response and breach notification procedures</li>
                  </ul>
                  <p>
                    However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>6. Your Data Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Objection:</strong> Object to certain processing activities</li>
                    <li><strong>Consent Withdrawal:</strong> Withdraw consent for data processing</li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us at privacy@harvestdirect.com
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>7. Data Retention</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.
                  </p>
                  <p>
                    When you delete your account, we will delete or anonymize your personal information within 90 days, except where we are required to retain it for legal or regulatory purposes.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>8. Children's Privacy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    HarvestDirect is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>9. International Data Transfers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>10. Changes to This Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our platform and updating the "Last Updated" date.
                  </p>
                  <p>
                    We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>11. Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    If you have questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <ul className="list-none space-y-2">
                    <li><strong>Email:</strong> privacy@harvestdirect.com</li>
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

export default PrivacyPolicy;
