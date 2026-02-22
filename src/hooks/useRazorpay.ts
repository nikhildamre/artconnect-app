import { useState } from 'react';
import { initiateSimplePayment } from '@/lib/razorpay-simple';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PaymentDetails {
  amount: number;
  description: string;
  orderId?: string;
}

export const useRazorpay = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const processPayment = async (
    paymentDetails: PaymentDetails,
    onSuccess?: (response: any) => void,
    onFailure?: () => void
  ) => {
    if (!user) {
      toast.error('Please sign in to make a payment');
      return;
    }

    setIsProcessing(true);

    try {
      await initiateSimplePayment(
        paymentDetails.amount,
        paymentDetails.description,
        {
          name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Customer',
          email: user.email || '',
          contact: user.user_metadata?.phone || '9999999999'
        },
        (response) => {
          setIsProcessing(false);
          toast.success('Payment successful!', {
            description: `Payment ID: ${response.razorpay_payment_id}`
          });
          onSuccess?.(response);
        },
        (error) => {
          setIsProcessing(false);
          
          if (error?.error === 'PAYMENT_DISMISSED') {
            toast.info('Payment cancelled');
          } else if (error?.error === 'SDK_LOAD_FAILED') {
            toast.error('Payment system unavailable. Please try again.');
          } else if (error?.error === 'KEY_NOT_CONFIGURED') {
            toast.error('Payment configuration error');
          } else {
            toast.error('Payment failed. Please try again.');
          }
          
          console.error('Payment error:', error);
          onFailure?.();
        }
      );
    } catch (error) {
      setIsProcessing(false);
      toast.error('Payment initialization failed');
      console.error('Payment error:', error);
      onFailure?.();
    }
  };

  return {
    processPayment,
    isProcessing
  };
};