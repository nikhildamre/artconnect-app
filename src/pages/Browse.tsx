import { useState } from "react";
import { Search, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { categories, featuredArtworks } from "@/data/mockData";
import ArtworkCard from "@/components/ArtworkCard";
import CategoryPill from "@/components/CategoryPill";
import BottomNav from "@/components/BottomNav";

const Browse = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredArtworks = featuredArtworks.filter((artwork) => {
    const matchesCategory = !activeCategory || artwork.category.toLowerCase() === activeCategory;
    const matchesSearch =
      !searchQuery ||
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="mx-auto max-w-lg px-4 py-3">
          <h1 className="font-display text-lg font-bold text-foreground mb-3">Browse Artworks</h1>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 focus-within:border-secondary focus-within:shadow-gold transition-all">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            <button className="rounded-xl border border-border bg-card p-2.5 text-muted-foreground hover:text-foreground transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="rounded-xl border border-border bg-card p-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
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

        {/* Results count */}
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground">
            {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <div className={`px-4 pb-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-4"}`}>
            {filteredArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onClick={() => navigate(`/artwork/${artwork.id}`)}
              />
            ))}
          </div>
        </AnimatePresence>

        {filteredArtworks.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <span className="text-4xl mb-3">🎨</span>
            <h3 className="font-display text-lg font-semibold text-foreground">No artworks found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Browse;
