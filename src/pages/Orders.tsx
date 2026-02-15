import { Package, ArrowLeft, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { useImageForArtwork } from "@/hooks/useArtworkImages";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const statusConfig: Record<string, { icon: typeof Truck; label: string; className: string }> = {
  pending: { icon: Clock, label: "Pending", className: "text-yellow-600 bg-yellow-50" },
  processing: { icon: Clock, label: "Processing", className: "text-yellow-600 bg-yellow-50" },
  shipped: { icon: Truck, label: "Shipped", className: "text-blue-600 bg-blue-50" },
  delivered: { icon: CheckCircle2, label: "Delivered", className: "text-green-600 bg-green-50" },
  cancelled: { icon: XCircle, label: "Cancelled", className: "text-destructive bg-destructive/10" },
};

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: orders, isLoading } = useOrders();

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
            <h1 className="font-display text-lg font-bold text-foreground">My Orders</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground">Sign in to view orders</h2>
          <button onClick={() => navigate("/auth")} className="mt-4 rounded-full bg-gradient-burgundy px-6 py-2.5 text-sm font-semibold text-primary-foreground">Sign In</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
          <h1 className="font-display text-lg font-bold text-foreground">My Orders</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-3 pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : orders && orders.length > 0 ? (
          orders.map((order, i) => {
            const config = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const orderItems = (order as any).order_items || [];
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground font-mono">{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</p>
                  </div>
                  <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {orderItems.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.products?.title || "Product"}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-foreground">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                  <span className="text-sm font-bold text-foreground">Total: {formatPrice(order.total)}</span>
                  {order.tracking_number && (
                    <button className="text-xs font-medium text-secondary hover:underline">Track Order</button>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-bold text-foreground">No orders yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your order history will appear here</p>
            <button onClick={() => navigate("/browse")} className="mt-4 rounded-full bg-gradient-burgundy px-6 py-2.5 text-sm font-semibold text-primary-foreground">Browse Artworks</button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Orders;
