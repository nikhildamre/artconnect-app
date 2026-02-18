import { BadgeCheck, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Artist } from "@/data/mockData";

const ArtistCard = ({ artist }: { artist: Artist }) => {
  const navigate = useNavigate();
  const initials = artist.name.split(" ").map(n => n[0]).join("");

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={() => navigate(`/artist/${artist.id}`)}
      className="flex shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-5 shadow-art transition-all hover:shadow-elevated cursor-pointer"
      style={{ minWidth: 150 }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold font-display text-xl font-bold text-foreground shadow-gold">
        {initials}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-foreground">{artist.name}</span>
        {artist.isVerified && <BadgeCheck className="h-3.5 w-3.5 text-secondary" />}
      </div>
      <span className="text-xs text-muted-foreground font-medium">{artist.specialty}</span>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {artist.location}
      </div>
      <span className="text-xs font-bold text-secondary">
        {(artist.followers / 1000).toFixed(1)}K followers
      </span>
    </motion.div>
  );
};

export default ArtistCard;