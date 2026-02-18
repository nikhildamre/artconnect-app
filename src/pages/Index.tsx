import { useState } from "react";
import { Search, Bell, ShoppingBag, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-art.jpg";
import logo from "@/assets/logo.png";
import { categories, artists } from "@/data/mockData";
import { useProducts, Product } from "@/hooks/useProducts";
import { useImageForArtwork } from "@/hooks/useArtworkImages";
import ArtistCard from "@/components/ArtistCard";
import CategoryPill from "@/components/CategoryPill";
import BottomNav from "@/components/BottomNav";

const ProductCard = ({ product, onClick, index }: { product: Product; onClick: () => void; index: number }) => {
  const imageSrc = useImageForArtwork(product.images?.[0] || "");
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
      <div className="relative overflow-hidden rounded-2xl shadow-art bg-card">
        <div className="aspect-[3/4] overflow-hidden">
          <img src={imageSrc} alt={product.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.discounted_price && product.discounted_price > product.price && (
          <div className="absolute left-2.5 top-2.5">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-sm">
              {Math.round(((product.discounted_price - product.price) / product.discounted_price) * 100)}% OFF
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-0.5 px-0.5">
        <h3 className="font-display text-sm font-bold leading-tight text-foreground line-clamp-1">{product.title}</h3>
        <p className="text-xs text-muted-foreground">{product.vendor_name || "Artist"}</p>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="font-display text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.discounted_price && product.discounted_price > product.price && (
            <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.discounted_price)}</span>
          )}
        </div>
      </div>
    </motion.div>
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

        {/* Hero Banner */}
        <section className="px-4 pt-5">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-3xl shadow-elevated">
            <img src={heroImage} alt="Kalavapp - Indian Art Marketplace" className="h-52 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Featured Collection</span>
              </div>
              <h2 className="font-display text-xl font-bold text-background leading-tight">Discover India's<br />Finest Artistry</h2>
              <button onClick={() => navigate("/browse")} className="mt-3 rounded-full bg-gradient-gold px-5 py-2.5 text-xs font-bold text-foreground shadow-gold transition-transform hover:scale-105 active:scale-95">
                Explore Now
              </button>
            </div>
          </motion.div>
        </section>

        {/* Categories */}
        <section className="pt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-display text-lg font-bold text-foreground">Categories</h2>
            <button onClick={() => navigate("/browse")} className="flex items-center gap-0.5 text-xs font-semibold text-secondary">
              See All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <CategoryPill key={cat.id} category={cat} isActive={activeCategory === cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)} />
            ))}
          </div>
        </section>

        {/* Trending Artworks */}
        <section className="pt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <h2 className="font-display text-lg font-bold text-foreground">Trending Artworks</h2>
            </div>
            <button onClick={() => navigate("/browse")} className="flex items-center gap-0.5 text-xs font-semibold text-secondary">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
                  <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                </div>
              ))
            ) : (
              products?.slice(0, 4).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} onClick={() => navigate(`/artwork/${product.id}`)} />
              ))
            )}
          </div>
        </section>

        {/* Top Artists */}
        <section className="pt-6 pb-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-display text-lg font-bold text-foreground">Top Artists</h2>
            <button className="flex items-center gap-0.5 text-xs font-semibold text-secondary">
              See All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>

        {/* Workshops CTA */}
        <section className="px-4 pb-3">
          <motion.div whileTap={{ scale: 0.98 }} className="rounded-3xl bg-gradient-gold p-5 shadow-gold cursor-pointer" onClick={() => navigate("/workshops")}>
            <h3 className="font-display text-lg font-bold text-foreground">Workshops & Classes</h3>
            <p className="mt-1.5 text-sm text-foreground/70 leading-relaxed">Learn traditional Indian art from master artists — online and offline.</p>
            <button className="mt-3 rounded-full bg-background px-5 py-2.5 text-xs font-bold text-primary transition-transform hover:scale-105">Explore Workshops</button>
          </motion.div>
        </section>

        {/* Commission CTA */}
        <section className="px-4 pb-6">
          <motion.div whileTap={{ scale: 0.98 }} className="rounded-3xl bg-gradient-burgundy p-5 shadow-elevated cursor-pointer" onClick={() => navigate("/commissions")}>
            <h3 className="font-display text-lg font-bold text-primary-foreground">Commission an Artist</h3>
            <p className="mt-1.5 text-sm text-primary-foreground/80 leading-relaxed">Get custom artwork created by India's finest artists, tailored to your vision.</p>
            <button className="mt-3 rounded-full bg-background px-5 py-2.5 text-xs font-bold text-primary transition-transform hover:scale-105">Start a Commission</button>
          </motion.div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;