interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, currency = 'INR') => {
  // For demo purposes, we'll create a mock order
  // In production, this should call your backend API to create a real order
  try {
    return {
      id: `order_demo_${Date.now()}`,
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      status: 'created'
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const initiateRazorpayPayment = async (
  amount: number,
  orderDetails: {
    name: string;
    description: string;
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
  },
  onSuccess: (response: any) => void,
  onFailure: () => void
) => {
  try {
    // Check for demo mode
    const demoMode = import.meta.env.VITE_DEMO_MODE === "true";
    if (demoMode) {
      // Simulate successful payment in demo mode
      setTimeout(() => {
        onSuccess({
          razorpay_payment_id: `demo_${Date.now()}`,
          razorpay_order_id: `order_demo_${Date.now()}`,
          razorpay_signature: "demo_signature"
        });
      }, 2000);
      return;
    }

    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded) {
      console.error('Razorpay SDK failed to load');
      onFailure();
      return;
    }

    // Check if Razorpay key is available
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      console.error('Razorpay key not found in environment variables');
      onFailure();
      return;
    }

    const order = await createRazorpayOrder(amount);

    // Simplified options without complex configuration
    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: orderDetails.name,
      description: orderDetails.description,
      order_id: order.id,
      handler: (response) => {
        console.log('Payment Success:', response);
        onSuccess(response);
      },
      prefill: orderDetails.prefill,
      theme: {
        color: '#9E4A5A'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment dismissed by user');
          onFailure();
        }
      }
    };

    console.log('Razorpay options:', options);
    
    const razorpay = new window.Razorpay(options);
    
    razorpay.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      onFailure();
    });

    razorpay.open();
  } catch (error) {
    console.error('Error initiating Razorpay payment:', error);
    onFailure();
  }
};

export const formatRazorpayAmount = (amount: number) => {
  return Math.round(amount * 100); // Convert to paise
};

export const formatDisplayAmount = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};