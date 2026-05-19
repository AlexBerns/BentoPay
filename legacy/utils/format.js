export function yen(amount) {
  return `¥${Number(amount).toLocaleString("ja-JP")}`;
}
