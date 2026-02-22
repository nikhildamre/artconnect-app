import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error("Authentication failed. Please try again.");
          navigate("/auth");
          return;
        }

        if (data.session) {
          toast.success("Successfully signed in with Google!");
          navigate("/");
        } else {
          toast.error("Authentication failed. Please try again.");
          navigate("/auth");
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        toast.error("Authentication failed. Please try again.");
        navigate("/auth");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center mx-auto max-w-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;