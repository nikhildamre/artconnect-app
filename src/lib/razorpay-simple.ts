// Simplified Razorpay integration for demo purposes
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

export const initiateSimplePayment = async (
  amount: number,
  description: string,
  userDetails: {
    name: string;
    email: string;
    contact: string;
  },
  onSuccess: (response: any) => void,
  onFailure: (error?: any) => void
) => {
  try {
    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded) {
      console.error('Razorpay SDK failed to load');
      onFailure({ error: 'SDK_LOAD_FAILED' });
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      console.error('Razorpay key not configured');
      onFailure({ error: 'KEY_NOT_CONFIGURED' });
      return;
    }

    const options = {
      key: razorpayKey,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: 'ArtVpp - Indian Art Marketplace',
      description: description,
      image: '/logo.png', // Your app logo
      handler: function (response: any) {
        console.log('Payment Success:', response);
        onSuccess(response);
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact
      },
      notes: {
        address: 'ArtVpp Corporate Office'
      },
      theme: {
        color: '#9E4A5A'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed');
          onFailure({ error: 'PAYMENT_DISMISSED' });
        }
      }
    };

    console.log('Initializing Razorpay with options:', options);

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      onFailure(response.error);
    });

    rzp.open();
  } catch (error) {
    console.error('Error in payment initialization:', error);
    onFailure(error);
  }
};

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};