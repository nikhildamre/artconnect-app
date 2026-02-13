import { useState } from "react";
import { Search, Bell, ShoppingBag, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-art.jpg";
import logo from "@/assets/logo.png";
import { categories, featuredArtworks, artists } from "@/data/mockData";
import ArtworkCard from "@/components/ArtworkCard";
import ArtistCard from "@/components/ArtistCard";
import CategoryPill from "@/components/CategoryPill";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="ArtVPP" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/notifications")}
              className="relative rounded-full bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="rounded-full bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg">
        {/* Search */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-shadow focus-within:shadow-gold focus-within:border-secondary">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search artworks, artists, styles..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>

        {/* Hero */}
        <section className="px-4 pt-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <img src={heroImage} alt="Kalavapp - Indian Art Marketplace" className="h-48 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-secondary" />
                <span className="text-xs font-medium text-secondary">Featured Collection</span>
              </div>
              <h2 className="font-display text-lg font-bold text-background leading-tight">
                Discover India's<br />Finest Artistry
              </h2>
              <button
                onClick={() => navigate("/browse")}
                className="mt-3 rounded-full bg-gradient-gold px-4 py-2 text-xs font-semibold text-foreground shadow-gold transition-transform hover:scale-105"
              >
                Explore Now
              </button>
            </div>
          </motion.div>
        </section>

        {/* Categories */}
        <section className="pt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-display text-base font-bold text-foreground">Categories</h2>
            <button
              onClick={() => navigate("/browse")}
              className="flex items-center gap-0.5 text-xs font-medium text-secondary"
            >
              See All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <CategoryPill
                key={cat.id}
                category={cat}
                isActive={activeCategory === cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              />
            ))}
          </div>
        </section>

        {/* Featured Artworks */}
        <section className="pt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-display text-base font-bold text-foreground">Trending Artworks</h2>
            <button
              onClick={() => navigate("/browse")}
              className="flex items-center gap-0.5 text-xs font-medium text-secondary"
            >
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4">
            {featuredArtworks.slice(0, 4).map((artwork, i) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onClick={() => navigate(`/artwork/${artwork.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Featured Artists */}
        <section className="pt-6 pb-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-display text-base font-bold text-foreground">Top Artists</h2>
            <button className="flex items-center gap-0.5 text-xs font-medium text-secondary">
              See All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>

        {/* Workshops Banner */}
        <section className="px-4 pb-3">
          <div className="rounded-2xl bg-gradient-gold p-5">
            <h3 className="font-display text-lg font-bold text-foreground">Workshops & Classes</h3>
            <p className="mt-1 text-sm text-foreground/70">
              Learn traditional Indian art from master artists — online and offline.
            </p>
            <button
              onClick={() => navigate("/workshops")}
              className="mt-3 rounded-full bg-background px-4 py-2 text-xs font-semibold text-primary transition-transform hover:scale-105"
            >
              Explore Workshops
            </button>
          </div>
        </section>

        {/* Commission Banner */}
        <section className="px-4 pb-6">
          <div className="rounded-2xl bg-gradient-burgundy p-5">
            <h3 className="font-display text-lg font-bold text-primary-foreground">Commission an Artist</h3>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Get custom artwork created by India's finest artists, tailored to your vision.
            </p>
            <button
              onClick={() => navigate("/commissions")}
              className="mt-3 rounded-full bg-background px-4 py-2 text-xs font-semibold text-primary transition-transform hover:scale-105"
            >
              Start a Commission
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
