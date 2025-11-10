import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLinkClick = () => {
    // Scroll to top when clicking any footer link
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "For Farmers", href: "#farmers" },
        { label: "For Buyers", href: "#buyers" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "/pricing" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Safety Guidelines", href: "/safety" },
        { label: "Quality Standards", href: "/quality" },
        { label: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Blog", href: "/blog" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Data Protection", href: "/data-protection" }
      ]
    }
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">HarvestDirect</span>
            </div>
            
            <p className="text-background/80 mb-6 leading-relaxed">
              Connecting farmers directly with buyers to create a transparent, 
              efficient, and equitable agricultural marketplace for everyone.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-background/80">stephenmuhindi903@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-background/80">+254 111 460 424</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-background/80">Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-background mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.href.startsWith('#') ? (
                      <a 
                        href={link.href} 
                        onClick={(e) => handleHashLinkClick(e, link.href)}
                        className="text-background/70 hover:text-primary transition-colors cursor-pointer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        to={link.href}
                        onClick={handleLinkClick}
                        className="text-background/70 hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/60 text-sm">
              © 2025 HarvestDirect. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <span className="text-background/60 text-sm">Follow us:</span>
              <div className="flex space-x-4">
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-background/70 hover:text-primary transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;