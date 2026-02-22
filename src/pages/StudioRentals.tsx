import { useState } from "react";
import { ArrowLeft, MapPin, Clock, Camera, Lightbulb, Users, Star, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const studios = [
  {
    id: 1,
    name: "Creative Hub Studio",
    location: "Bandra, Mumbai",
    price: 500,
    rating: 4.8,
    reviews: 124,
    image: "/api/placeholder/400/300",
    features: ["Professional Lighting", "Multiple Backdrops", "Props Available", "Editing Station"],
    size: "1200 sq ft",
    capacity: "Up to 8 people"
  },
  {
    id: 2,
    name: "Artisan's Light Studio",
    location: "Connaught Place, Delhi",
    price: 650,
    rating: 4.9,
    reviews: 89,
    image: "/api/placeholder/400/300",
    features: ["Natural Light", "Cyclorama Wall", "High-end Equipment", "Makeup Room"],
    size: "800 sq ft",
    capacity: "Up to 6 people"
  },
  {
    id: 3,
    name: "Modern Frame Studio",
    location: "Koramangala, Bangalore",
    price: 450,
    rating: 4.7,
    reviews: 156,
    image: "/api/placeholder/400/300",
    features: ["LED Panels", "Color Backdrops", "Tripods & Stands", "Wi-Fi"],
    size: "1000 sq ft",
    capacity: "Up to 10 people"
  }
];

const StudioCard = ({ studio, onClick }: { studio: any; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileTap={{ scale: 0.98 }}
    className="group cursor-pointer"
    onClick={onClick}
  >
    <div className="relative overflow-hidden rounded-3xl shadow-art bg-card border border-border/50 hover:border-secondary/50 transition-all duration-300">
      <div className="aspect-[4/3] overflow-hidden">
        <div className="h-full w-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
          <Camera className="h-16 w-16 text-emerald-500" />
        </div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Quick Actions */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg">
          <ChevronRight className="h-4 w-4 text-gray-800" />
        </div>
      </div>
    </div>
    
    <div className="mt-4 space-y-2 px-1">
      <h3 className="font-display text-base font-bold leading-tight text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
        {studio.name}
      </h3>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>{studio.location}</span>
      </div>
      
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold text-foreground">₹{studio.price}</span>
          <span className="text-sm text-muted-foreground">/hour</span>
        </div>
        
        <div className="flex items-center gap-1 bg-secondary/10 rounded-full px-2 py-1">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          <span className="text-xs font-semibold text-secondary">{studio.rating}</span>
          <span className="text-xs text-muted-foreground">({studio.reviews})</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 pt-2">
        {studio.features.slice(0, 2).map((feature: string, index: number) => (
          <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
            {feature}
          </span>
        ))}
        {studio.features.length > 2 && (
          <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
            +{studio.features.length - 2} more
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const StudioRentals = () => {
  const navigate = useNavigate();
  const [selectedStudio, setSelectedStudio] = useState<any>(null);

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-4">
          <button 
            onClick={() => navigate("/")} 
            className="rounded-full bg-card p-2 text-muted-foreground hover:text-foreground transition-colors shadow-art"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Photography Studios</h1>
            <p className="text-sm text-muted-foreground">Professional spaces for your art</p>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="px-4 pt-6 pb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-6 shadow-xl"
          >
            <div className="absolute top-4 right-4 opacity-20">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-4xl"
              >
                📸
              </motion.div>
            </div>
            
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Professional Photography Studios
              </h2>
              <p className="text-sm text-white/90 leading-relaxed mb-4 max-w-xs">
                Rent fully equipped studios with professional lighting, backdrops, and props for your artwork documentation.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="rounded-full bg-white/20 p-3 mb-2 mx-auto w-fit">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs text-white/80">Pro Lighting</div>
                </div>
                <div className="text-center">
                  <div className="rounded-full bg-white/20 p-3 mb-2 mx-auto w-fit">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs text-white/80">Equipment</div>
                </div>
                <div className="text-center">
                  <div className="rounded-full bg-white/20 p-3 mb-2 mx-auto w-fit">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs text-white/80">Group Space</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Studios Grid */}
        <section className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Available Studios</h2>
              <p className="text-sm text-muted-foreground">Choose from our premium locations</p>
            </div>
          </div>
          
          <div className="grid gap-6">
            {studios.map((studio) => (
              <StudioCard 
                key={studio.id} 
                studio={studio} 
                onClick={() => setSelectedStudio(studio)} 
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 pb-6">
          <div className="rounded-3xl bg-card border border-border/50 p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">What's Included</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/20 p-2">
                  <Lightbulb className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm text-foreground">Professional Lighting</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-foreground">Camera Equipment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm text-foreground">Group Bookings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm text-foreground">Flexible Hours</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 pb-6">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-center cursor-pointer"
            onClick={() => {
              // Handle booking logic here
              alert("Booking functionality coming soon!");
            }}
          >
            <Calendar className="h-8 w-8 text-white mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-white mb-2">Ready to Book?</h3>
            <p className="text-sm text-white/90 mb-4">Get started with your professional photography session</p>
            <button className="rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-600 hover:bg-white/90 transition-colors">
              Book Now
            </button>
          </motion.div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default StudioRentals;