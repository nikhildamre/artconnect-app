import painting1 from "@/assets/art-painting-1.jpg";
import sculpture1 from "@/assets/art-sculpture-1.jpg";
import miniature1 from "@/assets/art-miniature-1.jpg";
import digital1 from "@/assets/art-digital-1.jpg";
import warli1 from "@/assets/art-warli-1.jpg";
import tanjore1 from "@/assets/art-tanjore-1.jpg";

const imageMap: Record<string, string> = {
  "painting-1": painting1,
  "sculpture-1": sculpture1,
  "miniature-1": miniature1,
  "digital-1": digital1,
  "warli-1": warli1,
  "tanjore-1": tanjore1,
};

export const useImageForArtwork = (imageKey: string): string => {
  return imageMap[imageKey] || painting1;
};
