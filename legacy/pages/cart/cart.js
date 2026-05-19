import { getItems, clear } from "/utils/cart";

// Override with your backend URL. For local sandbox testing point at the
// machine running `npm run dev` in /server (e.g. an ngrok tunnel).
const API_BASE = "https://your-backend.example.com";

Page({
  data: {
    items: [],
    total: 0,
    paying: false,
  },
  onShow() {
    const items = getItems();
    const total = items.reduce((s, i) => s + i.price, 0);
    this.setData({ items, total });
  },
  checkout() {
    if (this.data.paying || this.data.items.length === 0) return;
    this.setData({ paying: true });
    my.showLoading({ content: "Creating payment..." });

    my.httpRequest({
      url: `${API_BASE}/api/payment/create`,
      method: "POST",
      headers: { "content-type": "application/json" },
      data: { items: this.data.items },
      success: (res) => {
        my.hideLoading();
        if (res.status !== 200 || !res.data || !res.data.merchantPaymentId) {
          this.setData({ paying: false });
          my.alert({
            title: "Could not start payment",
            content: (res.data && res.data.error) || `HTTP ${res.status}`,
          });
          return;
        }
        this.invokePayPay(res.data);
      },
      fail: () => {
        my.hideLoading();
        this.setData({ paying: false });
        my.alert({ title: "Network error", content: "Could not reach the server." });
      },
    });
  },

  invokePayPay({ merchantPaymentId, url, deeplink }) {
    // PayPay Mini App SDK exposes `my.tradePay` for in-app payment. Confirm the
    // exact field name in your PayPay Mini App docs — historically it has been
    // `orderStr`, `tradeNO`, or `paymentUrl` depending on SDK version.
    const orderStr = deeplink || url || merchantPaymentId;

    my.tradePay({
      orderStr,
      success: () => this.onPaid(merchantPaymentId),
      fail: (err) => {
        this.setData({ paying: false });
        my.alert({
          title: "Payment cancelled",
          content: (err && err.errorMessage) || "PayPay payment did not complete.",
        });
      },
    });
  },

  onPaid(merchantPaymentId) {
    // Verify server-side that PayPay actually marked it COMPLETED before
    // clearing the cart — the client-side success callback alone isn't enough.
    my.httpRequest({
      url: `${API_BASE}/api/payment/${merchantPaymentId}`,
      method: "GET",
      success: (res) => {
        const status = res.data && res.data.status;
        if (res.status === 200 && status === "COMPLETED") {
          clear();
          this.setData({ items: [], total: 0, paying: false });
          my.alert({ title: "Payment successful", content: "Thanks for your order!" });
        } else {
          this.setData({ paying: false });
          my.alert({
            title: "Payment pending",
            content: `Status: ${status || "unknown"}. Refresh shortly.`,
          });
        }
      },
      fail: () => {
        this.setData({ paying: false });
        my.alert({ title: "Could not verify payment", content: "Please contact support." });
      },
    });
  },
});
