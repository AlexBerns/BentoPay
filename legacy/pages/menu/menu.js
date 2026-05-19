import { addItem } from "/utils/cart";

Page({
  data: {
    items: [
      { id: "salmon",   emoji: "🐟", name: "Salmon Teriyaki",   desc: "Glazed Atlantic salmon over rice",   price: 980  },
      { id: "karaage",  emoji: "🍗", name: "Chicken Karaage",   desc: "Japanese fried chicken, tartare",    price: 880  },
      { id: "tonkatsu", emoji: "🍖", name: "Tonkatsu",          desc: "Panko-crusted pork cutlet",          price: 1080 },
      { id: "sukiyaki", emoji: "🥩", name: "Beef Sukiyaki",     desc: "Thin-sliced wagyu in sweet soy",     price: 1280 },
      { id: "unagi",    emoji: "🍣", name: "Unagi",             desc: "Grilled eel, kabayaki sauce",        price: 1480 },
      { id: "tempura",  emoji: "🥬", name: "Veggie Tempura",    desc: "Seasonal vegetables, lightly fried", price: 880  },
    ],
  },
  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.items.find(i => i.id === id);
    addItem(item);
    my.showToast({ content: `${item.name} added`, type: "success" });
  },
});
