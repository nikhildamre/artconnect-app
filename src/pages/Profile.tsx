import { User, Settings, Package, CreditCard, HelpCircle, LogOut, ChevronRight, Palette, BookOpen, Store, Bell, Award, Shield, PaintBucket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useIsAdmin, useIsVendor } from "@/hooks/useAdmin";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: isAdmin } = useIsAdmin();
  const { data: isVendor } = useIsVendor();

  const menuItems = [
    { icon: Package, label: "My Orders", desc: "Track and manage orders", path: "/orders" },
    ...(isVendor ? [{ icon: Store, label: "Vendor Dashboard", desc: "Manage your shop", path: "/vendor" }] : [{ icon: PaintBucket, label: "Become a Seller", desc: "Apply to sell your art", path: "/apply-seller" }]),
    ...(isAdmin ? [{ icon: Shield, label: "Admin Dashboard", desc: "Manage the platform", path: "/admin" }] : []),
    { icon: Palette, label: "Commission Art", desc: "Request custom artwork", path: "/commissions" },
    { icon: BookOpen, label: "Workshops", desc: "Learn from top artists", path: "/workshops" },
    { icon: Bell, label: "Notifications", desc: "Order updates & alerts", path: "/notifications" },
    { icon: CreditCard, label: "Payment Methods", desc: "Saved cards & UPI", path: "" },
    { icon: Settings, label: "Settings", desc: "Language, notifications, privacy", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact us", path: "/help" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl safe-area-top">
        <div className="px-4 py-3">
          <h1 className="font-display text-xl font-bold text-foreground">Profile</h1>
        </div>
      </header>

      <main>
        {/* Profile Header */}
        <div className="flex items-center gap-4 px-4 py-6">
          <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-burgundy shadow-elevated" style={{ width: 72, height: 72 }}>
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex-1">
            {user ? (
              <>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {profile?.display_name || user.user_metadata?.display_name || user.email}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {profile?.location && <p className="text-xs text-muted-foreground mt-0.5">{profile.location}</p>}
              </>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-foreground">Art Enthusiast</h2>
                <p className="text-sm text-muted-foreground">Sign in to personalize your experience</p>
              </>
            )}
          </div>
        </div>

        {!user && (
          <div className="px-4 pb-6">
            <button onClick={() => navigate("/auth")} className="w-full rounded-2xl bg-gradient-burgundy py-4 text-sm font-bold text-primary-foreground shadow-gold transition-transform hover:scale-[1.01] active:scale-[0.99]">
              Sign In / Create Account
            </button>
          </div>
        )}

        {user && (
          <div className="px-4 pb-4">
            <motion.div whileTap={{ scale: 0.98 }} className="rounded-2xl bg-gradient-gold p-4 flex items-center gap-3 shadow-gold cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/20">
                <Award className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Refer & Earn ₹100</h3>
                <p className="text-xs text-foreground/70">Invite friends and earn credits on every purchase</p>
              </div>
            </motion.div>
          </div>
        )}

        <div className="px-4 space-y-1">
          {menuItems.map(({ icon: Icon, label, desc, path }, index) => (
            <motion.button
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => path && navigate(path)}
              className="flex w-full items-center gap-3 rounded-2xl p-3.5 transition-colors hover:bg-card active:scale-[0.99]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-card border border-border shadow-art">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-foreground">{label}</span>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        {user && (
          <div className="px-4 pt-6 pb-4">
            <button onClick={handleSignOut} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-destructive hover:border-destructive active:scale-[0.99]">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;