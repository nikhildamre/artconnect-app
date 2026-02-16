import { useState } from "react";
import { ArrowLeft, LayoutDashboard, Users, Package, ShoppingBag, FileCheck, BarChart3, CheckCircle2, XCircle, Clock, Eye, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAllSellerApplications,
  useAllProducts,
  useAllOrders,
  useAllSellers,
  useApproveSellerApplication,
  useRejectSellerApplication,
  useModerateProduct,
} from "@/hooks/useAdmin";
import { toast } from "sonner";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

type Tab = "overview" | "applications" | "moderation" | "sellers" | "orders";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [rejectModal, setRejectModal] = useState<{ id: string; reason: string } | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{ id: string; feedback: string; action: "approved" | "rejected" } | null>(null);

  const { data: applications = [] } = useAllSellerApplications();
  const { data: allProducts = [] } = useAllProducts();
  const { data: allOrders = [] } = useAllOrders();
  const { data: allSellers = [] } = useAllSellers();
  const approveApp = useApproveSellerApplication();
  const rejectApp = useRejectSellerApplication();
  const moderateProduct = useModerateProduct();

  const pendingApps = applications.filter((a) => a.status === "pending");
  const pendingProducts = allProducts.filter((p) => p.moderation_status === "pending");
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const tabs: { key: Tab; label: string; icon: typeof LayoutDashboard; count?: number }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "applications", label: "Applications", icon: FileCheck, count: pendingApps.length },
    { key: "moderation", label: "Artworks", icon: Package, count: pendingProducts.length },
    { key: "sellers", label: "Sellers", icon: Users },
    { key: "orders", label: "Orders", icon: ShoppingBag },
  ];

  const handleApproveApp = async (id: string) => {
    try {
      await approveApp.mutateAsync(id);
      toast.success("Seller approved!");
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleRejectApp = async () => {
    if (!rejectModal) return;
    try {
      await rejectApp.mutateAsync({ applicationId: rejectModal.id, reason: rejectModal.reason });
      toast.success("Application rejected");
      setRejectModal(null);
    } catch {
      toast.error("Failed to reject");
    }
  };

  const handleModerateProduct = async () => {
    if (!feedbackModal) return;
    try {
      await moderateProduct.mutateAsync({
        productId: feedbackModal.id,
        status: feedbackModal.action,
        feedback: feedbackModal.feedback,
      });
      toast.success(`Artwork ${feedbackModal.action}!`);
      setFeedbackModal(null);
    } catch {
      toast.error("Failed to moderate");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
          <h1 className="font-display text-lg font-bold text-foreground">Admin Dashboard</h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
              {tab.count ? <span className="ml-1 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] text-destructive-foreground">{tab.count}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-4">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Revenue", value: formatPrice(totalRevenue), icon: BarChart3 },
                { label: "Sellers", value: String(allSellers.length), icon: Users },
                { label: "Pending Apps", value: String(pendingApps.length), icon: FileCheck },
                { label: "Pending Art", value: String(pendingProducts.length), icon: Package },
              ].map((stat) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-3.5">
                  <stat.icon className="h-4 w-4 text-muted-foreground mb-2" />
                  <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-display text-sm font-bold text-foreground mb-3">Recent Orders</h3>
              {allOrders.length === 0 ? (
                <p className="text-xs text-muted-foreground">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {allOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg bg-background p-2.5">
                      <div>
                        <p className="text-xs font-medium text-foreground">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-foreground">{formatPrice(order.total)}</p>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${order.status === "delivered" ? "bg-green-100 text-green-700" : order.status === "pending" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Seller Applications */}
        {activeTab === "applications" && (
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground">Seller Applications ({applications.length})</h3>
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No applications yet</p>
            ) : (
              applications.map((app) => (
                <motion.div key={app.id} layout className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground">{app.full_name}</p>
                      <p className="text-xs text-muted-foreground">{app.email} • {app.phone}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Category: {app.art_category}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${app.status === "pending" ? "bg-secondary/10 text-secondary" : app.status === "approved" ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}>
                      {app.status}
                    </span>
                  </div>
                  {app.artist_bio && <p className="text-xs text-muted-foreground line-clamp-2">{app.artist_bio}</p>}
                  {app.portfolio_url && <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">Portfolio</a>}
                  {app.status === "pending" && (
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => handleApproveApp(app.id)} disabled={approveApp.isPending} className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-green-600 py-2 text-xs font-semibold text-white">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button onClick={() => setRejectModal({ id: app.id, reason: "" })} className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-destructive py-2 text-xs font-semibold text-destructive-foreground">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Artwork Moderation */}
        {activeTab === "moderation" && (
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground">Artwork Moderation ({allProducts.length})</h3>
            <div className="flex gap-2 mb-2">
              {["all", "pending", "approved", "rejected"].map((filter) => (
                <button key={filter} className="text-xs px-3 py-1 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground capitalize">{filter}</button>
              ))}
            </div>
            {allProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No products to moderate</p>
            ) : (
              allProducts.map((product) => (
                <motion.div key={product.id} layout className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground">{product.title}</p>
                      <p className="text-xs text-muted-foreground">{product.vendor_name || "Unknown"} • {formatPrice(product.price)}</p>
                      <p className="text-xs text-muted-foreground">{product.category} • {product.medium || "N/A"}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.moderation_status === "pending" ? "bg-secondary/10 text-secondary" : product.moderation_status === "approved" ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}>
                      {product.moderation_status}
                    </span>
                  </div>
                  {product.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>}
                  {product.admin_feedback && (
                    <p className="text-xs text-destructive mt-1 italic">Feedback: {product.admin_feedback}</p>
                  )}
                  {product.moderation_status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setFeedbackModal({ id: product.id, feedback: "", action: "approved" })} className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-green-600 py-2 text-xs font-semibold text-white">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button onClick={() => setFeedbackModal({ id: product.id, feedback: "", action: "rejected" })} className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-destructive py-2 text-xs font-semibold text-destructive-foreground">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Sellers */}
        {activeTab === "sellers" && (
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground">Active Sellers ({allSellers.length})</h3>
            {allSellers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No sellers yet</p>
            ) : (
              allSellers.map((seller) => (
                <div key={seller.id} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-bold text-foreground">{seller.display_name || "Unnamed"}</p>
                  <p className="text-xs text-muted-foreground">{seller.location || "No location"}</p>
                  {seller.bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{seller.bio}</p>}
                </div>
              ))
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-foreground">All Orders ({allOrders.length})</h3>
            {allOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              allOrders.map((order) => (
                <div key={order.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">#{order.id.slice(0, 8)}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString()} • {order.order_items?.length || 0} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{formatPrice(order.total)}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${order.status === "delivered" ? "bg-green-100 text-green-700" : order.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"}`}>{order.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 px-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-sm rounded-xl bg-background p-5 space-y-3">
              <h3 className="font-display text-base font-bold text-foreground">Rejection Reason</h3>
              <textarea value={rejectModal.reason} onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })} placeholder="Explain why the application is being rejected..." rows={3} className="w-full rounded-lg border border-border bg-card py-2.5 px-3 text-sm text-foreground outline-none resize-none" />
              <div className="flex gap-2">
                <button onClick={handleRejectApp} disabled={!rejectModal.reason || rejectApp.isPending} className="flex-1 rounded-lg bg-destructive py-2.5 text-xs font-semibold text-destructive-foreground disabled:opacity-60">
                  {rejectApp.isPending ? "Rejecting..." : "Confirm Reject"}
                </button>
                <button onClick={() => setRejectModal(null)} className="rounded-lg border border-border px-4 py-2.5 text-xs text-muted-foreground">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal for Product Moderation */}
      <AnimatePresence>
        {feedbackModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 px-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-sm rounded-xl bg-background p-5 space-y-3">
              <h3 className="font-display text-base font-bold text-foreground">
                {feedbackModal.action === "approved" ? "Approve Artwork" : "Reject Artwork"}
              </h3>
              <textarea value={feedbackModal.feedback} onChange={(e) => setFeedbackModal({ ...feedbackModal, feedback: e.target.value })} placeholder={feedbackModal.action === "rejected" ? "Explain what needs to be changed..." : "Any feedback for the seller (optional)..."} rows={3} className="w-full rounded-lg border border-border bg-card py-2.5 px-3 text-sm text-foreground outline-none resize-none" />
              <div className="flex gap-2">
                <button onClick={handleModerateProduct} disabled={feedbackModal.action === "rejected" && !feedbackModal.feedback || moderateProduct.isPending} className={`flex-1 rounded-lg py-2.5 text-xs font-semibold disabled:opacity-60 ${feedbackModal.action === "approved" ? "bg-green-600 text-white" : "bg-destructive text-destructive-foreground"}`}>
                  {moderateProduct.isPending ? "Processing..." : feedbackModal.action === "approved" ? "Confirm Approve" : "Confirm Reject"}
                </button>
                <button onClick={() => setFeedbackModal(null)} className="rounded-lg border border-border px-4 py-2.5 text-xs text-muted-foreground">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
