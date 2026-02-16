import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSellerApplication = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["seller-application", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("seller_applications")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useSubmitSellerApplication = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (application: {
      full_name: string;
      email: string;
      phone: string;
      artist_bio: string;
      art_category: string;
      portfolio_url?: string;
      social_media_links?: Record<string, string>[];
      government_id_url?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("seller_applications").insert([{
        user_id: user.id,
        ...application,
      }]);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["seller-application"] }),
  });
};
