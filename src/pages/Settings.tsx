import { ArrowLeft, Bell, BellOff, Globe, Moon, Sun, Shield, Trash2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: true,
    priceDrops: true,
    workshops: false,
  });
  const [language, setLanguage] = useState("English");

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">Settings</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-6">
        {/* Appearance */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">Appearance</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-4.5 w-4.5 text-muted-foreground" /> : <Sun className="h-4.5 w-4.5 text-muted-foreground" />}
                <span className="text-sm font-medium text-foreground">Dark Mode</span>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-muted"}`}>
                <div className={`w-5 h-5 rounded-full bg-background shadow-sm transform transition-transform mt-0.5 ${darkMode ? "translate-x-4.5 ml-0.5" : "translate-x-0.5"}`} />
              </div>
            </button>
          </div>
        </section>

        {/* Language */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">Language</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-4.5 w-4.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm text-muted-foreground outline-none"
              >
                <option>English</option>
                <option>हिन्दी</option>
                <option>தமிழ்</option>
                <option>తెలుగు</option>
                <option>বাংলা</option>
                <option>मराठी</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">Notifications</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
            {Object.entries(notifications).map(([key, enabled]) => (
              <button
                key={key}
                onClick={() => toggleNotification(key as keyof typeof notifications)}
                className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {enabled ? (
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <BellOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}>
                  <div className={`w-5 h-5 rounded-full bg-background shadow-sm transform transition-transform mt-0.5 ${enabled ? "translate-x-4.5 ml-0.5" : "translate-x-0.5"}`} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">Privacy & Security</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border">
            <button className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Privacy Policy</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Terms of Service</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pb-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-1">Account</h3>
          <div className="rounded-xl border border-destructive/30 bg-card overflow-hidden">
            <button className="flex w-full items-center gap-3 p-4 text-destructive hover:bg-destructive/5 transition-colors">
              <Trash2 className="h-4 w-4" />
              <span className="text-sm font-medium">Delete Account</span>
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
