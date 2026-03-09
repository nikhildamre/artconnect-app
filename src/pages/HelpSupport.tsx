import { HelpCircle, ChevronDown, MessageCircle, Phone, Mail, ArrowLeft, Clock, CheckCircle, AlertCircle, Search, Book, FileText, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const faqs = [
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "How do I track my order?",
        a: "Go to Profile → My Orders to see all your orders with real-time tracking. You'll also receive SMS and email updates as your order progresses through packaging, shipping, and delivery stages.",
      },
      {
        q: "What are the delivery charges?",
        a: "Free delivery on orders above ₹999. For orders below ₹999, delivery charges are ₹99 within city and ₹149 for other locations. Express delivery (24-48 hours) available for ₹199 extra.",
      },
      {
        q: "Can I change my delivery address?",
        a: "Yes, you can change the delivery address before the order is shipped. Go to My Orders, select the order, and click 'Change Address'. Once shipped, address cannot be modified.",
      },
    ]
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is the return policy?",
        a: "We offer a 7-day return policy for all artworks. If you're not satisfied, contact us within 7 days of delivery for a full refund or exchange. Items must be in original condition with packaging.",
      },
      {
        q: "How long does refund take?",
        a: "Refunds are processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method or ArtVpp wallet as per your preference.",
      },
      {
        q: "Can I return custom artworks?",
        a: "Custom artworks and commissions can only be returned if there's a quality issue or damage during shipping. Since they're made specifically for you, we don't accept returns for change of mind.",
      },
    ]
  },
  {
    category: "Account & Payments",
    items: [
      {
        q: "How do I become a vendor?",
        a: "Go to Profile → Become a Vendor and fill out the application form with your portfolio. Our team reviews applications within 48 hours. You'll need valid ID, bank details, and at least 5 artwork samples.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking from all major banks, and Cash on Delivery for eligible orders under ₹5,000.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, all payments are processed through secure, PCI-compliant gateways. We use 256-bit SSL encryption and don't store your card details on our servers. Your financial information is completely safe.",
      },
    ]
  },
  {
    category: "Artworks & Services",
    items: [
      {
        q: "Are the artworks authentic?",
        a: "Yes! All artworks come with an authenticity certificate. Our verified artists are vetted through a rigorous process. Each piece includes artist signature, creation date, and authenticity guarantee.",
      },
      {
        q: "How do commissions work?",
        a: "Submit a commission request with your vision, budget, and timeline. Artists respond within 24 hours with proposals. Payment is milestone-based: 30% advance, 40% on approval, 30% on delivery for your security.",
      },
      {
        q: "Can I request modifications to artworks?",
        a: "For custom commissions, you get 2 free revisions during the creation process. For existing artworks, modifications aren't possible, but we can connect you with the artist for a custom version.",
      },
    ]
  }
];

const contactOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    subtitle: "Available 9 AM - 9 PM",
    status: "online",
    action: () => alert("Live chat will open soon!")
  },
  {
    icon: Phone,
    title: "Call Us",
    subtitle: "+91 98765 43210",
    status: "available",
    action: () => window.open("tel:+919876543210")
  },
  {
    icon: Mail,
    title: "Email Support",
    subtitle: "help@artvpp.com",
    status: "24/7",
    action: () => window.open("mailto:help@artvpp.com")
  }
];

const quickLinks = [
  {
    icon: Book,
    title: "User Guide",
    description: "Complete guide to using ArtVpp",
    action: () => alert("User guide coming soon!")
  },
  {
    icon: FileText,
    title: "Policies",
    description: "Terms, privacy, and return policies",
    action: () => alert("Policies page coming soon!")
  },
  {
    icon: Users,
    title: "Community",
    description: "Join our artist community forum",
    action: () => alert("Community forum coming soon!")
  }
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = faqs.map(category => ({
    ...category,
    items: category.items.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const toggleFaq = (categoryIndex: number, itemIndex: number) => {
    const faqId = `${categoryIndex}-${itemIndex}`;
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="rounded-full bg-secondary/50 p-2 hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Help & Support</h1>
            <p className="text-sm text-muted-foreground">We're here to help you</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-6 space-y-8">
        {/* Contact Options */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">Get in Touch</h3>
          <div className="grid grid-cols-1 gap-3">
            {contactOptions.map((option, index) => (
              <button 
                key={index}
                onClick={option.action}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <option.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-semibold text-foreground">{option.title}</h4>
                  <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    option.status === 'online' ? 'bg-green-500' :
                    option.status === 'available' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-xs text-muted-foreground">{option.status}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 gap-3">
            {quickLinks.map((link, index) => (
              <button 
                key={index}
                onClick={link.action}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <link.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-semibold text-foreground">{link.title}</h4>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Search */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">Search FAQs</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="text-sm font-medium text-primary mb-3">{category.category}</h4>
                <div className="space-y-2">
                  {category.items.map((faq, itemIndex) => {
                    const faqId = `${categoryIndex}-${itemIndex}`;
                    const isOpen = openFaq === faqId;
                    
                    return (
                      <div key={itemIndex} className="rounded-2xl border border-border bg-card overflow-hidden">
                        <button
                          onClick={() => toggleFaq(categoryIndex, itemIndex)}
                          className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-border">
                                <p className="text-sm text-muted-foreground leading-relaxed pt-3">{faq.a}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {searchQuery && filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="text-sm font-medium text-foreground mb-2">No results found</h4>
              <p className="text-sm text-muted-foreground">Try different keywords or contact our support team</p>
            </div>
          )}
        </section>

        {/* Status */}
        <section className="pb-8">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className="text-sm font-semibold text-foreground">System Status</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">App Services</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Gateway</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Partners</span>
                <span className="text-green-600 font-medium">Operational</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Last updated: 2 minutes ago</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default HelpSupport;
