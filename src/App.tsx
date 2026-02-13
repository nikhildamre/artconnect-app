import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import ArtworkDetail from "./pages/ArtworkDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Workshops from "./pages/Workshops";
import Commissions from "./pages/Commissions";
import VendorDashboard from "./pages/VendorDashboard";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ArtistProfile from "./pages/ArtistProfile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import HelpSupport from "./pages/HelpSupport";
import AddProduct from "./pages/AddProduct";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/products" element={<AddProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
