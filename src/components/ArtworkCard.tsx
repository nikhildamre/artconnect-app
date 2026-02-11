import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Artwork } from "@/data/mockData";
import { useImageForArtwork } from "@/hooks/useArtworkImages";

interface ArtworkCardProps {
  artwork: Artwork;
  onClick?: () => void;
}

const ArtworkCard = ({ artwork, onClick }: ArtworkCardProps) => {
  const [liked, setLiked] = useState(false);
  const imageSrc = useImageForArtwork(artwork.image);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg shadow-art bg-card">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageSrc}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        {/* Badges */}
        <div className="absolute left-2 top-2 flex gap-1.5">
          {artwork.isNew && (
            <span className="rounded-full bg-gradient-gold px-2.5 py-0.5 text-xs font-semibold text-foreground">
              New
            </span>
          )}
          {artwork.originalPrice && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
              {Math.round(((artwork.originalPrice - artwork.price) / artwork.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
        {/* Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute right-2 top-2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${liked ? "fill-primary text-primary" : "text-muted-foreground"}`}
          />
        </button>
      </div>
      <div className="mt-3 space-y-1 px-0.5">
        <h3 className="font-display text-sm font-semibold leading-tight text-foreground line-clamp-1">
          {artwork.title}
        </h3>
        <p className="text-xs text-muted-foreground">{artwork.artist}</p>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-secondary text-secondary" />
          <span className="text-xs font-medium text-foreground">{artwork.rating}</span>
          <span className="text-xs text-muted-foreground">({artwork.reviewsCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold text-foreground">{formatPrice(artwork.price)}</span>
          {artwork.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(artwork.originalPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
