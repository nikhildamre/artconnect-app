import { ShoppingBag } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Cart = () => (
  <div className="min-h-screen bg-background pb-20">
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="mx-auto max-w-lg px-4 py-3">
        <h1 className="font-display text-lg font-bold text-foreground">Cart</h1>
      </div>
    </header>
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-light">
        <ShoppingBag className="h-7 w-7 text-secondary" />
      </div>
      <h2 className="font-display text-xl font-bold text-foreground">Your cart is empty</h2>
      <p className="mt-2 text-sm text-muted-foreground">Explore artworks and add them to your cart</p>
    </div>
    <BottomNav />
  </div>
);

export default Cart;
