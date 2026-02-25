import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useVendorProducts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["vendor-products", user?.id],
    queryFn: async () => {
      if (!user) {
        console.log("No user found for vendor products");
        return [];
      }
      
      console.log("Fetching products for vendor:", user.id);
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("vendor_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching vendor products:", error);
        throw error;
      }
      
      console.log("Vendor products fetched:", data?.length || 0, "products");
      return data || [];
    },
    enabled: !!user,
  });
};

export const useVendorOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["vendor-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get orders that contain products from this vendor
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items!inner(
            *,
            products!inner(
              id,
              title,
              price,
              vendor_id
            )
          )
        `)
        .eq("order_items.products.vendor_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching vendor orders:", error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user,
  });
};

export const useVendorStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["vendor-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;

      console.log("Fetching vendor stats for user:", user.id);

      // Get total products
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, price, is_active, moderation_status")
        .eq("vendor_id", user.id);

      if (productsError) {
        console.error("Error fetching vendor products for stats:", productsError);
        // Don't throw error, return basic stats
        return {
          totalProducts: 0,
          activeProducts: 0,
          pendingProducts: 0,
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0,
          totalRevenue: 0,
          monthlyRevenue: Array(12).fill(0),
        };
      }

      // Get orders containing vendor's products
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total,
          created_at,
          order_items!inner(
            quantity,
            price,
            products!inner(
              vendor_id
            )
          )
        `)
        .eq("order_items.products.vendor_id", user.id);

      if (ordersError) {
        console.error("Error fetching vendor orders for stats:", ordersError);
        // Continue with empty orders array
      }

      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.is_active)?.length || 0;
      const pendingProducts = products?.filter(p => p.moderation_status === 'pending')?.length || 0;
      
      const safeOrders = orders || [];
      const totalOrders = safeOrders.length;
      const completedOrders = safeOrders.filter(o => o.status === 'delivered').length;
      const pendingOrders = safeOrders.filter(o => o.status === 'pending').length;
      
      // Calculate total revenue from completed orders
      const totalRevenue = safeOrders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => {
          const vendorItems = order.order_items?.filter(item => 
            item.products?.vendor_id === user.id
          ) || [];
          const orderRevenue = vendorItems.reduce((itemSum, item) => 
            itemSum + (item.price * item.quantity), 0
          );
          return sum + orderRevenue;
        }, 0);

      // Calculate monthly revenue for the last 12 months
      const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthRevenue = safeOrders
          .filter(o => {
            const orderDate = new Date(o.created_at);
            return o.status === 'delivered' && 
                   orderDate >= monthStart && 
                   orderDate <= monthEnd;
          })
          .reduce((sum, order) => {
            const vendorItems = order.order_items?.filter(item => 
              item.products?.vendor_id === user.id
            ) || [];
            const orderRevenue = vendorItems.reduce((itemSum, item) => 
              itemSum + (item.price * item.quantity), 0
            );
            return sum + orderRevenue;
          }, 0);
        
        return monthRevenue;
      });

      const stats = {
        totalProducts,
        activeProducts,
        pendingProducts,
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue,
        monthlyRevenue,
      };

      console.log("Vendor stats calculated:", stats);
      return stats;
    },
    enabled: !!user,
  });
};

export const useVendorRecentActivity = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["vendor-recent-activity", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get recent orders
      const { data: recentOrders, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total,
          created_at,
          order_items!inner(
            quantity,
            price,
            products!inner(
              id,
              title,
              vendor_id
            )
          )
        `)
        .eq("order_items.products.vendor_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (ordersError) {
        console.error("Error fetching recent orders:", ordersError);
        return [];
      }

      return recentOrders || [];
    },
    enabled: !!user,
  });
};

export const useUpdateProduct = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      productId, 
      updates 
    }: { 
      productId: string; 
      updates: {
        title?: string;
        description?: string;
        price?: number;
        is_active?: boolean;
        inventory?: number;
      };
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", productId)
        .eq("vendor_id", user.id); // Ensure vendor can only update their own products
      
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
  });
};

export const useDeleteProduct = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("vendor_id", user.id); // Ensure vendor can only delete their own products
      
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
  });
};

export const useCreateProduct = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (product: {
      title: string;
      description: string;
      price: number;
      category: string;
      medium?: string;
      inventory: number;
      image_url?: string;
      image_urls?: string[];
      images?: string[];
    }) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("products")
        .insert({
          ...product,
          vendor_id: user.id,
          vendor_name: user.user_metadata?.display_name || user.email || "Artist",
          moderation_status: "pending",
          is_active: true,
          // Use the first image as the main image_url if not provided
          image_url: product.image_url || product.image_urls?.[0] || product.images?.[0],
          // Store all images in both arrays for compatibility
          image_urls: product.image_urls || product.images || [],
          images: product.images || product.image_urls || [],
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendor-products"] });
      qc.invalidateQueries({ queryKey: ["vendor-stats"] });
    },
  });
};