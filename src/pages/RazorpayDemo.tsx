import { useState } from "react";
import { ArrowLeft, CreditCard, Smartphone, Banknote, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const RazorpayDemo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { processPayment, isProcessing } = useRazorpay();
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const handlePayment = (amount: number) => {
    if (!user) {
      toast.error("Please sign in to test payments");
      navigate("/auth");
      return;
    }

    processPayment(
      {
        amount,
        description: `Razorpay Demo Payment - ${formatPrice(amount)}`
      },
      (response) => {
        toast.success("Demo Payment Successful! 🎉", {
          description: `Payment ID: ${response.razorpay_payment_id}`
        });
        navigate(`/payment-success?payment_id=${response.razorpay_payment_id}&amount=${amount}`);
      },
      () => {
        toast.error("Payment cancelled or failed");
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 mx-auto max-w-lg">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">Razorpay Demo</h1>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-6">
        {/* Demo Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-secondary/20 bg-secondary/5 p-4"
        >
          <h2 className="font-display text-lg font-bold text-secondary mb-2">🚀 Razorpay Integration Demo</h2>
          <p className="text-sm text-muted-foreground mb-3">
            This is a fully functional Razorpay payment integration in test mode. No real money will be charged.
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• <strong>Test Cards:</strong> 4111 1111 1111 1111 (CVV: 123, Expiry: Any future date)</p>
            <p>• <strong>UPI:</strong> success@razorpay (for successful payment)</p>
            <p>• <strong>Net Banking:</strong> Select any bank and use "success" as password</p>
            <p>• <strong>Wallets:</strong> Use any test credentials</p>
          </div>
          
          {/* Debug Info */}
          <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
            <p><strong>Debug:</strong> Key ID: {import.meta.env.VITE_RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Missing'}</p>
          </div>
        </motion.div>

        {/* Amount Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <h3 className="font-display text-base font-bold text-foreground mb-4">Select Amount</h3>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`rounded-lg border p-3 text-sm font-semibold transition-all ${
                  selectedAmount === amount
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-muted-foreground"
                }`}
              >
                {formatPrice(amount)}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Custom Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                if (e.target.value) {
                  setSelectedAmount(parseInt(e.target.value) || 0);
                }
              }}
              className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
            />
          </div>
        </motion.div>

        {/* Payment Methods Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <h3 className="font-display text-base font-bold text-foreground mb-4">Supported Payment Methods</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CreditCard, label: "Cards", desc: "Visa, Mastercard, RuPay" },
              { icon: Smartphone, label: "UPI", desc: "GPay, PhonePe, Paytm" },
              { icon: Banknote, label: "Net Banking", desc: "All major banks" },
              { icon: Zap, label: "Wallets", desc: "Paytm, Mobikwik, etc." },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10">
                  <Icon className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-4"
        >
          <h3 className="font-display text-base font-bold text-foreground mb-3">Integration Features</h3>
          
          <div className="space-y-2">
            {[
              "✅ Secure payment processing with Razorpay",
              "✅ Multiple payment methods support",
              "✅ Real-time payment status updates",
              "✅ Automatic order creation on success",
              "✅ Error handling and user feedback",
              "✅ Mobile-optimized payment flow",
              "✅ Test mode for safe development",
            ].map((feature, index) => (
              <p key={index} className="text-sm text-muted-foreground">{feature}</p>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Payment Button */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg p-4">
        <div className="mx-auto max-w-lg">
          <button
            onClick={() => handlePayment(selectedAmount)}
            disabled={isProcessing || selectedAmount <= 0}
            className="w-full rounded-xl bg-gradient-burgundy py-4 text-sm font-bold text-primary-foreground shadow-gold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Pay {formatPrice(selectedAmount)} with Razorpay
              </>
            )}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default RazorpayDemo;