import { getItems, clear } from "/utils/cart";

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
    my.showLoading({ content: "Processing..." });
    setTimeout(() => {
      my.hideLoading();
      clear();
      this.setData({ items: [], total: 0 });
      my.alert({ title: "Paid", content: "Thanks for ordering with BentoPay!" });
    }, 800);
  },
});
