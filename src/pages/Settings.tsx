import { ArrowLeft, Bell, BellOff, Globe, Moon, Sun, Shield, Trash2, ChevronRight, User, CreditCard, MapPin, Lock, LogOut, Download, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: true,
    priceDrops: true,
    workshops: false,
    newArtworks: true,
    commissions: true,
  });
  const [language, setLanguage] = useState("English");

  const toggleNotification = (key: keyof typeof notifications) => {
    if (!user) {
      toast.error("Please sign in to manage notifications");
      navigate("/auth");
      return;
    }
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (confirm("Are you sure you want to logout?")) {
      // Handle logout logic here
      navigate("/auth");
    }
  };

  const handleDeleteAccount = () => {
    if (!user) {
      toast.error("Please sign in to delete your account");
      navigate("/auth");
      return;
    }
    
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Handle account deletion logic here
      alert("Account deletion request submitted. You will receive a confirmation email.");
    }
  };

  const handleProtectedNavigation = (path: string) => {
    if (!user) {
      toast.error("Please sign in to access this feature");
      navigate("/auth");
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="rounded-full bg-secondary/50 p-2 hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your preferences</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-6 space-y-8">
        {/* Account Section */}
        {user ? (
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">Account</h3>
            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
              <button 
                onClick={() => navigate("/profile/edit")}
                className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-foreground block">Profile Information</span>
                    <span className="text-xs text-muted-foreground">Update your personal details</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              
              <button 
                onClick={() => handleProtectedNavigation("/payment-methods")}
                className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-foreground block">Payment Methods</span>
                    <span className="text-xs text-muted-foreground">Manage cards and UPI</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button 
                onClick={() => navigate("/settings/addresses")}
                className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-foreground block">Addresses</span>
                    <span className="text-xs text-muted-foreground">Manage delivery addresses</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </section>
        ) : (
          <section>
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Sign In Required</h3>
              <p className="text-sm text-muted-foreground mb-4">Sign in to access account settings and manage your profile</p>
              <button
                onClick={() => navigate("/auth")}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Sign In
              </button>
            </div>
          </section>
        )}

        {/* Preferences */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">Preferences</h3>
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground block">Dark Mode</span>
                  <span className="text-xs text-muted-foreground">Switch between light and dark theme</span>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-muted"}`}>
                <div className={`w-5 h-5 rounded-full bg-background shadow-sm transform transition-transform mt-0.5 ${darkMode ? "translate-x-6 ml-0.5" : "translate-x-0.5"}`} />
              </div>
            </button>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground block">Language</span>
                  <span className="text-xs text-muted-foreground">Choose your preferred language</span>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm text-foreground outline-none border border-border rounded-lg px-3 py-1"
              >
                <option value="English">English</option>
                <option value="Hindi">हिन्दी</option>
                <option value="Tamil">தமிழ்</option>
                <option value="Telugu">తెలుగు</option>
                <option value="Bengali">বাংলা</option>
                <option value="Marathi">मराठी</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        {user ? (
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">Notifications</h3>
            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
              {Object.entries(notifications).map(([key, enabled]) => (
                <button
                  key={key}
                  onClick={() => toggleNotification(key as keyof typeof notifications)}
                  className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {enabled ? (
                      <Bell className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <BellOff className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div className="text-left">
                      <span className="text-sm font-medium text-foreground block capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {key === 'orders' && 'Order updates and delivery notifications'}
                        {key === 'promotions' && 'Special offers and discounts'}
                        {key === 'priceDrops' && 'Price alerts on wishlist items'}
                        {key === 'workshops' && 'New workshop announcements'}
                        {key === 'newArtworks' && 'Latest artwork additions'}
                        {key === 'commissions' && 'Commission request updates'}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-5 h-5 rounded-full bg-background shadow-sm transform transition-transform mt-0.5 ${enabled ? "translate-x-6 ml-0.5" : "translate-x-0.5"}`} />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {/* Privacy & Security */}
        {user ? (
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">Privacy & Security</h3>
            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
              <button 
                onClick={() => navigate("/settings/change-password")}
                className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-foreground block">Change Password</span>
                    <span className="text-xs text-muted-foreground">Update your account password</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-foreground block">Privacy Policy</span>
                    <span className="text-xs text-muted-foreground">How we handle your data</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-foreground block">Terms of Service</span>
                    <span className="text-xs text-muted-foreground">Our terms and conditions</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <button 
                onClick={() => handleProtectedNavigation("/settings/download-data")}
                className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-muted-foreground" />
                  <div className="text-left">
                    <span className="text-sm font-medium text-foreground block">Download Data</span>
                    <span className="text-xs text-muted-foreground">Export your account data</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </section>
        ) : null}

        {/* About */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">About</h3>
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            <button 
              onClick={() => navigate("/help")}
              className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground block">Help & Support</span>
                  <span className="text-xs text-muted-foreground">Get help and contact support</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">v</span>
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground block">App Version</span>
                  <span className="text-xs text-muted-foreground">1.2.0 (Latest)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Actions */}
        {user ? (
          <section className="pb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <LogOut className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Logout</span>
              </button>

              <button 
                onClick={handleDeleteAccount}
                className="flex w-full items-center gap-3 p-4 rounded-2xl border border-destructive/30 bg-card text-destructive hover:bg-destructive/5 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
                <span className="text-sm font-medium">Delete Account</span>
              </button>
            </div>
          </section>
        ) : null}
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
