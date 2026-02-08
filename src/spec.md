# Specification

## Summary
**Goal:** Fix lead form submission for logged-out users and replace the generic submission failure message with actionable, user-readable error feedback plus debug details.

**Planned changes:**
- Update the lead form submit error handling so that when `actor.createSubmission(...)` throws, the UI shows a short English error message and an optional expandable “Details” section that displays the raw error string.
- Add improved console logging on submission failure, including the full error object/string and context to help distinguish actor-creation vs network/agent vs backend trap failures.
- Fix the anonymous (not logged-in) actor configuration used by `createActorWithConfig()` / `useActor.ts` so logged-out visitors can successfully call `createSubmission(name, email, whatsapp)` in deployed builds and proceed to payment.
- Add a lightweight, non-blocking connectivity check on app load (or form mount) using an existing backend query (e.g., `getRemainingUrgencySlots()`); if it fails, show a warning banner indicating the backend may be unreachable/misconfigured.

**User-visible outcome:** Logged-out visitors can submit the lead form and proceed to the payment step; if submission fails, they see a clear error message with optional expandable technical details, and the form screen can warn them early if the backend appears unreachable.
