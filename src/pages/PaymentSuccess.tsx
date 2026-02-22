import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const orderId = searchParams.get("order_id");
  const amount = searchParams.get("amount");

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const formatPrice = (price: string | null) => {
    if (!price) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(parseInt(price));
  };

  return (
    <div className="min-h-screen bg-background pb-20 mx-auto max-w-lg">
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center min-h-screen">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <h1 className="font-display text-2xl font-bold text-foreground">
            Payment Successful! 🎉
          </h1>
          <p className="text-muted-foreground">
            Your order has been placed successfully and payment has been confirmed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm space-y-4 mb-8"
        >
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground">Payment Details</h3>
            
            {paymentId && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="text-foreground font-mono text-xs">{paymentId}</span>
              </div>
            )}
            
            {orderId && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID</span>
                <span className="text-foreground font-mono text-xs">{orderId}</span>
              </div>
            )}
            
            {amount && (
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-display text-lg font-bold text-foreground">
                  {formatPrice(amount)}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="font-display text-sm font-bold text-foreground mb-2">What's Next?</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• You'll receive an order confirmation email shortly</li>
              <li>• Your artwork will be carefully packaged and shipped</li>
              <li>• Track your order in the Orders section</li>
              <li>• Estimated delivery: 5-7 business days</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3 w-full max-w-sm"
        >
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-burgundy py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02]"
          >
            View My Orders <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              <Download className="h-4 w-4" />
              Download Receipt
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground mt-8"
        >
          Redirecting to orders in 10 seconds...
        </motion.p>
      </div>

      <BottomNav />
    </div>
  );
};

export default PaymentSuccess;