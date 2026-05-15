Page({
  data: {
    featured: [
      { id: "matcha",     name: "Matcha",          price: 480, emoji: "🍵" },
      { id: "strawberry", name: "Strawberry",      price: 460, emoji: "🍓" },
      { id: "vanilla",    name: "Vanilla Classic", price: 420, emoji: "🍦" },
    ],
  },
  openMenu() {
    my.switchTab({ url: "/pages/menu/menu" });
  },
});
