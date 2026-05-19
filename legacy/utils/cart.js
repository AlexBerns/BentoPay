const KEY = "bentopay.cart";

export function getItems() {
  const { data } = my.getStorageSync({ key: KEY });
  return Array.isArray(data) ? data : [];
}

export function addItem(item) {
  const items = getItems();
  items.push(item);
  my.setStorageSync({ key: KEY, data: items });
}

export function clear() {
  my.removeStorageSync({ key: KEY });
}
