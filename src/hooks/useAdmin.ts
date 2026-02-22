import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useIsAdmin = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (error) return false;
      return !!data;
    },
    enabled: !!user,
  });
};

export const useIsVendor = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-vendor", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "vendor",
      });
      if (error) return false;
      return !!data;
    },
    enabled: !!user,
  });
};

export const useAllSellerApplications = () => {
  return useQuery({
    queryKey: ["admin-seller-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seller_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching seller applications:", error);
        throw error;
      }
      return data || [];
    },
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["admin-all-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      return data || [];
    },
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ["admin-all-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      return data || [];
    },
  });
};

export const useAllSellers = () => {
  return useQuery({
    queryKey: ["admin-all-sellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id, created_at")
        .eq("role", "vendor");
      if (error) {
        console.error("Error fetching seller roles:", error);
        throw error;
      }
      // Get profiles for these vendors
      if (!data || data.length === 0) return [];
      const userIds = data.map((r) => r.user_id);
      
      // Try both possible profile table structures
      let profiles = [];
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, user_id, display_name, bio, location, avatar_url")
          .in("user_id", userIds);
        
        if (profilesError) {
          // Try alternative structure with id as primary key
          const { data: altProfilesData } = await supabase
            .from("profiles")
            .select("id, display_name, bio, location, avatar_url")
            .in("id", userIds);
          profiles = altProfilesData?.map(p => ({ ...p, user_id: p.id })) || [];
        } else {
          profiles = profilesData || [];
        }
      } catch (err) {
        console.error("Error fetching seller profiles:", err);
        // Return basic info even if profiles fail
        return data.map(d => ({ 
          user_id: d.user_id, 
          id: d.user_id,
          display_name: "Unknown Seller",
          created_at: d.created_at
        }));
      }
      
      return profiles;
    },
  });
};

export const useApproveSellerApplication = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (applicationId: string) => {
      if (!user) throw new Error("Not authenticated");
      // Get the application to find user_id
      const { data: app, error: fetchError } = await supabase
        .from("seller_applications")
        .select("user_id")
        .eq("id", applicationId)
        .single();
      if (fetchError || !app) throw new Error("Application not found");

      // Update application status
      const { error: updateError } = await supabase
        .from("seller_applications")
        .update({
          status: "approved",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicationId);
      if (updateError) throw updateError;

      // Grant vendor role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: app.user_id, role: "vendor" });
      if (roleError && !roleError.message.includes("duplicate")) throw roleError;

      // Log the action
      await supabase.from("audit_logs").insert({
        admin_id: user.id,
        action: "approve_seller",
        target_type: "seller_application",
        target_id: applicationId,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-seller-applications"] });
      qc.invalidateQueries({ queryKey: ["admin-all-sellers"] });
    },
  });
};

export const useRejectSellerApplication = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ applicationId, reason }: { applicationId: string; reason: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("seller_applications")
        .update({
          status: "rejected",
          rejection_reason: reason,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicationId);
      if (error) throw error;

      await supabase.from("audit_logs").insert({
        admin_id: user.id,
        action: "reject_seller",
        target_type: "seller_application",
        target_id: applicationId,
        details: { reason },
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-seller-applications"] }),
  });
};

export const useModerateProduct = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      status,
      feedback,
    }: {
      productId: string;
      status: "approved" | "rejected";
      feedback?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("products")
        .update({
          moderation_status: status,
          admin_feedback: feedback || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", productId);
      if (error) throw error;

      await supabase.from("audit_logs").insert({
        admin_id: user.id,
        action: `${status}_product`,
        target_type: "product",
        target_id: productId,
        details: { feedback },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
