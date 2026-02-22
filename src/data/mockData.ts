export interface Artwork {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  medium: string;
  dimensions: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  location: string;
  artworksCount: number;
  followers: number;
  isVerified: boolean;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  { id: "paintings", name: "Paintings", icon: "🎨", description: "Canvas stories in vibrant hues" },
  { id: "sculptures", name: "Sculptures", icon: "🗿", description: "Three-dimensional poetry" },
  { id: "digital", name: "Digital Art", icon: "💻", description: "Modern creativity unleashed" },
  { id: "photography", name: "Photography", icon: "📷", description: "Moments frozen in time" },
  { id: "handicrafts", name: "Handicrafts", icon: "🧶", description: "Handmade with love" },
  { id: "folk", name: "Folk Art", icon: "🪷", description: "Traditional tales retold" },
];

export const featuredArtworks: Artwork[] = [
  {
    id: "1",
    title: "Crimson Birds of Madhubani",
    artist: "Priya Sharma",
    artistId: "a1",
    price: 18500,
    originalPrice: 22000,
    image: "painting-1",
    category: "Paintings",
    medium: "Natural dyes on handmade paper",
    dimensions: "24\" × 24\"",
    rating: 4.8,
    reviewsCount: 42,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Eternal Flow",
    artist: "Rahul Mehta",
    artistId: "a2",
    price: 75000,
    image: "sculpture-1",
    category: "Sculptures",
    medium: "Bronze",
    dimensions: "48\" × 18\" × 18\"",
    rating: 4.9,
    reviewsCount: 28,
    isFeatured: true,
  },
  {
    id: "3",
    title: "Royal Court of Jaipur",
    artist: "Ananya Gupta",
    artistId: "a3",
    price: 45000,
    originalPrice: 52000,
    image: "miniature-1",
    category: "Paintings",
    medium: "Gold leaf & pigments on silk",
    dimensions: "18\" × 18\"",
    rating: 5.0,
    reviewsCount: 15,
    isNew: true,
  },
  {
    id: "4",
    title: "Harvest Dance",
    artist: "Meera Patil",
    artistId: "a4",
    price: 12000,
    image: "warli-1",
    category: "Folk Art",
    medium: "Rice paste on mud base",
    dimensions: "20\" × 20\"",
    rating: 4.7,
    reviewsCount: 63,
  },
  {
    id: "5",
    title: "Lotus Abstraction",
    artist: "Vikram Das",
    artistId: "a5",
    price: 32000,
    image: "digital-1",
    category: "Digital Art",
    medium: "Mixed media with gold leaf",
    dimensions: "30\" × 30\"",
    rating: 4.6,
    reviewsCount: 37,
    isNew: true,
  },
  {
    id: "6",
    title: "Sacred Traditions",
    artist: "Lakshmi Nair",
    artistId: "a6",
    price: 95000,
    image: "tanjore-1",
    category: "Paintings",
    medium: "Gold foil & semi-precious stones",
    dimensions: "24\" × 30\"",
    rating: 4.9,
    reviewsCount: 19,
    isFeatured: true,
  },
];

export const artists: Artist[] = [
  {
    id: "a1",
    name: "Priya Sharma",
    avatar: "",
    specialty: "Madhubani Art",
    location: "Bihar",
    artworksCount: 87,
    followers: 12400,
    isVerified: true,
    rating: 4.8,
  },
  {
    id: "a2",
    name: "Rahul Mehta",
    avatar: "",
    specialty: "Bronze Sculptures",
    location: "Mumbai",
    artworksCount: 34,
    followers: 8900,
    isVerified: true,
    rating: 4.9,
  },
  {
    id: "a3",
    name: "Ananya Gupta",
    avatar: "",
    specialty: "Miniature Paintings",
    location: "Jaipur",
    artworksCount: 56,
    followers: 15600,
    isVerified: true,
    rating: 5.0,
  },
  {
    id: "a4",
    name: "Meera Patil",
    avatar: "",
    specialty: "Warli Art",
    location: "Maharashtra",
    artworksCount: 120,
    followers: 22100,
    isVerified: true,
    rating: 4.7,
  },
];
