import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin, useIsVendor } from "@/hooks/useAdmin";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "vendor" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: isVendor, isLoading: vendorLoading } = useIsVendor();

  if (loading || adminLoading || vendorLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "vendor" && !isVendor && !isAdmin) {
    return <Navigate to="/apply-seller" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
