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
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      {/* Header with Cover */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4 safe-area-top">
          <button 
            onClick={() => navigate(-1)} 
            className="rounded-full bg-black/20 backdrop-blur-md p-2.5 border border-white/20"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <button className="rounded-full bg-black/20 backdrop-blur-md p-2.5 border border-white/20">
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 -mt-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          {/* Profile Picture */}
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-amber-400 to-orange-500 font-display text-2xl font-bold text-white shadow-xl mb-4">
            {initials}
          </div>

          {/* Name and Verification */}
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-display text-2xl font-bold text-foreground">{artist.name}</h1>
            {artist.isVerified && <BadgeCheck className="h-6 w-6 text-secondary" />}
          </div>

          {/* Specialty and Location */}
          <p className="text-base text-secondary font-semibold mb-1">{artist.specialty}</p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <MapPin className="h-4 w-4" />
            <span>{artist.location}</span>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-4 mb-6 w-full">
            <div className="flex-1 bg-card rounded-2xl p-4 text-center border border-border shadow-sm">
              <p className="font-display text-xl font-bold text-foreground">{artist.artworksCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Artworks</p>
            </div>
            <div className="flex-1 bg-card rounded-2xl p-4 text-center border border-border shadow-sm">
              <p className="font-display text-xl font-bold text-foreground">
                {(artist.followers / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-muted-foreground mt-1">Followers</p>
            </div>
            <div className="flex-1 bg-card rounded-2xl p-4 text-center border border-border shadow-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <p className="font-display text-xl font-bold text-foreground">{artist.rating}</p>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-8 w-full">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl"
            >
              <Heart className="h-4 w-4 inline mr-2" /> Follow
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-2xl border-2 border-border bg-card py-4 text-sm font-semibold text-foreground hover:bg-muted transition-all"
            >
              <MessageCircle className="h-4 w-4 inline mr-2" /> Message
            </motion.button>
          </div>

          {/* About Section */}
          <div className="w-full mb-8">
            <h3 className="font-display text-lg font-bold text-foreground mb-3">About</h3>
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <p className="text-sm text-muted-foreground leading-relaxed">
                A passionate artist specializing in {artist.specialty}, based in {artist.location}. 
                With years of dedication to preserving and modernizing traditional Indian art forms, 
                each piece tells a unique story rooted in cultural heritage.
              </p>
            </div>
          </div>

          {/* Artworks Section */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Artworks</h3>
              <span className="text-sm text-muted-foreground">{artistWorks.length} pieces</span>
            </div>
            
            {artistWorks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {artistWorks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ArtworkCard
                      artwork={artwork}
                      onClick={() => navigate(`/artwork/${artwork.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm">
                <div className="text-4xl mb-3">🎨</div>
                <p className="text-sm text-muted-foreground">No artworks listed yet</p>
                <p className="text-xs text-muted-foreground mt-1">Check back soon for new creations!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ArtistProfile;
