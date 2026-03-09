import { useState } from "react";
import { ArrowLeft, Check, Star, Heart, Gift, Home, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const fontStyles = [
  {
    id: "gothic",
    name: "Gothic Blackletter",
    description: "Medieval style, dramatic and elegant",
    preview: "Amey Ghadge",
    style: "font-serif text-2xl font-bold tracking-wide",
    popular: true
  },
  {
    id: "modern",
    name: "Modern Script",
    description: "Clean and contemporary",
    preview: "Amey Ghadge",
    style: "font-serif text-2xl italic tracking-normal"
  },
  {
    id: "classic",
    name: "Classic Calligraphy",
    description: "Traditional elegant script",
    preview: "Amey Ghadge",
    style: "font-serif text-2xl font-light tracking-wide"
  },
  {
    id: "bold",
    name: "Bold Statement",
    description: "Strong and impactful",
    preview: "Amey Ghadge",
    style: "font-sans text-2xl font-black tracking-tight"
  }
];

const frameOptions = [
  {
    id: "natural",
    name: "Natural Wood",
    description: "Premium pine wood frame",
    price: 0,
    image: "🖼️"
  },
  {
    id: "dark",
    name: "Dark Walnut",
    description: "Rich dark wood finish",
    price: 200,
    image: "🖼️"
  },
  {
    id: "white",
    name: "Classic White",
    description: "Clean white wooden frame",
    price: 150,
    image: "🖼️"
  },
  {
    id: "black",
    name: "Elegant Black",
    description: "Sophisticated black frame",
    price: 150,
    image: "🖼️"
  }
];

const sizeOptions = [
  {
    id: "small",
    name: "Small",
    dimensions: "8\" × 6\"",
    price: 1499,
    popular: false
  },
  {
    id: "medium",
    name: "Medium",
    dimensions: "12\" × 8\"",
    price: 1999,
    popular: true
  },
  {
    id: "large",
    name: "Large",
    dimensions: "16\" × 12\"",
    price: 2499,
    popular: false
  }
];

const useCases = [
  {
    icon: Home,
    title: "Home Décor",
    description: "Perfect for living rooms, bedrooms, or hallways"
  },
  {
    icon: Gift,
    title: "Gifts",
    description: "Thoughtful personalized gifts for loved ones"
  },
  {
    icon: Briefcase,
    title: "Office",
    description: "Professional nameplates for desks or doors"
  }
];

const Calligraphy = () => {
  const navigate = useNavigate();
  const [selectedFont, setSelectedFont] = useState("gothic");
  const [selectedFrame, setSelectedFrame] = useState("natural");
  const [selectedSize, setSelectedSize] = useState("medium");
  const [customName, setCustomName] = useState("Your Name");
  const [showOrderForm, setShowOrderForm] = useState(false);

  const calculatePrice = () => {
    const basePrice = sizeOptions.find(s => s.id === selectedSize)?.price || 1499;
    const framePrice = frameOptions.find(f => f.id === selectedFrame)?.price || 0;
    return basePrice + framePrice;
  };

  const selectedFontStyle = fontStyles.find(f => f.id === selectedFont);
  const selectedFrameOption = frameOptions.find(f => f.id === selectedFrame);
  const selectedSizeOption = sizeOptions.find(s => s.id === selectedSize);

  return (
    <div className="min-h-[100dvh] bg-background pb-20 mx-auto max-w-lg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 safe-area-top">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full bg-secondary/50 p-2 hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Custom Calligraphy</h1>
              <p className="text-sm text-muted-foreground">Personalized Name Art</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 pb-32 space-y-8">
        {/* Preview Section */}
        <section>
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-1">Live Preview</h2>
            <p className="text-sm text-muted-foreground">See how your name will look</p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-8 border-4 border-amber-200 dark:border-amber-800">
              <div className="bg-white dark:bg-gray-100 rounded-lg p-6 shadow-inner">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">MR.</div>
                  <div className={`text-gray-800 ${selectedFontStyle?.style}`}>
                    {customName}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
              {selectedFrameOption?.name}
            </div>
          </div>

          <div className="mt-4 p-4 bg-card rounded-xl border border-border/50">
            <label className="block text-sm font-medium text-foreground mb-2">
              Enter Your Name
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value || "Your Name")}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
        </section>

        {/* Font Selection */}
        <section>
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-1">Choose Font Style</h2>
            <p className="text-sm text-muted-foreground">Select your preferred calligraphy style</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {fontStyles.map((font) => (
              <motion.button
                key={font.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFont(font.id)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  selectedFont === font.id
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20'
                    : 'border-border bg-card hover:border-secondary'
                }`}
              >
                {font.popular && (
                  <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{font.name}</h3>
                  {selectedFont === font.id && (
                    <Check className="h-5 w-5 text-rose-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{font.description}</p>
                <div className={`${font.style} text-gray-800 dark:text-gray-200`}>
                  {font.preview}
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Size Selection */}
        <section>
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-1">Choose Size</h2>
            <p className="text-sm text-muted-foreground">Select the perfect size for your space</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {sizeOptions.map((size) => (
              <motion.button
                key={size.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSize(size.id)}
                className={`relative p-4 rounded-xl border-2 transition-all text-center ${
                  selectedSize === size.id
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20'
                    : 'border-border bg-card hover:border-secondary'
                }`}
              >
                {size.popular && (
                  <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    ★
                  </div>
                )}
                <h3 className="font-semibold text-foreground mb-1">{size.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{size.dimensions}</p>
                <p className="font-bold text-rose-600">₹{size.price}</p>
                {selectedSize === size.id && (
                  <Check className="h-4 w-4 text-rose-500 mx-auto mt-2" />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Frame Selection */}
        <section>
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-1">Choose Frame</h2>
            <p className="text-sm text-muted-foreground">Premium wooden frames included</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {frameOptions.map((frame) => (
              <motion.button
                key={frame.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFrame(frame.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selectedFrame === frame.id
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20'
                    : 'border-border bg-card hover:border-secondary'
                }`}
              >
                <div className="text-2xl mb-2">{frame.image}</div>
                <h3 className="font-semibold text-foreground mb-1">{frame.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{frame.description}</p>
                {frame.price > 0 && (
                  <p className="text-sm font-medium text-rose-600">+₹{frame.price}</p>
                )}
                {selectedFrame === frame.id && (
                  <Check className="h-4 w-4 text-rose-500 mx-auto mt-2" />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section>
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-1">Perfect For</h2>
            <p className="text-sm text-muted-foreground">Where will you display your art?</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {useCases.map((useCase, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-card border border-border/50">
                <useCase.icon className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-1">{useCase.title}</h3>
                <p className="text-xs text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 p-6 border border-rose-200 dark:border-rose-800">
            <h3 className="font-display text-lg font-bold text-foreground mb-4 text-center">What's Included</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-rose-500 flex-shrink-0" />
                <span className="text-sm text-foreground">Hand-crafted calligraphy design</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-rose-500 flex-shrink-0" />
                <span className="text-sm text-foreground">Premium wooden frame included</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-rose-500 flex-shrink-0" />
                <span className="text-sm text-foreground">High-quality paper and ink</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-rose-500 flex-shrink-0" />
                <span className="text-sm text-foreground">Ready to hang with backing</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-rose-500 flex-shrink-0" />
                <span className="text-sm text-foreground">Gift packaging available</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-rose-500 flex-shrink-0" />
                <span className="text-sm text-foreground">7-day delivery guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section>
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-foreground mb-1">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.9 out of 5 (127 reviews)</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">Priya S.</span>
              </div>
              <p className="text-sm text-foreground">"Beautiful work! The Gothic style looks amazing in my living room. Perfect gift for my husband."</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">Rahul M.</span>
              </div>
              <p className="text-sm text-foreground">"Excellent quality frame and the calligraphy is stunning. Delivered exactly as promised."</p>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-display text-lg font-bold text-foreground">₹{calculatePrice()}</div>
              <div className="text-sm text-muted-foreground">
                {selectedSizeOption?.name} • {selectedFrameOption?.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Delivery in</div>
              <div className="font-semibold text-foreground">7 days</div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOrderForm(true)}
            className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 p-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Heart className="h-5 w-5" />
            <span>Order Your Custom Art</span>
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Calligraphy;