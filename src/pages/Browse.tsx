import { useState } from "react";
import { Search, SlidersHorizontal, Grid3X3, LayoutList, Star, Filter, X } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-3xl shadow-art bg-card border border-border/50 hover:border-secondary/50 transition-all duration-300">
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={imageSrc} 
            alt={product.title} 
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" 
            loading="lazy" 
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
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
        
        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg">
            <Star className="h-4 w-4 text-gray-800" />
          </div>
        </div>
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
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-xs font-semibold text-secondary">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews_count})</span>
          </div>
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
  const [showFilters, setShowFilters] = useState(false);

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
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 safe-area-top">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Discover Art</h1>
              <p className="text-sm text-muted-foreground">Explore our curated collection</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`rounded-2xl border p-3 transition-all shadow-art ${
                  showFilters 
                    ? 'border-secondary bg-secondary/10 text-secondary' 
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <Filter className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} 
                className="rounded-2xl border border-border bg-card p-3 text-muted-foreground hover:text-foreground transition-colors shadow-art"
              >
                {viewMode === "grid" ? <LayoutList className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 focus-within:border-secondary focus-within:shadow-lg transition-all shadow-art">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search artworks, artists..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" 
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-b border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <div className="px-4 py-4">
                <h3 className="font-semibold text-foreground mb-3">Filter by Category</h3>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                  <CategoryPill 
                    category={{ id: "all", name: "All", icon: "✨", count: 0 }} 
                    isActive={!activeCategory} 
                    onClick={() => setActiveCategory(null)} 
                  />
                  {categories.map((cat) => (
                    <CategoryPill 
                      key={cat.id} 
                      category={cat} 
                      isActive={activeCategory === cat.id} 
                      onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">
              {isLoading ? "Loading..." : `${filteredProducts.length} artwork${filteredProducts.length !== 1 ? "s" : ""} found`}
            </p>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-1 text-xs font-semibold text-secondary hover:text-secondary/80 transition-colors"
              >
                Clear filter <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="popLayout">
          <div className={`px-4 pb-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-6"}`}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-[3/4] rounded-3xl bg-muted animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                ))
              : filteredProducts.map((product, i) => (
                  <BrowseProductCard 
                    key={product.id} 
                    product={product} 
                    index={i} 
                    onClick={() => navigate(`/artwork/${product.id}`)} 
                  />
                ))}
          </div>
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center px-4 py-16 text-center"
          >
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">No artworks found</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Try adjusting your search terms or browse different categories to discover amazing artworks.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory(null);
              }}
              className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Browse;