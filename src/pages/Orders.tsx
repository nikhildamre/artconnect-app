import { Package, ArrowLeft, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const mockOrders = [
  {
    id: "ORD-2026-001",
    date: "Feb 10, 2026",
    total: 63500,
    status: "shipped",
    items: [
      { title: "Crimson Birds of Madhubani", artist: "Priya Sharma", price: 18500 },
      { title: "Royal Court of Jaipur", artist: "Ananya Gupta", price: 45000 },
    ],
    tracking: "DELHVR2026XYZ",
  },
  {
    id: "ORD-2026-002",
    date: "Feb 5, 2026",
    total: 12000,
    status: "delivered",
    items: [{ title: "Harvest Dance", artist: "Meera Patil", price: 12000 }],
    tracking: "DELHVR2026ABC",
  },
  {
    id: "ORD-2026-003",
    date: "Jan 28, 2026",
    total: 95000,
    status: "processing",
    items: [{ title: "Sacred Traditions", artist: "Lakshmi Nair", price: 95000 }],
    tracking: null,
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const statusConfig: Record<string, { icon: typeof Truck; label: string; className: string }> = {
  processing: { icon: Clock, label: "Processing", className: "text-yellow-600 bg-yellow-50" },
  shipped: { icon: Truck, label: "Shipped", className: "text-blue-600 bg-blue-50" },
  delivered: { icon: CheckCircle2, label: "Delivered", className: "text-green-600 bg-green-50" },
  cancelled: { icon: XCircle, label: "Cancelled", className: "text-destructive bg-destructive/10" },
};

const Orders = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">My Orders</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-3 pb-6">
        {mockOrders.map((order, i) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </div>
              </div>

              {/* Items */}
              <div className="p-4 space-y-2">
                {order.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.artist}</p>
                    </div>
                    <span className="text-sm font-bold text-foreground">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                <span className="text-sm font-bold text-foreground">Total: {formatPrice(order.total)}</span>
                {order.tracking && (
                  <button className="text-xs font-medium text-secondary hover:underline">
                    Track Order
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};

export default Orders;
