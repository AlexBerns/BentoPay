import { addItem } from "/utils/cart";

Page({
  data: {
    items: [
      { id: "salmon",   name: "Salmon Bento",   price: 980 },
      { id: "chicken",  name: "Chicken Bento",  price: 880 },
      { id: "veggie",   name: "Veggie Bento",   price: 780 },
    ],
  },
  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.items.find(i => i.id === id);
    addItem(item);
    my.showToast({ content: `${item.name} added`, type: "success" });
  },
});
