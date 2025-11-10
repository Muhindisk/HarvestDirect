import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Database, Lock, Shield, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DataProtection = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Database className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Data Protection
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Last Updated: October 23, 2025
              </p>
              <p className="text-muted-foreground">
                Our commitment to protecting your data and complying with data protection regulations
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
                  <CardTitle>1. Our Commitment to Data Protection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    HarvestDirect is committed to protecting the personal data of our users in accordance with applicable data protection laws and regulations, including the Kenya Data Protection Act, 2019, and international standards.
                  </p>
                  <p>
                    This Data Protection policy outlines our practices for collecting, processing, storing, and protecting personal data, as well as your rights as a data subject.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>2. Data Protection Principles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We adhere to the following data protection principles:</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <strong>Lawfulness, Fairness, and Transparency:</strong> We process personal data lawfully, fairly, and in a transparent manner.
                    </li>
                    <li>
                      <strong>Purpose Limitation:</strong> We collect personal data for specified, explicit, and legitimate purposes only.
                    </li>
                    <li>
                      <strong>Data Minimization:</strong> We collect only the data that is necessary for our purposes.
                    </li>
                    <li>
                      <strong>Accuracy:</strong> We take reasonable steps to ensure personal data is accurate and up to date.
                    </li>
                    <li>
                      <strong>Storage Limitation:</strong> We retain personal data only for as long as necessary.
                    </li>
                    <li>
                      <strong>Integrity and Confidentiality:</strong> We implement appropriate security measures to protect personal data.
                    </li>
                    <li>
                      <strong>Accountability:</strong> We are responsible for demonstrating compliance with data protection principles.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>3. Legal Basis for Processing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We process personal data based on the following legal grounds:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Contract Performance:</strong> Processing necessary to fulfill our contract with you as a user</li>
                    <li><strong>Legal Obligation:</strong> Processing required to comply with legal and regulatory requirements</li>
                    <li><strong>Legitimate Interest:</strong> Processing necessary for our legitimate business interests</li>
                    <li><strong>Consent:</strong> Processing based on your explicit consent (e.g., marketing communications)</li>
                    <li><strong>Vital Interest:</strong> Processing necessary to protect someone's life or physical safety</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>4. Your Data Protection Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Under data protection laws, you have the following rights:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Right to Access</h3>
                      <p className="text-sm">
                        You have the right to request a copy of your personal data that we hold.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Right to Rectification</h3>
                      <p className="text-sm">
                        You have the right to request correction of inaccurate or incomplete personal data.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Right to Erasure ("Right to be Forgotten")</h3>
                      <p className="text-sm">
                        You have the right to request deletion of your personal data in certain circumstances.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Right to Restriction of Processing</h3>
                      <p className="text-sm">
                        You have the right to request that we restrict processing of your personal data in certain situations.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Right to Data Portability</h3>
                      <p className="text-sm">
                        You have the right to request transfer of your data to another service provider in a structured, commonly used format.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Right to Object</h3>
                      <p className="text-sm">
                        You have the right to object to processing of your personal data for certain purposes, including direct marketing.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Right to Withdraw Consent</h3>
                      <p className="text-sm">
                        Where we rely on consent as the legal basis for processing, you have the right to withdraw consent at any time.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Right to Lodge a Complaint</h3>
                      <p className="text-sm">
                        You have the right to lodge a complaint with the Office of the Data Protection Commissioner of Kenya if you believe we have violated your data protection rights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>5. Data Security Measures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We implement robust technical and organizational security measures to protect your personal data:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="border rounded-lg p-4">
                      <Lock className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-2">Encryption</h3>
                      <p className="text-sm text-muted-foreground">
                        Data encryption in transit (TLS/SSL) and at rest (AES-256)
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <Shield className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-2">Access Control</h3>
                      <p className="text-sm text-muted-foreground">
                        Role-based access controls and authentication mechanisms
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <Database className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-2">Secure Storage</h3>
                      <p className="text-sm text-muted-foreground">
                        Data stored in secure, ISO-certified data centers
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <FileCheck className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-2">Regular Audits</h3>
                      <p className="text-sm text-muted-foreground">
                        Regular security assessments and penetration testing
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Additional Security Measures:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Firewall protection and intrusion detection systems</li>
                      <li>Regular software updates and security patches</li>
                      <li>Employee training on data security and privacy</li>
                      <li>Incident response and breach notification procedures</li>
                      <li>Data backup and disaster recovery plans</li>
                      <li>Secure data disposal procedures</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>6. Data Breach Notification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Notify the Office of the Data Protection Commissioner within 72 hours of becoming aware of the breach</li>
                    <li>Notify affected users without undue delay</li>
                    <li>Provide information about the nature of the breach and the measures taken</li>
                    <li>Offer guidance on steps you can take to protect yourself</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>7. International Data Transfers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Your personal data may be transferred to and processed in countries outside Kenya. When we transfer data internationally, we ensure:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Adequate levels of data protection in the recipient country</li>
                    <li>Standard contractual clauses approved by relevant authorities</li>
                    <li>Binding corporate rules for intra-group transfers</li>
                    <li>Compliance with applicable data protection laws</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>8. Data Processing Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We maintain records of our data processing activities, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Categories of personal data processed</li>
                    <li>Purposes of processing</li>
                    <li>Categories of data subjects</li>
                    <li>Recipients of personal data</li>
                    <li>International data transfers</li>
                    <li>Retention periods</li>
                    <li>Security measures implemented</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>9. Third-Party Data Processors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We work with third-party service providers who process personal data on our behalf. We ensure that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All processors are carefully selected and vetted</li>
                    <li>Data processing agreements are in place</li>
                    <li>Processors implement appropriate security measures</li>
                    <li>Processors comply with data protection laws</li>
                    <li>We conduct regular audits of processor compliance</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>10. Children's Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    HarvestDirect does not knowingly collect or process personal data from individuals under 18 years of age. If we become aware that we have collected data from a child, we will take steps to delete it promptly.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>11. Data Protection Officer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We have appointed a Data Protection Officer (DPO) to oversee our data protection compliance. You can contact our DPO for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Questions about data protection practices</li>
                    <li>Exercising your data protection rights</li>
                    <li>Concerns about data processing</li>
                    <li>Data breach reports</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Data Protection Officer Contact:</strong>
                  </p>
                  <ul className="list-none space-y-1 mt-2">
                    <li>Email: dpo@harvestdirect.com</li>
                    <li>Phone: +254 111 460 424</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>12. Updates to This Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We may update this Data Protection policy to reflect changes in our practices or legal requirements. We will notify you of material changes and update the "Last Updated" date at the top of this policy.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>13. Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    For questions about this Data Protection policy or to exercise your rights, please contact us:
                  </p>
                  <ul className="list-none space-y-2">
                    <li><strong>Email:</strong> privacy@harvestdirect.com</li>
                    <li><strong>Data Protection Officer:</strong> dpo@harvestdirect.com</li>
                    <li><strong>Phone:</strong> +254 111 460 424</li>
                    <li><strong>Address:</strong> Nairobi, Kenya</li>
                  </ul>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <strong>Office of the Data Protection Commissioner (Kenya):</strong><br />
                      If you believe we have not adequately addressed your concerns, you may lodge a complaint with:<br />
                      Website: <a href="https://www.odpc.go.ke" className="text-primary hover:underline">www.odpc.go.ke</a><br />
                      Email: info@odpc.go.ke
                    </p>
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

export default DataProtection;
