import { useState } from "react";
import { ArrowLeft, Plus, Eye, EyeOff, Trash2, Edit2, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useVendorProducts } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: products, isLoading } = useVendorProducts();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", category: "Paintings", medium: "", inventory: "1" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("products").insert({
      vendor_id: user.id,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      medium: form.medium,
      inventory: Number(form.inventory),
      vendor_name: user.user_metadata?.display_name || user.email || "Artist",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to add product. Make sure you have vendor permissions.");
      return;
    }
    setForm({ title: "", description: "", price: "", category: "Paintings", medium: "", inventory: "1" });
    setShowForm(false);
    qc.invalidateQueries({ queryKey: ["vendor-products"] });
    toast.success("Product added successfully!");
  };

  const toggleActive = async (id: string, currentActive: boolean | null) => {
    await supabase.from("products").update({ is_active: !currentActive }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["vendor-products"] });
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["vendor-products"] });
    toast.success("Product deleted");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-full bg-card p-2"><ArrowLeft className="h-4 w-4 text-foreground" /></button>
            <h1 className="font-display text-lg font-bold text-foreground">My Products</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 rounded-full bg-gradient-burgundy px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-4">
        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4 space-y-3 overflow-hidden">
              <h3 className="font-display text-sm font-bold text-foreground">Add New Product</h3>
              <input type="text" placeholder="Product Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary" required />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary resize-none" />
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground hover:border-secondary transition-all">
                <ImageIcon className="h-5 w-5" /> Upload Images
              </button>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Price (₹) *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary" required />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground outline-none focus:border-secondary">
                  <option>Paintings</option><option>Sculptures</option><option>Digital Art</option><option>Photography</option><option>Folk Art</option><option>Handicrafts</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Medium" value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })} className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary" />
                <input type="number" placeholder="Inventory *" value={form.inventory} onChange={(e) => setForm({ ...form, inventory: e.target.value })} className="rounded-lg border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-secondary" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-gradient-burgundy py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                  {submitting ? "Saving..." : "Save Product"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground">Cancel</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
        ) : (
          <div className="space-y-2">
            {(products || []).map((product) => (
              <motion.div key={product.id} layout className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-xl">🎨</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-foreground">{formatPrice(product.price)}</span>
                    <span className="text-xs text-muted-foreground">• Stock: {product.inventory}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => toggleActive(product.id, product.is_active)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    {product.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            {(!products || products.length === 0) && (
              <div className="text-center py-12"><p className="text-sm text-muted-foreground">No products yet. Click "Add" to list your first artwork!</p></div>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default AddProduct;
