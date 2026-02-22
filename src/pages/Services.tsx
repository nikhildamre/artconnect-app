import { useState, useEffect } from "react";
import { ArrowRight, Clock, Users, Star, MapPin, Calendar, Award, Palette, Camera, Lightbulb, ChevronLeft, ChevronRight, CreditCard, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

// Import service images
import workshopsImage from "@/assets/Services/Art Workshops.png";
import customArtImage from "@/assets/Services/Custom Art.png";
import studioRentalsImage from "@/assets/Services/Studio Rentals.png";

const carouselServices = [
  {
    id: "workshops",
    title: "Art Workshops & Classes",
    subtitle: "Learn from Master Artists",
    description: "Join live workshops and learn traditional Indian art forms like Madhubani, Warli, Tanjore painting from certified masters.",
    image: workshopsImage,
    gradient: "from-amber-400 via-orange-500 to-red-500",
    price: "₹999",
    priceLabel: "onwards",
    route: "/workshops"
  },
  {
    id: "commissions",
    title: "Custom Art Commissions",
    subtitle: "Bring Your Vision to Life",
    description: "Work directly with talented artists to create personalized artwork that tells your unique story and captures your vision.",
    image: customArtImage,
    gradient: "from-purple-600 via-indigo-600 to-blue-600",
    price: "Free",
    priceLabel: "consultation",
    route: "/commissions"
  },
  {
    id: "studios",
    title: "Photography Studio Rentals",
    subtitle: "Professional Photography Spaces",
    description: "Rent fully equipped photography studios with professional lighting, backdrops, and props for your art documentation.",
    image: studioRentalsImage,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    price: "₹500",
    priceLabel: "per hour",
    route: "/studio-rentals"
  }
];

const services = [
  {
    id: "workshops",
    title: "Art Workshops & Classes",
    subtitle: "Learn from Master Artists",
    description: "Join live workshops and learn traditional Indian art forms like Madhubani, Warli, Tanjore painting, and more from certified master artists.",
    icon: "🎓",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    price: "₹999",
    priceLabel: "onwards",
    features: ["Live Sessions", "Certificate", "Materials Included", "Lifetime Access"],
    stats: { students: "Popular", rating: "4.9", courses: "Expert" },
    route: "/workshops"
  },
  {
    id: "commissions",
    title: "Custom Art Commissions",
    subtitle: "Bring Your Vision to Life",
    description: "Work directly with talented artists to create personalized artwork that tells your unique story. From portraits to abstract pieces.",
    icon: "✨",
    gradient: "from-purple-600 via-indigo-600 to-blue-600",
    price: "Free",
    priceLabel: "consultation",
    features: ["30+ Artists", "Custom Designs", "Multiple Revisions", "Quality Guarantee"],
    stats: { artists: "30+", projects: "500+", rating: "4.8" },
    route: "/commissions"
  },
  {
    id: "studios",
    title: "Photography Studio Rentals",
    subtitle: "Professional Photography Spaces",
    description: "Rent fully equipped photography studios with professional lighting, backdrops, and props for your art documentation needs.",
    icon: "📸",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    price: "₹500",
    priceLabel: "per hour",
    features: ["Pro Lighting", "Multiple Backdrops", "Equipment Included", "Flexible Hours"],
    stats: { locations: "5", bookings: "1K+", rating: "4.7" },
    route: "/studio-rentals"
  }
];

const ServiceCarousel = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselServices.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const currentService = carouselServices[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselServices.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselServices.length) % carouselServices.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 h-64 group">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${currentService.gradient} overflow-hidden cursor-pointer`}
          onClick={() => navigate(currentService.route)}
        >
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <img 
              src={currentService.image} 
              alt={currentService.title}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            {/* Top Section */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-8 bg-white/50 rounded-full"></div>
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                    Featured Service
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2 leading-tight">
                  {currentService.title}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed max-w-xs">
                  {currentService.description}
                </p>
              </div>
              
              <div className="text-right">
                <div className="font-display text-lg font-bold text-white">{currentService.price}</div>
                <div className="text-xs text-white/80">{currentService.priceLabel}</div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-white/20 backdrop-blur-sm px-5 py-2.5 text-sm font-bold text-white border border-white/30 hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <span>Explore Now</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              {/* Dots Indicator */}
              <div className="flex items-center gap-2">
                {carouselServices.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 text-white hover:bg-white/30 transition-all z-20 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 text-white hover:bg-white/30 transition-all z-20 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative overflow-hidden rounded-3xl shadow-xl bg-card border border-border/50 hover:border-secondary/50 transition-all duration-300 group"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-2xl bg-gradient-to-br ${service.gradient} p-3 shadow-lg`}>
              <span className="text-2xl">{service.icon}</span>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-xl font-bold text-foreground">{service.price}</div>
            <div className="text-xs text-muted-foreground">{service.priceLabel}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          {service.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          {Object.entries(service.stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="font-bold text-foreground text-sm">{String(value)}</div>
              <div className="text-xs text-muted-foreground capitalize">{key}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {service.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${service.gradient}`} />
              <span className="text-xs text-foreground/70">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(service.route)}
          className={`w-full rounded-2xl bg-gradient-to-r ${service.gradient} p-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
        >
          <span>Get Started</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 safe-area-top">
        <div className="px-4 py-4">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Our Services</h1>
            <p className="text-sm text-muted-foreground mt-1">Everything you need for your artistic journey</p>
          </div>
        </div>
      </header>

      <main>
        {/* Featured Services Carousel */}
        <section className="px-4 pt-6 pb-8">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground mb-1">Featured Services</h2>
            <p className="text-sm text-muted-foreground">Discover what we offer for your artistic journey</p>
          </div>
          
          <div className="group">
            <ServiceCarousel />
          </div>
        </section>

        {/* All Services - Detailed Cards */}
        <section className="px-4 pb-6">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-1">All Services</h2>
            <p className="text-sm text-muted-foreground">Detailed information about each service</p>
          </div>
          
          <div className="space-y-6">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="px-4 pb-6">
          <div className="rounded-3xl bg-card border border-border/50 p-6">
            <h3 className="font-display text-xl font-bold text-foreground mb-4 text-center">Why Choose ArtVpp?</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-2 mx-auto w-fit">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Certified Artists</h4>
                <p className="text-xs text-muted-foreground">Work with verified and experienced professionals</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-2 mx-auto w-fit">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Quality Assured</h4>
                <p className="text-xs text-muted-foreground">100% satisfaction guarantee on all services</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 mb-2 mx-auto w-fit">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Flexible Timing</h4>
                <p className="text-xs text-muted-foreground">Book sessions that fit your schedule</p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 mb-2 mx-auto w-fit">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Community</h4>
                <p className="text-xs text-muted-foreground">Join thousands of art enthusiasts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="px-4 pb-6">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center cursor-pointer"
            onClick={() => {
              // Handle contact logic here
              alert("Contact functionality coming soon!");
            }}
          >
            <h3 className="font-display text-lg font-bold text-white mb-2">Need Help Choosing?</h3>
            <p className="text-sm text-white/90 mb-4">Our experts are here to guide you to the perfect service</p>
            <button className="rounded-full bg-white px-6 py-3 text-sm font-bold text-indigo-600 hover:bg-white/90 transition-colors">
              Contact Us
            </button>
          </motion.div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Services;