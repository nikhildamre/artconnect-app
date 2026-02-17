import { useState, useEffect } from "react";
import { Download, Share, Smartphone, Monitor, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import BottomNav from "@/components/BottomNav";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    "Browse & buy authentic Indian art",
    "Works offline — view saved artworks anytime",
    "Fast, native app-like experience",
    "Push notifications for new artworks & offers",
    "No app store download needed",
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2 text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">Install Kalavapp</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-6 rounded-2xl bg-gradient-gold p-4 shadow-gold">
            <img src={logo} alt="Kalavapp" className="h-20 w-20 object-contain" />
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground">Get the Kalavapp App</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Install Kalavapp on your phone for a faster, app-like experience — works on Android & iPhone!
          </p>
        </motion.div>

        {isInstalled ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 rounded-2xl bg-card border border-border p-6 text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-secondary">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">Already Installed!</h3>
            <p className="mt-1 text-sm text-muted-foreground">Kalavapp is installed on your device. Enjoy the app!</p>
          </motion.div>
        ) : (
          <>
            {/* Android / Chrome install button */}
            {deferredPrompt && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                <button
                  onClick={handleInstall}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-burgundy px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="h-5 w-5" />
                  Install Kalavapp
                </button>
              </motion.div>
            )}

            {/* iOS instructions */}
            {isIOS && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl bg-card border border-border p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-base font-bold text-foreground">Install on iPhone / iPad</h3>
                </div>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                    <span>Tap the <Share className="inline h-4 w-4 text-primary" /> <strong>Share</strong> button in Safari</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
                    <span>Tap <strong>"Add"</strong> — that's it!</span>
                  </li>
                </ol>
              </motion.div>
            )}

            {/* Generic instructions for desktop / other */}
            {!isIOS && !deferredPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl bg-card border border-border p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-base font-bold text-foreground">Install from Browser</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Look for the install icon <Download className="inline h-4 w-4" /> in your browser's address bar, or open the browser menu and select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-3"
        >
          <h3 className="font-display text-base font-bold text-foreground">Why Install?</h3>
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3">
              <Check className="h-4 w-4 shrink-0 text-secondary" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Install;
