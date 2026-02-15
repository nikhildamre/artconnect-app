import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCart = () => {
  const { user } = useAuth();

  const cartQuery = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      if (!user) return { cart: null, items: [] };
      const { data: cart } = await supabase.from("carts").select("*").eq("user_id", user.id).single();
      if (!cart) return { cart: null, items: [] };
      const { data: items } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("cart_id", cart.id);
      return { cart, items: items || [] };
    },
    enabled: !!user,
  });

  return cartQuery;
};

export const useAddToCart = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: cart } = await supabase.from("carts").select("id").eq("user_id", user.id).single();
      if (!cart) throw new Error("Cart not found");
      
      // Check if item already in cart
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cart.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({ cart_id: cart.id, product_id: productId, quantity });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useUpdateCartItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};

export const useRemoveCartItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
};
