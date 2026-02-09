/**
 * Payment Configuration
 * 
 * This is the single place to configure payment details for the Canva Pro offer.
 * Update the UPI ID in the paymentLink below with your actual UPI payment address.
 * 
 * Note: The payment QR code is stored as a static asset at:
 * frontend/public/assets/generated/payment-qr.dim_512x512.png
 * 
 * To update the QR code:
 * 1. Generate a QR code for your UPI payment link (matching the UPI ID below)
 * 2. Replace the file at: frontend/public/assets/generated/payment-qr.dim_512x512.png
 * 3. The app will automatically display your new QR code (no code changes needed)
 */

export const PAYMENT_CONFIG = {
  // UPI Payment Link - Update the 'pa' parameter with your UPI ID
  // Format: upi://pay?pa=YOUR_UPI_ID@upi&pn=PAYEE_NAME&am=AMOUNT&cu=CURRENCY
  // Current UPI ID: 9622655116@ybl
  paymentLink: 'upi://pay?pa=9622655116@ybl&pn=CanvaPro&am=299&cu=INR',
  
  // Display text for the payment amount
  amountText: '₹299',
  
  // Product description
  productDescription: '1 Year Canva Pro Subscription',
} as const;
