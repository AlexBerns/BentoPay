# BentoPay — Timeline & Next Steps

## Where we are (2026-05-20, end of session)

Frontend has been pivoted from the **native Mini App format** (`app.json` + `Page({...})` + `my.*` APIs) to the **modern hosted web app** model that PayPay actually loads in its WebView. The Mini App is now a Vite + Vue 3 project at the repo root.

### What's in place

| Layer | Status | Notes |
|---|---|---|
| Vite + Vue 3 scaffold | ✅ done | `index.html`, `src/main.js`, `src/App.vue`, `vite.config.js` |
| PayPay SDK bundled | ✅ done | `@paypay/mini-app-js-sdk@^2.65.0` imported as `pp` in `src/App.vue` |
| `pp.init` smoke wiring | ✅ done | Coloured banner shows pending / ok / warn / error |
| `clientId` config | ✅ done | `src/config.js` (gitignored), `src/config.example.js` (committed) |
| Viewport meta per docs | ✅ done | `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` |
| Legacy native-format files | 📦 moved | `legacy/{app.json,pages,utils}` — design/data reference only |
| Backend (`server/`) | ✅ untouched | Express + OPA SDK, mints PayPay payment QRs |
| Static demo (`docs/`) | ✅ untouched | GitHub Pages mock still works |

### What was confirmed today

- ✅ `@paypay/mini-app-js-sdk` resolves from `node_modules` and imports cleanly in the browser bundle
- ✅ `pp.init({clientId, env: 'sandbox'})` runs and returns a typed result via the `fail` callback
- ✅ The end-to-end build chain works: Vite serves → Vue renders → SDK loads → init fires
- ℹ️ When viewed in a regular browser (Cursor preview, Safari, Chrome), the banner shows **`pp.init failed — SDK_NOT_INITIALIZED`**. This is the *expected* response from the SDK's auto-detect when no PayPay WebView bridge is on `window`. It's not a bug — it's the SDK truthfully reporting "I'm not running inside PayPay."

### What we deliberately did NOT do yet

- No `Content-Security-Policy` meta tag (Vite HMR fights strict CSP; revisit at production build time)
- No JWS verification on backend (`/api/payment/verify` not yet implemented)
- No CORS lock-down on backend (still using open `cors()`)
- No backend host added to PayPay whitelist (no ngrok URL yet)
- No real payment flow wired up — only init

---

## Tomorrow — the actual smoke test on a phone

This is the only thing that produces a green `pp.init → INITIALIZED` banner. Five steps, ~10 minutes if everything's already set up.

1. **Install Vue + Vite** (one-time, hasn't been run yet):
   ```sh
   npm install
   ```
2. **Start the dev server**:
   ```sh
   npm run dev          # http://localhost:5173
   ```
3. **Expose via ngrok** (separate terminal):
   ```sh
   ngrok http 5173      # gives you https://xxxx.ngrok-free.app
   ```
4. **Register the tunnel URL** in the **PayPay Developer Console** → BentoPay sandbox project → **Debug URL** field. Paste the base URL only (no trailing path). Save.
5. **Open on phone**: PayPay app → Developer Mode → BentoPay → look at the banner.

Expected outcomes:
- 🟢 `pp.init → INITIALIZED` or `TOKEN_VALID` → smoke test passed
- 🟡 `pp.init → AUTHORIZATION_NEEDED` / `TOKEN_EXPIRED` → SDK loaded, just needs auth wiring next
- 🔴 anything else → paste the code, debug from there

**Prerequisites to double-check before step 5:**
- Sandbox **test user** signed into the PayPay app on your phone (production accounts won't authenticate against `env: 'sandbox'`).
- PayPay app is the **sandbox-capable build** / Developer Mode flipped to sandbox.

---

## After smoke is green — the real work

Roughly in priority order:

### 1. Payment flow end-to-end
- [ ] Build the menu UI in Vue (port from `legacy/pages/menu/menu.html` — bento list & prices already there)
- [ ] Build the cart UI in Vue (port from `legacy/pages/cart/cart.html`) — use `localStorage` instead of `my.getStorageSync`
- [ ] Wire "Pay with PayPay" button to:
  1. `POST /api/payment/create` on backend → returns `merchantPaymentId`
  2. `pp.makePayment({amount, merchantPaymentId, requestedAt, orderItems})` from SDK → returns signed JWS
  3. `POST /api/payment/verify` (NEW backend endpoint) → verifies JWS against PayPay public key + double-checks order status via `GetCodePaymentDetails`

### 2. Backend hardening
- [ ] Add `POST /api/payment/verify` endpoint (verifies JWS)
- [ ] Lock CORS down to the ngrok origin (replace open `cors()`)
- [ ] Confirm `.env` has working sandbox OPA credentials (`PAYPAY_API_KEY`, `PAYPAY_API_SECRET`, `PAYPAY_MERCHANT_ID`)
- [ ] Expose backend via second ngrok tunnel (or share one)
- [ ] Configure frontend `API_BASE` from a Vite env var (not hard-coded)

### 3. Production-readiness
- [ ] Add a proper `Content-Security-Policy` at build time (allow `*.paypay.ne.jp`)
- [ ] Add app icons under `assets/`
- [ ] Decide: keep `docs/` GitHub Pages mock, or retire it now that the real app exists?
- [ ] Rewrite `README.md` — current text still references native Mini App format and the `.vsix` flow (both retired)

### 4. Open questions / things to look up
- [ ] Does the PayPay Developer Console accept wildcard hosts (`*.ngrok-free.app`) or does each ngrok session require re-pasting? (Affects whether a paid ngrok reserved subdomain is worth it.)
- [ ] Where's the "Debug URL" field exactly in the current Console UI — confirm the path so we don't second-guess tomorrow
- [ ] PayPay Lab / internal SoftBank docs — anything in the "Custom Mini App" section that adds constraints (CSP requirements, asset hosting, manifest hints)?

---

## Quick "pick up cold tomorrow" cheatsheet

```sh
# In Code/BentoPay
npm install
npm run dev

# In a new tab
ngrok http 5173
# → copy the https URL into PayPay Developer Console → Debug URL → Save

# On phone
# PayPay app → Developer Mode → BentoPay → check banner
```

If the banner is green, move on to porting the menu/cart UI from `legacy/` into Vue.

If the banner is anything else, paste the code into chat and we debug.
