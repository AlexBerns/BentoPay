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
