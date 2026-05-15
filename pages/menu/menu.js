import { addItem } from "/utils/cart";

Page({
  data: {
    items: [
      { id: "vanilla",    emoji: "🍦", name: "Vanilla Classic", desc: "Madagascar vanilla bean",     price: 420 },
      { id: "matcha",     emoji: "🍵", name: "Uji Matcha",      desc: "Stone-ground from Kyoto",     price: 480 },
      { id: "strawberry", emoji: "🍓", name: "Strawberry",      desc: "Tochiotome strawberries",     price: 460 },
      { id: "chocolate",  emoji: "🍫", name: "Dark Chocolate",  desc: "70% single-origin cacao",     price: 460 },
      { id: "yuzu",       emoji: "🍋", name: "Yuzu Sorbet",     desc: "Bright, citrus, dairy-free",  price: 440 },
      { id: "houjicha",   emoji: "🍂", name: "Houjicha",        desc: "Roasted green tea cream",     price: 480 },
    ],
  },
  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.items.find(i => i.id === id);
    addItem(item);
    my.showToast({ content: `${item.name} added`, type: "success" });
  },
});
