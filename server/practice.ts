const orders = [
  { id: 1, total: 500 },
  { id: 3, total: 150 },
];

const items = [
  { id: 101, orderId: 1, product: "Cake" },
  { id: 102, orderId: 1, product: "Candles" },
  { id: 104, orderId: 3, product: "Brownie" },
];

const itemsByOrder = new Map<number, typeof items>();


for(const item of items){
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
}
console.log(itemsByOrder);

