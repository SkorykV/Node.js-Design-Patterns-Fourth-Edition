import { totalSales as totalSalesRaw } from "./totalSalesCb.js";

const CACHE_TTL = 30 * 1000; // 30 seconds TTL
const runs = new Map();
const cache = new Map();

export function totalSales(product, cb) {
  if (cache.has(product)) {
    const sum = cache.get(product);
    process.nextTick(() => {
      cb(null, sum);
    });
    return;
  }
  if (runs.has(product)) {
    const cbs = runs.get(product);
    cbs.push(cb);
    return;
  }
  runs.set(product, [cb]);
  totalSalesRaw(product, (err, sum) => {
    cache.set(product, sum);
    setTimeout(() => {
      cache.delete(product);
    }, CACHE_TTL);
    const cbs = runs.get(product);
    runs.delete(product);
    for (const cb of cbs) {
      cb(err, sum);
    }
  });
}
