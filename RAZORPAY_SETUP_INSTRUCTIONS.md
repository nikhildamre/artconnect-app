# Razorpay Setup Instructions

## The "No appropriate payment method found" Error

This error occurs because:
1. The Razorpay test key is not properly configured
2. Payment methods are not enabled in your Razorpay dashboard
3. The test key doesn't have the required permissions

## How to Fix This:

### Step 1: Create a Razorpay Account
1. Go to https://razorpay.com/
2. Sign up for a free account
3. Complete the verification process

### Step 2: Get Your API Keys
1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate Test API Keys
4. Copy both:
   - Key ID (starts with `rzp_test_`)
   - Key Secret (keep this secure)

### Step 3: Enable Payment Methods
1. In Razorpay Dashboard, go to Settings → Configuration
2. Enable these payment methods:
   - Cards (Debit/Credit)
   - Net Banking
   - UPI
   - Wallets
   - EMI (optional)

### Step 4: Update Environment Variables
Replace the keys in your `.env` file:

```env
VITE_RAZORPAY_KEY_ID="your_actual_test_key_id"
VITE_RAZORPAY_SECRET="your_actual_secret_key"
```

### Step 5: Test Payment Methods
Use these test card details for testing:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

### Step 6: For UPI Testing
- Use any UPI ID format: `test@paytm`
- The payment will be simulated in test mode

## Current Status
- Your current key `rzp_test_1DP5mmOlF5G5ag` appears to be a demo key
- You need to replace it with your actual Razorpay test keys
- Make sure payment methods are enabled in your dashboard

## Alternative Solution (Temporary)
If you want to test the app without setting up Razorpay immediately, you can use the demo mode which simulates successful payments.