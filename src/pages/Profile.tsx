import { User, Settings, Package, CreditCard, HelpCircle, LogOut, ChevronRight, Palette, BookOpen, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { icon: Package, label: "My Orders", desc: "Track and manage orders", path: "" },
  { icon: Store, label: "Vendor Dashboard", desc: "Manage your shop", path: "/vendor" },
  { icon: Palette, label: "Commission Art", desc: "Request custom artwork", path: "/commissions" },
  { icon: BookOpen, label: "Workshops", desc: "Learn from top artists", path: "/workshops" },
  { icon: CreditCard, label: "Payment Methods", desc: "Saved cards & UPI", path: "" },
  { icon: Settings, label: "Settings", desc: "Notifications, language, privacy", path: "" },
  { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact us", path: "" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3">
          <h1 className="font-display text-lg font-bold text-foreground">Profile</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg">
        {/* Avatar & Info */}
        <div className="flex items-center gap-4 px-4 py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-burgundy">
            <User className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            {user ? (
              <>
                <h2 className="font-display text-lg font-bold text-foreground">
                  {user.user_metadata?.display_name || user.email}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </>
            ) : (
              <>
                <h2 className="font-display text-lg font-bold text-foreground">Art Enthusiast</h2>
                <p className="text-sm text-muted-foreground">Sign in to personalize your experience</p>
              </>
            )}
          </div>
        </div>

        {/* Sign in CTA or welcome */}
        {!user && (
          <div className="px-4 pb-6">
            <button
              onClick={() => navigate("/auth")}
              className="w-full rounded-xl bg-gradient-burgundy py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.01]"
            >
              Sign In / Create Account
            </button>
          </div>
        )}

        {/* Menu */}
        <div className="px-4 space-y-1">
          {menuItems.map(({ icon: Icon, label, desc, path }) => (
            <button
              key={label}
              onClick={() => path && navigate(path)}
              className="flex w-full items-center gap-3 rounded-xl p-3 transition-colors hover:bg-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-border">
                <Icon className="h-4.5 w-4.5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        {user && (
          <div className="px-4 pt-6 pb-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive hover:border-destructive"
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
