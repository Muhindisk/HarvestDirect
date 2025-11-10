import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cookie, Settings, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Cookie className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Cookie Policy
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Last Updated: October 23, 2025
              </p>
              <p className="text-muted-foreground">
                Learn about how we use cookies and similar technologies on HarvestDirect
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
                  <CardTitle>1. What Are Cookies?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                  </p>
                  <p>
                    Cookies help us understand how you use our platform, remember your preferences, and improve your experience on HarvestDirect.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>2. Types of Cookies We Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">2.1 Essential Cookies</h3>
                    <p className="mb-2">
                      These cookies are necessary for the platform to function properly. They enable basic features like page navigation, access to secure areas, and authentication.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Examples: Session management, security tokens, load balancing
                    </p>
                    <p className="mt-2">
                      <strong>Duration:</strong> Session or up to 1 year
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">2.2 Performance Cookies</h3>
                    <p className="mb-2">
                      These cookies collect information about how visitors use our platform, such as which pages are visited most often and if error messages are received.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Examples: Google Analytics, page load times, error tracking
                    </p>
                    <p className="mt-2">
                      <strong>Duration:</strong> Up to 2 years
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">2.3 Functionality Cookies</h3>
                    <p className="mb-2">
                      These cookies allow the platform to remember choices you make (such as language or region) and provide enhanced, personalized features.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Examples: Language preferences, display settings, remembering login
                    </p>
                    <p className="mt-2">
                      <strong>Duration:</strong> Up to 1 year
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3">2.4 Targeting/Advertising Cookies</h3>
                    <p className="mb-2">
                      These cookies are used to deliver content more relevant to you and your interests. They may be used to deliver targeted advertising or limit the number of times you see an advertisement.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Examples: Facebook Pixel, Google Ads, retargeting cookies
                    </p>
                    <p className="mt-2">
                      <strong>Duration:</strong> Up to 2 years
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>3. Third-Party Cookies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We work with third-party service providers who may set cookies on your device when you visit HarvestDirect. These include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Google Analytics:</strong> Web analytics to understand user behavior</li>
                    <li><strong>Payment Processors:</strong> To facilitate secure payment transactions</li>
                    <li><strong>Social Media Platforms:</strong> To enable social sharing features</li>
                    <li><strong>Customer Support Tools:</strong> To provide live chat and support services</li>
                  </ul>
                  <p>
                    These third parties have their own privacy policies. We encourage you to review them to understand how they use cookies.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>4. How We Use Cookies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We use cookies for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Authentication:</strong> To keep you logged in as you navigate the platform</li>
                    <li><strong>Security:</strong> To detect and prevent fraudulent activity</li>
                    <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                    <li><strong>Analytics:</strong> To understand how users interact with our platform</li>
                    <li><strong>Performance:</strong> To improve page load times and overall performance</li>
                    <li><strong>Marketing:</strong> To deliver relevant content and advertisements</li>
                    <li><strong>Feature Development:</strong> To test new features and improvements</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>5. Managing Your Cookie Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    You have the right to decide whether to accept or reject cookies. You can manage your cookie preferences in several ways:
                  </p>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Cookie Settings on HarvestDirect</h3>
                    <p className="mb-4">
                      You can manage your cookie preferences through our cookie consent banner when you first visit the site or through your account settings.
                    </p>
                    <Button>Manage Cookie Preferences</Button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Browser Settings</h3>
                    <p>
                      Most web browsers allow you to control cookies through their settings. You can set your browser to block or alert you about cookies. However, blocking all cookies may prevent you from using certain features of the platform.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                      <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                      <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                      <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                      <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Opt-Out Tools</h3>
                    <p>
                      You can opt out of targeted advertising cookies through industry opt-out tools:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Network Advertising Initiative (NAI): <a href="http://www.networkadvertising.org/choices/" className="text-primary hover:underline">optout.networkadvertising.org</a></li>
                      <li>Digital Advertising Alliance (DAA): <a href="http://www.aboutads.info/choices/" className="text-primary hover:underline">optout.aboutads.info</a></li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>6. Impact of Disabling Cookies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    If you disable or refuse cookies, some features of HarvestDirect may not function properly. This may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Difficulty staying logged in</li>
                    <li>Loss of saved preferences and settings</li>
                    <li>Reduced functionality of certain features</li>
                    <li>Less personalized experience</li>
                  </ul>
                  <p>
                    Essential cookies cannot be disabled as they are necessary for the platform to function.
                  </p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>7. Other Tracking Technologies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    In addition to cookies, we may use other tracking technologies including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Web Beacons:</strong> Small graphics embedded in emails and web pages to track user behavior</li>
                    <li><strong>Local Storage:</strong> Browser storage that allows us to store data locally on your device</li>
                    <li><strong>Session Storage:</strong> Temporary storage that is cleared when you close your browser</li>
                    <li><strong>SDKs:</strong> Software development kits in our mobile applications that collect usage data</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>8. Updates to This Cookie Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. We will post any changes on this page and update the "Last Updated" date.
                  </p>
                  <p>
                    We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    If you have questions about our use of cookies or this Cookie Policy, please contact us:
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

export default CookiePolicy;
