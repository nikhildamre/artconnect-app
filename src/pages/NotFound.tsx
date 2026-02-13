import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <img src={logo} alt="ArtVPP" className="h-16 w-auto mx-auto mb-6" />
        <h1 className="font-display text-6xl font-bold text-foreground mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-6">This masterpiece doesn't exist yet</p>
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-gradient-burgundy px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-105"
        >
          Back to Gallery
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
