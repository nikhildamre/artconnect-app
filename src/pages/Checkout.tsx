import { useState } from "react";
import { ArrowLeft, MapPin, CreditCard, Truck, Shield, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = 63500;
  const shipping = 0;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
      toast.error("Please fill in all required address fields");
      return;
    }
    toast.success("Order placed successfully! 🎉", {
      description: "You will receive a confirmation email shortly.",
    });
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">Checkout</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-4">
        {/* Shipping Address */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-secondary" />
            <h3 className="font-display text-sm font-bold text-foreground">Shipping Address</h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
              />
              <input
                type="tel"
                placeholder="Phone *"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
              />
            </div>
            <input
              type="text"
              placeholder="Address Line 1 *"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
            />
            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="City *"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
              />
              <input
                type="text"
                placeholder="PIN *"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-secondary" />
            <h3 className="font-display text-sm font-bold text-foreground">Payment Method</h3>
          </div>
          <div className="space-y-2">
            {[
              { id: "upi", label: "UPI (Google Pay, PhonePe)", desc: "Instant payment" },
              { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
              { id: "netbanking", label: "Net Banking", desc: "All major banks" },
              { id: "cod", label: "Cash on Delivery", desc: "+₹49 handling fee" },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all ${
                  paymentMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id ? "border-primary" : "border-muted-foreground"
                  }`}
                >
                  {paymentMethod === method.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{method.label}</p>
                  <p className="text-xs text-muted-foreground">{method.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-4 space-y-2.5">
          <h3 className="font-display text-sm font-bold text-foreground">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal (2 items)</span>
            <span className="text-foreground">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-secondary font-medium">FREE</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST (18%)</span>
            <span className="text-foreground">{formatPrice(tax)}</span>
          </div>
          {paymentMethod === "cod" && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">COD Fee</span>
              <span className="text-foreground">₹49</span>
            </div>
          )}
          <div className="border-t border-border pt-2.5 flex justify-between">
            <span className="font-display text-sm font-bold text-foreground">Total</span>
            <span className="font-display text-lg font-bold text-foreground">
              {formatPrice(total + (paymentMethod === "cod" ? 49 : 0))}
            </span>
          </div>
        </motion.div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-secondary" />
            <span className="text-xs text-muted-foreground">Free Shipping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-secondary" />
            <span className="text-xs text-muted-foreground">Secure Payment</span>
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg p-4">
        <div className="mx-auto max-w-lg">
          <button
            onClick={handlePlaceOrder}
            className="w-full rounded-xl bg-gradient-burgundy py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Place Order • {formatPrice(total + (paymentMethod === "cod" ? 49 : 0))}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Checkout;
