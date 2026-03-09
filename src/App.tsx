import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import ArtworkDetail from "./pages/ArtworkDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import ChangePassword from "./pages/ChangePassword";
import Addresses from "./pages/Addresses";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Workshops from "./pages/Workshops";
import Commissions from "./pages/Commissions";
import Services from "./pages/Services";
import StudioRentals from "./pages/StudioRentals";
import Calligraphy from "./pages/Calligraphy";
import VendorDashboard from "./pages/VendorDashboard";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import ArtistProfile from "./pages/ArtistProfile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import HelpSupport from "./pages/HelpSupport";
import AddProduct from "./pages/AddProduct";
import ApplySeller from "./pages/ApplySeller";
import AdminDashboard from "./pages/AdminDashboard";
import Install from "./pages/Install";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentMethods from "./pages/PaymentMethods";
import RazorpayDemo from "./pages/RazorpayDemo";
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
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/settings/change-password" element={<ChangePassword />} />
            <Route path="/settings/addresses" element={<Addresses />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/services" element={<Services />} />
            <Route path="/studio-rentals" element={<StudioRentals />} />
            <Route path="/calligraphy" element={<Calligraphy />} />
            <Route path="/apply-seller" element={<ApplySeller />} />
            <Route path="/vendor" element={<ProtectedRoute requiredRole="vendor"><VendorDashboard /></ProtectedRoute>} />
            <Route path="/vendor/products" element={<ProtectedRoute requiredRole="vendor"><AddProduct /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/install" element={<Install />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/razorpay-demo" element={<RazorpayDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
