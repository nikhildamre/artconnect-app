import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCommissions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["commissions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("commissions")
        .select("*")
        .or(`customer_id.eq.${user.id},artist_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};

export const useCreateCommission = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      budget,
      timeline,
    }: {
      title: string;
      description: string;
      budget: number;
      timeline: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("commissions")
        .insert({
          customer_id: user.id,
          title,
          description,
          budget,
          timeline,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["commissions"] }),
  });
};
