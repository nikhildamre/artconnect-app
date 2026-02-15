import { useState } from "react";
import { Calendar, Clock, Users, MapPin, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkshops, useBookWorkshop } from "@/hooks/useWorkshops";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const workshopEmojis: Record<string, string> = {
  "Introduction to Madhubani Painting": "🎨",
  "Bronze Sculpture Basics": "🗿",
  "Warli Art: From Tradition to Modern": "🪷",
  "Advanced Miniature Painting Techniques": "✨",
};

const Workshops = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<string | null>(null);
  const { data: workshops, isLoading } = useWorkshops();
  const bookWorkshop = useBookWorkshop();

  const filtered = (workshops || []).filter((w) => {
    if (!filter) return true;
    return w.type === filter || w.skill_level === filter;
  });

  const handleBook = (workshopId: string) => {
    if (!user) {
      toast.error("Please sign in to book a workshop");
      navigate("/auth");
      return;
    }
    bookWorkshop.mutate(workshopId, {
      onSuccess: () => toast.success("Workshop booked! 🎉"),
      onError: () => toast.error("Failed to book workshop"),
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3">
          <h1 className="font-display text-lg font-bold text-foreground">Workshops & Classes</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {[null, "online", "offline", "beginner", "intermediate", "advanced"].map((f) => (
            <button key={f || "all"} onClick={() => setFilter(f)} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${filter === f ? "bg-gradient-burgundy text-primary-foreground border-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>
              {f ? f.charAt(0).toUpperCase() + f.slice(1) : "All"}
            </button>
          ))}
        </div>

        <div className="px-4 space-y-3 pb-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />)
          ) : (
            filtered.map((workshop, i) => {
              const schedule = workshop.schedule as Record<string, string> | null;
              return (
                <motion.div key={workshop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                      {workshopEmojis[workshop.title] || "🎨"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-sm font-bold text-foreground leading-tight">{workshop.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{workshop.description}</p>
                    </div>
                    <span className="font-display text-sm font-bold text-foreground">{formatPrice(workshop.price)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schedule?.date && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" /> {schedule.date}</span>}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {workshop.duration} min</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="h-3 w-3" /> {workshop.enrolled}/{workshop.capacity}</span>
                    {workshop.type === "online" ? (
                      <span className="flex items-center gap-1 text-xs text-secondary"><Video className="h-3 w-3" /> Online</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {workshop.location}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${workshop.skill_level === "beginner" ? "bg-green-100 text-green-700" : workshop.skill_level === "intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {(workshop.skill_level || "beginner").charAt(0).toUpperCase() + (workshop.skill_level || "beginner").slice(1)}
                    </span>
                    <button onClick={() => handleBook(workshop.id)} disabled={bookWorkshop.isPending} className="rounded-full bg-gradient-burgundy px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-60">
                      {bookWorkshop.isPending ? "Booking..." : "Book Now"}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Workshops;
