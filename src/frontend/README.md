# Canva Pro Offer Landing Page

A modern, responsive landing page for selling Canva Pro subscriptions with lead capture, payment confirmation, and global urgency slots.

## Features

- **Responsive Landing Page**: Beautiful offer presentation with pricing, features, and warranty information
- **Lead Capture Form**: Collects name, email, and WhatsApp with client-side validation
- **Payment Flow**: Shows QR code and payment link after form submission
- **Payment Confirmation**: "I Have Paid" button to mark submissions as paid
- **Global Urgency Slots**: Real-time slot counter that resets automatically (3 slots → 0 → 3)
- **Admin Panel**: View all submissions with payment status and dates
- **Internet Identity**: Optional authentication for admin access

## Configuration

### Payment Settings

#### 1. Update Your UPI Payment Link

Edit `frontend/src/config/payment.ts` to configure your UPI payment details:

