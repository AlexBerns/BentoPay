Page({
  data: {
    featured: [
      { id: "salmon",  name: "Salmon Teriyaki", price: 980,  emoji: "🐟" },
      { id: "karaage", name: "Chicken Karaage", price: 880,  emoji: "🍗" },
      { id: "unagi",   name: "Unagi",           price: 1480, emoji: "🍣" },
    ],
  },
  openMenu() {
    my.switchTab({ url: "/pages/menu/menu" });
  },
});
