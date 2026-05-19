import pp from "@paypay/mini-app-js-sdk";
import { CLIENT_ID, ENV } from "./config";

Page({
  data: {
    featured: [
      { id: "salmon",  name: "Salmon Teriyaki", price: 980,  emoji: "🐟" },
      { id: "karaage", name: "Chicken Karaage", price: 880,  emoji: "🍗" },
      { id: "unagi",   name: "Unagi",           price: 1480, emoji: "🍣" },
    ],
    initState: "pending",     // pending | ok | warn | error
    initMessage: "Initializing PayPay SDK…",
  },
  onLoad() {
    if (!CLIENT_ID || CLIENT_ID === "PASTE_YOUR_SANDBOX_CLIENT_ID_HERE") {
      this.setData({
        initState: "error",
        initMessage: "No clientId set — paste it into pages/index/config.js",
      });
      return;
    }
    try {
      pp.init({
        clientId: CLIENT_ID,
        env: ENV,
        success: (res) => {
          const code = (res && res.statusCode) || "OK";
          const ok = code === "INITIALIZED" || code === "TOKEN_VALID";
          this.setData({
            initState: ok ? "ok" : "warn",
            initMessage: `pp.init → ${code}`,
          });
        },
        fail: (err) => {
          const code = (err && (err.errorCode || err.statusCode)) || "unknown";
          this.setData({
            initState: "error",
            initMessage: `pp.init failed — ${code}`,
          });
        },
      });
    } catch (e) {
      this.setData({
        initState: "error",
        initMessage: `SDK threw — ${e && e.message ? e.message : e}`,
      });
    }
  },
  openMenu() {
    my.switchTab({ url: "/pages/menu/menu" });
  },
});
