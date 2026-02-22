import { useState } from "react";
import { ArrowLeft, MapPin, CreditCard, Truck, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useRazorpay } from "@/hooks/useRazorpay";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cartData } = useCart();
  const createOrder = useCreateOrder();
  const { processPayment, isProcessing } = useRazorpay();
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [address, setAddress] = useState({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });

  const cartItems = cartData?.items || [];
  const subtotal = cartItems.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 25000 ? 0 : 499;
  const tax = Math.round(subtotal * 0.18);
  const codFee = paymentMethod === "cod" ? 49 : 0;
  const total = subtotal + shipping + tax + codFee;

  const handlePlaceOrder = () => {
    if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
      toast.error("Please fill in all required address fields");
      return;
    }

    // If Razorpay payment is selected, initiate payment first
    if (paymentMethod === "razorpay") {
      const orderDescription = `ArtVpp Order - ${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`;
      
      processPayment(
        {
          amount: total,
          description: orderDescription
        },
        (paymentResponse) => {
          // Payment successful, now create the order
          createOrderWithPayment(paymentResponse);
        },
        () => {
          // Payment failed or cancelled
          toast.error("Payment was cancelled or failed");
        }
      );
    } else {
      // For COD, create order directly
      createOrderDirectly();
    }
  };

  const createOrderWithPayment = (paymentResponse: any) => {
    createOrder.mutate(
      {
        items: cartItems.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.products?.price || 0,
        })),
        subtotal,
        tax,
        shipping: shipping + codFee,
        total,
        shippingAddress: address,
        paymentMethod: "razorpay",
        paymentId: paymentResponse.razorpay_payment_id,
        paymentStatus: "completed"
      },
      {
        onSuccess: () => {
          toast.success("Order placed successfully! 🎉", { 
            description: "Payment completed. You will receive a confirmation email shortly." 
          });
          navigate("/orders");
        },
        onError: () => toast.error("Order creation failed. Please contact support."),
      }
    );
  };

  const createOrderDirectly = () => {
    createOrder.mutate(
      {
        items: cartItems.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.products?.price || 0,
        })),
        subtotal,
        tax,
        shipping: shipping + codFee,
        total,
        shippingAddress: address,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "completed"
      },
      {
        onSuccess: () => {
          toast.success("Order placed successfully! 🎉", { 
            description: "You will receive a confirmation email shortly." 
          });
          navigate("/orders");
        },
        onError: () => toast.error("Failed to place order. Please try again."),
      }
    );
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
          <h1 className="font-display text-lg font-bold text-foreground">Checkout</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3"><MapPin className="h-4 w-4 text-secondary" /><h3 className="font-display text-sm font-bold text-foreground">Shipping Address</h3></div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Full Name *" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all" />
              <input type="tel" placeholder="Phone *" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all" />
            </div>
            <input type="text" placeholder="Address Line 1 *" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all" />
            <input type="text" placeholder="Address Line 2 (Optional)" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all" />
            <div className="grid grid-cols-3 gap-3">
              <input type="text" placeholder="City *" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all" />
              <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all" />
              <input type="text" placeholder="PIN *" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary transition-all" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-secondary" />
              <h3 className="font-display text-sm font-bold text-foreground">Payment Method</h3>
            </div>
            <button
              onClick={() => navigate("/payment-methods")}
              className="text-xs font-semibold text-secondary hover:text-secondary/80 transition-colors"
            >
              Manage
            </button>
          </div>
          <div className="space-y-2">
            {[
              { id: "razorpay", label: "💳 Pay with Razorpay", desc: "UPI, Cards, Net Banking & More", recommended: true },
              { id: "cod", label: "💵 Cash on Delivery", desc: "+₹49 handling fee" },
            ].map((method) => (
              <button key={method.id} onClick={() => setPaymentMethod(method.id)} className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all relative ${paymentMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`}>
                {method.recommended && (
                  <div className="absolute -top-2 -right-2 bg-gradient-gold text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? "border-primary" : "border-muted-foreground"}`}>
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-4 space-y-2.5">
          <h3 className="font-display text-sm font-bold text-foreground">Order Summary</h3>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span><span className="text-foreground">{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-secondary font-medium" : "text-foreground"}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (18%)</span><span className="text-foreground">{formatPrice(tax)}</span></div>
          {codFee > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">COD Fee</span><span className="text-foreground">₹49</span></div>}
          <div className="border-t border-border pt-2.5 flex justify-between">
            <span className="font-display text-sm font-bold text-foreground">Total</span>
            <span className="font-display text-lg font-bold text-foreground">{formatPrice(total)}</span>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-6 py-2">
          <div className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-secondary" /><span className="text-xs text-muted-foreground">Free Shipping</span></div>
          <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-secondary" /><span className="text-xs text-muted-foreground">Secure Payment</span></div>
        </div>

        {/* Razorpay Demo Info */}
        {paymentMethod === "razorpay" && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            className="rounded-xl border border-secondary/20 bg-secondary/5 p-4"
          >
            <h4 className="font-display text-sm font-bold text-secondary mb-2">🚀 Demo Payment Info</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>• This is a <strong>demo integration</strong> with Razorpay test mode</p>
              <p>• Use test cards: <strong>4111 1111 1111 1111</strong> (any CVV/expiry)</p>
              <p>• UPI: Use <strong>success@razorpay</strong> for successful payment</p>
              <p>• No real money will be charged</p>
            </div>
          </motion.div>
        )}
      </main>

      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg p-4">
        <div className="mx-auto max-w-lg">
          <button 
            onClick={handlePlaceOrder} 
            disabled={createOrder.isPending || isProcessing} 
            className="w-full rounded-xl bg-gradient-burgundy py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Processing Payment...
              </>
            ) : createOrder.isPending ? (
              "Placing Order..."
            ) : paymentMethod === "razorpay" ? (
              `Pay ${formatPrice(total)} with Razorpay`
            ) : (
              `Place Order • ${formatPrice(total)}`
            )}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Checkout;
