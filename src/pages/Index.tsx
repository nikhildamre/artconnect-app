import { useState, useEffect } from "react";
import { Search, Bell, ShoppingBag, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-art.jpg";
import workshopsImage from "@/assets/Services/Art Workshops.png";
import customArtImage from "@/assets/Services/Custom Art.png";
import studioRentalsImage from "@/assets/Services/Studio Rentals.png";
import logo from "@/assets/logo.png";
import { categories, artists } from "@/data/mockData";
import { useProducts, Product } from "@/hooks/useProducts";
import ArtistCard from "@/components/ArtistCard";
import CategoryPill from "@/components/CategoryPill";
import BottomNav from "@/components/BottomNav";

const heroSlides = [
  {
    id: "main",
    title: "Discover India's",
    subtitle: "Finest Artistry",
    description: "Authentic art from verified artists across India. Curated collections that tell stories.",
    image: heroImage,
    cta1: "Explore Collection",
    cta2: "Our Services",
    route1: "/browse",
    route2: "/services"
  },
  {
    id: "workshops",
    title: "Learn Traditional",
    subtitle: "Art Forms",
    description: "Join live workshops with master artists. Learn Madhubani, Warli, Tanjore painting and more.",
    image: workshopsImage,
    cta1: "Join Workshops",
    cta2: "View All",
    route1: "/workshops",
    route2: "/services"
  },
  {
    id: "commissions",
    title: "Commission Your",
    subtitle: "Dream Artwork",
    description: "Work directly with talented artists to create personalized pieces that tell your story.",
    image: customArtImage,
    cta1: "Start Commission",
    cta2: "Learn More",
    route1: "/commissions",
    route2: "/services"
  },
  {
    id: "studios",
    title: "Professional",
    subtitle: "Photo Studios",
    description: "Rent equipped studios with lighting, backdrops, and props for your art documentation.",
    image: studioRentalsImage,
    cta1: "Book Studio",
    cta2: "View Locations",
    route1: "/studio-rentals",
    route2: "/services"
  }
];

const ProductCard = ({ product, onClick, index }: { product: Product; onClick: () => void; index: number }) => {
  // Use the actual uploaded image URL from the database
  const imageSrc = product.image_url || product.images?.[0] || "/assets/art-painting-1-J34nQLiB.jpg";
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileTap={{ scale: 0.97 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-3xl shadow-art bg-card border border-border/50 hover:border-secondary/50 transition-all duration-300">
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={imageSrc} 
            alt={product.title} 
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" 
            loading="lazy"
            onError={(e) => {
              // Fallback to default image if uploaded image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "/assets/art-painting-1-J34nQLiB.jpg";
            }}
          />
        </div>
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating Action Button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg">
            <ChevronRight className="h-4 w-4 text-gray-800" />
          </div>
        </div>
        
        {/* Discount Badge */}
        {product.discounted_price && product.discounted_price > product.price && (
          <div className="absolute left-3 top-3">
            <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1.5 shadow-lg">
              <span className="text-xs font-bold text-white">
                {Math.round(((product.discounted_price - product.price) / product.discounted_price) * 100)}% OFF
              </span>
            </div>
          </div>
        )}
        
        {/* New Badge */}
        {index < 2 && (
          <div className="absolute right-3 top-3">
            <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 shadow-lg">
              <span className="text-xs font-bold text-white">NEW</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2 px-1">
        <h3 className="font-display text-base font-bold leading-tight text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-muted-foreground font-medium">{product.vendor_name || "Artist"}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.discounted_price && product.discounted_price > product.price && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.discounted_price)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-secondary/10 rounded-full px-2 py-1">
            <span className="text-xs font-semibold text-secondary">4.8</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-2.5 w-2.5 rounded-full bg-secondary mr-0.5" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-elevated bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 h-72">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        >
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <img 
              src={currentHero.image} 
              alt={currentHero.title} 
              className="h-72 w-full object-cover opacity-40" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-purple-900/40 to-transparent" />
          </motion.div>
          
          {/* Floating Art Pieces Animation */}
          <div className="absolute top-6 right-6 space-y-2">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
                x: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-3xl opacity-30"
            >
              🎨
            </motion.div>
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1],
                x: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="text-2xl opacity-20"
            >
              🖼️
            </motion.div>
          </div>
          
          <div className="relative z-10 p-6 h-72 flex flex-col justify-between">
            {/* Top Section - Minimal Stats */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span className="text-sm font-medium">Curated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <span className="text-sm font-medium">Authentic</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                  <span className="text-sm font-medium">Loved</span>
                </div>
              </div>
              
              <div className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 p-2">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            
            {/* Middle Section - Title */}
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Featured Collection</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-white leading-tight">
                {currentHero.title}<br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  {currentHero.subtitle}
                </span>
              </h2>
            </div>
            
            {/* Bottom Section - CTA Buttons with more space */}
            <div className="flex gap-3 pt-4 pb-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(currentHero.route1)} 
                className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-bold text-black shadow-lg transition-all hover:shadow-xl"
              >
                {currentHero.cta1}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(currentHero.route2)} 
                className="rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-5 py-3 text-sm font-medium text-white transition-all hover:bg-white/20"
              >
                {currentHero.cta2}
              </motion.button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <img src={logo} alt="Kalavapp" className="h-12 w-auto" />
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/notifications")} className="relative rounded-full bg-card p-2.5 text-muted-foreground transition-colors hover:text-foreground shadow-art">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
            </button>
            <button onClick={() => navigate("/cart")} className="rounded-full bg-card p-2.5 text-muted-foreground transition-colors hover:text-foreground shadow-art">
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Search Bar */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 transition-all focus-within:shadow-gold focus-within:border-secondary shadow-art">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search artworks, artists, styles..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
        </div>

        {/* Hero Banner - Dynamic Carousel */}
        <section className="px-4 pt-5">
          <HeroCarousel />
        </section>

        {/* Categories - Simple Horizontal */}
        <section className="pt-6">
          <div className="flex items-center justify-between px-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Explore Categories</h2>
              <p className="text-sm text-muted-foreground mt-1">Discover art by style and medium</p>
            </div>
            <button onClick={() => navigate("/browse")} className="flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto px-4 pb-4 scrollbar-hide">
            <div className="flex gap-4 animate-scroll snap-x snap-mandatory">
              {[...categories, ...categories].map((cat, index) => (
                <motion.button
                  key={`${cat.id}-${index}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveCategory(activeCategory === cat.id ? null : cat.id);
                    navigate("/browse");
                  }}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl px-5 py-4 text-sm transition-all duration-300 min-w-fit snap-start ${
                    activeCategory === cat.id
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-card text-foreground border border-border hover:border-secondary/50 hover:shadow-sm"
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{cat.name}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Artworks - Enhanced */}
        <section className="pt-8">
          <div className="flex items-center justify-between px-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Trending Now</h2>
                <p className="text-sm text-muted-foreground">Most popular artworks this week</p>
              </div>
            </div>
            <button onClick={() => navigate("/browse")} className="flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 px-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] rounded-3xl bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              products?.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} onClick={() => navigate(`/artwork/${product.id}`)} />
              ))
            )}
          </div>
        </section>

        {/* Top Artists - Enhanced */}
        <section className="pt-8 pb-6">
          <div className="flex items-center justify-between px-4 mb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Featured Artists</h2>
              <p className="text-sm text-muted-foreground mt-1">Meet our talented creators</p>
            </div>
            <button className="flex items-center gap-1 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 pb-3 scrollbar-hide">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-4 pb-6">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-foreground text-center mb-2">What Our Customers Say</h2>
            <p className="text-sm text-muted-foreground text-center">Join thousands of happy art collectors</p>
          </div>
          <div className="grid gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-5 border border-blue-200/50 dark:border-blue-800/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  P
                </div>
                <div>
                  <div className="font-semibold text-foreground">Priya Sharma</div>
                  <div className="text-xs text-muted-foreground">Art Collector, Mumbai</div>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-3 w-3 rounded-full bg-amber-400 mr-0.5" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                "Amazing collection of authentic Indian art. The quality exceeded my expectations and the artist was so talented!"
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-5 border border-green-200/50 dark:border-green-800/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <div>
                  <div className="font-semibold text-foreground">Rajesh Kumar</div>
                  <div className="text-xs text-muted-foreground">Interior Designer, Delhi</div>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-3 w-3 rounded-full bg-amber-400 mr-0.5" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                "Perfect for my client projects. The variety and authenticity of traditional art pieces is unmatched."
              </p>
            </motion.div>
          </div>
        </section>

        {/* Payment Demo Section */}
        <section className="px-4 pb-6">
          <motion.div 
            whileTap={{ scale: 0.98 }} 
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 p-6 shadow-xl cursor-pointer group border border-gray-700" 
            onClick={() => navigate("/razorpay-demo")}
          >
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl"
              >
                💳
              </motion.div>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Payment Demo</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Secure Payment Experience
                </span>
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-4 max-w-xs">
                Experience our seamless Razorpay integration with UPI, cards, and net banking in test mode.
              </p>
              <div className="flex items-center gap-3">
                <button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2.5 text-sm font-bold text-white hover:shadow-lg transition-all">
                  Try Demo Payment
                </button>
                <div className="text-gray-400 text-xs">
                  <div className="font-semibold">100% Secure</div>
                  <div>Test Mode</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;