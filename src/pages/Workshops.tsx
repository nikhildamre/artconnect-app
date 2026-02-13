import { useState } from "react";
import { Calendar, Clock, Users, MapPin, Video, Filter } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const mockWorkshops = [
  {
    id: "w1",
    title: "Introduction to Madhubani Painting",
    instructor: "Priya Sharma",
    type: "online",
    skillLevel: "beginner",
    duration: 120,
    price: 1500,
    capacity: 30,
    enrolled: 22,
    date: "2026-02-20",
    time: "10:00 AM",
    image: "🎨",
  },
  {
    id: "w2",
    title: "Bronze Sculpture Basics",
    instructor: "Rahul Mehta",
    type: "offline",
    skillLevel: "intermediate",
    duration: 180,
    price: 3500,
    capacity: 15,
    enrolled: 12,
    date: "2026-02-25",
    time: "2:00 PM",
    location: "Mumbai Studio",
    image: "🗿",
  },
  {
    id: "w3",
    title: "Warli Art: From Tradition to Modern",
    instructor: "Meera Patil",
    type: "online",
    skillLevel: "beginner",
    duration: 90,
    price: 999,
    capacity: 50,
    enrolled: 38,
    date: "2026-03-01",
    time: "11:00 AM",
    image: "🪷",
  },
  {
    id: "w4",
    title: "Advanced Miniature Painting Techniques",
    instructor: "Ananya Gupta",
    type: "online",
    skillLevel: "advanced",
    duration: 150,
    price: 4500,
    capacity: 20,
    enrolled: 18,
    date: "2026-03-05",
    time: "3:00 PM",
    image: "✨",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const Workshops = () => {
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? mockWorkshops.filter((w) => w.type === filter || w.skillLevel === filter)
    : mockWorkshops;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3">
          <h1 className="font-display text-lg font-bold text-foreground">Workshops & Classes</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {[null, "online", "offline", "beginner", "intermediate", "advanced"].map((f) => (
            <button
              key={f || "all"}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${
                filter === f
                  ? "bg-gradient-burgundy text-primary-foreground border-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f ? f.charAt(0).toUpperCase() + f.slice(1) : "All"}
            </button>
          ))}
        </div>

        {/* Workshop Cards */}
        <div className="px-4 space-y-3 pb-6">
          {filtered.map((workshop, i) => (
            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
                  {workshop.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold text-foreground leading-tight">
                    {workshop.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">by {workshop.instructor}</p>
                </div>
                <span className="font-display text-sm font-bold text-foreground">{formatPrice(workshop.price)}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {workshop.date}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {workshop.duration} min
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" /> {workshop.enrolled}/{workshop.capacity}
                </span>
                {workshop.type === "online" ? (
                  <span className="flex items-center gap-1 text-xs text-secondary">
                    <Video className="h-3 w-3" /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {workshop.location}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    workshop.skillLevel === "beginner"
                      ? "bg-green-100 text-green-700"
                      : workshop.skillLevel === "intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {workshop.skillLevel.charAt(0).toUpperCase() + workshop.skillLevel.slice(1)}
                </span>
                <button className="rounded-full bg-gradient-burgundy px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Workshops;
