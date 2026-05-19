# Legacy — native Mini App format

These files were the original BentoPay frontend in the WeChat/Alipay-style
**native Mini App format** (`app.json`, `Page({...})`, `<view>`/`<text>`
elements, `my.*` runtime APIs).

The modern PayPay Mini App is a hosted web app loaded inside the PayPay
WebView, so this format isn't what runs. The files are kept here only as
design and data reference (menu items, UI structure, page flow) while the
project is ported to Vite + Vue at the repo root.

Do not modify anything in here expecting it to load on a phone.
