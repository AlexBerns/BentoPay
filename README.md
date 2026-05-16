# BentoPay

A PayPay Mini App for ordering bento boxes, paid via PayPay.

## 🍱 Live Demo

[**Try the interactive preview**](https://alexberns.github.io/BentoPay/) — works on any device, no install needed.

The demo is a static visual mock of the mini app: tabs, add-to-cart, and checkout
all work, but the PayPay payment flow is simulated. The real runtime requires the
PayPay DevTool simulator (`paypay-devtool.vsix`), available to registered Mini App
merchants.

## Structure

- `app.json` — mini app config (pages, window, tabBar, whitelist)
- `pages/` — `index`, `menu`, `cart` screens (PayPay Mini App templates)
- `utils/` — shared frontend helpers
- `server/` — Node backend that mints PayPay payments via the OPA SDK
- `docs/` — what GitHub Pages serves (the interactive preview)

## Running against the PayPay sandbox

1. Get OPA credentials (API key, secret, merchant ID) from the PayPay for
   Developers portal. The sandbox endpoint is `api-sandbox.paypay.ne.jp`.
2. Copy the env template and fill it in:
   ```
   cp server/.env.example server/.env
   # edit server/.env — never commit this file
   ```
3. Install and run the backend:
   ```
   cd server
   npm install
   npm run dev   # starts on http://localhost:3000
   ```
4. Smoke-test the server:
   ```
   curl http://localhost:3000/health
   ```
5. Point the Mini App at the backend by editing `API_BASE` in
   `pages/cart/cart.js`. For real device testing, expose the local server with
   `ngrok http 3000` and use the public URL — PayPay's runtime cannot call
   `localhost`.
6. Open the project in PayPay DevTool (`paypay-devtool.vsix`) and approve the
   payment in the sandbox PayPay app on your phone.

## What works without the PayPay DevTool

The DevTool VS Code extension is the only official way to upload code as a
real Mini App and have it appear as a tile inside the PayPay sandbox app.
Without it, the following still works:

| Task | Possible without DevTool? |
|---|---|
| Write the mini app code (`app.json`, pages, utils) | ✅ Yes — already in this repo |
| Run a fake browser preview (`docs/index.html`) | ✅ Yes — handy for design, not real |
| Preview it as a real Mini App in a simulator | ❌ No — simulator lives in the DevTool |
| Upload it to PayPay so it becomes a tile in the sandbox app | ❌ No — upload endpoint is proprietary |
| Mint payments via the OPA API | ✅ Yes — see `server/` |
| Have the phone scan a kiosk QR and approve in PayPay sandbox | ✅ Yes — see `/kiosk` route |

## Upcoming tasks

- [ ] **Request the PayPay DevTool extension** (`paypay-devtool.vsix`) from
      PayPay developer support. Required to preview the mini app in a real
      simulator and to upload the bundle to PayPay's sandbox.
- [ ] **Request a Mini App ID** for sandbox in the PayPay for Developers
      portal (separate from the OPA API key). The DevTool uploads bundles
      against a Mini App ID.
- [ ] **Read PayPay's official Mini App documentation** end-to-end before
      writing any more mini app screens — in particular the design
      guidelines, supported `my.*` APIs, navigation patterns, and review
      criteria. Building against the framework's actual rules now saves a
      rewrite later.
- [ ] **Build the real Mini App** once the DevTool and Mini App ID are in
      hand: port the kiosk-scan flow into a proper `my.scanCode` page,
      wire up the Locations tab, and submit to sandbox review.
