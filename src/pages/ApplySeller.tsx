import { useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, XCircle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSellerApplication, useSubmitSellerApplication } from "@/hooks/useSellerApplication";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const ApplySeller = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: existingApplication, isLoading } = useSellerApplication();
  const submitApplication = useSubmitSellerApplication();
  const [form, setForm] = useState({
    full_name: "",
    email: user?.email || "",
    phone: "",
    artist_bio: "",
    art_category: "Paintings",
    portfolio_url: "",
    instagram: "",
    twitter: "",
    government_id_url: "",
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
            <h1 className="font-display text-lg font-bold text-foreground">Become a Seller</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <h2 className="font-display text-xl font-bold text-foreground">Sign in first</h2>
          <p className="text-sm text-muted-foreground mt-2">You need an account to apply as a seller</p>
          <button onClick={() => navigate("/auth")} className="mt-4 rounded-full bg-gradient-burgundy px-6 py-2.5 text-sm font-semibold text-primary-foreground">Sign In</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Show application status if already submitted
  if (existingApplication) {
    const statusConfig = {
      pending: { icon: Clock, color: "text-secondary", bg: "bg-secondary/10", label: "Under Review", desc: "Your application is being reviewed by our team. We'll notify you once a decision is made." },
      approved: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100", label: "Approved!", desc: "Congratulations! Your seller application has been approved. You can now access your vendor dashboard." },
      rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Not Approved", desc: existingApplication.rejection_reason || "Your application was not approved at this time." },
    };
    const config = statusConfig[existingApplication.status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
            <h1 className="font-display text-lg font-bold text-foreground">Application Status</h1>
          </div>
        </header>
        <main className="mx-auto max-w-lg px-4 pt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
            <div className={`rounded-full ${config.bg} p-4 mb-4`}>
              <Icon className={`h-10 w-10 ${config.color}`} />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">{config.label}</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">{config.desc}</p>
            {existingApplication.status === "approved" && (
              <button onClick={() => navigate("/vendor")} className="mt-6 rounded-full bg-gradient-burgundy px-6 py-2.5 text-sm font-semibold text-primary-foreground">
                Go to Vendor Dashboard
              </button>
            )}
          </motion.div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const socialLinks = [];
    if (form.instagram) socialLinks.push({ platform: "Instagram", url: form.instagram });
    if (form.twitter) socialLinks.push({ platform: "Twitter", url: form.twitter });

    try {
      await submitApplication.mutateAsync({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        artist_bio: form.artist_bio,
        art_category: form.art_category,
        portfolio_url: form.portfolio_url || undefined,
        social_media_links: socialLinks.length > 0 ? socialLinks : undefined,
        government_id_url: form.government_id_url || undefined,
      });
      toast.success("Application submitted! We'll review it shortly.");
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  const inputClass = "w-full rounded-xl border border-border bg-card py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary focus:shadow-gold transition-all";

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
          <h1 className="font-display text-lg font-bold text-foreground">Become a Seller</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        <div className="rounded-xl bg-gradient-gold p-4 mb-6">
          <h3 className="font-display text-sm font-bold text-foreground">Join Our Artist Community</h3>
          <p className="text-xs text-foreground/70 mt-1">Fill in your details and our team will review your application. Once approved, you can start selling your artwork!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
            <input type="text" placeholder="Your full legal name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email *</label>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number *</label>
            <input type="tel" placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Art Category *</label>
            <select value={form.art_category} onChange={(e) => setForm({ ...form, art_category: e.target.value })} className={inputClass}>
              <option>Paintings</option><option>Sculptures</option><option>Digital Art</option><option>Photography</option><option>Folk Art</option><option>Handicrafts</option><option>Mixed Media</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Artist Bio *</label>
            <textarea placeholder="Tell us about yourself, your art journey, and your specializations..." value={form.artist_bio} onChange={(e) => setForm({ ...form, artist_bio: e.target.value })} rows={4} className={`${inputClass} resize-none`} required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Portfolio / Website URL</label>
            <input type="url" placeholder="https://yourportfolio.com" value={form.portfolio_url} onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram Profile</label>
            <input type="url" placeholder="https://instagram.com/yourhandle" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Twitter / X Profile</label>
            <input type="url" placeholder="https://x.com/yourhandle" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Government ID (Upload link)</label>
            <input type="text" placeholder="Link to your ID proof document" value={form.government_id_url} onChange={(e) => setForm({ ...form, government_id_url: e.target.value })} className={inputClass} />
            <p className="text-[10px] text-muted-foreground mt-1">Aadhaar, PAN, or Passport for verification</p>
          </div>

          <button type="submit" disabled={submitApplication.isPending} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-burgundy py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.01] disabled:opacity-60">
            <Send className="h-4 w-4" />
            {submitApplication.isPending ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </main>
      <BottomNav />
    </div>
  );
};

export default ApplySeller;
