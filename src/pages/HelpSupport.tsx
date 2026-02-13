import { HelpCircle, ChevronDown, MessageCircle, Phone, Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const faqs = [
  {
    q: "How do I track my order?",
    a: "Go to Profile → My Orders to see all your orders with real-time tracking. You'll also receive SMS and email updates as your order progresses.",
  },
  {
    q: "What is the return policy?",
    a: "We offer a 7-day return policy for all artworks. If you're not satisfied, contact us within 7 days of delivery for a full refund or exchange.",
  },
  {
    q: "How do I become a vendor?",
    a: "Go to Profile → Become a Vendor and fill out the application form. Our team will review your portfolio and get back within 48 hours.",
  },
  {
    q: "Are the artworks authentic?",
    a: "Yes! All artworks come with an authenticity certificate. Our verified artists are vetted through a rigorous process to ensure genuine, original pieces.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards (Visa, Mastercard, RuPay), net banking, and Cash on Delivery for eligible orders.",
  },
  {
    q: "How do commissions work?",
    a: "Submit a commission request with your vision, budget, and timeline. Artists will respond within 24 hours. Payment is milestone-based for your security.",
  },
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">Help & Support</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-6">
        {/* Contact Options */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: MessageCircle, label: "Live Chat", sub: "Online" },
            { icon: Phone, label: "Call Us", sub: "+91 98765 43210" },
            { icon: Mail, label: "Email", sub: "help@artvpp.com" },
          ].map(({ icon: Icon, label, sub }) => (
            <button key={label} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:border-secondary transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Icon className="h-4.5 w-4.5 text-secondary" />
              </div>
              <span className="text-xs font-medium text-foreground">{label}</span>
              <span className="text-[10px] text-muted-foreground">{sub}</span>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div>
          <h3 className="font-display text-sm font-bold text-foreground mb-3">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default HelpSupport;
