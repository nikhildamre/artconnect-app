import { useState } from "react";
import { Search, SlidersHorizontal, Grid3X3, LayoutList, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/mockData";
import { useProducts, Product } from "@/hooks/useProducts";
import { useImageForArtwork } from "@/hooks/useArtworkImages";
import CategoryPill from "@/components/CategoryPill";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const BrowseProductCard = ({ product, onClick, index }: { product: Product; onClick: () => void; index: number }) => {
  const imageSrc = useImageForArtwork(product.images?.[0] || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileTap={{ scale: 0.97 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-art bg-card">
        <div className="aspect-[3/4] overflow-hidden">
          <img src={imageSrc} alt={product.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        </div>
        {product.discounted_price && product.discounted_price > product.price && (
          <div className="absolute left-2.5 top-2.5">
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
              {Math.round(((product.discounted_price - product.price) / product.discounted_price) * 100)}% OFF
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-0.5 px-0.5">
        <h3 className="font-display text-sm font-bold leading-tight text-foreground line-clamp-1">{product.title}</h3>
        <p className="text-xs text-muted-foreground">{product.vendor_name || "Artist"}</p>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          <span className="text-xs font-semibold text-foreground">{product.rating}</span>
          <span className="text-[10px] text-muted-foreground">({product.reviews_count})</span>
        </div>
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

const Browse = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryMap: Record<string, string> = {
    paintings: "Paintings",
    sculptures: "Sculptures",
    digital: "Digital Art",
    photography: "Photography",
    handicrafts: "Handicrafts",
    folk: "Folk Art",
  };

  const { data: products, isLoading } = useProducts(activeCategory ? categoryMap[activeCategory] : null);

  const filteredProducts = (products || []).filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || (p.vendor_name || "").toLowerCase().includes(q);
  });

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 safe-area-top">
        <div className="px-4 py-3">
          <h1 className="font-display text-xl font-bold text-foreground mb-3">Browse Artworks</h1>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5 py-3 focus-within:border-secondary focus-within:shadow-gold transition-all shadow-art">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search artworks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            </div>
            <button className="rounded-2xl border border-border bg-card p-3 text-muted-foreground hover:text-foreground transition-colors shadow-art">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="rounded-2xl border border-border bg-card p-3 text-muted-foreground hover:text-foreground transition-colors shadow-art">
              {viewMode === "grid" ? <LayoutList className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="flex gap-2.5 overflow-x-auto px-4 py-3 scrollbar-hide">
          <CategoryPill category={{ id: "all", name: "All", icon: "✨", count: 0 }} isActive={!activeCategory} onClick={() => setActiveCategory(null)} />
          {categories.map((cat) => (
            <CategoryPill key={cat.id} category={cat} isActive={activeCategory === cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)} />
          ))}
        </div>

        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground font-medium">
            {isLoading ? "Loading..." : `${filteredProducts.length} artwork${filteredProducts.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          <div className={`px-4 pb-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-4"}`}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
                    <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                  </div>
                ))
              : filteredProducts.map((product, i) => (
                  <BrowseProductCard key={product.id} product={product} index={i} onClick={() => navigate(`/artwork/${product.id}`)} />
                ))}
          </div>
        </AnimatePresence>

        {!isLoading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <span className="text-5xl mb-3">🎨</span>
            <h3 className="font-display text-xl font-bold text-foreground">No artworks found</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Browse;