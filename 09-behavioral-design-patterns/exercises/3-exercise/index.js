import { WarehouseItem } from "./warehouse-item.js";

const item = new WarehouseItem("567", "arriving");
console.log(item.describe());
item.store("1ZH3");
console.log(item.describe());
try {
  item.store("2BR2");
} catch (error) {
  console.log(error.message);
}
item.deliver("John Smith, 1st Avenue, New York");
console.log(item.describe());
try {
  item.store("1ZH3");
} catch (error) {
  console.log(error.message);
}
try {
  item.deliver("Frodo Begins, Shire");
} catch (error) {
  console.log(error.message);
}
console.log("-----------------------");
const storedItem = new WarehouseItem("123", "stored", "5PK1");
console.log(storedItem.describe());

console.log("-----------------------");
const deliveredItem = new WarehouseItem(
  "777",
  "delivered",
  "Frodo Begins, Shire",
);
console.log(deliveredItem.describe());
