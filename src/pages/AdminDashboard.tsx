import { useState, useEffect } from "react";
import { ArrowLeft, LayoutDashboard, Users, Package, ShoppingBag, FileCheck, TrendingUp, DollarSign, CheckCircle2, XCircle, Clock } from "lucide-react";
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
  useIsAdmin,
} from "@/hooks/useAdmin";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

type Tab = "overview" | "applications" | "moderation" | "sellers" | "orders";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [rejectModal, setRejectModal] = useState<{ id: string; reason: string } | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{ id: string; feedback: string; action: "approved" | "rejected" } | null>(null);

  const { data: applications = [], isLoading: appsLoading } = useAllSellerApplications();
  const { data: allProducts = [], isLoading: productsLoading } = useAllProducts();
  const { data: allOrders = [], isLoading: ordersLoading } = useAllOrders();
  const { data: allSellers = [], isLoading: sellersLoading } = useAllSellers();
  const approveApp = useApproveSellerApplication();
  const rejectApp = useRejectSellerApplication();
  const moderateProduct = useModerateProduct();

  // Redirect if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  const pendingApps = applications.filter((a) => a.status === "pending");
  const pendingProducts = allProducts.filter((p) => p.moderation_status === "pending");
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const recentOrders = allOrders.slice(0, 5);

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
      toast.success("Seller approved successfully!");
    } catch (error) {
      toast.error("Failed to approve seller");
      console.error(error);
    }
  };

  const handleRejectApp = async () => {
    if (!rejectModal) return;
    try {
      await rejectApp.mutateAsync({ applicationId: rejectModal.id, reason: rejectModal.reason });
      toast.success("Application rejected");
      setRejectModal(null);
    } catch (error) {
      toast.error("Failed to reject application");
      console.error(error);
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
      toast.success(`Artwork ${feedbackModal.action} successfully!`);
      setFeedbackModal(null);
    } catch (error) {
      toast.error("Failed to moderate artwork");
      console.error(error);
    }
  };

  const isLoading = appsLoading || productsLoading || ordersLoading || sellersLoading;

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl safe-area-top">
        <div className="px-4 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate("/")} 
            className="rounded-full bg-card p-2.5 shadow-art border border-border"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage your platform</p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-[72px] z-30">
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-2">
          {tabs.map((tab) => (
            <button 
              key={tab.key} 
              onClick={() => setActiveTab(tab.key)} 
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-full mr-2 transition-all ${
                activeTab === tab.key 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count ? (
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-destructive text-destructive-foreground"
                }`}>
                  {tab.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading admin data...</p>
            </div>
          </div>
        )}

        {/* Overview */}
        {activeTab === "overview" && !isLoading && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  label: "Total Revenue", 
                  value: formatPrice(totalRevenue), 
                  icon: DollarSign, 
                  color: "text-green-600",
                  bg: "bg-green-100"
                },
                { 
                  label: "Active Sellers", 
                  value: String(allSellers.length), 
                  icon: Users,
                  color: "text-blue-600",
                  bg: "bg-blue-100"
                },
                { 
                  label: "Pending Applications", 
                  value: String(pendingApps.length), 
                  icon: FileCheck,
                  color: "text-orange-600",
                  bg: "bg-orange-100"
                },
                { 
                  label: "Pending Artworks", 
                  value: String(pendingProducts.length), 
                  icon: Package,
                  color: "text-purple-600",
                  bg: "bg-purple-100"
                },
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className={`rounded-full ${stat.bg} p-2 w-fit mb-3`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-2">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Recent Orders</h3>
                  <p className="text-xs text-muted-foreground">{allOrders.length} total orders</p>
                </div>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-xl bg-background p-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()} • {order.order_items?.length || 0} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{formatPrice(order.total)}</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          order.status === "delivered" ? "bg-green-100 text-green-700" : 
                          order.status === "pending" ? "bg-orange-100 text-orange-700" : 
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Seller Applications */}
        {activeTab === "applications" && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">Seller Applications</h3>
              <span className="text-sm text-muted-foreground">{applications.length} total</span>
            </div>
            
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-sm text-muted-foreground">No applications yet</p>
              </div>
            ) : (
              applications.map((app, index) => (
                <motion.div 
                  key={app.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-foreground">{app.full_name}</p>
                      <p className="text-sm text-muted-foreground">{app.email}</p>
                      <p className="text-sm text-muted-foreground">{app.phone}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium">
                          {app.art_category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                      app.status === "pending" ? "bg-orange-100 text-orange-700" : 
                      app.status === "approved" ? "bg-green-100 text-green-700" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  
                  {app.artist_bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {app.artist_bio}
                    </p>
                  )}
                  
                  {app.portfolio_url && (
                    <a 
                      href={app.portfolio_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sm text-primary underline hover:no-underline"
                    >
                      View Portfolio →
                    </a>
                  )}
                  
                  {app.status === "pending" && (
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => handleApproveApp(app.id)} 
                        disabled={approveApp.isPending}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-4 w-4" /> 
                        {approveApp.isPending ? "Approving..." : "Approve"}
                      </button>
                      <button 
                        onClick={() => setRejectModal({ id: app.id, reason: "" })}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-destructive py-3 text-sm font-bold text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  )}
                  
                  {app.status === "rejected" && app.rejection_reason && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-sm text-red-700">
                        <strong>Rejection reason:</strong> {app.rejection_reason}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Artwork Moderation */}
        {activeTab === "moderation" && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">Artwork Moderation</h3>
              <span className="text-sm text-muted-foreground">{allProducts.length} total</span>
            </div>
            
            {allProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🎨</div>
                <p className="text-sm text-muted-foreground">No artworks to moderate</p>
              </div>
            ) : (
              allProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-foreground">{product.title}</p>
                      <p className="text-sm text-muted-foreground">{product.vendor_name || "Unknown Artist"}</p>
                      <p className="text-lg font-bold text-secondary mt-1">{formatPrice(product.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium">
                          {product.category}
                        </span>
                        {product.medium && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                            {product.medium}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                      product.moderation_status === "pending" ? "bg-orange-100 text-orange-700" : 
                      product.moderation_status === "approved" ? "bg-green-100 text-green-700" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {product.moderation_status}
                    </span>
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  )}
                  
                  {product.admin_feedback && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-sm text-red-700">
                        <strong>Admin feedback:</strong> {product.admin_feedback}
                      </p>
                    </div>
                  )}
                  
                  {product.moderation_status === "pending" && (
                    <div className="flex gap-3 pt-2">
                      <button 
                        onClick={() => setFeedbackModal({ id: product.id, feedback: "", action: "approved" })}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve
                      </button>
                      <button 
                        onClick={() => setFeedbackModal({ id: product.id, feedback: "", action: "rejected" })}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-destructive py-3 text-sm font-bold text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Sellers */}
        {activeTab === "sellers" && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">Active Sellers</h3>
              <span className="text-sm text-muted-foreground">{allSellers.length} total</span>
            </div>
            
            {allSellers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-sm text-muted-foreground">No active sellers yet</p>
              </div>
            ) : (
              allSellers.map((seller, index) => (
                <motion.div 
                  key={seller.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {(seller.display_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-foreground">{seller.display_name || "Unnamed Seller"}</p>
                      <p className="text-sm text-muted-foreground">{seller.location || "Location not specified"}</p>
                      {seller.bio && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{seller.bio}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">All Orders</h3>
              <span className="text-sm text-muted-foreground">{allOrders.length} total</span>
            </div>
            
            {allOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🛒</div>
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              allOrders.map((order, index) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()} • {order.order_items?.length || 0} items
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Subtotal: {formatPrice(order.subtotal)} • Tax: {formatPrice(order.tax)} • Shipping: {formatPrice(order.shipping)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">{formatPrice(order.total)}</p>
                      <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                        order.status === "delivered" ? "bg-green-100 text-green-700" : 
                        order.status === "cancelled" ? "bg-red-100 text-red-700" : 
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }} 
              className="w-full max-w-sm rounded-2xl bg-background p-6 space-y-4 shadow-xl"
            >
              <h3 className="font-display text-lg font-bold text-foreground">Rejection Reason</h3>
              <textarea 
                value={rejectModal.reason} 
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })} 
                placeholder="Please explain why this application is being rejected..." 
                rows={4} 
                className="w-full rounded-xl border border-border bg-card py-3 px-4 text-sm text-foreground outline-none resize-none focus:border-secondary"
              />
              <div className="flex gap-3">
                <button 
                  onClick={handleRejectApp} 
                  disabled={!rejectModal.reason || rejectApp.isPending} 
                  className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-destructive-foreground disabled:opacity-60"
                >
                  {rejectApp.isPending ? "Rejecting..." : "Confirm Reject"}
                </button>
                <button 
                  onClick={() => setRejectModal(null)} 
                  className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal for Product Moderation */}
      <AnimatePresence>
        {feedbackModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }} 
              className="w-full max-w-sm rounded-2xl bg-background p-6 space-y-4 shadow-xl"
            >
              <h3 className="font-display text-lg font-bold text-foreground">
                {feedbackModal.action === "approved" ? "Approve Artwork" : "Reject Artwork"}
              </h3>
              <textarea 
                value={feedbackModal.feedback} 
                onChange={(e) => setFeedbackModal({ ...feedbackModal, feedback: e.target.value })} 
                placeholder={
                  feedbackModal.action === "rejected" 
                    ? "Please explain what needs to be changed..." 
                    : "Any feedback for the seller (optional)..."
                } 
                rows={4} 
                className="w-full rounded-xl border border-border bg-card py-3 px-4 text-sm text-foreground outline-none resize-none focus:border-secondary"
              />
              <div className="flex gap-3">
                <button 
                  onClick={handleModerateProduct} 
                  disabled={feedbackModal.action === "rejected" && !feedbackModal.feedback || moderateProduct.isPending} 
                  className={`flex-1 rounded-xl py-3 text-sm font-bold disabled:opacity-60 ${
                    feedbackModal.action === "approved" 
                      ? "bg-green-600 text-white" 
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {moderateProduct.isPending ? "Processing..." : 
                   feedbackModal.action === "approved" ? "Confirm Approve" : "Confirm Reject"}
                </button>
                <button 
                  onClick={() => setFeedbackModal(null)} 
                  className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default AdminDashboard;