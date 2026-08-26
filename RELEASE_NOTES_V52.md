# V52 — SmartCaptcha official React integration

- Replaced the hand-written SmartCaptcha widget lifecycle with Yandex's official `@yandex/smart-captcha` React package.
- Every form submission creates a fresh CAPTCHA instance; expired/failed tokens are not reused.
- The CAPTCHA remains mounted while `/api/lead` validates the one-time token.
- Added server-side diagnostics that never log the full token or secret:
  - token length
  - short SHA-256 fingerprint
  - whether client/server key prefixes belong to the same CAPTCHA
  - whether client IP was available
- Restored sending the user IP to SmartCaptcha validation, as recommended by Yandex.
- `npm run check` passes.
