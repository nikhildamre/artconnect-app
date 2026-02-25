import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCart = () => {
  const { user } = useAuth();

  const cartQuery = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      if (!user) return { cart: null, items: [] };
      
      // Get or create cart
      let { data: cart } = await supabase.from("carts").select("*").eq("user_id", user.id).single();
      
      if (!cart) {
        // Create cart if it doesn't exist
        const { data: newCart, error: cartError } = await supabase
          .from("carts")
          .insert({ user_id: user.id })
          .select("*")
          .single();
        
        if (cartError) {
          console.error("Error creating cart:", cartError);
          return { cart: null, items: [] };
        }
        cart = newCart;
      }
      
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
      
      console.log("Adding to cart:", { productId, quantity, userId: user.id });
      
      // Get or create cart
      let { data: cart, error: cartFetchError } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (cartFetchError && cartFetchError.code !== 'PGRST116') {
        console.error("Error fetching cart:", cartFetchError);
        throw new Error(`Failed to fetch cart: ${cartFetchError.message}`);
      }
      
      if (!cart) {
        console.log("Creating new cart for user:", user.id);
        // Create cart if it doesn't exist
        const { data: newCart, error: cartError } = await supabase
          .from("carts")
          .insert({ user_id: user.id })
          .select("id")
          .single();
        
        if (cartError) {
          console.error("Error creating cart:", cartError);
          throw new Error(`Failed to create cart: ${cartError.message}`);
        }
        cart = newCart;
        console.log("Created cart:", cart);
      }
      
      // Check if item already in cart
      const { data: existing, error: existingError } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("cart_id", cart.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existingError) {
        console.error("Error checking existing cart item:", existingError);
        throw new Error(`Failed to check existing item: ${existingError.message}`);
      }

      if (existing) {
        console.log("Updating existing cart item:", existing);
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
        if (error) {
          console.error("Error updating cart item:", error);
          throw new Error(`Failed to update cart item: ${error.message}`);
        }
      } else {
        console.log("Adding new cart item");
        const { error } = await supabase
          .from("cart_items")
          .insert({ cart_id: cart.id, product_id: productId, quantity });
        if (error) {
          console.error("Error adding cart item:", error);
          throw new Error(`Failed to add cart item: ${error.message}`);
        }
      }
      
      console.log("Successfully added to cart");
    },
    onSuccess: () => {
      console.log("Cart updated, invalidating queries");
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
    }
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
