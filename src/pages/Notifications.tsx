import { ArrowLeft, Bell, Package, Heart, Tag, Star, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const mockNotifications = [
  {
    id: "1",
    type: "order",
    icon: Package,
    title: "Order Shipped!",
    message: "Your order ORD-2026-001 has been shipped and is on its way.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "promo",
    icon: Tag,
    title: "Weekend Sale 🎉",
    message: "Get 20% off on all Madhubani paintings this weekend!",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "wishlist",
    icon: Heart,
    title: "Price Drop Alert",
    message: "Sacred Traditions by Lakshmi Nair is now ₹85,000 (was ₹95,000).",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "review",
    icon: Star,
    title: "Review Request",
    message: "How was Harvest Dance by Meera Patil? Share your experience.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "message",
    icon: MessageCircle,
    title: "New Message from Priya Sharma",
    message: "Hi! I'd love to discuss your commission request...",
    time: "3 days ago",
    read: true,
  },
];

const Notifications = () => {
  const navigate = useNavigate();
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </button>
            <h1 className="font-display text-lg font-bold text-foreground">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <button className="text-xs font-medium text-secondary">Mark all read</button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-lg">
        {mockNotifications.map((notification, i) => {
          const Icon = notification.icon;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex gap-3 border-b border-border px-4 py-4 cursor-pointer hover:bg-card transition-colors ${
                !notification.read ? "bg-primary/5" : ""
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                !notification.read ? "bg-primary/10" : "bg-muted"
              }`}>
                <Icon className={`h-4.5 w-4.5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{notification.message}</p>
                <span className="text-[10px] text-muted-foreground mt-1 block">{notification.time}</span>
              </div>
            </motion.div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};

export default Notifications;
