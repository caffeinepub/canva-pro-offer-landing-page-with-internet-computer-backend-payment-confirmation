# Specification

## Summary
**Goal:** Replace the missing payment QR asset with the user-uploaded PhonePe QR image and ensure it is available in production at the existing URL path.

**Planned changes:**
- Replace `frontend/public/assets/generated/payment-qr.dim_512x512.png` with the contents of the uploaded `image-5.png`.
- Verify the Payment Section loads the QR from `/assets/generated/payment-qr.dim_512x512.png` without triggering any image error fallback.
- Ensure the static asset is included in the deployed build and reachable at `/assets/generated/payment-qr.dim_512x512.png`.

**User-visible outcome:** When navigating to the payment step, the QR code reliably renders and can be scanned (no missing/broken image) in production.
