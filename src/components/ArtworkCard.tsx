import { Heart, Star, Eye } from "lucide-react";
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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-3xl shadow-art bg-card border border-border/50 hover:border-secondary/50 transition-all duration-300">
        <div className="aspect-square overflow-hidden">
          <img
            src={imageSrc}
            alt={artwork.title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            loading="lazy"
          />
        </div>
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating Actions */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg">
                <Eye className="h-4 w-4 text-gray-800" />
              </div>
              <span className="text-white text-sm font-medium">Quick View</span>
            </div>
            <div className="rounded-full bg-white/90 backdrop-blur-sm p-2 shadow-lg">
              <Heart className={`h-4 w-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-800"}`} />
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {artwork.isNew && (
            <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 shadow-lg">
              <span className="text-xs font-bold text-white">NEW</span>
            </div>
          )}
          {artwork.originalPrice && (
            <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1.5 shadow-lg">
              <span className="text-xs font-bold text-white">
                {Math.round(((artwork.originalPrice - artwork.price) / artwork.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>
        
        {/* Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur-sm p-2.5 shadow-lg transition-all hover:scale-110 group-hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-700"}`}
          />
        </button>
      </div>
      
      <div className="mt-4 space-y-2 px-1">
        <h3 className="font-display text-base font-bold leading-tight text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
          {artwork.title}
        </h3>
        <p className="text-sm text-muted-foreground font-medium">{artwork.artist}</p>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-foreground">{formatPrice(artwork.price)}</span>
            {artwork.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(artwork.originalPrice)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-1 bg-secondary/10 rounded-full px-2.5 py-1">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-xs font-semibold text-secondary">{artwork.rating}</span>
            <span className="text-xs text-muted-foreground">({artwork.reviewsCount})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;
