import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "@/hooks/useCart";
import { useImageForArtwork } from "@/hooks/useArtworkImages";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { useState } from "react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

const CartItemRow = ({
  item,
  onUpdate,
  onRemove,
}: {
  item: any;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}) => {
  const product = item.products;
  const imageSrc = useImageForArtwork(product?.images?.[0] || "");
  if (!product) return null;

  return (
    <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }} className="flex gap-3 rounded-xl border border-border bg-card p-3">
      <img src={imageSrc} alt={product.title} className="h-20 w-20 rounded-lg object-cover" />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1">{product.title}</h3>
          <p className="text-xs text-muted-foreground">{product.vendor_name || "Artist"}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdate(Math.max(1, item.quantity - 1))} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors">
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-sm font-medium text-foreground w-5 text-center">{item.quantity}</span>
            <button onClick={() => onUpdate(item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="h-3 w-3" />
            </button>
            <button onClick={onRemove} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive transition-colors ml-1">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const { data, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const cartItems = data?.items || [];

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.products?.price || 0) * item.quantity;
  }, 0);
  const shipping = subtotal > 25000 ? 0 : 499;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please sign in to proceed");
      navigate("/auth");
      return;
    }
    navigate("/checkout");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3">
            <h1 className="font-display text-lg font-bold text-foreground">Cart</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-7 w-7 text-secondary" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">Sign in to view your cart</h2>
          <p className="mt-2 text-sm text-muted-foreground">Your cart items are saved to your account</p>
          <button onClick={() => navigate("/auth")} className="mt-4 rounded-full bg-gradient-burgundy px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">Sign In</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3"><h1 className="font-display text-lg font-bold text-foreground">Cart</h1></div>
        </header>
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
          <div className="mx-auto max-w-lg px-4 py-3"><h1 className="font-display text-lg font-bold text-foreground">Cart</h1></div>
        </header>
        <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-7 w-7 text-secondary" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">Explore artworks and add them to your cart</p>
          <button onClick={() => navigate("/browse")} className="mt-4 rounded-full bg-gradient-burgundy px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">Browse Artworks</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-48">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold text-foreground">Cart</h1>
          <span className="text-xs text-muted-foreground">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {cartItems.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdate={(qty) => updateItem.mutate({ itemId: item.id, quantity: qty })}
              onRemove={() => removeItem.mutate(item.id, { onSuccess: () => toast.success("Item removed from cart") })}
            />
          ))}
        </AnimatePresence>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Enter promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          <button className="rounded-lg bg-gradient-gold px-3 py-1.5 text-xs font-semibold text-foreground">Apply</button>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
          <h3 className="font-display text-sm font-bold text-foreground">Order Summary</h3>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-secondary font-medium" : "text-foreground"}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (18%)</span><span className="text-foreground">{formatPrice(tax)}</span></div>
          <div className="border-t border-border pt-2.5 flex justify-between">
            <span className="font-display text-sm font-bold text-foreground">Total</span>
            <span className="font-display text-lg font-bold text-foreground">{formatPrice(total)}</span>
          </div>
        </div>

        {shipping > 0 && <p className="text-center text-xs text-muted-foreground">Free shipping on orders above ₹25,000</p>}
      </main>

      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg p-4">
        <div className="mx-auto max-w-lg">
          <button onClick={handleCheckout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-burgundy py-3.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.01] active:scale-[0.99]">
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Cart;
