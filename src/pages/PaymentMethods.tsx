import { useState } from "react";
import { ArrowLeft, Plus, CreditCard, Smartphone, Building2, Wallet, Trash2, Edit3, Shield, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const savedCards = [
  {
    id: 1,
    type: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "25",
    holderName: "John Doe",
    isDefault: true
  },
  {
    id: 2,
    type: "mastercard",
    last4: "5555",
    expiryMonth: "08",
    expiryYear: "26",
    holderName: "John Doe",
    isDefault: false
  }
];

const savedUPIs = [
  {
    id: 1,
    upiId: "john.doe@paytm",
    provider: "Paytm",
    isDefault: true,
    isVerified: true
  },
  {
    id: 2,
    upiId: "johndoe@okaxis",
    provider: "Google Pay",
    isDefault: false,
    isVerified: true
  }
];

const wallets = [
  {
    id: 1,
    name: "Paytm Wallet",
    balance: 1250,
    isLinked: true,
    icon: "💳"
  },
  {
    id: 2,
    name: "PhonePe Wallet",
    balance: 0,
    isLinked: false,
    icon: "📱"
  },
  {
    id: 3,
    name: "Amazon Pay",
    balance: 500,
    isLinked: true,
    icon: "🛒"
  }
];

const PaymentMethodCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl bg-card border border-border/50 p-4 ${className}`}>
    {children}
  </div>
);

const SavedCardItem = ({ card, onEdit, onDelete }: { card: any; onEdit: () => void; onDelete: () => void }) => {
  const getCardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  const getCardColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa': return 'from-blue-600 to-blue-800';
      case 'mastercard': return 'from-red-600 to-red-800';
      case 'amex': return 'from-green-600 to-green-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className={`rounded-2xl bg-gradient-to-r ${getCardColor(card.type)} p-4 text-white shadow-lg`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCardIcon(card.type)}</span>
            <span className="text-sm font-semibold uppercase">{card.type}</span>
          </div>
          {card.isDefault && (
            <div className="rounded-full bg-white/20 px-2 py-1">
              <span className="text-xs font-semibold">Default</span>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="text-lg font-mono tracking-wider">
            •••• •••• •••• {card.last4}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-80">Card Holder</div>
            <div className="text-sm font-semibold">{card.holderName}</div>
          </div>
          <div>
            <div className="text-xs opacity-80">Expires</div>
            <div className="text-sm font-semibold">{card.expiryMonth}/{card.expiryYear}</div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          <Edit3 className="h-3 w-3" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
          Remove
        </button>
      </div>
    </motion.div>
  );
};

const UPIItem = ({ upi, onEdit, onDelete }: { upi: any; onEdit: () => void; onDelete: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl bg-card border border-border/50 p-4"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2">
          <Smartphone className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="font-semibold text-foreground">{upi.upiId}</div>
          <div className="text-xs text-muted-foreground">{upi.provider}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {upi.isVerified && (
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-1">
            <Shield className="h-3 w-3 text-green-600" />
          </div>
        )}
        {upi.isDefault && (
          <div className="rounded-full bg-primary/10 px-2 py-1">
            <span className="text-xs font-semibold text-primary">Default</span>
          </div>
        )}
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/80 transition-colors"
      >
        <Edit3 className="h-3 w-3" />
        Edit
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
      >
        <Trash2 className="h-3 w-3" />
        Remove
      </button>
    </div>
  </motion.div>
);

const WalletItem = ({ wallet, onToggle }: { wallet: any; onToggle: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl bg-card border border-border/50 p-4"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{wallet.icon}</div>
        <div>
          <div className="font-semibold text-foreground">{wallet.name}</div>
          <div className="text-xs text-muted-foreground">
            {wallet.isLinked ? `Balance: ₹${wallet.balance}` : 'Not linked'}
          </div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
          wallet.isLinked
            ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {wallet.isLinked ? 'Linked' : 'Link'}
      </button>
    </div>
  </motion.div>
);

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cards' | 'upi' | 'wallets'>('cards');

  const handleAddCard = () => {
    // Handle add card logic
    alert("Add Card functionality coming soon!");
  };

  const handleAddUPI = () => {
    // Handle add UPI logic
    alert("Add UPI functionality coming soon!");
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 safe-area-top">
        <div className="flex items-center gap-3 px-4 py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="rounded-full bg-card p-2 text-muted-foreground hover:text-foreground transition-colors shadow-art"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Payment Methods</h1>
            <p className="text-sm text-muted-foreground">Manage your payment options</p>
          </div>
        </div>
      </header>

      <main>
        {/* Security Banner */}
        <section className="px-4 pt-6 pb-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Encrypted</h3>
                <p className="text-sm text-white/90">Your payment information is protected with bank-level security</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Tabs */}
        <section className="px-4 pb-4">
          <div className="flex rounded-2xl bg-muted p-1">
            {[
              { id: 'cards', label: 'Cards', icon: CreditCard },
              { id: 'upi', label: 'UPI', icon: Smartphone },
              { id: 'wallets', label: 'Wallets', icon: Wallet }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Content */}
        <section className="px-4 pb-6">
          <AnimatePresence mode="wait">
            {activeTab === 'cards' && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-foreground">Saved Cards</h2>
                  <button
                    onClick={handleAddCard}
                    className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Card
                  </button>
                </div>
                
                <div className="space-y-4">
                  {savedCards.map((card) => (
                    <SavedCardItem
                      key={card.id}
                      card={card}
                      onEdit={() => alert("Edit card functionality coming soon!")}
                      onDelete={() => alert("Delete card functionality coming soon!")}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'upi' && (
              <motion.div
                key="upi"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-foreground">UPI IDs</h2>
                  <button
                    onClick={handleAddUPI}
                    className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add UPI
                  </button>
                </div>
                
                <div className="space-y-4">
                  {savedUPIs.map((upi) => (
                    <UPIItem
                      key={upi.id}
                      upi={upi}
                      onEdit={() => alert("Edit UPI functionality coming soon!")}
                      onDelete={() => alert("Delete UPI functionality coming soon!")}
                    />
                  ))}
                </div>

                {/* UPI Info */}
                <PaymentMethodCard className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Quick UPI Payments</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Pay instantly using your UPI ID. Supported by all major UPI apps like Google Pay, PhonePe, Paytm, and more.
                      </p>
                    </div>
                  </div>
                </PaymentMethodCard>
              </motion.div>
            )}

            {activeTab === 'wallets' && (
              <motion.div
                key="wallets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-1">Digital Wallets</h2>
                  <p className="text-sm text-muted-foreground">Link your wallets for faster payments</p>
                </div>
                
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <WalletItem
                      key={wallet.id}
                      wallet={wallet}
                      onToggle={() => alert(`${wallet.isLinked ? 'Unlink' : 'Link'} ${wallet.name} functionality coming soon!`)}
                    />
                  ))}
                </div>

                {/* Wallet Benefits */}
                <PaymentMethodCard className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2">
                      <Star className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Wallet Benefits</h3>
                      <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                        <li>• Instant payments without entering card details</li>
                        <li>• Exclusive cashback and offers</li>
                        <li>• Faster checkout experience</li>
                      </ul>
                    </div>
                  </div>
                </PaymentMethodCard>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Payment Security Info */}
        <section className="px-4 pb-6">
          <PaymentMethodCard>
            <div className="text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mx-auto mb-3 w-fit">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Your Security is Our Priority</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All payment information is encrypted and stored securely. We never store your complete card details or PIN.
              </p>
            </div>
          </PaymentMethodCard>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default PaymentMethods;