import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, BadgeCheck, MessageCircle, Truck, Shield, RotateCcw } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useImageForArtwork } from "@/hooks/useArtworkImages";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const { data: product, isLoading } = useProduct(id);
  const addToCart = useAddToCart();
  const imageSrc = useImageForArtwork(product?.images?.[0] || "");

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }
    if (!product) return;
    addToCart.mutate(
      { productId: product.id },
      {
        onSuccess: () => toast.success("Added to cart!", { description: product.title }),
        onError: () => toast.error("Failed to add to cart"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Artwork not found</p>
      </div>
    );
  }

  const dims = product.dimensions as Record<string, string> | null;
  const dimensionStr = dims ? `${dims.width}" × ${dims.height}"${dims.depth ? ` × ${dims.depth}"` : ""}` : "";

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative">
        <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={imageSrc} alt={product.title} className="aspect-square w-full object-cover" />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="rounded-full bg-background/80 p-2 backdrop-blur-sm">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setLiked(!liked)} className="rounded-full bg-background/80 p-2 backdrop-blur-sm">
              <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : "text-foreground"}`} />
            </button>
            <button className="rounded-full bg-background/80 p-2 backdrop-blur-sm">
              <Share2 className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-4 pt-5 space-y-5">
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-xs font-medium text-secondary uppercase tracking-wider">{product.category}</span>
              <h1 className="font-display text-2xl font-bold text-foreground mt-0.5">{product.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-display text-2xl font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.discounted_price && product.discounted_price > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.discounted_price)}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {Math.round(((product.discounted_price - product.price) / product.discounted_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            <span className="text-sm font-semibold text-foreground">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">{product.reviews_count} reviews</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold font-display text-sm font-bold text-foreground">
            {(product.vendor_name || "A").split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">{product.vendor_name || "Artist"}</span>
              <BadgeCheck className="h-3.5 w-3.5 text-secondary" />
            </div>
            <span className="text-xs text-muted-foreground">Verified Artist</span>
          </div>
          <button className="rounded-full border border-secondary px-3 py-1.5 text-xs font-medium text-secondary hover:bg-secondary/10 transition-colors">Follow</button>
        </div>

        {product.description && <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>}

        <div className="space-y-2.5">
          <h3 className="font-display text-sm font-bold text-foreground">Details</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Medium", value: product.medium || "Mixed" },
              { label: "Dimensions", value: dimensionStr || "N/A" },
              { label: "Category", value: product.category || "Art" },
              { label: "Authenticity", value: "Certificate Included" },
            ].map((detail) => (
              <div key={detail.label} className="rounded-lg bg-card p-2.5 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{detail.label}</span>
                <p className="text-xs font-medium text-foreground mt-0.5">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {[
            { icon: Truck, label: "Free Shipping" },
            { icon: Shield, label: "Authentic" },
            { icon: RotateCcw, label: "7-Day Returns" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-secondary" />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:border-secondary">
          <MessageCircle className="h-4 w-4 text-secondary" />
          Ask the Artist
        </button>
      </motion.div>

      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg p-4">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-burgundy py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            <ShoppingCart className="h-4 w-4" />
            {addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>
          <button className="rounded-xl border-2 border-primary bg-background px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5">
            Buy Now
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ArtworkDetail;
