# Specification

## Summary
**Goal:** Update the payment experience by swapping in the provided QR code, simplifying the header by removing the login/logout control, and showing a specific post-payment confirmation message.

**Planned changes:**
- Replace the existing payment QR static asset at `/assets/generated/payment-qr.dim_512x512.png` with the uploaded QR image (no path or backend changes).
- Remove the Login/Logout icon/button from the landing page header in `frontend/src/App.tsx` while keeping the rest of the page layout intact.
- Update `frontend/src/components/PaymentConfirmation.tsx` to prominently display the exact confirmation message: “You will get access within 10 mins after checking your payment details” after the “I Have Paid” action.

**User-visible outcome:** Users see the new QR code in the payment section, no longer see a login/logout control in the header, and after clicking “I Have Paid” they see the specified 10-minute access confirmation message.
