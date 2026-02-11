import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, BadgeCheck, MessageCircle, Truck, Shield, RotateCcw } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { featuredArtworks } from "@/data/mockData";
import { useImageForArtwork } from "@/hooks/useArtworkImages";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const artwork = featuredArtworks.find((a) => a.id === id);
  const imageSrc = useImageForArtwork(artwork?.image || "");

  if (!artwork) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Artwork not found</p>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = () => {
    toast.success("Added to cart!", { description: artwork.title });
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Image */}
      <div className="relative">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={imageSrc}
          alt={artwork.title}
          className="aspect-square w-full object-cover"
        />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full bg-background/80 p-2 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="rounded-full bg-background/80 p-2 backdrop-blur-sm"
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : "text-foreground"}`} />
            </button>
            <button className="rounded-full bg-background/80 p-2 backdrop-blur-sm">
              <Share2 className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-5 space-y-5"
      >
        {/* Title & Price */}
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-xs font-medium text-secondary uppercase tracking-wider">{artwork.category}</span>
              <h1 className="font-display text-2xl font-bold text-foreground mt-0.5">{artwork.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-display text-2xl font-bold text-foreground">{formatPrice(artwork.price)}</span>
            {artwork.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(artwork.originalPrice)}</span>
            )}
            {artwork.originalPrice && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {Math.round(((artwork.originalPrice - artwork.price) / artwork.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            <span className="text-sm font-semibold text-foreground">{artwork.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">{artwork.reviewsCount} reviews</span>
        </div>

        {/* Artist */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold font-display text-sm font-bold text-foreground">
            {artwork.artist.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">{artwork.artist}</span>
              <BadgeCheck className="h-3.5 w-3.5 text-secondary" />
            </div>
            <span className="text-xs text-muted-foreground">Verified Artist</span>
          </div>
          <button className="rounded-full border border-secondary px-3 py-1.5 text-xs font-medium text-secondary hover:bg-secondary/10 transition-colors">
            Follow
          </button>
        </div>

        {/* Details */}
        <div className="space-y-2.5">
          <h3 className="font-display text-sm font-bold text-foreground">Details</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Medium", value: artwork.medium },
              { label: "Dimensions", value: artwork.dimensions },
              { label: "Category", value: artwork.category },
              { label: "Authenticity", value: "Certificate Included" },
            ].map((detail) => (
              <div key={detail.label} className="rounded-lg bg-card p-2.5 border border-border">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{detail.label}</span>
                <p className="text-xs font-medium text-foreground mt-0.5">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
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

        {/* Ask Artist */}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:border-secondary">
          <MessageCircle className="h-4 w-4 text-secondary" />
          Ask the Artist
        </button>
      </motion.div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg p-4">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-burgundy py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
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
