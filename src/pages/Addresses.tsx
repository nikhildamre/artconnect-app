import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Plus, Edit3, Trash2, Home, Briefcase, Heart, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const Addresses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to manage your addresses");
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "home",
      name: "John Doe",
      phone: "+91 98765 43210",
      addressLine1: "123 Art Street",
      addressLine2: "Near Gallery",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true,
    },
    {
      id: "2",
      type: "work",
      name: "John Doe",
      phone: "+91 98765 43210",
      addressLine1: "456 Business Park",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      isDefault: false,
    },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    type: "home" as "home" | "work" | "other",
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  // Don't render anything if user is not logged in (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Authentication Required</h2>
          <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  const addressTypes = [
    { value: "home", label: "Home", icon: Home },
    { value: "work", label: "Work", icon: Briefcase },
    { value: "other", label: "Other", icon: Heart },
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = () => {
    setFormData({
      type: "home",
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: addresses.length === 0,
    });
    setEditingAddress(null);
    setShowAddForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      type: address.type,
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleSaveAddress = () => {
    if (!formData.name || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addr, ...formData }
          : formData.isDefault ? { ...addr, isDefault: false } : addr
      ));
      toast.success("Address updated successfully");
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
      };
      
      setAddresses(prev => {
        if (formData.isDefault) {
          return [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress];
        }
        return [...prev, newAddress];
      });
      toast.success("Address added successfully");
    }

    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast.success("Address deleted successfully");
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success("Default address updated");
  };

  const getAddressTypeIcon = (type: string) => {
    const addressType = addressTypes.find(t => t.value === type);
    return addressType ? addressType.icon : MapPin;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="rounded-full bg-secondary/50 p-2 hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Addresses</h1>
              <p className="text-sm text-muted-foreground">Manage delivery addresses</p>
            </div>
          </div>
          
          <button
            onClick={handleAddAddress}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-6">
        {/* Address List */}
        {!showAddForm && (
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No addresses yet</h3>
                <p className="text-sm text-muted-foreground mb-6">Add your first delivery address to get started</p>
                <button
                  onClick={handleAddAddress}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Add Address
                </button>
              </div>
            ) : (
              addresses.map((address) => {
                const IconComponent = getAddressTypeIcon(address.type);
                return (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground capitalize">{address.type}</h3>
                            {address.isDefault && (
                              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{address.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Edit3 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-foreground">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} {address.pincode}</p>
                      <p className="text-muted-foreground">{address.phone}</p>
                    </div>
                    
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="mt-3 text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        Set as Default
                      </button>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>

              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Address Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {addressTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange("type", type.value)}
                      className={`p-3 rounded-xl border-2 transition-colors ${
                        formData.type === type.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-secondary"
                      }`}
                    >
                      <type.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address Line 1 *</label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="House/Flat number, Street name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address Line 2</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Landmark, Area (Optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">PIN Code *</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="400001"
                  maxLength={6}
                />
              </div>

              {/* Default Address Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Set as default address</h4>
                  <p className="text-xs text-muted-foreground">Use this address for all future orders</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange("isDefault", !formData.isDefault)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.isDefault ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-background shadow-sm transform transition-transform mt-0.5 ${
                    formData.isDefault ? "translate-x-6 ml-0.5" : "translate-x-0.5"
                  }`} />
                </button>
              </div>

              {/* Save Button */}
              <div className="pt-4 pb-8">
                <button
                  onClick={handleSaveAddress}
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  {editingAddress ? "Update Address" : "Save Address"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default Addresses;