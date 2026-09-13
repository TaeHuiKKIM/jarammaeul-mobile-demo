export function quote(items) {
  const subtotal = items.reduce((s, p) => s + p.price, 0);
  const discount = items.length >= 2 ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, discount, total: subtotal - discount };
}
export function available(items, sold) {
  return items.filter((p) => !sold.includes(p.id));
}
