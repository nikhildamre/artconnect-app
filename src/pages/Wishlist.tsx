import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { useImageForArtwork } from "@/hooks/useArtworkImages";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const wishlistItems = data?.items || [];

  const handleAddToCart = (item: any) => {
    addToCart.mutate(
      { productId: item.product_id },
      {
        onSuccess: () => {
          removeFromWishlist.mutate(item.id);
          toast.success("Added to cart!");
        },
        onError: () => toast.error("Failed to add to cart"),
      }
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3"><h1 className="font-display text-lg font-bold text-foreground">Wishlist</h1></div>
        </header>
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted"><Heart className="h-7 w-7 text-primary" /></div>
          <h2 className="font-display text-xl font-bold text-foreground">Sign in to view your wishlist</h2>
          <button onClick={() => navigate("/auth")} className="mt-4 rounded-full bg-gradient-burgundy px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">Sign In</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3"><h1 className="font-display text-lg font-bold text-foreground">Wishlist</h1></div>
        </header>
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3"><h1 className="font-display text-lg font-bold text-foreground">Wishlist</h1></div>
        </header>
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted"><Heart className="h-7 w-7 text-primary" /></div>
          <h2 className="font-display text-xl font-bold text-foreground">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">Save artworks you love to find them later</p>
          <button onClick={() => navigate("/browse")} className="mt-4 rounded-full bg-gradient-burgundy px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">Browse Artworks</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-foreground">Wishlist</h1>
          <span className="text-xs text-muted-foreground">{wishlistItems.length} saved</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-3 pb-6">
        <AnimatePresence mode="popLayout">
          {wishlistItems.map((item) => {
            const product = item.products as any;
            if (!product) return null;
            const imageSrc = useImageForArtwork(product.images?.[0] || "");
            return (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                <img src={imageSrc} alt={product.title} onClick={() => navigate(`/artwork/${product.id}`)} className="h-24 w-24 rounded-lg object-cover cursor-pointer" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 onClick={() => navigate(`/artwork/${product.id}`)} className="font-display text-sm font-semibold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors">{product.title}</h3>
                    <p className="text-xs text-muted-foreground">{product.vendor_name || "Artist"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-display text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
                      {product.discounted_price && product.discounted_price > product.price && (
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(product.discounted_price)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleAddToCart(item)} className="flex items-center gap-1.5 rounded-lg bg-gradient-burgundy px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105">
                      <ShoppingCart className="h-3 w-3" /> Add to Cart
                    </button>
                    <button onClick={() => removeFromWishlist.mutate(item.id, { onSuccess: () => toast.success("Removed from wishlist") })} className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default Wishlist;
