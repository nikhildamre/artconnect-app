import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useWishlist = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return { wishlist: null, items: [] };
      const { data: wishlist } = await supabase.from("wishlists").select("*").eq("user_id", user.id).single();
      if (!wishlist) return { wishlist: null, items: [] };
      const { data: items } = await supabase
        .from("wishlist_items")
        .select("*, products(*)")
        .eq("wishlist_id", wishlist.id);
      return { wishlist, items: items || [] };
    },
    enabled: !!user,
  });
};

export const useAddToWishlist = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { data: wishlist } = await supabase.from("wishlists").select("id").eq("user_id", user.id).single();
      if (!wishlist) throw new Error("Wishlist not found");
      const { error } = await supabase.from("wishlist_items").insert({ wishlist_id: wishlist.id, product_id: productId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
};

export const useRemoveFromWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("wishlist_items").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
};
