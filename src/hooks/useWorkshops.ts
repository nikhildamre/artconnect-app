import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useWorkshops = () => {
  return useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

export const useBookWorkshop = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (workshopId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("workshop_bookings")
        .insert({ customer_id: user.id, workshop_id: workshopId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workshops"] }),
  });
};
