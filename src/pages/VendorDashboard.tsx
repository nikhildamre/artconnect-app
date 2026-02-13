import { useState } from "react";
import { Package, TrendingUp, DollarSign, ShoppingBag, Plus, BarChart3, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";

const stats = [
  { label: "Total Sales", value: "₹2,45,000", icon: DollarSign, change: "+12%" },
  { label: "Orders", value: "34", icon: ShoppingBag, change: "+5%" },
  { label: "Products", value: "12", icon: Package, change: "+2" },
  { label: "Followers", value: "1,240", icon: Users, change: "+89" },
];

const recentOrders = [
  { id: "ORD001", product: "Crimson Birds of Madhubani", buyer: "Rahul S.", amount: 18500, status: "shipped" },
  { id: "ORD002", product: "Sacred Traditions", buyer: "Anita K.", amount: 95000, status: "processing" },
  { id: "ORD003", product: "Harvest Dance", buyer: "Vikram D.", amount: 12000, status: "delivered" },
];

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2">
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </button>
            <h1 className="font-display text-lg font-bold text-foreground">Vendor Dashboard</h1>
          </div>
          <button className="flex items-center gap-1 rounded-full bg-gradient-burgundy px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> Add Product
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-3.5"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-medium text-green-600 bg-green-50 rounded-full px-1.5 py-0.5">
                  {stat.change}
                </span>
              </div>
              <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-bold text-foreground">Revenue Trend</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-1 h-24">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-burgundy rounded-t opacity-70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">Jan</span>
            <span className="text-[10px] text-muted-foreground">Dec</span>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h3 className="font-display text-sm font-bold text-foreground mb-3">Recent Orders</h3>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{order.product}</p>
                  <p className="text-xs text-muted-foreground">{order.buyer} • {order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </p>
                  <span
                    className={`text-[10px] font-medium ${
                      order.status === "delivered"
                        ? "text-green-600"
                        : order.status === "shipped"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default VendorDashboard;
