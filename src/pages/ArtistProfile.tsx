import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BadgeCheck, MapPin, Star, Heart, Share2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { artists, featuredArtworks } from "@/data/mockData";
import { useImageForArtwork } from "@/hooks/useArtworkImages";
import ArtworkCard from "@/components/ArtworkCard";
import BottomNav from "@/components/BottomNav";

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = artists.find((a) => a.id === id);
  const artistWorks = featuredArtworks.filter((a) => a.artistId === id);

  if (!artist) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Artist not found</p>
      </div>
    );
  }

  const initials = artist.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative">
        <div className="h-32 bg-gradient-burgundy" />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="rounded-full bg-background/80 p-2 backdrop-blur-sm">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <button className="rounded-full bg-background/80 p-2 backdrop-blur-sm">
            <Share2 className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mx-auto max-w-lg px-4 -mt-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-gradient-gold font-display text-2xl font-bold text-foreground shadow-art">
            {initials}
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <h1 className="font-display text-xl font-bold text-foreground">{artist.name}</h1>
            {artist.isVerified && <BadgeCheck className="h-5 w-5 text-secondary" />}
          </div>
          <p className="text-sm text-secondary font-medium mt-0.5">{artist.specialty}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            {artist.location}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-4 py-4 border-y border-border w-full justify-center">
            <div className="text-center">
              <p className="font-display text-lg font-bold text-foreground">{artist.artworksCount}</p>
              <p className="text-xs text-muted-foreground">Artworks</p>
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-bold text-foreground">
                {(artist.followers / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                <p className="font-display text-lg font-bold text-foreground">{artist.rating}</p>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4 w-full">
            <button className="flex-1 rounded-xl bg-gradient-burgundy py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01]">
              <Heart className="h-4 w-4 inline mr-1.5" /> Follow
            </button>
            <button className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-foreground hover:bg-card transition-colors">
              <MessageCircle className="h-4 w-4 inline mr-1.5" /> Message
            </button>
          </div>

          {/* Bio */}
          <div className="mt-6 w-full">
            <h3 className="font-display text-sm font-bold text-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A passionate artist specializing in {artist.specialty}, based in {artist.location}. 
              With years of dedication to preserving and modernizing traditional Indian art forms, 
              each piece tells a unique story rooted in cultural heritage.
            </p>
          </div>

          {/* Artworks */}
          <div className="mt-6 w-full">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Artworks</h3>
            {artistWorks.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {artistWorks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onClick={() => navigate(`/artwork/${artwork.id}`)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No artworks listed yet</p>
            )}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ArtistProfile;
