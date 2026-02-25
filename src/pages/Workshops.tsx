import { useState } from "react";
import { Calendar, Clock, Users, MapPin, Video, ArrowLeft, Star, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

// Import workshop image
import workshopsImage from "@/assets/Services/Art Workshops.png";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

// Static workshop data (no database dependency)
const workshopsData = [
  {
    id: "1",
    title: "Introduction to Madhubani Painting",
    description: "Learn the traditional folk art of Bihar with authentic techniques and natural colors.",
    price: 1999,
    duration: 180,
    enrolled: 24,
    capacity: 30,
    type: "offline",
    skill_level: "beginner",
    location: "ArtVpp Studio",
    instructor: "Master Sunita Devi",
    rating: 4.9,
    reviews: 45,
    schedule: {
      date: "Every Saturday",
      time: "10:00 AM - 1:00 PM"
    },
    features: ["Materials Included", "Certificate", "Traditional Techniques", "Small Batch"]
  },
  {
    id: "2", 
    title: "Warli Art: From Tradition to Modern",
    description: "Explore the ancient tribal art form and learn to create contemporary Warli designs.",
    price: 1599,
    duration: 150,
    enrolled: 18,
    capacity: 25,
    type: "online",
    skill_level: "beginner",
    location: "Online",
    instructor: "Artist Ramesh Patil",
    rating: 4.8,
    reviews: 32,
    schedule: {
      date: "Every Sunday",
      time: "3:00 PM - 5:30 PM"
    },
    features: ["Live Online", "Recording Access", "Digital Materials", "Q&A Session"]
  },
  {
    id: "3",
    title: "Advanced Miniature Painting Techniques", 
    description: "Master the intricate art of miniature painting with gold leaf and fine brushwork.",
    price: 2999,
    duration: 240,
    enrolled: 12,
    capacity: 15,
    type: "offline",
    skill_level: "advanced",
    location: "ArtVpp Studio",
    instructor: "Ustad Ahmed Khan",
    rating: 4.9,
    reviews: 28,
    schedule: {
      date: "Weekends",
      time: "9:00 AM - 1:00 PM"
    },
    features: ["Gold Leaf Work", "Premium Materials", "Master Class", "Portfolio Review"]
  },
  {
    id: "4",
    title: "Tanjore Painting Workshop",
    description: "Create stunning Tanjore paintings with traditional gold foil and gem work.",
    price: 2499,
    duration: 200,
    enrolled: 20,
    capacity: 25,
    type: "offline", 
    skill_level: "intermediate",
    location: "ArtVpp Studio",
    instructor: "Artist Lakshmi Narayanan",
    rating: 4.7,
    reviews: 38,
    schedule: {
      date: "Bi-weekly",
      time: "2:00 PM - 6:00 PM"
    },
    features: ["Gold Foil Work", "Gem Setting", "Traditional Canvas", "Take Home Artwork"]
  }
];

const workshopEmojis: Record<string, string> = {
  "Introduction to Madhubani Painting": "🎨",
  "Warli Art: From Tradition to Modern": "🪷", 
  "Advanced Miniature Painting Techniques": "✨",
  "Tanjore Painting Workshop": "🏛️",
};

const Workshops = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const filtered = workshopsData.filter((w) => {
    if (!filter) return true;
    return w.type === filter || w.skill_level === filter;
  });

  const handleBook = (workshopId: string, workshopTitle: string) => {
    if (!user) {
      toast.error("Please sign in to book a workshop");
      navigate("/auth");
      return;
    }
    
    setBookingId(workshopId);
    
    // Simulate booking process
    setTimeout(() => {
      setBookingId(null);
      toast.success(`Workshop "${workshopTitle}" booked successfully! 🎉`, {
        description: "You will receive confirmation details via email."
      });
    }, 1500);
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="rounded-full bg-card p-2 text-muted-foreground hover:text-foreground transition-colors shadow-art"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Art Workshops</h1>
            <p className="text-sm text-muted-foreground">Learn from master artists</p>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="px-4 pt-6 pb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 shadow-xl"
          >
            <div className="absolute inset-0 opacity-20">
              <img 
                src={workshopsImage} 
                alt="Art Workshops"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Master Traditional Arts
              </h2>
              <p className="text-sm text-white/90 leading-relaxed mb-4 max-w-xs">
                Learn authentic Indian art forms from certified master artists in small, focused batches.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="rounded-full bg-white/20 p-3 mb-2 mx-auto w-fit">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs text-white/80">Certified</div>
                </div>
                <div className="text-center">
                  <div className="rounded-full bg-white/20 p-3 mb-2 mx-auto w-fit">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs text-white/80">Small Batches</div>
                </div>
                <div className="text-center">
                  <div className="rounded-full bg-white/20 p-3 mb-2 mx-auto w-fit">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs text-white/80">Expert Artists</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Filters */}
        <section className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[null, "online", "offline", "beginner", "intermediate", "advanced"].map((f) => (
              <button 
                key={f || "all"} 
                onClick={() => setFilter(f)} 
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium border transition-all ${
                  filter === f 
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500" 
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-secondary"
                }`}
              >
                {f ? f.charAt(0).toUpperCase() + f.slice(1) : "All Workshops"}
              </button>
            ))}
          </div>
        </section>

        {/* Workshops List */}
        <section className="px-4 space-y-4 pb-6">
          {filtered.map((workshop, i) => (
            <motion.div 
              key={workshop.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }} 
              className="rounded-3xl border border-border bg-card p-6 shadow-art hover:border-secondary/50 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 text-3xl">
                  {workshopEmojis[workshop.title] || "🎨"}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-foreground leading-tight mb-1">
                    {workshop.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{workshop.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-foreground">{workshop.rating}</span>
                      <span className="text-xs text-muted-foreground">({workshop.reviews})</span>
                    </div>
                    <span className="text-xs text-muted-foreground">• by {workshop.instructor}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-display text-xl font-bold text-foreground">{formatPrice(workshop.price)}</span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{workshop.schedule.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{workshop.duration} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{workshop.enrolled}/{workshop.capacity} enrolled</span>
                </div>
                {workshop.type === "online" ? (
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Video className="h-4 w-4" />
                    <span>Online Class</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{workshop.location}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {workshop.features.map((feature, idx) => (
                  <span key={idx} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  workshop.skill_level === "beginner" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                    : workshop.skill_level === "intermediate" 
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}>
                  {workshop.skill_level.charAt(0).toUpperCase() + workshop.skill_level.slice(1)}
                </span>
                
                <button 
                  onClick={() => handleBook(workshop.id, workshop.title)} 
                  disabled={bookingId === workshop.id}
                  className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100 shadow-lg"
                >
                  {bookingId === workshop.id ? "Booking..." : "Book Workshop"}
                </button>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Why Choose Our Workshops */}
        <section className="px-4 pb-6">
          <div className="rounded-3xl bg-card border border-border/50 p-6">
            <h3 className="font-display text-xl font-bold text-foreground mb-4 text-center">Why Choose Our Workshops?</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-3 mb-2 mx-auto w-fit">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Master Artists</h4>
                <p className="text-xs text-muted-foreground">Learn from certified traditional art masters</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-2 mx-auto w-fit">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Small Batches</h4>
                <p className="text-xs text-muted-foreground">Personal attention in intimate class sizes</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-2 mx-auto w-fit">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Authentic Techniques</h4>
                <p className="text-xs text-muted-foreground">Traditional methods passed down generations</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 mb-2 mx-auto w-fit">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Flexible Schedule</h4>
                <p className="text-xs text-muted-foreground">Weekend and evening classes available</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Workshops;
