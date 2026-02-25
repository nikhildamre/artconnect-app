import { useState } from "react";
import { ArrowLeft, MapPin, Clock, Camera, Lightbulb, Users, Star, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

// Import actual studio images
import photographyStudioImage from "@/assets/Services/Photography Studio Artvpp.jpg";
import videoStudioImage from "@/assets/Services/Video Studio Artvpp.jpg";
import podcastStudioImage from "@/assets/Services/Podcast Studio Artvpp.png";

const studios = [
  {
    id: 1,
    name: "ArtVpp Photography Studio",
    location: "Professional Setup",
    price: 1000,
    rating: 4.9,
    reviews: 89,
    image: photographyStudioImage,
    features: ["Professional Lighting", "Sony Camera Equipment", "Multiple Backdrops", "Editing Station"],
    size: "Professional Grade",
    capacity: "Full Day Setup",
    type: "photo"
  },
  {
    id: 2,
    name: "ArtVpp Video Studio",
    location: "Chroma Green Screen Setup",
    price: 1000,
    rating: 4.8,
    reviews: 124,
    image: videoStudioImage,
    features: ["Chroma Green Screen", "Professional Tripod", "Continuous Lighting", "Background Replacement"],
    size: "Video Production",
    capacity: "Attended Setup",
    type: "video"
  },
  {
    id: 3,
    name: "ArtVpp Podcast Studio",
    location: "Audio Recording Setup",
    price: 2000,
    rating: 4.9,
    reviews: 67,
    image: podcastStudioImage,
    features: ["Professional Audio", "Soundproofing", "Multi-mic Setup", "Recording Equipment"],
    size: "Audio Production",
    capacity: "Professional Grade",
    type: "podcast"
  }
];

const equipmentList = [
  { name: "Light Stand 9ft (Small)", qty: 6 },
  { name: "Eimage LCS-03S 40\" C-Stand (Heavy Steel)", qty: 1 },
  { name: "Eimage LCS-02 30\" C-Stand (Heavy Steel)", qty: 1 },
  { name: "Eimage LCS-01 20\" C-Stand (Heavy Steel)", qty: 1 },
  { name: "Godox C-Stand 270 CS", qty: 1 },
  { name: "Manfrotto MK055XPRO3-BHQ2 Tripod with Ball Head", qty: 1 },
  { name: "Garware Butter Paper Roll 40 inch × 18 mtr", qty: 1 },
  { name: "Godox BDR-W55 Beauty Dish", qty: 1 },
  { name: "Godox Standard Reflector RFT4", qty: 1 },
  { name: "Godox SN01 Snoot with Honey Comb", qty: 2 },
  { name: "Godox P120H Soft Box Deep Octa", qty: 1 },
  { name: "Godox SFUV8080 Square Softbox for Bowens", qty: 2 },
  { name: "Godox RFT-06-110110 All In One Reflector", qty: 2 },
  { name: "Superior Backdrop Paper Roll 9ft × 36ft", qty: 3 },
  { name: "Harison Wall Bracket with Chain Pulley Mechanism", qty: 1 },
  { name: "Godox BDR-C550 Honey Comb Grid Set", qty: 1 },
  { name: "Electric Board Big", qty: 2 },
  { name: "Spikeguard", qty: 1 },
  { name: "UPS", qty: 1 },
  { name: "Apple Laptop MacBook Pro 16\"", qty: 1 },
  { name: "Sony 7M3 Body Mirrorless Full Frame Camera", qty: 1 },
  { name: "Sony SEL70200GM 70-200 F2.8 G-Master Lens", qty: 1 },
  { name: "Sony SEL24105G 24-105mm F4 Lens", qty: 1 },
  { name: "Sony SEL90M28G 90mm F2.0 Macro Lens", qty: 1 },
  { name: "Sony SEL1635GM 16-35mm F2.8 G-Master Lens", qty: 1 },
  { name: "Sony SEL50F18F 50mm F1.8 Lens", qty: 1 },
  { name: "Transcend 1TB Shock Proof Hard Disk", qty: 1 },
  { name: "Sony NP-FZ100 Battery for 7M3 Camera", qty: 2 },
  { name: "Sandisk 32GB SD Card Extreme Pro 170 Mbps", qty: 2 },
  { name: "Transcend All In One Card Reader TF-RDF8K2", qty: 1 },
  { name: "Godox V1 Flash for Sony", qty: 1 },
  { name: "Battery VB26 for Godox V1 Flash", qty: 1 },
  { name: "Nisi CPL Filter 77mm", qty: 1 },
  { name: "Godox X2 Trigger", qty: 1 },
  { name: "Sekonic L308X Light Meter", qty: 1 },
  { name: "Godox DP 600 III Kit", qty: 3 },
  { name: "Godox BD-04 Barndoor Set", qty: 1 },
  { name: "Godox Modeling Lamp ML-01", qty: 1 },
  { name: "Godox Umbrella 35", qty: 1 },
  { name: "Kamron Cleaning Kit / Photron Cleaning Kit", qty: 1 },
  { name: "Andbon Dehumidifier 80 Ltrs / Photron Dry Cabinet", qty: 1 },
  { name: "Vanguard Camera Bag", qty: 1 }
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
        <img 
          src={studio.image} 
          alt={studio.name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          loading="lazy"
        />
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
          <span className="text-sm text-muted-foreground">
            {studio.type === 'photo' ? '/hr' : studio.type === 'podcast' ? '/hr' : '/day'}
          </span>
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

        {/* Equipment List Section */}
        <section className="px-4 pb-6">
          <div className="rounded-3xl bg-card border border-border/50 p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Available Equipment</h3>
            <p className="text-sm text-muted-foreground mb-4">Professional photography equipment included with studio rental</p>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {equipmentList.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border/30 last:border-b-0">
                  <span className="text-sm text-foreground flex-1 pr-2">{item.name}</span>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-semibold">
                    Qty: {item.qty}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 text-sm mb-1">Video Setup Available</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                • Chroma Green Screen Setup (Background replacement & creative productions)<br/>
                • Professional Tripod for Stable Recording<br/>
                • Hiffen 250W Continuous Light for consistent illumination
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 pb-6">
          <div className="rounded-3xl bg-gradient-to-br from-secondary/10 to-primary/10 border border-border/50 p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Studio Pricing</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/30">
                <div>
                  <h4 className="font-semibold text-foreground">Photo Studio</h4>
                  <p className="text-xs text-muted-foreground">Professional photography setup</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-lg font-bold text-foreground">₹1,000</span>
                  <p className="text-xs text-muted-foreground">/hour</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/30">
                <div>
                  <h4 className="font-semibold text-foreground">Video Studio</h4>
                  <p className="text-xs text-muted-foreground">Attended setup with green screen</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-lg font-bold text-foreground">₹1,000</span>
                  <p className="text-xs text-muted-foreground">/day</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/30">
                <div>
                  <h4 className="font-semibold text-foreground">Podcast Studio</h4>
                  <p className="text-xs text-muted-foreground">Professional audio recording</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-lg font-bold text-foreground">₹2,000</span>
                  <p className="text-xs text-muted-foreground">/hour</p>
                </div>
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