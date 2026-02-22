import { useState, useEffect } from "react";
import { 
  Package, 
  DollarSign, 
  ShoppingBag, 
  Plus, 
  BarChart3, 
  Users, 
  ArrowLeft, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useIsVendor } from "@/hooks/useAdmin";
import { 
  useVendorProducts, 
  useVendorStats, 
  useVendorOrders, 
  useVendorRecentActivity,
  useUpdateProduct,
  useDeleteProduct
} from "@/hooks/useVendor";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

type Tab = "overview" | "products" | "orders" | "analytics";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: isVendor, isLoading: vendorLoading } = useIsVendor();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  
  const { data: products = [], isLoading: productsLoading } = useVendorProducts();
  const { data: stats, isLoading: statsLoading } = useVendorStats();
  const { data: orders = [], isLoading: ordersLoading } = useVendorOrders();
  const { data: recentActivity = [], isLoading: activityLoading } = useVendorRecentActivity();
  
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Redirect if not vendor
  useEffect(() => {
    if (!vendorLoading && !isVendor) {
      toast.error("Access denied. Vendor privileges required.");
      navigate("/apply-seller");
    }
  }, [isVendor, vendorLoading, navigate]);

  // Show loading while checking vendor status
  if (vendorLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Verifying vendor access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not vendor
  if (!isVendor) {
    return null;
  }

  const tabs: { key: Tab; label: string; icon: typeof Package; count?: number }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "products", label: "Products", icon: Package, count: products.length },
    { key: "orders", label: "Orders", icon: ShoppingBag, count: orders.length },
    { key: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  const handleToggleProduct = async (productId: string, currentActive: boolean) => {
    try {
      await updateProduct.mutateAsync({
        productId,
        updates: { is_active: !currentActive }
      });
      toast.success(`Product ${!currentActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    }
  };

  const handleDeleteProduct = async (productId: string, productTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  const isLoading = productsLoading || statsLoading || ordersLoading || activityLoading;

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl safe-area-top">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/")} 
              className="rounded-full bg-card p-2.5 shadow-art border border-border"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Vendor Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your shop</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/vendor/products")} 
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
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
              {tab.count !== undefined && (
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
              )}
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
              <p className="text-sm text-muted-foreground">Loading vendor data...</p>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && !isLoading && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  label: "Total Revenue", 
                  value: formatPrice(stats?.totalRevenue || 0), 
                  icon: DollarSign, 
                  color: "text-green-600",
                  bg: "bg-green-100",
                  change: `${stats?.completedOrders || 0} completed orders`
                },
                { 
                  label: "Active Products", 
                  value: String(stats?.activeProducts || 0), 
                  icon: Package,
                  color: "text-blue-600",
                  bg: "bg-blue-100",
                  change: `${stats?.totalProducts || 0} total products`
                },
                { 
                  label: "Total Orders", 
                  value: String(stats?.totalOrders || 0), 
                  icon: ShoppingBag,
                  color: "text-purple-600",
                  bg: "bg-purple-100",
                  change: `${stats?.pendingOrders || 0} pending`
                },
                { 
                  label: "Pending Review", 
                  value: String(stats?.pendingProducts || 0), 
                  icon: Clock,
                  color: "text-orange-600",
                  bg: "bg-orange-100",
                  change: "awaiting moderation"
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
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </motion.div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full bg-gradient-to-r from-green-500 to-blue-500 p-2">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Revenue Trend</h3>
                  <p className="text-xs text-muted-foreground">Last 12 months</p>
                </div>
              </div>
              
              <div className="flex items-end gap-1 h-24 mb-2">
                {(stats?.monthlyRevenue || Array(12).fill(0)).map((revenue, i) => {
                  const maxRevenue = Math.max(...(stats?.monthlyRevenue || [1]));
                  const height = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                  return (
                    <div 
                      key={i} 
                      className="flex-1 bg-gradient-to-t from-purple-600 to-blue-600 rounded-t opacity-80 min-h-[4px]" 
                      style={{ height: `${Math.max(height, 4)}%` }}
                      title={`${formatPrice(revenue)}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Jan</span>
                <span>Dec</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-2">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Recent Orders</h3>
                  <p className="text-xs text-muted-foreground">{recentActivity.length} recent orders</p>
                </div>
              </div>
              
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((order) => (
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

        {/* Products Tab */}
        {activeTab === "products" && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">Your Products</h3>
              <span className="text-sm text-muted-foreground">{products.length} total</span>
            </div>
            
            {/* Debug info for troubleshooting */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-muted/50 border border-border rounded-xl p-3 text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>User ID: {user?.id}</p>
                <p>Products loaded: {products.length}</p>
                <p>Is vendor: {isVendor ? 'Yes' : 'No'}</p>
              </div>
            )}
            
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🎨</div>
                <p className="text-sm text-muted-foreground mb-2">No products yet</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {user ? 'Products you add will appear here after admin approval' : 'Please sign in to manage products'}
                </p>
                <button 
                  onClick={() => navigate("/vendor/products")}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              products.map((product, index) => (
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
                        <span className="text-xs text-muted-foreground">
                          Stock: {product.inventory || 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                        product.moderation_status === "pending" ? "bg-orange-100 text-orange-700" : 
                        product.moderation_status === "approved" ? "bg-green-100 text-green-700" : 
                        "bg-red-100 text-red-700"
                      }`}>
                        {product.moderation_status || 'pending'}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                        product.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
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
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleToggleProduct(product.id, product.is_active)}
                      disabled={updateProduct.isPending}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-muted py-3 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors disabled:opacity-60"
                    >
                      {product.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      {product.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button 
                      onClick={() => navigate(`/artwork/${product.id}`)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id, product.title)}
                      disabled={deleteProduct.isPending}
                      className="flex items-center justify-center gap-2 rounded-xl border border-destructive px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-foreground">Your Orders</h3>
              <span className="text-sm text-muted-foreground">{orders.length} total</span>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🛒</div>
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              orders.map((order, index) => (
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
                      <div className="mt-2">
                        {order.order_items?.map((item) => (
                          <p key={item.id} className="text-xs text-muted-foreground">
                            {item.products?.title} × {item.quantity}
                          </p>
                        ))}
                      </div>
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

        {/* Analytics Tab */}
        {activeTab === "analytics" && !isLoading && (
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-foreground">Analytics & Insights</h3>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h4 className="font-display text-md font-bold text-foreground mb-4">Product Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Approval Rate</span>
                    <span className="text-sm font-bold text-foreground">
                      {stats?.totalProducts ? Math.round(((stats.totalProducts - stats.pendingProducts) / stats.totalProducts) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Products</span>
                    <span className="text-sm font-bold text-foreground">{stats?.activeProducts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Price</span>
                    <span className="text-sm font-bold text-foreground">
                      {products.length > 0 ? formatPrice(products.reduce((sum, p) => sum + p.price, 0) / products.length) : formatPrice(0)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h4 className="font-display text-md font-bold text-foreground mb-4">Sales Insights</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="text-sm font-bold text-foreground">
                      {stats?.totalProducts && stats?.totalOrders ? Math.round((stats.totalOrders / stats.totalProducts) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Order Value</span>
                    <span className="text-sm font-bold text-foreground">
                      {stats?.completedOrders ? formatPrice(stats.totalRevenue / stats.completedOrders) : formatPrice(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Earnings</span>
                    <span className="text-sm font-bold text-secondary">{formatPrice(stats?.totalRevenue || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default VendorDashboard;