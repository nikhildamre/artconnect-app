import { useState } from "react";
import { ArrowLeft, Upload, Camera, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const Commissions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    timeline: "2-4 weeks",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit a commission request");
      navigate("/auth");
      return;
    }
    toast.success("Commission request submitted!", {
      description: "An artist will respond within 24 hours.",
    });
    setForm({ title: "", description: "", budget: "", timeline: "2-4 weeks" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">Commission an Artist</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Info Banner */}
          <div className="rounded-xl bg-gradient-burgundy p-4 mb-6">
            <h2 className="font-display text-base font-bold text-primary-foreground">
              Get Custom Artwork
            </h2>
            <p className="text-xs text-primary-foreground/80 mt-1">
              Describe your vision and our verified artists will bring it to life. Milestone-based payments ensure satisfaction.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Project Title</label>
              <input
                type="text"
                placeholder="e.g., Family Portrait in Madhubani Style"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border border-border bg-card py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Description</label>
              <textarea
                placeholder="Describe your vision in detail..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-border bg-card py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Reference Images</label>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card py-8 text-sm text-muted-foreground hover:border-secondary hover:text-foreground transition-all"
              >
                <Camera className="h-5 w-5" />
                Upload Reference Images
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Budget (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    placeholder="10000"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full rounded-xl border border-border bg-card py-3 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Timeline</label>
                <select
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  className="w-full rounded-xl border border-border bg-card py-3 px-4 text-sm text-foreground outline-none focus:border-secondary transition-all"
                >
                  <option>1-2 weeks</option>
                  <option>2-4 weeks</option>
                  <option>1-2 months</option>
                  <option>3+ months</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-burgundy py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.01] mt-2"
            >
              Submit Commission Request
            </button>
          </form>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Commissions;
