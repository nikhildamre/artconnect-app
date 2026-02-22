import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, BadgeCheck, MessageCircle, Truck, Shield, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useImageForArtwork } from "@/hooks/useArtworkImages";
import { useRazorpay } from "@/hooks/useRazorpay";
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
  const { processPayment, isProcessing } = useRazorpay();
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

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please sign in to make a purchase");
      navigate("/auth");
      return;
    }
    if (!product) return;

    // Calculate total with shipping and tax
    const subtotal = product.price;
    const shipping = subtotal > 25000 ? 0 : 499;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    processPayment(
      {
        amount: total,
        description: `Direct Purchase - ${product.title}`
      },
      (paymentResponse) => {
        toast.success("Payment successful! 🎉", {
          description: `Payment ID: ${paymentResponse.razorpay_payment_id}`
        });
        // In a real app, you would create an order here
        navigate("/orders");
      },
      () => {
        toast.error("Payment cancelled or failed");
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background gap-3">
        <span className="text-5xl">🎨</span>
        <p className="text-muted-foreground font-medium">Artwork not found</p>
        <button onClick={() => navigate("/browse")} className="rounded-full bg-gradient-burgundy px-5 py-2 text-sm font-semibold text-primary-foreground">
          Browse Artworks
        </button>
      </div>
    );
  }

  const dims = product.dimensions as Record<string, string> | null;
  const dimensionStr = dims ? `${dims.width}" × ${dims.height}"${dims.depth ? ` × ${dims.depth}"` : ""}` : "";

  return (
    <div className="min-h-[100dvh] bg-background pb-36 mx-auto max-w-lg">
      {/* Image Section */}
      <div className="relative">
        <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={imageSrc} alt={product.title} className="aspect-[4/3] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="rounded-full glass-card p-2.5 shadow-elevated">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setLiked(!liked)} className="rounded-full glass-card p-2.5 shadow-elevated">
              <Heart className={`h-5 w-5 transition-all ${liked ? "fill-primary text-primary scale-110" : "text-foreground"}`} />
            </button>
            <button className="rounded-full glass-card p-2.5 shadow-elevated">
              <Share2 className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-4 pt-5 space-y-5">
        {/* Title & Price */}
        <div>
          <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">{product.category}</span>
          <h1 className="font-display text-2xl font-bold text-foreground leading-tight">{product.title}</h1>
          <div className="flex items-center gap-3 mt-2.5">
            <span className="font-display text-2xl font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.discounted_price && product.discounted_price > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.discounted_price)}</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {Math.round(((product.discounted_price - product.price) / product.discounted_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            <span className="text-sm font-bold text-foreground">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">{product.reviews_count} reviews</span>
        </div>

        {/* Artist Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-art">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold font-display text-sm font-bold text-foreground shadow-gold">
            {(product.vendor_name || "A").split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground">{product.vendor_name || "Artist"}</span>
              <BadgeCheck className="h-4 w-4 text-secondary" />
            </div>
            <span className="text-xs text-muted-foreground">Verified Artist</span>
          </div>
          <button className="rounded-full bg-secondary/10 px-4 py-2 text-xs font-semibold text-secondary hover:bg-secondary/20 transition-colors">Follow</button>
        </div>

        {/* Description */}
        {product.description && <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>}

        {/* Details Grid */}
        <div className="space-y-3">
          <h3 className="font-display text-base font-bold text-foreground">Details</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Medium", value: product.medium || "Mixed" },
              { label: "Dimensions", value: dimensionStr || "N/A" },
              { label: "Category", value: product.category || "Art" },
              { label: "Authenticity", value: "Certificate Included" },
            ].map((detail) => (
              <div key={detail.label} className="rounded-xl bg-card p-3 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{detail.label}</span>
                <p className="text-xs font-semibold text-foreground mt-1">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-between rounded-2xl bg-card border border-border p-4">
          {[
            { icon: Truck, label: "Free Shipping" },
            { icon: Shield, label: "Authentic" },
            { icon: RotateCcw, label: "7-Day Returns" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10">
                <Icon className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Ask Artist */}
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/50 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-secondary hover:text-secondary">
          <MessageCircle className="h-4 w-4" />
          Ask the Artist
        </button>
      </motion.div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl safe-area-bottom">
        <div className="mx-auto flex max-w-lg gap-3 p-4">
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-background py-4 text-sm font-bold text-primary transition-colors hover:bg-primary/5 disabled:opacity-60"
          >
            <ShoppingCart className="h-4 w-4" />
            {addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>
          <button 
            onClick={handleBuyNow}
            disabled={isProcessing}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-burgundy py-4 text-sm font-bold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Buy Now
              </>
            )}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ArtworkDetail;