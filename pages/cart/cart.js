import { getItems, clear } from "/utils/cart";

const API_BASE = "https://your-backend.example.com";

Page({
  data: {
    items: [],
    total: 0,
  },
  onShow() {
    const items = getItems();
    const total = items.reduce((s, i) => s + i.price, 0);
    this.setData({ items, total });
  },
  checkout() {
    if (this.data.items.length === 0) return;
    my.showLoading({ content: "Creating payment..." });
    my.httpRequest({
      url: `${API_BASE}/api/payment/create`,
      method: "POST",
      headers: { "content-type": "application/json" },
      data: { items: this.data.items },
      success: (res) => {
        my.hideLoading();
        if (res.status !== 200 || !res.data || !res.data.merchantPaymentId) {
          my.alert({ title: "Error", content: "Could not start payment." });
          return;
        }
        // TODO: invoke the PayPay Mini App payment UI here with res.data.merchantPaymentId.
        // See PayPay docs: /miniapp/docs/features → "Mini Apps Payment" for the exact API
        // (likely `my.tradePay` / `my.requestPayment`-style). Once that resolves successfully,
        // call clear() and reset cart state below.
        clear();
        this.setData({ items: [], total: 0 });
        my.alert({
          title: "Payment Started",
          content: `merchantPaymentId: ${res.data.merchantPaymentId}`,
        });
      },
      fail: () => {
        my.hideLoading();
        my.alert({ title: "Network error", content: "Could not reach the server." });
      },
    });
  },
});
