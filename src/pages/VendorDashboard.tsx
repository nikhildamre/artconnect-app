import { useState } from "react";
import { Package, DollarSign, ShoppingBag, Plus, BarChart3, Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useVendorProducts } from "@/hooks/useProfile";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: products, isLoading } = useVendorProducts();

  const totalProducts = products?.length || 0;

  const stats = [
    { label: "Total Sales", value: "₹0", icon: DollarSign, change: "New" },
    { label: "Orders", value: "0", icon: ShoppingBag, change: "New" },
    { label: "Products", value: String(totalProducts), icon: Package, change: `${totalProducts} listed` },
    { label: "Followers", value: "0", icon: Users, change: "New" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
            <h1 className="font-display text-lg font-bold text-foreground">Vendor Dashboard</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <h2 className="font-display text-xl font-bold text-foreground">Sign in to access your dashboard</h2>
          <button onClick={() => navigate("/auth")} className="mt-4 rounded-full bg-gradient-burgundy px-6 py-2.5 text-sm font-semibold text-primary-foreground">Sign In</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
            <h1 className="font-display text-lg font-bold text-foreground">Vendor Dashboard</h1>
          </div>
          <button onClick={() => navigate("/vendor/products")} className="flex items-center gap-1 rounded-full bg-gradient-burgundy px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> Add Product
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="rounded-xl border border-border bg-card p-3.5">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-medium text-secondary bg-secondary/10 rounded-full px-1.5 py-0.5">{stat.change}</span>
              </div>
              <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-bold text-foreground">Revenue Trend</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-1 h-24">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-burgundy rounded-t opacity-70" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">Jan</span>
            <span className="text-[10px] text-muted-foreground">Dec</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
        ) : products && products.length > 0 ? (
          <div>
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Your Products</h3>
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{product.title}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(product.price)} • Stock: {product.inventory}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No products yet. Add your first product!</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default VendorDashboard;
