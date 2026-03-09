import { User, Settings, Package, CreditCard, HelpCircle, LogOut, ChevronRight, Palette, BookOpen, Store, Bell, Award, Shield, PaintBucket, Edit3 } from "lucide-react";
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
    { icon: CreditCard, label: "Payment Methods", desc: "Saved cards & UPI", path: "/payment-methods" },
    { icon: Settings, label: "Settings", desc: "Language, notifications, privacy", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact us", path: "/help" },
  ];

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await signOut();
      toast.success("Signed out successfully");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-xl safe-area-top">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
          
          {user && (
            <button
              onClick={() => navigate("/profile/edit")}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <Edit3 className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">Edit</span>
            </button>
          )}
        </div>
      </header>

      <main>
        {/* Profile Header */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border-2 border-border shadow-lg overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              {user && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {user ? (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {profile?.display_name || user.user_metadata?.display_name || "Art Enthusiast"}
                  </h2>
                  {profile?.username && (
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {profile?.location && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <span>📍</span> {profile.location}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h2 className="font-display text-xl font-bold text-foreground">Welcome to ArtVpp</h2>
                  <p className="text-sm text-muted-foreground">Sign in to personalize your experience</p>
                </>
              )}
            </div>
          </div>

          {profile?.bio && (
            <div className="mb-4 p-4 rounded-xl bg-card border border-border">
              <p className="text-sm text-foreground">{profile.bio}</p>
            </div>
          )}

          {profile?.interests && profile.interests.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.slice(0, 4).map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
                {profile.interests.length > 4 && (
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                    +{profile.interests.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {!user && (
          <div className="px-4 pb-6">
            <button 
              onClick={() => navigate("/auth")} 
              className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            >
              Sign In / Create Account
            </button>
          </div>
        )}

        {user && (
          <div className="px-4 pb-4">
            <motion.div 
              whileTap={{ scale: 0.98 }} 
              className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3 shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground">Refer & Earn ₹100</h3>
                <p className="text-xs text-muted-foreground">Invite friends and earn credits on every purchase</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </div>
        )}

        <div className="px-4 space-y-2">
          {menuItems.map(({ icon: Icon, label, desc, path }, index) => (
            <motion.button
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => path && navigate(path)}
              className="flex w-full items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-card active:scale-[0.99] border border-transparent hover:border-border"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-foreground block">{label}</span>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        {user && (
          <div className="px-4 pt-6 pb-8">
            <button 
              onClick={handleSignOut} 
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-destructive hover:border-destructive hover:bg-destructive/5 active:scale-[0.99]"
            >
              <LogOut className="h-4 w-4" /> 
              Sign Out
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;